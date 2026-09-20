import type { Metadata } from "next";
import { Syne, Manrope } from "next/font/google";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AI 导航 | 精选 AI 工具导航",
  description:
    "简洁深色风格的 AI 工具导航站，按分类浏览对话、图像、视频、编程等热门工具。",
  keywords: ["AI工具", "AI导航", "ChatGPT", "AIGC", "人工智能"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={`${syne.variable} ${manrope.variable}`}>
      <body
        style={
          {
            "--font-display": "var(--font-syne), Syne, sans-serif",
            "--font-body": "var(--font-manrope), Manrope, sans-serif",
          } as React.CSSProperties
        }
      >
        {children}
      </body>
    </html>
  );
}
