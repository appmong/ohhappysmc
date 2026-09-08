// _thumb_ohhappysmc/1~15.JPEG → public/shots/<slug>/thumb-wide.webp (1280x720, 16:9 cover)
import sharp from "sharp";
import { readFileSync, mkdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const SRC = resolve(root, "..", "_thumb_ohhappysmc");

// 번호 → (썸네일 슬러그, 포스트 파일명)
const MAP = [
  [1, "checkup-target", "국가건강검진-대상-주기"],
  [2, "cancer-screening", "국가암검진-6종-정리"],
  [3, "fasting-prep", "건강검진-금식-준비"],
  [4, "result-reading", "건강검진-결과지-보는법"],
  [5, "booking", "검진기관-예약-직장지역"],
  [6, "copay-cap", "본인부담상한제-환급"],
  [7, "refund", "건강보험-환급금-조회"],
  [8, "insurance-claim", "실손보험-청구방법"],
  [9, "disaster-medcost", "재난적의료비-지원"],
  [10, "itemized-bill", "진료비-세부내역서-비급여"],
  [11, "neck", "거북목-목통증-예방"],
  [12, "back", "오래앉을때-허리건강"],
  [13, "eye", "눈피로-안구건조-줄이기"],
  [14, "water", "수분섭취-물마시는법"],
  [15, "sleep", "수면위생-잘자는법"],
];

const exts = ["JPEG", "jpeg", "jpg", "JPG", "png", "PNG"];
let ok = 0;
for (const [num, slug] of MAP) {
  let srcFile = null;
  for (const e of exts) {
    const p = resolve(SRC, `${num}.${e}`);
    if (existsSync(p)) { srcFile = p; break; }
  }
  if (!srcFile) { console.log(`  ✗ ${num} 원본 없음`); continue; }
  const outDir = resolve(root, "public/shots", slug);
  mkdirSync(outDir, { recursive: true });
  const info = await sharp(readFileSync(srcFile))
    .resize(1280, 720, { fit: "cover", position: "attention" })
    .webp({ quality: 82 })
    .toFile(resolve(outDir, "thumb-wide.webp"));
  console.log(`  ✓ ${num} → shots/${slug}/thumb-wide.webp (${(info.size / 1024).toFixed(0)}KB)`);
  ok++;
}
console.log(`\n완료: ${ok}/${MAP.length}`);
