# 个人博客 v1 实现计划 — zeusyao.github.io

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 搭一个 Astro + MDX + Tailwind v4 的纯静态个人博客，含首页/Blog/Projects/About、深浅色、RSS/SEO，部署到 GitHub Pages（`zeusyao.github.io`）。

**Architecture:** 纯静态站，构建期把 MDX 内容渲染成 HTML，无运行时服务端。内容用 Astro 5 Content Layer（glob loader + zod schema）管理；样式用 Tailwind v4（Vite 插件）+ typography 插件；深浅色用 class 策略 + 首屏内联脚本防闪烁；GitHub Actions 自动构建并发布到 Pages。

**Tech Stack:** Astro 5, MDX (`@astrojs/mdx`), Tailwind CSS v4 (`@tailwindcss/vite` + `@tailwindcss/typography`), `@astrojs/rss`, `@astrojs/sitemap`, npm, GitHub Actions。

> 命令以 Windows / PowerShell 为主（用户主力环境）。验证用 `npm run build` 通过 + 检查 `dist/` 下产物 HTML 存在；`npm run dev` 用于人工肉眼确认。

---

## 文件结构

```
zeusyao.github.io/
├── .github/workflows/deploy.yml      # GitHub Pages 部署
├── .gitignore
├── package.json
├── astro.config.mjs                  # site / 集成 / Tailwind vite 插件
├── tsconfig.json
├── src/
│   ├── config.ts                     # 站点常量：站名/作者/导航/社交
│   ├── styles/global.css             # Tailwind 入口 + dark variant + typography
│   ├── content.config.ts             # blog / projects 集合 schema
│   ├── content/
│   │   ├── blog/hello-world.mdx      # 示例文章
│   │   └── projects/knosi.mdx        # 示例项目
│   ├── layouts/
│   │   ├── BaseLayout.astro          # HTML 骨架 + SEO + 主题脚本
│   │   └── PostLayout.astro          # 文章详情布局（prose + TOC）
│   ├── components/
│   │   ├── ThemeToggle.astro
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── TOC.astro
│   │   ├── PostCard.astro
│   │   └── ProjectCard.astro
│   └── pages/
│       ├── index.astro               # 首页
│       ├── about.astro
│       ├── blog/index.astro          # 文章列表
│       ├── blog/[...slug].astro      # 文章详情
│       ├── projects/index.astro      # 项目列表
│       ├── rss.xml.js                # RSS
│       └── 404.astro
└── public/                           # 静态资源（favicon 等）
```

---

## Task 1: 项目骨架与依赖

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `.gitignore`
- Create: `src/styles/global.css`
- Create: `public/.gitkeep`

- [ ] **Step 1: 写 `.gitignore`**

```
node_modules/
dist/
.astro/
.DS_Store
*.log
```

- [ ] **Step 2: 写 `package.json`**

```json
{
  "name": "zeusyao-blog",
  "type": "module",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "check": "astro check"
  },
  "dependencies": {
    "astro": "^5.0.0",
    "@astrojs/mdx": "^4.0.0",
    "@astrojs/rss": "^4.0.0",
    "@astrojs/sitemap": "^3.2.0"
  },
  "devDependencies": {
    "@astrojs/check": "^0.9.0",
    "typescript": "^5.6.0",
    "tailwindcss": "^4.0.0",
    "@tailwindcss/vite": "^4.0.0",
    "@tailwindcss/typography": "^0.5.15"
  }
}
```

- [ ] **Step 3: 写 `astro.config.mjs`**

```js
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://zeusyao.github.io',
  integrations: [mdx(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
```

- [ ] **Step 4: 写 `tsconfig.json`**

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"]
}
```

- [ ] **Step 5: 写 `src/styles/global.css`**

```css
@import "tailwindcss";
@plugin "@tailwindcss/typography";

/* class 策略的深色模式：.dark 在 <html> 上时生效 */
@custom-variant dark (&:where(.dark, .dark *));

:root {
  color-scheme: light dark;
}

