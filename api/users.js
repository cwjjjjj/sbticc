import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const [deviceCount, total, mockTotal] = await Promise.all([
    redis.scard('sbti:devices'),
    redis.get('sbti:total'),
    redis.get('sbti:mock_total'),
  ]);

  const totalNum = Number(total) || 0;
  const mockNum = Number(mockTotal) || 0;
  const realTests = totalNum - mockNum;

  res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=60');
  res.status(200).json({
    uniqueDevices: deviceCount || 0,
    totalTests: totalNum,
    realTests: realTests,
    mockTests: mockNum,
    avgTestsPerDevice: deviceCount > 0 ? (realTests / deviceCount).toFixed(1) : 0
  });
}
