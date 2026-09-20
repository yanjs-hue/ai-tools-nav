/**
 * 去重重复段落，并按规格补写「与主题相关」的扩展段，避免通用灌水
 * node scripts/dedupe-polish-articles.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const dir = path.join(root, "content", "articles");
const specSrc = fs.readFileSync(path.join(root, "data/articleSpecs.ts"), "utf8");

function extractSpecs(src) {
  const specs = [];
  for (const block of src.split(/{\s*slug:/).slice(1)) {
    const slug = block.match(/^\s*"([^"]+)"/)?.[1] || "";
    const get = (k) => block.match(new RegExp(`${k}:\\s*"([^"]*)"`))?.[1] || "";
    const dp = [...(block.match(/dataPoints:\s*\[([\s\S]*?)\]/)?.[1] || "").matchAll(/"([^"]+)"/g)].map((m) => m[1]);
    const relatedToolIds = [...(block.match(/relatedToolIds:\s*\[([\s\S]*?)\]/)?.[1] || "").matchAll(/"([^"]+)"/g)].map((m) => m[1]);
    specs.push({
      slug,
      title: get("title"),
      keyword: get("keyword"),
      description: get("description"),
      category: get("category"),
      angle: get("angle"),
      dataPoints: dp,
      relatedToolIds,
    });
  }
  return specs;
}

const han = (s) => (s.match(/[\u4e00-\u9fff]/g) || []).length;
const specs = Object.fromEntries(extractSpecs(specSrc).map((s) => [s.slug, s]));

const GENERIC_MARKERS = [
  "若你在做工具导航或内容矩阵",
  "预算测算不要只看席位月费",
  "对多工具并行的团队，建议设默认路由",
  "先固定输出格式再提高温度",
];

function topicalExpand(spec) {
  const { keyword, angle, dataPoints, category } = spec;
  const d = dataPoints;
  return [
    `## ${keyword}专题补强`,
    `结合${category}场景，把角度落到「${angle}」。请逐条核对：${d.map((x, i) => `（${i + 1}）${x}`).join("")}。核对方式建议截图官网价目/文档版本号，写进你们内部变更表，避免口口相传。`,
    `执行顺序建议：先用小流量验证提示词或镜头表 → 再开积分包/席位 → 最后才做品牌级投放或全员推广。衡量指标至少包含完成时长、一次通过率、单位成本三列；${keyword}相关内容页也应标注评测日期，方便搜索引擎与读者判断时效。`,
    `若结果不达线，优先改输入约束与质检标准，而不是频繁换工具。工具可以并存：对话负责结构化，垂直工具负责成图/成片/配音，导航站则负责把入口与评测页互相内链，形成「${keyword}」主题集群。`,
  ].join("\n\n");
}

let fixed = 0;
for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".md"))) {
  const slug = file.replace(/\.md$/, "");
  const spec = specs[slug];
  if (!spec) continue;
  const raw = fs.readFileSync(path.join(dir, file), "utf8");
  const end = raw.indexOf("---", 3);
  const fm = raw.slice(0, end + 3);
  let body = raw.slice(end + 3).trim();

  // paragraph dedupe
  const paras = body.split(/\n\n+/);
  const seen = new Set();
  const uniq = [];
  for (const p of paras) {
    const key = p.replace(/\s+/g, "");
    if (seen.has(key)) continue;
    seen.add(key);
    uniq.push(p);
  }
  body = uniq.join("\n\n");

  // if still heavy generic filler or short, rebuild topical tail
  const genericHits = GENERIC_MARKERS.filter((m) => body.includes(m)).length;
  if (genericHits >= 2 || han(body) < 800) {
    // drop generic pads
    const cleaned = body
      .split(/\n\n+/)
      .filter((p) => !GENERIC_MARKERS.some((m) => p.includes(m)))
      .join("\n\n");
    body = `${cleaned}\n\n${topicalExpand(spec)}`;
    // ensure length
    while (han(body) < 800) {
      body += `\n\n关于「${spec.keyword}」，请把失败案例写成可检索条目（输入、输出、错误类型、修复动作），四周后回头看重复错误是否下降。`;
    }
    while (han(body) > 880) {
      const i = body.lastIndexOf("\n\n");
      if (i < body.length * 0.65) break;
      body = body.slice(0, i);
    }
    fixed++;
  }

  // final dedupe again
  const paras2 = body.split(/\n\n+/);
  const seen2 = new Set();
  const uniq2 = [];
  for (const p of paras2) {
    const key = p.replace(/\s+/g, "");
    if (seen2.has(key)) continue;
    seen2.add(key);
    uniq2.push(p);
  }
  body = uniq2.join("\n\n");

  // related ids preserve from fm — rewrite fm from spec for consistency
  const related =
    spec.relatedToolIds.length > 0
      ? spec.relatedToolIds.map((id) => `  - ${id}`).join("\n")
      : "  []";
  const published = fm.match(/publishedAt:\s*"([^"]+)"/)?.[1] || "2026-01-15";
  const newFm = `---
title: "${spec.title}"
keyword: "${spec.keyword}"
description: "${spec.description}"
category: "${spec.category}"
relatedToolIds:
${related}
publishedAt: "${published}"
---`;

  fs.writeFileSync(path.join(dir, file), `${newFm}\n\n${body.trim()}\n`, "utf8");
}

const counts = fs.readdirSync(dir).filter((f) => f.endsWith(".md")).map((f) => {
  const body = fs.readFileSync(path.join(dir, f), "utf8").replace(/^---[\s\S]*?---/, "");
  return han(body);
});
console.log(
  JSON.stringify(
    {
      files: counts.length,
      fixed,
      min: Math.min(...counts),
      max: Math.max(...counts),
      avg: Math.round(counts.reduce((a, b) => a + b, 0) / counts.length),
      under800: counts.filter((c) => c < 800).length,
    },
    null,
    2
  )
);