html {
  scroll-behavior: smooth;
}
```

- [ ] **Step 6: 创建 `public/.gitkeep`（占位，保证 public 目录存在）**

空文件即可。

- [ ] **Step 7: 安装依赖**

Run: `npm install`
Expected: 安装成功，生成 `node_modules/` 和 `package-lock.json`，无 ERR。

- [ ] **Step 8: 提交**

```powershell
git add .gitignore package.json package-lock.json astro.config.mjs tsconfig.json src/styles/global.css public/.gitkeep
git commit -m "chore: 初始化 Astro + Tailwind v4 骨架"
```

---

## Task 2: 站点配置 `config.ts`

**Files:**
- Create: `src/config.ts`

- [ ] **Step 1: 写 `src/config.ts`**

```ts
export const SITE = {
  title: 'zeusyao',
  description: '前端工程师 @ 新加坡，在折腾 AI agent。这里记录写作、项目与学习。',
  author: 'zeusyao',
  url: 'https://zeusyao.github.io',
  lang: 'zh-CN',
} as const;

export const NAV: { label: string; href: string }[] = [
  { label: 'Home', href: '/' },
  { label: 'Blog', href: '/blog' },
  { label: 'Projects', href: '/projects' },
  { label: 'About', href: '/about' },
];

export const SOCIAL: { label: string; href: string }[] = [
  { label: 'GitHub', href: 'https://github.com/zeusyao' },
  { label: 'RSS', href: '/rss.xml' },
];
```

- [ ] **Step 2: 提交**

```powershell
git add src/config.ts
git commit -m "feat: 站点配置常量"
```

---

## Task 3: BaseLayout + SEO + 防闪烁主题脚本

**Files:**
- Create: `src/layouts/BaseLayout.astro`

- [ ] **Step 1: 写 `src/layouts/BaseLayout.astro`**

```astro
---
import '../styles/global.css';
import { SITE } from '../config';

interface Props {
  title?: string;
  description?: string;
  /** 文章页传 true，用于 OG type=article */
  article?: boolean;
}

const { title, description = SITE.description, article = false } = Astro.props;
const pageTitle = title ? `${title} · ${SITE.title}` : SITE.title;
const canonical = new URL(Astro.url.pathname, SITE.url).href;
---

<!doctype html>
<html lang={SITE.lang} class="scroll-smooth">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" href="/favicon.svg" />
    <title>{pageTitle}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={canonical} />
    <link rel="alternate" type="application/rss+xml" title={SITE.title} href="/rss.xml" />

    <!-- Open Graph / Twitter -->
    <meta property="og:title" content={pageTitle} />
    <meta property="og:description" content={description} />
    <meta property="og:type" content={article ? 'article' : 'website'} />
    <meta property="og:url" content={canonical} />
    <meta name="twitter:card" content="summary_large_image" />

    <!-- 防闪烁：在样式应用前确定主题 -->
    <script is:inline>
      (() => {
        const stored = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (stored === 'dark' || (!stored && prefersDark)) {
          document.documentElement.classList.add('dark');
        }
      })();
    </script>
  </head>
  <body class="min-h-screen bg-white text-zinc-900 antialiased dark:bg-zinc-950 dark:text-zinc-100">
    <slot />
  </body>
</html>
```

- [ ] **Step 2: 临时用一下以便构建验证 —— 写一个最小 `src/pages/index.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout title="Home">
  <main class="mx-auto max-w-2xl px-4 py-16">
    <h1 class="text-3xl font-bold">zeusyao</h1>
    <p class="mt-2 text-zinc-600 dark:text-zinc-400">骨架占位，后续替换。</p>
  </main>
</BaseLayout>
```

- [ ] **Step 3: 构建验证**

Run: `npm run build`
Expected: 构建成功；产物存在。

Run: `Test-Path dist/index.html`
Expected: `True`

- [ ] **Step 4: 提交**

```powershell
git add src/layouts/BaseLayout.astro src/pages/index.astro
git commit -m "feat: BaseLayout 含 SEO 与防闪烁主题脚本"
```

---

## Task 4: ThemeToggle 组件

**Files:**
- Create: `src/components/ThemeToggle.astro`

- [ ] **Step 1: 写 `src/components/ThemeToggle.astro`**

```astro
---
---
<button
  id="theme-toggle"
  type="button"
  aria-label="切换深浅色"
  class="rounded-md p-2 text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
