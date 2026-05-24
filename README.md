# zeusyao.github.io

个人博客，Astro + MDX + Tailwind v4，纯静态，部署在 GitHub Pages。

## 开发

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # 产物在 dist/
npm run check    # 类型 + 内容 schema 校验
```

## 写文章

在 `src/content/blog/` 新增 `.mdx` 文件，frontmatter 见现有文章：

```yaml
---
title: 标题
date: 2026-05-24
summary: 一句话摘要（用于列表和 RSS）
tags: [标签1, 标签2]
draft: false        # true 则不发布
---
```

`git push` 到 `main` 后，GitHub Actions 自动构建并部署。

## 加项目

在 `src/content/projects/` 新增 `.mdx`：`featured: true` 会出现在首页，`order` 控制排序。

## 改外观

- 主题色：改 `src/styles/global.css` 里的 `--color-accent` / `--color-accent-soft`。
- 站点信息 / 导航 / 社交链接：改 `src/config.ts`。

## 路线图

- v1（当前）：首页 / Blog / Projects / About / 标签页，深浅色、文章目录、阅读时长、上下篇导航、代码块双主题、RSS、sitemap、SEO/OG、无障碍。
- v1.1（备选）：每篇文章自动生成 OG 社交分享图（需引入中文字体子集）。
- v2：「跟博客对话」AI（轻量 RAG + Claude API），接口部署在自有服务器。

## 技术栈

Astro 5 · MDX · Tailwind CSS v4 · GitHub Pages
