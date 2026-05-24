# 交接备忘 — zeusyao.github.io（2026-05-24）

> 给下一个 session：这是个人博客项目，Astro 5 + MDX + Tailwind v4 纯静态站，部署 GitHub Pages。
> 完整设计见 `docs/superpowers/specs/2026-05-24-personal-blog-design.md`，实现计划见 `docs/superpowers/plans/2026-05-24-personal-blog.md`，日常用法见 `README.md`。

## 当前状态

- 分支 `main`，工作区干净。`npm run build` / `npm run check` 均通过，0 死链。
- **已部署上线**：<https://zhousiyao03-cyber.github.io>（2026-05-24）。
  - GitHub 账号是 **`zhousiyao03-cyber`**（不是 zeusyao），仓库 `zhousiyao03-cyber/zhousiyao03-cyber.github.io`，域名随之改。
  - Pages 用 GitHub Actions 构建（`build_type=workflow`，已通过 `gh api` 设好），workflow 是 `.github/workflows/deploy.yml`，push main 自动部署。
  - 注意：仓库 Actions 里那条 `pages-build-deployment`(默认 Jekyll 流程) 会 failure，无害，真正生效的是 `deploy.yml`。
- 站点结构：首页 / Blog（列表+详情+标签页）/ Projects / About / 404 / RSS / sitemap。
- 已有功能：深浅色（无闪烁）、文章目录、阅读时长、上下篇导航、代码块双主题、SEO/OG、skip link 等无障碍。
- **展示用 title/author 仍叫 `zeusyao`**（笔名，对外展示，与 GitHub 用户名无关，刻意保留）。

## 重要约定（别违反）

1. **自我介绍口径**：对外只说「**新加坡的程序员**」。**不要**写"前端工程师"，**不要**提"折腾 AI agent"。首页 role 是 `Programmer · Singapore`，简介是「新加坡的程序员。这里记录写作、项目与学习。」
2. **项目只列原创**：`wanman`（fork）和 `web-bro`（在 aeroxy 名下）已排除，别加回来。`Noesis` 是 nanoGPT 的 fork，措辞保持"基于 nanoGPT"，不冒充原创。
3. **v1 不做 AI、不做后端**。「跟博客对话」AI 留到 v2，接口部署在用户自有的 knosi 服务器（`ssh knosi`）。

## 已完成的 open items（2026-05-24 收尾）

1. ~~RepoLayer / Meeting Assistant 描述~~ → 已据各仓库 README 补全。Meeting Assistant 正名为 **Meeting Copilot**（仓库真实名）。RepoLayer 按约定标注「基于 aeroxy/ast-outline 扩展」，不冒充原创。
2. ~~社交链接~~ → `config.ts` 的 `SOCIAL` 已加 LinkedIn(`siyao-zhou-759b12159`)、X(`zeusyaoyao`)。GitHub 链接指向 `zhousiyao03-cyber`。
3. ~~GitHub 用户名~~ → 确认是 **`zhousiyao03-cyber`**，全站 url/githubUser/astro site/robots.txt 已统一切换。
4. ~~部署~~ → 已建仓推送并上线（见「当前状态」）。
5. 顺手新增项目 **minisearch-rs**（非精选，order 7）：Rust 从零写的 BM25 全文搜索引擎，有 live demo。

## 当前没有待办的 open items

下一步可选方向见下方 Roadmap。

## 项目展示当前编排

- 首页精选（order）：Knosi(1) → RepoLayer(2) → SGLifeSim(3)
- Projects 页另含（非精选）：Noesis(4)、Focus Tracker(5)、Meeting Copilot(6)、minisearch-rs(7)

## Roadmap / 想法

- **v1.1**：每篇文章自动生成 OG 社交分享图（试过 astro-og-canvas，但中文标题需 ~10MB 中文字体，太重，撤掉了；之后用字体子集做）。
- **想法**：在站上展示个人 token 消耗量（类似 ursb.me 的 Claude 用量展示）——需要数据源（用户的 Claude 用量 / Knosi）。属 v2。
- **v2**：「跟博客对话」AI（轻量 RAG + Claude API，prompt caching），接口挂 knosi。

## 杂项

- 本地预览：`npm run dev` → http://localhost:4321（上个 session 起过一个后台实例，可能已随 shell 结束，重跑即可）。
- 主题色改 `src/styles/global.css` 的 `--color-accent` / `--color-accent-soft`。
- 站点信息/导航/社交在 `src/config.ts`。
