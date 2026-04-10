import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const data = await redis.zrange('sbti:ranking', 0, -1, { rev: true, withScores: true });
  const total = (await redis.get('sbti:total')) || 0;

  // data 格式: [member, score, member, score, ...]
  const list = [];
  for (let i = 0; i < data.length; i += 2) {
    list.push({ code: data[i], count: Number(data[i + 1]) });
  }

  res.setHeader('Cache-Control', 's-maxage=10, stale-while-revalidate=30');
  res.status(200).json({ total: Number(total), list });
}
