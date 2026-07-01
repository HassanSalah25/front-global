import ServiceDetailClient from "./ServiceDetailClient";
import { fetchServices } from "../../lib/api";

const STATIC_SLUGS = [
  "on-ground-egypt",
  "commercial",
  "documentary",
  "corporate",
  "events",
  "tv-broadcast",
  "podcast",
  "post-production",
  "motion-cgi",
  "dubbing",
  "photography",
  "marketing",
  "original-ip",
];

export async function generateStaticParams() {
  const collected = new Set<string>(STATIC_SLUGS);
  try {
    for (const locale of ["en", "ar"] as const) {
      const items = await fetchServices(locale);
      items.forEach((service) => {
        const slug = String(service.slug ?? service.id ?? "");
        if (slug) collected.add(slug);
      });
    }
  } catch {
    // Fall back to STATIC_SLUGS only.
  }
  return Array.from(collected).map((slug) => ({ slug }));
}

export default function ServiceDetailPage() {
  return <ServiceDetailClient />;
}
