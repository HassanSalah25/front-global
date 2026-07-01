const MEDIA_BASE =
  "https://globaluntoldstory.com/api/public/storage/media/frontend/services";

export const SERVICE_IMAGES: Record<string, string> = {
  "on-ground-egypt":
    "https://globaluntoldstory.com/api/public/storage/media/2026/07/1782898547_on-ground-production-services-egypt.webp.webp",
  commercial: `${MEDIA_BASE}/commercial-advertising-production-egypt.webp`,
  documentary: `${MEDIA_BASE}/documentary-production-egypt.webp`,
  corporate: `${MEDIA_BASE}/corporate-industrial-content-production.webp`,
  events: `${MEDIA_BASE}/event-coverage-live-production.webp`,
  "tv-broadcast": `${MEDIA_BASE}/tv-shows-live-broadcast-production.png`,
  podcast: `${MEDIA_BASE}/podcast-production-services.webp`,
  "post-production": `${MEDIA_BASE}/post-production-finishing-services.webp`,
  "motion-cgi": `${MEDIA_BASE}/motion-cgi-ai-powered-visuals.webp`,
  dubbing: `${MEDIA_BASE}/voice-over-localization-services.png`,
  photography: `${MEDIA_BASE}/professional-photography-services.webp`,
  marketing: `${MEDIA_BASE}/marketing-solutions-performance.webp`,
  "original-ip": `${MEDIA_BASE}/original-ip-development-creative-concepts.webp`,
};

export function getServiceImageUrl(
  id: string,
  apiUrl?: string | null
): string | undefined {
  const trimmed = apiUrl?.trim();
  if (trimmed) return trimmed;
  return SERVICE_IMAGES[id];
}

export function withServiceImages<T extends { id: string; imageUrl?: string }>(
  services: T[]
): T[] {
  return services.map((service) => ({
    ...service,
    imageUrl: getServiceImageUrl(service.id, service.imageUrl),
  }));
}
