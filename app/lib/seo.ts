import type { Metadata } from "next";
import { fetchSeo, type SeoData, type SeoType } from "./api";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://globaluntoldstory.com"
).replace(/\/$/, "");

export async function getSeoData(type: SeoType, slug: string): Promise<SeoData | null> {
  try {
    return await fetchSeo(type, slug, "en");
  } catch {
    return null;
  }
}

function robotsDirective(robots?: string | null) {
  switch (robots) {
    case "noindex-nofollow":
      return { index: false, follow: false };
    case "noindex-follow":
      return { index: false, follow: true };
    case "index-nofollow":
      return { index: true, follow: false };
    default:
      return { index: true, follow: true };
  }
}

export function buildMetadata(
  seo: SeoData | null,
  path: string,
  fallback: { title: string; description: string }
): Metadata {
  const url = seo?.canonicalUrl || `${SITE_URL}${path}`;
  const title = seo?.metaTitle || fallback.title;
  const description = seo?.metaDescription || fallback.description;

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: robotsDirective(seo?.robots),
    openGraph: {
      title: seo?.ogTitle || title,
      description: seo?.ogDescription || description,
      url,
      images: seo?.ogImageUrl ? [seo.ogImageUrl] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: seo?.twitterTitle || seo?.ogTitle || title,
      description: seo?.twitterDescription || seo?.ogDescription || description,
      images: seo?.twitterImageUrl ? [seo.twitterImageUrl] : undefined,
    },
  };
}
