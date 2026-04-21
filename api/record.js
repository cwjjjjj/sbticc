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
    'HAMRLC','BWDPFV','HAMRFC','BAMPFV','HWMRLV','BADPLC','HADRPC','HWDPLV',
    'BAMRLV','HWMRFC','BADRLC','HWDRLC','HAMPLC','BWMRFC','HADPFC','BWDRLV',
    'HAMDLC','BWMPLC','HAWRLC','HADRLV','EX'
  ]),
  'work': new Set([
    'NJYDJ','MYZSN','BGXIA','HSGJI','PUASH','GUANX','TXDGR','CYFNG',
    'FXLYT','SGYSJ','JWFDY','FWZZZ','MSFCI','ZCHLI','DGPSA','ZQJQI',
    'KLXYU','ZDDSH','TPXFG','ZCPNZ','996'
  ]),
  'values': new Set([
    'CHUANG','NOREUR','SHOUHU','MOMAHU','XIAOSA','GAOFEI','JIZHUA','KUAIFE',
    'JIUPIN','WENZHU','MOGUI','JUANZH','RUNXUE','DULANR','QINGXN','GANGJN',
    'FOXIAN','CUNGOU','KAOGON','JIAOQI','MLC'
  ]),
  'cyber': new Set([
    'KBKING','COCOON','HERMIT','ACTRES','MELONX','MOUTHX','PICKLE','BOMBER',
    'ZOMBIE','NPCNPC','ZENZEN','WRITER','JUDGEX','HOARDE','TROLLX','BLACKH',
    'IDEALI','FENCER','JELLYF','RENASC','BOT'
  ]),
  'desire': new Set([
    'SOPFEH','SOBFEH','SOBFER','SOPGLH','SOPGLR','MCBGLR','MCPGLR',
    'MOBFEH','MOBFER','MCBFER','SCPFEH','SCPGLH','SOBGLH','MCPFEH',
    'MOBGLH','MCBGLH','SOPFER','MCPGLH','SOBGLR','MCBFEH','XXX'
  ]),
  'gsti': new Set([
    'M_GOLD','M_HUBY','M_GTEA','M_WHIT','M_FBRO','M_SAIN','M_MALK','M_TEAM',
    'M_BABY','M_CTRL','M_MOON','M_PRNC','M_DRAM','M_SOFT','M_PHNX','M_FANC',
    'M_HOTG','M_SCHM','M_WLOT','M_HOOK','F_PHNX','F_MGIR','F_PCON','F_LICK',
    'F_OCEA','F_TOOL','F_DADY','F_IRON','F_ROUG','F_STRG','F_NICE','F_BACK',
    'F_ACGR','F_WILD','F_DARK','F_BOSS','F_KBGR','F_DADG','F_PART','F_BRIC',
    'UNDEF','HWDP'
  ]),
  'fpi': new Set([
    'FILTR','9PIC!','EMO-R','FLEXR','CKIN!','3DAYS','SUBMR','LIKER',
    'GHOST','COPYR','SELLR','BABY!','FURRY','MUKBG','TRVL9','BLOCK',
    'REDBK','JUDGE','QSLIF','NPC-F',
    '0POST','FEED?'
  ]),
  'fsi': new Set([
    'COPYX','REBEL','SAINT','LEAVE','CURE!','SILNT','DADY+','MAMY+',
    'PICKR','PLEASE','GOLD+','GHOST','SOS!','BANK!','PRNS+','TOOLX',
    'BRAG+','DUAL!',
    'BOSSY','FAMX?'
  ]),
  'mpi': new Set([
    'LIVE!','2HAND','HAULX','CHEAP','GOLDN','SETUP','NUBOY','LUXUR',
    'BILIB','FOMO+','GIFTR','RETRN','STEAL','PREMM','FLIPR','INSTA',
    'CHAR0','BOSSX',
    'ZERO$','MIXDR'
  ]),
  'mbti': new Set([
    'INTJ-A','INTJ-T','INTP-A','INTP-T','ENTJ-A','ENTJ-T','ENTP-A','ENTP-T',
    'INFJ-A','INFJ-T','INFP-A','INFP-T','ENFJ-A','ENFJ-T','ENFP-A','ENFP-T',
    'ISTJ-A','ISTJ-T','ISFJ-A','ISFJ-T','ESTJ-A','ESTJ-T','ESFJ-A','ESFJ-T',
    'ISTP-A','ISTP-T','ISFP-A','ISFP-T','ESTP-A','ESTP-T','ESFP-A','ESFP-T',
  ]),
  'dogti': new Set([
    'INTJ','INTP','ENTJ','ENTP','INFJ','INFP','ENFJ','ENFP',
    'ISTJ','ISFJ','ESTJ','ESFJ','ISTP','ISFP','ESTP','ESFP',
  ]),
  'cati': new Set([
    'INTJ','INTP','ENTJ','ENTP','INFJ','INFP','ENFJ','ENFP',
    'ISTJ','ISFJ','ESTJ','ESFJ','ISTP','ISFP','ESTP','ESFP',
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
