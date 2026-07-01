"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "../../components/LanguageContext";
import Reveal from "../../components/Reveal";
import { fetchService, resolveMediaUrl } from "../../lib/api";
import type { ServiceDetail, ApiLocale } from "../../lib/api";
import { getServiceImageUrl } from "../../lib/serviceImages";

export default function ServiceDetailClient() {
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug[0] : (params.slug as string);
  const { locale, t } = useLanguage();
  const [service, setService] = useState<ServiceDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", service: "", message: "" });

  const sp = t.servicesPage;
  const qf = sp.quoteForm;

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setNotFound(false);
    fetchService(slug, locale as ApiLocale)
      .then((data) => {
        setService(data);
        setForm((prev) => ({
          ...prev,
          service: String(data.slug ?? data.id ?? slug),
        }));
        setLoading(false);
      })
      .catch(() => {
        setNotFound(true);
        setLoading(false);
      });
  }, [slug, locale]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { submitQuote } = await import("../../lib/api");
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
      alert(
        locale === "ar"
          ? "تعذر إرسال الطلب. حاول مرة أخرى."
          : "Could not submit your request. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div style={{
        minHeight: "60vh", display: "flex",
        alignItems: "center", justifyContent: "center",
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: 48, height: 48, border: "3px solid var(--border)",
            borderTopColor: "var(--primary)", borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
            margin: "0 auto 20px",
          }} />
          <p style={{ color: "var(--text-muted)", fontSize: 16 }}>
            {locale === "ar" ? "جارٍ التحميل..." : "Loading..."}
          </p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (notFound || !service) {
    return (
      <div style={{
        minHeight: "60vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: 24, padding: "40px 24px",
      }}>
        <div style={{ fontSize: 72 }}>🔍</div>
        <h1 style={{ color: "var(--text)", fontSize: 28, fontWeight: 900, textAlign: "center" }}>
          {locale === "ar" ? "الخدمة غير موجودة" : "Service Not Found"}
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: 16 }}>
          {locale === "ar"
            ? "لم نتمكن من العثور على هذه الخدمة."
            : "We couldn't find this service."}
        </p>
        <Link href="/services" style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "linear-gradient(135deg, var(--primary), var(--primary-dark))",
          color: "#fff", padding: "12px 28px", borderRadius: 0,
          fontWeight: 700, fontSize: 15, textDecoration: "none",
        }}>
          ← {locale === "ar" ? "العودة إلى الخدمات" : "Back to Services"}
        </Link>
      </div>
    );
  }

  const serviceId = service.slug ?? service.id;
  const imageUrl = getServiceImageUrl(serviceId, resolveMediaUrl(service.imageUrl) || undefined);

  return (
    <div>
      <section style={{
        background: "#0a0a0a",
        padding: "80px 24px 60px",
        borderBottom: "3px solid var(--primary)",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(rgba(99,102,241,0.15) 1px, transparent 1px)",
          backgroundSize: "40px 40px", pointerEvents: "none",
        }} />

        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
          <Reveal direction="down">
            <Link href="/services" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              color: "#64748b", textDecoration: "none",
              fontWeight: 600, fontSize: 14, marginBottom: 32,
              transition: "color 0.2s ease",
            }} className="back-link">
              ← {locale === "ar" ? "العودة إلى الخدمات" : "Back to Services"}
            </Link>
          </Reveal>

          <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
            <span style={{
              background: "rgba(99,102,241,0.25)",
              border: "1px solid rgba(99,102,241,0.5)",
              color: "#a5b4fc", padding: "5px 16px",
              borderRadius: 0, fontSize: 12, fontWeight: 700,
            }}>
              {service.icon} {locale === "ar" ? "خدمة" : "Service"}
            </span>
          </div>

          <Reveal direction="up" delay={100}>
            <h1 style={{
              fontSize: "clamp(1.8rem, 4vw, 3.2rem)", fontWeight: 900,
              color: "#fff", lineHeight: 1.15, marginBottom: 20,
            }}>
              {service.title}
            </h1>
          </Reveal>

          {service.shortDesc && (
            <Reveal direction="up" delay={200}>
              <p style={{ color: "#94a3b8", fontSize: 18, lineHeight: 1.8, maxWidth: 760 }}>
                {service.shortDesc}
              </p>
            </Reveal>
          )}
        </div>
      </section>

      {imageUrl && (
        <Reveal direction="up">
          <div style={{ background: "var(--bg-muted)", width: "100%", lineHeight: 0 }}>
            <Image
              src={imageUrl}
              alt={service.title}
              width={1920}
              height={1080}
              unoptimized
              style={{ width: "100%", height: "auto", display: "block" }}
            />
          </div>
        </Reveal>
      )}

      <section style={{ padding: "72px 24px 100px", background: "var(--bg)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 340px",
            gap: 52, alignItems: "start",
          }} className="service-detail-grid">

            <div>
              {service.fullDesc ? (
                <Reveal direction="up">
                  <div
                    className="service-body"
                    style={{
                      color: "var(--text-muted)", fontSize: 16.5,
                      lineHeight: 1.9, marginBottom: 36,
                    }}
                    dangerouslySetInnerHTML={{ __html: service.fullDesc }}
                  />
                </Reveal>
              ) : (
                <Reveal direction="up">
                  <p style={{ color: "var(--text-muted)", fontSize: 16.5, lineHeight: 1.9 }}>
                    {service.shortDesc}
                  </p>
                </Reveal>
              )}

              {service.features && service.features.length > 0 && (
                <Reveal direction="up" delay={100}>
                  <h3 style={{
                    fontWeight: 800, fontSize: 18, color: "var(--text)",
                    marginBottom: 20,
                  }}>
                    {locale === "ar" ? "ما نقدمه" : "What We Offer"}
                  </h3>
                  <ul style={{
                    listStyle: "none", padding: 0, margin: 0,
                    display: "flex", flexDirection: "column", gap: 12,
                  }}>
                    {service.features.map((feature, i) => (
                      <li key={i} style={{
                        display: "flex", alignItems: "flex-start", gap: 12,
                        background: "var(--bg-card)", border: "1px solid var(--border)",
                        padding: "14px 18px",
                      }}>
                        <span style={{ color: "var(--primary)", fontWeight: 800 }}>✓</span>
                        <span style={{ color: "var(--text-muted)", fontSize: 15, lineHeight: 1.7 }}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </Reveal>
              )}
            </div>

            <Reveal direction="left" delay={150}>
              <div style={{
                background: "var(--bg-card)", border: "1.5px solid var(--border)",
                borderRadius: 0, padding: "32px 28px",
                boxShadow: "var(--shadow-sm)",
                position: "sticky", top: 24,
              }}>
                <h3 style={{
                  fontWeight: 800, fontSize: 17, color: "var(--text)",
                  marginBottom: 24, paddingBottom: 16,
                  borderBottom: "1px solid var(--border)",
                }}>
                  {locale === "ar" ? "تفاصيل الخدمة" : "Service Details"}
                </h3>

                {service.price && (
                  <div style={{
                    display: "flex", justifyContent: "space-between",
                    alignItems: "flex-start", padding: "13px 0",
                    borderBottom: "1px solid var(--border)", gap: 12,
                  }}>
                    <span style={{ color: "var(--text-muted)", fontSize: 13, fontWeight: 600 }}>
                      {locale === "ar" ? "السعر" : "Pricing"}
                    </span>
                    <span style={{ color: "var(--text)", fontSize: 13.5, fontWeight: 700, textAlign: "end" }}>
                      {service.price}
                    </span>
                  </div>
                )}

                <Link href={`/contact?service=${encodeURIComponent(serviceId)}`} style={{
                  display: "block", textAlign: "center",
                  background: "linear-gradient(135deg, var(--primary), var(--primary-dark))",
                  color: "#fff", padding: "14px 24px", borderRadius: 0,
                  fontWeight: 700, fontSize: 15, textDecoration: "none",
                  marginTop: 28,
                  boxShadow: "0 4px 16px rgba(99,102,241,0.25)",
                  transition: "all 0.25s ease",
                }} className="detail-cta">
                  {t.common.requestService} →
                </Link>

                <Link href="/services" style={{
                  display: "block", textAlign: "center",
                  color: "var(--primary)", padding: "14px 24px",
                  fontWeight: 700, fontSize: 14, textDecoration: "none",
                  marginTop: 12,
                }}>
                  {locale === "ar" ? "عرض جميع الخدمات" : "View All Services"}
                </Link>
              </div>
            </Reveal>
          </div>

          <div style={{
            marginTop: 72, paddingTop: 32, borderTop: "1px solid var(--border)",
          }}>
            <Link href="/services" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              color: "var(--primary)", textDecoration: "none",
              fontWeight: 700, fontSize: 15, transition: "gap 0.2s ease",
            }} className="back-link-bottom">
              ← {locale === "ar" ? "العودة إلى الخدمات" : "Back to Services"}
            </Link>
          </div>
        </div>
      </section>

      <section style={{ padding: "100px 24px", background: "var(--bg-muted)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <Reveal direction="down">
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <h2 style={{ fontSize: "clamp(2rem, 3.5vw, 2.8rem)", fontWeight: 900, color: "var(--text)", marginBottom: 12 }}>
                {sp.quoteTitle}
              </h2>
              <p style={{ color: "var(--text-muted)", fontSize: 16.5, lineHeight: 1.8, maxWidth: 560, margin: "0 auto" }}>
                {sp.quoteSubtext}
              </p>
              <div style={{ display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap", marginTop: 24, fontSize: 15 }}>
                <div>
                  <strong>{sp.quoteEmailLabel}:</strong>{" "}
                  <a href={`mailto:${sp.quoteEmail}`} style={{ color: "var(--primary)" }}>{sp.quoteEmail}</a>
                </div>
                <div>
                  <strong>{sp.quotePhoneLabel}:</strong>{" "}
                  <a
                    href={`tel:${sp.quotePhone.replace(/\s/g, "")}`}
                    style={{ color: "var(--primary)", direction: "ltr", display: "inline-block" }}
                  >
                    {sp.quotePhone}
                  </a>
                </div>
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
              <form
                onSubmit={handleSubmit}
                style={{
                  background: "var(--bg-card)",
                  padding: "40px 36px",
                  border: "1px solid var(--border)",
                  boxShadow: "var(--shadow-lg)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 20,
                }}
              >
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }} className="form-row-2">
                  <div style={{ textAlign: "start" }}>
                    <label style={{ display: "block", fontWeight: 700, fontSize: 13.5, marginBottom: 8 }}>{qf.fullName} *</label>
                    <input
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      style={{ width: "100%", padding: "14px 16px", border: "1.5px solid var(--border)", borderRadius: 0, fontFamily: "inherit", background: "var(--bg)" }}
                    />
                  </div>
                  <div style={{ textAlign: "start" }}>
                    <label style={{ display: "block", fontWeight: 700, fontSize: 13.5, marginBottom: 8 }}>{qf.email} *</label>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      style={{ width: "100%", padding: "14px 16px", border: "1.5px solid var(--border)", borderRadius: 0, fontFamily: "inherit", background: "var(--bg)" }}
                    />
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }} className="form-row-2">
                  <div style={{ textAlign: "start" }}>
                    <label style={{ display: "block", fontWeight: 700, fontSize: 13.5, marginBottom: 8 }}>{qf.phone}</label>
                    <input
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      style={{ width: "100%", padding: "14px 16px", border: "1.5px solid var(--border)", borderRadius: 0, fontFamily: "inherit", background: "var(--bg)" }}
                    />
                  </div>
                  <div style={{ textAlign: "start" }}>
                    <label style={{ display: "block", fontWeight: 700, fontSize: 13.5, marginBottom: 8 }}>{qf.interestedIn}</label>
                    <select
                      value={form.service}
                      onChange={(e) => setForm({ ...form, service: e.target.value })}
                      style={{ width: "100%", padding: "14px 16px", border: "1.5px solid var(--border)", borderRadius: 0, fontFamily: "inherit", background: "var(--bg)" }}
                    >
                      <option value="">{qf.chooseService}</option>
                      {t.servicesData.map((s) => (
                        <option key={s.id} value={s.id}>{s.title}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div style={{ textAlign: "start" }}>
                  <label style={{ display: "block", fontWeight: 700, fontSize: 13.5, marginBottom: 8 }}>{qf.message} *</label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    style={{ width: "100%", padding: "14px 16px", border: "1.5px solid var(--border)", borderRadius: 0, fontFamily: "inherit", background: "var(--bg)", resize: "vertical" }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    border: "none",
                    cursor: submitting ? "not-allowed" : "pointer",
                    background: submitting ? "var(--border)" : "#0a0a0a",
                    color: "#fff",
                    padding: "16px 32px",
                    borderRadius: 0,
                    fontWeight: 800,
                    fontSize: 16,
                    fontFamily: "inherit",
                  }}
                >
                  {submitting ? t.common.loading : qf.submit}
                </button>
              </form>
            </Reveal>
          )}
        </div>
      </section>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .back-link:hover { color: var(--primary) !important; }
        .back-link-bottom:hover { gap: 14px !important; }
        .detail-cta:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(99,102,241,0.4) !important; }
        .service-body p { margin-bottom: 20px; }
        .service-body h2, .service-body h3 { color: var(--text); font-weight: 800; margin: 28px 0 14px; }
        .service-body strong { color: var(--text); font-weight: 700; }
        .service-body ul, .service-body ol { padding-left: 24px; margin-bottom: 20px; }
        .service-body li { margin-bottom: 8px; }
        .service-body a { color: var(--primary); text-decoration: underline; }
        @media (max-width: 900px) {
          .service-detail-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 768px) {
          .form-row-2 { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
