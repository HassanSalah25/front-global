import type { Metadata } from "next";
import PortfolioDetailClient from "./PortfolioDetailClient";
import { getSeoData, buildMetadata } from "../../lib/seo";
import StructuredData from "../../components/StructuredData";
import { fetchPortfolio } from "../../lib/api";
import type { PortfolioItem } from "../../lib/api";
import { SUPPORTED_LOCALES } from "../../lib/i18n";

const FALLBACK = {
  title: "Portfolio | Untold Agency",
  description: "Explore our recent campaigns and creative work.",
};

// Slugs from the static fallback list so these always have a page even if the
// API is unreachable at build time.
const STATIC_SLUGS = [
  "al-nokhba-digital-marketing",
  "rikaz-real-estate-identity",
  "masar-app-launch-video",
  "gourmet-social-growth",
  "fashion-brand-google-campaign",
  "myhealth-influencer-campaign",
];

// Pre-render a static page for every portfolio slug known at build time.
// New projects added to the backend after a build won't have a static page
// until the site is rebuilt and redeployed.
export async function generateStaticParams() {
  const collected = new Set<string>(STATIC_SLUGS);
  try {
    for (const locale of SUPPORTED_LOCALES) {
      const raw = await fetchPortfolio(locale);
      const list = Array.isArray(raw)
        ? raw
        : ((raw?.data ?? raw?.items ?? []) as PortfolioItem[]);
      list.forEach((p) => {
        const slug = p?.slug ?? (p?.id != null ? String(p.id) : "");
        if (slug) collected.add(slug);
      });
    }
  } catch {
    // Fall back to STATIC_SLUGS only.
  }
  return Array.from(collected).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const seo = await getSeoData("portfolio", slug);
  return buildMetadata(seo, `/portfolio/${slug}`, FALLBACK);
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const seo = await getSeoData("portfolio", slug);

  return (
    <>
      <StructuredData data={seo?.structuredData} />
      <PortfolioDetailClient />
    </>
  );
}