>
  <span class="block dark:hidden">🌙</span>
  <span class="hidden dark:block">☀️</span>
</button>

<script is:inline>
  document.getElementById('theme-toggle')?.addEventListener('click', () => {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });
</script>
```

- [ ] **Step 2: 构建验证**

Run: `npm run build`
Expected: 构建成功（组件此时未被引用，仅验证语法不报错；下一任务接入 Header）。

- [ ] **Step 3: 提交**

```powershell
git add src/components/ThemeToggle.astro
git commit -m "feat: 深浅色切换按钮"
```

---

## Task 5: Header / Footer

**Files:**
- Create: `src/components/Header.astro`
- Create: `src/components/Footer.astro`

- [ ] **Step 1: 写 `src/components/Header.astro`**

```astro
---
import { SITE, NAV } from '../config';
import ThemeToggle from './ThemeToggle.astro';
const path = Astro.url.pathname;
const isActive = (href: string) =>
  href === '/' ? path === '/' : path.startsWith(href);
---
<header class="border-b border-zinc-200 dark:border-zinc-800">
  <div class="mx-auto flex max-w-2xl items-center justify-between px-4 py-4">
    <a href="/" class="font-semibold tracking-tight">{SITE.title}</a>
    <nav class="flex items-center gap-1 text-sm">
      {NAV.map((item) => (
        <a
          href={item.href}
          class:list={[
            'rounded-md px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800',
            isActive(item.href) ? 'font-medium text-zinc-900 dark:text-zinc-100' : 'text-zinc-500 dark:text-zinc-400',
          ]}
        >
          {item.label}
        </a>
      ))}
      <ThemeToggle />
    </nav>
  </div>
</header>
```

- [ ] **Step 2: 写 `src/components/Footer.astro`**

```astro
---
import { SITE, SOCIAL } from '../config';
const year = new Date().getFullYear();
---
<footer class="mt-16 border-t border-zinc-200 dark:border-zinc-800">
  <div class="mx-auto flex max-w-2xl flex-col gap-2 px-4 py-8 text-sm text-zinc-500 dark:text-zinc-400 sm:flex-row sm:items-center sm:justify-between">
    <span>© {year} {SITE.author}</span>
    <nav class="flex gap-4">
      {SOCIAL.map((s) => (
        <a href={s.href} class="hover:text-zinc-900 dark:hover:text-zinc-100">{s.label}</a>
      ))}
    </nav>
  </div>
</footer>
```

- [ ] **Step 3: 把 Header/Footer 接入 `BaseLayout.astro` 的 `<body>`**

将 `BaseLayout.astro` 的 `<body>` 内容改为：

```astro
  <body class="min-h-screen bg-white text-zinc-900 antialiased dark:bg-zinc-950 dark:text-zinc-100">
    <Header />
    <slot />
    <Footer />
  </body>
```

并在 frontmatter（`---` 之间）顶部加导入：

```astro
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
```

- [ ] **Step 4: 构建验证 + 肉眼预览**

Run: `npm run build`
Expected: 成功，`Test-Path dist/index.html` 为 `True`。

Run: `npm run dev`，浏览器打开 `http://localhost:4321`，确认顶部导航与页脚出现、点击 🌙/☀️ 能切换深浅色且刷新后保持。确认后 Ctrl+C 停止。

- [ ] **Step 5: 提交**

```powershell
git add src/components/Header.astro src/components/Footer.astro src/layouts/BaseLayout.astro
git commit -m "feat: 站点 Header 与 Footer 接入布局"
```

---

## Task 6: Content Collections schema + 示例内容

**Files:**
- Create: `src/content.config.ts`
- Create: `src/content/blog/hello-world.mdx`
- Create: `src/content/projects/knosi.mdx`

- [ ] **Step 1: 写 `src/content.config.ts`**

```ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    summary: z.string(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    cover: z.string().optional(),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/projects' }),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    stack: z.array(z.string()).default([]),
    links: z.array(z.object({ label: z.string(), url: z.string() })).default([]),
    featured: z.boolean().default(false),
    order: z.number().default(0),
  }),
});

export const collections = { blog, projects };
```

- [ ] **Step 2: 写 `src/content/blog/hello-world.mdx`**

```mdx
---
title: 你好，世界
date: 2026-05-24
summary: 博客的第一篇文章，测试一下 MDX 渲染与排版。
tags: [杂记]
---

这是第一篇文章。可以在 MDX 里写 **Markdown**，也能嵌入组件。

## 二级标题

正文段落。代码块：

```ts
const hello = (name: string) => `你好，${name}`;
```
```

- [ ] **Step 3: 写 `src/content/projects/knosi.mdx`**

```mdx
---
name: Knosi
role: 个人知识库 / agent 实验平台
stack: [TypeScript, MCP, Claude API]
links:
  - label: 主页
    url: https://github.com/zeusyao
featured: true
order: 1
---

Knosi 是我的知识管理与 AI agent 实验项目。
```

- [ ] **Step 4: 类型与内容校验**

Run: `npm run check`
Expected: `astro check` 通过，0 errors。frontmatter 不符合 schema 会在此报错。

- [ ] **Step 5: 提交**

```powershell
git add src/content.config.ts src/content/blog/hello-world.mdx src/content/projects/knosi.mdx
git commit -m "feat: blog/projects 内容集合 schema 与示例内容"
```

---

## Task 7: PostCard / ProjectCard 组件

**Files:**
- Create: `src/components/PostCard.astro`
- Create: `src/components/ProjectCard.astro`

- [ ] **Step 1: 写 `src/components/PostCard.astro`**

```astro
---
import type { CollectionEntry } from 'astro:content';
interface Props { post: CollectionEntry<'blog'> }
const { post } = Astro.props;
const dateStr = post.data.date.toISOString().slice(0, 10);
---
<article class="group">
  <a href={`/blog/${post.id}`} class="block py-3">
    <div class="flex items-baseline justify-between gap-4">
      <h3 class="font-medium group-hover:underline">{post.data.title}</h3>
      <time class="shrink-0 text-sm text-zinc-400" datetime={dateStr}>{dateStr}</time>
    </div>
    <p class="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{post.data.summary}</p>
  </a>
</article>
```

- [ ] **Step 2: 写 `src/components/ProjectCard.astro`**

```astro
---
import type { CollectionEntry } from 'astro:content';
interface Props { project: CollectionEntry<'projects'> }
const { project } = Astro.props;
const { name, role, stack, links } = project.data;
---
<article class="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
  <h3 class="font-semibold">{name}</h3>
  <p class="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{role}</p>
  {stack.length > 0 && (
    <ul class="mt-3 flex flex-wrap gap-2">
      {stack.map((t) => (
        <li class="rounded bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">{t}</li>
      ))}
    </ul>
  )}
  {links.length > 0 && (
    <div class="mt-3 flex gap-3 text-sm">
      {links.map((l) => (
        <a href={l.url} class="text-blue-600 hover:underline dark:text-blue-400">{l.label}</a>
      ))}
    </div>
  )}
</article>
```

- [ ] **Step 3: 构建验证**

Run: `npm run build`
Expected: 成功（组件暂未引用，验证语法）。

- [ ] **Step 4: 提交**

```powershell
git add src/components/PostCard.astro src/components/ProjectCard.astro
git commit -m "feat: 文章卡片与项目卡片组件"
```

---

## Task 8: 首页 `/`

**Files:**
- Modify: `src/pages/index.astro`（替换 Task 3 的占位）

- [ ] **Step 1: 重写 `src/pages/index.astro`**

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../layouts/BaseLayout.astro';
import PostCard from '../components/PostCard.astro';
import ProjectCard from '../components/ProjectCard.astro';
import { SITE } from '../config';

const posts = (await getCollection('blog', ({ data }) => !data.draft))
  .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
  .slice(0, 3);

