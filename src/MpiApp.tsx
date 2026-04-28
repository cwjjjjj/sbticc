// src/MpiApp.tsx
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
import MPIHeroBadge from './components/MPIHeroBadge';
import { useQuiz } from './hooks/useQuiz';
import { useRanking } from './hooks/useRanking';
import { useLocalHistory } from './hooks/useLocalHistory';
import { encodeCompare, decodeCompare, type DecodedCompare } from './utils/compare';
import { generateQR } from './utils/qr';
import { drawShareCard, canvasToBlob, type ShareCardRarity } from './utils/shareCard';
import { TestConfigProvider, useTestConfig } from './data/testConfig';
import { mpiConfig } from './data/mpi/config';
import { computeResult, type ComputeResultOutput } from './utils/matching';
import { randomAnswerForQuestion } from './utils/quiz';
import { hasAiPaidReturn, restorePendingAiResult } from './utils/aiReport';

type ScreenId = 'home' | 'quiz' | 'interstitial' | 'result' | 'compare';
type MpiTabId = 'home' | 'profiles' | 'ranking';

const isTestDomain = window.location.hostname.includes('sbticc-test');

/* ---------- MPI-specific Hero ---------- */

const fadeInUp = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: {
    duration: 0.5,
    delay,
    ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
  },
});

const heroGlow = css`
  background: radial-gradient(
    ellipse 60% 50% at 50% 40%,
    rgba(201, 162, 39, 0.08) 0%,
    transparent 70%
  );
`;

function MpiHero({ onStartTest, totalTests }: { onStartTest: () => void; totalTests: number }) {
  const displayTotal = totalTests > 0 ? totalTests.toLocaleString() : '---';

  return (
    <section
      css={heroGlow}
      className="relative flex flex-col items-center justify-center text-center px-4 pt-28 pb-16 min-h-[90vh]"
    >
      <motion.p
        {...fadeInUp(0)}
        className="text-yellow-400 font-mono font-bold text-sm tracking-widest uppercase mb-4"
      >
        MPI &middot; MONEY PERSONA INDEX
      </motion.p>

      <motion.h1
        {...fadeInUp(0.1)}
        className="font-extrabold text-white leading-tight select-none text-4xl sm:text-5xl mb-4"
      >
        消费人格图鉴
      </motion.h1>

      <motion.div
        {...fadeInUp(0.15)}
        className="mb-6 rounded-full"
        style={{
          width: 60,
          height: 3,
          background: 'linear-gradient(90deg, #c9a227, #ffd66b)',
        }}
      />

      <motion.p
        {...fadeInUp(0.2)}
        className="text-sm sm:text-base text-muted mb-3 max-w-md"
      >
        22 题 &times; 6 维度 &times; 18 种消费事故
      </motion.p>

      <motion.p
        {...fadeInUp(0.25)}
        className="text-sm text-muted mb-8 max-w-md"
      >
        你是怎么把钱输给这个世界的？
      </motion.p>

      <motion.div
        {...fadeInUp(0.3)}
        className="flex items-center gap-2 mb-10 px-4 py-2 rounded-full bg-surface border border-border"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-500 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-yellow-500" />
        </span>
        <span className="text-sm text-muted">
          已有 <span className="text-white font-mono font-bold">{displayTotal}</span> 人完成测试
        </span>
      </motion.div>

      <motion.button
        {...fadeInUp(0.4)}
        onClick={onStartTest}
        whileHover={{ y: -2, boxShadow: '0 8px 30px rgba(201,162,39,0.25)' }}
        whileTap={{ scale: 0.97 }}
        className="bg-white text-black py-4 px-12 rounded-xl font-extrabold text-lg transition-colors cursor-pointer"
      >
        开始测试
      </motion.button>

      <motion.a
        {...fadeInUp(0.5)}
        href="/new"
        className="mt-6 text-sm text-muted hover:text-white transition-colors"
      >
        &larr; 回到人格实验室
      </motion.a>
    </section>
  );
}

/* ---------- ZERO$ 多条件覆写 ---------- */

/**
 * MPI 隐藏类型 ZERO$（金钱绝缘体）的多条件判定：
 *   1. mpi_gate === 1（"我真的想不起来了"）
 *   2. FRUGAL 维度（D3）级别 === 'L'
 *
 * mpiConfig.hiddenTriggerValue 被设为不可能值 (-1)，所以 useQuiz 内部的
 * hiddenTriggered 永远是 false——真正判定放这里（post-compute 覆写，
 * 与 FSI 的 BOSSY 模式一致）。
 */
function maybeOverrideToZero(
  result: ComputeResultOutput,
  answers: Record<string, number | number[]>,
): ComputeResultOutput {
  if (answers['mpi_gate'] !== 1) return result;
  if (result.levels['D3'] !== 'L') return result;
  const zeroDef = mpiConfig.typeLibrary['ZERO$'];
  if (!zeroDef) return result;
  return {
    ...result,
    finalType: {
      ...zeroDef,
      similarity: 100,
    } as typeof result.finalType,
  };
}

/* ---------- MpiAppInner ---------- */

