"use client";

import { useState } from "react";
import Image from "next/image";
import Reveal from "./Reveal";
import { pickLocalized, type Locale } from "../lib/i18n";

const awardsData = {
  ar: {
    badge: "Trusted by the Titans",
    title: "موثوق من قبل عمالقة الصناعة",
    subtitle: "علامات ومنصات وقنوات ومؤسسات في المنطقة وحول العالم",
    awards: [
      { icon: "🎬", title: "أفلام وفيديو", org: "دورة إنتاج كاملة", year: "MENA", color: "#f59e0b" },
      { icon: "📺", title: "إنتاج تجاري", org: "إعلانات ومحتوى العلامات", year: "Global", color: "#6366f1" },
      { icon: "🌍", title: "إنتاج على أرض الواقع", org: "مصر ودبي وجدة", year: "3+ مكاتب", color: "#10b981" },
      { icon: "✨", title: "ملكية فكرية أصلية", org: "قصص مصممة للسفر", year: "داخلي", color: "#ef4444" },
    ],
    featuredTitle: "حيث تلتقي القصة بالتنفيذ",
    testimonial: "\"ميزانيات متوقعة. نتائج متميزة. The Untold Story تقدّم دورة الإنتاج الكاملة بتنفيذ منضبط.\"",
    testimonialName: "Khaled Bendary",
    testimonialRole: "CEO, The Untold Story",
    testimonialImg: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&auto=format&fit=crop",
  },
  en: {
    badge: "Trusted by the Titans",
    title: "Trusted by the Titans",
    subtitle: "Brands, platforms, broadcasters, and institutions across MENA and worldwide",
    awards: [
      { icon: "🎬", title: "Film & Video", org: "Full production cycle", year: "MENA", color: "#f59e0b" },
      { icon: "📺", title: "Commercial Production", org: "Advertising & branded content", year: "Global", color: "#6366f1" },
      { icon: "🌍", title: "On-Ground Production", org: "Egypt, Dubai & Jeddah", year: "3+ Offices", color: "#10b981" },
      { icon: "✨", title: "Original IP", org: "Stories designed to travel", year: "In-house", color: "#ef4444" },
    ],
    featuredTitle: "Where story meets execution",
    testimonial: "\"Predictable budgets. Premium results. The Untold Story delivers the full production cycle with disciplined execution.\"",
    testimonialName: "Khaled Bendary",
    testimonialRole: "CEO, The Untold Story",
    testimonialImg: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&auto=format&fit=crop",
  },
};

export default function AwardsSection({ locale = "en" }: { locale?: Locale | string }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const d = pickLocalized(awardsData, locale as Locale);

  return (
    <section style={{
      padding: "110px 24px",
      background: "linear-gradient(160deg, #dc2528 0%, #000000 50%, #000000e0 100%)",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Ambient glows */}
      <div style={{ position: "absolute", top: -100, right: -100, width: 400, height: 400, background: "radial-gradient(circle, rgba(99,102,241,0.15), transparent)", borderRadius: "0%", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: -80, left: -80, width: 350, height: 350, background: "radial-gradient(circle, rgba(245,158,11,0.1), transparent)", borderRadius: "0%", pointerEvents: "none" }} />

      <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 72 }}>
          <Reveal direction="down">
            <span style={{
              display: "inline-block",
              background: "rgba(0, 0, 0, 0.2)",
              border: "1px solid rgba(0, 0, 0, 0.4)",
              color: "#ffffff",
              fontWeight: 700,
              fontSize: 13,
              padding: "7px 22px",
              borderRadius: 0,
              marginBottom: 20,
            }}>
              {d.badge}
            </span>
          </Reveal>
          <Reveal direction="up" delay={100}>
            <h2 style={{
              fontSize: "clamp(2rem, 3.5vw, 2.8rem)",
              fontWeight: 900,
              color: "#fff",
              marginBottom: 16,
            }}>
              {d.title}
            </h2>
          </Reveal>
          <Reveal direction="up" delay={200}>
            <p style={{ color: "#94a3b8", fontSize: 16.5, maxWidth: 480, margin: "0 auto" }}>
              {d.subtitle}
            </p>
          </Reveal>
        </div>

        {/* Awards Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 24,
          marginBottom: 72,
        }}>
          {d.awards.map((award, i) => (
            <Reveal key={i} direction="up" delay={i * 100}>
              <div
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  background: hovered === i
                    ? `linear-gradient(135deg, ${award.color}22, ${award.color}11)`
                    : "rgba(255,255,255,0.04)",
                  border: `1.5px solid ${hovered === i ? award.color + "55" : "rgba(255,255,255,0.1)"}`,
                  borderRadius: 0,
                  padding: "36px 28px",
                  textAlign: "center",
                  transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                  transform: hovered === i ? "translateY(-8px)" : "none",
                  backdropFilter: "blur(10px)",
                  cursor: "default",
                }}
              >
                <div style={{
                  fontSize: 52,
                  marginBottom: 16,
                  display: "inline-block",
                  filter: `drop-shadow(0 0 12px ${award.color}80)`,
                  transform: hovered === i ? "scale(1.15) rotate(-5deg)" : "scale(1)",
                  transition: "transform 0.4s ease",
                }}>
                  {award.icon}
                </div>
                <h3 style={{ fontWeight: 800, fontSize: 16.5, color: "#fff", marginBottom: 8 }}>
                  {award.title}
                </h3>
                <p style={{ color: "#94a3b8", fontSize: 13.5, marginBottom: 12 }}>
                  {award.org}
                </p>
                <span style={{
                  background: `${award.color}25`,
                  color: award.color,
                  border: `1px solid ${award.color}40`,
                  padding: "4px 14px",
                  borderRadius: 0,
                  fontSize: 12,
                  fontWeight: 700,
                }}>
                  {award.year}
                </span>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Featured Testimonial */}
        <Reveal direction="up" delay={200}>
          <div style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 0,
            padding: "56px 48px",
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gap: 40,
            alignItems: "center",
            backdropFilter: "blur(12px)",
          }}
          className="award-testimonial"
          >
            <div>
              <div style={{ fontSize: 40, color: "#6366f1", marginBottom: 20, lineHeight: 1 }}>{'"'}</div>
              <p style={{
                color: "#e2e8f0",
                fontSize: "clamp(16px, 2.5vw, 20px)",
                lineHeight: 1.9,
                fontStyle: "italic",
                marginBottom: 32,
              }}>
                {d.testimonial}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <Image
                  src={d.testimonialImg}
                  alt={d.testimonialName}
                  width={56}
                  height={56}
                  unoptimized
                  style={{ borderRadius: "0%", border: "2px solid rgba(99,102,241,0.5)", objectFit: "cover" }}
                />
                <div>
                  <div style={{ fontWeight: 800, fontSize: 15.5, color: "#fff" }}>{d.testimonialName}</div>
                  <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 3 }}>{d.testimonialRole}</div>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }} className="award-stars">
              {[1,2,3,4,5].map(s => (
                <div key={s} style={{ fontSize: 28, color: "#f59e0b", animation: `pulse-star 1.5s ease-in-out infinite`, animationDelay: `${s * 0.1}s` }}>★</div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>

      <style>{`
        @keyframes pulse-star {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.15); opacity: 0.8; }
        }
        @media (max-width: 768px) {
          .award-testimonial {
            grid-template-columns: 1fr !important;
            padding: 32px 24px !important;
          }
          .award-stars {
            flex-direction: row !important;
            justify-content: center !important;
            margin-top: 16px !important;
          }
        }
      `}</style>
    </section>
  );
}
