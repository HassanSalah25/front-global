"use client";

import Reveal from "./Reveal";
import ClientLogosStrip from "./ClientLogosStrip";
import { useLanguage } from "./LanguageContext";

export default function TrustedBySection() {
  const { t } = useLanguage();
  const { partnersBadge, partnersTitle } = t.aboutData;

  return (
    <section
      style={{
        padding: "72px 24px",
        background: "linear-gradient(180deg, #050505 0%, #0b0b0b 100%)",
        position: "relative",
        overflow: "hidden",
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -80,
          right: -80,
          width: 320,
          height: 320,
          background: "radial-gradient(circle, rgba(99,102,241,0.12), transparent)",
          borderRadius: "0%",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -60,
          left: -60,
          width: 280,
          height: 280,
          background: "radial-gradient(circle, rgba(245,158,11,0.08), transparent)",
          borderRadius: "0%",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
        <Reveal direction="down">
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <p
              style={{
                color: "rgba(255,255,255,0.55)",
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: 1.2,
                textTransform: "uppercase",
                marginBottom: 12,
              }}
            >
              {partnersBadge}
            </p>
            <h2
              style={{
                fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
                fontWeight: 900,
                color: "#fff",
                margin: 0,
              }}
            >
              {partnersTitle}
            </h2>
          </div>
        </Reveal>
        <Reveal direction="up" delay={100}>
          <ClientLogosStrip variant="dark" />
        </Reveal>
      </div>
    </section>
  );
}
