import { useEffect, useState } from 'react';

interface ArticleSummary {
  slug: string;
  title: string;
  description: string;
  relatedTests: string[];
  publishedAt: string;
}

interface UseRelatedArticlesResult {
  articles: ArticleSummary[];
  loaded: boolean;
}

// Module-level cache so result-page mount doesn't re-fetch each time a user
// flips between tests in a single session.
let manifestPromise: Promise<ArticleSummary[]> | null = null;

function loadManifest(): Promise<ArticleSummary[]> {
  if (manifestPromise) return manifestPromise;
  manifestPromise = fetch('/articles.json', { cache: 'force-cache' })
    .then((r) => (r.ok ? r.json() : []))
    .catch(() => [] as ArticleSummary[]);
  return manifestPromise;
}

export function useRelatedArticles(testId: string, limit = 3): UseRelatedArticlesResult {
  const [articles, setArticles] = useState<ArticleSummary[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadManifest().then((all) => {
      if (cancelled) return;
      const filtered = all
        .filter((a) => Array.isArray(a.relatedTests) && a.relatedTests.includes(testId))
        .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
        .slice(0, limit);
      setArticles(filtered);
      setLoaded(true);
    });
    return () => { cancelled = true; };
  }, [testId, limit]);

  return { articles, loaded };
}
