// 날짜/시간/URL 공용 헬퍼

const KST = "ko-KR";

/** 2026. 8. 7. 형태 */
export function fmtDate(d: Date | undefined): string {
  if (!d) return "";
  return new Intl.DateTimeFormat(KST, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d);
}

/** ISO (datetime 속성용) */
export function isoDate(d: Date | undefined): string {
  return d ? d.toISOString() : "";
}

/** 오늘 기준 D-day. 지났으면 null */
export function daysUntil(deadline: Date | undefined): number | null {
  if (!deadline) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const end = new Date(deadline);
  end.setHours(0, 0, 0, 0);
  const diff = Math.round((end.getTime() - today.getTime()) / 86_400_000);
  return diff;
}

/** 본문에서 대략적인 읽기 시간(분) 추정 — 한글 기준 분당 500자 */
export function estimateMinutes(body: string | undefined): number {
  if (!body) return 1;
  const chars = body.replace(/\s+/g, "").length;
  return Math.max(1, Math.round(chars / 500));
}

/** 카테고리 슬러그 + 글 id → URL (trailingSlash: always) */
export function postUrl(category: string, id: string): string {
  return `/${category}/${id}/`;
}

export function categoryUrl(category: string): string {
  return `/${category}/`;
}

/** 마크다운 본문에서 H2 목차 추출 */
export function extractToc(body: string | undefined): { text: string; slug: string }[] {
  if (!body) return [];
  const lines = body.split("\n");
  const toc: { text: string; slug: string }[] = [];
  let inCode = false;
  for (const line of lines) {
    if (line.trim().startsWith("```")) inCode = !inCode;
    if (inCode) continue;
    const m = /^##\s+(.+?)\s*$/.exec(line);
    if (m) {
      const text = m[1].replace(/[#*`]/g, "").trim();
      toc.push({ text, slug: slugifyHeading(text) });
    }
  }
  return toc;
}

/** Astro 기본 rehype-slug와 동일한 규칙에 최대한 근접한 헤딩 슬러그 */
export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w가-힣\s-]/g, "")
    .replace(/\s+/g, "-");
}
