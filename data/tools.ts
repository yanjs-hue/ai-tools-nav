export type CategoryId =
  | "all"
  | "chat"
  | "image"
  | "video"
  | "writing"
  | "coding"
  | "audio"
  | "productivity"
  | "search";

export interface Category {
  id: CategoryId;
  name: string;
  description: string;
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  url: string;
  category: Exclude<CategoryId, "all">;
  tags: string[];
  featured?: boolean;
  free?: boolean;
}

export const categories: Category[] = [
  { id: "all", name: "全部", description: "全部 AI 工具" },
  { id: "chat", name: "对话助手", description: "AI 聊天与问答" },
  { id: "image", name: "图像生成", description: "文生图与图像编辑" },
  { id: "video", name: "视频生成", description: "AI 视频创作" },
  { id: "writing", name: "写作文案", description: "写作与内容生成" },
  { id: "coding", name: "编程开发", description: "代码助手与开发工具" },
  { id: "audio", name: "音频语音", description: "语音合成与音频处理" },
  { id: "productivity", name: "效率办公", description: "办公与自动化" },
  { id: "search", name: "搜索研究", description: "AI 搜索与知识检索" },
];

export const tools: Tool[] = [
  {
    id: "chatgpt",
    name: "ChatGPT",
    description: "OpenAI 对话模型，适合写作、编程、学习与日常问答。",
    url: "https://chatgpt.com",
    category: "chat",
    tags: ["对话", "GPT", "热门"],
    featured: true,
    free: true,
  },
  {
    id: "claude",
    name: "Claude",
    description: "Anthropic 出品，长文本理解强，适合分析与写作。",
    url: "https://claude.ai",
    category: "chat",
    tags: ["对话", "长文本"],
    featured: true,
    free: true,
  },
  {
    id: "gemini",
    name: "Google Gemini",
    description: "谷歌多模态助手，支持文本、图片与文档理解。",
    url: "https://gemini.google.com",
    category: "chat",
    tags: ["对话", "多模态"],
    free: true,
  },
  {
    id: "kimi",
    name: "Kimi",
    description: "月之暗面长上下文助手，擅长文档阅读与检索。",
    url: "https://kimi.moonshot.cn",
    category: "chat",
    tags: ["对话", "长文本", "国产"],
    free: true,
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    description: "高性价比推理与对话模型，编程能力突出。",
    url: "https://chat.deepseek.com",
    category: "chat",
    tags: ["对话", "推理", "国产"],
    featured: true,
    free: true,
  },
  {
    id: "midjourney",
    name: "Midjourney",
    description: "高质量艺术风格文生图，创意视觉首选。",
    url: "https://www.midjourney.com",
    category: "image",
    tags: ["文生图", "艺术"],
    featured: true,
  },
  {
    id: "dalle",
    name: "DALL·E",
    description: "OpenAI 图像生成，集成于 ChatGPT。",
    url: "https://openai.com/dall-e-3",
    category: "image",
    tags: ["文生图"],
    free: true,
  },
  {
    id: "stable-diffusion",
    name: "Stable Diffusion",
    description: "开源图像生成生态，可本地部署或云端使用。",
    url: "https://stability.ai",
    category: "image",
    tags: ["开源", "文生图"],
    free: true,
  },
  {
    id: "ideogram",
    name: "Ideogram",
    description: "擅长文字排版与 Logo 风格图像生成。",
    url: "https://ideogram.ai",
    category: "image",
    tags: ["文字渲染", "设计"],
    free: true,
  },
  {
    id: "runway",
    name: "Runway",
    description: "AI 视频生成与剪辑平台，创意视频工作流。",
    url: "https://runwayml.com",
    category: "video",
    tags: ["视频", "剪辑"],
    featured: true,
  },
  {
    id: "pika",
    name: "Pika",
    description: "轻松将文字或图片生成短视频。",
    url: "https://pika.art",
    category: "video",
    tags: ["短视频"],
    free: true,
  },
  {
    id: "kling",
    name: "可灵 AI",
    description: "快手出品的文生视频工具，国内可用。",
    url: "https://klingai.com",
    category: "video",
    tags: ["视频", "国产"],
    free: true,
  },
  {
    id: "notion-ai",
    name: "Notion AI",
    description: "嵌入 Notion 的写作与总结助手。",
    url: "https://www.notion.so/product/ai",
    category: "writing",
    tags: ["写作", "笔记"],
  },
  {
    id: "jasper",
    name: "Jasper",
    description: "面向营销的 AI 文案与内容生成平台。",
    url: "https://www.jasper.ai",
    category: "writing",
    tags: ["营销", "文案"],
  },
  {
    id: "copy-ai",
    name: "Copy.ai",
    description: "快速生成广告、邮件与社交媒体文案。",
    url: "https://www.copy.ai",
    category: "writing",
    tags: ["文案", "营销"],
    free: true,
  },
  {
    id: "github-copilot",
    name: "GitHub Copilot",
    description: "IDE 内代码补全与结对编程助手。",
    url: "https://github.com/features/copilot",
    category: "coding",
    tags: ["编程", "IDE"],
    featured: true,
  },
  {
    id: "agent-qa",
    name: "agent-qa",
    description: "自然语言 Web、Android 与 iOS 测试，结合 memidex 持久记忆与经验证的自我改进。CLI 免费，模型费用另计。",
    url: "https://vostride.com",
    category: "coding",
    tags: ["自动化测试", "持久记忆", "MCP"],
    free: true,
  },
  {
    id: "cursor",
    name: "Cursor",
    description: "面向 AI 编程的代码编辑器，支持多文件理解。",
    url: "https://cursor.com",
    category: "coding",
    tags: ["编程", "编辑器"],
    featured: true,
    free: true,
  },
  {
    id: "v0",
    name: "v0",
    description: "Vercel 出品，用自然语言生成 UI 界面。",
    url: "https://v0.dev",
    category: "coding",
    tags: ["前端", "UI"],
    free: true,
  },
  {
    id: "elevenlabs",
    name: "ElevenLabs",
    description: "高质量 AI 语音合成与克隆。",
    url: "https://elevenlabs.io",
    category: "audio",
    tags: ["TTS", "语音"],
    featured: true,
    free: true,
  },
  {
    id: "suno",
    name: "Suno",
    description: "用文字描述生成完整歌曲。",
    url: "https://suno.com",
    category: "audio",
    tags: ["音乐", "生成"],
    free: true,
  },
  {
    id: "whisper",
    name: "Whisper",
    description: "OpenAI 开源语音转文字模型。",
    url: "https://openai.com/research/whisper",
    category: "audio",
    tags: ["STT", "开源"],
    free: true,
  },
  {
    id: "gamma",
    name: "Gamma",
    description: "AI 一键生成演示文稿与文档页面。",
    url: "https://gamma.app",
    category: "productivity",
    tags: ["PPT", "演示"],
    free: true,
  },
  {
    id: "perplexity",
    name: "Perplexity",
    description: "带引用来源的 AI 搜索引擎。",
    url: "https://www.perplexity.ai",
    category: "search",
    tags: ["搜索", "研究"],
    featured: true,
    free: true,
  },
  {
    id: "you",
    name: "You.com",
    description: "AI 驱动的搜索与对话一体化体验。",
    url: "https://you.com",
    category: "search",
    tags: ["搜索"],
    free: true,
  },
  {
    id: "phind",
    name: "Phind",
    description: "面向开发者的 AI 搜索与问答。",
    url: "https://www.phind.com",
    category: "search",
    tags: ["搜索", "编程"],
    free: true,
  },
  {
    id: "otter",
    name: "Otter.ai",
    description: "会议录音转写与智能纪要。",
    url: "https://otter.ai",
    category: "productivity",
    tags: ["会议", "转写"],
    free: true,
  },
  {
    id: "zapier",
    name: "Zapier AI",
    description: "用 AI 串联应用，自动化工作流。",
    url: "https://zapier.com/ai",
    category: "productivity",
    tags: ["自动化", "工作流"],
    free: true,
  },
];
