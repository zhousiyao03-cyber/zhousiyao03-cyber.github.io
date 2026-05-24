# 交接备忘 — zeusyao.github.io（2026-05-24）

> 给下一个 session：这是个人博客项目，Astro 5 + MDX + Tailwind v4 纯静态站，部署 GitHub Pages。
> 完整设计见 `docs/superpowers/specs/2026-05-24-personal-blog-design.md`，实现计划见 `docs/superpowers/plans/2026-05-24-personal-blog.md`，日常用法见 `README.md`。

## 当前状态

- 分支 `main`，工作区干净，全部已提交。`npm run build` / `npm run check` 均通过，0 死链。
- **尚未推到 GitHub**（本地仓库）。
- 站点结构：首页 / Blog（列表+详情+标签页）/ Projects / About / 404 / RSS / sitemap。
- 已有功能：深浅色（无闪烁）、文章目录、阅读时长、上下篇导航、代码块双主题、SEO/OG、skip link 等无障碍。

## 重要约定（别违反）

1. **自我介绍口径**：对外只说「**新加坡的程序员**」。**不要**写"前端工程师"，**不要**提"折腾 AI agent"。首页 role 是 `Programmer · Singapore`，简介是「新加坡的程序员。这里记录写作、项目与学习。」
2. **项目只列原创**：`wanman`（fork）和 `web-bro`（在 aeroxy 名下）已排除，别加回来。`Noesis` 是 nanoGPT 的 fork，措辞保持"基于 nanoGPT"，不冒充原创。
3. **v1 不做 AI、不做后端**。「跟博客对话」AI 留到 v2，接口部署在用户自有的 knosi 服务器（`ssh knosi`）。

## 待用户补充 / 决定（open items）

1. **RepoLayer、Meeting Assistant 的描述**：现在是占位「（一句话描述待补充）」、空 stack。文件在 `src/content/projects/repolayer.mdx`、`meeting-assistant.mdx`。需要用户给：一句话 + 技术栈 + 链接。
2. **社交链接**：用户想加 LinkedIn 等。改 `src/config.ts` 的 `SOCIAL`（页脚 + 首页 hero 会显示）。需要真实 URL。
3. **GitHub 用户名存疑**：现填 `github.com/zeusyao`，但 focus-tracker 的 release 在 `zhousiyao03-cyber` 名下。需用户确认；GitHub Pages 域名 `zeusyao.github.io` 要求账号叫 `zeusyao`。
4. **部署**（要用户的 GitHub 账号）：
   - `gh repo create zeusyao.github.io --public --source . --remote origin --push`
   - GitHub 仓库 Settings → Pages → Source 选「GitHub Actions」。

## 项目展示当前编排

- 首页精选（order）：Knosi(1) → RepoLayer(2) → SGLifeSim(3)
- Projects 页另含（非精选）：Noesis(4)、Focus Tracker(5)、Meeting Assistant(6)

## Roadmap / 想法

- **v1.1**：每篇文章自动生成 OG 社交分享图（试过 astro-og-canvas，但中文标题需 ~10MB 中文字体，太重，撤掉了；之后用字体子集做）。
- **想法**：在站上展示个人 token 消耗量（类似 ursb.me 的 Claude 用量展示）——需要数据源（用户的 Claude 用量 / Knosi）。属 v2。
- **v2**：「跟博客对话」AI（轻量 RAG + Claude API，prompt caching），接口挂 knosi。

## 杂项

- 本地预览：`npm run dev` → http://localhost:4321（上个 session 起过一个后台实例，可能已随 shell 结束，重跑即可）。
- 主题色改 `src/styles/global.css` 的 `--color-accent` / `--color-accent-soft`。
- 站点信息/导航/社交在 `src/config.ts`。
