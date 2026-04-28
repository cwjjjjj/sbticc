import { useCallback, useEffect, useState } from 'react';
import { useTestConfig } from '../data/testConfig';
import type { ComputeResultOutput } from '../utils/matching';
import {
  buildAiReportPayload,
  currentAiSessionId,
  getAiPaidSession,
  getAiReport,
  saveAiPaidSession,
  saveAiReport,
  savePendingAiResult,
} from '../utils/aiReport';
import { trackEvent } from '../hooks/useAnalytics';

interface AiInterpretationCardProps {
  result: ComputeResultOutput;
}

type Status = 'idle' | 'checking' | 'redirecting' | 'generating' | 'error';

const priceLabel = import.meta.env.VITE_AI_REPORT_PRICE_LABEL || '$4.99';

function renderReport(text: string) {
  return text.split('\n').map((line, index) => {
    if (!line.trim()) return <br key={index} />;
    const heading = line.match(/^#{1,3}\s+(.+)/);
    if (heading) {
      return (
        <h4 key={index} className="mt-4 mb-2 text-sm font-bold text-white">
          {heading[1]}
        </h4>
      );
    }
    return (
      <p key={index} className="mb-2 text-sm leading-relaxed text-[#cfcfcf]">
        {line.replace(/^[-*]\s+/, '')}
      </p>
    );
  });
}

export default function AiInterpretationCard({ result }: AiInterpretationCardProps) {
  const config = useTestConfig();
  const typeCode = result.finalType.code;
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');
  const [sessionId, setSessionId] = useState<string | null>(() =>
    currentAiSessionId() || getAiPaidSession(config.id, typeCode),
  );
  const [report, setReport] = useState(() => getAiReport(config.id, typeCode));
  const paid = Boolean(sessionId);

  useEffect(() => {
    const returnedSession = currentAiSessionId();
    if (!returnedSession) return;
    setStatus('checking');
    fetch('/api/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id: returnedSession }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.paid && data.feature === 'ai_report') {
          saveAiPaidSession(config.id, typeCode, returnedSession);
          setSessionId(returnedSession);
          trackEvent('ai_report_paid', { testId: config.id, typeCode });
        } else {
          setError('没有找到已完成的 AI 解读支付记录。');
          setStatus('error');
        }
      })
      .catch(() => {
        setError('支付状态校验失败，请稍后重试。');
        setStatus('error');
      })
      .finally(() => setStatus((current) => current === 'checking' ? 'idle' : current));
  }, [config.id, typeCode]);

  const startCheckout = useCallback(async () => {
    setError('');
    setStatus('redirecting');
    savePendingAiResult(config.id, result);
    trackEvent('ai_report_checkout_click', { testId: config.id, typeCode });

    try {
      const res = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          feature: 'ai_report',
          testId: config.id,
          typeCode,
          returnPath: window.location.pathname,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || 'checkout failed');
      window.location.href = data.url;
    } catch {
      setError('创建支付订单失败，请稍后再试。');
      setStatus('error');
    }
  }, [config.id, result, typeCode]);

  const generateReport = useCallback(async () => {
    if (!sessionId) return;
    setError('');
    setStatus('generating');
    trackEvent('ai_report_generate_click', { testId: config.id, typeCode });

    try {
      const res = await fetch('/api/generate-ai-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          ...buildAiReportPayload(config, result),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.report) throw new Error(data.error || 'generation failed');
      setReport(data.report);
      saveAiReport(config.id, typeCode, data.report);
      setStatus('idle');
    } catch {
      setError('AI 解读生成失败，请稍后重试。');
      setStatus('error');
    }
  }, [config, result, sessionId, typeCode]);

  return (
    <div id="ai-report" className="bg-surface border border-border rounded-2xl p-7 mb-5">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h3 className="flex items-center gap-2.5 text-base font-bold text-white">
            <span className="w-[3px] h-4 bg-accent rounded-sm" />
            AI 具体解读
          </h3>
          <p className="mt-2 text-xs text-muted leading-relaxed">
            基础结果免费。这里是付费生成的一次性 AI 深度报告，会结合你的类型、维度和原始分数重新写一版更具体的解读。
          </p>
        </div>
        <span className="shrink-0 rounded-lg bg-accent/10 px-2.5 py-1 text-xs font-bold text-accent">
          {priceLabel}
        </span>
      </div>

      {report ? (
        <div className="rounded-xl bg-bg/60 border border-border/70 px-4 py-4">
          {renderReport(report)}
        </div>
      ) : paid ? (
        <button
          type="button"
          onClick={generateReport}
          disabled={status === 'generating' || status === 'checking'}
          className="w-full rounded-xl bg-accent px-4 py-3 text-sm font-bold text-white hover:bg-accent/90 disabled:opacity-60"
        >
          {status === 'generating' ? 'AI 正在生成...' : '生成我的 AI 深度解读'}
        </button>
      ) : (
        <button
          type="button"
          onClick={startCheckout}
          disabled={status === 'redirecting'}
          className="w-full rounded-xl bg-white px-4 py-3 text-sm font-bold text-black hover:bg-gray-100 disabled:opacity-60"
        >
          {status === 'redirecting' ? '正在跳转 Stripe...' : `支付 ${priceLabel} 生成 AI 解读`}
        </button>
      )}

      {error && (
        <p className="mt-3 rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-200">
          {error}
        </p>
      )}
    </div>
  );
}
