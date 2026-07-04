"use client";

import { useState } from "react";
import Reveal from "./Reveal";
import { pickLocalized, type Locale } from "../lib/i18n";

// Cinema-themed SVG icons (realistic silhouettes)
const ClapperboardIcon: React.FC<{ size?: number; style?: any }> = ({ size = 64, style }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" style={style} xmlns="http://www.w3.org/2000/svg">
    <rect x="6" y="18" width="52" height="34" rx="3" fill="currentColor" stroke="currentColor" strokeWidth="2.5" />
    <path d="M8 20L26 8l30 10-18 12" fill="#fff" opacity="0.06" />
    <g fill="#fff">
      <rect x="10" y="26" width="12" height="5" rx="1" />
      <rect x="24" y="26" width="12" height="5" rx="1" />
    </g>
  </svg>
);

const TripodIcon: React.FC<{ size?: number; style?: any }> = ({ size = 64, style }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" style={style} xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="20" r="12" fill="currentColor" stroke="currentColor" strokeWidth="2.5" />
    <path d="M22 50L30 26" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    <path d="M42 50L34 26" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    <path d="M18 60L28 48" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    <path d="M46 60L36 48" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

const DroneIcon: React.FC<{ size?: number; style?: any }> = ({ size = 64, style }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" style={style} xmlns="http://www.w3.org/2000/svg">
    <rect x="18" y="26" width="28" height="12" rx="4" fill="currentColor" stroke="currentColor" strokeWidth="2.5" />
    <circle cx="10" cy="18" r="6" fill="#fff" stroke="currentColor" strokeWidth="2" />
    <circle cx="54" cy="18" r="6" fill="#fff" stroke="currentColor" strokeWidth="2" />
    <circle cx="10" cy="46" r="6" fill="#fff" stroke="currentColor" strokeWidth="2" />
    <circle cx="54" cy="46" r="6" fill="#fff" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const LensIcon: React.FC<{ size?: number; style?: any }> = ({ size = 64, style }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" style={style} xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="22" fill="currentColor" stroke="currentColor" strokeWidth="2.5" />
    <circle cx="32" cy="32" r="9" fill="#fff" />
    <circle cx="32" cy="26" r="3" fill="#fff" opacity="0.6" />
  </svg>
);

const awardsData = {
  ar: {
    badge: "Trusted by the Titans",
    title: "موثوق من قبل عمالقة الصناعة",
    subtitle: "علامات ومنصات وقنوات ومؤسسات في المنطقة وحول العالم",
    awards: [
      { icon: "Clapperboard", title: "أفلام وفيديو", org: "دورة إنتاج كاملة", year: "MENA", color: "#f59e0b" },
      { icon: "Tripod", title: "إنتاج تجاري", org: "إعلانات ومحتوى العلامات", year: "Global", color: "#6366f1" },
      { icon: "Drone", title: "إنتاج على أرض الواقع", org: "مصر ودبي وجدة", year: "3+ مكاتب", color: "#10b981" },
      { icon: "Lens", title: "ملكية فكرية أصلية", org: "قصص مصممة للسفر", year: "داخلي", color: "#ef4444" },
    ],
  },
  en: {
    badge: "Trusted by the Titans",
    title: "Trusted by the Titans",
    subtitle: "Brands, platforms, broadcasters, and institutions across MENA and worldwide",
    awards: [
      { icon: "Clapperboard", title: "Film & Video", org: "Full production cycle", year: "MENA", color: "#f59e0b" },
      { icon: "Tripod", title: "Commercial Production", org: "Advertising & branded content", year: "Global", color: "#6366f1" },
      { icon: "Drone", title: "On-Ground Production", org: "Egypt, Dubai & Jeddah", year: "3+ Offices", color: "#10b981" },
      { icon: "Lens", title: "Original IP", org: "Stories designed to travel", year: "In-house", color: "#ef4444" },
    ],
  },
};

const iconMap: { [key: string]: React.ComponentType<any> } = {
  Clapperboard: ClapperboardIcon,
  Tripod: TripodIcon,
  Drone: DroneIcon,
  Lens: LensIcon,
};

export default function AwardsSection({ locale = "en" }: { locale?: Locale | string }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const d = pickLocalized(awardsData, locale as Locale);

  return (
    <section style={{
      padding: "110px 24px",
      background: "linear-gradient(180deg, #050505 0%, #0b0b0b 100%)",
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
        }}>
          {d.awards.map((award, i) => (
            <Reveal key={i} direction="up" delay={i * 100}>
              <div
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  background: hovered === i ? "rgba(255,255,255,0.035)" : "rgba(255,255,255,0.02)",
                  border: `1.5px solid ${hovered === i ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.06)'}`,
                  borderRadius: 8,
                  padding: "36px 28px",
                  textAlign: "center",
                  transition: "all 0.36s cubic-bezier(0.16, 1, 0.3, 1)",
                  transform: hovered === i ? "translateY(-8px)" : "none",
                  backdropFilter: "blur(6px)",
                  cursor: "default",
                }}
              >
                <div style={{
                  fontSize: 52,
                  marginBottom: 16,
                  display: "inline-block",
                  transform: hovered === i ? "scale(1.08) translateY(-4px)" : "scale(1)",
                  transition: "transform 0.36s ease",
                }}>
                  {(() => {
                    const Icon = iconMap[award.icon as string];
                    return Icon ? (
                      <Icon
                        size={48}
                        style={{
                          display: "block",
                          color: "#ffffff",
                          transition: "filter 0.36s ease, transform 0.36s ease",
                          filter: hovered === i ? 'drop-shadow(0 12px 30px rgba(255,255,255,0.08))' : 'none',
                        }}
                      />
                    ) : null;
                  })()}
                </div>
                <h3 style={{ fontWeight: 800, fontSize: 16.5, color: "#fff", marginBottom: 8 }}>
                  {award.title}
                </h3>
                <p style={{ color: "#bfc7cc", fontSize: 13.5, marginBottom: 12 }}>
                  {award.org}
                </p>
                <span style={{
                  background: "rgba(255,255,255,0.03)",
                  color: "#fff",
                  border: `1px solid rgba(255,255,255,0.06)`,
                  padding: "4px 14px",
                  borderRadius: 4,
                  fontSize: 12,
                  fontWeight: 700,
                }}>
                  {award.year}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
