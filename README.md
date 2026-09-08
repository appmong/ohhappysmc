# 애드센스 승인용 콘텐츠 사이트 (Astro)

ppasak.net 구조를 벤치마킹한 정적 사이트. 신뢰 장치(저자 박스·3중 날짜·검증 노트·면책)를 컴포넌트로 내장했습니다.

## 실행

```bash
npm --prefix site run dev      # 개발 서버 (localhost:4321)
npm --prefix site run build    # 프로덕션 빌드 → site/dist
npm --prefix site run preview  # 빌드 결과 미리보기
```

> Node가 PATH에 안 잡히면: `C:\Program Files\nodejs\` 를 PATH에 추가하거나 새 터미널을 여세요.

## 브랜드/설정 바꾸기 — `src/site.config.ts` 한 곳

| 항목 | 위치 |
| --- | --- |
| 사이트 이름·도메인·이메일·슬로건 | `SITE` |
| 검색엔진 인증(구글/네이버) | `VERIFICATION` |
| 애드센스 pub-ID | `ADSENSE.clientId` |
| 저자(필명) | `AUTHORS` |
| 카테고리(니치) | `CATEGORIES` |
| 면책 문구 프리셋 | `DISCLAIMERS` |
| 편집 원칙(about) | `EDITORIAL_PRINCIPLES` |

도메인 확정 시 `astro.config.mjs`의 `SITE_URL`과 `public/robots.txt`의 도메인도 함께 교체하세요.

## 글 추가하기

`src/content/posts/한글-슬러그.md` 파일을 만들면 URL은 `/{category}/{파일명}/`.
frontmatter 스키마는 `src/content.config.ts` 참고. 예시는 `재산세-이의신청-기한.md`.

핵심 필드:
- `category` — `CATEGORIES`의 slug 중 하나
- `publishDate` / `updatedDate` / `sourceCheckedDate` — 3중 날짜
- `tldr` — [결론부터] Q&A 배열
- `sources` — [검증 노트] 원문 링크 (직접 확인 후 손으로 채우기)
- `status` / `deadline` — 마감 위젯
- `disclaimer` — 면책 프리셋 키
- `draft: true` — 빌드에서 제외

썸네일: `public/shots/<thumb>/thumb-wide.webp` (1200×675 권장), OG: `public/og/<thumb>.png`.

## 컴포넌트 (신뢰 장치)

`TldrCard` · `MetaLine` · `Toc` · `VerifyNote` · `AuthorBox` · `StatusBadge` · `DeadlineWidget` · `RelatedPosts` · `Breadcrumb` · `PostCard`

## 애드센스 승인 체크리스트

- [x] 필수 페이지: `/about` `/contact` `/privacy` `/terms`
- [x] 개인정보처리방침에 쿠키·Google 애드센스·DoubleClick 고지
- [x] sitemap / RSS / robots.txt
- [x] `/ads.txt` (승인 후 `ADSENSE.clientId` 입력 시 자동 생성)
- [ ] 도메인 구매 후 `site.config.ts`·`astro.config.mjs` 도메인 교체
- [ ] Search Console·네이버 웹마스터 인증값 입력
- [ ] 검수한 글 20~30편 발행
- [ ] 애드센스 신청 (지급 프로필 먼저 채우기)

## 배포 (다음 단계)

Cloudflare Workers 정적 자산 호스팅 + GitHub Actions(`astro build` → `wrangler deploy`).
