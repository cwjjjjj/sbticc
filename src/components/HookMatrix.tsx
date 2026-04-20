import InviteCompareCard from './InviteCompareCard';
import RecommendTestsCard from './RecommendTestsCard';
import ContinueJourneyCard from './ContinueJourneyCard';

interface HookMatrixProps {
  testId: string;
  localHistoryCount: number;
  onInviteCompare: () => void;
}

export default function HookMatrix({ testId, localHistoryCount, onInviteCompare }: HookMatrixProps) {
  return (
    <section className="mt-10 mb-6">
      <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
        <span className="w-[3px] h-4 bg-accent rounded-sm" />
        还有这些可以玩
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <InviteCompareCard onInviteCompare={onInviteCompare} />
        <RecommendTestsCard currentTestId={testId} />
        <div className="sm:col-span-2">
          <ContinueJourneyCard localHistoryCount={localHistoryCount} />
        </div>
      </div>
    </section>
  );
}
