import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const realOnly = req.query.real === '1';
  const test = req.query.test || '';
  const prefix = test ? `${test}:` : 'sbti:';

  const [data, total, mockTotal, mockData] = await Promise.all([
    redis.zrange(`${prefix}ranking`, 0, -1, { rev: true, withScores: true }),
    redis.get(`${prefix}total`),
    redis.get(`${prefix}mock_total`),
    redis.hgetall(`${prefix}mock`),
  ]);

  const mock = mockData || {};
  const mockTotalNum = Number(mockTotal) || 0;

  const list = [];
  for (let i = 0; i < data.length; i += 2) {
    const code = data[i];
    const rawCount = Number(data[i + 1]);
    const mockCount = Number(mock[code]) || 0;
    const count = realOnly ? Math.max(0, rawCount - mockCount) : rawCount;
    if (count > 0 || !realOnly) {
      list.push({ code, count });
    }
  }

  // Re-sort after subtracting mock
  if (realOnly) {
    list.sort((a, b) => b.count - a.count);
  }

  const finalTotal = realOnly ? Math.max(0, Number(total) - mockTotalNum) : Number(total);

  res.setHeader('Cache-Control', 's-maxage=10, stale-while-revalidate=30');
  res.status(200).json({ total: finalTotal, list, hasMock: mockTotalNum > 0, mockTotal: mockTotalNum });
}
