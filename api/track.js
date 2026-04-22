import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

// Allowed event names — anything outside this set is dropped silently
const ALLOWED_EVENTS = new Set([
  'home_view',
  'test_click',
  'hero_view',
  'quiz_start',
  'quiz_q',
  'quiz_complete',
  'result_view',
  'share_click',
  'article_click',
]);

// Normalize props to a stable key: event_name or event_name:k=v:k=v (alphabetical)
function eventKey(name, props) {
  if (!props || typeof props !== 'object') return name;
  const entries = Object.entries(props)
    .filter(([_, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => [String(k), String(v).slice(0, 64)])
    .sort(([a], [b]) => a.localeCompare(b));
  if (entries.length === 0) return name;
  return name + ':' + entries.map(([k, v]) => `${k}=${v}`).join(':');
}

function todayKey() {
  const d = new Date();
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function headerValue(req, name) {
  const raw = req.headers[name];
  if (Array.isArray(raw)) return raw[0] || '';
  return raw || '';
}

function requestContext(req) {
  const country = headerValue(req, 'x-vercel-ip-country') || headerValue(req, 'cf-ipcountry') || 'unknown';
  return {
    country: String(country).slice(0, 16),
  };
}

export default async function handler(req, res) {
  // CORS for sendBeacon from the deployed domain (not strictly needed same-origin, but harmless)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = req.body || {};
  const { event, props } = body;
  if (!event || typeof event !== 'string' || !ALLOWED_EVENTS.has(event)) {
    // Silent success to avoid leaking schema; drop unknown events
    return res.status(204).end();
  }

  const key = eventKey(event, { ...requestContext(req), ...(props || {}) });
  const day = todayKey();

  try {
    const pipeline = redis.pipeline();
    pipeline.hincrby(`track:daily:${day}`, key, 1);
    pipeline.incr(`track:total:${key}`);
    // Keep a set of active event keys per day for fast iteration
    pipeline.sadd(`track:keys:${day}`, key);
    // Retain 30 days automatically via key expiry
    pipeline.expire(`track:daily:${day}`, 60 * 60 * 24 * 45);
    pipeline.expire(`track:keys:${day}`, 60 * 60 * 24 * 45);
    await pipeline.exec();
  } catch (e) {
    // Never fail the client on analytics
    return res.status(204).end();
  }

  return res.status(204).end();
}
