import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2026-02-25.clover',
});

function cleanReturnPath(value) {
  if (!value || typeof value !== 'string') return '/';
  if (!value.startsWith('/')) return '/';
  if (value.startsWith('//')) return '/';
  return value.slice(0, 300);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  var origin = req.headers.origin || req.headers.referer || 'https://test.jiligulu.xyz';
  origin = origin.replace(/\/$/, '');
  var body = req.body || {};
  var feature = body.feature === 'ai_report' ? 'ai_report' : 'paid_report';
  var testId = typeof body.testId === 'string' ? body.testId.slice(0, 40) : '';
  var typeCode = typeof body.typeCode === 'string' ? body.typeCode.slice(0, 40) : '';
  var returnPath = cleanReturnPath(body.returnPath);
  var successParam = feature === 'ai_report' ? 'ai_paid=1' : 'paid=1';
  var successUrl = origin + returnPath + (returnPath.includes('?') ? '&' : '?') +
    successParam + '&session_id={CHECKOUT_SESSION_ID}#ai-report';
  var cancelUrl = origin + returnPath + '#ai-report-cancelled';

  var lineItem;
  if (feature === 'ai_report' && process.env.STRIPE_AI_REPORT_PRICE_ID) {
    lineItem = { price: process.env.STRIPE_AI_REPORT_PRICE_ID, quantity: 1 };
  } else if (process.env.STRIPE_PRICE_ID) {
    lineItem = { price: process.env.STRIPE_PRICE_ID, quantity: 1 };
  } else {
    lineItem = {
      price_data: {
        currency: process.env.STRIPE_AI_REPORT_CURRENCY || 'cny',
        product_data: {
          name: feature === 'ai_report' ? 'AI 深度人格解读' : '完整人格报告',
          description: '一次性解锁',
        },
        unit_amount: Number(process.env.STRIPE_AI_REPORT_AMOUNT || 199),
      },
      quantity: 1,
    };
  }

  try {
    var session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [lineItem],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        feature,
        testId,
        typeCode,
      },
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
