# Phase B.1 — Virality Core Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development.

**Goal:** Ship reveal-style rarity presentation, permanent rarity badge, Hook Matrix (3 widgets), enhanced share card, and UTM on share links. All integrated into shared `ResultPage.tsx`, covering all 10 tests uniformly.

**Architecture:** All changes are additive to existing React components. `ResultPage.tsx` is shared across 10 test apps via `useTestConfig()`, so modifying it propagates everywhere. New components are small, focused, testable units. Ranking API already exists and returns `{ total, top10, typeCounts: Record<code, n> }`; we build a hook to compute percentile + tier.

**Tech Stack:** React 19 + framer-motion (already in use), existing `useTestConfig()` context, `/api/ranking` endpoint.

---

## File Structure

**New files:**
- `src/hooks/useRarity.ts` — fetches /api/ranking, computes percentile + tier
- `src/hooks/useRarity.test.ts` — unit test for tier computation
- `src/components/RarityBadge.tsx` — badge with tier glow + click-to-expand
- `src/components/RevealOverlay.tsx` — full-screen reveal animation
- `src/components/HookMatrix.tsx` — 3-panel CTA block
- `src/components/InviteCompareCard.tsx` — H1 widget (invite friend to compare)
- `src/components/RecommendTestsCard.tsx` — H2 widget (2 related tests)
- `src/components/ContinueJourneyCard.tsx` — H4 widget (history count + continue)

**Modified files:**
- `src/components/ResultPage.tsx` — integrate Reveal + RarityBadge + HookMatrix
- `src/utils/shareCard.ts` — add percentile display in share image
- `src/App.tsx`, `src/LoveApp.tsx`, `src/WorkApp.tsx`, ... (10 test apps) — pass `testId` prop to ResultPage for rarity fetching + share link with UTM

**Routing:**
- Share links change from `/<test>#result=...` to `/types/<testId>/<CODE>?s=share` (leverage Phase 2 type pages). Type pages already have the type info; user scanning QR lands on something meaningful.
- Compare links keep `/<test>#compare=<base64>?s=compare` — UTM added.

---

### Task 1: useRarity hook + test

**Files:** Create `src/hooks/useRarity.ts`, `src/hooks/useRarity.test.ts` (if vitest available; else skip test).

- [ ] **Step 1: Check test framework**

```bash
grep -l 'vitest\|jest' package.json node_modules/.package-lock.json 2>/dev/null | head -3
```

If vitest/jest not installed, skip test file — use pure typed utility function + manual verification.

- [ ] **Step 2: Write `src/hooks/useRarity.ts`**

```ts
import { useState, useEffect } from 'react';

export type RarityTier = 'legendary' | 'rare' | 'uncommon' | 'common';

export interface RarityData {
  percentile: number;  // 0-100, lower = rarer
  tier: RarityTier;
  typeCount: number;   // how many people got this type
  totalTests: number;  // total tests taken for this test
  loaded: boolean;
  error: boolean;
}

export function computeTier(percentile: number): RarityTier {
  if (percentile <= 5) return 'legendary';
  if (percentile <= 15) return 'rare';
  if (percentile <= 40) return 'uncommon';
  return 'common';
}

/**
 * Compute percentile given:
 * - typeCount: how many times this type appeared
 * - totalTests: total tests for this test family
 * Returns a percentile in 0-100 where 0 = rarest (never happened) and 100 = most common.
 * We compute "rarity rank" as: 1 - (typeCount / totalTests), then convert to percentile-of-rarity (lower = rarer).
 */
export function computePercentile(typeCount: number, totalTests: number): number {
  if (totalTests <= 0) return 100;
  const proportion = typeCount / totalTests;
  // convert proportion (0-1) to "rarity percentile" where 0 = everyone got this (not rare), 100 = nobody got this (max rare)
  // but UI convention wants: lower percentile = rarer. So we return proportion * 100, making "1% rare" = 1% of people got this.
  return Math.max(0, Math.min(100, proportion * 100));
}

interface RankingApiResponse {
  total?: number;
  typeCounts?: Record<string, number>;
}

/** Fetch /api/ranking and compute rarity for the given code+testId. */
export function useRarity(testId: string, code: string): RarityData {
  const [data, setData] = useState<RarityData>({
    percentile: 100,
    tier: 'common',
    typeCount: 0,
    totalTests: 0,
    loaded: false,
    error: false,
  });

  useEffect(() => {
    let cancelled = false;
    const url = testId === 'sbti' ? '/api/ranking' : `/api/ranking?test=${encodeURIComponent(testId)}`;
    fetch(url)
      .then((r) => r.json() as Promise<RankingApiResponse>)
      .then((json) => {
        if (cancelled) return;
        const typeCount = (json.typeCounts ?? {})[code] ?? 0;
        const totalTests = json.total ?? 0;
        const percentile = computePercentile(typeCount, totalTests);
        const tier = computeTier(percentile);
        setData({ percentile, tier, typeCount, totalTests, loaded: true, error: false });
      })
      .catch(() => {
        if (cancelled) return;
        setData((d) => ({ ...d, loaded: true, error: true }));
      });
    return () => { cancelled = true; };
  }, [testId, code]);

  return data;
}
```

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useRarity.ts
git commit -m "feat(virality): useRarity hook + percentile/tier computation

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 2: RarityBadge component

