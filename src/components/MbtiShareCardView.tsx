import type { ComputeResultOutput } from '../utils/matching';
import type { TestConfig } from '../data/testConfig';
import { MBTI_CONTENT, AT_FLAVOR, TAGLINES } from '../data/mbti/content';
import { COMPATIBILITY } from '../data/mbti/compatibility';

interface DimSpec {
  key: string;
  leftLetter: string;
  rightLetter: string;
  leftLabel: string;
  rightLabel: string;
  leftColor: string;
  rightColor: string;
}

const DIM_SPECS: DimSpec[] = [
  { key: 'EI', leftLetter: 'I', rightLetter: 'E', leftLabel: '内向', rightLabel: '外向', leftColor: '#6366f1', rightColor: '#f59e0b' },
  { key: 'SN', leftLetter: 'N', rightLetter: 'S', leftLabel: '直觉', rightLabel: '实感', leftColor: '#8b5cf6', rightColor: '#10b981' },
  { key: 'TF', leftLetter: 'T', rightLetter: 'F', leftLabel: '思考', rightLabel: '情感', leftColor: '#3b82f6', rightColor: '#ec4899' },
  { key: 'JP', leftLetter: 'J', rightLetter: 'P', leftLabel: '判断', rightLabel: '感知', leftColor: '#ef4444', rightColor: '#14b8a6' },
  { key: 'AT', leftLetter: 'A', rightLetter: 'T', leftLabel: '自信', rightLabel: '动荡', leftColor: '#22c55e', rightColor: '#a855f7' },
];

const MAX_ABS: Record<string, number> = { EI: 45, SN: 45, TF: 45, JP: 45, AT: 36 };

function computePcts(rawScores: Record<string, number>): Record<string, number> {
  const pcts: Record<string, number> = {};
  Object.keys(rawScores).forEach((dim) => {
    const score = rawScores[dim];
    const max = MAX_ABS[dim] ?? 45;
    pcts[dim] = Math.max(0, Math.min(100, Math.round(50 + (score / max) * 50)));
  });
  return pcts;
}

export interface MbtiShareCardViewProps {
  result: ComputeResultOutput;
  config: TestConfig;
  qrDataUrl: string;
  shareUrl: string;
  /**
   * 'compact' (default): optimized for social sharing — header + tagline +
   *   dim bars + strengths + compat + famous + footer (~1800px tall)
   * 'full': includes overview, weaknesses, relationships, careers, growth,
   *   and A/T flavor (~3200px tall)
   */
  variant?: 'compact' | 'full';
}

/**
 * DOM-based share card for MBTI. Rendered inside an off-screen container
 * and captured with html2canvas. Fixed width 750px.
 *
 * All styling is inline so html2canvas captures it correctly without needing
 * Tailwind class resolution against the off-screen tree.
 */
