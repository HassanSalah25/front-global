import type { MetadataRoute } from "next";
import { fetchBlog, fetchPortfolio } from "./lib/api";
import { SITE_URL } from "./lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1.0 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/services`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/portfolio`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/blog`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/contact`, changeFrequency: "monthly", priority: 0.6 },
  ];

  let portfolioRoutes: MetadataRoute.Sitemap = [];
  try {
    const result = await fetchPortfolio("en");
    const items = Array.isArray(result) ? result : result.data ?? result.items ?? [];
    portfolioRoutes = items
      .filter((item) => item.slug)
      .map((item) => ({
        url: `${SITE_URL}/portfolio/${item.slug}`,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      }));
  } catch {
    // Backend unreachable at build time — ship static routes only.
  }

  const blogRoutes: MetadataRoute.Sitemap = [];
  try {
    // Walk every page so a growing blog doesn't silently drop out of the sitemap.
    for (let page = 1; page <= 50; page++) {
      const payload = await fetchBlog("en", page);
      const posts = payload.data ?? payload.posts ?? [];
      if (posts.length === 0) break;

      for (const post of posts) {
        if (post.slug) {
          blogRoutes.push({
            url: `${SITE_URL}/blog/${post.slug}`,
            changeFrequency: "weekly",
            priority: 0.6,
          });
        }
      }
    }
  } catch {
    // Backend unreachable at build time — ship static/portfolio routes only.
  }

  return [...staticRoutes, ...portfolioRoutes, ...blogRoutes];
}
