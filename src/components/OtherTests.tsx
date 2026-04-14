import { ALL_TESTS } from '../data/allTests';
import { useTestConfig } from '../data/testConfig';

export default function OtherTests() {
  const config = useTestConfig();
  const others = ALL_TESTS.filter(t => t.id !== config.id);

  return (
    <div className="bg-surface border border-border rounded-2xl p-7">
      <h3 className="flex items-center gap-2.5 text-base font-bold text-white mb-4">
        <span className="w-[3px] h-4 bg-accent rounded-sm" />
        不过瘾？试试其他测试
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {others.map((test) => (
          <a
            key={test.id}
            href={test.path}
            className="bg-surface-2 border border-border rounded-xl p-4 hover:border-[#444] transition-colors block"
          >
            <span className="text-2xl">{test.emoji}</span>
            <p className="text-sm font-bold text-white mt-2">{test.name}</p>
            <p className="text-xs text-muted mt-1">{test.tagline}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
