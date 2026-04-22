import { useState, useEffect, useCallback } from 'react';
import Nav, { type TabId } from './components/Nav';
import Hero from './components/Hero';
import QuizOverlay from './components/QuizOverlay';
import SampleQuestionModal from './components/SampleQuestionModal';
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
import { emtiConfig } from './data/emti/config';
import { computeResult, type ComputeResultOutput } from './utils/matching';
import { randomAnswerForQuestion } from './utils/quiz';

type ScreenId = 'home' | 'quiz' | 'interstitial' | 'result' | 'compare';

const isTestDomain = typeof window !== 'undefined' && window.location.hostname.includes('sbticc-test');

function AppInner() {
  const config = useTestConfig();
  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [screen, setScreen] = useState<ScreenId>('home');
  const [result, setResult] = useState<ComputeResultOutput | null>(null);
  const [compareData, setCompareData] = useState<DecodedCompare | null>(null);
  const [shareModalBlob, setShareModalBlob] = useState<Blob | null>(null);
  const [shareModalFileName, setShareModalFileName] = useState('emti-share.png');
  const [shareModalUrl, setShareModalUrl] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [showSampleModal, setShowSampleModal] = useState(false);

  const quiz = useQuiz();
  const ranking = useRanking();
  const localHistory = useLocalHistory();

  useEffect(() => {
    ranking.fetchRanking();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const autoFillAndShowResult = useCallback(() => {
    const answers: Record<string, number | number[]> = {};
    config.questions.forEach((q) => {
      answers[q.id] = randomAnswerForQuestion(q);
    });
    const res = computeResult(answers, false, config, null);
    setResult(res);
    setScreen('result');
  }, [config]);

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
    trackEvent('quiz_start', { testId: config.id });
    quiz.startQuiz();
    setScreen('quiz');
  }, [quiz, config.id]);

  const handleSampleProceed = useCallback((qId: string, value: number | number[]) => {
    trackEvent('quiz_start', { testId: config.id, source: 'sample' });
    setShowSampleModal(false);
    quiz.startQuiz(false, { [qId]: value });
    setScreen('quiz');
  }, [quiz, config.id]);

  const handleQuizSubmit = useCallback(() => {
    trackEvent('quiz_complete', { testId: config.id });
    const res = quiz.getResult();
    setResult(res);
    localHistory.saveResult(res.finalType.code);
    setScreen('interstitial');
  }, [quiz, localHistory, config.id]);

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
    trackEvent('share_click', { testId: config.id, platform: 'share' });
    const typeCode = result.finalType.code;
    const typeDef = config.typeLibrary[typeCode] ?? result.finalType;
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
    trackEvent('share_click', { testId: config.id, platform: 'invite' });
    const typeCode = result.finalType.code;
    const typeDef = config.typeLibrary[typeCode] ?? result.finalType;
    const similarity = 'similarity' in result.finalType
      ? (result.finalType as { similarity: number }).similarity
      : 0;
    const encoded = encodeCompare(result.finalType.code, result.levels, similarity, config.dimensionOrder);
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
          alert('对比链接已复制到剪贴板');
        });
      }
    }
  }, [result, config]);

  const handleShareCompare = useCallback(async () => {
    if (!result || !compareData) return;
    const typeCode = result.finalType.code;
    const typeDef = config.typeLibrary[typeCode] ?? result.finalType;
    const similarity = 'similarity' in result.finalType
      ? (result.finalType as { similarity: number }).similarity
      : 0;
    const encoded = encodeCompare(result.finalType.code, result.levels, similarity, config.dimensionOrder);
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
      {!showOverlay && (
        <Nav activeTab={activeTab} onTabChange={setActiveTab} onStartTest={handleStartTest} />
      )}

      {!showOverlay && (
        <main>
          {activeTab === 'home' && (
            <>
              <Hero
                onStartTest={handleStartTest}
                onTrySample={() => setShowSampleModal(true)}
                totalTests={totalTests}
              />
              <div className="mx-auto max-w-2xl -mt-8 mb-14 px-5 py-3 bg-surface/40 border border-border/50 rounded-lg">
                <p className="text-xs text-muted leading-relaxed text-center">
                  <strong className="text-white">免责：</strong>
                  EMTI 是以十天干意象写成的娱乐人格测试，不是八字排盘，也不构成任何命理、心理或人生建议。
                </p>
              </div>
              <ProfilesGallery rankingData={ranking.data} />
              <CompatTable />
            </>
          )}
          {activeTab === 'profiles' && (
            <div className="pt-28"><ProfilesGallery rankingData={ranking.data} /></div>
          )}
          {activeTab === 'compat' && (
            <div className="pt-28"><CompatTable /></div>
          )}
          {activeTab === 'ranking' && (
            <RankingPage ranking={ranking} localHistory={localHistory} onStartTest={handleStartTest} />
          )}
        </main>
      )}

      {screen === 'quiz' && (
        <QuizOverlay quiz={quiz} onSubmit={handleQuizSubmit} onBack={handleBackToHome} />
      )}

      {screen === 'interstitial' && (
        <Interstitial onComplete={handleInterstitialComplete} />
      )}

      {screen === 'result' && result && (
        <ResultPage
          result={result}
          onShare={handleShare}
          onInviteCompare={handleInviteCompare}
          onRestart={handleRestart}
          onHome={handleBackToHome}
          onDebugReroll={autoFillAndShowResult}
          onDebugForceType={(code) => {
            const res = computeResult({}, false, config, code);
            setResult(res);
            setScreen('result');
          }}
        />
      )}

      {showSampleModal && config.questions[0] && (
        <SampleQuestionModal
          question={config.questions[0]}
          onClose={() => setShowSampleModal(false)}
          onProceed={handleSampleProceed}
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
            similarity: 'similarity' in result.finalType
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
          <p className="text-white font-mono font-bold text-3xl mb-1">{compareData.code}</p>
          <p className="text-sm text-muted mb-6">{config.typeLibrary[compareData.code]?.cn || ''}</p>
          <p className="text-sm text-[#999] mb-6">先完成测试，才能查看你们的人格对比</p>
          <button
            onClick={handleStartTest}
            className="bg-accent text-white font-bold py-3 px-8 rounded-xl hover:bg-red-600 transition-colors cursor-pointer"
          >
            开始测试
          </button>
          <button onClick={handleBackToHome} className="mt-3 text-muted underline text-sm cursor-pointer">
            返回首页
          </button>
        </div>
      )}
    </div>
  );
}

export default function EmtiApp() {
  return (
    <TestConfigProvider config={emtiConfig}>
      <AppInner />
    </TestConfigProvider>
  );
}
