import { COMPATIBILITY } from '../data/compatibility';
import { TYPE_LIBRARY } from '../data/types';

export default function CompatTable() {
  const entries = Object.entries(COMPATIBILITY);

  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h2 className="font-mono font-extrabold text-2xl sm:text-3xl text-white">
          {'\u4eba\u683c\u76f8\u6027\u8868'}
        </h2>
        <p className="text-sm text-muted mt-1">
          {'\u770b\u770b\u54ea\u4e9b\u4eba\u683c\u5929\u751f\u4e00\u5bf9\uff0c\u54ea\u4e9b\u6b22\u559c\u51a4\u5bb6'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {entries.map(([key, entry]) => {
          const [codeA, codeB] = key.split('+');
          const typeA = TYPE_LIBRARY[codeA];
          const typeB = TYPE_LIBRARY[codeB];
          if (!typeA || !typeB) return null;

          const isSoulmate = entry.type === 'soulmate';

          const badgeClass = isSoulmate
            ? 'bg-[#ff3b3b]/10 text-[#ff6b9d] border border-[#ff6b9d]/20'
            : 'bg-warm/10 text-warm border border-warm/20';

          const badgeLabel = isSoulmate
            ? '\ud83d\udc95 \u5929\u751f\u4e00\u5bf9'
            : '\u2694\ufe0f \u6b22\u559c\u51a4\u5bb6';

          return (
            <div
              key={key}
              className="bg-surface border border-border rounded-xl p-4"
            >
              {/* Pair names */}
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono font-bold text-white">
                  {codeA}
                </span>
                <span className="text-muted">&times;</span>
                <span className="font-mono font-bold text-white">
                  {codeB}
                </span>
              </div>

              {/* Badge */}
              <span
                className={`inline-block px-2 py-1 rounded-md text-xs font-semibold mb-2 ${badgeClass}`}
              >
                {badgeLabel}
              </span>

              {/* Description */}
              <p className="text-sm text-[#999]">
                {entry.say}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
