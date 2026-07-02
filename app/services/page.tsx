"use client";

import Link from "next/link";
import { useState } from "react";
import { useLanguage } from "../components/LanguageContext";
import Reveal from "../components/Reveal";
import type { ServiceDataItem, WhyListItem } from "../lib/data";
import ServiceCardMedia from "../components/ServiceCardMedia";
import { tx } from "../lib/i18n";

export default function ServicesPage() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { locale, t } = useLanguage();
  const sp = t.servicesPage;
  const qf = sp.quoteForm;
  const [form, setForm] = useState({ name: "", email: "", phone: "", service: "", message: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const { submitQuote } = await import("../lib/api");
      await submitQuote({
        name: form.name,
        email: form.email,
        phone: form.phone || undefined,
        service: form.service || undefined,
        message: form.message,
        locale,
      });
      setSubmitted(true);
    } catch (err) {
      console.error("Quote submission failed:", err);
      alert(tx(locale, { ar: "تعذر إرسال الطلب. حاول مرة أخرى.", en: "Could not submit your request. Please try again." }));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <section style={{
        background: "#0a0a0a",
        padding: "100px 24px 80px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
        borderBottom: "3px solid var(--primary)",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(rgba(99,102,241,0.15) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          pointerEvents: "none",
        }} />
        <div style={{ position: "relative" }}>
          <Reveal direction="down">
            <span style={{
              display: "inline-block",
              background: "rgba(99,102,241,0.25)",
              border: "1px solid rgba(99,102,241,0.5)",
              color: "#a5b4fc",
              fontWeight: 700, fontSize: 13,
              padding: "6px 20px", borderRadius: 0, marginBottom: 20,
            }}>{sp.badge}</span>
          </Reveal>
          <Reveal direction="up" delay={100}>
            <h1 style={{
              fontSize: "clamp(2.4rem, 5vw, 4rem)",
              fontWeight: 900, color: "#fff",
              marginBottom: 20, lineHeight: 1.1,
            }}>
              {sp.title}
            </h1>
          </Reveal>
          <Reveal direction="up" delay={200}>
            <p style={{ color: "#94a3b8", fontSize: 18, maxWidth: 720, margin: "0 auto", lineHeight: 1.8 }}>
              {sp.subtext}
            </p>
          </Reveal>
        </div>
      </section>

      <section style={{ padding: "90px 24px 100px", background: "var(--bg)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <Reveal direction="down">
              <span style={{ display: "inline-block", background: "var(--primary-light)", color: "var(--primary)", fontWeight: 700, fontSize: 13, padding: "6px 18px", borderRadius: 0, marginBottom: 16 }}>
                {sp.gridBadge}
              </span>
            </Reveal>
            <Reveal direction="up" delay={100}>
              <h2 style={{ fontSize: "clamp(2rem, 3.5vw, 2.8rem)", fontWeight: 900, color: "var(--text)", marginBottom: 12 }}>
                {sp.gridTitle}
              </h2>
            </Reveal>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(330px, 1fr))", gap: 32 }}>
            {t.servicesData.map((s: ServiceDataItem, i: number) => (
              <Reveal key={s.id} delay={i * 80} direction="up">
                <div
                  onMouseEnter={() => setHovered(s.id)}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    background: hovered === s.id ? "#0a0a0a" : "var(--bg-card)",
                    borderRadius: "0", padding: 36,
                    border: `1.5px solid ${hovered === s.id ? "transparent" : "var(--border)"}`,
                    boxShadow: hovered === s.id ? "0 24px 60px rgba(99,102,241,0.3)" : "var(--shadow-sm)",
                    transform: hovered === s.id ? "translateY(-10px) scale(1.02)" : "none",
                    transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                    display: "flex", flexDirection: "column", height: "100%",
                  }}
                >
                  <Link href={`/services/${s.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                    <ServiceCardMedia
                      imageUrl={s.imageUrl}
                      serviceId={s.id}
                      icon={s.icon}
                      title={s.title}
                      hovered={hovered === s.id}
                      variant="page"
                    />
                    <h2 style={{ fontWeight: 800, fontSize: 21, color: hovered === s.id ? "#fff" : "var(--text)", marginBottom: 16 }}>{s.title}</h2>
                    <p style={{ color: hovered === s.id ? "rgba(255,255,255,0.85)" : "var(--text-muted)", fontSize: 14.5, lineHeight: 1.85, marginBottom: 32, flexGrow: 1 }}>{s.shortDesc}</p>
                  </Link>
                  <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 10 }}>
                    <Link href={`/services/${s.id}`} style={{
                      textDecoration: "none",
                      background: hovered === s.id ? "rgba(255,255,255,0.12)" : "var(--primary-light)",
                      color: hovered === s.id ? "#fff" : "var(--primary)",
                      padding: "12px 24px",
                      borderRadius: 1,
                      fontWeight: 800,
                      fontSize: 14.5,
                      textAlign: "center",
                      border: hovered === s.id ? "1.5px solid rgba(255,255,255,0.2)" : "1.5px solid transparent",
                    }}>
                      {t.common.readMore}
                    </Link>
                    <Link href={`/contact?service=${encodeURIComponent(s.id)}`} style={{
                      textDecoration: "none",
                      background: hovered === s.id ? "var(--primary)" : "#0a0a0a",
                      color: "#fff",
                      padding: "14px 24px",
                      borderRadius: 1,
                      fontWeight: 800,
                      fontSize: 15.5,
                      textAlign: "center",
                      border: hovered === s.id ? "2px solid var(--primary)" : "2px solid #0a0a0a",
                    }}>
                      {t.common.requestService}
                    </Link>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "100px 24px", background: "var(--bg-muted)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <Reveal direction="down">
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <h2 style={{ fontSize: "clamp(2rem, 3.5vw, 2.8rem)", fontWeight: 900, color: "var(--text)", marginBottom: 12 }}>{sp.quoteTitle}</h2>
              <p style={{ color: "var(--text-muted)", fontSize: 16.5, lineHeight: 1.8, maxWidth: 560, margin: "0 auto" }}>{sp.quoteSubtext}</p>
              <div style={{ display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap", marginTop: 24, fontSize: 15 }}>
                <div><strong>{sp.quoteEmailLabel}:</strong> <a href={`mailto:${sp.quoteEmail}`} style={{ color: "var(--primary)" }}>{sp.quoteEmail}</a></div>
                <div><strong>{sp.quotePhoneLabel}:</strong> <a href={`tel:${sp.quotePhone.replace(/\s/g, "")}`} style={{ color: "var(--primary)", direction: "ltr", display: "inline-block" }}>{sp.quotePhone}</a></div>
              </div>
            </div>
          </Reveal>

          {submitted ? (
            <Reveal direction="up">
              <div style={{ textAlign: "center", background: "var(--bg-card)", padding: "48px 32px", border: "1px solid var(--border)" }}>
                <div style={{ fontSize: 56, marginBottom: 16 }}>✓</div>
                <h3 style={{ fontWeight: 800, fontSize: 22, marginBottom: 12 }}>{t.common.successTitle}</h3>
                <p style={{ color: "var(--text-muted)", lineHeight: 1.8 }}>{t.common.successDesc}</p>
              </div>
            </Reveal>
          ) : (
            <Reveal direction="up" delay={150}>
              <form onSubmit={handleSubmit} style={{
                background: "var(--bg-card)",
                padding: "40px 36px",
                border: "1px solid var(--border)",
                boxShadow: "var(--shadow-lg)",
                display: "flex", flexDirection: "column", gap: 20,
              }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }} className="form-row-2">
                  <div style={{ textAlign: "start" }}>
                    <label style={{ display: "block", fontWeight: 700, fontSize: 13.5, marginBottom: 8 }}>{qf.fullName} *</label>
                    <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                      style={{ width: "100%", padding: "14px 16px", border: "1.5px solid var(--border)", borderRadius: 0, fontFamily: "inherit", background: "var(--bg)" }} />
                  </div>
                  <div style={{ textAlign: "start" }}>
                    <label style={{ display: "block", fontWeight: 700, fontSize: 13.5, marginBottom: 8 }}>{qf.email} *</label>
                    <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                      style={{ width: "100%", padding: "14px 16px", border: "1.5px solid var(--border)", borderRadius: 0, fontFamily: "inherit", background: "var(--bg)" }} />
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }} className="form-row-2">
                  <div style={{ textAlign: "start" }}>
                    <label style={{ display: "block", fontWeight: 700, fontSize: 13.5, marginBottom: 8 }}>{qf.phone}</label>
                    <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                      style={{ width: "100%", padding: "14px 16px", border: "1.5px solid var(--border)", borderRadius: 0, fontFamily: "inherit", background: "var(--bg)" }} />
                  </div>
                  <div style={{ textAlign: "start" }}>
                    <label style={{ display: "block", fontWeight: 700, fontSize: 13.5, marginBottom: 8 }}>{qf.interestedIn}</label>
                    <select value={form.service} onChange={e => setForm({ ...form, service: e.target.value })}
                      style={{ width: "100%", padding: "14px 16px", border: "1.5px solid var(--border)", borderRadius: 0, fontFamily: "inherit", background: "var(--bg)" }}>
                      <option value="">{qf.chooseService}</option>
                      {t.servicesData.map(s => (
                        <option key={s.id} value={s.id}>{s.title}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div style={{ textAlign: "start" }}>
                  <label style={{ display: "block", fontWeight: 700, fontSize: 13.5, marginBottom: 8 }}>{qf.message} *</label>
                  <textarea required rows={5} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                    style={{ width: "100%", padding: "14px 16px", border: "1.5px solid var(--border)", borderRadius: 0, fontFamily: "inherit", background: "var(--bg)", resize: "vertical" }} />
                </div>
                <button type="submit" disabled={loading} style={{
                  border: "none", cursor: loading ? "not-allowed" : "pointer",
                  background: loading ? "var(--border)" : "#0a0a0a",
                  color: "#fff", padding: "16px 32px", borderRadius: 0,
                  fontWeight: 800, fontSize: 16, fontFamily: "inherit",
                }}>
                  {loading ? t.common.loading : qf.submit}
                </button>
              </form>
            </Reveal>
          )}
        </div>
      </section>

      <section style={{ padding: "90px 24px", background: "var(--bg)" }}>
        <div style={{ maxWidth: 1050, margin: "0 auto", textAlign: "center" }}>
          <Reveal direction="down">
            <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)", fontWeight: 900, color: "var(--text)", marginBottom: 52 }}>
              {sp.whyTitle}
            </h2>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 28 }}>
            {sp.whyList.map((item: WhyListItem, i: number) => (
              <Reveal key={i} delay={i * 100} direction="up">
                <div style={{
                  background: "var(--bg-card)",
                  borderRadius: "0", padding: 32,
                  border: "1px solid var(--border)", height: "100%",
                }}>
                  <div style={{ fontSize: 44, marginBottom: 16 }}>{item.icon}</div>
                  <h3 style={{ fontWeight: 800, fontSize: 18, color: "var(--text)", marginBottom: 10 }}>{item.title}</h3>
                  <p style={{ color: "var(--text-muted)", fontSize: 14.5, lineHeight: 1.8 }}>{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "80px 24px", background: "var(--bg-muted)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <Reveal direction="down">
            <h2 style={{ fontSize: "clamp(1.8rem, 3vw, 2.4rem)", fontWeight: 900, color: "var(--text)", textAlign: "center", marginBottom: 48 }}>
              {t.processData.title}
            </h2>
          </Reveal>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
            {t.processData.steps.map((step, i) => (
              <Reveal key={i} direction="up" delay={i * 80}>
                <div style={{
                  background: i % 2 === 0 ? "#0a0a0a" : "var(--bg-card)",
                  color: i % 2 === 0 ? "#fff" : "var(--text)",
                  borderRadius: 0, padding: "18px 22px",
                  border: i % 2 === 1 ? "1.5px solid var(--border)" : "none",
                  fontWeight: 700, fontSize: 14, textAlign: "center", minWidth: 140,
                }}>
                  <div style={{ fontSize: 22, marginBottom: 6 }}>{step.step}</div>
                  {step.title}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section style={{
        padding: "110px 24px",
        background: "#000",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        <Reveal direction="down">
          <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 900, color: "#fff", marginBottom: 16 }}>
            {sp.ctaTitle}
          </h2>
        </Reveal>
        <Reveal direction="up" delay={100}>
          <p style={{ color: "#c7d2fe", fontSize: 18, marginBottom: 44, maxWidth: 540, margin: "0 auto 44px" }}>{sp.ctaSub}</p>
        </Reveal>
        <Reveal direction="up" delay={200}>
          <Link href="/contact" style={{
            textDecoration: "none",
            background: "#fff", color: "var(--primary)",
            padding: "16px 48px", borderRadius: 0, fontWeight: 800, fontSize: 17,
            display: "inline-block",
          }}>
            {sp.ctaBtn} →
          </Link>
        </Reveal>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .form-row-2 { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
