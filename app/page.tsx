"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useLanguage } from "./components/LanguageContext";
import Reveal from "./components/Reveal";
import HeroCarousel from "./components/HeroCarousel";
import AnimatedStats from "./components/AnimatedStats";
import AwardsSection from "./components/AwardsSection";
import WorkShowcase from "./components/WorkShowcase";
import type { ServiceDataItem, FaqItem, ProcessStep, TestimonialItem } from "./lib/data";
import { fetchFaqs } from "./lib/api";
import type { ApiLocale } from "./lib/api";
import { isRtlLocale } from "./lib/i18n";
import ServiceCardMedia from "./components/ServiceCardMedia";

function ServiceCard({ s }: { s: ServiceDataItem }) {
  const [hovered, setHovered] = useState(false);
  const { t } = useLanguage();

  return (
    <Link
      href={`/services/${s.id}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        textDecoration: "none",
        color: "inherit",
        background: hovered
          ? "#0a0a0a"
          : "var(--bg-card)",
        borderRadius: "0",
        padding: 32,
        border: `1.5px solid ${hovered ? "transparent" : "var(--border)"}`,
        borderLeft: hovered ? "3px solid var(--primary)" : "1.5px solid var(--border)",
        boxShadow: hovered ? "0 20px 50px rgba(0,0,0,0.25)" : "var(--shadow-sm)",
        transform: hovered ? "translateY(-10px) scale(1.02)" : "none",
        transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        gap: 16,
        height: "100%",
      }}
    >
      <ServiceCardMedia
        imageUrl={s.imageUrl}
        serviceId={s.id}
        icon={s.icon}
        title={s.title}
        hovered={hovered}
        variant="home"
      />
      <h3 style={{ fontWeight: 800, fontSize: 19, color: hovered ? "#fff" : "var(--text)" }}>{s.title}</h3>
      <p style={{ color: hovered ? "rgba(255,255,255,0.85)" : "var(--text-muted)", fontSize: 14.5, lineHeight: 1.8, flexGrow: 1 }}>{s.shortDesc}</p>
      <span
        style={{
          marginTop: "auto",
          color: hovered ? "#fff" : "var(--primary)",
          fontWeight: 700,
          fontSize: 14,
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <span>{t.common.readMore}</span>
        <span style={{ transform: hovered ? "translateX(4px)" : "translateX(0)", transition: "transform 0.2s", display: "inline-block" }}>→</span>
      </span>
    </Link>
  );
}

function ProcessStepCard({ p }: { p: ProcessStep }) {
  return (
    <div style={{
      background: "var(--bg-card)",
      borderRadius: "0",
      padding: 32,
      textAlign: "center",
      border: "1px solid var(--border)",
      position: "relative",
      transition: "all 0.3s ease",
      width: "100%",
    }}
    className="process-card"
    >
      <div style={{
        width: 58, height: 58,
        background: "linear-gradient(135deg, var(--primary), var(--primary-dark))",
        borderRadius: "0",
        display: "flex", alignItems: "center", justifyContent: "center",
        margin: "0 auto 20px",
        color: "#fff",
        fontWeight: 900,
        fontSize: 22,
        boxShadow: "0 4px 12px rgba(99, 102, 241, 0.2)"
      }}>
        {p.step}
      </div>
      <h3 style={{ fontWeight: 800, fontSize: 18, color: "var(--text)", marginBottom: 12 }}>{p.title}</h3>
      <p style={{ color: "var(--text-muted)", fontSize: 14.5, lineHeight: 1.8 }}>{p.desc}</p>
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{
      background: "var(--bg-card)",
      borderRadius: "var(--radius)",
      border: `1.5px solid ${open ? "var(--primary)" : "var(--border)"}`,
      overflow: "hidden",
      transition: "all 0.3s ease",
      boxShadow: open ? "var(--shadow-md)" : "none",
    }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%", background: "none", border: "none",
          padding: "20px 24px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          cursor: "pointer", fontFamily: "inherit",
          textAlign: "inherit",
        }}
      >
        <span style={{ fontWeight: 700, fontSize: 16.5, color: "var(--text)" }}>{q}</span>
        <span style={{
          color: "var(--primary)", fontSize: 24, fontWeight: 300,
          transform: open ? "rotate(45deg)" : "none",
          transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
          flexShrink: 0,
        }}>+</span>
      </button>
      {open && (
        <div style={{
          padding: "0 24px 20px",
          color: "var(--text-muted)",
          fontSize: 15,
          lineHeight: 1.8,
          borderTop: "1px solid var(--border)"
        }}>
          {a}
        </div>
      )}
    </div>
  );
}

/* ── Tools Ticker ─────────────────────── */
function ToolsTicker({ items }: { items: string[] }) {
  if (!items.length) return null;
  return (
    <div style={{ display: "flex", overflow: "hidden", gap: 16, padding: "8px 0" }}>
      <div style={{
        display: "flex",
        gap: 12,
        animation: "ticker-scroll 20s linear infinite",
        flexShrink: 0,
      }}>
        {[...items, ...items].map((tool, i) => (
          <span key={i} style={{
            background: "rgba(99,102,241,0.08)",
            border: "1px solid rgba(99,102,241,0.15)",
            color: "var(--primary)",
            padding: "6px 18px",
            borderRadius: 0,
            fontSize: 13,
            fontWeight: 600,
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}>
            {tool}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const { locale, t } = useLanguage();
  const hd = t.homeData;
  const [cmsFaqs, setCmsFaqs] = useState<Array<{ q: string; a: string }> | null>(null);

  useEffect(() => {
    fetchFaqs(locale as ApiLocale)
      .then((list) => {
        if (list.length > 0) setCmsFaqs(list);
      })
      .catch(() => setCmsFaqs(null));
  }, [locale]);

  return (
    <div>
      {/* ── Hero Carousel ─────────────────────── */}
      <HeroCarousel />

      {/* ── Hero Info Split ───────────────────── */}
      <section style={{
        background: "#fff",
        padding: "120px 24px 100px",
        position: "relative",
        overflow: "hidden",
        borderBottom: "1px solid var(--border)",
      }}>
        <div style={{ position: "absolute", top: -100, right: -100, width: 450, height: 450, background: "radial-gradient(circle, rgba(0,0,0,0.03) 0%, transparent 70%)", borderRadius: "10%", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -80, left: -60, width: 350, height: 350, background: "radial-gradient(circle, rgba(233,41,44,0.04) 0%, transparent 70%)", borderRadius: "10%", pointerEvents: "none" }} />

        <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative" }}>
          <div style={{
            gridTemplateColumns: "1.1fr 0.9fr",
            gap: 56,
            alignItems: "center",
          }} className="hero-split">
            <div style={{ textAlign: "start" }} className="hero-text">
              <Reveal direction="down">
                <span style={{
                  display: "inline-block",
                  background: "var(--primary-light)",
                  color: "var(--primary)",
                  fontWeight: 700,
                  fontSize: 14,
                  padding: "8px 22px",
                  borderRadius: 0,
                  marginBottom: 24,
                  boxShadow: "0 4px 12px rgba(99, 102, 241, 0.08)"
                }}>
                  {t.heroData.badge}
                </span>
              </Reveal>
              
              <Reveal direction="up" delay={100}>
                <h1 style={{
                  fontSize: "clamp(2.5rem, 5vw, 3.8rem)",
                  fontWeight: 900,
                  lineHeight: 1.15,
                  color: "var(--text)",
                  marginBottom: 24,
                  letterSpacing: "-0.5px"
                }}>
                  {t.heroData.headline1}{" "}
                  <span style={{
                    background: "linear-gradient(135deg, var(--primary), var(--accent))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent"
                  }}>
                    {t.heroData.headline2}
                  </span>
                </h1>
              </Reveal>

              <Reveal direction="up" delay={200}>
                <p style={{
                  fontSize: 18,
                  color: "var(--text-muted)",
                  maxWidth: 580,
                  marginBottom: 44,
                  lineHeight: 1.85
                }}>
                  {t.heroData.subtext}
                </p>
              </Reveal>

              <Reveal direction="up" delay={300}>
                <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }} className="hero-ctas">
                  <Link href={t.heroData.cta1.href} style={{
                    textDecoration: "none",
                    background: "#0a0a0a",
                    color: "#fff",
                    padding: "16px 36px",
                    borderRadius: 0,
                    fontWeight: 700,
                    fontSize: 17,
                    boxShadow: "0 6px 24px rgba(0,0,0,0.2)",
                    transition: "all 0.2s",
                    border: "2px solid #0a0a0a",
                  }}
                  className="btn-glow"
                  >
                    {t.heroData.cta1.label}
                  </Link>
                  <Link href={t.heroData.cta2.href} style={{
                    textDecoration: "none",
                    background: "transparent",
                    color: "#0a0a0a",
                    padding: "16px 36px",
                    borderRadius: 0,
                    fontWeight: 700,
                    fontSize: 17,
                    border: "2px solid #0a0a0a",
                    transition: "all 0.2s"
                  }}
                  className="btn-outline"
                  >
                    {t.heroData.cta2.label}
                  </Link>
                </div>
              </Reveal>

              {/* Tools ticker */}
              <Reveal direction="up" delay={400}>
                <div style={{ marginTop: 44, overflow: "hidden" }}>
                  <ToolsTicker items={hd.productionPipeline} />
                </div>
              </Reveal>

              <Reveal direction="up" delay={500}>
                <div style={{ display: "flex", gap: 16, marginTop: 28, flexWrap: "wrap" }}>
                  {t.heroData.badges.map((b: string, i: number) => (
                    <span key={i} style={{
                      background: "#fff",
                      border: "1px solid var(--border)",
                      borderRadius: 0,
                      padding: "8px 18px",
                      fontSize: 13,
                      fontWeight: 600,
                      color: "var(--text-muted)",
                      boxShadow: "var(--shadow-sm)"
                    }}>{b}</span>
                  ))}
                </div>
              </Reveal>
            </div>

            {/* Hero Image */}
            <div className="hero-img-container">
              <Reveal direction="left" delay={200}>
                <div style={{ position: "relative" }}>
                  <div style={{
                    position: "absolute",
                    top: 15,
                    left: isRtlLocale(locale) ? -15 : 15,
                    right: isRtlLocale(locale) ? 15 : -15,
                    bottom: -15,
                    background: "rgba(99, 102, 241, 0.15)",
                    borderRadius: 0,
                    zIndex: 1,
                    filter: "blur(4px)"
                  }} />
                  <Image
                    src={t.heroData.image}
                    alt={t.heroData.imageAlt}
                    width={900}
                    height={600}
                    unoptimized
                    style={{
                      width: "100%",
                      borderRadius: 0,
                      position: "relative",
                      zIndex: 2,
                      boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
                      border: "4px solid #fff",
                      transform: isRtlLocale(locale) ? "rotate(-1.5deg)" : "rotate(1.5deg)",
                      transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                    className="hero-image"
                  />
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ── Animated Stats ────────────────────── */}
      <AnimatedStats />

      {/* ── Services ─────────────────────────── */}
      <section style={{ padding: "100px 24px", background: "var(--bg-muted)" }}>
        <div style={{ maxWidth: 1150, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <Reveal direction="down">
              <span style={{ display: "inline-block", background: "var(--primary-light)", color: "var(--primary)", fontWeight: 700, fontSize: 13, padding: "6px 18px", borderRadius: 0, marginBottom: 16 }}>{hd.servicesBadge}</span>
            </Reveal>
            <Reveal direction="up" delay={100}>
              <h2 style={{ fontSize: "clamp(2rem, 3.5vw, 2.8rem)", fontWeight: 900, color: "var(--text)", marginBottom: 16 }}>{hd.servicesTitle}</h2>
            </Reveal>
            <Reveal direction="up" delay={200}>
              <p style={{ color: "var(--text-muted)", fontSize: 16.5, maxWidth: 540, margin: "0 auto" }}>{hd.servicesSubtext}</p>
            </Reveal>
          </div>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 32 }}>
            {t.servicesData.slice(0, 6).map((s: ServiceDataItem, i: number) => (
              <Reveal key={s.id} delay={i * 100} direction="up">
                <ServiceCard s={s} />
              </Reveal>
            ))}
          </div>

          <Reveal direction="up" delay={200}>
            <div style={{ textAlign: "center", marginTop: 56 }}>
              <Link href="/services" style={{
                textDecoration: "none",
                display: "inline-block",
                background: "#0a0a0a",
                color: "#fff",
                padding: "15px 40px",
                borderRadius: 0,
                fontWeight: 700,
                fontSize: 16.5,
                boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                border: "2px solid #0a0a0a",
              }}>
                {t.common.allServices} &rarr;
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Work Showcase (Bento Grid) ─────────── */}
      <WorkShowcase locale={locale} title={hd.portfolioTitle} />

      {/* ── Process ──────────────────────────── */}
      <section style={{ padding: "100px 24px", background: "var(--bg-muted)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <Reveal direction="down">
              <span style={{ display: "inline-block", background: "var(--accent-light)", color: "#92400e", fontWeight: 700, fontSize: 13, padding: "6px 18px", borderRadius: 0, marginBottom: 16 }}>{t.processData.badge}</span>
            </Reveal>
            <Reveal direction="up" delay={100}>
              <h2 style={{ fontSize: "clamp(2rem, 3.5vw, 2.8rem)", fontWeight: 900, color: "var(--text)" }}>{t.processData.title}</h2>
            </Reveal>
          </div>

          <div className="process-grid">
            <div className="process-row process-row-top">
              {t.processData.steps.slice(0, 3).map((p: ProcessStep, i: number) => (
                <Reveal key={i} delay={i * 100} direction="up">
                  <ProcessStepCard p={p} />
                </Reveal>
              ))}
            </div>
            <div className="process-row process-row-bottom">
              {t.processData.steps.slice(3).map((p: ProcessStep, i: number) => (
                <Reveal key={i + 3} delay={(i + 3) * 100} direction="up">
                  <ProcessStepCard p={p} />
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────── */}
      <section style={{ padding: "100px 24px", background: "var(--bg)" }}>
        <div style={{ maxWidth: 1150, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <Reveal direction="down">
              <span style={{ display: "inline-block", background: "var(--accent-light)", color: "#92400e", fontWeight: 700, fontSize: 13, padding: "6px 18px", borderRadius: 0, marginBottom: 16 }}>{hd.creativeTitle}</span>
            </Reveal>
            <Reveal direction="up" delay={100}>
              <h2 style={{ fontSize: "clamp(2rem, 3.5vw, 2.8rem)", fontWeight: 900, color: "var(--text)" }}>{hd.creativeSubtitle}</h2>
            </Reveal>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 32 }}>
            {t.testimonialsData.list.map((item: TestimonialItem, i: number) => (
              <Reveal key={i} delay={i * 100} direction="up">
                <div style={{
                  background: "var(--bg-card)",
                  borderRadius: "0",
                  padding: 32,
                  border: "1px solid var(--border)",
                  boxShadow: "var(--shadow-sm)",
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  transition: "all 0.3s ease",
                }}
                className="testimonial-card"
                >
                  <div style={{ color: "var(--accent)", fontSize: 20, marginBottom: 16 }}>{"★".repeat(item.rating)}</div>
                  <p style={{ color: "var(--text)", fontSize: 15.5, lineHeight: 1.85, marginBottom: 28, flexGrow: 1 }}>{`\"${item.text}\"`}</p>
                  
                  <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: "auto" }}>
                    <Image
                      src={item.avatar}
                      alt={item.name}
                      width={48}
                      height={48}
                      unoptimized
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: "0",
                        objectFit: "cover",
                        border: "2px solid var(--primary-light)"
                      }}
                    />
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 15, color: "var(--text)" }}>{item.name}</div>
                      <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>{item.role}</div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Photography ──────────────────────── */}
      <section style={{ padding: "100px 24px", background: "var(--bg)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "center" }} className="hero-split">
          <Reveal direction="right">
            <span style={{ display: "inline-block", background: "var(--primary-light)", color: "var(--primary)", fontWeight: 700, fontSize: 13, padding: "6px 18px", borderRadius: 0, marginBottom: 16 }}>{hd.photographyBadge}</span>
            <h2 style={{ fontSize: "clamp(2rem, 3.5vw, 2.6rem)", fontWeight: 900, color: "var(--text)", marginBottom: 20, lineHeight: 1.2 }}>{hd.photographyTitle}</h2>
            <p style={{ color: "var(--text-muted)", fontSize: 16.5, lineHeight: 1.85, marginBottom: 16 }}>{hd.photographyDesc}</p>
            <p style={{ color: "var(--primary)", fontWeight: 700, fontSize: 15, marginBottom: 28 }}>{hd.photographyTagline}</p>
            <Link href="/contact" style={{
              textDecoration: "none", background: "#0a0a0a", color: "#fff",
              padding: "14px 32px", borderRadius: 0, fontWeight: 700, fontSize: 15.5,
              display: "inline-block", border: "2px solid #0a0a0a",
            }}>{t.common.contactUs} &rarr;</Link>
          </Reveal>
          <Reveal direction="left" delay={150}>
            <Image
              src={hd.photographyImage}
              alt={hd.photographyTitle}
              width={800} height={500} unoptimized
              style={{ width: "100%", borderRadius: 0 }}
            />
          </Reveal>
        </div>
      </section>

      {/* ── Awards & Recognition ──────────────── */}
      <AwardsSection locale={locale} />

      {/* ── Blog Preview ─────────────────────── */}
      <section style={{ padding: "100px 24px", background: "var(--bg-muted)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <Reveal direction="down">
              <span style={{ display: "inline-block", background: "var(--primary-light)", color: "var(--primary)", fontWeight: 700, fontSize: 13, padding: "6px 18px", borderRadius: 0, marginBottom: 16 }}>{hd.blogBadge}</span>
            </Reveal>
            <Reveal direction="up" delay={100}>
              <h2 style={{ fontSize: "clamp(2rem, 3.5vw, 2.8rem)", fontWeight: 900, color: "var(--text)", marginBottom: 12 }}>{hd.blogTitle}</h2>
            </Reveal>
            <Reveal direction="up" delay={200}>
              <p style={{ color: "var(--text-muted)", fontSize: 16.5 }}>{hd.blogSubtext}</p>
            </Reveal>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 28 }}>
            {t.blogPage.posts.map((post, i) => (
              <Reveal key={post.id} delay={i * 100} direction="up">
                <Link href="/blog" style={{
                  textDecoration: "none", background: "var(--bg-card)", borderRadius: 0,
                  padding: 28, border: "1px solid var(--border)", display: "block", height: "100%",
                  transition: "all 0.3s ease",
                }} className="process-card">
                  <span style={{ fontSize: 12, fontWeight: 700, color: "var(--primary)" }}>{post.category}</span>
                  <h3 style={{ fontWeight: 800, fontSize: 18, color: "var(--text)", margin: "10px 0" }}>{post.title}</h3>
                  <p style={{ color: "var(--text-muted)", fontSize: 14, lineHeight: 1.75 }}>{post.excerpt}</p>
                  <p style={{ color: "var(--text-muted)", fontSize: 12, marginTop: 16 }}>{post.date}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────── */}
      <section style={{ padding: "100px 24px", background: "var(--bg)" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <Reveal direction="down">
              <span style={{ display: "inline-block", background: "var(--primary-light)", color: "var(--primary)", fontWeight: 700, fontSize: 13, padding: "6px 18px", borderRadius: 0, marginBottom: 16 }}>{t.faqData.badge}</span>
            </Reveal>
            <Reveal direction="up" delay={100}>
              <h2 style={{ fontSize: "clamp(2rem, 3.5vw, 2.8rem)", fontWeight: 900, color: "var(--text)" }}>{t.faqData.title}</h2>
            </Reveal>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {(cmsFaqs ?? t.faqData.list).map((item: FaqItem, i: number) => (
              <Reveal key={i} delay={i * 50} direction="up">
                <FaqItem q={item.q} a={item.a} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────── */}
      <section style={{
        padding: "100px 24px",
        background: "#000",
        textAlign: "center",
        position: "relative",
        overflow: "hidden"
      }}>
        <div style={{ position: "absolute", top: -80, left: -80, width: 300, height: 300, background: "rgba(255,255,255,0.05)", borderRadius: "0%", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -80, right: -80, width: 300, height: 300, background: "rgba(255,255,255,0.05)", borderRadius: "0%", pointerEvents: "none" }} />
        {/* Animated rings */}
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 600, height: 600, border: "1px solid rgba(255,255,255,0.06)", borderRadius: "0%", animation: "ring-pulse 3s ease-in-out infinite", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 400, height: 400, border: "1px solid rgba(255,255,255,0.08)", borderRadius: "0%", animation: "ring-pulse 3s ease-in-out infinite 0.5s", pointerEvents: "none" }} />

        <div style={{ maxWidth: 700, margin: "0 auto", position: "relative" }}>
          <Reveal direction="down">
            <h2 style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.2rem)", fontWeight: 900, color: "#fff", marginBottom: 20 }}>{hd.ctaBannerTitle}</h2>
          </Reveal>
          <Reveal direction="up" delay={100}>
            <p style={{ color: "#c7d2fe", fontSize: 18.5, marginBottom: 44, lineHeight: 1.8 }}>
              {hd.ctaBannerText}
            </p>
          </Reveal>
          
          <Reveal direction="up" delay={200}>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/contact" style={{
                textDecoration: "none",
                background: "#fff",
                color: "var(--primary)",
                padding: "16px 44px",
                borderRadius: 0,
                fontWeight: 800,
                fontSize: 17,
                boxShadow: "0 8px 28px rgba(0,0,0,0.18)",
                display: "inline-block",
                transition: "all 0.2s"
              }}
              className="btn-glow-white"
              >
                {t.common.contactUsNow} &rarr;
              </Link>
              <Link href="/services" style={{
                textDecoration: "none",
                background: "rgba(255,255,255,0.15)",
                color: "#fff",
                padding: "16px 44px",
                borderRadius: 0,
                fontWeight: 700,
                fontSize: 17,
                border: "2px solid rgba(255,255,255,0.3)",
                display: "inline-block",
                transition: "all 0.2s"
              }}
              className="btn-outline-white"
              >
                {t.common.exploreServices}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Global styles */}
      <style>{`
        @keyframes ticker-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes ring-pulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
          50% { transform: translate(-50%, -50%) scale(1.05); opacity: 0.8; }
        }
        .btn-glow:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.25) !important;
          background: #1a1a1a !important;
        }
        .btn-outline:hover {
          background: #0a0a0a !important;
          border-color: #0a0a0a !important;
          color: #fff !important;
          transform: translateY(-2px);
        }
        .btn-glow-white:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(255,255,255,0.2) !important;
        }
        .btn-outline-white:hover {
          background: rgba(255,255,255,0.25) !important;
          transform: translateY(-2px);
        }
        .process-card:hover {
          transform: translateY(-8px);
          border-color: var(--primary) !important;
          box-shadow: var(--shadow-md);
        }
        .process-grid {
          display: flex;
          flex-direction: column;
          gap: 32px;
          align-items: center;
        }
        .process-row-top {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
          width: 100%;
          max-width: 900px;
        }
        .process-row-bottom {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 32px;
          width: 100%;
          max-width: 600px;
        }
        .testimonial-card:hover {
          transform: translateY(-8px);
          border-color: var(--primary) !important;
          box-shadow: var(--shadow-md) !important;
        }
        .hero-image:hover {
          transform: rotate(0deg) scale(1.02) !important;
        }
        @media (max-width: 992px) {
          .hero-split {
            grid-template-columns: 1fr !important;
            text-align: center !important;
            gap: 48px !important;
          }
          .hero-text {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 100%;
            max-width: 100%;
          }
          .hero-text h1,
          .hero-text p,
          .hero-text span {
            text-align: center !important;
          }
          .hero-ctas {
            justify-content: center;
          }
          .hero-img-container {
            max-width: 550px;
            margin: 0 auto;
            width: 100%;
          }
        }
        @media (max-width: 768px) {
          .process-row-top,
          .process-row-bottom {
            grid-template-columns: 1fr;
            max-width: 320px;
          }
          .hero-split {
            gap: 32px !important;
          }
          .hero-ctas {
            flex-direction: column;
            align-items: center;
          }
          .hero-ctas a {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}
