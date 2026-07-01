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

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setNotFound(false);
    fetchService(slug, locale as ApiLocale)
      .then((data) => {
        setService(data);
        setLoading(false);
      })
      .catch(() => {
        setNotFound(true);
        setLoading(false);
      });
  }, [slug, locale]);

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
        <div style={{ background: "var(--bg-muted)", overflow: "hidden" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", height: 480 }}>
            <Image
              src={imageUrl} alt={service.title}
              fill unoptimized
              style={{ objectFit: "cover" }}
            />
          </div>
        </div>
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

                <Link href="/contact" style={{
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
      `}</style>
    </div>
  );
}
