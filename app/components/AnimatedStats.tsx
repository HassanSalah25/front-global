"use client";

import { useState, useEffect, useRef } from "react";
import React from "react";
import { useLanguage } from "./LanguageContext";
import { getNumberLocale, pickLocalized, tx, type Locale } from "../lib/i18n";

interface CounterProps {
  end: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  locale?: Locale;
}

function AnimatedCounter({ end, suffix = "", prefix = "", duration = 2000, locale = "en" }: CounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started) {
        setStarted(true);
        obs.unobserve(el);
      }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let startTime: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, end, duration]);

  const numberLocale = getNumberLocale(locale);
  return <span ref={ref}>{prefix}{count.toLocaleString(numberLocale)}{suffix}</span>;
}

// Refined cinema SVG icons (professional, monochrome)
const Clapperboard: React.FC<{ size?: number; style?: any }> = ({ size = 52, style }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" style={style} xmlns="http://www.w3.org/2000/svg">
    <rect x="6" y="18" width="52" height="30" rx="4" fill="currentColor" />
    <g transform="translate(0,0)">
      <path d="M8 20 L26 8 L36 18 L44 10 L56 20" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.95" />
      <rect x="10" y="28" width="40" height="6" rx="2" fill="#ffffff" opacity="0.06" />
      <path d="M12 30h8M24 30h8M36 30h8" stroke="#ffffff" strokeWidth="1.4" strokeLinecap="round" opacity="0.6" />
    </g>
  </svg>
);

