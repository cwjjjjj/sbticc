import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { css } from '@emotion/react';
import Nav, { type TabId } from './components/Nav';
import ProfilesGallery from './components/ProfilesGallery';
import QuizOverlay from './components/QuizOverlay';
import Interstitial from './components/Interstitial';
import ResultPage from './components/ResultPage';
import ComparePage from './components/ComparePage';
import ShareModal from './components/ShareModal';
import RankingPage from './components/RankingPage';
import { useQuiz } from './hooks/useQuiz';
import { useRanking } from './hooks/useRanking';
import { useLocalHistory } from './hooks/useLocalHistory';
import { encodeCompare, decodeCompare, type DecodedCompare } from './utils/compare';
import { generateQR } from './utils/qr';
import { drawShareCard, canvasToBlob, type ShareCardRarity } from './utils/shareCard';
import { TestConfigProvider, useTestConfig } from './data/testConfig';
import { desireConfig } from './data/desire/config';
import { computeResult, type ComputeResultOutput } from './utils/matching';
import { randomAnswerForQuestion } from './utils/quiz';

type ScreenId = 'home' | 'quiz' | 'interstitial' | 'result' | 'compare';

const isTestDomain = window.location.hostname.includes('sbticc-test');

/* ---------- Desire-specific Hero (rose/pink gradient glow) ---------- */

const fadeInUp = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
});

const heroGlow = css`
  background: radial-gradient(
    ellipse 60% 50% at 50% 40%,
    rgba(255, 59, 130, 0.08) 0%,
    rgba(180, 40, 100, 0.03) 40%,
    transparent 70%
  );
`;

function DesireHero({ onStartTest, totalTests }: { onStartTest: () => void; totalTests: number }) {
  const displayTotal = totalTests > 0 ? totalTests.toLocaleString() : '---';

  return (
    <section
      css={heroGlow}
      className="relative flex flex-col items-center justify-center text-center px-4 pt-28 pb-16 min-h-[90vh]"
    >
      {/* Accent subtitle */}
      <motion.p
        {...fadeInUp(0)}
        className="font-mono font-bold text-sm tracking-widest uppercase mb-4"
        style={{ color: '#ff3b82' }}
      >
        DESIRE SPECTRUM
      </motion.p>

      {/* Main title */}
      <motion.h1
        {...fadeInUp(0.1)}
        className="font-extrabold text-white leading-tight select-none text-4xl sm:text-5xl mb-4"
      >
        欲望图谱
      </motion.h1>

      {/* Divider */}
      <motion.div
        {...fadeInUp(0.15)}
        className="mb-6 rounded-full"
        style={{
          width: 60,
          height: 3,
          background: 'linear-gradient(90deg, #ff3b82, #ff6b9d)',
        }}
      />

      {/* Description */}
      <motion.p
        {...fadeInUp(0.2)}
        className="text-sm sm:text-base text-muted mb-8 max-w-md"
      >
        6个维度 &times; 20种欲望人格 — 关上门之后，你是谁？
      </motion.p>

      {/* Total tests counter */}
      <motion.div
        {...fadeInUp(0.3)}
        className="flex items-center gap-2 mb-10 px-4 py-2 rounded-full bg-surface border border-border"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-500 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-pink-500" />
        </span>
        <span className="text-sm text-muted">
          已有 <span className="text-white font-mono font-bold">{displayTotal}</span> 人完成测试
        </span>
      </motion.div>

      {/* CTA */}
      <motion.button
        {...fadeInUp(0.4)}
        onClick={onStartTest}
        whileHover={{ y: -2, boxShadow: '0 8px 30px rgba(255, 59, 130, 0.25)' }}
        whileTap={{ scale: 0.97 }}
        className="text-white py-4 px-12 rounded-xl font-extrabold text-lg transition-colors cursor-pointer"
        style={{ background: 'linear-gradient(135deg, #ff3b82, #ff6b9d)' }}
      >
        开始测试
      </motion.button>

      {/* Back link */}
      <motion.a
        {...fadeInUp(0.5)}
        href="/new"
        className="mt-6 text-sm text-muted hover:text-white transition-colors"
      >
        &larr; 回到 SBTI 人格测试
      </motion.a>
    </section>
  );
}

/* ---------- Desire Nav (simpler: only home + ranking) ---------- */

type DesireTabId = 'home' | 'profiles' | 'ranking';

/* ---------- DesireAppInner ---------- */

