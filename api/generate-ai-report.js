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
  if (typeof data.output_text === 'string' && data.output_text.trim()) {
    return data.output_text.trim();
  }

  const chunks = [];
  for (const item of data.output || []) {
    for (const content of item.content || []) {
      if (content.type === 'output_text' && content.text) chunks.push(content.text);
      if (typeof content.text === 'string') chunks.push(content.text);
    }
  }
  return chunks.join('\n').trim();
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Missing OPENAI_API_KEY' });
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
    '你是中文人格测试网站的报告撰写助手。',
    '根据用户的人格测试结果，生成一份更具体、更像给本人看的中文深度解读。',
    '语气可以锋利、幽默、具体，但不要辱骂，不要做医学、心理疾病、法律、财务诊断。',
    '必须明确这是娱乐性人格解读，不是专业诊断。',
    '输出 700-1100 字，使用 Markdown 小标题。',
    '结构：一句总评、核心性格机制、关系/社交中的表现、压力下的盲区、三个可执行建议、娱乐免责声明。',
  ].join('\n');

  try {
    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-5-mini',
        instructions,
        input: JSON.stringify(payload),
        max_output_tokens: 1800,
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
