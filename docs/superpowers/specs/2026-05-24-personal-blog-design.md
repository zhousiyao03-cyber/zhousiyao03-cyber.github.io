# 个人博客 v1 设计 — zeusyao.github.io

> 日期：2026-05-24　作者：zeusyao　状态：待评审

## 1. 背景与目标

为 zeusyao（前端工程师 @ 新加坡，在学 AI agent + 一点后端）搭一个**个人品牌 + 写作记录**型博客。
参考站点风格：[ursb.me](https://ursb.me/)（干净极简、深浅色、内容为主）。

v1 只做**核心内容站**：能写文章、能展示项目、能让人快速了解"我是谁"。生活记录类模块和 AI 互动均延后。

成功标准：
- 写一篇新文章 = 丢一个 `.mdx` 文件 + `git push`，自动上线。
- 首页能体现个人品牌；项目页能展示已有作品；文章页排版舒服、有目录、支持深浅色。
- Lighthouse 性能/SEO 接近满分（静态站应能轻松做到）。

## 2. 范围

### v1 in-scope
- 首页 / About / Blog 列表 / Blog 详情 / Projects
- 深浅色模式（无闪烁）、文章目录（TOC）、RSS、sitemap、基础 SEO（OG 标签）
- 内容用 Astro Content Collections 管理（类型安全 frontmatter）
- 部署到 GitHub Pages，域名 `zeusyao.github.io`

### 明确延后（v2+）
- **AI「跟博客对话」**：轻量 RAG（全文喂 Claude API + prompt caching），接口部署在 **knosi 服务器**（Hetzner）。v1 完全不含服务端。
- 生活记录类：漫画、照片、健身/听歌/读书、留言板、付费咨询。
- 自定义裸域名（`zeusyao.com/.dev/.me` 等，需付费购买）。

## 3. 技术栈

| 关注点 | 选型 | 理由 |
|---|---|---|
| 框架 | **Astro 5** | 内容站最佳：默认零 JS、构建为纯静态、SEO 好 |
| 文章格式 | **MDX** | Markdown + 可按需嵌组件 |
| 样式 | **Tailwind CSS v4** + `@tailwindcss/typography` | 快、易维护，`prose` 处理文章排版 |
| 包管理 | pnpm（默认；如本机无则 npm） | — |
| 部署 | **GitHub Pages**，仓库 `zeusyao.github.io` | 免费、零运维；`git push` 经 GitHub Actions 自动构建发布 |

> 纯静态，v1 无任何运行时服务端。

## 4. 站点结构 / 路由

```
/                首页（自我介绍 + 最新文章 + 精选项目）
/blog            文章列表（按日期倒序，可按 tag 过滤——v1 先做列表，tag 过滤可选）
/blog/[slug]     文章详情（TOC、深浅色、上一篇/下一篇可选）
/projects        项目展示（Knosi / Noesis / SGLifeSim 等）
/about           关于我
/rss.xml         RSS feed
/sitemap-*.xml   sitemap（@astrojs/sitemap 自动生成）
404              自定义 404
```

## 5. 内容模型（Astro Content Collections）

`src/content.config.ts` 定义两个集合，frontmatter 用 zod 校验：

**blog**（`src/content/blog/*.mdx`）
```
title: string
date: Date
summary: string
tags: string[]        // 可选，默认 []
draft: boolean        // 可选，默认 false；draft 不在生产构建中显示
cover: string         // 可选，封面图
```

**projects**（`src/content/projects/*.mdx`）
```
name: string
role: string          // 你在项目中的角色/一句话定位
stack: string[]       // 技术栈标签
links: { label: string, url: string }[]   // 可选，repo/demo 链接
featured: boolean     // 可选，默认 false；首页只展示 featured
order: number         // 可选，用于排序
```

发布流程：新增/编辑 `.mdx` → commit → push → Actions 构建 → GitHub Pages 上线。

## 6. 组件（各自职责单一、可独立理解）

| 组件 | 职责 | 依赖 |
|---|---|---|
| `BaseLayout` | HTML 骨架、`<head>`/SEO、主题脚本注入 | SEO 数据 |
| `Header` / `Nav` | 站点导航 | 当前路径 |
| `ThemeToggle` | 深浅色切换，`localStorage` 持久化，首屏内联脚本防闪烁 | — |
| `PostLayout` | 文章详情布局，含 `prose` 容器 | TOC |
| `TOC` | 由 MDX 标题生成目录，滚动高亮（可选） | 文章 headings |
| `PostCard` | 文章列表卡片 | blog entry |
| `ProjectCard` | 项目卡片 | project entry |
| `Footer` | 页脚（社交链接、版权、RSS） | 站点配置 |

站点级常量（站名、作者、社交链接、导航项）集中放 `src/config.ts`，避免散落。

## 7. 视觉风格

干净极简，对标 ursb.me：克制的留白、衬线/无衬线搭配、代码用等宽字体；深浅色双主题。
v1 不追求花哨动效；先把排版与可读性做好。具体配色和字体在实现阶段定，必要时可视化对比。

## 8. 部署

- 仓库名必须为 `zeusyao.github.io`（GitHub Pages 用户站约定），分支 `main`。
- 通过 **GitHub Actions** 官方 `withastro/action` 构建并部署到 Pages。
- `astro.config` 设 `site: 'https://zeusyao.github.io'`（用户站根路径，无需 `base`）。
- 自定义域名：v1 暂不购买，沿用 `zeusyao.github.io`。

## 9. SEO / Feed

- 每页输出 `<title>`、`description`、Open Graph / Twitter 卡片标签（经 `BaseLayout` 统一处理）。
- `@astrojs/rss` 生成 `/rss.xml`；`@astrojs/sitemap` 生成 sitemap。
- 文章页加 `article` 结构化数据（可选）。

## 10. 测试与质量

个人博客，轻量即可：
- 构建必须通过（`astro build` 无报错）。
- 链接检查：构建产物无死链（可用 `astro` 内置或简单脚本）。
- 类型检查：`astro check` 通过（content collections 的 frontmatter 校验在此体现）。
- 不引入重型 E2E / 单测框架。

## 11. 开放问题 / 待确认

- knosi 服务器现有的 web 栈（是否已有 nginx、是否已有域名）——影响 **v2** AI 接口部署，v1 不阻塞。
- 配色与字体的具体方案——实现阶段确定。
- 初始要导入哪些文章/项目——你提供素材或我从现有 repo 里整理草稿。

---

**v1 一句话总结**：Astro + MDX + Tailwind 的纯静态博客，含首页/Blog/Projects/About、深浅色、RSS/SEO，部署到 `zeusyao.github.io`；AI 与生活记录模块留待 v2。