const projects = (await getCollection('projects', ({ data }) => data.featured))
  .sort((a, b) => a.data.order - b.data.order);
---
<BaseLayout>
  <main class="mx-auto max-w-2xl px-4 py-12">
    <section>
      <h1 class="text-3xl font-bold tracking-tight">{SITE.title}</h1>
      <p class="mt-3 text-zinc-600 dark:text-zinc-400">{SITE.description}</p>
    </section>

    <section class="mt-12">
      <div class="flex items-baseline justify-between">
        <h2 class="text-lg font-semibold">最新文章</h2>
        <a href="/blog" class="text-sm text-zinc-500 hover:underline">全部 →</a>
      </div>
      <div class="mt-2 divide-y divide-zinc-100 dark:divide-zinc-800">
        {posts.map((post) => <PostCard post={post} />)}
      </div>
    </section>

    <section class="mt-12">
      <div class="flex items-baseline justify-between">
        <h2 class="text-lg font-semibold">精选项目</h2>
        <a href="/projects" class="text-sm text-zinc-500 hover:underline">全部 →</a>
      </div>
      <div class="mt-4 grid gap-4 sm:grid-cols-2">
        {projects.map((project) => <ProjectCard project={project} />)}
      </div>
    </section>
  </main>
</BaseLayout>
```

- [ ] **Step 2: 构建 + 预览验证**

Run: `npm run build`
Expected: 成功，`Test-Path dist/index.html` 为 `True`。

Run: `npm run dev`，打开首页确认：标题/简介、最新文章列出了 hello-world、精选项目列出了 Knosi。确认后停止。

- [ ] **Step 3: 提交**

```powershell
git add src/pages/index.astro
git commit -m "feat: 首页（简介 + 最新文章 + 精选项目）"
```

---

## Task 9: 文章列表 `/blog`

**Files:**
- Create: `src/pages/blog/index.astro`

- [ ] **Step 1: 写 `src/pages/blog/index.astro`**

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import PostCard from '../../components/PostCard.astro';

const posts = (await getCollection('blog', ({ data }) => !data.draft))
  .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
---
<BaseLayout title="Blog" description="全部文章">
  <main class="mx-auto max-w-2xl px-4 py-12">
    <h1 class="text-2xl font-bold tracking-tight">Blog</h1>
    <div class="mt-6 divide-y divide-zinc-100 dark:divide-zinc-800">
      {posts.map((post) => <PostCard post={post} />)}
    </div>
  </main>
</BaseLayout>
```

- [ ] **Step 2: 构建验证**

Run: `npm run build`
Expected: 成功，`Test-Path dist/blog/index.html` 为 `True`。

- [ ] **Step 3: 提交**

```powershell
git add src/pages/blog/index.astro
git commit -m "feat: 文章列表页"
```

---

## Task 10: TOC 组件 + PostLayout + 文章详情 `/blog/[...slug]`

**Files:**
- Create: `src/components/TOC.astro`
- Create: `src/layouts/PostLayout.astro`
- Create: `src/pages/blog/[...slug].astro`

- [ ] **Step 1: 写 `src/components/TOC.astro`**

```astro
---
import type { MarkdownHeading } from 'astro';
interface Props { headings: MarkdownHeading[] }
const { headings } = Astro.props;
// 只展示 h2/h3
const items = headings.filter((h) => h.depth === 2 || h.depth === 3);
---
{items.length > 0 && (
  <nav aria-label="目录" class="text-sm">
    <p class="mb-2 font-medium text-zinc-500">目录</p>
    <ul class="space-y-1">
      {items.map((h) => (
        <li class:list={[h.depth === 3 && 'pl-4']}>
          <a href={`#${h.slug}`} class="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100">{h.text}</a>
        </li>
      ))}
    </ul>
  </nav>
)}
```

- [ ] **Step 2: 写 `src/layouts/PostLayout.astro`**

```astro
---
import type { CollectionEntry } from 'astro:content';
import type { MarkdownHeading } from 'astro';
import BaseLayout from './BaseLayout.astro';
import TOC from '../components/TOC.astro';

