"use client";

import Reveal from "./Reveal";
import ClientLogosStrip from "./ClientLogosStrip";
import { useLanguage } from "./LanguageContext";

export default function PartnersSection() {
  const { t } = useLanguage();
  const { partnersBadge, partnersTitle } = t.aboutData;

  return (
    <section
      style={{
        padding: "64px 24px",
        background: "var(--bg-card)",
        borderTop: "1px solid var(--border)",
      }}
    >
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <Reveal direction="down">
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: 1,
                marginBottom: 12,
              }}
            >
              {partnersBadge}
            </p>
            <h2
              style={{
                fontSize: "clamp(1.5rem, 2.5vw, 2rem)",
                fontWeight: 900,
                color: "var(--text)",
                margin: 0,
              }}
            >
              {partnersTitle}
            </h2>
          </div>
        </Reveal>
        <Reveal direction="up" delay={100}>
          <ClientLogosStrip variant="light" />
        </Reveal>
      </div>
    </section>
  );
}
