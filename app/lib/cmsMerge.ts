import type { HomePayload, LayoutPayload } from "./api";
import { resolveMediaUrl } from "./api";
import type { ClientLogo, Translation } from "./data";
import type { Locale } from "./i18n";
import { getServiceImageUrl } from "./serviceImages";

/** CMS fields that are null should not overwrite static fallbacks. */
function withoutNulls<T extends Record<string, unknown>>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value != null)
  ) as Partial<T>;
}

function mapServicesData(
  services: Array<Record<string, unknown>>
): Translation["servicesData"] {
  return services.map((service, index) => {
    const id = String(service.id ?? service.slug ?? `service-${index + 1}`);
    const apiImage = resolveMediaUrl(
      String(
        service.imageUrl ??
          service.image_url ??
          service.image ??
          service.featured_image ??
          service.featuredImage ??
          ""
      )
    );

    return {
    id,
    icon: String(service.icon ?? "📌"),
    imageUrl: getServiceImageUrl(id, apiImage || undefined),
    title: String(service.title ?? ""),
    shortDesc: String(service.shortDesc ?? ""),
    price: String(service.price ?? ""),
    fullDesc: String(service.fullDesc ?? ""),
    features: Array.isArray(service.features) ? (service.features as string[]) : [],
  };
  }) as Translation["servicesData"];
}

function mapCommonLabels(labels: Record<string, string>): Partial<Translation["common"]> {
  return {
    dashboardBtn: labels.dashboardBtn,
    readMore: labels.readMore,
    requestService: labels.requestService,
    contactUs: labels.contactUs,
    contactUsNow: labels.contactUsNow,
    exploreServices: labels.exploreServices,
    allServices: labels.allServices,
    successTitle: labels.successTitle,
    successDesc: labels.successDesc,
    sendAnother: labels.sendAnother,
    loading: labels.loading,
    submitBtn: labels.submitBtn,
    whyUs: labels.whyUs,
  };
}

function isJeddahOffice(office: { region: string; address: string }): boolean {
  return /jeddah|ksa|saudi|جدة|السعودية/i.test(`${office.region} ${office.address}`);
}

export function mapClientLogos(
  logos: Array<Record<string, unknown>> | undefined
): ClientLogo[] {
  if (!logos?.length) return [];

  return logos
    .map((logo) => ({
      src: resolveMediaUrl(
        String(logo.image ?? logo.imageUrl ?? logo.image_url ?? logo.src ?? logo.url ?? "")
      ),
      alt: String(logo.displayName ?? logo.display_name ?? logo.name ?? logo.alt ?? "Client"),
    }))
    .filter((logo) => logo.src);
}

function mergeFooterOffices(
  baseOffices: Translation["footer"]["offices"],
  cmsOffices?: Translation["footer"]["offices"]
): Translation["footer"]["offices"] {
  if (!cmsOffices?.length) return baseOffices;

  const hasJeddah = cmsOffices.some(isJeddahOffice);
  if (hasJeddah) return cmsOffices;

  const ksaOffice = baseOffices.find(isJeddahOffice);
  return ksaOffice ? [...cmsOffices, ksaOffice] : cmsOffices;
}

export function mergeLayoutIntoTranslation(
  base: Translation,
  layout: LayoutPayload
): Translation {
  const siteConfig = withoutNulls(
    layout.site_config as Record<string, unknown>
  ) as Partial<Translation["siteConfig"]>;
  const footer = withoutNulls(
    layout.footer as Record<string, unknown>
  ) as Partial<Translation["footer"]>;

  return {
    ...base,
    siteConfig: { ...base.siteConfig, ...siteConfig },
    navLinks: (layout.nav_links?.length ? layout.nav_links : base.navLinks).filter(
      (link) => link.href !== "/blog"
    ),
    footer: {
      ...base.footer,
      ...footer,
      offices: mergeFooterOffices(
        base.footer.offices,
        footer.offices as Translation["footer"]["offices"] | undefined
      ),
    },
    announcementBar: layout.announcement?.text ?? base.announcementBar,
    showAnnouncementBar: layout.announcement?.enabled ?? base.showAnnouncementBar,
    common: { ...base.common, ...mapCommonLabels(layout.common_labels || {}) },
  };
}

