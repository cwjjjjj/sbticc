import { computeResult } from '../src/utils/matching';
import { fsiConfig } from '../src/data/fsi/config';
import { randomAnswerForQuestion } from '../src/utils/quiz';

function runOnce(): { typeCode: string; levels: Record<string, string>; rawScores: Record<string, number> } {
  const answers: Record<string, number | number[]> = {};
  for (const q of fsiConfig.questions) {
    answers[q.id] = randomAnswerForQuestion(q);
  }
  if (fsiConfig.specialQuestions) {
    for (const q of fsiConfig.specialQuestions) {
      answers[q.id] = randomAnswerForQuestion(q);
    }
  }
  // avoid triggering the BOSSY multi-condition path (gate=3 + CTRL/LITE/ECHO=H)
  // by forcing the gate away from 3 — that way we see the normal-type distribution.
  if (fsiConfig.gateQuestionId) {
    answers[fsiConfig.gateQuestionId] = 1;
  }
  const res = computeResult(answers, false, fsiConfig);
  return { typeCode: res.finalType.code, levels: res.levels, rawScores: res.rawScores };
}

const counts: Record<string, number> = {};
const levelCounts: Record<string, number> = {};
for (let i = 0; i < 200; i++) {
  const r = runOnce();
  counts[r.typeCode] = (counts[r.typeCode] || 0) + 1;
  const sig = Object.values(r.levels).join('');
  levelCounts[sig] = (levelCounts[sig] || 0) + 1;
}
console.log('FSI result distribution over 200 random runs:');
Object.entries(counts)
  .sort((a, b) => b[1] - a[1])
  .forEach(([k, v]) => {
    console.log(`  ${k}: ${v}`);
  });
console.log(`Unique types seen: ${Object.keys(counts).length}`);
console.log('\nLevel signature distribution (top 10):');
Object.entries(levelCounts)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 10)
  .forEach(([k, v]) => {
    console.log(`  ${k}: ${v}`);
  });

// One sample to see raw scores
const sample = runOnce();
console.log('\nSample rawScores:', sample.rawScores);
console.log('Sample levels:', sample.levels);
