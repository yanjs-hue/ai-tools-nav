/**
 * 根据 articleSpecs 生成约 800 汉字的 SEO 正文（缺文件时补齐，不覆盖已有优质稿）
 * 用法: node scripts/generate-articles.mjs
 *      node scripts/generate-articles.mjs --force
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const force = process.argv.includes("--force");

// 动态读取 TS 规格：用正则抽取，避免编译
const specSrc = fs.readFileSync(path.join(root, "data/articleSpecs.ts"), "utf8");

function extractSpecs(src) {
  const specs = [];
  const blocks = src.split(/{\s*slug:/).slice(1);
  for (const block of blocks) {
    const get = (key) => {
      const m = block.match(new RegExp(`${key}:\\s*"([^"]*)"`));
      return m ? m[1] : "";
    };
    const slug = get("slug") || block.match(/^\s*"([^"]+)"/)?.[1] || "";
    // slug 在 split 后可能是 "xxx",
    const slugMatch = block.match(/^\s*"([^"]+)"/);
    const realSlug = slugMatch ? slugMatch[1] : slug;
    const title = get("title");
    const keyword = get("keyword");
    const description = get("description");
    const category = get("category");
    const angle = get("angle");
    const dataPoints = [...block.matchAll(/"([^"]{10,})"/g)]
      .map((m) => m[1])
      .filter(
        (s) =>
          s !== title &&
          s !== keyword &&
          s !== description &&
          s !== category &&
          s !== angle &&
          s !== realSlug &&
          !s.startsWith("http") &&
          s.length > 12
      );
    // relatedToolIds
    const relBlock = block.match(/relatedToolIds:\s*\[([\s\S]*?)\]/);
    const relatedToolIds = relBlock
      ? [...relBlock[1].matchAll(/"([^"]+)"/g)].map((m) => m[1])
      : [];
    // dataPoints 更精确：找 dataPoints 数组
    const dpBlock = block.match(/dataPoints:\s*\[([\s\S]*?)\]/);
    const dps = dpBlock
      ? [...dpBlock[1].matchAll(/"([^"]+)"/g)].map((m) => m[1])
      : dataPoints.slice(0, 3);

    specs.push({
      slug: realSlug,
      title,
      keyword,
      description,
      category,
      angle,
      dataPoints: dps,
      relatedToolIds,
    });
  }
  return specs;
}

function countHan(s) {
  return (s.match(/[\u4e00-\u9fff]/g) || []).length;
}

function buildBody(spec, index) {
  const { keyword, dataPoints, angle, category, title } = spec;
  const d0 = dataPoints[0] || "相关公开信息需以产品官网当期说明为准";
  const d1 = dataPoints[1] || "功能与定价可能随版本调整，落地前请复核";
  const d2 = dataPoints[2] || "选型应同时评估合规、延迟与集成成本";

  const openers = [
    `做${category}选型时，很多人会搜「${keyword}」。`,
    `围绕「${keyword}」做决策，先看可核验的数据与可复用流程，而不是功能清单宣传。`,
    `如果你的目标关键词是「${keyword}」，下面按公开信息与落地步骤说明，尽量少废话。`,
  ];

  const s1Titles = [
    `## ${keyword}：先对齐公开数据`,
    `## 关于${keyword}的关键事实`,
    `## ${keyword}相关数据与产品约束`,
  ];
  const s2Titles = [
    `## 落地方法：${angle.replace(/给|用|按/g, "").slice(0, 18)}`,
    `## 可执行步骤`,
    `## 场景化用法与边界`,
  ];

  const lead = `${openers[index % openers.length]}${descriptionSafe(spec)}本文标题对应检索意图「${title.slice(0, 24)}…」——重点写清数据口径、适用边界与检查清单。`;

  const sec1 = `${s1Titles[index % s1Titles.length]}
公开信息层面：${d0}。其次，${d1}。补充一点：${d2}。引用这些点时建议标注「公开报道/官方说明」，避免把营销口径写成确定财报。对采购而言，比「更好用」更重要的是：延迟、单价、数据是否出境、是否可关训练、出问题能否审计。`;

  const sec2 = `${s2Titles[index % s2Titles.length]}
切入角度：${angle}。建议按三步推进：①用真实业务样本做 20–30 条盲测，记录正确率与返工分钟数；②把提示词/工作流写成可版本管理的资产，避免人走政息；③上线后看单位成本（单篇、单次通话、单条视频），而不是只看订阅标价。若涉及生成内容外发，同步做版权与标识合规检查，尤其是广告法与深度合成相关要求。`;

  const close = `## 行动清单
- 核对官网价目与商用条款（以当期为准）
- 准备业务评测集，拒绝只看公榜
- 设定人工终审节点：数字、法律、医疗、金融表述必须人审
- 记录 ${keyword} 场景下的失败案例，每月复盘一次路由/工具组合
按上面执行，${keyword} 才能从「试用」变成可核算的生产能力。`;

  let body = [lead, sec1, sec2, close].join("\n\n");
  let han = countHan(body);

  // 扩写到约 800
  const fillers = [
    `实操上，先固定输入模板（目标用户、约束、输出格式、禁止项），再允许模型发散，返工率通常低于「一句随便写」。`,
    `成本侧建议同时统计：订阅费、API token、审核人力、返工时长；视频与配音类目往往被低估。`,
    `若团队超过 5 人共用，优先评估是否需要统一账号治理与提示词仓库，否则资产会散落在个人聊天记录里。`,
    `对导航与内容站来说，评测页应写清评测日期与版本号，工具一更新就回写数据，避免过期结论继续获流。`,
  ];
  let i = 0;
  while (han < 780 && i < 20) {
    body = body.replace(
      "按上面执行",
      `${fillers[i % fillers.length]}按上面执行`
    );
    // better append before checklist
    if (i > 0) {
      body += `\n\n${fillers[(i + 2) % fillers.length]}`;
    }
    han = countHan(body);
    i++;
  }
  // 压缩过长
  while (han > 900) {
    body = body.slice(0, Math.floor(body.length * 0.92));
    han = countHan(body);
  }
  return body;
}

function descriptionSafe(spec) {
  return spec.description ? `${spec.description.replace(/。$/, "")}。` : "";
}

function toMarkdown(spec, index) {
  const month = String((index % 12) + 1).padStart(2, "0");
  const day = String((index % 27) + 1).padStart(2, "0");
  const related =
    spec.relatedToolIds.length > 0
      ? spec.relatedToolIds.map((id) => `  - ${id}`).join("\n")
      : "  []";
  const body = buildBody(spec, index);
  return `---
title: "${spec.title}"
keyword: "${spec.keyword}"
description: "${spec.description}"
category: "${spec.category}"
relatedToolIds:
${related}
publishedAt: "2026-${month}-${day}"
---

${body}
`;
}

const specs = extractSpecs(specSrc);
const outDir = path.join(root, "content", "articles");
fs.mkdirSync(outDir, { recursive: true });

let written = 0;
let skipped = 0;
for (let i = 0; i < specs.length; i++) {
  const spec = specs[i];
  const fp = path.join(outDir, `${spec.slug}.md`);
  if (fs.existsSync(fp) && !force) {
    skipped++;
    continue;
  }
  fs.writeFileSync(fp, toMarkdown(spec, i), "utf8");
  written++;
}

const files = fs.readdirSync(outDir).filter((f) => f.endsWith(".md"));
const counts = files.map((f) => {
  const raw = fs.readFileSync(path.join(outDir, f), "utf8");
  const body = raw.replace(/^---[\s\S]*?---/, "");
  return { f, han: countHan(body) };
});
const bad = counts.filter((c) => c.han < 750 || c.han > 950);

console.log(
  JSON.stringify(
    {
      specs: specs.length,
      files: files.length,
      written,
      skipped,
      hanMin: Math.min(...counts.map((c) => c.han)),
      hanMax: Math.max(...counts.map((c) => c.han)),
      outliers: bad.length,
      sampleOutliers: bad.slice(0, 5),
    },
    null,
    2
  )
);
