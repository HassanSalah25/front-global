"use client";

import { useState, useEffect, useRef } from "react";
import { Trophy, Users, TrendingUp, Star } from "lucide-react";
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

const statsData = {
  ar: [
    { iconName: "Trophy", value: 50, suffix: "+", label: "عميل راضٍ", sublabel: "90% عمل متكرر", color: "#e9292c", bg: "linear-gradient(135deg, #fee3e5, #fcc4c6)" },
    { iconName: "Users", value: 3, suffix: "+", label: "مكاتب في المنطقة", sublabel: "مصر ودبي وجدة", color: "#10b981", bg: "linear-gradient(135deg, #ecfdf5, #d1fae5)" },
    { iconName: "TrendingUp", value: 90, suffix: "%", label: "معدل العمل المتكرر", sublabel: "شراكات موثوقة", color: "#f59e0b", bg: "linear-gradient(135deg, #fffbeb, #fef3c7)" },
    { iconName: "Star", value: 360, suffix: "°", label: "دورة إنتاج متكاملة", sublabel: "من التخطيط للتسليم", color: "#8b5cf6", bg: "linear-gradient(135deg, #f5f3ff, #ede9fe)" },
  ],
  en: [
    { iconName: "Trophy", value: 50, suffix: "+", label: "Satisfied clients", sublabel: "90% repeat business", color: "#e9292c", bg: "linear-gradient(135deg, #fee3e5, #fcc4c6)" },
    { iconName: "Users", value: 3, suffix: "+", label: "Offices across MENA", sublabel: "Egypt, Dubai & Jeddah", color: "#10b981", bg: "linear-gradient(135deg, #ecfdf5, #d1fae5)" },
    { iconName: "TrendingUp", value: 90, suffix: "%", label: "Repeat business rate", sublabel: "Trusted partnerships", color: "#f59e0b", bg: "linear-gradient(135deg, #fffbeb, #fef3c7)" },
    { iconName: "Star", value: 360, suffix: "°", label: "Full production cycle", sublabel: "Planning to delivery", color: "#8b5cf6", bg: "linear-gradient(135deg, #f5f3ff, #ede9fe)" },
  ],
};

const iconMap: { [key: string]: React.ComponentType<any> } = {
  Trophy,
  Users,
  TrendingUp,
  Star,
};

export default function AnimatedStats() {
  const { locale } = useLanguage();
  const currentStats = pickLocalized(statsData, locale);

  return (
    <section style={{
      padding: "100px 24px",
      background: "var(--bg)",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Background decoration */}
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: 600, height: 600,
        background: "radial-gradient(circle, rgba(233,41,44,0.05) 0%, transparent 70%)",
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
            color: "var(--text)",
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
                background: stat.bg,
                borderRadius: 0,
                padding: "44px 32px",
                textAlign: "center",
                border: `1.5px solid ${stat.color}22`,
                position: "relative",
                overflow: "hidden",
                transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                cursor: "default",
              }}>
                {/* Glow orb */}
                <div style={{
                  position: "absolute",
                  bottom: -30, right: -30,
                  width: 100, height: 100,
                  background: `radial-gradient(circle, ${stat.color}25, transparent)`,
                  borderRadius: "0%",
                }} />

                {/* Icon */}
                <div style={{
                  display: "inline-block",
                  padding: 12,
                  background: "#fff",
                  borderRadius: 0,
                  marginBottom: 20,
                  boxShadow: `0 4px 12px ${stat.color}15`,
                }}>
                  {IconComponent && (
                    <IconComponent size={36} style={{ color: stat.color }} strokeWidth={1.5} />
                  )}
                </div>

                {/* Value */}
                <div style={{ marginBottom: 14, position: "relative", zIndex: 1 }}>
                  <div style={{
                    fontSize: "2.75rem",
                    fontWeight: 800,
                    color: stat.color,
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
                  color: "var(--text)",
                  margin: "8px 0",
                  position: "relative",
                  zIndex: 1,
                }}>
                  {stat.label}
                </p>

                {/* Sublabel */}
                <p style={{
                  fontSize: "0.875rem",
                  color: "var(--text-muted)",
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
