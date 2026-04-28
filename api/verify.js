import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2026-02-25.clover',
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  var sessionId = req.body && req.body.session_id;
  if (!sessionId || typeof sessionId !== 'string') {
    return res.status(400).json({ error: 'Missing session_id' });
  }

  try {
    var session = await stripe.checkout.sessions.retrieve(sessionId);
    var paid = session.payment_status === 'paid';
    res.status(200).json({
      paid: paid,
      feature: session.metadata && session.metadata.feature,
      testId: session.metadata && session.metadata.testId,
      typeCode: session.metadata && session.metadata.typeCode,
    });
  } catch (err) {
    res.status(400).json({ paid: false, error: 'Invalid session' });
  }
}
