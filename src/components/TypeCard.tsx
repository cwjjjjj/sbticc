import { useTestConfig } from '../data/testConfig';

const TEST_COLORS: Record<string, string> = {
  love: '#ff3b82',
  work: '#3b82ff',
  values: '#3bff82',
  cyber: '#3bffff',
  desire: '#a855f7',
  sbti: '#ff3b3b',
};

interface TypeCardProps {
  typeCode: string;
  /** Size variant: 'lg' = 200x200 (result page), 'sm' = 100x100 (compare page) */
  size?: 'lg' | 'sm';
}

/**
 * Renders either the real type image or a stylish CSS-generated card
 * when no image is available.
 */
export default function TypeCard({ typeCode, size = 'lg' }: TypeCardProps) {
  const config = useTestConfig();
  const imgSrc = config.typeImages[typeCode];
  const typeDef = config.typeLibrary[typeCode];
  const cnName = typeDef?.cn ?? '';
  const glowColor = TEST_COLORS[config.id] || '#ff3b3b';

  const isLg = size === 'lg';
  const wrapperClass = isLg
    ? 'w-[200px] h-[200px] rounded-2xl'
    : 'w-[100px] h-[100px] rounded-2xl';

  if (imgSrc) {
    return (
      <div
        className={`${wrapperClass} bg-surface border border-border overflow-hidden flex-shrink-0`}
      >
        <img
          src={imgSrc}
          alt={typeCode}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  // CSS-generated card
  const codeSize = isLg ? 'text-[32px]' : 'text-[16px]';
  const nameSize = isLg ? 'text-[14px] mt-1.5' : 'text-[10px] mt-0.5';
  const dotSize = isLg ? 80 : 40;
  const dotOffset = isLg ? -20 : -10;

  return (
    <div
      className={`${wrapperClass} overflow-hidden flex-shrink-0 relative`}
      style={{
        background: `linear-gradient(145deg, #1a1a1a 0%, #0a0a0a 100%)`,
      }}
    >
      {/* Decorative ring */}
      <div
        className="absolute rounded-full"
        style={{
          width: dotSize,
          height: dotSize,
          right: dotOffset,
          top: dotOffset,
          border: `1.5px solid ${glowColor}33`,
          background: `radial-gradient(circle, ${glowColor}0a 0%, transparent 70%)`,
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: dotSize * 0.6,
          height: dotSize * 0.6,
          left: dotOffset,
          bottom: dotOffset,
          border: `1px solid ${glowColor}22`,
        }}
      />
      {/* Glow accent line at bottom */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: isLg ? 3 : 2,
          background: `linear-gradient(90deg, transparent, ${glowColor}, transparent)`,
          opacity: 0.6,
        }}
      />
      {/* Content */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
        <span
          className={`font-mono font-extrabold tracking-tight ${codeSize}`}
          style={{
            color: '#fff',
            textShadow: `0 0 20px ${glowColor}66`,
          }}
        >
          {typeCode}
        </span>
        {cnName && (
          <span
            className={`${nameSize} tracking-wider`}
            style={{ color: `${glowColor}cc` }}
          >
            {cnName}
          </span>
        )}
      </div>
    </div>
  );
}