**Files:** Create `src/components/RarityBadge.tsx`.

- [ ] **Step 1: Write component**

```tsx
import { motion } from 'framer-motion';
import type { RarityData } from '../hooks/useRarity';

interface RarityBadgeProps {
  rarity: RarityData;
  onClick?: () => void;
}

const TIER_LABEL: Record<string, { cn: string; color: string; glow: string }> = {
  legendary: { cn: '稀世', color: '#ffd700', glow: '0 0 20px rgba(255, 215, 0, 0.6)' },
  rare:      { cn: '罕见', color: '#ff3b3b', glow: '0 0 16px rgba(255, 59, 59, 0.5)' },
  uncommon:  { cn: '少见', color: '#c0c0c0', glow: '0 0 12px rgba(192, 192, 192, 0.4)' },
  common:    { cn: '普通', color: '#888888', glow: 'none' },
};

export default function RarityBadge({ rarity, onClick }: RarityBadgeProps) {
  if (!rarity.loaded) {
    return (
      <div className="inline-block px-3 py-1.5 rounded-lg bg-surface-2 text-muted text-xs font-mono animate-pulse">
        计算稀有度...
      </div>
    );
  }
  if (rarity.error || rarity.totalTests === 0) {
    return null;
  }

  const cfg = TIER_LABEL[rarity.tier];
  const percentStr = rarity.percentile < 1 ? '< 1' : rarity.percentile.toFixed(1);

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      onClick={onClick}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border font-mono text-sm cursor-pointer transition-transform hover:scale-105"
      style={{
        borderColor: cfg.color + '66',
        background: cfg.color + '11',
        color: cfg.color,
        boxShadow: cfg.glow,
      }}
      aria-label={`稀有度 ${cfg.cn}: 前 ${percentStr}% 稀有`}
    >
      <span className="font-bold">前 {percentStr}%</span>
      <span className="opacity-70">·</span>
      <span className="font-extrabold tracking-widest">{cfg.cn}</span>
    </motion.button>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/RarityBadge.tsx
git commit -m "feat(virality): RarityBadge component with tier visuals

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 3: RevealOverlay component

**Files:** Create `src/components/RevealOverlay.tsx`.

- [ ] **Step 1: Write component**

```tsx
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { RarityData } from '../hooks/useRarity';

interface RevealOverlayProps {
  rarity: RarityData;
  typeCn: string;
  typeCode: string;
  onComplete: () => void;
}

const TIER_CFG: Record<string, { cn: string; color: string }> = {
  legendary: { cn: '稀世',   color: '#ffd700' },
  rare:      { cn: '罕见',   color: '#ff3b3b' },
  uncommon:  { cn: '少见',   color: '#c0c0c0' },
  common:    { cn: '普通',   color: '#aaaaaa' },
};

