"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "./LanguageContext";
import { tx } from "../lib/i18n";

type PreloaderProps = {
  visible: boolean;
  onExitComplete?: () => void;
};

export default function Preloader({ visible, onExitComplete }: PreloaderProps) {
  const { locale, t, cmsReady } = useLanguage();
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"loading" | "exit">("loading");
  const [mounted, setMounted] = useState(false);
  const [minTimeDone, setMinTimeDone] = useState(false);

  const siteName = t.siteConfig?.name || "The Untold Story";
  const tagline = t.siteConfig?.tagline || tx(locale, {
    en: "Film & Video Production Studio",
    ar: "استوديو إنتاج أفلام وفيديو",
  });

  useEffect(() => {
    setMounted(true);
    const timer = window.setTimeout(() => setMinTimeDone(true), 800);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const target = cmsReady ? 100 : Math.min(92, 18 + elapsed / 28);
      setProgress((prev) => {
        const next = prev + (target - prev) * 0.12;
        return next >= 99.5 ? 100 : next;
      });
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [mounted, cmsReady]);

  useEffect(() => {
    if (!visible || !cmsReady || !minTimeDone || progress < 99) return;

    const timer = window.setTimeout(() => {
      setPhase("exit");
      window.setTimeout(() => onExitComplete?.(), 700);
    }, 350);

    return () => window.clearTimeout(timer);
  }, [visible, cmsReady, minTimeDone, progress, onExitComplete]);

  if (!mounted || !visible) return null;

  const exiting = phase === "exit";

  return (
    <div
      aria-hidden={exiting}
      aria-live="polite"
      aria-busy={!exiting}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0a0a0a",
        opacity: exiting ? 0 : 1,
        visibility: exiting ? "hidden" : "visible",
        transition: "opacity 0.65s ease, visibility 0.65s ease",
        overflow: "hidden",
      }}
    >
      <div
        className="preloader-grid"
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.55,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 50% 42%, rgba(233, 41, 44, 0.14) 0%, transparent 48%), radial-gradient(circle at 15% 85%, rgba(233, 41, 44, 0.08) 0%, transparent 35%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 28,
          padding: "0 24px",
          transform: exiting ? "translateY(-18px) scale(0.98)" : "translateY(0) scale(1)",
          transition: "transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <div style={{ position: "relative", width: 120, height: 120 }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              border: "1px solid rgba(233, 41, 44, 0.25)",
              animation: "preloader-ring 2.4s ease-in-out infinite",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 10,
              borderRadius: "50%",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              animation: "preloader-ring 2.4s ease-in-out infinite reverse",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              animation: "preloader-pulse 2s ease-in-out infinite",
            }}
          >
            <img
              src="/black.png"
              alt={siteName}
              style={{
                width: 72,
                height: "auto",
                filter: "brightness(0) invert(1)",
                objectFit: "contain",
              }}
            />
          </div>
        </div>

        <div style={{ textAlign: "center" }}>
          <h1
            style={{
              color: "#fff",
              fontSize: "clamp(1.35rem, 3vw, 1.85rem)",
              fontWeight: 900,
              letterSpacing: "-0.03em",
              marginBottom: 8,
              animation: "fadeUp 0.8s ease both",
            }}
          >
            {siteName}
          </h1>
          <p
            style={{
              color: "#94a3b8",
              fontSize: 14,
              fontWeight: 500,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              animation: "fadeUp 0.8s ease 0.12s both",
            }}
          >
            {tagline}
          </p>
        </div>

        <div style={{ width: "min(280px, 72vw)", marginTop: 8 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 10,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#64748b",
            }}
          >
            <span>{tx(locale, { en: "Loading", ar: "جارٍ التحميل" })}</span>
            <span style={{ color: "#e9292c", fontVariantNumeric: "tabular-nums" }}>
              {Math.round(progress)}%
            </span>
          </div>

          <div
            style={{
              height: 3,
              background: "rgba(255, 255, 255, 0.08)",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${progress}%`,
                background: "linear-gradient(90deg, #c41e21, #e9292c, #ff6b6d)",
                transition: "width 0.25s ease-out",
                position: "relative",
              }}
            >
              <div className="preloader-shimmer" />
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 3,
          background: "linear-gradient(90deg, transparent, #e9292c, transparent)",
          transform: exiting ? "scaleX(1)" : "scaleX(0)",
          transformOrigin: "center",
          transition: "transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      />

      <div className="preloader-scanline" />
    </div>
  );
}
