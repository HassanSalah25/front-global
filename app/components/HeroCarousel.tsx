"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "./LanguageContext";

export default function HeroCarousel() {
  const { t, heroSlides: cmsSlides } = useLanguage();

  const slides = useMemo(() => {
    if (cmsSlides && cmsSlides.length > 0) {
      return cmsSlides;
    }

    return [
      {
        img: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1400&auto=format&fit=crop",
        badge: t.heroData.badge,
        title: t.heroData.headline1,
        titleHighlight: t.heroData.headline2,
        subtitle: t.heroData.quoteBadge,
        desc: t.heroData.subtext,
        cta: t.heroData.cta1.label.replace(" →", "").replace(" ←", ""),
        ctaHref: t.heroData.cta1.href,
        ctaSecondary: t.heroData.cta2.label,
        ctaSecondaryHref: t.heroData.cta2.href,
        gradient: "linear-gradient(160deg, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.55) 50%, rgba(0,0,0,0.35) 100%)",
      },
      {
        img: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=1400&auto=format&fit=crop",
        badge: t.homeData.quoteBadge,
        title: t.homeData.quoteTitle.split(".")[0],
        titleHighlight: t.homeData.quoteTitle.split(".")[1]?.trim() || "",
        subtitle: t.homeData.servicesTitle,
        desc: t.homeData.servicesSubtext,
        cta: t.common.contactUs,
        ctaHref: "/contact",
        ctaSecondary: t.heroData.cta2.label,
        ctaSecondaryHref: "/portfolio",
        gradient: "linear-gradient(160deg, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.5) 100%)",
      },
    ];
  }, [cmsSlides, t]);

  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState<"next" | "prev">("next");

  const goTo = useCallback((index: number, dir: "next" | "prev") => {
    if (isAnimating) return;
    setIsAnimating(true);
    setDirection(dir);
    setTimeout(() => {
      setCurrent(index);
      setIsAnimating(false);
    }, 600);
  }, [isAnimating]);

  const next = useCallback(() => {
    goTo((current + 1) % slides.length, "next");
  }, [current, goTo, slides.length]);

  const prev = useCallback(() => {
    goTo((current - 1 + slides.length) % slides.length, "prev");
  }, [current, goTo, slides.length]);

  useEffect(() => {
    const timer = setInterval(next, 5500);
    return () => clearInterval(timer);
  }, [next]);

  const slide = slides[current];

  return (
    <section style={{ padding: "24px", position: "relative" }}>
      <div style={{
        maxWidth: 1280,
        margin: "0 auto",
        borderRadius: 0,
        overflow: "hidden",
        height: "clamp(560px, 78vh, 760px)",
        position: "relative",
        boxShadow: "0 32px 80px rgba(0,0,0,0.2)",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          transform: isAnimating
            ? direction === "next" ? "scale(1.08)" : "scale(0.95)"
            : "scale(1)",
          transition: "transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
        }}>
          <Image
            src={slide.img}
            alt={slide.title}
            fill
            unoptimized
            style={{ objectFit: "cover" }}
            priority
          />
        </div>

        <div style={{
          position: "absolute", inset: 0,
          background: slide.gradient,
          opacity: isAnimating ? 0.6 : 1,
          transition: "opacity 0.6s ease, background 0.8s ease",
        }} />

        <div className="hero-carousel-overlay">
          <div className="hero-carousel-content">
          {/* <div className="hero-carousel-badge" style={{
            opacity: isAnimating ? 0 : 1,
            transform: isAnimating ? "translateY(-16px)" : "translateY(0)",
            transition: "all 0.5s ease 0.1s",
          }}>
            {slide.badge}
          </div> */}

          <h2 className="hero-carousel-title" style={{
            opacity: isAnimating ? 0 : 1,
            transform: isAnimating ? "translateY(24px)" : "translateY(0)",
            transition: "all 0.55s ease 0.15s",
          }}>
            {slide.title}{" "}
            {slide.titleHighlight && (
              <span style={{
                background: "linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.75) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
                {slide.titleHighlight}
              </span>
            )}
          </h2>

          <h3 className="hero-carousel-subtitle" style={{
            opacity: isAnimating ? 0 : 1,
            transform: isAnimating ? "translateY(20px)" : "translateY(0)",
            transition: "all 0.55s ease 0.22s",
          }}>
            {slide.subtitle}
          </h3>

          <p className="hero-carousel-desc" style={{
            opacity: isAnimating ? 0 : 1,
            transform: isAnimating ? "translateY(16px)" : "translateY(0)",
            transition: "all 0.55s ease 0.3s",
          }}>
            {slide.desc}
          </p>

          <div className="hero-carousel-ctas" style={{
            opacity: isAnimating ? 0 : 1,
            transform: isAnimating ? "translateY(12px)" : "translateY(0)",
            transition: "all 0.55s ease 0.38s",
          }}>
            <Link href={slide.ctaHref} className="carousel-btn-primary" style={{
              textDecoration: "none",
              background: "#fff",
              color: "#1e1b4b",
              padding: "14px 32px",
              borderRadius: 0,
              fontWeight: 800,
              fontSize: 15.5,
              display: "inline-block",
              boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
              transition: "all 0.25s ease",
            }}>
              {slide.cta} →
            </Link>
            <Link href={slide.ctaSecondaryHref} className="carousel-btn-secondary" style={{
              textDecoration: "none",
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(12px)",
              color: "#fff",
              padding: "14px 32px",
              borderRadius: 0,
              fontWeight: 700,
              fontSize: 15.5,
              border: "2px solid rgba(255,255,255,0.35)",
              display: "inline-block",
              transition: "all 0.25s ease",
            }}>
              {slide.ctaSecondary}
            </Link>
          </div>
          </div>
        </div>

        <div style={{
          position: "absolute",
          bottom: 32,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: 10,
          alignItems: "center",
        }}>
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i, i > current ? "next" : "prev")}
              style={{
                width: i === current ? 32 : 10,
                height: 10,
                borderRadius: 0,
                background: i === current ? "#fff" : "rgba(255,255,255,0.45)",
                border: "none",
                cursor: "pointer",
                padding: 0,
                transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            />
          ))}
        </div>

        <button onClick={prev} className="carousel-nav-btn" style={{
          position: "absolute", top: "50%", left: 24,
          transform: "translateY(-50%)",
          width: 52, height: 52,
          background: "rgba(255,255,255,0.18)",
          backdropFilter: "blur(12px)",
          border: "1.5px solid rgba(255,255,255,0.3)",
          borderRadius: "0%",
          color: "#fff",
          fontSize: 22,
          cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all 0.25s ease",
        }}>
          ‹
        </button>
        <button onClick={next} className="carousel-nav-btn" style={{
          position: "absolute", top: "50%", right: 24,
          transform: "translateY(-50%)",
          width: 52, height: 52,
          background: "rgba(255,255,255,0.18)",
          backdropFilter: "blur(12px)",
          border: "1.5px solid rgba(255,255,255,0.3)",
          borderRadius: "0%",
          color: "#fff",
          fontSize: 22,
          cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all 0.25s ease",
        }}>
          ›
        </button>

        <div style={{
          position: "absolute",
          bottom: 0, left: 0,
          height: 3,
          background: "rgba(255,255,255,0.25)",
          width: "100%",
        }}>
          <div style={{
            height: "100%",
            background: "#fff",
            width: `${((current + 1) / slides.length) * 100}%`,
            transition: "width 0.5s ease",
          }} />
        </div>
      </div>

      <style>{`
        .hero-carousel-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: clamp(24px, 4vw, 64px);
          padding-bottom: clamp(64px, 10vw, 88px);
          color: #fff;
          overflow: hidden;
        }
        .hero-carousel-content {
          width: 100%;
          max-width: min(680px, 62%);
          flex-shrink: 1;
          min-width: 0;
        }
        .hero-carousel-badge {
          display: inline-block;
          background: rgba(255,255,255,0.18);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.3);
          padding: 8px 22px;
          border-radius: 0;
          font-size: 13px;
          font-weight: 700;
          margin-bottom: clamp(12px, 2vw, 20px);
          max-width: 100%;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }
        .hero-carousel-title {
          font-size: clamp(1.35rem, 2.6vw, 2.5rem);
          font-weight: 900;
          line-height: 1.2;
          margin: 0 0 clamp(6px, 1.2vw, 10px);
          max-width: 100%;
          word-wrap: break-word;
          overflow-wrap: break-word;
          text-wrap: balance;
        }
        .hero-carousel-subtitle {
          font-size: clamp(0.95rem, 1.8vw, 1.35rem);
          font-weight: 600;
          color: rgba(255,255,255,0.85);
          margin: 0 0 clamp(8px, 1.5vw, 14px);
          max-width: 100%;
          line-height: 1.35;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }
        .hero-carousel-desc {
          font-size: clamp(13px, 1.5vw, 16px);
          color: rgba(255,255,255,0.8);
          line-height: 1.65;
          margin: 0 0 clamp(16px, 2.5vw, 24px);
          max-width: 100%;
          word-wrap: break-word;
          overflow-wrap: break-word;
          padding-left:30px;
        }
        .hero-carousel-ctas {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }
        @media (max-width: 768px) {
          .hero-carousel-content {
            max-width: 100%;
          }
          .hero-carousel-title {
            font-size: clamp(1.25rem, 5.5vw, 1.85rem);
          }
          .hero-carousel-overlay {
            justify-content: flex-end;
            padding-bottom: clamp(72px, 14vw, 96px);
          }
        }
        .carousel-btn-primary:hover {
          transform: translateY(-3px) scale(1.03) !important;
          box-shadow: 0 14px 36px rgba(0,0,0,0.35) !important;
        }
        .carousel-btn-secondary:hover {
          background: rgba(255,255,255,0.28) !important;
          transform: translateY(-3px) !important;
        }
        .carousel-nav-btn:hover {
          background: rgba(255,255,255,0.35) !important;
          transform: translateY(-50%) scale(1.1) !important;
        }
        @media (max-width: 640px) {
          .carousel-nav-btn { display: none !important; }
        }
      `}</style>
    </section>
  );
}
