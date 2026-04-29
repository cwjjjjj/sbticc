import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2026-02-25.clover',
});

function compactString(value, max = 1200) {
  if (typeof value !== 'string') return '';
  return value.replace(/\s+/g, ' ').trim().slice(0, max);
}

function compactRecord(record, maxEntries = 24) {
  if (!record || typeof record !== 'object') return {};
  return Object.fromEntries(
    Object.entries(record)
      .slice(0, maxEntries)
      .map(([key, value]) => [String(key).slice(0, 40), String(value).slice(0, 120)]),
  );
}

function extractOutputText(data) {
  return data?.choices?.[0]?.message?.content?.trim() || '';
}

const DEEPSEEK_MODEL = 'deepseek-v4-flash';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Missing DEEPSEEK_API_KEY' });
  }

  const body = req.body || {};
  const sessionId = body.session_id;
  if (!sessionId || typeof sessionId !== 'string') {
    return res.status(400).json({ error: 'Missing session_id' });
  }

  let session;
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId);
  } catch {
    return res.status(400).json({ error: 'Invalid payment session' });
  }

  if (session.payment_status !== 'paid' || session.metadata?.feature !== 'ai_report') {
    return res.status(402).json({ error: 'AI report payment required' });
  }

  const result = body.result || {};
  const dimensions = Array.isArray(body.dimensions) ? body.dimensions.slice(0, 24) : [];
  const payload = {
    testName: compactString(body.testName, 80),
    testId: compactString(body.testId, 40),
    typeCode: compactString(result.typeCode, 40),
    typeName: compactString(result.typeName, 80),
    intro: compactString(result.intro, 280),
    baseDescription: compactString(result.description, 1800),
    levels: compactRecord(result.levels),
    rawScores: compactRecord(result.rawScores),
    dimensions: dimensions.map((item) => ({
      key: compactString(item.key, 40),
      name: compactString(item.name, 80),
      level: compactString(item.level, 20),
      score: compactString(item.score, 40),
      explanation: compactString(item.explanation, 320),
    })),
  };

  const instructions = [
    '你是中文人格测试网站的付费 AI 解读撰写助手。',
    '你的任务：只根据用户提交的人格测试结果，写一份比基础报告更具体、更像写给本人看的中文深度解读。',
    '写作风格：中文互联网语感，具体、锐利、有一点幽默，但要克制；不要空泛鸡汤，不要重复原始描述。',
    '安全边界：不得辱骂用户；不得给出医学、心理疾病、法律、财务、职业命运等确定性诊断或承诺。',
    '必须明确说明：这是一份娱乐性人格解读，不是专业心理诊断。',
    '如果数据不足，不要编造经历，只能用“可能”“更像是”“容易表现为”等概率表达。',
    '输出 700-1000 字，使用 Markdown 小标题，不要输出 JSON。',
    '结构必须包含：一句总评、核心性格机制、关系/社交中的表现、压力下的盲区、三个可执行建议、娱乐免责声明。',
  ].join('\n');

  const userPrompt = [
    '请根据以下人格测试数据生成付费 AI 深度解读。',
    '要求每一段都要引用或回应至少一个具体数据点，例如类型、维度等级、分数或维度解释。',
    '不要说“根据你提供的数据”这种套话，直接开始报告。',
    '',
    JSON.stringify(payload, null, 2),
  ].join('\n');

  try {
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: DEEPSEEK_MODEL,
        messages: [
          { role: 'system', content: instructions },
          { role: 'user', content: userPrompt },
        ],
        thinking: { type: 'disabled' },
        temperature: 0.85,
        max_tokens: 1800,
        stream: false,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error?.message || 'AI report generation failed',
      });
    }

    const report = extractOutputText(data);
    if (!report) {
      return res.status(502).json({ error: 'Empty AI report' });
    }

    return res.status(200).json({ report });
  } catch (err) {
    return res.status(500).json({ error: err && err.message ? err.message : 'AI request failed' });
  }
}
