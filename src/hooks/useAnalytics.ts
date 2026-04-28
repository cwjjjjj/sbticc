// Lightweight first-party analytics. Fires POST /api/track; never throws.
// Dev mode prints a console log and skips the network call.

export type TrackEvent =
  | 'home_view'
  | 'test_click'
  | 'hero_view'
  | 'quiz_start'
  | 'quiz_q'
  | 'quiz_complete'
  | 'result_view'
  | 'payment_click'
  | 'payment_unlock'
  | 'payment_cancel'
  | 'ai_report_checkout_click'
  | 'ai_report_paid'
  | 'ai_report_generate_click'
  | 'share_click'
  | 'article_click';

export type TrackProps = Record<string, string | number | undefined | null>;

const isDev = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV;

function safeValue(value: string | null | undefined, fallback = ''): string {
  if (!value) return fallback;
  return value.slice(0, 64);
}

function getReferrerHost(): string {
  if (typeof document === 'undefined' || !document.referrer) return 'direct';
  try {
    return new URL(document.referrer).hostname || 'direct';
  } catch {
    return 'unknown';
  }
}

function getLandingPath(): string {
  if (typeof window === 'undefined') return '';
  try {
    const key = 'analytics_landing_path';
    const existing = sessionStorage.getItem(key);
    if (existing) return existing;
    const landing = `${window.location.pathname}${window.location.search}`.slice(0, 96);
    sessionStorage.setItem(key, landing);
    return landing;
  } catch {
    return window.location.pathname;
  }
}

function withContext(props?: TrackProps): TrackProps {
  if (typeof window === 'undefined') return props ?? {};
  const params = new URLSearchParams(window.location.search);
  return {
    ref: safeValue(params.get('ref') || params.get('src') || params.get('s') || undefined, 'none'),
    utm_source: safeValue(params.get('utm_source') || undefined, 'none'),
    ref_host: safeValue(getReferrerHost()),
    path: safeValue(window.location.pathname),
    landing: safeValue(getLandingPath()),
    ...(props ?? {}),
  };
}

export function trackEvent(event: TrackEvent, props?: TrackProps): void {
  const enrichedProps = withContext(props);
  if (isDev) {
    // eslint-disable-next-line no-console
    console.log('[track]', event, enrichedProps);
    return;
  }
  try {
    const body = JSON.stringify({ event, props: enrichedProps });
    const url = '/api/track';

    if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
      const blob = new Blob([body], { type: 'application/json' });
      const ok = navigator.sendBeacon(url, blob);
      if (ok) return;
    }

    // Fallback: fire-and-forget fetch
    if (typeof fetch === 'function') {
      void fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
        keepalive: true,
      }).catch(() => {
        /* swallow */
      });
    }
  } catch {
    /* swallow */
  }
}
