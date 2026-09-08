#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────
// OG 공유이미지 자동 생성 (public/og/home.png, 1200×630)
// site.config.ts의 SITE.name / tagline / description / url을 읽어
// 브랜드 톤의 OG 이미지를 만들어요. (sharp 필요 → npm install 후 실행)
//
//   node scripts/gen-og.mjs      또는      npm run og
// ─────────────────────────────────────────────────────────────
import sharp from "sharp";
import { readFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const cfg = readFileSync(resolve(root, "src/site.config.ts"), "utf8");

function pick(re, fallback) {
  const m = cfg.match(re);
  return (m && m[1]) ? m[1] : fallback;
}
const NAME = pick(/\/\*\* 사이트 이름[^\n]*\*\/\s*\n\s*name:\s*"([^"]*)"/, "사이트");
const TAGLINE = pick(/tagline:\s*"([^"]*)"/, "");
const DESC = pick(/description:\s*\n?\s*"([^"]*)"/, "");
const URL = pick(/\/\*\* 배포 도메인[^\n]*\*\/\s*\n\s*url:\s*"([^"]*)"/, "");
const HOST = URL.replace(/^https?:\/\//, "").replace(/\/+$/, "");

const esc = (s) => s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));

// 태그라인을 대략 16자 기준 2줄로 감싸기
function wrap(text, max = 16, maxLines = 2) {
  const words = text.split(/\s+/);
  const lines = [];
  let cur = "";
  for (const w of words) {
    if ((cur + " " + w).trim().length > max && cur) {
      lines.push(cur.trim());
      cur = w;
    } else {
      cur = (cur + " " + w).trim();
    }
    if (lines.length === maxLines - 1 && cur.length > max) break;
  }
  if (cur) lines.push(cur.trim());
  return lines.slice(0, maxLines);
}

const headLines = wrap(TAGLINE || NAME);
const headSvg = headLines
  .map((ln, i) => `<text x="90" y="${300 + i * 92}" font-family="Malgun Gothic, sans-serif" font-size="72" font-weight="800" fill="#1f2328" letter-spacing="-2">${esc(ln)}</text>`)
  .join("\n  ");

const FONT = "Malgun Gothic, 'Apple SD Gothic Neo', sans-serif";
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#e0f2fe"/>
  </linearGradient></defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect x="0" y="0" width="1200" height="12" fill="#0284c7"/>
  <rect x="90" y="86" width="72" height="72" rx="18" fill="#0284c7"/>
  <path d="M99 122 H115 L121 105 L131 139 L137 122 H153" fill="none" stroke="#ffffff" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
  <text x="178" y="140" font-family="${FONT}" font-size="42" font-weight="800" fill="#1f2328">${esc(NAME)}</text>
  ${headSvg}
  <text x="94" y="${300 + headLines.length * 92 + 10}" font-family="${FONT}" font-size="30" font-weight="500" fill="#57606a">${esc(DESC).slice(0, 46)}</text>
  <text x="94" y="556" font-family="${FONT}" font-size="26" font-weight="700" fill="#0284c7">${esc(HOST)}</text>
</svg>`;

mkdirSync(resolve(root, "public/og"), { recursive: true });
const info = await sharp(Buffer.from(svg), { density: 150 }).resize(1200, 630).png().toFile(resolve(root, "public/og/home.png"));
console.log(`  ✓ public/og/home.png (${info.width}x${info.height}, ${(info.size / 1024).toFixed(0)}KB) — ${NAME}`);

// 파비콘(favicon.svg) 기준으로 apple-touch-icon.png(180)·logo.png(512) 재생성
const iconSvg = readFileSync(resolve(root, "public/favicon.svg"));
await sharp(iconSvg, { density: 400 }).resize(180, 180).png().toFile(resolve(root, "public/apple-touch-icon.png"));
await sharp(iconSvg, { density: 400 }).resize(512, 512).png().toFile(resolve(root, "public/logo.png"));
console.log("  ✓ apple-touch-icon.png (180) · logo.png (512)");
