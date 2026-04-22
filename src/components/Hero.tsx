import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { css } from '@emotion/react';
import { useTestConfig } from '../data/testConfig';
import { trackEvent } from '../hooks/useAnalytics';

interface HeroProps {
  onStartTest: () => void;
  onRestartFresh?: () => void;
  onTrySample?: () => void;
  totalTests: number;
}

interface SavedDraftMeta {
  currentQ: number;
  total: number;
  savedAt: number;
}

const DRAFT_TTL_MS = 2 * 60 * 60 * 1000;

function readDraftMeta(testId: string): SavedDraftMeta | null {
  try {
    const raw = localStorage.getItem(`${testId}_quiz_progress`);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (
      typeof parsed?.currentQ !== 'number' ||
      typeof parsed?.timestamp !== 'number' ||
      !Array.isArray(parsed?.shuffledQuestions)
    ) return null;
    if (Date.now() - parsed.timestamp > DRAFT_TTL_MS) return null;
    return {
      currentQ: parsed.currentQ,
      total: parsed.shuffledQuestions.length,
      savedAt: parsed.timestamp,
    };
  } catch {
    return null;
  }
}

function formatElapsed(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  if (minutes < 1) return '刚刚';
  if (minutes < 60) return `${minutes} 分钟前`;
  const hours = Math.floor(minutes / 60);
  return `${hours} 小时前`;
}

const fadeInUp = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
});

const heroGlow = css`
  background: radial-gradient(
    ellipse 60% 50% at 50% 40%,
    rgba(255, 59, 59, 0.06) 0%,
    transparent 70%
  );
`;

