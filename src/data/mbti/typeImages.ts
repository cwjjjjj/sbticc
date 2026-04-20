type Temperament = 'NT' | 'NF' | 'SJ' | 'SP';

function temperamentOf(main: string): Temperament {
  const s = main[1]; // 'N' 或 'S'
  const t = main[2]; // 'T' 或 'F'
  const j = main[3]; // 'J' 或 'P'
  if (s === 'N' && t === 'T') return 'NT';
  if (s === 'N' && t === 'F') return 'NF';
  if (s === 'S' && j === 'J') return 'SJ';
  return 'SP';
}

const TEMP_COLORS: Record<Temperament, { bg: string; fg: string; accent: string }> = {
  NT: { bg: '#2a1b4a', fg: '#ffffff', accent: '#8b5cf6' },
  NF: { bg: '#1a3a2e', fg: '#ffffff', accent: '#10b981' },
  SJ: { bg: '#1a2a4a', fg: '#ffffff', accent: '#3b82f6' },
  SP: { bg: '#3a2a1a', fg: '#ffffff', accent: '#f59e0b' },
};

function generateMbtiTypeSvg(code: string): string {
  const [main, suffix] = code.split('-') as [string, 'A' | 'T'];
  const colors = TEMP_COLORS[temperamentOf(main)];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 320" width="320" height="320">
  <rect width="320" height="320" fill="${colors.bg}"/>
  <rect x="20" y="20" width="280" height="280" rx="20" fill="none" stroke="${colors.accent}" stroke-width="2" opacity="0.5"/>
  <text x="160" y="180" fill="${colors.fg}" font-family="-apple-system, SF Pro Display, system-ui, sans-serif" font-size="72" font-weight="800" text-anchor="middle" letter-spacing="4">${main}</text>
  <circle cx="258" cy="258" r="28" fill="${colors.accent}"/>
  <text x="258" y="268" fill="${colors.fg}" font-family="-apple-system, SF Pro Display, system-ui, sans-serif" font-size="28" font-weight="800" text-anchor="middle">${suffix}</text>
</svg>`;
  const b64 = btoa(unescape(encodeURIComponent(svg)));
  return `data:image/svg+xml;base64,${b64}`;
}

const ALL_CODES = [
  'INTJ-A','INTJ-T','INTP-A','INTP-T','ENTJ-A','ENTJ-T','ENTP-A','ENTP-T',
  'INFJ-A','INFJ-T','INFP-A','INFP-T','ENFJ-A','ENFJ-T','ENFP-A','ENFP-T',
  'ISTJ-A','ISTJ-T','ISFJ-A','ISFJ-T','ESTJ-A','ESTJ-T','ESFJ-A','ESFJ-T',
  'ISTP-A','ISTP-T','ISFP-A','ISFP-T','ESTP-A','ESTP-T','ESFP-A','ESFP-T',
];

export const TYPE_IMAGES: Record<string, string> = (() => {
  const m: Record<string, string> = {};
  ALL_CODES.forEach(code => { m[code] = generateMbtiTypeSvg(code); });
  return m;
})();

export const SHARE_IMAGES: Record<string, string> = TYPE_IMAGES;
