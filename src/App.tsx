import { useState, useEffect, useCallback } from 'react';
import Nav, { type TabId } from './components/Nav';
import Hero from './components/Hero';
import TypeCardsPreview from './components/TypeCardsPreview';
import QuizOverlay from './components/QuizOverlay';
import Interstitial from './components/Interstitial';
import ResultPage from './components/ResultPage';
import ComparePage from './components/ComparePage';
import ShareModal from './components/ShareModal';
import RankingPage from './components/RankingPage';
import ProfilesGallery from './components/ProfilesGallery';
import CompatTable from './components/CompatTable';
import { useQuiz } from './hooks/useQuiz';
import { useRanking } from './hooks/useRanking';
import { useLocalHistory } from './hooks/useLocalHistory';
import { encodeCompare, decodeCompare, type DecodedCompare } from './utils/compare';
import { generateQR } from './utils/qr';
import { drawShareCard, canvasToBlob, type ShareCardRarity } from './utils/shareCard';
import { trackEvent } from './hooks/useAnalytics';
import { TestConfigProvider, useTestConfig } from './data/testConfig';
import { sbtiConfig } from './data/sbti/config';
import { computeResult, type ComputeResultOutput } from './utils/matching';
import { randomAnswerForQuestion } from './utils/quiz';

type ScreenId = 'home' | 'quiz' | 'interstitial' | 'result' | 'compare';

const isTestDomain = window.location.hostname.includes('sbticc-test');

/*
 * =========================================================================
 * PAYWALL (DISABLED)
 * =========================================================================
 * The paywall overlay, Stripe checkout integration, and Chinese QR payment
 * (面包多/爱发电) code exists but is currently disabled. The paywall would
 * normally gate full result details behind a $0.99 payment.
 *
 * To re-enable:
 * 1. Set isPaid state based on Stripe session verification (/api/verify)
 * 2. Show PaywallOverlay when result is displayed and !isPaid
 * 3. On successful payment, set isPaid = true and reveal full results
 *
 * Related API routes: /api/create-checkout.js, /api/verify.js
 * =========================================================================
 */

function AppInner() {
  const config = useTestConfig();
  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [screen, setScreen] = useState<ScreenId>('home');
  const [result, setResult] = useState<ComputeResultOutput | null>(null);
  const [compareData, setCompareData] = useState<DecodedCompare | null>(null);
  const [shareModalBlob, setShareModalBlob] = useState<Blob | null>(null);
  const [shareModalFileName, setShareModalFileName] = useState('sbti-share.png');
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
   * Used for #test hash and test domain auto-fill.
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
      // Debug mode: auto-fill random answers, compute result, show result
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
    trackEvent('quiz_start', { testId: config.id });
    quiz.startQuiz();
    setScreen('quiz');
  }, [quiz, config.id]);

  const handleQuizSubmit = useCallback(() => {
    trackEvent('quiz_complete', { testId: config.id });
    // Compute result immediately but show interstitial first
    const res = quiz.getResult();
    setResult(res);
    localHistory.saveResult(res.finalType.code);
    setScreen('interstitial');
  }, [quiz, localHistory, config.id]);

  const handleInterstitialComplete = useCallback(() => {
    // If we have compare data (user came from a compare link), go to compare screen
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
    trackEvent('share_click', { testId: config.id, platform: 'share' });
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
      alert('\u5206\u4eab\u56fe\u751f\u6210\u5931\u8d25');
    }
  }, [result, config]);

  const handleInviteCompare = useCallback(async (rarity?: ShareCardRarity) => {
    if (!result) return;
    trackEvent('share_click', { testId: config.id, platform: 'invite' });
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
      // Fallback to clipboard
      if (navigator.clipboard) {
        navigator.clipboard.writeText(compareUrl).then(() => {
          alert('\u5bf9\u6bd4\u94fe\u63a5\u5df2\u590d\u5236\u5230\u526a\u8d34\u677f\uff01\u53d1\u7ed9\u597d\u53cb\u5373\u53ef\u5bf9\u6bd4\u4eba\u683c\u3002');
        }).catch(() => {
          prompt('\u590d\u5236\u4ee5\u4e0b\u94fe\u63a5\u53d1\u7ed9\u597d\u53cb\uff1a', compareUrl);
        });
      } else {
        prompt('\u590d\u5236\u4ee5\u4e0b\u94fe\u63a5\u53d1\u7ed9\u597d\u53cb\uff1a', compareUrl);
      }
    }
  }, [result, config]);

  // Debug handlers
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

  const totalTests = ranking.data?.total ?? 0;
  const showOverlay = screen === 'quiz' || screen === 'interstitial' || screen === 'result' || screen === 'compare';

  return (
    <div className="min-h-screen bg-bg text-white font-sans">
      {/* Nav - hidden during overlays */}
      {!showOverlay && (
        <Nav
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onStartTest={handleStartTest}
        />
      )}

      {/* Tab content */}
      {!showOverlay && (
        <main>
          {activeTab === 'home' && (
            <>
              <Hero onStartTest={handleStartTest} totalTests={totalTests} />
              <a
                href="/gsti"
                className="block mx-auto max-w-2xl -mt-8 mb-14 px-5 py-4 bg-surface border border-accent/40 rounded-lg hover:border-accent hover:bg-surface-2 transition-colors group"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs px-2 py-0.5 rounded-md bg-accent text-white font-bold">
                    NEW
                  </span>
                  <span className="text-white font-bold">GSTI · 性转版</span>
                </div>
                <p className="text-sm text-muted leading-relaxed">
                  刚测完本体，再去看看性转后会被扣成什么物种。男生进女性池，女生进男性池，反差到有点冒犯。
                </p>
                <span className="text-xs text-accent mt-3 inline-block group-hover:underline">
                  立即体验 →
                </span>
              </a>
              <TypeCardsPreview />
              <ProfilesGallery rankingData={ranking.data} />
              <CompatTable />
            </>
          )}
          {activeTab === 'profiles' && (
            <div className="pt-28">
              <ProfilesGallery rankingData={ranking.data} />
            </div>
          )}
          {activeTab === 'compat' && (
            <div className="pt-28">
              <CompatTable />
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

      {/* Compare overlay — no local result yet, prompt to test */}
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
            className="bg-accent text-white font-bold py-3 px-8 rounded-xl hover:bg-red-600 transition-colors cursor-pointer"
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

export default function App() {
  return (
    <TestConfigProvider config={sbtiConfig}>
      <AppInner />
    </TestConfigProvider>
  );
}
