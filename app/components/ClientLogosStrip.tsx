"use client";

import Image from "next/image";
import { useLanguage } from "./LanguageContext";

type ClientLogosStripProps = {
  variant?: "dark" | "light";
};

export default function ClientLogosStrip({ variant = "dark" }: ClientLogosStripProps) {
  const { clientLogos } = useLanguage();
  const isDark = variant === "dark";
  const loop = [...clientLogos, ...clientLogos];

  return (
    <div
      className="client-logos-strip"
      style={{
        overflow: "hidden",
        width: "100%",
        maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        WebkitMaskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
      }}
    >
      <div
        className="client-logos-track"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 48,
          width: "max-content",
          animation: "client-logos-scroll 36s linear infinite",
        }}
      >
        {loop.map((logo, index) => (
          <div
            key={`${logo.alt}-${index}`}
            className="client-logo-item"
            style={{
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minWidth: 140,
              height: 72,
              padding: "12px 24px",
              background: isDark ? "rgba(255,255,255,0.04)" : "var(--bg-muted)",
              border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid var(--border)",
              borderRadius: 16,
            }}
          >
            <Image
              src={logo.src}
              alt={logo.alt}
              width={160}
              height={56}
              unoptimized
              style={{
                width: "auto",
                height: 44,
                maxWidth: 140,
                objectFit: "contain",
                filter: isDark ? "brightness(0) invert(1)" : "grayscale(1)",
                opacity: isDark ? 0.88 : 0.72,
                transition: "opacity 0.25s ease, transform 0.25s ease, filter 0.25s ease",
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
