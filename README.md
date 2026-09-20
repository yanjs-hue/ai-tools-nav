# AI 工具导航

简洁深色风格的 AI 工具导航站：分类浏览、搜索筛选、广告位预留，可直接本地运行，并一键部署到 Vercel。

## 功能

- 深色简洁 UI（响应式）
- 8 大分类 + 搜索 / 精选 / 免费筛选
- 4 个广告位：顶部横幅、侧边栏、列表插播、页脚
- 数据与广告配置分离，改 JSON/TS 即可上线内容

## 本地运行

```bash
npm install
npm run dev
```

浏览器打开 [http://localhost:3000](http://localhost:3000)。

文章库：[/blog](http://localhost:3000/blog)（100 篇 SEO 文章，约 800 字/篇）

### 文章维护

- 正文：`content/articles/*.md`
- 选题与数据锚点：`data/articleSpecs.ts`
- 补齐/扩写脚本：`node scripts/expand-articles.mjs`、`node scripts/dedupe-polish-articles.mjs`

## 一键部署到 Vercel

1. 将本项目推送到 GitHub / GitLab / Bitbucket  
2. 打开 [https://vercel.com/new](https://vercel.com/new)  
3. 导入仓库，框架会自动识别为 **Next.js**，直接 Deploy  

或使用 Vercel CLI：

```bash
npm i -g vercel
vercel
```

也可点击下方按钮（需先把仓库放到 GitHub 后替换 `YOUR_USERNAME/YOUR_REPO`）：

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/YOUR_REPO)

## 如何增删工具

编辑 `data/tools.ts`：

```ts
{
  id: "my-tool",
  name: "我的工具",
  description: "一句话介绍",
  url: "https://example.com",
  category: "chat", // chat | image | video | writing | coding | audio | productivity | search
  tags: ["标签"],
  featured: true,  // 可选
  free: true,      // 可选
}
```

## 如何配置广告位

编辑 `data/ads.ts`：

- `enabled: false` 可关闭某个广告位  
- 修改 `title` / `description` / `href` / `cta` 即可换文案与跳转  
- 接入 AdSense 等时，可在 `components/AdSlot.tsx` 中替换为广告脚本

广告位 ID：

| ID | 位置 |
|---|---|
| `banner-top` | 顶部横幅 |
| `sidebar` | 左侧栏 |
| `inline-mid` | 工具列表中间 |
| `footer` | 页脚 |

## 技术栈

- Next.js 15（App Router）
- React 19 + TypeScript
- 纯 CSS（无 UI 库依赖）
