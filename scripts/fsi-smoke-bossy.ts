import { computeResult, type ComputeResultOutput } from '../src/utils/matching';
import { fsiConfig } from '../src/data/fsi/config';

/**
 * Replicate `maybeOverrideToBossy` from FsiApp.tsx so we can verify the
 * BOSSY multi-condition trigger (gate=3 AND D1/D5/D6=H) in isolation.
 */
function maybeOverrideToBossy(
  result: ComputeResultOutput,
  answers: Record<string, number | number[]>,
): ComputeResultOutput {
  const gate = answers['fsi_gate'];
  if (gate !== 3) return result;
  const lv = result.levels;
  if (lv['D1'] === 'H' && lv['D5'] === 'H' && lv['D6'] === 'H') {
    const bossyDef = fsiConfig.typeLibrary['BOSSY'];
    if (bossyDef) {
      return {
        ...result,
        finalType: {
          ...bossyDef,
          similarity: 100,
        } as typeof result.finalType,
      };
    }
  }
  return result;
}

function buildAnswers(ctrlLiteEchoHigh: boolean, gateVal: number): Record<string, number | number[]> {
  const answers: Record<string, number | number[]> = {};
  for (const q of fsiConfig.questions) {
    // CTRL (D1) / LITE (D5) / ECHO (D6) → value=4 to force H
    // All other dims → value=2 (middle, lands in M)
    if (ctrlLiteEchoHigh && (q.dim === 'D1' || q.dim === 'D5' || q.dim === 'D6')) {
      answers[q.id] = 4;
    } else {
      answers[q.id] = 2;
    }
  }
  answers['fsi_gate'] = gateVal;
  return answers;
}

function runCase(label: string, ctrlLiteEchoHigh: boolean, gateVal: number, expectBossy: boolean): boolean {
  const answers = buildAnswers(ctrlLiteEchoHigh, gateVal);
  let res = computeResult(answers, false, fsiConfig);
  res = maybeOverrideToBossy(res, answers);
  const levels = Object.values(res.levels).join('');
  const isBossy = res.finalType.code === 'BOSSY';
  const ok = isBossy === expectBossy;
  console.log(`${ok ? 'PASS' : 'FAIL'} [${label}] gate=${gateVal} levels=${levels} → ${res.finalType.code} (expectBossy=${expectBossy})`);
  return ok;
}

let allPass = true;
// Positive case: all three H + gate=3 → BOSSY
allPass = runCase('BOSSY trigger', true, 3, true) && allPass;
// Negative: all three H but gate != 3 → not BOSSY
allPass = runCase('gate=1 (A), three-H',  true, 1, false) && allPass;
allPass = runCase('gate=2 (B), three-H',  true, 2, false) && allPass;
allPass = runCase('gate=4 (D), three-H',  true, 4, false) && allPass;
// Negative: gate=3 but not all three H → not BOSSY
allPass = runCase('gate=3, middle levels', false, 3, false) && allPass;

console.log(allPass ? '\nALL GOOD' : '\nFAIL');
process.exit(allPass ? 0 : 1);
