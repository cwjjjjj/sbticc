import { computeResult, type ComputeResultOutput } from '../src/utils/matching';
import { mpiConfig } from '../src/data/mpi/config';

/**
 * Replicate `maybeOverrideToZero` from MpiApp.tsx so we can verify the
 * ZERO$ multi-condition trigger (mpi_gate=1 AND FRUGAL/D3=L) in isolation.
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

/**
 * Build an answer set:
 *   - frugalLow=true  → FRUGAL (D3) all value=1 → raw 4 → L
 *   - frugalLow=false → FRUGAL (D3) all value=3 → raw 12 → M (explicitly NOT L)
 * All other dims get value=3 so they land in the M band (3*3=9 or 3*4=12)
 * which is explicitly not L, so ZERO$ cannot fire via FRUGAL=L even when
 * gate=1. This isolates the "gate=1 but FRUGAL != L" guard correctly.
 */
function buildAnswers(frugalLow: boolean, gateVal: number): Record<string, number | number[]> {
  const answers: Record<string, number | number[]> = {};
  for (const q of mpiConfig.questions) {
    if (q.dim === 'D3') {
      answers[q.id] = frugalLow ? 1 : 3;
    } else {
      answers[q.id] = 3;
    }
  }
  if (mpiConfig.specialQuestions) {
    for (const q of mpiConfig.specialQuestions) {
      answers[q.id] = 3;
    }
  }
  answers['mpi_gate'] = gateVal;
  return answers;
}

function runCase(label: string, frugalLow: boolean, gateVal: number, expectZero: boolean): boolean {
  const answers = buildAnswers(frugalLow, gateVal);
  let res = computeResult(answers, false, mpiConfig);
  res = maybeOverrideToZero(res, answers);
  const levels = Object.values(res.levels).join('');
  const isZero = res.finalType.code === 'ZERO$';
  const ok = isZero === expectZero;
  console.log(`${ok ? 'PASS' : 'FAIL'} [${label}] gate=${gateVal} levels=${levels} → ${res.finalType.code} (expectZero=${expectZero})`);
  return ok;
}

let allPass = true;
// Positive case: FRUGAL=L + gate=1 → ZERO$
allPass = runCase('ZERO$ trigger', true, 1, true) && allPass;
// Negative: FRUGAL=L but gate != 1 → not ZERO$
allPass = runCase('gate=2, FRUGAL=L', true, 2, false) && allPass;
allPass = runCase('gate=3, FRUGAL=L', true, 3, false) && allPass;
allPass = runCase('gate=4, FRUGAL=L', true, 4, false) && allPass;
// Negative: gate=1 but FRUGAL not L → not ZERO$
allPass = runCase('gate=1, middle levels', false, 1, false) && allPass;

console.log(allPass ? '\nALL GOOD' : '\nFAIL');
process.exit(allPass ? 0 : 1);
