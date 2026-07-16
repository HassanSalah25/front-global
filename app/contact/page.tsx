"use client";

import { useState, useEffect, Suspense, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Mail, MapPin, CheckCircle, Building, Clock, MessageSquare, ShieldCheck, Briefcase } from "lucide-react";
import { useLanguage } from "../components/LanguageContext";
import Reveal from "../components/Reveal";
import type { InfoItem as OfficeItem } from "../lib/data";
import { pickLocalized, tx } from "../lib/i18n";

const whyUsIcons: Record<string, React.ReactNode> = {
  clock: <Clock size={22} strokeWidth={1.5} />,
  messageSquare: <MessageSquare size={22} strokeWidth={1.5} />,
  shield: <ShieldCheck size={22} strokeWidth={1.5} />,
  briefcase: <Briefcase size={22} strokeWidth={1.5} />,
};

const whyContactUs = {
  ar: [
    { icon: "clock", title: "رد خلال ساعة", desc: "فريقنا جاهز للرد على استفساراتك خلال ساعة واحدة في أيام العمل" },
    { icon: "messageSquare", title: "استشارة مجانية", desc: "احصل على استشارة تسويقية مجانية مدتها 30 دقيقة مع أحد خبرائنا" },
    { icon: "shield", title: "سرية تامة", desc: "معلوماتك ومشروعك محمي بالكامل وفق أعلى معايير الخصوصية" },
    { icon: "briefcase", title: "خبرة تزيد عن 9 سنوات", desc: "فريق من الخبراء المتخصصين في كل مجالات التسويق الرقمي" },
  ],
  en: [
    { icon: "clock", title: "1-Hour Response", desc: "Our team is ready to answer your inquiries within one hour on business days" },
    { icon: "messageSquare", title: "Free Consultation", desc: "Get a free 30-minute marketing consultation with one of our experts" },
    { icon: "shield", title: "Full Confidentiality", desc: "Your information and project are fully protected under the highest privacy standards" },
    { icon: "briefcase", title: "9+ Years Experience", desc: "A team of specialists in all areas of digital marketing" },
  ],
};

function ServicePrefill({
  onService,
}: {
  onService: (serviceId: string) => void;
}) {
  const searchParams = useSearchParams();
  const { t } = useLanguage();

  useEffect(() => {
    const serviceParam = searchParams.get("service")?.trim();
    if (!serviceParam) return;

    const isValid = t.servicesData.some((s) => s.id === serviceParam);
    if (isValid) onService(serviceParam);
  }, [searchParams, t.servicesData, onService]);

  return null;
}

