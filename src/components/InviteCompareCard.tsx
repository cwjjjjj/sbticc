interface InviteCompareCardProps {
  onInviteCompare: () => void;
}

export default function InviteCompareCard({ onInviteCompare }: InviteCompareCardProps) {
  return (
    <button
      onClick={onInviteCompare}
      className="text-left bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/40 rounded-2xl p-6 cursor-pointer hover:border-accent transition-all group"
    >
      <div className="text-2xl mb-3">📨</div>
      <h3 className="text-lg font-bold text-white mb-1">邀请 TA 对比</h3>
      <p className="text-sm text-[#bbb] mb-3 leading-relaxed">发一条链接给朋友/对象/同事，看看你们的雷达图有多相似——或者多不像。</p>
      <p className="text-xs font-mono text-accent group-hover:tracking-wider transition-all">生成对比链接 →</p>
    </button>
  );
}
