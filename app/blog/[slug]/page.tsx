import type { Metadata } from "next";
import BlogPostClient from "./BlogPostClient";
import { getSeoData, buildMetadata } from "../../lib/seo";
import StructuredData from "../../components/StructuredData";
import { fetchBlog } from "../../lib/api";
import type { BlogPost } from "../../lib/api";
import { SUPPORTED_LOCALES } from "../../lib/i18n";

const FALLBACK = {
  title: "Blog | Untold Agency",
  description: "Insights, case studies, and news from our team.",
};

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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const seo = await getSeoData("blog", slug);
  return buildMetadata(seo, `/blog/${slug}`, FALLBACK);
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const seo = await getSeoData("blog", slug);

  return (
    <>
      <StructuredData data={seo?.structuredData} />
      <BlogPostClient />
    </>
  );
}
