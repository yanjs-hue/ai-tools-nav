import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllArticles, getArticleBySlug } from "@/lib/articles";
import { renderArticleHtml } from "@/lib/markdown";
import { tools } from "@/data/tools";
import AdSlot from "@/components/AdSlot";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllArticles().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return { title: "文章未找到" };
  return {
    title: `${article.title} | AI导航`,
    description: article.description,
    keywords: [article.keyword, "AI工具", article.category],
    openGraph: {
      title: article.title,
      description: article.description,
      type: "article",
    },
  };
}

export default async function BlogArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const related = tools.filter((t) => article.relatedToolIds.includes(t.id));
  const others = getAllArticles()
    .filter((a) => a.slug !== slug && a.category === article.category)
    .slice(0, 4);

  const html = renderArticleHtml(article.content);

  return (
    <>
      <header className="site-header">
        <div className="container header-inner">
          <Link className="brand" href="/">
            <span className="brand-mark">AI</span>
            <span className="brand-text">
              <span className="brand-name">AI 导航</span>
              <span className="brand-tag">精选工具目录</span>
            </span>
          </Link>
          <nav className="header-nav">
            <Link href="/">工具</Link>
            <Link href="/blog" className="active">
              文章
            </Link>
          </nav>
        </div>
      </header>

      <main className="container article-layout">
        <article className="article-main">
          <div className="article-meta">
            <Link href="/blog">← 全部文章</Link>
            <span>{article.category}</span>
            <time dateTime={article.publishedAt}>{article.publishedAt}</time>
          </div>
          <h1>{article.title}</h1>
          <p className="article-desc">{article.description}</p>
          <p className="article-keyword">核心关键词：{article.keyword}</p>

          <AdSlot slotId="banner-top" variant="banner" />

          <div
            className="article-body"
            dangerouslySetInnerHTML={{ __html: html }}
          />

          <AdSlot slotId="inline-mid" variant="inline" />

          {related.length > 0 ? (
            <section className="related-tools">
              <h2>相关工具</h2>
              <ul>
                {related.map((t) => (
                  <li key={t.id}>
                    <a href={t.url} target="_blank" rel="noopener noreferrer">
                      {t.name}
                    </a>
                    <span> — {t.description}</span>
                  </li>
                ))}
              </ul>
              <p>
                <Link href="/">在导航站查看全部分类 →</Link>
              </p>
            </section>
          ) : null}
        </article>

        <aside className="article-aside">
          <AdSlot slotId="sidebar" variant="sidebar-ad" />
          {others.length > 0 ? (
            <div className="aside-box">
              <h2>同分类推荐</h2>
              <ul>
                {others.map((a) => (
                  <li key={a.slug}>
                    <Link href={`/blog/${a.slug}`}>{a.title}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </aside>
      </main>

      <footer className="site-footer">
        <div className="container">
          <AdSlot slotId="footer" variant="footer-ad" />
          <div className="footer-row" style={{ marginTop: "1.25rem" }}>
            <div className="copyright">© {new Date().getFullYear()} AI 导航</div>
            <div className="footer-links">
              <Link href="/blog">更多文章</Link>
              <Link href="/">工具首页</Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
