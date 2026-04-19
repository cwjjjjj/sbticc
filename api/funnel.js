import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

function dayKey(offsetDays = 0) {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - offsetDays);
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const adminKey = process.env.ADMIN_KEY;
  const providedKey = (req.query && req.query.key) || '';
  if (!adminKey || providedKey !== adminKey) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const days = Math.min(Math.max(parseInt(req.query.days, 10) || 7, 1), 30);

  const dayKeys = Array.from({ length: days }, (_, i) => dayKey(i));

  try {
    const pipeline = redis.pipeline();
    for (const d of dayKeys) {
      pipeline.hgetall(`track:daily:${d}`);
    }
    const raw = await pipeline.exec();

    const result = dayKeys.map((d, i) => ({
      date: d,
      events: raw[i] || {},
    }));

    // Aggregate totals across range
    const totals = {};
    for (const { events } of result) {
      for (const [k, v] of Object.entries(events)) {
        totals[k] = (totals[k] || 0) + Number(v);
      }
    }

    return res.status(200).json({ days: result, totals });
  } catch (e) {
    return res.status(500).json({ error: String(e && e.message) });
  }
}
