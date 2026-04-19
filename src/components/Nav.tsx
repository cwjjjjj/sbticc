import type { ReactNode } from 'react';
import { css } from '@emotion/react';
import { ALL_TESTS } from '../data/allTests';
import { useTestConfig } from '../data/testConfig';

export type TabId = string;

export interface NavTab {
  id: TabId;
  label: string;
}

interface NavProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  onStartTest: () => void;
  /** Tabs shown in the main nav. Defaults to the full 4-tab set. */
  tabs?: NavTab[];
}

const DEFAULT_TABS: NavTab[] = [
  { id: 'home', label: '首页' },
  { id: 'profiles', label: '人格介绍' },
  { id: 'compat', label: '人格相性' },
  { id: 'ranking', label: '全站排行' },
];

// Per-test brand label. Falls back to uppercase test id with accent on last char.
const BRAND_MAP: Record<string, ReactNode> = {
  sbti: (<>S<span className="text-accent">[B]</span>TI</>),
  gsti: (<>G<span className="text-accent">S</span>TI</>),
  love: (<>LOV<span className="text-accent">E</span></>),
  work: (<>WOR<span className="text-accent">K</span></>),
  values: (<>VALUE<span className="text-accent">S</span></>),
  cyber: (<>CYBE<span className="text-accent">R</span></>),
  desire: (<>DESIR<span className="text-accent">E</span></>),
  fpi: (<>FP<span className="text-accent">I</span></>),
  fsi: (<>FS<span className="text-accent">I</span></>),
  mpi: (<>MP<span className="text-accent">I</span></>),
};

const glassmorphism = css`
  background: rgba(8, 8, 8, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
`;

export default function Nav({
  activeTab,
  onTabChange,
  onStartTest,
  tabs = DEFAULT_TABS,
}: NavProps) {
  const config = useTestConfig();
  const brand: ReactNode = BRAND_MAP[config.id] ?? config.id.toUpperCase();

  return (
    <nav
      css={glassmorphism}
      className="fixed top-0 left-0 right-0 z-50 border-b border-border"
    >
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Brand (clickable → hub) */}
        <a
          href="/"
          className="font-mono font-extrabold text-lg tracking-tight text-white select-none hover:text-accent transition-colors"
          title="回到人格实验室首页"
        >
          {brand}
        </a>

        {/* Tab buttons - hidden on mobile */}
        <div className="hidden sm:flex items-center gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-white bg-surface-2'
                  : 'text-muted hover:text-white hover:bg-surface'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={onStartTest}
          className="bg-accent text-white text-sm font-bold px-4 py-1.5 rounded-lg hover:brightness-110 transition-all"
        >
          开始测试
        </button>
      </div>
      <div className="border-t border-border/70">
        <div className="max-w-6xl mx-auto px-4 h-10 flex items-center gap-2 overflow-x-auto whitespace-nowrap">
          {ALL_TESTS.map((test) => {
            const isActive = test.id === config.id;
            return (
              <a
                key={test.id}
                href={test.path}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-accent/15 text-white border border-accent/30'
                    : 'text-muted hover:text-white hover:bg-surface'
                }`}
              >
                <span>{test.emoji}</span>
                <span>{test.name}</span>
              </a>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
