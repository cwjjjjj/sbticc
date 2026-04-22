import { useEffect, useMemo, useRef } from 'react';
import MbtiDimensionBars from './MbtiDimensionBars';
import { useTestConfig } from '../data/testConfig';
import type { ComputeResultOutput } from '../utils/matching';
import { MBTI_CONTENT, AT_FLAVOR } from '../data/mbti/content';
import { COMPATIBILITY } from '../data/mbti/compatibility';
import { trackEvent } from '../hooks/useAnalytics';

interface MbtiResultPageProps {
  result: ComputeResultOutput;
  onShare: () => void;
  onInviteCompare: () => void;
  onRestart: () => void;
  onHome: () => void;
  onDebugReroll?: () => void;
  onDebugForceType?: (code: string) => void;
}

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

export default function MbtiResultPage({
  result,
  onShare,
  onInviteCompare,
  onRestart,
  onHome,
}: MbtiResultPageProps) {
  const config = useTestConfig();
  const code = result.finalType.code;
  const [mainCode, suffix] = code.split('-') as [string, 'A' | 'T'];
  const content = MBTI_CONTENT[mainCode];
  const typeDef = config.typeLibrary[code];
  const image = config.typeImages[code];
  const rarity = config.typeRarity[code];
  const pcts = useMemo(() => computePcts(result.rawScores), [result.rawScores]);
  const resultViewFired = useRef(false);

  useEffect(() => {
    if (resultViewFired.current) return;
    resultViewFired.current = true;
    trackEvent('result_view', { testId: config.id, typeCode: code });
  }, [config.id, code]);

  const compatEntries = useMemo(() => {
    const soul: { pairCode: string; say: string } | null = (() => {
      const key = Object.keys(COMPATIBILITY).find((k) => {
        const [a, b] = k.split('+');
        return (a === mainCode || b === mainCode) && COMPATIBILITY[k].type === 'soulmate';
      });
      if (!key) return null;
      const [a, b] = key.split('+');
      return { pairCode: a === mainCode ? b : a, say: COMPATIBILITY[key].say };
    })();
    const rival: { pairCode: string; say: string } | null = (() => {
      const key = Object.keys(COMPATIBILITY).find((k) => {
        const [a, b] = k.split('+');
        return (a === mainCode || b === mainCode) && COMPATIBILITY[k].type === 'rival';
      });
      if (!key) return null;
      const [a, b] = key.split('+');
      return { pairCode: a === mainCode ? b : a, say: COMPATIBILITY[key].say };
    })();
    return { soul, rival };
  }, [mainCode]);

  if (!content) {
    return <div className="text-white p-8">Content missing for {mainCode}</div>;
  }

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-bg">
      <div className="max-w-2xl mx-auto px-4 py-8 text-white">
        {/* Header: code + name + image */}
        <div className="flex items-center gap-4 mb-6">
          {image && <img src={image} alt={code} className="w-20 h-20 rounded-xl" />}
          <div>
            <h1 className="font-mono font-extrabold text-3xl">{code}</h1>
            <p className="text-lg text-muted">{typeDef?.cn}</p>
            {rarity && (
              <p className="text-xs text-accent mt-1">
                {rarity.label} · {rarity.pct.toFixed(1)}% · {'★'.repeat(rarity.stars)}
              </p>
            )}
          </div>
        </div>

        {/* Section 1: Overview */}
        <section className="mb-6">
          <h2 className="font-bold text-xl mb-2">核心特征</h2>
          <p className="text-sm text-[#ccc] leading-relaxed">{content.overview}</p>
        </section>

        {/* Section 2: DimensionBars */}
        <section className="mb-6">
          <h2 className="font-bold text-xl mb-3">{config.dimSectionTitle}</h2>
          <MbtiDimensionBars pcts={pcts} />
        </section>

        {/* Section 3: Strengths */}
        <section className="mb-6">
          <h2 className="font-bold text-xl mb-2">优势</h2>
          <ul className="list-disc list-inside space-y-1 text-sm text-[#ccc]">
            {content.strengths.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        </section>

        {/* Section 4: Weaknesses */}
        <section className="mb-6">
          <h2 className="font-bold text-xl mb-2">劣势</h2>
          <ul className="list-disc list-inside space-y-1 text-sm text-[#ccc]">
            {content.weaknesses.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        </section>

        {/* Section 5: Relationships */}
        <section className="mb-6">
          <h2 className="font-bold text-xl mb-2">恋爱与人际</h2>
          <p className="text-sm text-[#ccc] leading-relaxed">{content.relationships}</p>
        </section>

        {/* Section 6: Careers */}
        <section className="mb-6">
          <h2 className="font-bold text-xl mb-2">职业建议</h2>
          <ul className="list-disc list-inside space-y-1 text-sm text-[#ccc]">
            {content.careers.map((c, i) => <li key={i}>{c}</li>)}
          </ul>
        </section>

        {/* Section 7: Growth */}
        <section className="mb-6">
          <h2 className="font-bold text-xl mb-2">成长建议</h2>
          <p className="text-sm text-[#ccc] leading-relaxed">{content.growth}</p>
        </section>

        {/* Section 8: Famous people */}
        <section className="mb-6">
          <h2 className="font-bold text-xl mb-2">同类型的著名人物</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {content.famous.map((f, i) => (
              <div key={i} className="bg-surface-2 rounded-lg p-2">
                <p className="font-bold text-sm">{f.name}</p>
                <p className="text-xs text-muted">{f.role}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted mt-2">历史人物参考</p>
        </section>

        {/* Section 9: Compat */}
        <section className="mb-6">
          <h2 className="font-bold text-xl mb-3">人格相性</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {compatEntries.soul && (
              <div className="bg-surface border border-[#ff6b9d]/20 rounded-xl p-3">
                <span className="inline-block px-2 py-1 rounded-md text-xs font-semibold bg-[#ff3b3b]/10 text-[#ff6b9d] mb-2">
                  💕 天生一对
                </span>
                <p className="font-mono font-bold text-white mb-1">
                  {mainCode} × {compatEntries.soul.pairCode}
                </p>
                <p className="text-sm text-[#999]">{compatEntries.soul.say}</p>
              </div>
            )}
            {compatEntries.rival && (
              <div className="bg-surface border border-warm/20 rounded-xl p-3">
                <span className="inline-block px-2 py-1 rounded-md text-xs font-semibold bg-warm/10 text-warm mb-2">
                  ⚔️ 欢喜冤家
                </span>
                <p className="font-mono font-bold text-white mb-1">
                  {mainCode} × {compatEntries.rival.pairCode}
                </p>
                <p className="text-sm text-[#999]">{compatEntries.rival.say}</p>
              </div>
            )}
          </div>
        </section>

        {/* Section 10: A/T flavor */}
        <section className="mb-8">
          <h2 className="font-bold text-xl mb-2">
            {suffix === 'A' ? '自信型' : '动荡型'}的你
          </h2>
          <p className="text-sm text-[#ccc] leading-relaxed">{AT_FLAVOR[suffix]}</p>
        </section>

        {/* Actions */}
        <div className="flex flex-col gap-2 mb-8">
          <button onClick={onShare} className="bg-accent text-white font-bold py-3 rounded-xl">
            生成分享卡片
          </button>
          <button onClick={onInviteCompare} className="border border-border text-white font-bold py-3 rounded-xl">
            邀请朋友对比
          </button>
          <button onClick={onRestart} className="text-muted underline text-sm py-2">
            重新测试
          </button>
          <button onClick={onHome} className="text-muted underline text-sm py-2">
            返回首页
          </button>
        </div>
      </div>
    </div>
  );
}