function MpiAppInner() {
  const config = useTestConfig();
  const [activeTab, setActiveTab] = useState<MpiTabId>('home');
  const [screen, setScreen] = useState<ScreenId>('home');
  const [result, setResult] = useState<ComputeResultOutput | null>(null);
  const [compareData, setCompareData] = useState<DecodedCompare | null>(null);
  const [shareModalBlob, setShareModalBlob] = useState<Blob | null>(null);
  const [shareModalFileName, setShareModalFileName] = useState('mpi-share.png');
  const [shareModalUrl, setShareModalUrl] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);

  const quiz = useQuiz();
  const ranking = useRanking();
  const localHistory = useLocalHistory();

  useEffect(() => {
    if (!hasAiPaidReturn()) return;
    const pending = restorePendingAiResult(config.id);
    if (pending) {
      setResult(pending);
      setScreen('result');
    }
  }, [config.id]);

  useEffect(() => {
    ranking.fetchRanking();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const autoFillAndShowResult = useCallback(() => {
    const allQs = [...config.questions, ...config.specialQuestions];
    const answers: Record<string, number | number[]> = {};
    allQs.forEach((q) => {
      answers[q.id] = randomAnswerForQuestion(q);
    });
    let res = computeResult(answers, false, config, null);
    res = maybeOverrideToZero(res, answers);
    setResult(res);
    setScreen('result');
  }, [config]);

  // Hash routing
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
    let res = quiz.getResult();
    // 多条件 ZERO$ 覆写：mpi_gate=1 + FRUGAL(D3)=L
    res = maybeOverrideToZero(res, quiz.answers);
    setResult(res);
    localHistory.saveResult(res.finalType.code);
    setScreen('interstitial');
  }, [quiz, localHistory]);

  const handleInterstitialComplete = useCallback(() => {
    if (compareData) setScreen('compare');
    else setScreen('result');
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
    const similarity =
      'similarity' in result.finalType
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
          alert('对比链接已复制到剪贴板！');
        });
      }
    }
  }, [result, config]);

  const handleDebugReroll = useCallback(() => {
    autoFillAndShowResult();
  }, [autoFillAndShowResult]);

  const handleDebugForceType = useCallback(
    (code: string) => {
      const allQs = [...config.questions, ...config.specialQuestions];
      const answers: Record<string, number | number[]> = {};
      allQs.forEach((q) => {
        answers[q.id] = randomAnswerForQuestion(q);
      });
      const res = computeResult(answers, false, config, code);
      setResult(res);
      setScreen('result');
    },
    [config],
  );

  const handleShareCompare = useCallback(async () => {
    if (!result || !compareData) return;
    const typeCode = result.finalType.code;
    const typeDef = config.typeLibrary[typeCode] ?? result.finalType;
    const similarity =
      'similarity' in result.finalType
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

  const handleTabChange = useCallback((tab: TabId) => {
    if (tab === 'home' || tab === 'profiles' || tab === 'ranking') setActiveTab(tab as MpiTabId);
  }, []);

  const totalTests = ranking.data?.total ?? 0;
  const showOverlay = screen !== 'home';

  return (
    <div className="min-h-screen bg-bg text-white font-sans">
      {!showOverlay && (
        <Nav
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onStartTest={handleStartTest}
          tabs={[{ id: "home", label: "首页" }, { id: "profiles", label: "人格介绍" }, { id: "ranking", label: "全站排行" }]}
        />
      )}

      {!showOverlay && (
        <main>
          {activeTab === 'home' && (
            <>
              <MpiHero onStartTest={handleStartTest} totalTests={totalTests} />
              <div className="mx-auto max-w-2xl -mt-8 mb-14 px-5 py-3 bg-surface/40 border border-border/50 rounded-lg">
                <p className="text-xs text-muted leading-relaxed text-center">
                  <strong className="text-white">免责：</strong>
                  MPI 所有类型描述都是消费行为的戏谑梳理，仅供娱乐，不构成任何消费建议、投资建议或理财建议。请保持笑一笑就过的心态。
                </p>
                <p className="text-xs text-yellow-400/80 mt-2 leading-relaxed text-center">
                  本测试仅供成年人自嘲娱乐，不构成任何消费、理财、投资建议。
                </p>
              </div>
            </>
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

      {screen === 'quiz' && (
        <QuizOverlay
          quiz={quiz}
          onSubmit={handleQuizSubmit}
          onBack={handleBackToHome}
        />
      )}

      {screen === 'interstitial' && (
        <Interstitial onComplete={handleInterstitialComplete} />
      )}

      {screen === 'result' && result && (
        <ResultPage
          result={result}
          testBadge={
            <MPIHeroBadge
              typeCode={result.finalType.code}
              typeCn={result.finalType.cn}
            />
          }
          onShare={handleShare}
          onInviteCompare={handleInviteCompare}
          onRestart={handleRestart}
          onHome={handleBackToHome}
          onDebugReroll={handleDebugReroll}
          onDebugForceType={handleDebugForceType}
        />
      )}

      {showShareModal && (
        <ShareModal
          imageBlob={shareModalBlob}
          fileName={shareModalFileName}
          shareUrl={shareModalUrl}
          onClose={() => setShowShareModal(false)}
        />
      )}

      {screen === 'compare' && compareData && result && (
        <ComparePage
          myData={{
            code: result.finalType.code,
            levels: result.levels,
            similarity:
              'similarity' in result.finalType
                ? (result.finalType as { similarity: number }).similarity
                : 0,
          }}
          theirData={compareData}
          onStartTest={handleRestart}
          onShareCompare={handleShareCompare}
        />
      )}

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
            先完成测试，才能查看你们的人格对比
          </p>
          <button
            onClick={handleStartTest}
            className="bg-yellow-500 text-black font-bold py-3 px-8 rounded-xl hover:bg-yellow-400 transition-colors cursor-pointer"
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

export default function MpiApp() {
  return (
    <TestConfigProvider config={mpiConfig}>
      <MpiAppInner />
    </TestConfigProvider>
  );
}
