import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

const VALID_TYPES_BY_TEST = {
  '': new Set([
    'CTRL','OJBK','THAN-K','FAKE','SEXY','MALO','Dior-s','MUM','ZZZZ',
    'LOVE-R','IMSB','SOLO','FUCK','GOGO','JOKE-R','OH-NO','MONK','SHIT',
    'DEAD','ATM-er','THIN-K','WOC!','IMFW','POOR','BOSS','HHHH','DRUNK'
  ]),
  'love': new Set([
    'BAMR','BAMP','BADR','BADP','BWMR','BWMP','BWDR','BWDP',
    'HAMR','HAMP','HADR','HADP','HWMR','HWMP','HWDR','HWDP','EX'
  ]),
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { type, test = '' } = req.body || {};
  const validTypes = VALID_TYPES_BY_TEST[test];
  if (!type || !validTypes || !validTypes.has(type)) {
    return res.status(400).json({ error: 'Invalid type' });
  }

  const prefix = test ? `${test}:` : 'sbti:';

  // Device fingerprint: IP + UA prefix
  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  const ua = req.headers['user-agent'] || '';
  const deviceId = Buffer.from(ip + '|' + ua.substring(0, 50)).toString('base64').substring(0, 32);

  const pipeline = redis.pipeline();
  pipeline.zincrby(`${prefix}ranking`, 1, type);
  pipeline.incr(`${prefix}total`);
  pipeline.sadd(`${prefix}devices`, deviceId);
  pipeline.hset(`${prefix}device_results`, {
    [deviceId]: JSON.stringify({ type, time: Date.now() })
  });

  const results = await pipeline.exec();

  res.status(200).json({ ok: true, total: results[1] });
}