/** Full-screen reveal overlay. Stages: dots (1.5s) → big reveal (2.5s) → fade out. */
export default function RevealOverlay({ rarity, typeCn, typeCode, onComplete }: RevealOverlayProps) {
  const [stage, setStage] = useState<'intro' | 'reveal' | 'done'>('intro');

  useEffect(() => {
    // Wait for rarity to load before advancing
    if (!rarity.loaded) return;
    const t1 = setTimeout(() => setStage('reveal'), 1500);
    const t2 = setTimeout(() => setStage('done'), 4000);
    const t3 = setTimeout(() => onComplete(), 4500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [rarity.loaded, onComplete]);

  const cfg = rarity.tier ? TIER_CFG[rarity.tier] : TIER_CFG.common;
  const hasRarity = rarity.loaded && !rarity.error && rarity.totalTests > 0;
  const percentStr = rarity.percentile < 1 ? '< 1' : rarity.percentile.toFixed(1);

  return (
    <AnimatePresence>
      {stage !== 'done' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="fixed inset-0 z-[400] bg-bg flex flex-col items-center justify-center px-6"
        >
          {stage === 'intro' && (
            <>
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="text-lg text-[#aaa] mb-8"
              >
                你属于...
              </motion.p>
              <motion.div
                className="flex gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="w-3 h-3 rounded-full bg-accent"
                    animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </motion.div>
            </>
          )}

          {stage === 'reveal' && (
            <>
              {hasRarity ? (
                <>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-sm font-mono text-[#888] mb-3 tracking-widest"
                  >
                    稀有度评定
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, type: 'spring' }}
                    className="text-7xl sm:text-8xl font-extrabold font-mono mb-2"
                    style={{ color: cfg.color, textShadow: `0 0 40px ${cfg.color}66` }}
                  >
                    前 {percentStr}%
                  </motion.div>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-3xl sm:text-4xl font-extrabold tracking-[0.3em] mb-8"
                    style={{ color: cfg.color }}
                  >
                    {cfg.cn}
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="text-center"
                  >
                    <p className="text-base text-[#aaa]">你的类型：</p>
                    <p className="text-2xl font-bold text-white mt-1">
                      {typeCn} <span className="font-mono text-accent ml-2">{typeCode}</span>
                    </p>
                  </motion.div>
                </>
              ) : (
                <>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-center"
                  >
                    <p className="text-sm font-mono text-[#888] mb-3 tracking-widest">你的类型</p>
                    <p className="text-5xl font-extrabold text-white mb-2">{typeCn}</p>
                    <p className="font-mono text-2xl text-accent">{typeCode}</p>
                  </motion.div>
                </>
              )}
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/RevealOverlay.tsx
git commit -m "feat(virality): RevealOverlay with rarity reveal animation

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 4: Hook Matrix widgets (3 components)

**Files:** Create 3 widgets.

- [ ] **Step 1: Write `src/components/InviteCompareCard.tsx`**

```tsx
interface InviteCompareCardProps {
  onInviteCompare: () => void;
}

export default function InviteCompareCard({ onInviteCompare }: InviteCompareCardProps) {
  return (
    <button
      onClick={onInviteCompare}
      className="text-left bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/40 rounded-2xl p-6 cursor-pointer hover:border-accent transition-all group"
    >
      <div className="text-2xl mb-3">📨</div>
      <h3 className="text-lg font-bold text-white mb-1">邀请 TA 对比</h3>
      <p className="text-sm text-[#bbb] mb-3 leading-relaxed">发一条链接给朋友/对象/同事，看看你们的雷达图有多相似——或者多不像。</p>
      <p className="text-xs font-mono text-accent group-hover:tracking-wider transition-all">生成对比链接 →</p>
    </button>
  );
}
```

- [ ] **Step 2: Write `src/components/RecommendTestsCard.tsx`**

```tsx
import { useMemo } from 'react';

const ALL_TESTS = [
  { id: 'sbti',   path: '/sbti',   emoji: '🧠', name: 'SBTI 人格测试', tag: '15维度深度人格扫描' },
  { id: 'love',   path: '/love',   emoji: '💘', name: '恋爱脑浓度检测', tag: '你谈恋爱是什么德性' },
  { id: 'work',   path: '/work',   emoji: '💼', name: '打工人鉴定',     tag: '你是哪种打工人' },
  { id: 'values', path: '/values', emoji: '🌏', name: '活法检测报告',   tag: '你到底在活什么' },
  { id: 'cyber',  path: '/cyber',  emoji: '📱', name: '赛博基因检测',   tag: '你是什么品种的网民' },
  { id: 'desire', path: '/desire', emoji: '🔥', name: '欲望图谱',       tag: '关上门之后你是谁' },
  { id: 'gsti',   path: '/gsti',   emoji: '🪞', name: 'GSTI 性转人格',   tag: '性转后你是什么鬼' },
  { id: 'fpi',    path: '/fpi',    emoji: '📸', name: '朋友圈人设诊断', tag: '你在朋友圈是什么物种' },
  { id: 'fsi',    path: '/fsi',    emoji: '🏷️', name: '原生家庭幸存者', tag: '你被养成了什么形状' },
  { id: 'mpi',    path: '/mpi',    emoji: '💸', name: '消费人格图鉴',   tag: '你怎么把钱输给这个世界' },
];

// Hardcoded cross-test recommendations
const RECS: Record<string, [string, string]> = {
  sbti:   ['gsti', 'love'],
  love:   ['sbti', 'desire'],
  work:   ['values', 'mpi'],
  values: ['love', 'work'],
  cyber:  ['fpi', 'values'],
  desire: ['love', 'fsi'],
  gsti:   ['sbti', 'fpi'],
  fpi:    ['cyber', 'gsti'],
  fsi:    ['values', 'desire'],
  mpi:    ['work', 'values'],
};

interface RecommendTestsCardProps {
  currentTestId: string;
}

export default function RecommendTestsCard({ currentTestId }: RecommendTestsCardProps) {
  const recs = useMemo(() => {
    const ids = RECS[currentTestId] ?? ['sbti', 'love'];
    return ids.map((id) => ALL_TESTS.find((t) => t.id === id)!).filter(Boolean);
  }, [currentTestId]);

  return (
    <div className="bg-surface border border-border rounded-2xl p-6">
      <h3 className="text-lg font-bold text-white mb-1">你可能也想测</h3>
      <p className="text-sm text-[#888] mb-4">测完这个顺手做下一个。我们做了 10 款。</p>
      <div className="flex flex-col gap-3">
        {recs.map((t) => (
          <a
            key={t.id}
            href={`${t.path}?s=from-${currentTestId}`}
            className="flex items-center gap-3 bg-surface-2 border border-border rounded-xl p-3 hover:border-[#444] transition-colors cursor-pointer"
          >
            <span className="text-2xl">{t.emoji}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">{t.name}</p>
              <p className="text-xs text-[#888] truncate">{t.tag}</p>
            </div>
            <span className="text-accent text-sm">→</span>
          </a>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Write `src/components/ContinueJourneyCard.tsx`**

```tsx
interface ContinueJourneyCardProps {
  localHistoryCount: number;
}

const TOTAL_TESTS = 10;

export default function ContinueJourneyCard({ localHistoryCount }: ContinueJourneyCardProps) {
  const remaining = Math.max(0, TOTAL_TESTS - localHistoryCount);
  const progress = Math.min(100, (localHistoryCount / TOTAL_TESTS) * 100);

  return (
    <div className="bg-surface border border-border rounded-2xl p-6">
      <h3 className="text-lg font-bold text-white mb-1">你的测试地图</h3>
      <p className="text-sm text-[#888] mb-4">本机已完成 {localHistoryCount} / {TOTAL_TESTS} 个测试</p>
      <div className="h-2 bg-surface-2 rounded-full overflow-hidden mb-3">
        <div
          className="h-full bg-gradient-to-r from-accent/60 to-accent transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
      {remaining > 0 ? (
        <p className="text-xs text-[#aaa]">还有 <span className="text-accent font-bold">{remaining}</span> 个测试没做。全测完会怎么样？不知道，我们也没人测完过。</p>
      ) : (
        <p className="text-xs text-accent">🎉 10 个测试全部完成，你现在是人格实验室的正式成员。</p>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Write `src/components/HookMatrix.tsx`**

```tsx
import InviteCompareCard from './InviteCompareCard';
import RecommendTestsCard from './RecommendTestsCard';
import ContinueJourneyCard from './ContinueJourneyCard';

interface HookMatrixProps {
  testId: string;
  localHistoryCount: number;
  onInviteCompare: () => void;
}

export default function HookMatrix({ testId, localHistoryCount, onInviteCompare }: HookMatrixProps) {
  return (
    <section className="mt-10 mb-6">
      <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
        <span className="w-[3px] h-4 bg-accent rounded-sm" />
        还有这些可以玩
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <InviteCompareCard onInviteCompare={onInviteCompare} />
        <RecommendTestsCard currentTestId={testId} />
        <div className="sm:col-span-2">
          <ContinueJourneyCard localHistoryCount={localHistoryCount} />
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add src/components/InviteCompareCard.tsx src/components/RecommendTestsCard.tsx src/components/ContinueJourneyCard.tsx src/components/HookMatrix.tsx
git commit -m "feat(virality): Hook Matrix widgets (invite + recommend + journey)

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 5: Integrate into ResultPage

**Files:** Modify `src/components/ResultPage.tsx`.

- [ ] **Step 1: Read current ResultPage to find insertion points**

Read the whole file to know the JSX tree.

- [ ] **Step 2: Add imports at top**

Add:
```tsx
import { useState } from 'react';
import RevealOverlay from './RevealOverlay';
import RarityBadge from './RarityBadge';
import HookMatrix from './HookMatrix';
import { useRarity } from '../hooks/useRarity';
```

- [ ] **Step 3: Add state + derive rarity**

Inside the component, near the top (after existing state):
```tsx
const [revealed, setRevealed] = useState(false);
const rarity = useRarity(config.id, typeCode);
```

- [ ] **Step 4: Determine localHistoryCount**

Check existing code for localStorage history reading. If not present in ResultPage, wire via prop from parent App OR read directly inline:

```tsx
const localHistoryCount = (() => {
  try {
    const raw = localStorage.getItem('testHistory');
    if (!raw) return 0;
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? new Set(arr.map((e: any) => e.testId ?? e.test ?? '').filter(Boolean)).size : 0;
  } catch { return 0; }
})();
```

If parent already passes it, use that instead.

- [ ] **Step 5: Render RevealOverlay at top (before main JSX)**

Inside the top-level `<div className="fixed inset-0 z-[200] bg-bg overflow-y-auto">`:
```tsx
{!revealed && (
  <RevealOverlay
    rarity={rarity}
    typeCn={typeDef.cn}
    typeCode={typeCode}
    onComplete={() => setRevealed(true)}
  />
)}
```

- [ ] **Step 6: Insert RarityBadge below the TypeCard top section**

After the existing "1. Result top" motion.div (which has TypeCard), insert a small motion block:
```tsx
<motion.div
  variants={staggerItem}
  transition={{ duration: 0.4 }}
  className="flex justify-center sm:justify-start mb-6"
>
  <RarityBadge rarity={rarity} />
</motion.div>
```

- [ ] **Step 7: Insert HookMatrix before the restart/home buttons section**

Find the section that renders `onRestart`/`onHome` buttons. Insert above:
```tsx
<HookMatrix
  testId={config.id}
  localHistoryCount={localHistoryCount}
  onInviteCompare={onInviteCompare}
/>
```

- [ ] **Step 8: Type check**

```bash
npx tsc --noEmit
```

Fix any errors. Common: `config.id` not typed — check `useTestConfig` return type.

- [ ] **Step 9: Commit**

```bash
git add src/components/ResultPage.tsx
git commit -m "feat(virality): integrate reveal + rarity + hook matrix in ResultPage

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 6: Share card v2 (add percentile) + UTM

**Files:** Modify `src/utils/shareCard.ts`.

- [ ] **Step 1: Read `src/utils/shareCard.ts`**

- [ ] **Step 2: Modify `drawShareCard` signature to accept optional rarity**

Add to signature:
```ts
export async function drawShareCard(
  type: TypeDef,
  result: ComputeResultOutput,
  qrUrl: string,
  mode: 'share' | 'invite',
  config: TestConfig,
  isPaid: boolean = false,
  rarity?: { percentile: number; tier: 'legendary' | 'rare' | 'uncommon' | 'common' },  // NEW
): Promise<HTMLCanvasElement>
```

- [ ] **Step 3: In draw logic, add percentile banner near the top**

Before drawing the type card, if `rarity` provided, draw a top banner:

Approximate code to insert (adapt to existing drawing flow — look for where to insert in the existing flow):

```ts
if (rarity && rarity.percentile < 100) {
  const tierLabel = {
    legendary: ['稀世', '#ffd700'],
    rare:      ['罕见', '#ff3b3b'],
    uncommon:  ['少见', '#c0c0c0'],
    common:    ['普通', '#888888'],
  }[rarity.tier];
  ctx.font = 'bold 64px -apple-system, "PingFang SC", sans-serif';
  ctx.fillStyle = tierLabel[1];
  ctx.textAlign = 'center';
  const pctStr = rarity.percentile < 1 ? '< 1' : rarity.percentile.toFixed(1);
  ctx.fillText(`前 ${pctStr}%`, canvas.width / 2, 90);
  ctx.font = 'bold 28px -apple-system, "PingFang SC", sans-serif';
  ctx.fillText(tierLabel[0], canvas.width / 2, 130);
  ctx.textAlign = 'left';
}
```

(Adjust Y coordinates to not overlap existing elements; may need to shift downstream elements by ~150px if rarity present.)

- [ ] **Step 4: QR URL uses type page URL**

Find where `qrUrl` is used/constructed (in the caller likely). Change the caller to pass `https://test.jiligulu.xyz/types/<testId>/<CODE>?s=share` instead of the test home URL.

Search for `drawShareCard(` callers:

```bash
grep -rn 'drawShareCard' src
```

Update callers to construct type-page-pointing QR URL.

- [ ] **Step 5: Type check**

```bash
npx tsc --noEmit
```

- [ ] **Step 6: Commit**

```bash
git add src/utils/shareCard.ts src/**/*.tsx
git commit -m "feat(virality): shareCard v2 with percentile banner + QR to type page

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 7: Final build + smoke test + push

- [ ] **Step 1: Full clean build**

```bash
rm -rf dist dist-temp
bash build.sh 2>&1 | tail -8
```

- [ ] **Step 2: TypeScript check**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Local smoke test**

```bash
npx serve dist -l 5176 &
SERVE_PID=$!
sleep 2
# verify dist still contains pages
[ -f dist/types/index.html ] && echo "✓ types hub"
[ -f dist/sitemap.xml ] && echo "✓ sitemap"
kill $SERVE_PID
```

- [ ] **Step 4: Merge to main + push**

```bash
git log --oneline main..feat/virality-b1 | head -10
git checkout main
git merge --ff-only feat/virality-b1
git push origin main
```

---

## Self-Review

**Spec coverage:**
- ✅ 块 1 (Reveal) — Task 1+3 (hook + overlay)
- ✅ 块 2 (Permanent badge) — Task 2+5 (badge + integration)
- ✅ 块 3 (Hook matrix H1/H2/H4) — Task 4
- ✅ Share card v2 + UTM — Task 6
- ⏳ Per-type OG images — deferred to B.2 (mentioned in spec "加强")
- ⏳ H3 cross-test (同款人格的人还在看) — deferred to B.2

**Placeholder scan:** no TBD. All code blocks show actual implementation.

**Type consistency:** `RarityData` interface consistent across useRarity / RarityBadge / RevealOverlay.

## Risks

- RevealOverlay may block the first-paint if rarity API is slow. Mitigation: hard-timeout 3s — overlay advances to reveal stage even if API hasn't returned (rarity.error path renders simpler reveal).
- 10 test apps each pass different props to ResultPage — verify none break by running tsc after integration.
- If `testHistory` localStorage key name differs across apps, ContinueJourneyCard count will be 0. Acceptable degradation.

## Changelog
| Date | Change | Author |
|------|--------|--------|
| 2026-04-19 | v1 initial | cwjjjjj + Claude |