function ContactPageContent() {
  const { locale, t, dir } = useLanguage();
  const cp = t.contactPage;
  const offices = cp.offices;
  const whyUs = pickLocalized(whyContactUs, locale);

  const [form, setForm] = useState({ name: "", email: "", phone: "", service: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleServicePrefill = useCallback((serviceId: string) => {
    setForm((prev) => (prev.service === serviceId ? prev : { ...prev, service: serviceId }));
    setStep(3);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const { submitContact } = await import("../lib/api");
      await submitContact({
        name: form.name,
        email: form.email,
        phone: form.phone || undefined,
        service: form.service || undefined,
        message: form.message,
        locale,
      });
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("Contact submission failed:", err);
      alert(tx(locale, { ar: "تعذر إرسال الرسالة. حاول مرة أخرى.", en: "Could not send your message. Please try again." }));
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div style={{ minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, background: "var(--bg)" }}>
        <Reveal direction="down">
          <div style={{
            textAlign: "center",
            background: "var(--bg-card)",
            borderRadius: 0,
            padding: "72px 56px",
            border: "1.5px solid var(--border)",
            maxWidth: 520,
            boxShadow: "0 24px 60px rgba(99,102,241,0.15)",
          }}>
            <div style={{ marginBottom: 24, animation: "pop-in 0.5s cubic-bezier(0.16,1,0.3,1)", color: "#000", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <CheckCircle size={72} strokeWidth={1.5} />
            </div>
            <h2 style={{ fontWeight: 900, fontSize: 28, color: "var(--text)", marginBottom: 14 }}>{t.common.successTitle}</h2>
            <p style={{ color: "var(--text-muted)", fontSize: 16, lineHeight: 1.85, marginBottom: 36 }}>
              {tx(locale, {
                ar: `شكراً ${form.name}، ${t.common.successDesc}`,
                en: `Thank you ${form.name}, ${t.common.successDesc}`,
              })}
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <button onClick={() => { setSubmitted(false); setForm({ name: "", email: "", phone: "", service: "", message: "" }); setStep(1); }}
                style={{
                  border: "2px solid #0a0a0a", cursor: "pointer",
                  background: "#0a0a0a",
                  color: "#fff", padding: "14px 32px", borderRadius: 0,
                  fontWeight: 700, fontSize: 15.5,
                  fontFamily: "inherit",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
                  transition: "all 0.25s ease",
                }}
                className="success-btn"
              >
                {t.common.sendAnother}
              </button>
              <Link href="/" style={{
                textDecoration: "none",
                border: "1.5px solid var(--border)",
                background: "var(--bg)",
                color: "var(--text)",
                padding: "14px 28px", borderRadius: 0,
                fontWeight: 600, fontSize: 15.5,
                display: "inline-block",
                transition: "all 0.25s ease",
              }}>
                {tx(locale, { ar: "← العودة للرئيسية", en: "← Back to Home" })}
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    );
  }

  const inputStyle = (fieldName: string): React.CSSProperties => ({
    width: "100%", padding: "14px 18px",
    border: `1.5px solid ${focusedField === fieldName ? "var(--primary)" : "var(--border)"}`,
    borderRadius: 0, fontSize: 15,
    fontFamily: "inherit", outline: "none",
    background: focusedField === fieldName ? "rgba(99,102,241,0.04)" : "var(--bg)",
    color: "var(--text)",
    transition: "all 0.25s ease",
    direction: dir,
    textAlign: dir === "rtl" ? "right" : "left",
    boxShadow: focusedField === fieldName ? "0 0 0 3px rgba(99,102,241,0.12)" : "none",
  });

  return (
    <div>
      <Suspense fallback={null}>
        <ServicePrefill onService={handleServicePrefill} />
      </Suspense>
      {/* ── Hero ─────────────────────────────── */}
      <section style={{
        background: "#0a0a0a",
        padding: "100px 24px 80px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
        borderBottom: "3px solid var(--primary)",
      }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(99,102,241,0.15) 1.5px, transparent 1.5px)", backgroundSize: "36px 36px", pointerEvents: "none" }} />
        <div style={{ position: "relative" }}>
          <Reveal direction="down">
            <span style={{
              display: "inline-block",
              background: "#56565f",
              border: "1px solid #56565f",
              color: "#fff",
              fontWeight: 700, fontSize: 13,
              padding: "6px 20px", borderRadius: 0, marginBottom: 20,
            }}>{cp.badge}</span>
          </Reveal>
          <Reveal direction="up" delay={100}>
            <h1 style={{ fontSize: "clamp(2.4rem, 5vw, 4rem)", fontWeight: 900, color: "#fff", marginBottom: 20, lineHeight: 1.1 }}>
              {cp.title}
            </h1>
          </Reveal>
          <Reveal direction="up" delay={200}>
            <p style={{ color: "#94a3b8", fontSize: 17.5, maxWidth: 540, margin: "0 auto", lineHeight: 1.7 }}>
              {cp.subtext}
            </p>
          </Reveal>

          {/* Office cities */}
          <Reveal direction="up" delay={350}>
            <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 48, flexWrap: "wrap" }}>
              {offices.map((office, i) => (
                <div key={i} style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 14, padding: "12px 22px",
                  display: "flex", alignItems: "center", gap: 10,
                  transition: "all 0.25s ease",
                }}
                className="office-chip"
                >
                  <MapPin size={20} strokeWidth={1.5} style={{ color: "#56565f", flexShrink: 0 }} />
                  <div style={{ textAlign: "start" }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: "#fff" }}>{office.title}</div>
                    <div style={{ fontSize: 11, color: "#64748b" }}>{office.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Why Contact Us ────────────────────── */}
      <section style={{ padding: "80px 24px", background: "var(--bg-card)", borderBottom: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 28 }}>
            {whyUs.map((item, i) => (
              <Reveal key={i} direction="up" delay={i * 80}>
                <div style={{
                  display: "flex", alignItems: "flex-start", gap: 16,
                  padding: "20px 0",
                }}>
                  <div style={{
                    width: 44, height: 44, flexShrink: 0,
                    background: "var(--primary-light)",
                    borderRadius: 12, display: "flex", alignItems: "center",
                    justifyContent: "center", color: "var(--primary)",
                  }}>
                    {whyUsIcons[item.icon] || null}
                  </div>
                  <div>
                    <h3 style={{ fontWeight: 800, fontSize: 16, color: "var(--text)", marginBottom: 6 }}>{item.title}</h3>
                    <p style={{ color: "var(--text-muted)", fontSize: 13.5, lineHeight: 1.75 }}>{item.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact Form + Info ───────────────── */}
      <section style={{ padding: "80px 24px 100px", background: "var(--bg)" }}>
        <div style={{
          maxWidth: 1100, margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1.8fr",
          gap: 52,
          alignItems: "start",
        }} className="contact-split">

          {/* Info Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <Reveal direction="right">
              <h3 style={{ fontWeight: 800, fontSize: 19, color: "var(--text)", marginBottom: 4, textAlign: "start" }}>
                {cp.infoTitle}
              </h3>
            </Reveal>
            <Reveal direction="right" delay={50}>
              <div style={{
                background: "var(--bg-card)",
                borderRadius: 0, padding: "20px 22px",
                border: "1px solid var(--border)",
                display: "flex", alignItems: "flex-start", gap: 14,
                textAlign: "start",
                transition: "all 0.3s ease",
              }}
              className="info-card"
              >
                <div style={{
                  width: 44, height: 44, flexShrink: 0,
                  background: "var(--primary-light)",
                  borderRadius: 12, display: "flex", alignItems: "center",
                  justifyContent: "center",
                }}>
                  <Mail size={22} strokeWidth={1.5} style={{ color: "var(--primary)" }} />
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 12.5, color: "var(--text-muted)", marginBottom: 4 }}>
                    {tx(locale, { ar: "البريد الإلكتروني", en: "Email Address" })}
                  </div>
                  <a href={`mailto:${cp.email}`} style={{ fontWeight: 700, fontSize: 15.5, color: "var(--text)", textDecoration: "none", direction: "ltr", display: "inline-block" }}>
                    {cp.email}
                  </a>
                </div>
              </div>
            </Reveal>
            {offices.map((office: OfficeItem, i: number) => (
              <Reveal key={i} delay={(i + 1) * 100} direction="right">
                <div style={{
                  background: "var(--bg-card)",
                  borderRadius: 0, padding: "20px 22px",
                  border: "1px solid var(--border)",
                  display: "flex", alignItems: "flex-start", gap: 14,
                  textAlign: "start",
                  transition: "all 0.3s ease",
                }}
                className="info-card"
                >
                  <div style={{
                    width: 44, height: 44, flexShrink: 0,
                    background: "var(--primary-light)",
                    borderRadius: 12, display: "flex", alignItems: "center",
                    justifyContent: "center",
                  }}>
                    <MapPin size={22} strokeWidth={1.5} style={{ color: "var(--primary)" }} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <div style={{ fontWeight: 800, fontSize: 15.5, color: "var(--text)" }}>{office.title}</div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 12.5, color: "var(--text-muted)", marginBottom: 4 }}>
                        {tx(locale, { ar: "عنوان المكتب", en: "Office Address" })}
                      </div>
                      <div style={{ fontWeight: 700, fontSize: 14.5, color: "var(--text)", lineHeight: 1.6 }}>{office.address}</div>
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 12.5, color: "var(--text-muted)", marginBottom: 4 }}>
                        {tx(locale, { ar: "رقم الهاتف", en: "Phone Number" })}
                      </div>
                      <a href={`tel:${office.phone.replace(/\s/g, "")}`} style={{ fontWeight: 700, fontSize: 15.5, color: "var(--text)", textDecoration: "none", direction: "ltr", display: "inline-block" }}>
                        {office.phone}
                      </a>
                    </div>
                    {"email" in office && office.email && (
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 12.5, color: "var(--text-muted)", marginBottom: 4 }}>
                          {tx(locale, { ar: "البريد الإلكتروني", en: "Email Address" })}
                        </div>
                        <a href={`mailto:${office.email}`} style={{ fontWeight: 700, fontSize: 14.5, color: "var(--text)", textDecoration: "none", direction: "ltr", display: "inline-block" }}>
                          {office.email}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}

            {/* Social Links */}
            <Reveal direction="right" delay={400}>
              <div style={{ marginTop: 8 }}>
                <p style={{ fontWeight: 700, fontSize: 13.5, color: "var(--text-muted)", marginBottom: 16 }}>
                  {tx(locale, { ar: "تابعنا على:", en: "Follow us on:" })}
                </p>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {[
                    { name: "Instagram", url: "https://www.instagram.com/globaluntoldstory?igsh=dGpjdDJ6cHRkMHB2" },
                    { name: "Facebook", url: "https://www.facebook.com/share/1YefpKiSk8/?mibextid=wwXIfr" },
                    { name: "LinkedIn", url: "https://www.linkedin.com/company/the-untold-story-film-production-services/" },
                    { name: "Vimeo", url: "https://vimeo.com/globaluntoldstory" },
                  ].map((sn, i) => (
                    <a key={i} href={sn.url} target="_blank" rel="noreferrer" style={{
                      textDecoration: "none",
                      background: "var(--bg-card)", border: "1px solid var(--border)",
                      color: "var(--text-muted)",
                      padding: "8px 16px", borderRadius: 0,
                      fontSize: 13, fontWeight: 600,
                      transition: "all 0.25s ease",
                    }}
                    className="social-link"
                    >{sn.name}</a>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          {/* Form */}
          <Reveal direction="left" delay={150}>
            <form onSubmit={handleSubmit} style={{
              background: "var(--bg-card)",
              borderRadius: 2, padding: "44px 40px",
              border: "1px solid var(--border)",
              boxShadow: "var(--shadow-lg)",
              display: "flex", flexDirection: "column", gap: 24,
            }}
            className="contact-form"
            >
              {/* Step indicator */}
              <div style={{ display: "flex", gap: 8, marginBottom: 4 }}>
                {[1, 2, 3].map(s => (
                  <div key={s} style={{
                    flex: 1, height: 4, borderRadius: 0,
                    background: s <= step ? "linear-gradient(90deg, var(--primary), var(--primary-dark))" : "var(--border)",
                    transition: "background 0.4s ease",
                  }} />
                ))}
              </div>
              <p style={{ fontSize: 12.5, color: "var(--text-muted)", marginBottom: 8 }}>
                {tx(locale, { ar: `الخطوة ${step} من 3`, en: `Step ${step} of 3` })}
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }} className="form-row-2">
                <div style={{ textAlign: "start" }}>
                  <label style={{ display: "block", fontWeight: 700, fontSize: 13.5, color: "var(--text)", marginBottom: 8 }}>{cp.labels.name} *</label>
                  <input required style={inputStyle("name")} placeholder={cp.placeholders.name}
                    value={form.name} onChange={e => { setForm({ ...form, name: e.target.value }); if (form.name.length > 2) setStep(2); }}
                    onFocus={() => setFocusedField("name")} onBlur={() => setFocusedField(null)}
                    className="form-input" />
                </div>
                <div style={{ textAlign: "start" }}>
                  <label style={{ display: "block", fontWeight: 700, fontSize: 13.5, color: "var(--text)", marginBottom: 8 }}>{cp.labels.email} *</label>
                  <input required type="email" style={inputStyle("email")} placeholder={cp.placeholders.email}
                    value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                    onFocus={() => setFocusedField("email")} onBlur={() => setFocusedField(null)}
                    className="form-input" />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }} className="form-row-2">
                <div style={{ textAlign: "start" }}>
                  <label style={{ display: "block", fontWeight: 700, fontSize: 13.5, color: "var(--text)", marginBottom: 8 }}>{cp.labels.phone}</label>
                  <input style={inputStyle("phone")} placeholder={cp.placeholders.phone}
                    value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                    onFocus={() => setFocusedField("phone")} onBlur={() => setFocusedField(null)}
                    className="form-input" />
                </div>
                <div style={{ textAlign: "start" }}>
                  <label style={{ display: "block", fontWeight: 700, fontSize: 13.5, color: "var(--text)", marginBottom: 8 }}>{cp.labels.service}</label>
                  <select style={{ ...inputStyle("service") }}
                    value={form.service} onChange={e => { setForm({ ...form, service: e.target.value }); if (e.target.value) setStep(3); }}
                    onFocus={() => setFocusedField("service")} onBlur={() => setFocusedField(null)}
                    className="form-input">
                    <option value="">{cp.labels.chooseService}</option>
                    {t.servicesData.map((s) => (
                      <option key={s.id} value={s.id}>{s.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ textAlign: "start" }}>
                <label style={{ display: "block", fontWeight: 700, fontSize: 13.5, color: "var(--text)", marginBottom: 8 }}>{cp.labels.message} *</label>
                <textarea required rows={5} style={{ ...inputStyle("message"), resize: "vertical" }}
                  placeholder={cp.placeholders.message}
                  value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                  onFocus={() => setFocusedField("message")} onBlur={() => setFocusedField(null)}
                  className="form-input" />
              </div>

              <button type="submit" disabled={loading} style={{
                border: "none", cursor: loading ? "not-allowed" : "pointer",
                background: loading ? "var(--border)" : "linear-gradient(135deg, var(--primary), var(--primary-dark))",
                color: loading ? "var(--text-muted)" : "#fff",
                padding: "17px 32px",
                borderRadius: 1,
                fontWeight: 800, fontSize: 16.5,
                fontFamily: "inherit",
                boxShadow: loading ? "none" : "0 6px 24px rgba(99,102,241,0.32)",
                transition: "all 0.25s ease",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              }}
              className="submit-btn"
              >
                {loading ? (
                  <>
                    <div style={{ width: 18, height: 18, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", borderRadius: "0%", animation: "spin 0.8s linear infinite" }} />
                    {t.common.loading}
                  </>
                ) : (
                  `${t.common.submitBtn} ${tx(locale, { ar: "←", en: "→" })}`
                )}
              </button>
            </form>
          </Reveal>
        </div>
      </section>

      {/* ── Map / Locations Banner ────────────── */}
      <section style={{
        padding: "80px 24px",
        background: "linear-gradient(135deg, #f8fafc, #eef2ff)",
        borderTop: "1px solid var(--border)",
      }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <Reveal direction="down">
            <h2 style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)", fontWeight: 900, color: "var(--text)", marginBottom: 16 }}>
              {cp.officesSectionTitle}
            </h2>
          </Reveal>
          <Reveal direction="up" delay={100}>
            <p style={{ color: "var(--text-muted)", fontSize: 16, marginBottom: 52 }}>
              {cp.officesSectionSubtext}
            </p>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24, maxWidth: 1080, margin: "0 auto" }}>
            {offices.map((office, i) => (
              <Reveal key={i} direction="up" delay={i * 120}>
                <div style={{
                  background: i === 0
                    ? "linear-gradient(135deg, var(--primary), var(--primary-dark))"
                    : "var(--bg-card)",
                  borderRadius: 0, padding: "36px 28px",
                  border: i === 0 ? "none" : "1.5px solid var(--border)",
                  boxShadow: i === 0 ? "0 12px 36px rgba(99,102,241,0.3)" : "var(--shadow-sm)",
                  textAlign: "center",
                  transition: "all 0.35s ease",
                }}
                className="office-card"
                >
                  <div style={{ fontSize: 44, marginBottom: 16, color: i === 0 ? "#fff" : "var(--primary)" }}>
                    <Building size={44} strokeWidth={1.2} />
                  </div>
                  <h3 style={{ fontWeight: 900, fontSize: 20, color: i === 0 ? "#fff" : "var(--text)", marginBottom: 6 }}>{office.title}</h3>
                  <p style={{ color: i === 0 ? "rgba(255,255,255,0.75)" : "var(--text-muted)", fontSize: 14, marginBottom: 10, lineHeight: 1.6 }}>{office.address}</p>
                  <a href={`tel:${office.phone.replace(/\s/g, "")}`} style={{
                    color: i === 0 ? "#fff" : "var(--primary)",
                    fontWeight: 700, fontSize: 15, textDecoration: "none",
                    direction: "ltr", display: "inline-block", marginBottom: 14,
                  }}>{office.phone}</a>
                  <br />
                  <span style={{
                    background: i === 0 ? "rgba(255,255,255,0.2)" : "var(--primary-light)",
                    color: i === 0 ? "#fff" : "var(--primary)",
                    border: i === 0 ? "1px solid rgba(255,255,255,0.3)" : "none",
                    padding: "5px 14px", borderRadius: 0,
                    fontSize: 12, fontWeight: 700,
                  }}>{office.status}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        @keyframes pop-in { from { transform: scale(0.5); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes spin { to { transform: rotate(360deg); } }
        .info-card:hover { border-color: var(--primary) !important; transform: translateX(4px); box-shadow: var(--shadow-sm); }
        .social-link:hover { border-color: var(--primary) !important; color: var(--primary) !important; background: var(--primary-light) !important; }
        .office-chip:hover { background: rgba(255,255,255,0.12) !important; }
        .form-input:focus { border-color: var(--primary) !important; }
        .submit-btn:hover { transform: translateY(-2px) !important; box-shadow: 0 10px 28px rgba(99,102,241,0.45) !important; }
        .success-btn:hover { transform: translateY(-2px); }
        .office-card:hover { transform: translateY(-6px); }
        @media (max-width: 768px) {
          .contact-split { grid-template-columns: 1fr !important; gap: 40px !important; }
          .form-row-2 { grid-template-columns: 1fr !important; gap: 20px !important; }
          .contact-form { padding: 28px 20px !important; }
        }
      `}</style>
    </div>
  );
}

export default function ContactPage() {
  return <ContactPageContent />;
}