interface Props {
  post: CollectionEntry<'blog'>;
  headings: MarkdownHeading[];
}
const { post, headings } = Astro.props;
const dateStr = post.data.date.toISOString().slice(0, 10);
---
<BaseLayout title={post.data.title} description={post.data.summary} article={true}>
  <main class="mx-auto max-w-2xl px-4 py-12">
    <header class="mb-8">
      <h1 class="text-3xl font-bold tracking-tight">{post.data.title}</h1>
      <time class="mt-2 block text-sm text-zinc-400" datetime={dateStr}>{dateStr}</time>
    </header>
    <TOC headings={headings} />
    <article class="prose prose-zinc mt-8 max-w-none dark:prose-invert">
      <slot />
    </article>
  </main>
</BaseLayout>
```

- [ ] **Step 3: 写 `src/pages/blog/[...slug].astro`**

```astro
---
import { getCollection, render } from 'astro:content';
import PostLayout from '../../layouts/PostLayout.astro';

export async function getStaticPaths() {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return posts.map((post) => ({
    params: { slug: post.id },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content, headings } = await render(post);
---
<PostLayout post={post} headings={headings}>
  <Content />
</PostLayout>
```

- [ ] **Step 4: 构建 + 预览验证**

Run: `npm run build`
Expected: 成功，`Test-Path dist/blog/hello-world/index.html` 为 `True`。

Run: `npm run dev`，打开 `http://localhost:4321/blog/hello-world`，确认：标题/日期、目录列出"二级标题"、正文 `prose` 排版正常、代码块有样式、深浅色正常。确认后停止。

- [ ] **Step 5: 提交**

```powershell
git add src/components/TOC.astro src/layouts/PostLayout.astro src/pages/blog/[...slug].astro
git commit -m "feat: 文章详情页（PostLayout + TOC + MDX 渲染）"
```

---

## Task 11: 项目列表 `/projects`

**Files:**
- Create: `src/pages/projects/index.astro`

- [ ] **Step 1: 写 `src/pages/projects/index.astro`**

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import ProjectCard from '../../components/ProjectCard.astro';

const projects = (await getCollection('projects'))
  .sort((a, b) => a.data.order - b.data.order);
---
<BaseLayout title="Projects" description="我做过的项目">
  <main class="mx-auto max-w-2xl px-4 py-12">
    <h1 class="text-2xl font-bold tracking-tight">Projects</h1>
    <div class="mt-6 grid gap-4 sm:grid-cols-2">
      {projects.map((project) => <ProjectCard project={project} />)}
    </div>
  </main>
</BaseLayout>
```

- [ ] **Step 2: 构建验证**

Run: `npm run build`
Expected: 成功，`Test-Path dist/projects/index.html` 为 `True`。

- [ ] **Step 3: 提交**

```powershell
git add src/pages/projects/index.astro
git commit -m "feat: 项目列表页"
```

---

## Task 12: About 页 `/about`

**Files:**
- Create: `src/pages/about.astro`

- [ ] **Step 1: 写 `src/pages/about.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout title="About" description="关于 zeusyao">
  <main class="mx-auto max-w-2xl px-4 py-12">
    <h1 class="text-2xl font-bold tracking-tight">About</h1>
    <div class="prose prose-zinc mt-6 max-w-none dark:prose-invert">
      <p>你好，我是 zeusyao，一名前端工程师，在新加坡，正在折腾 AI agent 和一点后端。</p>
      <p>这个站点用来记录写作、展示项目、留下学习痕迹。</p>
    </div>
  </main>
</BaseLayout>
```

- [ ] **Step 2: 构建验证**

Run: `npm run build`
Expected: 成功，`Test-Path dist/about/index.html` 为 `True`。

- [ ] **Step 3: 提交**

```powershell
git add src/pages/about.astro
git commit -m "feat: About 页"
```

---

## Task 13: RSS feed `/rss.xml`

**Files:**
- Create: `src/pages/rss.xml.js`

- [ ] **Step 1: 写 `src/pages/rss.xml.js`**

```js
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE } from '../config';

export async function GET(context) {
  const posts = (await getCollection('blog', ({ data }) => !data.draft))
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  return rss({
    title: SITE.title,
    description: SITE.description,
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.summary,
      pubDate: post.data.date,
      link: `/blog/${post.id}/`,
    })),
  });
}
```

- [ ] **Step 2: 构建验证**

Run: `npm run build`
Expected: 成功，`Test-Path dist/rss.xml` 为 `True`。

Run: `Get-Content dist/rss.xml -TotalCount 5`
Expected: 看到 `<?xml ...` 与 `<rss` 开头，包含 hello-world 条目。

- [ ] **Step 3: 提交**

```powershell
git add src/pages/rss.xml.js
git commit -m "feat: RSS feed"
```

---

## Task 14: 404 页

**Files:**
- Create: `src/pages/404.astro`

- [ ] **Step 1: 写 `src/pages/404.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout title="404">
  <main class="mx-auto max-w-2xl px-4 py-24 text-center">
    <h1 class="text-5xl font-bold">404</h1>
    <p class="mt-4 text-zinc-500 dark:text-zinc-400">页面不存在。</p>
    <a href="/" class="mt-6 inline-block text-blue-600 hover:underline dark:text-blue-400">← 回首页</a>
  </main>
