"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "../../components/LanguageContext";
import Reveal from "../../components/Reveal";
import { fetchPortfolioItem, resolveMediaUrl } from "../../lib/api";
import type { PortfolioItem, ApiLocale } from "../../lib/api";
import { tx } from "../../lib/i18n";

export default function PortfolioDetailClient() {
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug[0] : (params.slug as string);
  const { locale } = useLanguage();
  const [item, setItem] = useState<PortfolioItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setNotFound(false);
    fetchPortfolioItem(slug, locale as ApiLocale)
      .then((data) => {
        setItem(data);
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
            {tx(locale, { ar: "جارٍ التحميل...", en: "Loading..." })}
          </p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (notFound || !item) {
    return (
      <div style={{
        minHeight: "60vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: 24, padding: "40px 24px",
      }}>
        <div style={{ fontSize: 72 }}>🗂️</div>
        <h1 style={{ color: "var(--text)", fontSize: 28, fontWeight: 900, textAlign: "center" }}>
          {tx(locale, { ar: "المشروع غير موجود", en: "Project Not Found" })}
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: 16 }}>
          {tx(locale, {
            ar: "لم نتمكن من العثور على هذا المشروع.",
            en: "We couldn't find this project.",
          })}
        </p>
        <Link href="/portfolio" style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "linear-gradient(135deg, var(--primary), var(--primary-dark))",
          color: "#fff", padding: "12px 28px", borderRadius: 0,
          fontWeight: 700, fontSize: 15, textDecoration: "none",
        }}>
          ← {tx(locale, { ar: "العودة إلى الأعمال", en: "Back to Portfolio" })}
        </Link>
      </div>
    );
  }

  const featuredImg = resolveMediaUrl(
    item.featured_image ?? item.featuredImage ?? item.image ?? item.img
  );

  return (
    <div>
      {/* ── Hero ──────────────────────────────────────────── */}
      <section style={{
        background: "#0a0a0a",
        padding: "80px 24px 60px",
        borderBottom: "3px solid var(--primary)",
        position: "relative",
        overflow: "hidden",
      }}>
        {[...Array(4)].map((_, i) => (
          <div key={i} style={{
            position: "absolute",
            width: `${40 + i * 24}px`, height: `${40 + i * 24}px`,
            background: `rgba(${i % 2 === 0 ? "99,102,241" : "220,37,40"},0.08)`,
            top: `${20 + i * 18}%`, left: `${8 + i * 22}%`,
            animation: `float-shape ${5 + i}s ease-in-out infinite alternate`,
            pointerEvents: "none",
          }} />
        ))}

        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
          <Reveal direction="down">
            <Link href="/portfolio" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              color: "#64748b", textDecoration: "none",
              fontWeight: 600, fontSize: 14, marginBottom: 32,
              transition: "color 0.2s ease",
            }} className="back-link">
              ← {tx(locale, { ar: "العودة إلى الأعمال", en: "Back to Portfolio" })}
            </Link>
          </Reveal>

          <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
            {item.category && (
              <span style={{
                background: "linear-gradient(160deg, #dc2528 0%, #000 50%)",
                color: "#fff", padding: "5px 16px",
                borderRadius: 0, fontSize: 12, fontWeight: 700,
              }}>{item.category}</span>
            )}
          </div>

          <Reveal direction="up" delay={100}>
            <h1 style={{
              fontSize: "clamp(1.8rem, 4vw, 3.2rem)", fontWeight: 900,
              color: "#fff", lineHeight: 1.15, marginBottom: 20,
            }}>
              {item.title}
            </h1>
          </Reveal>

          {item.client && (
            <Reveal direction="up" delay={200}>
              <p style={{ color: "#94a3b8", fontSize: 17, fontWeight: 600 }}>
                {tx(locale, { ar: "العميل:", en: "Client:" })}{" "}
                <span style={{ color: "#e2e8f0" }}>{item.client}</span>
              </p>
            </Reveal>
          )}
        </div>
      </section>

      {/* ── Featured Image ───────────────────────────────── */}
      {featuredImg && (
        <div style={{ background: "var(--bg-muted)", overflow: "hidden" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", height: 500 }}>
            <Image
              src={featuredImg} alt={item.title}
              fill unoptimized
              style={{ objectFit: "cover" }}
            />
          </div>
        </div>
      )}

      {/* ── Main Content ─────────────────────────────────── */}
      <section style={{ padding: "72px 24px 100px", background: "var(--bg)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 340px",
            gap: 52, alignItems: "start",
          }} className="portfolio-detail-grid">

            {/* Left: results + description + metrics */}
            <div>
              {item.results && (
                <Reveal direction="up">
                  <div style={{
                    color: "#000",
                    padding: "16px 24px", borderRadius: 0, fontSize: 15.5, fontWeight: 700,
                    display: "flex", alignItems: "flex-start", gap: 12,
                    marginBottom: 36, border: "1px solid rgba(99,102,241,0.2)",
                  }}>
                    {/* <span style={{ fontSize: 22, flexShrink: 0 }}>📈</span> */}
                    <span>{item.results}</span>
                  </div>
                </Reveal>
              )}

              {item.description && (
                <Reveal direction="up" delay={100}>
                  <div
                    className="portfolio-body"
                    style={{
                      color: "var(--text-muted)", fontSize: 16.5,
                      lineHeight: 1.9, marginBottom: 36,
                    }}
                    dangerouslySetInnerHTML={{ __html: item.description }}
                  />
                </Reveal>
              )}

              {/* Key Metrics */}
              {item.metrics && item.metrics.length > 0 && (
                <Reveal direction="up" delay={200}>
                  <h3 style={{
                    fontWeight: 800, fontSize: 18, color: "var(--text)",
                    marginBottom: 20,
                  }}>
                    {tx(locale, { ar: "النتائج الرئيسية", en: "Key Results" })}
                  </h3>
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                    gap: 18,
                  }}>
                    {item.metrics.map((m, i) => (
                      <div key={i} style={{
                        background: "var(--bg-card)", border: "1px solid var(--border)",
                        borderTop: "3px solid var(--primary)",
                        padding: "24px 20px", textAlign: "center", borderRadius: 0,
                      }}>
                        <div style={{
                          fontSize: 28, fontWeight: 900,
                          color: "var(--primary)", marginBottom: 8,
                        }}>{m.value}</div>
                        <div style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 600 }}>
                          {m.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </Reveal>
              )}
            </div>

            {/* Right: Sidebar */}
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
                  {tx(locale, { ar: "تفاصيل المشروع", en: "Project Details" })}
                </h3>

                {[
                  { label: tx(locale, { ar: "العميل", en: "Client" }), value: item.client },
                  { label: tx(locale, { ar: "الفئة", en: "Category" }), value: item.category },
                  { label: tx(locale, { ar: "المدة", en: "Duration" }), value: item.duration },
                  { label: tx(locale, { ar: "الميزانية", en: "Budget" }), value: item.budget },
                ].filter((d) => d.value).map((detail, i) => (
                  <div key={i} style={{
                    display: "flex", justifyContent: "space-between",
                    alignItems: "flex-start", padding: "13px 0",
                    borderBottom: "1px solid var(--border)", gap: 12,
                  }}>
                    <span style={{
                      color: "var(--text-muted)", fontSize: 13, fontWeight: 600,
                      flexShrink: 0,
                    }}>{detail.label}</span>
                    <span style={{
                      color: "var(--text)", fontSize: 13.5, fontWeight: 700,
                      textAlign: "end",
                    }}>{detail.value}</span>
                  </div>
                ))}

                <Link href="/contact" style={{
                  display: "block", textAlign: "center",
                  background: "linear-gradient(135deg, var(--primary), var(--primary-dark))",
                  color: "#fff", padding: "14px 24px", borderRadius: 0,
                  fontWeight: 700, fontSize: 15, textDecoration: "none",
                  marginTop: 28,
                  boxShadow: "0 4px 16px rgba(99,102,241,0.25)",
                  transition: "all 0.25s ease",
                }} className="detail-cta">
                  {tx(locale, { ar: "ابدأ مشروعاً مشابهاً", en: "Start a Similar Project" })} →
                </Link>
              </div>
            </Reveal>
          </div>

          {/* Gallery */}
          {item.gallery && item.gallery.length > 0 && (
            <div style={{ marginTop: 72 }}>
              <Reveal direction="down">
                <h2 style={{
                  fontWeight: 800, fontSize: 24, color: "var(--text)",
                  marginBottom: 32, paddingBottom: 16, borderBottom: "1px solid var(--border)",
                }}>
                  {tx(locale, { ar: "معرض الصور", en: "Project Gallery" })}
                </h2>
              </Reveal>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: 20,
              }}>
                {item.gallery.map((img, i) => (
                  <Reveal key={i} direction="up" delay={i * 60}>
                    <div style={{
                      position: "relative", height: 220, overflow: "hidden",
                      border: "1px solid var(--border)",
                    }}>
                      <Image
                        src={resolveMediaUrl(img)} alt={`${item.title} ${i + 1}`}
                        fill unoptimized
                        style={{ objectFit: "cover", transition: "transform 0.4s ease" }}
                        className="gallery-img"
                      />
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          )}

          {/* Back link */}
          <div style={{
            marginTop: 72, paddingTop: 32, borderTop: "1px solid var(--border)",
          }}>
            <Link href="/portfolio" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              color: "var(--primary)", textDecoration: "none",
              fontWeight: 700, fontSize: 15, transition: "gap 0.2s ease",
            }} className="back-link-bottom">
              ← {tx(locale, { ar: "العودة إلى الأعمال", en: "Back to Portfolio" })}
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes float-shape {
          from { transform: translateY(0) rotate(0deg); }
          to { transform: translateY(-16px) rotate(12deg); }
        }
        .back-link:hover { color: var(--primary) !important; }
        .back-link-bottom:hover { gap: 14px !important; }
        .gallery-img:hover { transform: scale(1.08) !important; }
        .detail-cta:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(99,102,241,0.4) !important; }
        .portfolio-body p { margin-bottom: 20px; }
        .portfolio-body h2, .portfolio-body h3 { color: var(--text); font-weight: 800; margin: 28px 0 14px; }
        .portfolio-body strong { color: var(--text); font-weight: 700; }
        .portfolio-body ul, .portfolio-body ol { padding-left: 24px; margin-bottom: 20px; }
        .portfolio-body li { margin-bottom: 8px; }
        @media (max-width: 900px) {
          .portfolio-detail-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