export function mergeHomeIntoTranslation(
  base: Translation,
  home: HomePayload,
  services: Array<Record<string, unknown>>
): Translation {
  const hero = withoutNulls(
    home.hero as Record<string, unknown>
  ) as Partial<Translation["heroData"]>;
  const homeData = withoutNulls(
    home.home_data as Record<string, unknown>
  ) as Partial<Translation["homeData"]>;
  const process = home.process;
  const testimonials = home.testimonials;
  const faq = home.faq;

  const servicesData =
    services.length > 0
      ? mapServicesData(services)
      : home.services?.length
        ? mapServicesData(home.services)
        : base.servicesData;

  const blogPosts =
    home.blog_preview?.map((post, index) => ({
      id: String(post.slug ?? post.id ?? `post-${index + 1}`),
      title: String(post.title ?? ""),
      excerpt: String(post.excerpt ?? ""),
      date: String(post.date ?? post.published_at ?? ""),
      category: String(post.category ?? ""),
    })) ?? base.blogPage.posts;

  return {
    ...base,
    heroData: {
      ...base.heroData,
      ...hero,
      cta1: {
        ...base.heroData.cta1,
        ...(hero.cta1 as Translation["heroData"]["cta1"]),
      },
      cta2: {
        ...base.heroData.cta2,
        ...(hero.cta2 as Translation["heroData"]["cta2"]),
      },
    },
    statsData: home.stats?.length ? (home.stats as Translation["statsData"]) : base.statsData,
    servicesData,
    homeData: {
      ...base.homeData,
      ...homeData,
      ...(homeData.photographyImage
        ? { photographyImage: resolveMediaUrl(String(homeData.photographyImage)) }
        : {}),
    },
    processData: {
      badge: process?.badge ?? base.processData.badge,
      title: process?.title ?? base.processData.title,
      steps: process?.steps?.length
        ? process.steps.map((step, i) => ({
            step: String(step.step ?? i + 1),
            title: String(step.title ?? ""),
            desc: String(step.desc ?? step.description ?? ""),
          }))
        : base.processData.steps,
    },
    testimonialsData: {
      badge: testimonials?.badge ?? base.testimonialsData.badge,
      title: testimonials?.title ?? base.testimonialsData.title,
      list: testimonials?.list?.length
        ? (testimonials.list as Translation["testimonialsData"]["list"])
        : base.testimonialsData.list,
    },
    faqData: {
      badge: faq?.badge ?? base.faqData.badge,
      title: faq?.title ?? base.faqData.title,
      list: faq?.list?.length ? faq.list : base.faqData.list,
    },
    blogPage: {
      ...base.blogPage,
      posts: blogPosts,
    },
  };
}

export type CmsHeroSlide = {
  img: string;
  badge: string;
  title: string;
  titleHighlight: string;
  subtitle: string;
  desc: string;
  cta: string;
  ctaHref: string;
  ctaSecondary: string;
  ctaSecondaryHref: string;
  gradient?: string;
};

export type CmsWorkShowcase = {
  badge: string;
  title: string;
  subtitle: string;
  viewAll: string;
  projects: Array<{
    img: string;
    category: string;
    title: string;
    metric: string;
    color?: string;
    size?: string;
  }>;
};

export function mapHeroSlides(slides: Array<Record<string, unknown>>): CmsHeroSlide[] {
  return slides.map((slide) => ({
    img: resolveMediaUrl(String(slide.img ?? "")),
    badge: String(slide.badge ?? ""),
    title: String(slide.title ?? ""),
    titleHighlight: String(slide.titleHighlight ?? ""),
    subtitle: String(slide.subtitle ?? ""),
    desc: String(slide.desc ?? ""),
    cta: String(slide.cta ?? ""),
    ctaHref: String(slide.ctaHref ?? "/contact"),
    ctaSecondary: String(slide.ctaSecondary ?? ""),
    ctaSecondaryHref: String(slide.ctaSecondaryHref ?? "/portfolio"),
    gradient: slide.gradient ? String(slide.gradient) : undefined,
  }));
}

export function mapWorkShowcase(data: Record<string, unknown>): CmsWorkShowcase | null {
  if (!data?.projects) return null;

  const colors = ["#000", "#000", "#000", "#000"];

  return {
    badge: String(data.badge ?? ""),
    title: String(data.title ?? ""),
    subtitle: String(data.subtitle ?? ""),
    viewAll: String(data.viewAll ?? ""),
    projects: (data.projects as Array<Record<string, unknown>>).map((project, i) => ({
      img: resolveMediaUrl(String(project.img ?? "")),
      category: String(project.category ?? ""),
      title: String(project.title ?? ""),
      metric: String(project.metric ?? ""),
      color: colors[i % colors.length],
      size: String(project.size ?? "small"),
    })),
  };
}

export async function loadCmsForLocale(
  locale: Locale,
  base: Translation
): Promise<{
  translation: Translation;
  heroSlides: CmsHeroSlide[];
  workShowcase: CmsWorkShowcase | null;
  clientLogos: ClientLogo[];
}> {
  const { fetchHome, fetchLayout, fetchServices } = await import("./api");

  const [layout, home, services] = await Promise.all([
    fetchLayout(locale),
    fetchHome(locale),
    fetchServices(locale),
  ]);

  let merged = mergeLayoutIntoTranslation(base, layout);
  merged = mergeHomeIntoTranslation(merged, home, services);

  return {
    translation: merged,
    heroSlides: mapHeroSlides(home.hero_slides ?? []),
    workShowcase: mapWorkShowcase(home.work_showcase ?? {}),
    clientLogos: mapClientLogos(
      layout.client_logos as Array<Record<string, unknown>> | undefined
    ),
  };
}
