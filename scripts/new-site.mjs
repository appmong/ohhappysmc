#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────
// 새 사이트 찍어내기 스크립트
// 사이트 이름·도메인·이메일을 받아서 설정 파일 3곳을 한 번에 패치해요.
//
// 사용법:
//   node scripts/new-site.mjs --name "사이트이름" --url "https://example.com" --email "hello@example.com"
//   node scripts/new-site.mjs -n "빠삭정보" -u "ppasak.net"
//
// (도메인은 http(s):// 없이 넣어도 자동으로 https://를 붙여요)
// ─────────────────────────────────────────────────────────────
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

// --- 인자 파싱 ---
const args = process.argv.slice(2);
function arg(long, short) {
  const i = args.findIndex((a) => a === long || a === short);
  return i >= 0 ? args[i + 1] : undefined;
}
let name = arg("--name", "-n");
let url = arg("--url", "-u");
let email = arg("--email", "-e");

if (!name || !url) {
  console.error(`
사용법:
  node scripts/new-site.mjs --name "사이트이름" --url "example.com" [--email "hello@example.com"]

필수: --name, --url
`);
  process.exit(1);
}

// 도메인 정규화
url = url.trim().replace(/\/+$/, "");
if (!/^https?:\/\//.test(url)) url = "https://" + url;
const host = url.replace(/^https?:\/\//, "");
if (!email) email = `hello@${host}`;

// --- 파일별 치환 ---
function patch(file, replacers) {
  const path = resolve(root, file);
  let src = readFileSync(path, "utf8");
  let changed = 0;
  for (const [re, to] of replacers) {
    const next = src.replace(re, to);
    if (next !== src) changed++;
    src = next;
  }
  writeFileSync(path, src, "utf8");
  console.log(`  ✓ ${file} (${changed}곳 수정)`);
}

console.log(`\n새 사이트 설정 적용:`);
console.log(`  이름:   ${name}`);
console.log(`  도메인: ${url}`);
console.log(`  이메일: ${email}\n`);

// 1) src/site.config.ts — SITE 블록의 url / name / email
//    (주석을 앵커로 삼아 다른 name:/email: 와 충돌하지 않게 정확히 겨냥)
patch("src/site.config.ts", [
  [/(\/\*\* 배포 도메인[^\n]*\*\/\s*\n\s*url:\s*)"[^"]*"/, `$1"${url}"`],
  [/(\/\*\* 사이트 이름[^\n]*\*\/\s*\n\s*name:\s*)"[^"]*"/, `$1"${name}"`],
  [/(\/\*\* 대표 이메일[^\n]*\*\/\s*\n\s*email:\s*)"[^"]*"/, `$1"${email}"`],
]);

// 2) astro.config.mjs — SITE_URL 상수
patch("astro.config.mjs", [
  [/(const SITE_URL = )"[^"]*"/, `$1"${url}"`],
]);

// 3) public/robots.txt — Sitemap 도메인
patch("public/robots.txt", [
  [/https?:\/\/[^\/\s]+(\/sitemap-index\.xml)/, `${url}$1`],
]);

console.log(`\n완료! 다음 단계:`);
console.log(`  1) npm install`);
console.log(`  2) 검색엔진 인증값(VERIFICATION)·애드센스 ID(ADSENSE)는 승인 후 site.config.ts에 입력`);
console.log(`  3) npm run dev  또는  npm run build\n`);