</BaseLayout>
```

- [ ] **Step 2: 构建验证**

Run: `npm run build`
Expected: 成功，`Test-Path dist/404.html` 为 `True`。

- [ ] **Step 3: 提交**

```powershell
git add src/pages/404.astro
git commit -m "feat: 自定义 404 页"
```

---

## Task 15: GitHub Actions 部署到 Pages

**Files:**
- Create: `.github/workflows/deploy.yml`

- [ ] **Step 1: 写 `.github/workflows/deploy.yml`**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: withastro/action@v3

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: 提交**

```powershell
git add .github/workflows/deploy.yml
git commit -m "ci: GitHub Pages 自动部署"
```

- [ ] **Step 3: 创建 GitHub 仓库并推送（需人工确认）**

> ⚠️ 这是对外操作，执行前向用户确认。仓库名必须为 `zeusyao.github.io`。

```powershell
gh repo create zeusyao.github.io --public --source . --remote origin --push
```

- [ ] **Step 4: 在 GitHub 开启 Pages（人工，一次性）**

仓库 Settings → Pages → Build and deployment → Source 选 **GitHub Actions**。
然后等 Actions 跑完，访问 `https://zeusyao.github.io` 确认上线。

---

## Task 16: README

**Files:**
- Create: `README.md`

- [ ] **Step 1: 写 `README.md`**

内容如下（其中 `npm` 命令用普通三反引号的 ```bash 代码块包裹；本计划为避免嵌套围栏冲突改用缩进展示，实际文件请用标准代码块）：

> # zeusyao.github.io
>
> 个人博客，Astro + MDX + Tailwind v4，部署在 GitHub Pages。
>
> ## 开发
>
>     npm install
>     npm run dev      # http://localhost:4321
>     npm run build    # 产物在 dist/
>     npm run check    # 类型 + 内容 schema 校验
>
> ## 写文章
>
> 在 `src/content/blog/` 新增 `.mdx` 文件，frontmatter 见现有文章；`git push` 后自动部署。
>
> ## 加项目
>
> 在 `src/content/projects/` 新增 `.mdx`，`featured: true` 会出现在首页。

- [ ] **Step 2: 提交**

```powershell
git add README.md
git commit -m "docs: README"
```

---

## 验收

- `npm run build` 与 `npm run check` 均通过。
- `dist/` 下存在：`index.html`、`blog/index.html`、`blog/hello-world/index.html`、`projects/index.html`、`about/index.html`、`rss.xml`、`404.html`、`sitemap-index.xml`。
- 本地 `npm run dev` 下：导航/深浅色/文章排序/TOC/项目展示均正常。
- 推送后 GitHub Actions 部署成功，`https://zeusyao.github.io` 可访问。
