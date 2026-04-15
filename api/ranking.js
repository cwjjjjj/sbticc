import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

const MOCK_TOTAL = 100000;

const MOCK_TYPES_BY_TEST = {
  '': [
    'CTRL','OJBK','THAN-K','FAKE','SEXY','MALO','Dior-s','MUM','ZZZZ',
    'LOVE-R','IMSB','SOLO','FUCK','GOGO','JOKE-R','OH-NO','MONK','SHIT',
    'DEAD','ATM-er','THIN-K','WOC!','IMFW','POOR','BOSS','HHHH','DRUNK',
  ],
  love: [
    'HAMRLC','BWDPFV','HAMRFC','BAMPFV','HWMRLV','BADPLC','HADRPC','HWDPLV',
    'BAMRLV','HWMRFC','BADRLC','HWDRLC','HAMPLC','BWMRFC','HADPFC','BWDRLV',
    'HAMDLC','BWMPLC','HAWRLC','HADRLV','EX',
  ],
  work: [
    'NJYDJ','MYZSN','BGXIA','HSGJI','PUASH','GUANX','TXDGR','CYFNG',
    'FXLYT','SGYSJ','JWFDY','FWZZZ','MSFCI','ZCHLI','DGPSA','ZQJQI',
    'KLXYU','ZDDSH','TPXFG','ZCPNZ','996',
  ],
  values: [
    'CHUANG','NOREUR','SHOUHU','MOMAHU','XIAOSA','GAOFEI','JIZHUA','KUAIFE',
    'JIUPIN','WENZHU','MOGUI','JUANZH','RUNXUE','DULANR','QINGXN','GANGJN',
    'FOXIAN','CUNGOU','KAOGON','JIAOQI','MLC',
  ],
  cyber: [
    'KBKING','COCOON','HERMIT','ACTRES','MELONX','MOUTHX','PICKLE','BOMBER',
    'ZOMBIE','NPCNPC','ZENZEN','WRITER','JUDGEX','HOARDE','TROLLX','BLACKH',
    'IDEALI','FENCER','JELLYF','RENASC','BOT',
  ],
  desire: [
    'SOPFEH','SOBFEH','SOBFER','SOPGLH','SOPGLR','MCBGLR','MCPGLR','MOBFEH',
    'MOBFER','MCBFER','SCPFEH','SCPGLH','SOBGLH','MCPFEH','MOBGLH','MCBGLH',
    'SOPFER','MCPGLH','SOBGLR','MCBFEH','XXX',
  ],
};

const HIDDEN_TYPE_BY_TEST = {
  '': 'DRUNK',
  love: 'EX',
  work: '996',
  values: 'MLC',
  cyber: 'BOT',
  desire: 'XXX',
};

function hashString(input) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed) {
  return function next() {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildMockCounts(test) {
  const key = Object.prototype.hasOwnProperty.call(MOCK_TYPES_BY_TEST, test) ? test : '';
  const codes = MOCK_TYPES_BY_TEST[key];
  const hiddenType = HIDDEN_TYPE_BY_TEST[key];
  const rng = mulberry32(hashString(`sbti:${key || 'main'}:mock-v1`));
  const weighted = codes.map((code) => {
    const hidden = code === hiddenType;
    const weight = hidden ? 0.12 + rng() * 0.35 : 2 + rng() * 8;
    return { code, weight, count: 0, frac: 0 };
  });

  const totalWeight = weighted.reduce((sum, item) => sum + item.weight, 0);
  let assigned = 0;
  weighted.forEach((item) => {
    const exact = (MOCK_TOTAL * item.weight) / totalWeight;
    item.count = Math.floor(exact);
    item.frac = exact - item.count;
    assigned += item.count;
  });

  let remainder = MOCK_TOTAL - assigned;
  weighted
    .slice()
    .sort((a, b) => b.frac - a.frac)
    .forEach((item) => {
      if (remainder <= 0) return;
      item.count += 1;
      remainder -= 1;
    });

  return Object.fromEntries(weighted.map(({ code, count }) => [code, count]));
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const realOnly = req.query.real === '1';
  const test = req.query.test || '';
  const testKey = Object.prototype.hasOwnProperty.call(MOCK_TYPES_BY_TEST, test) ? test : '';
  const validCodes = new Set(MOCK_TYPES_BY_TEST[testKey]);
  const prefix = test ? `${test}:` : 'sbti:';

  const [data, total, mockTotal, mockData] = await Promise.all([
    redis.zrange(`${prefix}ranking`, 0, -1, { rev: true, withScores: true }),
    redis.get(`${prefix}total`),
    redis.get(`${prefix}mock_total`),
    redis.hgetall(`${prefix}mock`),
  ]);

  const mock = mockData || {};
  const mockTotalNum = Number(mockTotal) || 0;
  const builtinMock = !realOnly && mockTotalNum <= 0 ? buildMockCounts(test) : {};
  const builtinMockTotal = Object.values(builtinMock).reduce((sum, count) => sum + count, 0);
  const countsByCode = new Map();

  for (let i = 0; i < data.length; i += 2) {
    const code = data[i];
    if (!validCodes.has(code)) continue;
    const rawCount = Number(data[i + 1]);
    const mockCount = Number(mock[code]) || 0;
    const count = realOnly ? Math.max(0, rawCount - mockCount) : rawCount;
    if (count > 0 || (!realOnly && rawCount > 0)) {
      countsByCode.set(code, (countsByCode.get(code) || 0) + count);
    }
  }

  for (const [code, count] of Object.entries(builtinMock)) {
    countsByCode.set(code, (countsByCode.get(code) || 0) + count);
  }

  const list = Array.from(countsByCode.entries())
    .map(([code, count]) => ({ code, count }))
    .filter((item) => item.count > 0 || !realOnly)
    .sort((a, b) => b.count - a.count);

  const finalTotal = list.reduce((sum, item) => sum + item.count, 0);
  const finalMockTotal = mockTotalNum + builtinMockTotal;

  res.setHeader('Cache-Control', 's-maxage=10, stale-while-revalidate=30');
  res.status(200).json({
    total: finalTotal,
    list,
    hasMock: finalMockTotal > 0,
    mockTotal: finalMockTotal,
  });
}
