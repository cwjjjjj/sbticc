import { useEffect, useId, useRef } from 'react';

declare global {
  interface Window {
    TencentGDT: unknown[];
  }
}

// TODO: 腾讯优量汇后台创建广告位后填入
export const TENCENT_APP_ID = '';
export const TENCENT_PLACEMENTS = {
  quizBottom: '',
  interstitial: '',
} as const;

interface TencentAdProps {
  placementId: string;
  type?: 'native' | 'rewardVideo';
  displayType?: 'banner' | 'interstitial';
}

export default function TencentAd({
  placementId,
  type = 'native',
  displayType = 'banner',
}: TencentAdProps) {
  const rawId = useId();
  const containerId = `gdt-${rawId.replace(/:/g, '-')}`;
  const pushedRef = useRef(false);

  useEffect(() => {
    if (!TENCENT_APP_ID || !placementId || pushedRef.current) return;
    pushedRef.current = true;
    try {
      (window.TencentGDT = window.TencentGDT || []).push({
        app_id: TENCENT_APP_ID,
        placement_id: placementId,
        type,
        display_type: displayType,
        container_id: containerId,
      });
    } catch {}
  }, [placementId, type, displayType, containerId]);

  if (!TENCENT_APP_ID || !placementId) return null;

  return <div id={containerId} />;
}
