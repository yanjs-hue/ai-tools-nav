"use client";

import { useMemo, useState } from "react";
import { categories, tools, type CategoryId } from "@/data/tools";
import AdSlot from "@/components/AdSlot";
import ToolCard, { getCategoryName } from "@/components/ToolCard";

type FilterMode = "all" | "featured" | "free";

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState<CategoryId>("all");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterMode>("all");

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: tools.length };
    for (const tool of tools) {
      map[tool.category] = (map[tool.category] ?? 0) + 1;
    }
    return map;
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tools.filter((tool) => {
      if (activeCategory !== "all" && tool.category !== activeCategory) return false;
      if (filter === "featured" && !tool.featured) return false;
      if (filter === "free" && !tool.free) return false;
      if (!q) return true;
      const hay = `${tool.name} ${tool.description} ${tool.tags.join(" ")}`.toLowerCase();
      return hay.includes(q);
    });
  }, [activeCategory, query, filter]);

  const activeMeta = categories.find((c) => c.id === activeCategory)!;
  const midIndex = Math.max(1, Math.floor(filtered.length / 2));

  return (
    <>
      <header className="site-header" id="top">
        <div className="container header-inner">
          <a className="brand" href="/">
            <span className="brand-mark">AI</span>
            <span className="brand-text">
              <span className="brand-name">AI 导航</span>
              <span className="brand-tag">精选工具目录</span>
            </span>
          </a>
          <nav className="header-nav">
            <a href="/" className="active">
              工具
            </a>
            <a href="/blog">文章</a>
          </nav>
          <div className="search-wrap">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
              <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input
              className="search-input"
              type="search"
              placeholder="搜索工具、标签…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="搜索 AI 工具"
            />
          </div>
        </div>
      </header>

      <main>
        <section className="container hero">
          <div className="hero-eyebrow">Curated AI Directory</div>
          <h1>发现好用的 AI 工具</h1>
          <p>
            深色简洁的导航站，按分类快速找到对话、绘图、视频、编程与效率类工具。
          </p>
          <div className="stats">
            <div className="stat">
              <strong>{tools.length}+</strong>
              <span>收录工具</span>
            </div>
            <div className="stat">
              <strong>{categories.length - 1}</strong>
              <span>工具分类</span>
            </div>
            <div className="stat">
              <strong>{tools.filter((t) => t.free).length}</strong>
              <span>支持免费</span>
            </div>
          </div>
        </section>

        <div className="container" style={{ marginBottom: "1.25rem" }}>
          <AdSlot slotId="banner-top" variant="banner" />
        </div>

        <div className="container main-grid">
          <aside className="sidebar">
            <nav className="category-nav" aria-label="工具分类">
              <h2>分类</h2>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  className={`cat-btn${activeCategory === cat.id ? " active" : ""}`}
                  onClick={() => setActiveCategory(cat.id)}
                >
                  <span>{cat.name}</span>
                  <span className="count">{counts[cat.id] ?? 0}</span>
                </button>
              ))}
            </nav>
            <AdSlot slotId="sidebar" variant="sidebar-ad" />
          </aside>

          <section className="content-col">
            <div className="toolbar">
              <div>
                <h2>{activeMeta.name}</h2>
                <p>
                  {activeMeta.description} · 共 {filtered.length} 个结果
                </p>
              </div>
              <div className="chip-row" role="group" aria-label="筛选">
                {(
                  [
                    ["all", "全部"],
                    ["featured", "精选"],
                    ["free", "免费"],
                  ] as const
                ).map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    className={`chip${filter === id ? " active" : ""}`}
                    onClick={() => setFilter(id)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="empty">没有找到匹配的工具，试试其他关键词或分类。</div>
            ) : (
              <>
                <div className="tool-grid">
                  {filtered.slice(0, midIndex).map((tool, i) => (
                    <ToolCard
                      key={tool.id}
                      tool={tool}
                      categoryName={getCategoryName(categories, tool.category)}
                      index={i}
                    />
                  ))}
                </div>

                <AdSlot slotId="inline-mid" variant="inline" />

                <div className="tool-grid">
                  {filtered.slice(midIndex).map((tool, i) => (
                    <ToolCard
                      key={tool.id}
                      tool={tool}
                      categoryName={getCategoryName(categories, tool.category)}
                      index={i + midIndex}
                    />
                  ))}
                </div>
              </>
            )}
          </section>
        </div>
      </main>

      <footer className="site-footer">
        <div className="container footer-inner">
          <AdSlot slotId="footer" variant="footer-ad" />
          <div className="footer-row">
            <div>
              <div className="footer-brand">AI 导航</div>
              <p className="footer-note">
                开源可部署的 AI 工具导航模板 · 编辑 data/ 即可更新内容与广告
              </p>
            </div>
            <div className="footer-links">
              <a href="/blog">AI工具文章</a>
              <a href="https://vercel.com" target="_blank" rel="noopener noreferrer">
                Deploy on Vercel
              </a>
              <a href="#top">回到顶部</a>
            </div>
          </div>
          <div className="copyright">© {new Date().getFullYear()} AI 导航 · 仅作导航展示</div>
        </div>
      </footer>
    </>
  );
}
