import fs from "fs";
import path from "path";

export interface Article {
  slug: string;
  title: string;
  keyword: string;
  description: string;
  category: string;
  relatedToolIds: string[];
  publishedAt: string;
  content: string;
}

const ARTICLES_DIR = path.join(process.cwd(), "content", "articles");

function parseFrontmatter(raw: string): { data: Record<string, unknown>; body: string } {
  if (!raw.startsWith("---")) {
    return { data: {}, body: raw.trim() };
  }
  const end = raw.indexOf("---", 3);
  if (end === -1) return { data: {}, body: raw.trim() };
  const fm = raw.slice(3, end).trim();
  const body = raw.slice(end + 3).trim();
  const data: Record<string, unknown> = {};
  let currentKey = "";
  let currentList: string[] | null = null;

  for (const line of fm.split(/\r?\n/)) {
    const listItem = line.match(/^\s*-\s+(.+)$/);
    if (listItem && currentList) {
      currentList.push(listItem[1].replace(/^["']|["']$/g, ""));
      continue;
    }
    const kv = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (!kv) continue;
    if (currentKey && currentList) {
      data[currentKey] = currentList;
      currentList = null;
    }
    const key = kv[1];
    let value = kv[2].trim();
    if (value === "" || value === "[]") {
      currentKey = key;
      currentList = [];
      continue;
    }
    currentKey = key;
    currentList = null;
    value = value.replace(/^["']|["']$/g, "");
    data[key] = value;
  }
  if (currentKey && currentList) data[currentKey] = currentList;

  return { data, body };
}

export function getAllArticles(): Article[] {
  if (!fs.existsSync(ARTICLES_DIR)) return [];
  const files = fs.readdirSync(ARTICLES_DIR).filter((f) => f.endsWith(".md"));
  const articles = files.map((file) => {
    const slug = file.replace(/\.md$/, "");
    const raw = fs.readFileSync(path.join(ARTICLES_DIR, file), "utf8");
    const { data, body } = parseFrontmatter(raw);
    return {
      slug,
      title: String(data.title ?? slug),
      keyword: String(data.keyword ?? ""),
      description: String(data.description ?? ""),
      category: String(data.category ?? "未分类"),
      relatedToolIds: Array.isArray(data.relatedToolIds)
        ? (data.relatedToolIds as string[])
        : [],
      publishedAt: String(data.publishedAt ?? "2026-01-01"),
      content: body,
    } satisfies Article;
  });

  return articles.sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
}

export function getArticleBySlug(slug: string): Article | undefined {
  return getAllArticles().find((a) => a.slug === slug);
}

export function getArticleSlugs(): string[] {
  return getAllArticles().map((a) => a.slug);
}
