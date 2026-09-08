import type { APIContext } from "astro";
import { ADSENSE } from "../site.config";

// 애드센스 승인 후 site.config.ts의 ADSENSE.clientId(ca-pub-XXXX)를 채우면
// /ads.txt 가 올바른 라인을 자동으로 내보냅니다.
export async function GET(_context: APIContext) {
  const pub = ADSENSE.clientId.replace(/^ca-/, ""); // pub-XXXXXXXXXXXXXXXX
  const body = pub
    ? `google.com, ${pub}, DIRECT, f08c47fec0942fa0\n`
    : `# 애드센스 승인 후 site.config.ts의 ADSENSE.clientId를 입력하면 이 파일이 자동 생성됩니다.\n`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
