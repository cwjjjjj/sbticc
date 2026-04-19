import { useRelatedArticles } from '../hooks/useRelatedArticles';
import { trackEvent } from '../hooks/useAnalytics';

interface RelatedArticlesProps {
  testId: string;
}

export default function RelatedArticles({ testId }: RelatedArticlesProps) {
  const { articles, loaded } = useRelatedArticles(testId);

  // Don't render anything when loading or when we have no related articles —
  // avoids an awkward empty block at the bottom of the result page.
  if (!loaded || articles.length === 0) return null;

  return (
    <section className="mt-12 px-4 max-w-3xl mx-auto">
      <h2 className="text-sm font-mono text-muted mb-4 uppercase tracking-wider">
        想看更多相关解读
      </h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((a) => (
          <a
            key={a.slug}
            href={`/articles/${a.slug}`}
            target="_blank"
            rel="noopener"
            onClick={() => trackEvent('article_click', { testId, slug: a.slug })}
            className="block p-4 rounded-xl bg-surface-2 border border-border hover:border-accent/60 transition-colors"
          >
            <div className="text-white font-bold leading-snug mb-2 line-clamp-2">
              {a.title}
            </div>
            <div className="text-sm text-muted leading-relaxed mb-3 line-clamp-2">
              {a.description}
            </div>
            <div className="text-xs text-accent font-semibold">阅读 →</div>
          </a>
        ))}
      </div>
    </section>
  );
}