export default function MbtiShareCardView({
  result,
  config,
  qrDataUrl,
  shareUrl,
  variant = 'compact',
}: MbtiShareCardViewProps) {
  const isCompact = variant === 'compact';
  const code = result.finalType.code;
  const [mainCode, suffix] = code.split('-') as [string, 'A' | 'T'];
  const content = MBTI_CONTENT[mainCode];
  const tagline = TAGLINES[mainCode] ?? '';
  const typeDef = config.typeLibrary[code];
  const image = config.typeImages[code];
  const rarity = config.typeRarity[code];
  const pcts = computePcts(result.rawScores);

  // Find soulmate + rival for main type
  const soulKey = Object.keys(COMPATIBILITY).find((k) => {
    const [a, b] = k.split('+');
    return (a === mainCode || b === mainCode) && COMPATIBILITY[k].type === 'soulmate';
  });
  const rivalKey = Object.keys(COMPATIBILITY).find((k) => {
    const [a, b] = k.split('+');
    return (a === mainCode || b === mainCode) && COMPATIBILITY[k].type === 'rival';
  });
  const soul = soulKey
    ? { pairCode: soulKey.split('+').find((t) => t !== mainCode) ?? '', say: COMPATIBILITY[soulKey].say }
    : null;
  const rival = rivalKey
    ? { pairCode: rivalKey.split('+').find((t) => t !== mainCode) ?? '', say: COMPATIBILITY[rivalKey].say }
    : null;

  const S = {
    page: {
      width: 750,
      background: '#080808',
      color: '#ffffff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif',
      padding: '40px 36px',
      boxSizing: 'border-box' as const,
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      gap: 24,
      marginBottom: 32,
      paddingBottom: 24,
      borderBottom: '1px solid #222',
    },
    typeImage: {
      width: 140,
      height: 140,
      borderRadius: 16,
      objectFit: 'cover' as const,
      flexShrink: 0,
    },
    typeInfo: { flex: 1 },
    code: {
      fontFamily: 'ui-monospace, monospace',
      fontSize: 44,
      fontWeight: 800,
      letterSpacing: '0.02em',
      marginBottom: 4,
    },
    cn: { fontSize: 20, color: '#aaa', marginBottom: 8 },
    rarityBadge: {
      display: 'inline-block',
      padding: '4px 12px',
      borderRadius: 6,
      background: 'rgba(255, 59, 59, 0.1)',
      color: '#ff3b3b',
      fontSize: 13,
      fontWeight: 700,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 800,
      marginBottom: 12,
      color: '#fff',
    },
    section: { marginBottom: 28 },
    paragraph: {
      fontSize: 14,
      lineHeight: 1.75,
      color: '#ccc',
    },
    dimRow: {
      background: '#111',
      border: '1px solid #222',
      borderRadius: 12,
      padding: 14,
      marginBottom: 10,
    },
    dimHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    dimLabel: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      fontSize: 14,
    },
    dimLetter: {
      fontFamily: 'ui-monospace, monospace',
      fontWeight: 800,
      fontSize: 18,
      color: '#fff',
    },
    dimMuted: { color: '#888', fontSize: 12 },
    dimPct: {
      fontFamily: 'ui-monospace, monospace',
      fontWeight: 800,
      fontSize: 18,
      color: '#fff',
    },
    dimBarBg: {
      height: 10,
      background: '#222',
      borderRadius: 5,
      overflow: 'hidden' as const,
      position: 'relative' as const,
    },
    bulletList: {
      listStyle: 'disc',
      paddingLeft: 22,
      margin: 0,
    },
    bulletItem: {
      fontSize: 14,
      lineHeight: 1.9,
      color: '#ccc',
    },
    famousGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 8,
    },
    famousCard: {
      background: '#181818',
      borderRadius: 8,
      padding: '10px 12px',
    },
    famousName: { fontSize: 14, fontWeight: 700, marginBottom: 2 },
    famousRole: { fontSize: 11, color: '#888' },
    compatGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 12,
    },
    compatCard: {
      background: '#111',
      border: '1px solid #222',
      borderRadius: 12,
      padding: 14,
    },
    compatBadge: {
      display: 'inline-block',
      padding: '3px 8px',
      borderRadius: 6,
      fontSize: 12,
      fontWeight: 700,
      marginBottom: 8,
    },
    compatPair: {
      fontFamily: 'ui-monospace, monospace',
      fontWeight: 700,
      fontSize: 15,
      marginBottom: 6,
    },
    compatSay: { fontSize: 13, color: '#999', lineHeight: 1.6 },
    footer: {
      marginTop: 32,
      paddingTop: 24,
      borderTop: '1px solid #222',
      display: 'flex',
      alignItems: 'center',
      gap: 20,
    },
    qr: {
      width: 100,
      height: 100,
      background: '#fff',
      padding: 6,
      borderRadius: 8,
      flexShrink: 0,
    },
    footerText: { flex: 1, fontSize: 12, color: '#888', lineHeight: 1.7 },
    brand: {
      fontSize: 15,
      fontWeight: 800,
      color: '#fff',
      marginBottom: 4,
    },
    taglineBlock: {
      padding: '20px 24px',
      marginBottom: 28,
      background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.12), rgba(255, 59, 59, 0.08))',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: 12,
      textAlign: 'center' as const,
    },
    tagline: {
      fontSize: 22,
      fontWeight: 800,
      color: '#fff',
      lineHeight: 1.4,
      letterSpacing: '0.01em',
    },
  };

  if (!content) {
    return <div style={S.page}>Content missing for {mainCode}</div>;
  }

  return (
    <div style={S.page}>
      {/* Header */}
      <div style={S.header}>
        {image && <img src={image} alt={code} style={S.typeImage} crossOrigin="anonymous" />}
        <div style={S.typeInfo}>
          <div style={S.code}>{code}</div>
          <div style={S.cn}>{typeDef?.cn}</div>
          {rarity && (
            <span style={S.rarityBadge}>
              {rarity.label} · {rarity.pct.toFixed(1)}% · {'★'.repeat(rarity.stars)}
            </span>
          )}
        </div>
      </div>

      {/* Tagline — hero quote */}
      {tagline && (
        <div style={S.taglineBlock}>
          <div style={S.tagline}>"{tagline}"</div>
        </div>
      )}

      {/* Overview — full variant only */}
      {!isCompact && (
        <section style={S.section}>
          <div style={S.sectionTitle}>核心特征</div>
          <div style={S.paragraph}>{content.overview}</div>
        </section>
      )}

      {/* Dimension bars */}
      <section style={S.section}>
        <div style={S.sectionTitle}>{config.dimSectionTitle}</div>
        {DIM_SPECS.map((spec) => {
          const pct = pcts[spec.key] ?? 50;
          const isLeftSide = pct < 50;
          const displayPct = isLeftSide ? 100 - pct : pct;
          const dominantLetter = isLeftSide ? spec.leftLetter : spec.rightLetter;
          return (
            <div key={spec.key} style={S.dimRow}>
              <div style={S.dimHeader}>
                <div style={S.dimLabel}>
                  <span style={S.dimLetter}>{spec.leftLetter}</span>
                  <span style={S.dimMuted}>{spec.leftLabel}</span>
                </div>
                <span style={S.dimPct}>
                  {dominantLetter} {displayPct}%
                </span>
                <div style={S.dimLabel}>
                  <span style={S.dimMuted}>{spec.rightLabel}</span>
                  <span style={S.dimLetter}>{spec.rightLetter}</span>
                </div>
              </div>
              <div style={S.dimBarBg}>
                <div
                  style={{
                    width: `${pct}%`,
                    height: '100%',
                    background: `linear-gradient(to right, ${spec.leftColor}, ${spec.rightColor})`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </section>

      {/* Strengths */}
      <section style={S.section}>
        <div style={S.sectionTitle}>优势</div>
        <ul style={S.bulletList}>
          {content.strengths.map((s, i) => (
            <li key={i} style={S.bulletItem}>{s}</li>
          ))}
        </ul>
      </section>

      {/* Weaknesses / Relationships / Careers / Growth — full variant only */}
      {!isCompact && (
        <>
          <section style={S.section}>
            <div style={S.sectionTitle}>劣势</div>
            <ul style={S.bulletList}>
              {content.weaknesses.map((s, i) => (
                <li key={i} style={S.bulletItem}>{s}</li>
              ))}
            </ul>
          </section>

          <section style={S.section}>
            <div style={S.sectionTitle}>恋爱与人际</div>
            <div style={S.paragraph}>{content.relationships}</div>
          </section>

          <section style={S.section}>
            <div style={S.sectionTitle}>职业建议</div>
            <ul style={S.bulletList}>
              {content.careers.map((c, i) => (
                <li key={i} style={S.bulletItem}>{c}</li>
              ))}
            </ul>
          </section>

          <section style={S.section}>
            <div style={S.sectionTitle}>成长建议</div>
            <div style={S.paragraph}>{content.growth}</div>
          </section>
        </>
      )}

      {/* Famous */}
      <section style={S.section}>
        <div style={S.sectionTitle}>同类型的著名人物</div>
        <div style={S.famousGrid}>
          {content.famous.map((f, i) => (
            <div key={i} style={S.famousCard}>
              <div style={S.famousName}>{f.name}</div>
              <div style={S.famousRole}>{f.role}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Compat */}
      <section style={S.section}>
        <div style={S.sectionTitle}>人格相性</div>
        <div style={S.compatGrid}>
          {soul && (
            <div style={S.compatCard}>
              <span
                style={{
                  ...S.compatBadge,
                  background: 'rgba(255, 59, 59, 0.1)',
                  color: '#ff6b9d',
                }}
              >
                天生一对
              </span>
              <div style={S.compatPair}>
                {mainCode} × {soul.pairCode}
              </div>
              <div style={S.compatSay}>{soul.say}</div>
            </div>
          )}
          {rival && (
            <div style={S.compatCard}>
              <span
                style={{
                  ...S.compatBadge,
                  background: 'rgba(245, 158, 11, 0.1)',
                  color: '#f59e0b',
                }}
              >
                欢喜冤家
              </span>
              <div style={S.compatPair}>
                {mainCode} × {rival.pairCode}
              </div>
              <div style={S.compatSay}>{rival.say}</div>
            </div>
          )}
        </div>
      </section>

      {/* A/T flavor — full variant only */}
      {!isCompact && (
        <section style={S.section}>
          <div style={S.sectionTitle}>
            {suffix === 'A' ? '自信型' : '动荡型'}的你
          </div>
          <div style={S.paragraph}>{AT_FLAVOR[suffix]}</div>
        </section>
      )}

      {/* Footer with QR */}
      <div style={S.footer}>
        <img src={qrDataUrl} alt="QR" style={S.qr} />
        <div style={S.footerText}>
          <div style={S.brand}>MBTI 16 型人格测试 · 完整版</div>
          <div>扫码测你的人格类型</div>
          <div style={{ marginTop: 4, wordBreak: 'break-all' }}>{shareUrl}</div>
        </div>
      </div>
    </div>
  );
}