function DesireAppInner() {
  const config = useTestConfig();
  const [activeTab, setActiveTab] = useState<DesireTabId>('home');
  const [screen, setScreen] = useState<ScreenId>('home');
  const [result, setResult] = useState<ComputeResultOutput | null>(null);
  const [compareData, setCompareData] = useState<DecodedCompare | null>(null);
  const [shareModalBlob, setShareModalBlob] = useState<Blob | null>(null);
  const [shareModalFileName, setShareModalFileName] = useState('desire-share.png');
  const [shareModalUrl, setShareModalUrl] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);

  const quiz = useQuiz();
  const ranking = useRanking();
  const localHistory = useLocalHistory();

  // Fetch ranking data on mount
  useEffect(() => {
    ranking.fetchRanking();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Auto-fill all questions with random answers and compute result.
   */
  const autoFillAndShowResult = useCallback(() => {
    const allQs = [...config.questions, ...config.specialQuestions];
    const answers: Record<string, number | number[]> = {};
    allQs.forEach((q) => {
      answers[q.id] = randomAnswerForQuestion(q);
    });
    const res = computeResult(answers, false, config, null);
    setResult(res);
    setScreen('result');
  }, [config]);

  // Hash routing on mount
  useEffect(() => {
    const hash = window.location.hash;

    if (hash === '#test' || isTestDomain) {
      autoFillAndShowResult();
    } else if (hash.startsWith('#compare=')) {
      const b64 = hash.slice('#compare='.length);
      const decoded = decodeCompare(b64, config.dimensionOrder);
      if (decoded) {
        setCompareData(decoded);
        setScreen('compare');
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleStartTest = useCallback(() => {
    quiz.startQuiz();
    setScreen('quiz');
  }, [quiz]);

  const handleQuizSubmit = useCallback(() => {
    const res = quiz.getResult();
    setResult(res);
    localHistory.saveResult(res.finalType.code);
    setScreen('interstitial');
  }, [quiz, localHistory]);

  const handleInterstitialComplete = useCallback(() => {
    if (compareData) {
      setScreen('compare');
    } else {
      setScreen('result');
    }
  }, [compareData]);

  const handleBackToHome = useCallback(() => {
    setScreen('home');
    setResult(null);
    setCompareData(null);
    window.location.hash = '';
  }, []);

  const handleRestart = useCallback(() => {
    quiz.startQuiz();
    setResult(null);
    setScreen('quiz');
  }, [quiz]);

  const handleShare = useCallback(async (rarity?: ShareCardRarity) => {
    if (!result) return;
    const typeCode = result.finalType.code;
    const typeDef = config.typeLibrary[typeCode] ?? result.finalType;
    // Phase B virality: QR points to the type page (not test home).
    const typePageUrl = `${config.prodBaseUrl}/types/${config.id}/${typeCode}?s=share`;
    const qrDataUrl = generateQR(typePageUrl);
    try {
      const canvas = await drawShareCard(typeDef, result, qrDataUrl, 'share', config, false, rarity);
      const blob = await canvasToBlob(canvas);
      setShareModalBlob(blob);
      setShareModalFileName(`${config.id}-${typeCode}.png`);
      setShareModalUrl(typePageUrl);
      setShowShareModal(true);
    } catch {
      alert('分享图生成失败');
    }
  }, [result, config]);

  const handleInviteCompare = useCallback(async (rarity?: ShareCardRarity) => {
    if (!result) return;
    const typeCode = result.finalType.code;
    const typeDef = config.typeLibrary[typeCode] ?? result.finalType;
    const similarity = 'similarity' in result.finalType
      ? (result.finalType as { similarity: number }).similarity
      : 0;
    const encoded = encodeCompare(
      result.finalType.code,
      result.levels,
      similarity,
      config.dimensionOrder,
    );
    const compareUrl = `${config.prodBaseUrl}${config.basePath}#compare=${encoded}`;
    const qrDataUrl = generateQR(compareUrl);
    try {
      const canvas = await drawShareCard(typeDef, result, qrDataUrl, 'invite', config, false, rarity);
      const blob = await canvasToBlob(canvas);
      setShareModalBlob(blob);
      setShareModalFileName(`${config.id}-invite-${typeCode}.png`);
      setShareModalUrl(compareUrl);
      setShowShareModal(true);
    } catch {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(compareUrl).then(() => {
          alert('对比链接已复制到剪贴板！发给好友即可对比人格。');
        }).catch(() => {
          prompt('复制以下链接发给好友：', compareUrl);
        });
      } else {
        prompt('复制以下链接发给好友：', compareUrl);
      }
    }
  }, [result, config]);

  const handleDebugReroll = useCallback(() => {
    autoFillAndShowResult();
  }, [autoFillAndShowResult]);

  const handleDebugForceType = useCallback((code: string) => {
    const allQs = [...config.questions, ...config.specialQuestions];
    const answers: Record<string, number | number[]> = {};
    allQs.forEach((q) => {
      answers[q.id] = randomAnswerForQuestion(q);
    });
    const res = computeResult(answers, false, config, code);
    setResult(res);
    setScreen('result');
  }, [config]);

  const handleShareCompare = useCallback(async () => {
    if (!result || !compareData) return;
    const typeCode = result.finalType.code;
    const typeDef = config.typeLibrary[typeCode] ?? result.finalType;
    const similarity = 'similarity' in result.finalType
      ? (result.finalType as { similarity: number }).similarity
      : 0;
    const encoded = encodeCompare(
      result.finalType.code,
      result.levels,
      similarity,
      config.dimensionOrder,
    );
    const compareUrl = `${config.prodBaseUrl}${config.basePath}#compare=${encoded}`;
    const qrDataUrl = generateQR(compareUrl);
    try {
      const canvas = await drawShareCard(typeDef, result, qrDataUrl, 'invite', config);
      const blob = await canvasToBlob(canvas);
      setShareModalBlob(blob);
      setShareModalFileName(`${config.id}-compare-${typeCode}.png`);
      setShareModalUrl(compareUrl);
      setShowShareModal(true);
    } catch {
      alert('分享图生成失败');
    }
  }, [result, compareData, config]);

  // Adapt DesireTabId to Nav's TabId
  const handleTabChange = useCallback((tab: TabId) => {
    if (tab === 'home' || tab === 'profiles' || tab === 'ranking') {
      setActiveTab(tab as DesireTabId);
    }
  }, []);

  const totalTests = ranking.data?.total ?? 0;
  const showOverlay = screen === 'quiz' || screen === 'interstitial' || screen === 'result' || screen === 'compare';

  return (
    <div className="min-h-screen bg-bg text-white font-sans">
      {/* Nav - hidden during overlays */}
      {!showOverlay && (
        <Nav
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onStartTest={handleStartTest}
          tabs={[{ id: "home", label: "首页" }, { id: "profiles", label: "人格介绍" }, { id: "ranking", label: "全站排行" }]}
        />
      )}

      {/* Tab content */}
      {!showOverlay && (
        <main>
          {activeTab === 'home' && (
            <DesireHero onStartTest={handleStartTest} totalTests={totalTests} />
          )}
          {activeTab === 'profiles' && (
            <div className="pt-28">
              <ProfilesGallery rankingData={ranking.data} />
            </div>
          )}
          {activeTab === 'ranking' && (
            <RankingPage
              ranking={ranking}
              localHistory={localHistory}
              onStartTest={handleStartTest}
            />
          )}
        </main>
      )}

      {/* Quiz overlay */}
      {screen === 'quiz' && (
        <QuizOverlay
          quiz={quiz}
          onSubmit={handleQuizSubmit}
          onBack={handleBackToHome}
        />
      )}

      {/* Interstitial overlay */}
      {screen === 'interstitial' && (
        <Interstitial onComplete={handleInterstitialComplete} />
      )}

      {/* Result overlay */}
      {screen === 'result' && result && (
        <ResultPage
          result={result}
          onShare={handleShare}
          onInviteCompare={handleInviteCompare}
          onRestart={handleRestart}
          onHome={handleBackToHome}
          onDebugReroll={handleDebugReroll}
          onDebugForceType={handleDebugForceType}
        />
      )}

      {/* Share modal */}
      {showShareModal && (
        <ShareModal
          imageBlob={shareModalBlob}
          fileName={shareModalFileName}
          shareUrl={shareModalUrl}
          onClose={() => setShowShareModal(false)}
        />
      )}

      {/* Compare overlay */}
      {screen === 'compare' && compareData && result && (
        <ComparePage
          myData={{
            code: result.finalType.code,
            levels: result.levels,
            similarity: 'similarity' in result.finalType
              ? (result.finalType as { similarity: number }).similarity
              : 0,
          }}
          theirData={compareData}
          onStartTest={handleRestart}
          onShareCompare={handleShareCompare}
        />
      )}

      {/* Compare overlay - no local result yet, prompt to test */}
      {screen === 'compare' && compareData && !result && (
        <div className="fixed inset-0 z-[200] bg-bg flex flex-col items-center justify-center px-4">
          <p className="text-lg text-muted mb-2">对方人格：</p>
          <p className="text-white font-mono font-bold text-3xl mb-1">
            {compareData.code}
          </p>
          <p className="text-sm text-muted mb-6">
            {config.typeLibrary[compareData.code]?.cn || ''}
          </p>
          <p className="text-sm text-[#999] mb-6">
            先完成测试，才能查看你们的欲望人格对比
          </p>
          <button
            onClick={handleStartTest}
            className="text-white font-bold py-3 px-8 rounded-xl transition-colors cursor-pointer"
            style={{ background: 'linear-gradient(135deg, #ff3b82, #ff6b9d)' }}
          >
            开始测试
          </button>
          <button
            onClick={handleBackToHome}
            className="mt-3 text-muted underline text-sm cursor-pointer"
          >
            返回首页
          </button>
        </div>
      )}
    </div>
  );
}

export default function DesireApp() {
  return (
    <TestConfigProvider config={desireConfig}>
      <DesireAppInner />
    </TestConfigProvider>
  );
}
