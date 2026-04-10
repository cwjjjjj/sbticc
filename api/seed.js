import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

// Based on 1M Monte Carlo simulation rarity percentages
const RARITY = {
  "OJBK": 9.875, "THAN-K": 7.952, "FAKE": 6.706, "SEXY": 5.908,
  "MALO": 5.892, "Dior-s": 5.250, "MUM": 5.200, "ZZZZ": 4.678,
  "LOVE-R": 4.222, "IMSB": 4.202, "CTRL": 3.737, "SOLO": 3.647,
  "FUCK": 3.425, "GOGO": 3.087, "JOKE-R": 3.034, "OH-NO": 2.991,
  "MONK": 2.930, "SHIT": 2.560, "DEAD": 2.451, "ATM-er": 2.447,
  "THIN-K": 2.316, "WOC!": 2.080, "IMFW": 2.071, "POOR": 1.714,
  "BOSS": 1.576, "HHHH": 0.050, "DRUNK": 0.026,
};

const MOCK_TOTAL = 100000;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Simple auth guard
  const { secret } = req.body || {};
  if (secret !== process.env.SEED_SECRET && secret !== 'sbti-seed-2026') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const pipeline = redis.pipeline();

  // Calculate counts per type, with small random jitter for realism
  const mockCounts = {};
  let assignedTotal = 0;

  const types = Object.keys(RARITY);
  types.forEach((code, i) => {
    if (i === types.length - 1) {
      // Last type gets the remainder
      mockCounts[code] = MOCK_TOTAL - assignedTotal;
    } else {
      const base = Math.round(MOCK_TOTAL * RARITY[code] / 100);
      // Add ±3% jitter
      const jitter = Math.round(base * (Math.random() * 0.06 - 0.03));
      const count = Math.max(1, base + jitter);
      mockCounts[code] = count;
      assignedTotal += count;
    }
  });

  // Write mock data to ranking sorted set and record mock amounts separately
  for (const [code, count] of Object.entries(mockCounts)) {
    pipeline.zincrby('sbti:ranking', count, code);
    // Record mock amounts so we can subtract them later
    pipeline.hset('sbti:mock', { [code]: count });
  }

  // Update total and record mock total
  pipeline.incrby('sbti:total', MOCK_TOTAL);
  pipeline.set('sbti:mock_total', MOCK_TOTAL);

  await pipeline.exec();

  res.status(200).json({
    ok: true,
    message: `Seeded ${MOCK_TOTAL} mock records`,
    counts: mockCounts,
    note: 'Mock data stored in sbti:mock (hash) and sbti:mock_total (string). To get real-only data, subtract these values.'
  });
}