const CameraRig: React.FC<{ size?: number; style?: any }> = ({ size = 52, style }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" style={style} xmlns="http://www.w3.org/2000/svg">
    <rect x="10" y="20" width="34" height="18" rx="3" fill="currentColor" />
    <circle cx="46" cy="29" r="6" fill="#fff" opacity="0.96" />
    <rect x="12" y="14" width="18" height="6" rx="2" fill="#fff" opacity="0.06" />
    <path d="M20 38 L16 46" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const Crane: React.FC<{ size?: number; style?: any }> = ({ size = 52, style }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" style={style} xmlns="http://www.w3.org/2000/svg">
    <path d="M8 52 L28 20 L52 18" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="44" y="14" width="12" height="10" rx="2" fill="currentColor" />
    <circle cx="50" cy="19" r="3" fill="#fff" />
  </svg>
);

const Aperture: React.FC<{ size?: number; style?: any }> = ({ size = 52, style }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" style={style} xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="20" fill="currentColor" />
    <g fill="#ffffff" opacity="0.96">
      <path d="M32 14 L40 28 L32 32 L24 28 Z" />
      <path d="M32 50 L24 36 L32 32 L40 36 Z" />
      <path d="M14 32 L28 24 L32 32 L28 40 Z" />
      <path d="M50 32 L36 24 L32 32 L36 40 Z" />
    </g>
  </svg>
);

const statsData = {
  ar: [
    { iconName: "Clapperboard", value: 50, suffix: "+", label: "عملاء راضون", sublabel: "90% عمل متكرر", bg: "transparent" },
    { iconName: "CameraRig", value: 3, suffix: "+", label: "مكاتب في المنطقة", sublabel: "مصر ودبي وجدة", bg: "transparent" },
    { iconName: "Crane", value: 90, suffix: "%", label: "معدل العمل المتكرر", sublabel: "شراكات موثوقة", bg: "transparent" },
    { iconName: "Aperture", value: 360, suffix: "°", label: "دورة إنتاج متكاملة", sublabel: "من التخطيط للتسليم", bg: "transparent" },
  ],
  en: [
    { iconName: "Clapperboard", value: 50, suffix: "+", label: "Satisfied clients", sublabel: "90% repeat business", bg: "transparent" },
    { iconName: "CameraRig", value: 3, suffix: "+", label: "Offices across MENA", sublabel: "Egypt, Dubai & Jeddah", bg: "transparent" },
    { iconName: "Crane", value: 90, suffix: "%", label: "Repeat business rate", sublabel: "Trusted partnerships", bg: "transparent" },
    { iconName: "Aperture", value: 360, suffix: "°", label: "Full production cycle", sublabel: "Planning to delivery", bg: "transparent" },
  ],
};

const iconMap: { [key: string]: React.ComponentType<any> } = {
  Clapperboard,
  CameraRig,
  Crane,
  Aperture,
};

export default function AnimatedStats() {
  const { locale } = useLanguage();
  const currentStats = pickLocalized(statsData, locale);

  return (
    <section style={{
      padding: "100px 24px",
      background: "linear-gradient(180deg, #050505 0%, #0b0b0b 100%)",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Background decoration */}
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: 600, height: 600,
        background: "radial-gradient(circle, rgba(255, 255, 255, 0.05) 0%, transparent 70%)",
        borderRadius: "0%",
        pointerEvents: "none",
      }} />

      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 72 }}>
          <span style={{
            display: "inline-block",
            background: "#0a0a0a",
            color: "#fff",
            fontWeight: 700,
            fontSize: 13,
            padding: "6px 20px",
            borderRadius: 0,
            marginBottom: 20,
            borderLeft: "3px solid var(--primary)",
          }}>
            {tx(locale, { en: "🎬 The Untold Story", ar: "🎬 The Untold Story" })}
          </span>
          <h2 style={{
            fontSize: "clamp(2rem, 3.5vw, 2.8rem)",
            fontWeight: 900,
            color: "#fff",
            marginBottom: 16,
          }}>
            {tx(locale, { en: "Production by the Numbers", ar: "إنجازاتنا بالأرقام" })}
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: 16.5, maxWidth: 480, margin: "0 auto" }}>
            {tx(locale, {
              en: "Offices in Egypt, Dubai, and Jeddah — serving MENA and clients worldwide",
              ar: "مكاتب في مصر ودبي وجدة — نخدم المنطقة والعملاء حول العالم",
            })}
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 28,
        }}>
          {currentStats.map((stat, i) => {
            const IconComponent = iconMap[stat.iconName];
            return (
              <div key={i} className="stat-card" style={{
                background: "rgba(255,255,255,0.02)",
                borderRadius: 8,
                padding: "44px 32px",
                textAlign: "center",
                border: `1.5px solid rgba(255,255,255,0.06)`,
                position: "relative",
                overflow: "hidden",
                transition: "all 0.36s cubic-bezier(0.16, 1, 0.3, 1)",
                cursor: "default",
              }}>
                {/* Glow orb (subtle white) */}
                <div style={{
                  position: "absolute",
                  bottom: -30, right: -30,
                  width: 100, height: 100,
                  background: `radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 60%)`,
                  borderRadius: "50%",
                  pointerEvents: "none",
                }} />

                {/* Icon */}
                <div style={{
                  display: "inline-block",
                  padding: 14,
                  background: "transparent",
                  borderRadius: 12,
                  marginBottom: 20,
                }}>
                  {IconComponent && (
                    <IconComponent size={44} style={{ color: "#ffffff", filter: "drop-shadow(0 8px 20px rgba(255,255,255,0.04))" }} />
                  )}
                </div>

                {/* Value */}
                <div style={{ marginBottom: 14, position: "relative", zIndex: 1 }}>
                  <div style={{
                    fontSize: "2.6rem",
                    fontWeight: 800,
                    color: "#ffffff",
                    lineHeight: 1,
                  }}>
                    <AnimatedCounter
                      end={stat.value}
                      suffix={stat.suffix}
                      duration={2000}
                      locale={locale}
                    />
                  </div>
                </div>

                {/* Label */}
                <p style={{
                  fontSize: "1.125rem",
                  fontWeight: 700,
                  color: "#fff",
                  margin: "8px 0",
                  position: "relative",
                  zIndex: 1,
                }}>
                  {stat.label}
                </p>

                {/* Sublabel */}
                <p style={{
                  fontSize: "0.875rem",
                  color: "#aab2b8",
                  position: "relative",
                  zIndex: 1,
                }}>
                  {stat.sublabel}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .stat-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 50px rgba(0,0,0,0.12);
        }
      `}</style>
    </section>
  );
}
