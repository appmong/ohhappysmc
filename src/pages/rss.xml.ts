import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { APIContext } from "astro";
import { SITE } from "../site.config";
import { postUrl } from "../lib/utils";

export async function GET(context: APIContext) {
  const posts = (await getCollection("posts"))
    .filter((p) => !p.data.draft)
    .sort((a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime());

  return rss({
    title: SITE.name,
    description: SITE.description,
    site: context.site ?? SITE.url,
    items: posts.map((p) => ({
      title: p.data.title,
      description: p.data.description,
      pubDate: p.data.publishDate,
      link: postUrl(p.data.category, p.id),
      categories: [p.data.category, ...p.data.tags],
    })),
    customData: `<language>ko-kr</language>`,
  });
}
