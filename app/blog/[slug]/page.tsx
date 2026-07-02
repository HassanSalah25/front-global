import BlogPostClient from "./BlogPostClient";
import { fetchBlog } from "../../lib/api";
import type { BlogPost } from "../../lib/api";
import { SUPPORTED_LOCALES } from "../../lib/i18n";

// Pre-render a static page for every blog slug known at build time.
// New posts added to the backend after a build won't have a static page
// until the site is rebuilt and redeployed.
export async function generateStaticParams() {
  try {
    const collected = new Set<string>();
    for (const locale of SUPPORTED_LOCALES) {
      const payload = await fetchBlog(locale);
      const lists = [
        payload?.data,
        payload?.posts,
        payload?.items,
        payload?.featured ? [payload.featured] : [],
      ];
      for (const list of lists) {
        (list as BlogPost[] | undefined)?.forEach((p) => {
          const slug = p?.slug ?? (p?.id != null ? String(p.id) : "");
          if (slug) collected.add(slug);
        });
      }
    }
    return Array.from(collected).map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export default function BlogPostPage() {
  return <BlogPostClient />;
}