export default function Hero({ onStartTest, onRestartFresh, onTrySample, totalTests }: HeroProps) {
  const config = useTestConfig();
  const isGsti = config.id === 'gsti';
  const isEmti = config.id === 'emti';
  const typeCodes = useMemo(
    () => config.normalTypes.map((type) => type.code),
    [config.normalTypes],
  );

  const pickRandomType = useCallback(() => {
    if (typeCodes.length === 0) return { code: config.id.toUpperCase(), cn: config.name };
    const code = typeCodes[Math.floor(Math.random() * typeCodes.length)];
    return { code, cn: config.typeLibrary[code]?.cn ?? '' };
  }, [config, typeCodes]);

  const [ticker, setTicker] = useState(() => pickRandomType());
  const [tickerKey, setTickerKey] = useState(0);

  // Fire hero_view exactly once per mount
  const heroViewFired = useRef(false);
  useEffect(() => {
    if (heroViewFired.current) return;
    heroViewFired.current = true;
    trackEvent('hero_view', { testId: config.id });
  }, [config.id]);

  const [draft, setDraft] = useState<SavedDraftMeta | null>(null);
  useEffect(() => {
    setDraft(readDraftMeta(config.id));
  }, [config.id]);

  const handleDiscardDraft = useCallback(() => {
    try { localStorage.removeItem(`${config.id}_quiz_progress`); } catch { /* ignore */ }
    setDraft(null);
    if (onRestartFresh) onRestartFresh();
    else onStartTest();
  }, [config.id, onRestartFresh, onStartTest]);

  const rotateTicker = useCallback(() => {
    setTicker(pickRandomType());
    setTickerKey(k => k + 1);
  }, [pickRandomType]);

  useEffect(() => {
    rotateTicker();
    const id = setInterval(rotateTicker, 4000);
    return () => clearInterval(id);
  }, [rotateTicker]);

  const displayTotal = totalTests > 0 ? totalTests.toLocaleString() : '---';
  const brand = config.id.toUpperCase();
  const typeCount = config.normalTypes.length;
  const questionCount = config.questionCountLabel;

  return (
    <section
      css={heroGlow}
      className="relative flex flex-col items-center justify-center text-center px-4 pt-28 pb-16 min-h-[90vh]"
    >
      {/* Badge */}
      <motion.div
        {...fadeInUp(0)}
        className="flex items-center gap-2 mb-8 px-4 py-2 rounded-full bg-surface border border-border"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
        </span>
        <span className="text-sm text-muted">
          已有 <span className="text-white font-mono font-bold">{displayTotal}</span> 人完成审判
        </span>
      </motion.div>

      {/* Title */}
      <motion.h1
        {...fadeInUp(0.1)}
        className="font-mono font-extrabold text-white leading-none select-none"
        style={{
          fontSize: 'clamp(72px, 12vw, 140px)',
          letterSpacing: '-6px',
        }}
      >
        {brand}
      </motion.h1>

      {/* Divider */}
      <motion.div
        {...fadeInUp(0.2)}
        className="mt-6 mb-6 rounded-full"
        style={{
          width: 60,
          height: 3,
          background: 'linear-gradient(90deg, #ff3b3b, #ffaa00)',
        }}
      />

      {/* Tagline */}
      <motion.p
        {...fadeInUp(0.25)}
        className="text-xl sm:text-2xl text-white/80 mb-3"
      >
        {isGsti ? (
          <>
            性转人格测试。<span className="text-accent font-bold">这个会反串你。</span>
          </>
        ) : isEmti ? (
          <>
            东方 MBTI。<span className="text-accent font-bold">这个会把你写成天干。</span>
          </>
        ) : (
          <>
            MBTI 已经过时。<span className="text-accent font-bold">这个会骂你。</span>
          </>
        )}
      </motion.p>

      {/* Sub */}
      <motion.p
        {...fadeInUp(0.3)}
        className="text-sm text-muted mb-10"
      >
        {isGsti
          ? `${questionCount} 道题 / 6 个维度 / ${typeCount} 种人格 / 男生进女性池，女生进男性池`
          : `${questionCount} 道题 / ${config.dimensionOrder.length} 个维度 / ${typeCount} 种人格 / 每一种都不太客气`}
      </motion.p>

      {/* Stats row */}
      <motion.div
        {...fadeInUp(0.4)}
        className="flex items-center gap-6 sm:gap-10 mb-10"
      >
        <div className="text-center">
          <div className="font-mono text-2xl font-extrabold text-white">{displayTotal}</div>
          <div className="text-xs text-muted mt-1">人已测试</div>
        </div>
        <div className="w-px h-8 bg-border" />
        <div className="text-center">
          <div className="font-mono text-2xl font-extrabold text-white">{typeCount}</div>
          <div className="text-xs text-muted mt-1">种人格</div>
        </div>
        <div className="w-px h-8 bg-border" />
        <div className="text-center">
          <div className="font-mono text-2xl font-extrabold text-white">{questionCount}</div>
          <div className="text-xs text-muted mt-1">道毒题</div>
        </div>
      </motion.div>

      {/* Draft resume banner — shown only if saved progress is within TTL */}
      {draft && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6 px-5 py-4 rounded-xl border border-yellow-500/40 bg-yellow-500/10 text-left max-w-md w-full"
        >
          <div className="mb-3">
            <div className="text-sm font-bold text-yellow-200 mb-1">
              你上次答到第 {draft.currentQ + 1} / {draft.total} 题
            </div>
            <div className="text-xs text-yellow-100/60">
              保存于 {formatElapsed(Date.now() - draft.savedAt)} · 2 小时内继续有效
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onStartTest}
              className="flex-1 bg-yellow-400 text-black py-2.5 rounded-lg text-sm font-bold hover:bg-yellow-300 transition-colors cursor-pointer"
            >
              继续答题
            </button>
            <button
              onClick={handleDiscardDraft}
              className="px-4 py-2.5 rounded-lg text-sm text-yellow-100/70 border border-yellow-500/40 hover:text-white hover:border-yellow-400 transition-colors cursor-pointer"
            >
              重新开始
            </button>
          </div>
        </motion.div>
      )}

      {/* CTA — hidden when draft banner is showing */}
      {!draft && (
        <motion.button
          {...fadeInUp(0.5)}
          onClick={onStartTest}
          whileHover={{ y: -2, boxShadow: '0 8px 30px rgba(255,255,255,0.15)' }}
          whileTap={{ scale: 0.97 }}
          className="bg-white text-black py-4 px-12 rounded-xl font-extrabold text-lg transition-colors cursor-pointer"
        >
          开始测试
        </motion.button>
      )}

      {/* Sample question teaser — only shown when no draft + handler provided */}
      {!draft && onTrySample && (
        <motion.button
          {...fadeInUp(0.55)}
          onClick={onTrySample}
          className="mt-3 text-xs text-muted underline underline-offset-4 hover:text-white transition-colors cursor-pointer"
        >
          先试一题看看？
        </motion.button>
      )}

      {/* Dare text */}
      <motion.div
        {...fadeInUp(0.6)}
        className="mt-4 text-sm"
        style={{ color: '#555' }}
      >
        不敢？那就算了。
      </motion.div>

      {/* Ticker */}
      <motion.div
        {...fadeInUp(0.7)}
        className="mt-12 w-full max-w-sm"
      >
        <div className="bg-surface border border-border rounded-lg px-4 py-3 text-sm text-muted overflow-hidden h-10 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.span
              key={tickerKey}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="whitespace-nowrap"
            >
              刚刚有人测出了{' '}
              <span className="font-mono font-bold text-accent">{ticker.code}</span>{' '}
              {ticker.cn} · {Math.floor(Math.random() * 55) + 5}秒前
            </motion.span>
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  );
}
