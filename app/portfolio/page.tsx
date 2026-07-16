"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "../components/LanguageContext";
import Reveal from "../components/Reveal";
import { fetchPortfolio, resolveMediaUrl } from "../lib/api";
import type { PortfolioItem, ApiLocale } from "../lib/api";
import { pickLocalized, tx, isRtlLocale } from "../lib/i18n";

const staticProjects = {
  ar: [
    { id: 1, slug: "al-nokhba-digital-marketing", title: "حملة النخبة للتسويق الرقمي", category: "digital-ads", results: "زيادة المبيعات +٢٤٠٪، عائد الاستثمار ٥.٢ ضعف", client: "مجموعة النخبة", img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop", duration: "3 أشهر", budget: "50,000 ر.س" },
    { id: 2, slug: "rikaz-real-estate-identity", title: "الهوية البصرية لشركة ركاز العقارية", category: "branding", results: "تصميم شعار فريد ودليل هوية بصرية كاملة", client: "ركاز للتطوير", img: "https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=600&auto=format&fit=crop", duration: "شهر واحد", budget: "25,000 ر.س" },
    { id: 3, slug: "masar-app-launch-video", title: "فيديو إطلاق تطبيق مسار التعليمي", category: "video", results: "٣.٥ مليون مشاهدة، زيادة التحميلات +١٨٠٪", client: "شركة مسار", img: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop", duration: "شهران", budget: "35,000 ر.س" },
    { id: 4, slug: "gourmet-social-growth", title: "إدارة السوشيال ميديا لمطاعم جورميه", category: "social", results: "+٤٥ ألف متابع جديد، تفاعل شهري +١٣٠٪", client: "جورميه العالمية", img: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=600&auto=format&fit=crop", duration: "6 أشهر", budget: "18,000 ر.س / شهر" },
    { id: 5, slug: "fashion-brand-google-campaign", title: "حملة إعلانات جوجل لبراند فاشن", category: "digital-ads", results: "+٣٢٠٪ عائد على الإنفاق الإعلاني، ٨ آلاف تحويل", client: "براند فاشن", img: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=600&auto=format&fit=crop", duration: "4 أشهر", budget: "80,000 ر.س" },
    { id: 6, slug: "myhealth-influencer-campaign", title: "حملة المؤثرين لمنتج صحتي الرياضي", category: "social", results: "تغطية من ١٥ مؤثر، مبيعات نفدت بالكامل", client: "صحتي المحدودة", img: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=600&auto=format&fit=crop", duration: "شهران", budget: "40,000 ر.س" },
  ],
  en: [
    { id: 1, slug: "al-nokhba-digital-marketing", title: "Al-Nokhba Digital Marketing Blitz", category: "digital-ads", results: "+240% Sales Increase, 5.2x ROI", client: "Al-Nokhba Group", img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop", duration: "3 Months", budget: "$14,000" },
    { id: 2, slug: "rikaz-real-estate-identity", title: "Rikaz Real Estate Visual Identity", category: "branding", results: "Unique modern logo & comprehensive brand guidelines", client: "Rikaz Development", img: "https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=600&auto=format&fit=crop", duration: "1 Month", budget: "$7,000" },
    { id: 3, slug: "masar-app-launch-video", title: "Masar Learning App Launch Video", category: "video", results: "3.5M Views, +180% App Downloads boost", client: "Masar EdTech", img: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop", duration: "2 Months", budget: "$9,500" },
    { id: 4, slug: "gourmet-social-growth", title: "Gourmet Burgers Social Growth & Content", category: "social", results: "+45k New followers, +130% Monthly engagement", client: "Gourmet International", img: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=600&auto=format&fit=crop", duration: "6 Months", budget: "$5,000/mo" },
    { id: 5, slug: "fashion-brand-google-campaign", title: "Fashion Brand Google Search Campaign", category: "digital-ads", results: "+320% Return on Ad Spend, 8,000+ Conversions", client: "Fashion Brand Ltd", img: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=600&auto=format&fit=crop", duration: "4 Months", budget: "$22,000" },
    { id: 6, slug: "myhealth-influencer-campaign", title: "MyHealth Influencer Launch Campaign", category: "social", results: "Featured by 15 major fitness influencers, sold out stock", client: "MyHealth Ltd", img: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=600&auto=format&fit=crop", duration: "2 Months", budget: "$11,000" },
  ],
};

const categories = {
  ar: [
    { id: "all", label: "الكل" },
    { id: "digital-ads", label: "الإعلانات الرقمية" },
    { id: "branding", label: "الهوية البصرية" },
    { id: "video", label: "إنتاج الفيديو" },
    { id: "social", label: "السوشيال ميديا" },
  ],
  en: [
    { id: "all", label: "All" },
    { id: "digital-ads", label: "Digital Ads" },
    { id: "branding", label: "Branding" },
    { id: "video", label: "Video Production" },
    { id: "social", label: "Social Media" },
  ],
};

const clientLogosRow = ["Google Partner", "Meta Business", "TikTok For Business", "HubSpot", "Adobe", "Semrush", "Shopify"];

type ProjectShape = {
  id: number | string;
  slug: string;
  title: string;
  category: string;
  results: string;
  client: string;
  img: string;
  duration: string;
  budget: string;
};

function normaliseProjects(raw: PortfolioItem[]): ProjectShape[] {
  return raw.map((p) => ({
    id: p.id,
    slug: p.slug ?? String(p.id),
    title: p.title ?? "",
    category: p.category ?? "",
    results: p.results ?? "",
    client: p.client ?? "",
    img: resolveMediaUrl(p.featured_image ?? p.featuredImage ?? p.image ?? p.img ?? ""),
    duration: p.duration ?? "",
    budget: p.budget ?? "",
  }));
}

export default function PortfolioPage() {
  const { locale } = useLanguage();
  const [selectedCat, setSelectedCat] = useState("all");
  const [hoveredProject, setHoveredProject] = useState<number | string | null>(null);
  const [cmsProjects, setCmsProjects] = useState<ProjectShape[] | null>(null);

  useEffect(() => {
    fetchPortfolio(locale as ApiLocale)
      .then((data) => {
        const list = Array.isArray(data)
          ? data
          : ((data as { data?: PortfolioItem[]; items?: PortfolioItem[] }).data ??
             (data as { items?: PortfolioItem[] }).items ??
             []);
        if (list.length > 0) setCmsProjects(normaliseProjects(list));
      })
      .catch(() => setCmsProjects(null));
  }, [locale]);

  const staticActive = pickLocalized(staticProjects, locale);
  const activeProjects: ProjectShape[] = cmsProjects ?? staticActive;
  const activeCats = pickLocalized(categories, locale);
  const filtered = selectedCat === "all" ? activeProjects : activeProjects.filter(p => p.category === selectedCat);

  return (
    <div>
      {/* ── Hero ─────────────────────────────── */}
      <section style={{
        background: "#0a0a0a",
        padding: "100px 24px 80px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
        borderBottom: "3px solid var(--primary)",
      }}>
        {/* Floating shapes */}
        {[...Array(5)].map((_, i) => (
          <div key={i} style={{
            position: "absolute",
            width: `${40 + i * 20}px`,
            height: `${40 + i * 20}px`,
            background: `rgba(${i % 2 === 0 ? "99,102,241" : "245,158,11"},0.12)`,
            borderRadius: i % 2 === 0 ? "0%" : "0%",
            top: `${15 + i * 15}%`,
            left: `${5 + i * 18}%`,
            animation: `float-shape ${4 + i}s ease-in-out infinite alternate`,
            pointerEvents: "none",
          }} />
        ))}

        <div style={{ position: "relative" }}>
          <Reveal direction="down">
            <span style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.16)",
              color: "#fff",
              fontWeight: 700, fontSize: 13,
              padding: "6px 20px", borderRadius: 20, marginBottom: 20,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}>
              <span style={{ fontSize: 14 }}>FILM</span>
              {tx(locale, { ar: "براند سينمائي", en: "Cinema Studio" })}
            </span>
          </Reveal>
          <Reveal direction="up" delay={100}>
            <h1 style={{ fontSize: "clamp(2.4rem, 5vw, 4rem)", fontWeight: 900, color: "#fff", marginBottom: 20, lineHeight: 1.1 }}>
              {tx(locale, { ar: "قصص نجاح صنعناها لعملائنا", en: "Success Stories We Crafted" })}
            </h1>
          </Reveal>
          <Reveal direction="up" delay={200}>
            <p style={{ color: "#94a3b8", fontSize: 17.5, maxWidth: 580, margin: "0 auto", lineHeight: 1.7 }}>
              {tx(locale, {
                ar: "نستعرض هنا بعضاً من أفضل أعمالنا وحملاتنا الإعلانية الناجحة التي ساهمت في نمو العلامات التجارية لشركائنا.",
                en: "Explore some of our premium projects and campaigns that successfully scaled our clients' business presence.",
              })}
            </p>
          </Reveal>

          {/* Metrics row */}
          <Reveal direction="up" delay={350}>
            <div style={{ display: "flex", justifyContent: "center", gap: 48, marginTop: 52, flexWrap: "wrap" }}>
              {[
                { num: "500+", label: tx(locale, { ar: "مشروع منجز", en: "Projects Done" }) },
                { num: "120+", label: tx(locale, { ar: "عميل راضٍ", en: "Happy Clients" }) },
                { num: "15", label: tx(locale, { ar: "دولة", en: "Countries" }) },
              ].map((m, i) => (
                <div key={i} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", fontWeight: 900, color: "#fff", lineHeight: 1 }}>{m.num}</div>
                  <div style={{ fontSize: 13, color: "#fff", fontWeight: 600, marginTop: 6 }}>{m.label}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Client Logos ──────────────────────── */}
      

      {/* ── Filter Strip ──────────────────────── */}
      {/* <section style={{ padding: "40px 24px 0", background: "var(--bg)", display: "flex", justifyContent: "center" }}>
        <Reveal direction="up">
          <div style={{
            display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center",
            background: "var(--bg-card)", padding: "8px 10px",
            borderRadius: 0, border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)",
          }}
          className="filter-strip"
          >
            {activeCats.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCat(cat.id)}
                style={{
                  background: selectedCat === cat.id ? "linear-gradient(135deg, #000, #000)" : "transparent",
                  color: selectedCat === cat.id ? "#fff" : "var(--text-muted)",
                  border: "none", padding: "9px 22px", borderRadius: 0,
                  fontSize: 14, fontWeight: 700, cursor: "pointer",
                  transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                  boxShadow: selectedCat === cat.id ? "0 4px 14px rgba(99,102,241,0.3)" : "none",
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </Reveal>
      </section> */}

      {/* ── Portfolio Grid ────────────────────── */}
      <section style={{ padding: "48px 24px 100px", background: "var(--bg)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
            gap: 32,
          }}
          className="portfolio-grid"
          >
            {filtered.map((proj, i) => (
              <Reveal key={proj.id} delay={i * 80} direction="up">
                  <Link href={`/portfolio/${proj.slug ?? proj.id}`}
                  onMouseEnter={() => setHoveredProject(proj.id ?? proj.slug)}
                  onMouseLeave={() => setHoveredProject(null)}
                  style={{
                    background: "var(--bg-card)",
                    borderRadius: 2, overflow: "hidden",
                    border: `1.5px solid ${hoveredProject === (proj.id ?? proj.slug) ? "var(--primary)" : "var(--border)"}`,
                    boxShadow: hoveredProject === (proj.id ?? proj.slug) ? "0 24px 60px rgba(99,102,241,0.15)" : "var(--shadow-sm)",
                    transform: hoveredProject === (proj.id ?? proj.slug) ? "translateY(-8px)" : "none",
                    transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    textDecoration: "none",
                    color: "inherit",
                  }}
                  className="portfolio-card"
                >
                  {/* Image */}
                  <div style={{ position: "relative", overflow: "hidden", height: 240 }}>
                    <Image
                      src={proj.img} alt={proj.title}
                      fill unoptimized
                      style={{
                        objectFit: "cover",
                        transform: hoveredProject === (proj.id ?? proj.slug) ? "scale(1.08)" : "scale(1)",
                        transition: "transform 0.5s ease",
                      }}
                    />
                    {/* Category tag */}
                    <div style={{
                      position: "absolute", display:"none", top: 16, left: isRtlLocale(locale) ? "auto" : 16, right: isRtlLocale(locale) ? 16 : "auto",
                      background: "linear-gradient(160deg, #dc2528 0%, #000000 50%, #000000e0 100%)", backdropFilter: "blur(6px)",
                      color: "#fff", padding: "5px 14px", borderRadius: 0,
                      fontSize: 12, fontWeight: 700,
                    }}>
                      {activeCats.find(c => c.id === proj.category)?.label}
                    </div>
                    {/* Hover overlay */}
                        <div style={{
                          position: "absolute", inset: 0,
                          background: "linear-gradient(to top, #000000, transparent)",
                          opacity: hoveredProject === (proj.id ?? proj.slug) ? 1 : 0,
                      transition: "opacity 0.4s ease",
                      display: "flex", alignItems: "flex-end", padding: "20px 20px",
                    }}>
                      <div style={{
                        transform: hoveredProject === (proj.id ?? proj.slug) ? "translateY(0)" : "translateY(16px)",
                        transition: "transform 0.4s ease",
                        display: "flex", gap: 10,
                      }}>
                      </div>
                    </div>
                  </div>

                  {/* Info */}
                  <div style={{ padding: "28px 28px 32px", textAlign: "start", display: "flex", flexDirection: "column", flex: 1 }}>
                    <div style={{ fontSize: 13, color: "#000", fontWeight: 700, marginBottom: 6 }}>{proj.client}</div>
                    <h3 style={{ fontSize: 18.5, fontWeight: 800, color: "var(--text)", marginBottom: 14, lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", textOverflow: "ellipsis" }}>{proj.title}</h3>
                    <div style={{
                      background: "#000000", color: "#fff",
                      padding: "10px 16px", borderRadius: 10,
                      fontSize: 13.5, fontWeight: 700,
                      display: "flex", alignItems: "center", gap: 8,
                      marginBottom: 16,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}>
                      <span style={{ opacity: 0.8 }}>RESULTS</span>
                      <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{proj.results}</span>
                    </div>
                    <div style={{ marginTop: "auto" }}>
                      <span style={{
                        color: "#000", fontWeight: 700, fontSize: 13.5,
                        display: "inline-flex", alignItems: "center", gap: 6,
                      }}
                      className="portfolio-link"
                      >
                        {tx(locale, { ar: "تفاصيل المشروع", en: "View Project" })} →
                      </span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────── */}
      <section style={{
        padding: "100px 24px",
        background: "linear-gradient(160deg, #000000 0%, #000000 50%, #000000e0 100%)",
        textAlign: "center",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(99,102,241,0.1) 1px, transparent 1px)", backgroundSize: "40px 40px", pointerEvents: "none" }} />
        <div style={{ position: "relative" }}>
          <Reveal direction="down">
            <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 900, color: "#fff", marginBottom: 16 }}>
              {tx(locale, { ar: "هل أنت جاهز لقصة نجاح جديدة؟", en: "Ready for the Next Success Story?" })}
            </h2>
          </Reveal>
          <Reveal direction="up" delay={100}>
            <p style={{ color: "#94a3b8", fontSize: 17.5, marginBottom: 44, maxWidth: 480, margin: "0 auto 44px" }}>
              {tx(locale, { ar: "تواصل معنا وسنضع مشروعك في قائمة أعمالنا الناجحة القادمة", en: "Contact us and we'll add your project to our next success stories" })}
            </p>
          </Reveal>
          <Reveal direction="up" delay={200}>
            <Link href="/contact" style={{
              textDecoration: "none",
              background: "linear-gradient(135deg, var(--primary), var(--primary-dark))",
              color: "#fff", padding: "16px 48px",
              borderRadius: 14, fontWeight: 800, fontSize: 17,
              display: "inline-block",
              boxShadow: "0 8px 28px #dc2528",
              transition: "all 0.25s ease",
            }}
            className="portfolio-cta-btn"
            >
              {tx(locale, { ar: "ابدأ مشروعك الآن", en: "Start Your Project Now" })} →
            </Link>
          </Reveal>
        </div>
      </section>

      <style>{`
        @keyframes float-shape {
          from { transform: translateY(0) rotate(0deg); }
          to { transform: translateY(-20px) rotate(15deg); }
        }
        .client-logo-chip:hover { border-color: var(--primary) !important; color: var(--primary) !important; background: var(--primary-light) !important; }
        .portfolio-link:hover { gap: 10px !important; }
        .portfolio-cta-btn:hover { transform: translateY(-3px); box-shadow: 0 14px 40px rgba(99,102,241,0.5) !important; }
        @media (max-width: 500px) {
          .filter-strip { border-radius: 20px !important; width: 100%; }
          .portfolio-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
