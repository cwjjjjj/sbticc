import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  var origin = req.headers.origin || req.headers.referer || 'https://sbti.jiligulu.xyz';
  origin = origin.replace(/\/$/, '');

  try {
    var session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{
        price: process.env.STRIPE_PRICE_ID,
        quantity: 1,
      }],
      success_url: origin + '?paid=1&session_id={CHECKOUT_SESSION_ID}#result-paid',
      cancel_url: origin + '#result-cancelled',
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
