import type { Tool, Category } from "@/data/tools";

interface ToolCardProps {
  tool: Tool;
  categoryName: string;
  index: number;
}

export default function ToolCard({ tool, categoryName, index }: ToolCardProps) {
  const initial = tool.name.slice(0, 1).toUpperCase();

  return (
    <a
      className="tool-card"
      href={tool.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{ animationDelay: `${Math.min(index, 12) * 40}ms` }}
    >
      <div className="tool-top">
        <div className="tool-icon" aria-hidden>
          {initial}
        </div>
        <div className="tool-meta">
          <h3 className="tool-name">{tool.name}</h3>
          <p className="tool-cat">{categoryName}</p>
        </div>
        <div className="badges">
          {tool.featured ? <span className="badge badge-featured">精选</span> : null}
          {tool.free ? <span className="badge badge-free">免费</span> : null}
        </div>
      </div>
      <p className="tool-desc">{tool.description}</p>
      <div className="tool-tags">
        {tool.tags.map((tag) => (
          <span className="tag" key={tag}>
            {tag}
          </span>
        ))}
      </div>
      <span className="tool-link">
        访问官网
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M5 12h14M13 6l6 6-6 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </a>
  );
}

export function getCategoryName(
  categories: Category[],
  id: string
): string {
  return categories.find((c) => c.id === id)?.name ?? id;
}
