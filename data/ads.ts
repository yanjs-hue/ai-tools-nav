export type AdSlotId = "banner-top" | "sidebar" | "inline-mid" | "footer";

export interface AdSlot {
  id: AdSlotId;
  label: string;
  /** 广告主文案 / 占位说明 */
  title: string;
  description: string;
  /** 点击跳转链接；正式投放时可换成联盟或广告主链接 */
  href: string;
  cta: string;
  /** 尺寸提示，方便对接真实广告网络 */
  size: string;
  enabled: boolean;
}

/**
 * 广告位配置 —— 改这里即可上线广告。
 * 接入 Google AdSense / 联盟广告时：
 * 1. 将 enabled 设为 true
 * 2. 在 AdSlot 组件中替换为广告脚本，或把 href 换成落地页
 */
export const adSlots: Record<AdSlotId, AdSlot> = {
  "banner-top": {
    id: "banner-top",
    label: "顶部横幅",
    title: "广告位 · 顶部横幅",
    description: "728×90 / 自适应横幅，适合品牌曝光与联盟推广。",
    href: "#",
    cta: "投放咨询",
    size: "728×90",
    enabled: true,
  },
  sidebar: {
    id: "sidebar",
    label: "侧边栏",
    title: "广告位 · 侧边栏",
    description: "300×250 展示位，适合工具推广与赞助商。",
    href: "#",
    cta: "成为赞助商",
    size: "300×250",
    enabled: true,
  },
  "inline-mid": {
    id: "inline-mid",
    label: "列表插播",
    title: "广告位 · 列表插播",
    description: "穿插在工具列表中的原生广告位。",
    href: "#",
    cta: "立即投放",
    size: "自适应",
    enabled: true,
  },
  footer: {
    id: "footer",
    label: "页脚",
    title: "广告位 · 页脚横幅",
    description: "页脚品牌位，适合长期合作伙伴。",
    href: "#",
    cta: "联系合作",
    size: "自适应",
    enabled: true,
  },
};
