import { useMemo } from 'react';

const ALL_TESTS = [
  { id: 'sbti',   path: '/sbti',   emoji: '🧠', name: 'SBTI 人格测试', tag: '15维度深度人格扫描' },
  { id: 'love',   path: '/love',   emoji: '💘', name: '恋爱脑浓度检测', tag: '你谈恋爱是什么德性' },
  { id: 'work',   path: '/work',   emoji: '💼', name: '打工人鉴定',     tag: '你是哪种打工人' },
  { id: 'values', path: '/values', emoji: '🌏', name: '活法检测报告',   tag: '你到底在活什么' },
  { id: 'cyber',  path: '/cyber',  emoji: '📱', name: '赛博基因检测',   tag: '你是什么品种的网民' },
  { id: 'desire', path: '/desire', emoji: '🔥', name: '欲望图谱',       tag: '关上门之后你是谁' },
  { id: 'gsti',   path: '/gsti',   emoji: '🪞', name: 'GSTI 性转人格',   tag: '性转后你是什么鬼' },
  { id: 'fpi',    path: '/fpi',    emoji: '📸', name: '朋友圈人设诊断', tag: '你在朋友圈是什么物种' },
  { id: 'fsi',    path: '/fsi',    emoji: '🏷️', name: '原生家庭幸存者', tag: '你被养成了什么形状' },
  { id: 'mpi',    path: '/mpi',    emoji: '💸', name: '消费人格图鉴',   tag: '你怎么把钱输给这个世界' },
];

const RECS: Record<string, [string, string]> = {
  sbti:   ['gsti', 'love'],
  love:   ['sbti', 'desire'],
  work:   ['values', 'mpi'],
  values: ['love', 'work'],
  cyber:  ['fpi', 'values'],
  desire: ['love', 'fsi'],
  gsti:   ['sbti', 'fpi'],
  fpi:    ['cyber', 'gsti'],
  fsi:    ['values', 'desire'],
  mpi:    ['work', 'values'],
};

interface RecommendTestsCardProps {
  currentTestId: string;
}

export default function RecommendTestsCard({ currentTestId }: RecommendTestsCardProps) {
  const recs = useMemo(() => {
    const ids = RECS[currentTestId] ?? ['sbti', 'love'];
    return ids.map((id) => ALL_TESTS.find((t) => t.id === id)!).filter(Boolean);
  }, [currentTestId]);

  return (
    <div className="bg-surface border border-border rounded-2xl p-6">
      <h3 className="text-lg font-bold text-white mb-1">你可能也想测</h3>
      <p className="text-sm text-[#888] mb-4">测完这个顺手做下一个。我们做了 10 款。</p>
      <div className="flex flex-col gap-3">
        {recs.map((t) => (
          <a
            key={t.id}
            href={`${t.path}?s=from-${currentTestId}`}
            className="flex items-center gap-3 bg-surface-2 border border-border rounded-xl p-3 hover:border-[#444] transition-colors cursor-pointer"
          >
            <span className="text-2xl">{t.emoji}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">{t.name}</p>
              <p className="text-xs text-[#888] truncate">{t.tag}</p>
            </div>
            <span className="text-accent text-sm">→</span>
          </a>
        ))}
      </div>
    </div>
  );
}
