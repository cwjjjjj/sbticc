import { computeResult } from '../src/utils/matching';
import { fpiConfig } from '../src/data/fpi/config';
import { randomAnswerForQuestion } from '../src/utils/quiz';

function runOnce(): { typeCode: string; levels: Record<string, string>; rawScores: Record<string, number> } {
  const answers: Record<string, number | number[]> = {};
  for (const q of fpiConfig.questions) {
    answers[q.id] = randomAnswerForQuestion(q);
  }
  // avoid triggering gate (0POST) so we see normal-type distribution
  for (const q of fpiConfig.questions) {
    if (q.isGate && q.gateTriggerValue !== undefined) {
      if (answers[q.id] === q.gateTriggerValue) {
        answers[q.id] = 1;
      }
    }
  }
  const res = computeResult(answers, false, fpiConfig);
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
console.log('FPI result distribution over 200 random runs:');
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
