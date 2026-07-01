const EXTERNAL_API =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  "https://globaluntoldstory.com/api/public/api/v1";

// Static export: no server proxy available — call the external API directly.
// Ensure your Laravel backend has CORS configured to allow your frontend domain.
const API_BASE = EXTERNAL_API;

export type ApiLocale = "en" | "ar";

export interface ApiEnvelope<T> {
  success: boolean;
  locale?: string;
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function getApiBaseUrl(): string {
  return API_BASE;
}

export function resolveMediaUrl(url?: string | null): string {
  if (!url) return "";

  let resolved = url.trim();

  // Backend occasionally returns duplicated storage path segments.
  resolved = resolved.replace(
    /\/api\/public\/storage\/api\/public\/storage\//g,
    "/api/public/storage/"
  );

  if (resolved.startsWith("/")) {
    const origin = EXTERNAL_API.replace(/\/api\/v1\/?$/, "");
    resolved = `${origin}${resolved}`;
  } else if (!/^https?:\/\//i.test(resolved) && resolved.startsWith("storage/")) {
    const origin = EXTERNAL_API.replace(/\/api\/v1\/?$/, "");
    resolved = `${origin}/${resolved}`;
  }

  return resolved;
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit & { locale?: ApiLocale } = {}
): Promise<T> {
  const { locale, ...init } = options;
  const url = new URL(`${API_BASE}${path.startsWith("/") ? path : `/${path}`}`);

  if (locale) {
    url.searchParams.set("locale", locale);
  }

  const response = await fetch(url.toString(), {
    ...init,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(locale ? { "Accept-Language": locale } : {}),
      ...(init.headers || {}),
    },
  });

  const body = (await response.json().catch(() => ({}))) as ApiEnvelope<T> & {
    message?: string;
    errors?: Record<string, string[]>;
  };

  if (!response.ok || body.success === false) {
    throw new ApiError(
      body.message || `Request failed (${response.status})`,
      response.status,
      body.errors
    );
  }

  return body.data;
}

export interface LayoutPayload {
  site_config: Record<string, unknown>;
  nav_links: Array<{ href: string; label: string }>;
  footer: Record<string, unknown>;
  announcement: { text: string | null; enabled: boolean };
  common_labels: Record<string, string>;
}

export interface HomePayload {
  hero_slides: Array<Record<string, unknown>>;
  hero: Record<string, unknown>;
  stats: Array<{ value: string; label: string; icon?: string }>;
  services: Array<Record<string, unknown>>;
  home_data: Record<string, unknown>;
  work_showcase: Record<string, unknown>;
  process: { badge?: string; title?: string; steps?: Array<Record<string, unknown>> };
  testimonials: { badge?: string; title?: string; list?: Array<Record<string, unknown>> };
  faq: { badge?: string; title?: string; list?: Array<{ q: string; a: string }> };
  blog_preview: Array<Record<string, unknown>>;
}

export function fetchLayout(locale: ApiLocale) {
  return apiFetch<LayoutPayload>("/layout", { locale });
}

export function fetchHome(locale: ApiLocale) {
  return apiFetch<HomePayload>("/home", { locale });
}

export function fetchServices(locale: ApiLocale) {
  return apiFetch<{ items: Array<Record<string, unknown>> }>("/services", { locale }).then(
    (data) => data.items ?? []
  );
}

export interface ServiceDetail {
  id: string;
  slug: string;
  icon: string;
  imageUrl?: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  price: string;
  features: string[];
  isFeatured?: boolean;
  sortOrder?: number;
  seo?: Record<string, unknown>;
}

export function fetchService(slug: string, locale: ApiLocale = "en") {
  return apiFetch<ServiceDetail>(`/services/${slug}`, { locale });
}

export function submitContact(payload: {
  name: string;
  email: string;
  phone?: string;
  service?: string;
  budget?: string;
  message: string;
  locale: ApiLocale;
}) {
  return apiFetch<{ reference_id: string; message: string }>("/contact", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function submitQuote(payload: {
  name: string;
  email: string;
  phone?: string;
  service?: string;
  message?: string;
  locale: ApiLocale;
}) {
  return apiFetch<{ reference_id: string; message: string }>("/leads/quote", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function subscribeNewsletter(payload: { email: string; locale: ApiLocale }) {
  return apiFetch<{ message: string }>("/newsletter/subscribe", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export interface AboutPayload {
  page?: {
    title?: string;
    subtitle?: string;
    badge?: string;
    image?: string;
    story_image?: string;
  };
  story_image?: string;
  storyImage?: string;
  team?: Array<{ name: string; role: string; bio: string; image: string; slug?: string }>;
  timeline?: Array<{ year: string; title: string; desc?: string; description?: string; icon?: string }>;
  skills?: Array<{ label: string; percent: number; color?: string }>;
  values?: Array<{ icon: string; title: string; desc?: string; description?: string }>;
  stats?: Array<{ value: string; label: string; icon?: string }>;
  partnerLabels?: string[];
}

export interface PortfolioItem {
  id: number | string;
  slug: string;
  title: string;
  client: string;
  category: string;
  results: string;
  duration: string;
  budget: string;
  img?: string;
  image?: string;
  featured_image?: string;
  featuredImage?: string;
  description?: string;
  gallery?: string[];
  metrics?: Array<{ label: string; value: string }>;
}

export interface BlogPost {
  id: number | string;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  author?: string;
  authorName?: string;
  author_image?: string;
  authorImage?: string;
  read_time?: string;
  readTimeMinutes?: number;
  featured_image?: string;
  featuredImage?: string;
  tags?: string[];
  body?: string;
}

export interface BlogListPayload {
  data?: BlogPost[];
  posts?: BlogPost[];
  items?: BlogPost[];
  featured?: BlogPost;
}

export interface FaqItem {
  q: string;
  a: string;
}

export function fetchAbout(locale: ApiLocale = "en") {
  return apiFetch<AboutPayload>("/about", { locale });
}

export function fetchPortfolio(locale: ApiLocale = "en") {
  return apiFetch<PortfolioItem[] | { data: PortfolioItem[]; items?: PortfolioItem[] }>("/portfolio", { locale });
}

export function fetchPortfolioItem(slug: string, locale: ApiLocale = "en") {
  return apiFetch<PortfolioItem>(`/portfolio/${slug}`, { locale });
}

export function fetchBlog(locale: ApiLocale = "en", page: number = 1) {
  return apiFetch<BlogListPayload>(`/blog?page=${page}`, { locale });
}

export function fetchBlogPost(slug: string, locale: ApiLocale = "en") {
  return apiFetch<BlogPost>(`/blog/${slug}`, { locale });
}

export function fetchFaqs(locale: ApiLocale = "en") {
  return apiFetch<FaqItem[] | { data: FaqItem[] }>("/faqs", { locale });
}

export function fetchTestimonials(locale: ApiLocale = "en") {
  return apiFetch<Array<Record<string, unknown>> | { data: Array<Record<string, unknown>> }>("/testimonials", { locale });
}

export function fetchSeo(type: string, slug: string, locale: ApiLocale = "en") {
  return apiFetch<Record<string, unknown>>(`/seo/${type}/${slug}`, { locale });
}
