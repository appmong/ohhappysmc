import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { CATEGORIES, AUTHORS, DISCLAIMERS } from "./site.config";

const categorySlugs = CATEGORIES.map((c) => c.slug) as [string, ...string[]];
const authorSlugs = Object.keys(AUTHORS) as [string, ...string[]];
const disclaimerKeys = Object.keys(DISCLAIMERS) as [string, ...string[]];

// [결론부터] 카드의 Q&A 한 쌍
const qa = z.object({
  q: z.string(),
  a: z.string(),
});

// [빠삭 검증 노트]의 원문 출처 한 건
const source = z.object({
  title: z.string(), // 예: 지방세기본법 제90조
  org: z.string(), // 예: 국가법령정보센터
  url: z.string().url(),
});

const posts = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/posts" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(categorySlugs),
    author: z.enum(authorSlugs).default(authorSlugs[0]),

    // 3중 날짜
    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    sourceCheckedDate: z.coerce.date().optional(), // 원문 확인일

    // 마감/상태 위젯
    status: z.enum(["상시", "진행중", "마감임박", "마감"]).default("상시"),
    deadline: z.coerce.date().optional(), // D-day 계산용

    readingMinutes: z.number().int().positive().optional(),

    // [결론부터] 카드
    tldr: z.array(qa).default([]),

    // [빠삭 검증 노트]
    sources: z.array(source).default([]),

    // 썸네일 slug (public/shots/<thumb>/ 에 thumb.webp 등)
    thumb: z.string().optional(),

    // 면책 문구 프리셋 키
    disclaimer: z.enum(disclaimerKeys).default("default"),

    // 태그 (관련 글 연결에 활용)
    tags: z.array(z.string()).default([]),

    // 초안 여부 (true면 빌드에서 제외)
    draft: z.boolean().default(false),
  }),
});

export const collections = { posts };
