import type { Metadata } from "next";
import Link from "next/link";
import { getAllArticles } from "@/lib/articles";
import AdSlot from "@/components/AdSlot";

export const metadata: Metadata = {
  title: "AI工具评测与教程 | AI导航博客",
  description:
    "100篇SEO友好的AI工具评测、对比与实操教程，覆盖ChatGPT、Claude、Midjourney、编程助手等。",
};

export default function BlogIndexPage() {
  const articles = getAllArticles();
  const categories = Array.from(new Set(articles.map((a) => a.category)));

  return (
    <>
      <header className="site-header" id="top">
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

      <main className="container blog-index">
        <section className="blog-hero">
          <p className="hero-eyebrow">SEO Guides</p>
          <h1>AI工具评测与实操文章</h1>
          <p>
            共 {articles.length} 篇，标题含关键词、正文约800字，含公开数据与可执行步骤。无空话。
          </p>
        </section>

        <AdSlot slotId="banner-top" variant="banner" />

        <div className="blog-cats">
          {categories.map((c) => (
            <span className="chip active" key={c}>
              {c}
            </span>
          ))}
        </div>

        <div className="blog-list">
          {articles.map((article) => (
            <article className="blog-card" key={article.slug}>
              <div className="blog-card-meta">
                <span>{article.category}</span>
                <time dateTime={article.publishedAt}>{article.publishedAt}</time>
              </div>
              <h2>
                <Link href={`/blog/${article.slug}`}>{article.title}</Link>
              </h2>
              <p>{article.description}</p>
              <div className="blog-card-foot">
                <span className="tag">关键词：{article.keyword}</span>
                <Link className="tool-link" href={`/blog/${article.slug}`}>
                  阅读全文
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path
                      d="M5 12h14M13 6l6 6-6 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
              </div>
            </article>
          ))}
        </div>

        {articles.length === 0 ? (
          <div className="empty">文章正在生成中，请稍后刷新。</div>
        ) : null}
      </main>

      <footer className="site-footer">
        <div className="container footer-inner">
          <div className="footer-row">
            <div>
              <div className="footer-brand">AI 导航</div>
              <p className="footer-note">工具导航 + SEO文章库</p>
            </div>
            <div className="footer-links">
              <Link href="/">返回工具</Link>
              <Link href="/blog">全部文章</Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
