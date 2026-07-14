"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useLanguage } from "../components/LanguageContext";
import Reveal from "../components/Reveal";
import type { StatDataItem, ValueItem, TeamMember } from "../lib/data";
import { fetchAbout, resolveMediaUrl } from "../lib/api";
import type { AboutPayload, ApiLocale } from "../lib/api";
import { pickLocalized, tx } from "../lib/i18n";

const FilmReelIcon = ({ size = 28 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M2 8h20" />
    <path d="M2 16h20" />
    <circle cx="7" cy="7" r="1.4" />
    <circle cx="17" cy="7" r="1.4" />
    <circle cx="7" cy="17" r="1.4" />
    <circle cx="17" cy="17" r="1.4" />
  </svg>
);

const GlobeIcon = ({ size = 28 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}>
    <circle cx="12" cy="12" r="8" />
    <path d="M12 4v16" />
    <path d="M4 12h16" />
    <path d="M7.5 6.5c3 1.5 3 7 0 8.5" />
    <path d="M16.5 6.5c-3 1.5-3 7 0 8.5" />
  </svg>
);

const CrewIcon = ({ size = 28 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}>
    <circle cx="8" cy="9" r="2" />
    <circle cx="16" cy="9" r="2" />
    <path d="M4 19c1.5-2 4-3.5 8-3.5s6.5 1.5 8 3.5" />
    <path d="M8 13h8" />
  </svg>
);

const LocationPinIcon = ({ size = 28 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}>
    <path d="M12 21s7-4.5 7-11a7 7 0 0 0-14 0c0 6.5 7 11 7 11z" />
    <circle cx="12" cy="10" r="2.2" />
  </svg>
);

const SparkIcon = ({ size = 28 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}>
    <path d="M12 2l2.5 7h7l-5.7 4.1L18.5 21 12 16.7 5.5 21l1.7-7.9L1.5 9h7L12 2z" />
  </svg>
);

const CameraLensIcon = ({ size = 28 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}>
    <rect x="3" y="6" width="18" height="12" rx="2" />
    <path d="M7 6l2-3h6l2 3" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const ViewfinderIcon = ({ size = 28 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}>
    <rect x="4" y="4" width="16" height="16" rx="3" />
    <path d="M8 4v4" />
    <path d="M16 4v4" />
    <path d="M8 20v-4" />
    <path d="M16 20v-4" />
    <path d="M4 8h4" />
    <path d="M4 16h4" />
    <path d="M20 8h-4" />
    <path d="M20 16h-4" />
  </svg>
);

const ClapperboardIcon = ({ size = 36 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}>
    <path d="M3 8h18v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8z" />
    <path d="M3 8l3-3 4 3 4-3 4 3" />
    <path d="M6 8l3-3" />
    <path d="M12 8l3-3" />
  </svg>
);

const renderTimelineIcon = (icon: string) => {
  switch (icon) {
    case "globe":
      return <GlobeIcon size={32} />;
    case "crew":
      return <CrewIcon size={32} />;
    case "location":
      return <LocationPinIcon size={32} />;
    case "spark":
      return <SparkIcon size={32} />;
    default:
      return <FilmReelIcon size={32} />;
  }
};

const renderStoryStatIcon = (index: number) => {
  const icons = [FilmReelIcon, GlobeIcon, CrewIcon];
  const Icon = icons[index] ?? FilmReelIcon;
  return <Icon size={28} />;
};

const renderValueIcon = (icon?: string) => {
  if (!icon) return <ClapperboardIcon />;
  if (icon.includes("✨")) return <SparkIcon size={36} />;
  if (icon.includes("🎥") || icon.toLowerCase().includes("production")) return <CameraLensIcon size={36} />;
  if (icon.includes("🎬")) return <ClapperboardIcon size={36} />;
  return <FilmReelIcon size={36} />;
};

/* ── Timeline Section ───────────────────────── */
const timelineData = {
  ar: [
    { year: "2015", title: "تأسيس الاستوديو", desc: "انطلقنا كاستوديو إنتاج أفلام وفيديو متخصص برؤية للسرد السينمائي", icon: "film" },
    { year: "2018", title: "التوسع في المنطقة", desc: "افتتحنا مكاتب في منطقة الشرق الأوسط وشمال أفريقيا لخدمة العلامات والمنصات والقنوات", icon: "globe" },
    { year: "2020", title: "50+ عميل", desc: "وصلنا إلى أكثر من 50 عميل راضٍ مع معدل متزايد من العمل المتكرر", icon: "crew" },
    { year: "2022", title: "مركز الإنتاج في مصر", desc: "أنشأنا دعماً إنتاجياً كاملاً على أرض الواقع للتصوير الدولي في مصر", icon: "location" },
    { year: "2024", title: "صيغ أصلية", desc: "توسّعنا في تطوير قصص وصيغ أصلية مصمّمة للسفر والإلهام", icon: "spark" },
  ],
  en: [
    { year: "2015", title: "Studio Founded", desc: "Launched as a boutique film and video production studio with a vision for cinematic storytelling", icon: "film" },
    { year: "2018", title: "MENA Expansion", desc: "Opened offices across the MENA region to serve brands, platforms, and broadcasters", icon: "globe" },
    { year: "2020", title: "50+ Clients", desc: "Reached 50+ satisfied clients with a growing repeat business rate", icon: "crew" },
    { year: "2022", title: "Egypt Production Hub", desc: "Established full on-the-ground production support for international shoots in Egypt", icon: "location" },
    { year: "2024", title: "Original Formats", desc: "Expanded into original stories and formats designed to travel and inspire global audiences", icon: "spark" },
  ],
};

/* ── Skills Bar Section ───────────────────────── */
const skillsData = {
  ar: [
    { label: "الإعلانات التجارية", percent: 97, color: "#6366f1" },
    { label: "الأفلام الوثائقية والعلامات التجارية", percent: 94, color: "#f59e0b" },
    { label: "الفعاليات الحية والبودكاست", percent: 92, color: "#10b981" },
    { label: "الموشن/CGI والتصوير", percent: 90, color: "#8b5cf6" },
    { label: "الإنتاج متعدد اللغات", percent: 95, color: "#ef4444" },
    { label: "الدعم الإنتاجي في مصر", percent: 93, color: "#06b6d4" },
  ],
  en: [
    { label: "Commercial Production", percent: 97, color: "#6366f1" },
    { label: "Documentaries & Branded Films", percent: 94, color: "#f59e0b" },
    { label: "Live Events & Podcasts", percent: 92, color: "#10b981" },
    { label: "Motion/CGI & Photography", percent: 90, color: "#8b5cf6" },
    { label: "Multilingual Production", percent: 95, color: "#ef4444" },
    { label: "Egypt Ground Support", percent: 93, color: "#06b6d4" },
  ],
};

const expertiseCategories = [
  { key: "commercials", tag: "Commercials", tagAr: "إعلانات", video: "/expertise/pepsico.mp4", title: "PepsiCo", poster: "" },
  { key: "documentaries", tag: "Documentaries", tagAr: "وثائقيات", video: "/expertise/clorox.mp4", title: "Clorox", poster: "" },
  { key: "branded-films", tag: "Branded Films", tagAr: "أفلام علامات", video: "/expertise/rose-kids.mp4", title: "Rose Kids", poster: "" },
  { key: "live-events", tag: "Live Events", tagAr: "فعاليات حية", video: "/expertise/pepsi-how-do-you-like-it.mp4", title: "Pepsi", poster: "" },
  { key: "podcasts", tag: "Podcasts", tagAr: "بودكاست", video: "/expertise/best-beef.mp4", title: "Best Beef", poster: "" },
  { key: "motion-cgi", tag: "Motion/CGI", tagAr: "موشن/CGI", video: "/expertise/pepsico.mp4", title: "PepsiCo", poster: "" },
];

function normalizeExpertiseTag(tag: string) {
  return tag.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function buildExpertiseList(cmsExpertise?: AboutPayload["expertise"]) {
  const cmsByTag = new Map(
    (cmsExpertise ?? []).map((item) => [
      normalizeExpertiseTag(item.tag ?? ""),
      {
        title: item.title,
        tagAr: item.tag_ar ?? item.tagAr,
        video: resolveMediaUrl(item.video ?? item.video_url ?? ""),
        poster: resolveMediaUrl(item.poster),
      },
    ])
  );

  return expertiseCategories.map((category) => {
    const cms = cmsByTag.get(normalizeExpertiseTag(category.tag));

    return {
      ...category,
      tagAr: cms?.tagAr || category.tagAr,
      title: cms?.title || category.title,
      video: cms?.video || category.video,
      poster: cms?.poster || category.poster,
    };
  });
}

function SkillBar({ label, percent, color, delay }: { label: string; percent: number; color: string; delay: number }) {
  const [animated, setAnimated] = useState(false);
  return (
    <Reveal direction="up" delay={delay}>
      <div
        style={{ marginBottom: 28 }}
        ref={(el) => {
          if (!el) return;
          const obs = new IntersectionObserver(([e]) => {
            if (e.isIntersecting) { setAnimated(true); obs.disconnect(); }
          }, { threshold: 0.3 });
          obs.observe(el);
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <span style={{ fontWeight: 700, fontSize: 15, color: "var(--text)" }}>{label}</span>
          <span style={{ fontWeight: 800, fontSize: 14, color }}>{percent}%</span>
        </div>
        <div style={{ height: 10, background: "var(--bg-muted)", borderRadius: 100, overflow: "hidden" }}>
          <div style={{
            height: "100%",
            width: animated ? `${percent}%` : "0%",
            background: `linear-gradient(90deg, ${color}, ${color}bb)`,
            borderRadius: 0,
            transition: `width 1.2s cubic-bezier(0.16, 1, 0.3, 1) ${delay * 0.5}ms`,
            position: "relative",
            overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
              animation: "shimmer 2s infinite",
            }} />
          </div>
        </div>
      </div>
    </Reveal>
  );
}

export default function AboutPage() {
  const { locale, t } = useLanguage();
  const ad = t.aboutData;
  const [hoveredTeam, setHoveredTeam] = useState<number | null>(null);
  const [cmsAbout, setCmsAbout] = useState<AboutPayload | null>(null);
  const [activeExpertise, setActiveExpertise] = useState(0);
  const expertiseVideoRef = useRef<HTMLVideoElement>(null);
  const expertiseInteractedRef = useRef(false);

  useEffect(() => {
    if (!expertiseInteractedRef.current) return;
    const el = expertiseVideoRef.current;
    if (!el) return;
    void el.play().catch(() => {});
  }, [activeExpertise]);

  useEffect(() => {
    fetchAbout(locale as ApiLocale)
      .then((data) => setCmsAbout(data))
      .catch(() => setCmsAbout(null));
  }, [locale]);

  const timeline =
    (cmsAbout?.timeline?.length
      ? cmsAbout.timeline.map((item) => ({
          ...item,
          desc: item.desc ?? item.description ?? "",
        }))
      : null) ??
    pickLocalized(timelineData, locale);

  const skills =
    (cmsAbout?.skills?.length
      ? cmsAbout.skills.map((s) => ({ ...s, color: s.color ?? "#6366f1" }))
      : null) ??
    pickLocalized(skillsData, locale);

  const expertiseList = buildExpertiseList(cmsAbout?.expertise);
  const activeExpertiseItem = expertiseList[activeExpertise] ?? expertiseList[0];

  useEffect(() => {
    if (activeExpertise >= expertiseList.length) {
      setActiveExpertise(0);
    }
  }, [expertiseList.length, activeExpertise]);

  const teamList: TeamMember[] = cmsAbout?.team?.length
    ? cmsAbout.team.map((member) => ({
        name: member.name,
        role: member.role,
        bio: member.bio,
        image: resolveMediaUrl(member.image),
      }))
    : ad.teamList.map((member) => ({
        ...member,
        image: resolveMediaUrl(member.image),
      }));

  const valuesList: ValueItem[] = cmsAbout?.values?.length
    ? cmsAbout.values.map((value) => ({
        icon: value.icon,
        title: value.title,
        desc: value.desc ?? value.description ?? "",
      }))
    : ad.valuesList;

  const storyImage = resolveMediaUrl(
    cmsAbout?.page?.image ??
      cmsAbout?.page?.story_image ??
      cmsAbout?.story_image ??
      cmsAbout?.storyImage ??
      cmsAbout?.team?.[0]?.image ??
      ad.storyImage
  );

  return (
    <div>
      {/* ── Hero with particle bg ────────────── */}
      <section style={{
        background: "#0a0a0a",
        padding: "100px 24px 80px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
        borderBottom: "3px solid var(--primary)",
      }}>
        {/* Animated circles */}
        {[...Array(6)].map((_, i) => (
          <div key={i} style={{
            position: "absolute",
            width: `${80 + i * 40}px`,
            height: `${80 + i * 40}px`,
            border: `1px solid rgba(99,102,241,${0.15 - i * 0.02})`,
            borderRadius: "0%",
            top: `${20 + i * 8}%`,
            left: `${10 + i * 15}%`,
            animation: `spin-slow ${8 + i * 2}s linear infinite`,
            pointerEvents: "none",
          }} />
        ))}
        <div style={{ position: "relative" }}>
          <Reveal direction="down">
            <span style={{
              display: "inline-block",
              background: "rgba(99,102,241,0.2)",
              border: "1px solid rgba(99,102,241,0.4)",
              color: "#fff",
              fontWeight: 700, fontSize: 13,
              padding: "6px 20px", borderRadius: 0, marginBottom: 20,
            }}>{ad.badge}</span>
          </Reveal>
          <Reveal direction="up" delay={100}>
            <h1 style={{ fontSize: "clamp(2.4rem, 5vw, 4rem)", fontWeight: 900, color: "#fff", marginBottom: 20, lineHeight: 1.1 }}>
              {ad.title}
            </h1>
          </Reveal>
          <Reveal direction="up" delay={200}>
            <p style={{ color: "#94a3b8", fontSize: 18, maxWidth: 680, margin: "0 auto", lineHeight: 1.8 }}>
              {ad.subtext}
            </p>
          </Reveal>
          <Reveal direction="up" delay={280}>
            <p style={{ color: "#fff", fontSize: 16, fontWeight: 700, marginTop: 28, letterSpacing: 0.5 }}>
              {ad.ceoName} | {ad.ceoRole}
            </p>
          </Reveal>
          {/* Quick stats row */}
          <Reveal direction="up" delay={350}>
            <div style={{
              display: "flex", justifyContent: "center", gap: 40, marginTop: 56,
              flexWrap: "wrap",
            }}>
              {ad.heroStats.map((s, i) => (
                <div key={i} style={{ textAlign: "center" }}>
                  <div style={{
                    fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 900,
                    color: "#fff",
                    lineHeight: 1,
                  }}>{s.value}</div>
                  <div style={{ color: "#fff", fontSize: 13, fontWeight: 600, marginTop: 6, maxWidth: 160 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Story Section ─────────────────────── */}
      <section style={{ padding: "100px 24px", background: "var(--bg)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 72,
            alignItems: "center"
          }} className="about-story-split">
            <div style={{ textAlign: "start" }}>
              <Reveal direction="down">
                <span style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: "var(--accent-light)",
                  color: "#92400e",
                  fontWeight: 700,
                  fontSize: 13,
                  padding: "5px 16px",
                  borderRadius: 0,
                  marginBottom: 20,
                }}>
                  <FilmReelIcon size={16} />
                  {ad.storyBadge}
                </span>
              </Reveal>
              <Reveal direction="up" delay={100}>
                <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)", fontWeight: 900, color: "var(--text)", marginBottom: 20, lineHeight: 1.3 }}>
                  {ad.storyTitle}
                </h2>
              </Reveal>
              <Reveal direction="up" delay={200}>
                <p style={{ color: "var(--text-muted)", fontSize: 16, lineHeight: 1.9, marginBottom: 16 }}>{ad.storyDesc1}</p>
              </Reveal>
              <Reveal direction="up" delay={300}>
                <p style={{ color: "var(--text-muted)", fontSize: 16, lineHeight: 1.9, marginBottom: 16 }}>{ad.storyDesc2}</p>
              </Reveal>
              <Reveal direction="up" delay={400}>
                <p style={{ color: "var(--text-muted)", fontSize: 16, lineHeight: 1.9, marginBottom: 16 }}>{ad.storyDesc3}</p>
              </Reveal>
              <Reveal direction="up" delay={500}>
                <p style={{ color: "var(--text-muted)", fontSize: 16, lineHeight: 1.9, marginBottom: 32 }}>{ad.storyDesc4}</p>
              </Reveal>
              <Reveal direction="up" delay={600}>
                <Link href="/contact" style={{
                  textDecoration: "none",
                  display: "inline-block",
                  background: "#0a0a0a",
                  color: "#fff", padding: "14px 32px",
                  borderRadius: 0, fontWeight: 700, fontSize: 15.5,
                  boxShadow: "0 4px 14px rgba(0,0,0,0.2)",
                  transition: "all 0.25s ease",
                  border: "2px solid #0a0a0a",
                }}
                className="story-cta"
                >
                  {ad.storyCta} &rarr;
                </Link>
              </Reveal>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 32 }} className="about-story-graphics">
              <Reveal direction="left" delay={200}>
                <div style={{ position: "relative", width: "100%", minHeight: 280 }}>
                  <Image
                    src={storyImage}
                    alt={cmsAbout?.page?.subtitle ?? ad.storyTitle}
                    width={800} height={450}
                    unoptimized
                    style={{
                      width: "100%", height: "100%",
                      borderRadius: 0,
                      boxShadow: "var(--shadow-lg)",
                      border: "1.5px solid var(--border)",
                      objectFit: "cover",
                    }}
                  />
                  {/* Floating badge on image */}
                  <div style={{
                    position: "absolute", bottom: 20, right: 20,
                    background: "rgba(255,255,255,0.95)",
                    backdropFilter: "blur(12px)",
                    borderRadius: 0, padding: "14px 20px",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                    display: "flex", alignItems: "center", gap: 12,
                  }}>
                    <div style={{ width: 34, height: 34, display: "grid", placeItems: "center", color: "var(--text)" }}>
                      <CameraLensIcon size={24} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 13, color: "var(--text)" }}>
                        {tx(locale, { ar: "استوديو إنتاج متكامل", en: "Full-Service Studio" })}
                      </div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)" }}>The Untold Story</div>
                    </div>
                  </div>
                </div>
              </Reveal>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {ad.aboutStats.map((s: StatDataItem, i: number) => (
                  <Reveal key={i} delay={i * 100} direction="up">
                    <div style={{
                      background: i === 0 ? "#0a0a0a" : "var(--bg-card)",
                      borderRadius: "0", padding: 24,
                      textAlign: "center", border: "1px solid var(--border)",
                      borderLeft: i === 0 ? "3px solid var(--primary)" : "1px solid var(--border)",
                      transition: "all 0.3s ease",
                    }}
                    className="story-stat-card"
                    >
                      <div style={{ fontSize: 30, marginBottom: 8, color: i === 0 ? "#fff" : "var(--primary)" }}>
                    {renderStoryStatIcon(i)}
                  </div>
                      <div style={{ fontSize: 28, fontWeight: 900, color: i === 0 ? "#fff" : "var(--primary)" }}>{s.value}</div>
                      <div style={{ fontSize: 13, color: i === 0 ? "rgba(255,255,255,0.6)" : "var(--text-muted)", marginTop: 4 }}>{s.label}</div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Timeline ──────────────────────────── */}
      <section style={{ padding: "100px 24px", background: "var(--bg-muted)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 72 }}>
            <Reveal direction="down">
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--primary-light)", color: "var(--primary)", fontWeight: 700, fontSize: 13, padding: "6px 20px", borderRadius: 0, marginBottom: 16 }}>
                <ViewfinderIcon size={16} />
                {tx(locale, { ar: "مسيرتنا عبر السنين", en: "Our Journey" })}
              </span>
            </Reveal>
            <Reveal direction="up" delay={100}>
              <h2 style={{ fontSize: "clamp(2rem, 3.5vw, 2.8rem)", fontWeight: 900, color: "var(--text)" }}>
                {tx(locale, { ar: "من الحلم إلى الواقع", en: "From Dream to Reality" })}
              </h2>
            </Reveal>
          </div>

          <div style={{ position: "relative" }}>
            {/* Center line */}
            <div style={{
              position: "absolute",
              top: 0, bottom: 0,
              left: "50%",
              width: 2,
              background: "linear-gradient(to bottom, var(--primary), var(--accent))",
              transform: "translateX(-50%)",
              opacity: 0.3,
            }} className="timeline-line" />

            {timeline.map((item, i) => (
              <Reveal key={i} direction={i % 2 === 0 ? "right" : "left"} delay={i * 120}>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 60px 1fr",
                  alignItems: "center",
                  marginBottom: 48,
                  gap: 0,
                }}
                className="timeline-row"
                >
                  {/* Left content (even) or empty (odd) */}
                  <div style={{ padding: "0 24px", textAlign: i % 2 === 0 ? "end" : "start" }} className={i % 2 === 0 ? "timeline-content-col" : "timeline-empty-col"}>
                    {i % 2 === 0 && (
                      <div style={{
                        background: "var(--bg-card)",
                        borderRadius: 0,
                        padding: "28px 32px",
                        border: "1px solid var(--border)",
                        boxShadow: "var(--shadow-sm)",
                        transition: "all 0.3s ease",
                      }}
                      className="timeline-card"
                      >
                        {/* <span style={{ fontSize: 28, display: "block", marginBottom: 8 }}>{item.icon}</span> */}
                        <div style={{ fontWeight: 900, fontSize: 22, color: "var(--primary)", marginBottom: 6 }}>{item.year}</div>
                        <h3 style={{ fontWeight: 800, fontSize: 17, color: "var(--text)", marginBottom: 8 }}>{item.title}</h3>
                        <p style={{ color: "var(--text-muted)", fontSize: 14, lineHeight: 1.8 }}>{item.desc}</p>
                      </div>
                    )}
                  </div>

                  {/* Center dot */}
                  <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }} className="timeline-col-center">
                    <div style={{
                      width: 20, height: 20,
                      background: "linear-gradient(135deg, var(--primary), var(--accent))",
                      borderRadius: "0",
                      border: "3px solid var(--bg-muted)",
                      boxShadow: "0 0 0 4px rgba(99,102,241,0.2)",
                      zIndex: 1,
                    }} />
                  </div>

                  {/* Right content (odd) or empty (even) */}
                  <div style={{ padding: "0 24px" }} className={i % 2 === 1 ? "timeline-content-col" : "timeline-empty-col"}>
                    {i % 2 === 1 && (
                      <div style={{
                        background: "var(--bg-card)",
                        borderRadius: 0,
                        padding: "28px 32px",
                        border: "1px solid var(--border)",
                        boxShadow: "var(--shadow-sm)",
                        transition: "all 0.3s ease",
                      }}
                      className="timeline-card"
                      >
                        {/* <span style={{ fontSize: 28, display: "block", marginBottom: 8 }}>{item.icon}</span> */}
                        <div style={{ fontWeight: 900, fontSize: 22, color: "var(--primary)", marginBottom: 6 }}>{item.year}</div>
                        <h3 style={{ fontWeight: 800, fontSize: 17, color: "var(--text)", marginBottom: 8 }}>{item.title}</h3>
                        <p style={{ color: "var(--text-muted)", fontSize: 14, lineHeight: 1.8 }}>{item.desc}</p>
                      </div>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Skills/Expertise ──────────────────── */}
      <section style={{ padding: "100px 24px", background: "var(--bg)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "center" }} className="skills-split">
            <div>
              <Reveal direction="down">
                <span style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#fff", color: "#000", fontWeight: 700, fontSize: 13, padding: "6px 20px", borderRadius: 0, marginBottom: 20 }}>
                  <ClapperboardIcon size={16} />
                  {tx(locale, { ar: "خبراتنا الإنتاجية", en: "Our Production Expertise" })}
                </span>
              </Reveal>
              <Reveal direction="up" delay={100}>
                <h2 style={{ fontSize: "clamp(1.8rem, 3vw, 2.4rem)", fontWeight: 900, color: "var(--text)", marginBottom: 16, lineHeight: 1.3 }}>
                  {tx(locale, { ar: "نصنع تجارب سينمائية من الفكرة إلى الإطار الأخير", en: "We Craft Cinematic Experiences from Spark to Final Frame" })}
                </h2>
              </Reveal>
              <Reveal direction="up" delay={200}>
                <p style={{ color: "var(--text-muted)", fontSize: 15.5, lineHeight: 1.9, marginBottom: 36 }}>
                  {tx(locale, {
                    ar: "فريقنا يمتلك الأدوات والخبرة لإنتاج مرئيات جريئة لا تُنسى عبر كل التنسيقات — بإتقان ولمسة مميزة. اضغط على أي تخصص لمشاهدة نموذج من أعمالنا.",
                    en: "Our team possesses the tools and expertise to produce bold, unforgettable visuals across every format — with precision and flair. Tap a specialty to preview our work.",
                  })}
                </p>
              </Reveal>
              <Reveal direction="up" delay={300}>
                <div style={{
                  display: "flex", gap: 12, flexWrap: "wrap",
                }}>
                  {expertiseList.map((item, i) => {
                    const active = activeExpertise === i;
                    return (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => {
                          expertiseInteractedRef.current = true;
                          setActiveExpertise(i);
                        }}
                        style={{
                          background: active ? "#0a0a0a" : "#f5f5f5",
                          color: active ? "#fff" : "#000",
                          padding: "8px 18px",
                          borderRadius: 0,
                          fontSize: 13,
                          fontWeight: 700,
                          border: active ? "1px solid #0a0a0a" : "1px solid rgba(0,0,0,0.12)",
                          cursor: "pointer",
                          transition: "background 0.2s, color 0.2s, border-color 0.2s",
                        }}
                      >
                        {locale === "ar" ? item.tagAr : item.tag}
                      </button>
                    );
                  })}
                </div>
              </Reveal>
            </div>

            <Reveal direction="left" delay={200}>
              <div
                style={{
                  position: "relative",
                  background: "#0a0a0a",
                  overflow: "hidden",
                  aspectRatio: "16 / 9",
                  boxShadow: "0 24px 60px rgba(0,0,0,0.22)",
                }}
              >
                {activeExpertiseItem?.video ? (
                  <>
                    <video
                      key={activeExpertiseItem.video}
                      ref={expertiseVideoRef}
                      src={activeExpertiseItem.video}
                      poster={activeExpertiseItem.poster || undefined}
                      controls
                      playsInline
                      preload="metadata"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                        background: "#000",
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        top: 0,
                        padding: "14px 18px",
                        background: "linear-gradient(rgba(0,0,0,0.7), transparent)",
                        pointerEvents: "none",
                      }}
                    >
                      <p style={{ color: "#fff", fontWeight: 800, fontSize: 14, margin: 0 }}>
                        {locale === "ar" ? activeExpertiseItem.tagAr : activeExpertiseItem.tag}
                        <span style={{ fontWeight: 500, opacity: 0.75 }}>
                          {" · "}
                          {activeExpertiseItem.title}
                        </span>
                      </p>
                    </div>
                  </>
                ) : (
                  <div style={{ height: "100%", display: "grid", placeItems: "center", color: "rgba(255,255,255,0.55)", padding: 24, textAlign: "center" }}>
                    {tx(locale, {
                      ar: `لا يوجد فيديو لـ ${activeExpertiseItem?.tagAr ?? "هذا التخصص"} بعد`,
                      en: `No video for ${activeExpertiseItem?.tag ?? "this specialty"} yet`,
                    })}
                  </div>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Mission & Vision ──────────────────── */}
      <section style={{ padding: "90px 24px", background: "var(--bg-muted)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 32 }}>
            <Reveal direction="up">
              <div style={{
                background: "#0a0a0a",
                borderRadius: "0", padding: 44,
                textAlign: "center", height: "100%",
                position: "relative", overflow: "hidden",
              }}>
                <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, background: "rgba(255,255,255,0.08)", borderRadius: "0%" }} />
                <div style={{ width: 60, height: 60, margin: "0 auto 20px", display: "grid", placeItems: "center", color: "#fff" }}>
                  <ClapperboardIcon size={40} />
                </div>
                <h3 style={{ fontWeight: 900, fontSize: 22, color: "#fff", marginBottom: 18 }}>{ad.missionTitle}</h3>
                <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 15.5, lineHeight: 1.9 }}>{ad.missionDesc}</p>
              </div>
            </Reveal>

            <Reveal direction="up" delay={200}>
              <div style={{
                background: "var(--bg-card)", borderRadius: "0",
                padding: 44, border: "1.5px solid var(--border)",
                textAlign: "center", height: "100%",
                transition: "all 0.3s ease",
              }}
              className="vision-card"
              >
                <div style={{ width: 60, height: 60, margin: "0 auto 20px", display: "grid", placeItems: "center", color: "var(--primary)" }}>
                  <ViewfinderIcon size={40} />
                </div>
                <h3 style={{ fontWeight: 900, fontSize: 22, color: "var(--text)", marginBottom: 18 }}>{ad.visionTitle}</h3>
                <p style={{ color: "var(--text-muted)", fontSize: 15.5, lineHeight: 1.9 }}>{ad.visionDesc}</p>
              </div>
            </Reveal>

            <Reveal direction="up" delay={400}>
              <div style={{
                background: "linear-gradient(135deg, #000000, #000000)",
                borderRadius: "0", padding: 44,
                textAlign: "center", height: "100%",
                position: "relative", overflow: "hidden",
              }}>
                <div style={{ position: "absolute", bottom: -30, left: -30, width: 120, height: 120, background: "rgba(255,255,255,0.08)", borderRadius: "0%" }} />
                <div style={{ width: 60, height: 60, margin: "0 auto 20px", display: "grid", placeItems: "center", color: "#fff" }}>
                  <SparkIcon size={40} />
                </div>
                <h3 style={{ fontWeight: 900, fontSize: 22, color: "#fff", marginBottom: 18 }}>
                  {tx(locale, { ar: "قيمنا وفلسفتنا", en: "Our Values & Philosophy" })}
                </h3>
                <p style={{ color: "rgba(255,255,255,0.9)", fontSize: 15.5, lineHeight: 1.9 }}>
                  {tx(locale, {
                    ar: "نؤمن بأن كل قصة تستحق أن تُروى بجمال سينمائي يبقى مع الجمهور.",
                    en: "We believe every story deserves to be told with cinematic beauty that stays with audiences.",
                  })}
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Values ────────────────────────────── */}
      <section style={{ padding: "90px 24px", background: "var(--bg)" }}>
        <div style={{ maxWidth: 1050, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <Reveal direction="up">
              <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)", fontWeight: 900, color: "var(--text)" }}>{ad.valuesTitle}</h2>
            </Reveal>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 28 }}>
            {valuesList.map((v: ValueItem, i: number) => (
              <Reveal key={i} delay={i * 100} direction="up">
                <div style={{
                  background: "var(--bg-card)",
                  borderRadius: "0", padding: 32,
                  textAlign: "center", border: "1px solid var(--border)",
                  height: "100%", transition: "all 0.35s ease",
                }}
                className="about-value-card"
                >
                  {/* <div style={{ fontSize: 44, marginBottom: 16, color: "var(--primary)" }}>{renderValueIcon(v.icon)}</div> */}
                  <h3 style={{ fontWeight: 800, fontSize: 18, color: "var(--text)", marginBottom: 12 }}>{v.title}</h3>
                  <p style={{ color: "var(--text-muted)", fontSize: 14.5, lineHeight: 1.8 }}>{v.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team ──────────────────────────────── */}
      <section style={{ padding: "90px 24px", background: "var(--bg-muted)" , display:"none"}}>
        <div style={{ maxWidth: 1050, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <Reveal direction="down">
              <span style={{ display: "inline-block", background: "var(--primary-light)", color: "var(--primary)", fontWeight: 700, fontSize: 13, padding: "5px 18px", borderRadius: 0, marginBottom: 16 }}>{ad.teamBadge}</span>
            </Reveal>
            <Reveal direction="up" delay={100}>
              <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)", fontWeight: 900, color: "var(--text)" }}>{ad.teamTitle}</h2>
            </Reveal>
          </div>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 32 }}>
            {teamList.map((m: TeamMember, i: number) => (
              <Reveal key={i} delay={i * 100} direction="up">
                <div
                  onMouseEnter={() => setHoveredTeam(i)}
                  onMouseLeave={() => setHoveredTeam(null)}
                  style={{
                    background: "var(--bg-card)",
                    borderRadius: "0", padding: 32,
                    textAlign: "center",
                    border: `1.5px solid ${hoveredTeam === i ? "var(--primary)" : "var(--border)"}`,
                    boxShadow: hoveredTeam === i ? "var(--shadow-lg)" : "var(--shadow-sm)",
                    transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                    transform: hoveredTeam === i ? "translateY(-10px)" : "none",
                    height: "100%",
                  }}
                >
                  <div style={{ position: "relative", width: 90, height: 90, margin: "0 auto 20px" }}>
                    <Image
                      src={resolveMediaUrl(m.image)} alt={m.name}
                      width={90} height={90}
                      unoptimized
                      style={{
                        width: "100%", height: "100%",
                        borderRadius: "0%", objectFit: "cover",
                        border: `3px solid ${hoveredTeam === i ? "var(--primary)" : "var(--primary-light)"}`,
                        boxShadow: hoveredTeam === i ? "0 0 0 4px rgba(99,102,241,0.15)" : "0 4px 10px rgba(0,0,0,0.1)",
                        transition: "all 0.4s ease",
                      }}
                    />
                    {/* Online indicator */}
                    <div style={{
                      position: "absolute", bottom: 4, right: 4,
                      width: 14, height: 14,
                      background: "#10b981",
                      borderRadius: "0%",
                      border: "2px solid var(--bg-card)",
                    }} />
                  </div>
                  <h3 style={{ fontWeight: 800, fontSize: 17.5, color: "var(--text)" }}>{m.name}</h3>
                  <p style={{ color: "var(--primary)", fontWeight: 600, fontSize: 13.5, margin: "6px 0 12px" }}>{m.role}</p>
                  <p style={{ color: "var(--text-muted)", fontSize: 13.5, lineHeight: 1.8 }}>{m.bio}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        @keyframes spin-slow { to { transform: rotate(360deg); } }
        @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(200%); } }
        .about-value-card:hover { transform: translateY(-8px); border-color: var(--primary) !important; box-shadow: var(--shadow-md); }
        .timeline-card:hover { transform: translateY(-4px); border-color: var(--primary) !important; box-shadow: var(--shadow-md); }
        .vision-card:hover { border-color: var(--primary) !important; box-shadow: var(--shadow-md); transform: translateY(-6px); }
        .partner-badge:hover { border-color: var(--primary) !important; color: var(--primary) !important; transform: translateY(-2px); }
        .story-cta:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(99,102,241,0.35) !important; }
        .story-stat-card:hover { transform: translateY(-6px); box-shadow: var(--shadow-md); }
        .partner-logo-card:hover { transform: translateY(-6px); box-shadow: 0 28px 58px rgba(0,0,0,0.24); }
        @media (max-width: 768px) {
          .about-story-split { grid-template-columns: 1fr !important; gap: 40px !important; text-align: center !important; }
          .about-story-graphics { gap: 24px !important; }
          .skills-split { grid-template-columns: 1fr !important; gap: 40px !important; }
          .timeline-line { display: none !important; }
          .timeline-col-center { display: none !important; }
          .timeline-empty-col { display: none !important; }
          .timeline-row { grid-template-columns: 1fr !important; margin-bottom: 24px !important; }
          .timeline-content-col { padding: 0 !important; text-align: inherit !important; }
        }
      `}</style>
    </div>
  );
}
