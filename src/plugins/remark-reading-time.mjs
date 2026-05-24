import getReadingTime from 'reading-time';
import { toString } from 'mdast-util-to-string';

// 估算阅读时长，写入 frontmatter.minutesRead（可在 render() 的 remarkPluginFrontmatter 拿到）
export function remarkReadingTime() {
  return function (tree, { data }) {
    const text = toString(tree);
    const stats = getReadingTime(text); // 对英文按词计；中文偏少
    const cjkChars = (text.match(/[一-鿿]/g) || []).length;
    const minutesFromCjk = cjkChars / 400; // 中文约 400 字/分钟
    const minutes = Math.max(stats.minutes, minutesFromCjk);
    data.astro.frontmatter.minutesRead = Math.max(1, Math.round(minutes));
  };
}
