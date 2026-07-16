"use client";

import { useState } from "react";
import Image from "next/image";
import Reveal from "./Reveal";
import Link from "next/link";
import { useLanguage } from "./LanguageContext";
import { pickLocalized, type Locale } from "../lib/i18n";

const workShowcase = {
  ar: {
    badge: " أحدث أعمالنا",
    title: "إبداع يتجاوز التوقعات",
    subtitle: "نماذج من مشاريعنا الناجحة في مختلف المجالات",
    viewAll: "عرض جميع الأعمال",
    projects: [
      {
        img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop",
        category: "الإعلان الرقمي",
        title: "حملة النخبة 2024",
        metric: "+240% مبيعات",
        color: "#d02225",
        size: "large",
      },
      {
        img: "https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=800&auto=format&fit=crop",
        category: "الهوية البصرية",
        title: "ركاز العقارية",
        metric: "هوية متكاملة",
        color: "#f59e0b",
        size: "small",
      },
      {
        img: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=800&auto=format&fit=crop",
        category: "السوشيال ميديا",
        title: "مطاعم جورميه",
        metric: "+45k متابع",
        color: "#10b981",
        size: "small",
      },
      {
        img: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop",
        category: "إنتاج الفيديو",
        title: "تطبيق مسار",
        metric: "3.5M مشاهدة",
        color: "#d02225",
        size: "large",
      },
    ],
  },
  en: {
    badge: " Our Work",
    title: "Projects Done by The Untold Story",
    subtitle: "Film, video, advertising, documentaries, and corporate content",
    viewAll: "Our Work",
    projects: [
      {
        img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop",
        category: "Digital Ads",
        title: "Al-Nokhba Campaign 2024",
        metric: "+240% Sales",
        color: "#d02225",
        size: "large",
      },
      {
        img: "https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=800&auto=format&fit=crop",
        category: "Brand Identity",
        title: "Rikaz Real Estate",
        metric: "Full Identity",
        color: "#f59e0b",
        size: "small",
      },
      {
        img: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=800&auto=format&fit=crop",
        category: "Social Media",
        title: "Gourmet Restaurants",
        metric: "+45k Followers",
        color: "#10b981",
        size: "small",
      },
      {
        img: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop",
        category: "Video Production",
        title: "Masar App",
        metric: "3.5M Views",
        color: "#d02225",
        size: "large",
      },
    ],
  },
};

function sanitizeBadge(s: string) {
  return s.replace(/[\u{2600}-\u{27BF}\u{1F000}-\u{1FFFF}]/gu, "").trim();
}

export default function WorkShowcase({ locale = "en", title }: { locale?: Locale | string; title?: string }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const { workShowcase: cmsShowcase } = useLanguage();
  const staticData = pickLocalized(workShowcase, locale as Locale);
  const d = cmsShowcase ?? staticData;
  const displayTitle = (title || d.title).replace(/\bdone\b/gi, "Done");
  const cleanBadge = sanitizeBadge(d.badge);

  return (
    <section style={{
      padding: "110px 24px",
      background: "var(--bg)",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 60, flexWrap: "wrap", gap: 24 }}>
          <div>
            {/* <Reveal direction="down">
              <span style={{
                display: "inline-block",
                background: "var(--primary-light)",
                color: "var(--primary)",
                fontWeight: 700,
                fontSize: 13,
                padding: "6px 20px",
                borderRadius: 0,
                marginBottom: 16,
              }}>
                {cleanBadge}
              </span>
            </Reveal> */}
            <Reveal direction="up" delay={100}>
              <h2 style={{
                fontSize: "clamp(2rem, 3.5vw, 2.8rem)",
                fontWeight: 900,
                color: "var(--text)",
                marginBottom: 12,
              }}>
                {displayTitle}
              </h2>
            </Reveal>
            <Reveal direction="up" delay={200}>
              <p style={{ color: "var(--text-muted)", fontSize: 16, maxWidth: 420 }}>
                {d.subtitle}
              </p>
            </Reveal>
          </div>
          <Reveal direction="left" delay={200}>
            <Link href="/portfolio" style={{
              textDecoration: "none",
              background: "var(--primary)",
              color: "#fff",
              padding: "13px 28px",
              borderRadius: 0,
              fontWeight: 700,
              fontSize: 15,
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              transition: "all 0.25s ease",
              boxShadow: "0 4px 16px rgba(99,102,241,0.25)",
            }}
            className="showcase-view-all"
            >
              {d.viewAll} →
            </Link>
          </Reveal>
        </div>

        {/* Bento Grid */}
      <div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(12, 1fr)",
    gridTemplateRows: "auto",
    gap: 24,
  }}
  className="work-bento"
>
  {d.projects.map((proj, i) => {
    // نفس توزيعك الأصلي للـ Grid
    const gridStyles = i === 0
      ? { gridColumn: "1 / 8", gridRow: "1" }
      : i === 1
      ? { gridColumn: "8 / 13", gridRow: "1" }
      : i === 2
      ? { gridColumn: "1 / 6", gridRow: "2" }
      : { gridColumn: "6 / 13", gridRow: "2" };

    return (
      <Reveal
        key={i}
        direction="up"
        delay={i * 100}
        style={{ ...gridStyles }}
        className={`bento-item`}
      >
        <div
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(null)}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            cursor: "pointer",
            height: "100%",
          }}
        >
          {/* الصورة بتأثير Hover ناعم */}
          <div style={{
            position: "relative",
            width: "100%",
            height: i < 2 ? 340 : 280, // قللت الارتفاع قليلاً عشان نسيب مساحة للكلام
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: hovered === i ? `0 20px 40px ${proj.color}20` : "0 4px 16px rgba(0,0,0,0.08)",
            transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
          }}>
            <Image
              src={proj.img}
              alt={proj.title}
              fill
              unoptimized
              style={{
                objectFit: "cover",
                transform: hovered === i ? "scale(1.05)" : "scale(1)",
                transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            />
          </div>

          {/* الكلام تحت الصورة بشكل عصري */}
          <div style={{ padding: "0 4px" }}>
            <span style={{
              color: proj.color,
              fontSize: 11,
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "1px",
              display: "block",
              marginBottom: "8px",
            }}>
              {proj.category}
            </span>
            <h3 style={{
              fontSize: 20,
              fontWeight: 800,
              color: "#111",
              marginBottom: "6px",
            }}>
              {proj.title}
            </h3>
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontSize: 14,
              fontWeight: 600,
              color: "#666",
            }}>
              <span style={{ color: "#000" }}>{proj.metric}</span>
            </div>
          </div>
        </div>
      </Reveal>
    );
  })}
</div>
      </div>

      <style>{`
        .showcase-view-all:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(99,102,241,0.4) !important;
        }
        @media (max-width: 900px) {
          .work-bento {
            display: flex !important;
            flex-direction: column !important;
            gap: 32px !important;
          }
          .bento-item {
            grid-column: span 12 / span 12 !important;
            grid-row: auto !important;
          }
        }
      `}</style>
    </section>
  );
}
