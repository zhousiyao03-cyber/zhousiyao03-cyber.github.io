#!/usr/bin/env node
/**
 * 生成 Vibe Coding 用量数据（供首页 VibeCoding 组件读取）。
 *
 * 数据来自 ccusage：读取本机 Claude Code / Codex 等 CLI 的本地用量日志，
 * 聚合成每日 { cost, tokens, models } + 总计，写入 src/data/vibe-coding.json。
 *
 * 用法：
 *   node scripts/gen-vibe-coding.mjs        # 跑 ccusage 取真实数据
 *   node scripts/gen-vibe-coding.mjs --dry  # 只打印聚合结果，不写文件
 *
 * 更新流程：本机重跑此脚本 → git commit src/data/vibe-coding.json → push。
 * 数据是构建期注入，线上零运行时请求、不暴露任何本地路径。
 */
import { execFileSync } from 'node:child_process';
import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, '../src/data/vibe-coding.json');

/** 模型名 → 展示名 + 色点。未知模型回退到灰色。 */
const MODEL_STYLE = [
  [/opus-4-7/i, { name: 'Opus 4.7', color: '#818cf8' }],
  [/opus-4-6/i, { name: 'Opus 4.6', color: '#4ade80' }],
  [/sonnet-4-6/i, { name: 'Sonnet 4.6', color: '#f472b6' }],
  [/haiku-4-5/i, { name: 'Haiku 4.5', color: '#38bdf8' }],
  [/gpt-5\.5/i, { name: 'GPT-5.5', color: '#10b981' }],
  [/gpt-5.*codex/i, { name: 'GPT-5 Codex', color: '#0ea5e9' }],
  [/gpt-5/i, { name: 'GPT-5', color: '#22d3ee' }],
  [/gemini-3.*flash/i, { name: 'Gemini 3 Flash', color: '#fbbf24' }],
  [/gemini-3.*pro/i, { name: 'Gemini 3 Pro', color: '#facc15' }],
  [/gemini/i, { name: 'Gemini', color: '#eab308' }],
];

function styleFor(model) {
  for (const [re, s] of MODEL_STYLE) if (re.test(model)) return s;
  return { name: model, color: '#7d8590' };
}

function runCcusage() {
  // npx -y 确保 CI/他机也能拉到 ccusage；--json 输出结构化数据
  const out = execFileSync('npx', ['-y', 'ccusage@latest', 'daily', '--json'], {
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
    shell: process.platform === 'win32', // Windows 上 npx 是 .cmd，需经 shell
  });
  return JSON.parse(out).daily;
}

function aggregate(daily) {
  const byDay = {};
  const modelSet = new Set();
  let totalTokens = 0;
  let totalCost = 0;

  for (const d of daily) {
    byDay[d.period] = {
      cost: round2(d.totalCost),
      tokens: d.totalTokens,
      models: d.modelsUsed,
    };
    totalTokens += d.totalTokens;
    totalCost += d.totalCost;
    for (const m of d.modelsUsed) modelSet.add(m);
  }

  const days = Object.keys(byDay).sort();
  const spanDays =
    days.length > 1
      ? Math.max(1, (new Date(days.at(-1)) - new Date(days[0])) / 86400000 + 1)
      : 1;
  const numWeeks = Math.max(1, spanDays / 7);

  // 模型图例：按总花费里出现的模型去重，保留固定展示顺序
  const models = [...modelSet]
    .map(styleFor)
    .filter((m, i, a) => a.findIndex((x) => x.name === m.name) === i)
    .sort(
      (a, b) =>
        MODEL_STYLE.findIndex(([, s]) => s.name === a.name) -
        MODEL_STYLE.findIndex(([, s]) => s.name === b.name),
    );

  return {
    daily: byDay,
    totalTokens,
    totalCost: round2(totalCost),
    avgWeekCost: round2(totalCost / numWeeks),
    numDays: days.length,
    models,
    updatedAt: new Date().toISOString().slice(0, 10),
  };
}

const round2 = (n) => Math.round(n * 100) / 100;

function main() {
  const dry = process.argv.includes('--dry');
  let daily;
  try {
    daily = runCcusage();
  } catch (e) {
    console.error('✖ 运行 ccusage 失败：', e.message);
    console.error('  确认本机装过 Claude Code/Codex 且有用量日志，或先跑 `npx ccusage daily`。');
    process.exit(1);
  }

  const data = aggregate(daily);
  console.log(
    `✓ 聚合完成：${data.numDays} 天，${(data.totalTokens / 1e9).toFixed(2)}B tokens，$${data.totalCost}，模型 ${data.models.map((m) => m.name).join('/')}`,
  );

  if (dry) {
    console.log(JSON.stringify(data, null, 2));
    return;
  }
  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, JSON.stringify(data, null, 2) + '\n');
  console.log(`✓ 已写入 ${OUT}`);
}

main();
