export const SITE = {
  title: 'zeusyao',
  /** 首页/导航下方的一句话定位 */
  role: 'Programmer · Singapore',
  description: '新加坡的程序员。这里记录写作、项目与学习。',
  author: 'zeusyao',
  url: 'https://zhousiyao03-cyber.github.io',
  lang: 'zh-CN',
  githubUser: 'zhousiyao03-cyber',
} as const;

export const NAV: { label: string; href: string }[] = [
  { label: 'Home', href: '/' },
  { label: 'Blog', href: '/blog' },
  { label: 'Projects', href: '/projects' },
  { label: 'About', href: '/about' },
];

export const SOCIAL: { label: string; href: string }[] = [
  { label: 'GitHub', href: 'https://github.com/zhousiyao03-cyber' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/siyao-zhou-759b12159/' },
  { label: 'X', href: 'https://x.com/zeusyaoyao' },
  { label: 'RSS', href: '/rss.xml' },
];
