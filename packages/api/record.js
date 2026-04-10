import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

const VALID_TYPES = new Set([
  'CTRL','OJBK','THAN-K','FAKE','SEXY','MALO','Dior-s','MUM','ZZZZ',
  'LOVE-R','IMSB','SOLO','FUCK','GOGO','JOKE-R','OH-NO','MONK','SHIT',
  'DEAD','ATM-er','THIN-K','WOC!','IMFW','POOR','BOSS','HHHH','DRUNK'
]);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { type } = req.body || {};
  if (!type || !VALID_TYPES.has(type)) {
    return res.status(400).json({ error: 'Invalid type' });
  }

  await redis.zincrby('sbti:ranking', 1, type);
  const total = await redis.incr('sbti:total');

  res.status(200).json({ ok: true, total });
}
