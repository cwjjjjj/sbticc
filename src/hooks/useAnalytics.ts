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
  | 'share_click'
  | 'article_click';

export type TrackProps = Record<string, string | number | undefined | null>;

const isDev = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV;

export function trackEvent(event: TrackEvent, props?: TrackProps): void {
  if (isDev) {
    // eslint-disable-next-line no-console
    console.log('[track]', event, props ?? '');
    return;
  }
  try {
    const body = JSON.stringify({ event, props: props ?? undefined });
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
