import { useEffect, useRef } from 'react';

interface AdSlotProps {
  zone: string;
  src: string;
  className?: string;
}

/**
 * Generic ad slot that loads a Monetag script once on mount.
 * Wrapped in a container so it doesn't break layout if ad fails to load.
 */
export default function AdSlot({ zone, src, className = '' }: AdSlotProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const loadedRef = useRef(false);

  useEffect(() => {
    if (loadedRef.current || !containerRef.current) return;
    loadedRef.current = true;
    try {
      const s = document.createElement('script');
      s.dataset.zone = zone;
      s.src = src;
      s.async = true;
      containerRef.current.appendChild(s);
    } catch {}
  }, [zone, src]);

  return (
    <div
      ref={containerRef}
      className={`flex items-center justify-center min-h-[50px] ${className}`}
    />
  );
}
