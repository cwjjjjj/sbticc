import { useState, useEffect, useCallback } from 'react';
import Nav, { type TabId } from './components/Nav';
import Hero from './components/Hero';
import TypeCardsPreview from './components/TypeCardsPreview';
import QuizOverlay from './components/QuizOverlay';
import Interstitial from './components/Interstitial';
import ResultPage from './components/ResultPage';
import ShareModal from './components/ShareModal';
import RankingPage from './components/RankingPage';
import ProfilesGallery from './components/ProfilesGallery';
import CompatTable from './components/CompatTable';
import { useQuiz } from './hooks/useQuiz';
import { useRanking } from './hooks/useRanking';
import { useLocalHistory } from './hooks/useLocalHistory';
import { encodeCompare, decodeCompare, type DecodedCompare } from './utils/compare';
import { generateQR } from './utils/qr';
import { drawShareCard, canvasToBlob } from './utils/shareCard';
import { TYPE_LIBRARY } from './data/types';
import { PROD_BASE_URL } from './theme/tokens';
import type { ComputeResultOutput } from './utils/matching';

type ScreenId = 'home' | 'quiz' | 'interstitial' | 'result' | 'compare';

export default function App() {
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

  // Hash routing on mount
  useEffect(() => {
    const hash = window.location.hash;

    if (hash === '#test') {
      // Debug mode: auto-fill random answers, compute result
      quiz.startQuiz(true);
      // Fill with random answers after a tick (so questions are initialized)
      setTimeout(() => {
        quiz.visibleQuestions.forEach((q) => {
          const maxVal = q.options[q.options.length - 1].value;
          quiz.answer(q.id, Math.floor(Math.random() * maxVal) + 1);
        });
      }, 0);
    } else if (hash.startsWith('#compare=')) {
      const b64 = hash.slice('#compare='.length);
      const decoded = decodeCompare(b64);
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
    // Compute result immediately but show interstitial first
    const res = quiz.getResult();
    setResult(res);
    localHistory.saveResult(res.finalType.code);
    setScreen('interstitial');
  }, [quiz, localHistory]);

  const handleInterstitialComplete = useCallback(() => {
    setScreen('result');
  }, []);

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

  const handleShare = useCallback(async () => {
    if (!result) return;
    const typeCode = result.finalType.code;
    const typeDef = TYPE_LIBRARY[typeCode] ?? result.finalType;
    const pageUrl = `${PROD_BASE_URL}`;
    const qrDataUrl = generateQR(pageUrl);
    try {
      const canvas = await drawShareCard(typeDef, result, qrDataUrl, 'share');
      const blob = await canvasToBlob(canvas);
      setShareModalBlob(blob);
      setShareModalFileName(`sbti-${typeCode}.png`);
      setShareModalUrl(pageUrl);
      setShowShareModal(true);
    } catch {
      alert('\u5206\u4eab\u56fe\u751f\u6210\u5931\u8d25');
    }
  }, [result]);

  const handleInviteCompare = useCallback(async () => {
    if (!result) return;
    const typeCode = result.finalType.code;
    const typeDef = TYPE_LIBRARY[typeCode] ?? result.finalType;
    const similarity = 'similarity' in result.finalType
      ? (result.finalType as { similarity: number }).similarity
      : 0;
    const encoded = encodeCompare(
      result.finalType.code,
      result.levels,
      similarity,
    );
    const compareUrl = `${PROD_BASE_URL}#compare=${encoded}`;
    const qrDataUrl = generateQR(compareUrl);
    try {
      const canvas = await drawShareCard(typeDef, result, qrDataUrl, 'invite');
      const blob = await canvasToBlob(canvas);
      setShareModalBlob(blob);
      setShareModalFileName(`sbti-invite-${typeCode}.png`);
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
  }, [result]);

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
              <TypeCardsPreview />
              <ProfilesGallery rankingData={ranking.data} />
              <CompatTable />
            </>
          )}
          {activeTab === 'profiles' && (
            <div className="pt-16">
              <ProfilesGallery rankingData={ranking.data} />
            </div>
          )}
          {activeTab === 'compat' && (
            <div className="pt-16">
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
      {screen === 'compare' && compareData && (
        <div className="fixed inset-0 z-50 bg-bg flex items-center justify-center">
          <div className="text-center px-4">
            <p className="text-lg text-muted mb-4">对比页面 - 即将推出</p>
            <p className="text-white font-mono font-bold text-2xl mb-2">
              {compareData.code}
            </p>
            <p className="text-muted mb-6">相似度: {compareData.similarity}%</p>
            <button
              onClick={handleBackToHome}
              className="text-accent underline text-sm"
            >
              返回首页
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
