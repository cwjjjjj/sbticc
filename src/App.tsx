import { useState, useEffect, useCallback } from 'react';
import Nav, { type TabId } from './components/Nav';
import Hero from './components/Hero';
import TypeCardsPreview from './components/TypeCardsPreview';
import QuizOverlay from './components/QuizOverlay';
import Interstitial from './components/Interstitial';
import ResultPage from './components/ResultPage';
import { useQuiz } from './hooks/useQuiz';
import { useRanking } from './hooks/useRanking';
import { useLocalHistory } from './hooks/useLocalHistory';
import { encodeCompare, decodeCompare, type DecodedCompare } from './utils/compare';
import type { ComputeResultOutput } from './utils/matching';

type ScreenId = 'home' | 'quiz' | 'interstitial' | 'result' | 'compare';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [screen, setScreen] = useState<ScreenId>('home');
  const [result, setResult] = useState<ComputeResultOutput | null>(null);
  const [compareData, setCompareData] = useState<DecodedCompare | null>(null);

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

  const handleShare = useCallback(() => {
    // Share card generation will be implemented in Task 9
    alert('分享功能即将推出');
  }, []);

  const handleInviteCompare = useCallback(() => {
    if (!result) return;
    const similarity = 'similarity' in result.finalType
      ? (result.finalType as { similarity: number }).similarity
      : 0;
    const encoded = encodeCompare(
      result.finalType.code,
      result.levels,
      similarity,
    );
    const url = `${window.location.origin}${window.location.pathname}#compare=${encoded}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        alert('对比链接已复制到剪贴板！发给好友即可对比人格。');
      }).catch(() => {
        prompt('复制以下链接发给好友：', url);
      });
    } else {
      prompt('复制以下链接发给好友：', url);
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
              {/* ProfilesGallery placeholder */}
              <div className="max-w-6xl mx-auto px-4 py-12 text-center text-muted text-sm">
                {/* ProfilesGallery will be rendered here */}
              </div>
              {/* CompatTable placeholder */}
              <div className="max-w-6xl mx-auto px-4 py-12 text-center text-muted text-sm">
                {/* CompatTable will be rendered here */}
              </div>
            </>
          )}
          {activeTab === 'profiles' && (
            <div className="pt-20 px-4 max-w-6xl mx-auto text-center text-muted">
              <p className="text-lg">人格介绍 - 即将推出</p>
            </div>
          )}
          {activeTab === 'compat' && (
            <div className="pt-20 px-4 max-w-6xl mx-auto text-center text-muted">
              <p className="text-lg">人格相性 - 即将推出</p>
            </div>
          )}
          {activeTab === 'ranking' && (
            <div className="pt-20 px-4 max-w-6xl mx-auto text-center text-muted">
              <p className="text-lg">全站排行 - 即将推出</p>
            </div>
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
