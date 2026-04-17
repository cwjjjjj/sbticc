// src/GstiApp.tsx
import { useState, useEffect, useCallback } from 'react';
import Nav, { type TabId } from './components/Nav';
import Hero from './components/Hero';
import QuizOverlay from './components/QuizOverlay';
import Interstitial from './components/Interstitial';
import ResultPage from './components/ResultPage';
import ComparePage from './components/ComparePage';
import ShareModal from './components/ShareModal';
import RankingPage from './components/RankingPage';
import ProfilesGallery from './components/ProfilesGallery';
import CompatTable from './components/CompatTable';
import GenderPicker from './components/GenderPicker';
import { useQuiz } from './hooks/useQuiz';
import { useRanking } from './hooks/useRanking';
import { useLocalHistory } from './hooks/useLocalHistory';
import { encodeCompare, decodeCompare, type DecodedCompare } from './utils/compare';
import { generateQR } from './utils/qr';
import { drawShareCard, canvasToBlob } from './utils/shareCard';
import { TestConfigProvider, useTestConfig } from './data/testConfig';
import { gstiConfig } from './data/gsti/config';
import { computeResult, type ComputeResultOutput } from './utils/matching';

type ScreenId = 'home' | 'picker' | 'quiz' | 'interstitial' | 'result' | 'compare';

function AppInner() {
  const config = useTestConfig();
  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [screen, setScreen] = useState<ScreenId>('home');
  const [result, setResult] = useState<ComputeResultOutput | null>(null);
  const [compareData, setCompareData] = useState<DecodedCompare | null>(null);
  const [shareModalBlob, setShareModalBlob] = useState<Blob | null>(null);
  const [shareModalFileName, setShareModalFileName] = useState('gsti-share.png');
  const [shareModalUrl, setShareModalUrl] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);

  const quiz = useQuiz();
  const ranking = useRanking();
  const localHistory = useLocalHistory();

  useEffect(() => { ranking.fetchRanking(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.startsWith('#compare=')) {
      const b64 = hash.slice('#compare='.length);
      const decoded = decodeCompare(b64, config.dimensionOrder);
      if (decoded) { setCompareData(decoded); setScreen('compare'); }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleStartTest = useCallback(() => {
    // 如未选择性别 → 先去 picker；已选过 → 直接开 quiz
    if (quiz.gender === 'unspecified') {
      setScreen('picker');
    } else {
      quiz.startQuiz();
      setScreen('quiz');
    }
  }, [quiz]);

  const handleGenderPick = useCallback((g: typeof quiz.gender) => {
    quiz.setGender(g);
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
    if (compareData) setScreen('compare');
    else setScreen('result');
  }, [compareData]);

  const handleBackToHome = useCallback(() => {
    setScreen('home'); setResult(null); setCompareData(null);
    window.location.hash = '';
  }, []);

  const handleRestart = useCallback(() => {
    // 重测时重新选性别
    setScreen('picker');
    setResult(null);
  }, []);

  const handleShare = useCallback(async () => {
    if (!result) return;
    const typeCode = result.finalType.code;
    const typeDef = config.typeLibrary[typeCode] ?? result.finalType;
    const pageUrl = `${config.prodBaseUrl}${config.basePath}`;
    const qrDataUrl = generateQR(pageUrl);
    try {
      const canvas = await drawShareCard(typeDef, result, qrDataUrl, 'share', config);
      const blob = await canvasToBlob(canvas);
      setShareModalBlob(blob);
      setShareModalFileName(`${config.id}-${typeCode}.png`);
      setShareModalUrl(pageUrl);
      setShowShareModal(true);
    } catch { alert('\u5206\u4eab\u56fe\u751f\u6210\u5931\u8d25'); }
  }, [result, config]);

  const handleInviteCompare = useCallback(async () => {
    if (!result) return;
    const typeCode = result.finalType.code;
    const typeDef = config.typeLibrary[typeCode] ?? result.finalType;
    const similarity = 'similarity' in result.finalType
      ? (result.finalType as { similarity: number }).similarity : 0;
    const encoded = encodeCompare(result.finalType.code, result.levels, similarity, config.dimensionOrder);
    const compareUrl = `${config.prodBaseUrl}${config.basePath}#compare=${encoded}`;
    const qrDataUrl = generateQR(compareUrl);
    try {
      const canvas = await drawShareCard(typeDef, result, qrDataUrl, 'invite', config);
      const blob = await canvasToBlob(canvas);
      setShareModalBlob(blob);
      setShareModalFileName(`${config.id}-invite-${typeCode}.png`);
      setShareModalUrl(compareUrl);
      setShowShareModal(true);
    } catch {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(compareUrl).then(() => {
          alert('\u5bf9\u6bd4\u94fe\u63a5\u5df2\u590d\u5236\u5230\u526a\u8d34\u677f');
        });
      }
    }
  }, [result, config]);

  const totalTests = ranking.data?.total ?? 0;
  const showOverlay = screen !== 'home';

  return (
    <div className="min-h-screen bg-bg text-white font-sans">
      {!showOverlay && (
        <Nav activeTab={activeTab} onTabChange={setActiveTab} onStartTest={handleStartTest} />
      )}

      {!showOverlay && (
        <main>
          {activeTab === 'home' && (
            <>
              <Hero onStartTest={handleStartTest} totalTests={totalTests} />
              <div className="mx-auto max-w-2xl -mt-8 mb-14 px-5 py-3 bg-surface/40 border border-border/50 rounded-lg">
                <p className="text-xs text-muted leading-relaxed text-center">
                  <strong className="text-white">免责：</strong>
                  GSTI 是对性别标签的戏谑反串，所有类型描述都是娱乐段子，不构成对任何人的真实评价。笑一下就过，别拿它给自己或别人定性。
                </p>
              </div>
              <ProfilesGallery rankingData={ranking.data} />
            </>
          )}
          {activeTab === 'profiles' && (
            <div className="pt-28"><ProfilesGallery rankingData={ranking.data} /></div>
          )}
          {activeTab === 'ranking' && (
            <RankingPage ranking={ranking} localHistory={localHistory} onStartTest={handleStartTest} />
          )}
          {activeTab === 'compat' && (
            <div className="pt-28"><CompatTable /></div>
          )}
        </main>
      )}

      {screen === 'picker' && (
        <GenderPicker onPick={handleGenderPick} onClose={handleBackToHome} />
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
          gender={quiz.gender}
          onShare={handleShare}
          onInviteCompare={handleInviteCompare}
          onRestart={handleRestart}
          onHome={handleBackToHome}
          onDebugReroll={() => { handleStartTest(); }}
          onDebugForceType={(code) => {
            const res = computeResult({}, false, config, code, quiz.gender);
            setResult(res); setScreen('result');
          }}
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
              ? (result.finalType as { similarity: number }).similarity : 0,
          }}
          theirData={compareData}
          onStartTest={handleRestart}
          onShareCompare={handleShare}
        />
      )}
    </div>
  );
}

export default function GstiApp() {
  return (
    <TestConfigProvider config={gstiConfig}>
      <AppInner />
    </TestConfigProvider>
  );
}
