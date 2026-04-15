import { ALL_TESTS } from '../data/allTests';
import { useTestConfig } from '../data/testConfig';

export default function OtherTests() {
  const config = useTestConfig();

  return (
    <div className="bg-surface border border-border rounded-2xl p-7">
      <h3 className="flex items-center gap-2.5 text-base font-bold text-white mb-4">
        <span className="w-[3px] h-4 bg-accent rounded-sm" />
        继续探索这些测试
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {ALL_TESTS.map((test) => {
          const isActive = test.id === config.id;
          return (
          <a
            key={test.id}
            href={test.path}
            className={`bg-surface-2 border rounded-xl p-4 hover:border-[#444] transition-colors block ${
              isActive ? 'border-accent/40' : 'border-border'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-2xl">{test.emoji}</span>
              {isActive && (
                <span className="text-[10px] text-accent bg-accent/10 px-2 py-0.5 rounded">
                  当前
                </span>
              )}
            </div>
            <p className="text-sm font-bold text-white mt-2">{test.name}</p>
            <p className="text-xs text-muted mt-1">{test.tagline}</p>
          </a>
        )})}
      </div>
    </div>
  );
}
