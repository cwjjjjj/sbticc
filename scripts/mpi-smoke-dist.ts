import { computeResult } from '../src/utils/matching';
import { mpiConfig } from '../src/data/mpi/config';
import { randomAnswerForQuestion } from '../src/utils/quiz';

function runOnce(): { typeCode: string; levels: Record<string, string>; rawScores: Record<string, number> } {
  const answers: Record<string, number | number[]> = {};
  for (const q of mpiConfig.questions) {
    answers[q.id] = randomAnswerForQuestion(q);
  }
  if (mpiConfig.specialQuestions) {
    for (const q of mpiConfig.specialQuestions) {
      answers[q.id] = randomAnswerForQuestion(q);
    }
  }
  // Avoid triggering the ZERO$ multi-condition path (mpi_gate=1 + FRUGAL=L)
  // by forcing gate away from 1 so we see the normal-type distribution.
  if (mpiConfig.gateQuestionId) {
    answers[mpiConfig.gateQuestionId] = 4;
  }
  const res = computeResult(answers, false, mpiConfig);
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
console.log('MPI result distribution over 200 random runs:');
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
