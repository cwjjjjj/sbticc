import { computeResult } from '../src/utils/matching';
import { fpiConfig } from '../src/data/fpi/config';
import { randomAnswerForQuestion } from '../src/utils/quiz';

// Build a random answer set, force gate to trigger value, pass hiddenTriggered=true.
const answers: Record<string, number | number[]> = {};
for (const q of fpiConfig.questions) {
  answers[q.id] = randomAnswerForQuestion(q);
}
if (fpiConfig.specialQuestions) {
  for (const q of fpiConfig.specialQuestions) {
    answers[q.id] = randomAnswerForQuestion(q);
  }
}
answers[fpiConfig.hiddenTriggerQuestionId!] = fpiConfig.hiddenTriggerValue!;

const res = computeResult(answers, true, fpiConfig);
console.log('Hidden-triggered finalType.code:', res.finalType.code);
console.log('special flag:', res.special);
