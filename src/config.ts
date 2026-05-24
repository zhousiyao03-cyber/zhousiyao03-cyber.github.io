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
