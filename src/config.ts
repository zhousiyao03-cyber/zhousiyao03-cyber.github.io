export const SITE = {
  title: 'zeusyao',
  /** 首页/导航下方的一句话定位 */
  role: 'Programmer · Singapore',
  description: '新加坡的程序员。这里记录写作、项目与学习。',
  author: 'zeusyao',
  url: 'https://zeusyao.github.io',
  lang: 'zh-CN',
  githubUser: 'zeusyao',
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
