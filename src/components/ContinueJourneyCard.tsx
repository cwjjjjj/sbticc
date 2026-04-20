interface ContinueJourneyCardProps {
  localHistoryCount: number;
}

const TOTAL_TESTS = 10;

export default function ContinueJourneyCard({ localHistoryCount }: ContinueJourneyCardProps) {
  const remaining = Math.max(0, TOTAL_TESTS - localHistoryCount);
  const progress = Math.min(100, (localHistoryCount / TOTAL_TESTS) * 100);

  return (
    <div className="bg-surface border border-border rounded-2xl p-6">
      <h3 className="text-lg font-bold text-white mb-1">你的测试地图</h3>
      <p className="text-sm text-[#888] mb-4">本机已完成 {localHistoryCount} / {TOTAL_TESTS} 个测试</p>
      <div className="h-2 bg-surface-2 rounded-full overflow-hidden mb-3">
        <div
          className="h-full bg-gradient-to-r from-accent/60 to-accent transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
      {remaining > 0 ? (
        <p className="text-xs text-[#aaa]">还有 <span className="text-accent font-bold">{remaining}</span> 个测试没做。全测完会怎么样？不知道，我们也没人测完过。</p>
      ) : (
        <p className="text-xs text-accent">🎉 10 个测试全部完成，你现在是人格实验室的正式成员。</p>
      )}
    </div>
  );
}
