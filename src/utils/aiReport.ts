import type { TestConfig } from '../data/testConfig';
import type { ComputeResultOutput } from './matching';

const PENDING_RESULT_VERSION = 'v1';

export function hasAiPaidReturn(): boolean {
  const params = new URLSearchParams(window.location.search);
  return params.get('ai_paid') === '1' && Boolean(params.get('session_id'));
}

export function currentAiSessionId(): string | null {
  const params = new URLSearchParams(window.location.search);
  return params.get('session_id');
}

export function pendingAiResultKey(testId: string): string {
  return `${testId}_pending_ai_result_${PENDING_RESULT_VERSION}`;
}

export function aiPaidSessionKey(testId: string, typeCode: string): string {
  return `${testId}_${typeCode}_ai_session_${PENDING_RESULT_VERSION}`;
}

export function aiReportCacheKey(testId: string, typeCode: string): string {
  return `${testId}_${typeCode}_ai_report_${PENDING_RESULT_VERSION}`;
}

export function savePendingAiResult(testId: string, result: ComputeResultOutput): void {
  try {
    localStorage.setItem(
      pendingAiResultKey(testId),
      JSON.stringify({ savedAt: Date.now(), result }),
    );
  } catch {}
}

export function restorePendingAiResult(testId: string): ComputeResultOutput | null {
  try {
    const raw = localStorage.getItem(pendingAiResultKey(testId));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || !parsed.result) return null;
    return parsed.result as ComputeResultOutput;
  } catch {
    return null;
  }
}

export function saveAiPaidSession(testId: string, typeCode: string, sessionId: string): void {
  try {
    localStorage.setItem(aiPaidSessionKey(testId, typeCode), sessionId);
  } catch {}
}

export function getAiPaidSession(testId: string, typeCode: string): string | null {
  try {
    return localStorage.getItem(aiPaidSessionKey(testId, typeCode));
  } catch {
    return null;
  }
}

export function saveAiReport(testId: string, typeCode: string, report: string): void {
  try {
    localStorage.setItem(aiReportCacheKey(testId, typeCode), report);
  } catch {}
}

export function getAiReport(testId: string, typeCode: string): string {
  try {
    return localStorage.getItem(aiReportCacheKey(testId, typeCode)) || '';
  } catch {
    return '';
  }
}

export function buildAiReportPayload(config: TestConfig, result: ComputeResultOutput) {
  const typeCode = result.finalType.code;
  const typeDef = config.typeLibrary[typeCode] ?? result.finalType;

  return {
    testId: config.id,
    testName: config.name,
    result: {
      typeCode,
      typeName: typeDef.cn,
      intro: typeDef.intro,
      description: typeDef.desc,
      levels: result.levels,
      rawScores: result.rawScores,
    },
    dimensions: config.dimensionOrder.map((key) => {
      const level = result.levels[key] ?? '';
      return {
        key,
        name: config.dimensionMeta[key]?.name ?? key,
        level,
        score: result.rawScores[key] ?? '',
        explanation: config.dimExplanations[key]?.[level] ?? '',
      };
    }),
  };
}
