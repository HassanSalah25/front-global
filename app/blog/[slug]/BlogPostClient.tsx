"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "../../components/LanguageContext";
import Reveal from "../../components/Reveal";
import { fetchBlogPost, resolveMediaUrl } from "../../lib/api";
import type { BlogPost, ApiLocale } from "../../lib/api";
import { tx } from "../../lib/i18n";

export default function BlogPostClient() {
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug[0] : (params.slug as string);
  const { locale } = useLanguage();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setNotFound(false);
    fetchBlogPost(slug, locale as ApiLocale)
      .then((data) => {
        setPost(data);
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

  if (notFound || !post) {
    return (
      <div style={{
        minHeight: "60vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: 24, padding: "40px 24px",
      }}>
        <div style={{ fontSize: 72 }}>📭</div>
        <h1 style={{ color: "var(--text)", fontSize: 28, fontWeight: 900, textAlign: "center" }}>
          {tx(locale, { ar: "المقالة غير موجودة", en: "Post Not Found" })}
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: 16 }}>
          {tx(locale, {
            ar: "لم نتمكن من العثور على هذه المقالة.",
            en: "We couldn't find this article.",
          })}
        </p>
        <Link href="/blog" style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "linear-gradient(135deg, var(--primary), var(--primary-dark))",
          color: "#fff", padding: "12px 28px", borderRadius: 0,
          fontWeight: 700, fontSize: 15, textDecoration: "none",
        }}>
          ← {tx(locale, { ar: "العودة إلى المدونة", en: "Back to Blog" })}
        </Link>
      </div>
    );
  }

  const authorName = post.author ?? post.authorName;
  const authorImage = resolveMediaUrl(post.author_image ?? post.authorImage) || undefined;
  const featuredImage = resolveMediaUrl(post.featured_image ?? post.featuredImage) || undefined;
  const readTime =
    post.read_time ?? (post.readTimeMinutes ? `${post.readTimeMinutes} min` : undefined);

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
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(rgba(255,255,255,0.03) 1.5px, transparent 1.5px)",
          backgroundSize: "32px 32px", pointerEvents: "none",
        }} />

        <div style={{ maxWidth: 860, margin: "0 auto", position: "relative" }}>
          <Reveal direction="down">
            <Link href="/blog" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              color: "#64748b", textDecoration: "none",
              fontWeight: 600, fontSize: 14, marginBottom: 32,
              transition: "color 0.2s ease",
            }} className="back-link">
              ← {tx(locale, { ar: "العودة إلى المدونة", en: "Back to Blog" })}
            </Link>
          </Reveal>

          {/* Tags & Category */}
          <div style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap" }}>
            {post.category && (
              <span style={{
                background: "linear-gradient(135deg, var(--primary), var(--primary-dark))",
                color: "#fff", padding: "5px 16px",
                borderRadius: 0, fontSize: 12, fontWeight: 700,
              }}>{post.category}</span>
            )}
            {post.tags?.map((tag, i) => (
              <span key={i} style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "#94a3b8", padding: "5px 14px",
                borderRadius: 0, fontSize: 12, fontWeight: 600,
              }}>{tag}</span>
            ))}
          </div>

          <Reveal direction="up" delay={100}>
            <h1 style={{
              fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 900,
              color: "#fff", lineHeight: 1.2, marginBottom: 24,
            }}>
              {post.title}
            </h1>
          </Reveal>

          {post.excerpt && (
            <Reveal direction="up" delay={180}>
              <p style={{ color: "#94a3b8", fontSize: 17, lineHeight: 1.75, marginBottom: 32 }}>
                {post.excerpt}
              </p>
            </Reveal>
          )}

          <Reveal direction="up" delay={250}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
              {authorImage && (
                <Image
                  src={authorImage} alt={authorName ?? ""}
                  width={44} height={44} unoptimized
                  style={{
                    borderRadius: "0%", objectFit: "cover",
                    border: "2px solid var(--primary-light)",
                  }}
                />
              )}
              <div>
                {authorName && (
                  <div style={{ fontWeight: 700, fontSize: 14, color: "#fff" }}>{authorName}</div>
                )}
                <div style={{ fontSize: 12, color: "#64748b" }}>
                  {post.date}{readTime ? ` · ${readTime}` : ""}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Featured Image ───────────────────────────────── */}
      {featuredImage && (
        <div style={{ background: "var(--bg-muted)", overflow: "hidden" }}>
          <div style={{ maxWidth: 860, margin: "0 auto", position: "relative", height: 440 }}>
            <Image
              src={featuredImage} alt={post.title}
              fill unoptimized
              style={{ objectFit: "cover" }}
            />
          </div>
        </div>
      )}

      {/* ── Body Content ─────────────────────────────────── */}
      <section style={{ padding: "64px 24px 100px", background: "var(--bg)" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          {post.body ? (
            <Reveal direction="up">
              <div
                className="blog-body"
                style={{
                  color: "var(--text-muted)",
                  fontSize: 17, lineHeight: 1.9,
                }}
                dangerouslySetInnerHTML={{ __html: post.body }}
              />
            </Reveal>
          ) : (
            <p style={{ color: "var(--text-muted)", fontSize: 17, lineHeight: 1.9 }}>
              {post.excerpt}
            </p>
          )}

          {/* Footer nav */}
          <div style={{
            marginTop: 72, paddingTop: 32,
            borderTop: "1px solid var(--border)",
            display: "flex", alignItems: "center",
            justifyContent: "space-between", flexWrap: "wrap", gap: 16,
          }}>
            <Link href="/blog" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              color: "var(--primary)", textDecoration: "none",
              fontWeight: 700, fontSize: 15,
              transition: "gap 0.2s ease",
            }} className="back-link-bottom">
              ← {tx(locale, { ar: "العودة إلى المدونة", en: "Back to Blog" })}
            </Link>
            <Link href="/contact" style={{
              background: "linear-gradient(135deg, var(--primary), var(--primary-dark))",
              color: "#fff", padding: "12px 28px", borderRadius: 0,
              fontWeight: 700, fontSize: 14, textDecoration: "none",
              boxShadow: "0 4px 16px rgba(99,102,241,0.25)",
              transition: "all 0.25s ease",
            }} className="contact-cta">
              {tx(locale, { ar: "تواصل معنا", en: "Contact Us" })} →
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .back-link:hover { color: var(--primary) !important; }
        .back-link-bottom:hover { gap: 14px !important; }
        .contact-cta:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(99,102,241,0.4) !important; }
        .blog-body h1, .blog-body h2, .blog-body h3, .blog-body h4 {
          color: var(--text); font-weight: 800; margin: 36px 0 16px; line-height: 1.3;
        }
        .blog-body h1 { font-size: clamp(1.6rem, 3vw, 2rem); }
        .blog-body h2 { font-size: clamp(1.3rem, 2.5vw, 1.7rem); }
        .blog-body h3 { font-size: clamp(1.1rem, 2vw, 1.35rem); }
        .blog-body p { margin-bottom: 22px; }
        .blog-body a { color: var(--primary); text-decoration: underline; }
        .blog-body ul, .blog-body ol { padding-left: 28px; margin-bottom: 22px; }
        .blog-body li { margin-bottom: 10px; }
        .blog-body img { max-width: 100%; border-radius: 8px; margin: 28px 0; }
        .blog-body blockquote {
          border-left: 3px solid var(--primary); padding-left: 20px;
          color: var(--text-muted); font-style: italic;
          margin: 28px 0; background: var(--bg-card);
          padding: 20px 20px 20px 24px;
        }
        .blog-body code {
          background: var(--bg-muted); padding: 2px 7px;
          border-radius: 4px; font-size: 0.88em; color: var(--primary);
        }
        .blog-body pre {
          background: var(--bg-muted); padding: 24px;
          border-radius: 8px; overflow-x: auto; margin: 28px 0;
          border: 1px solid var(--border);
        }
        .blog-body pre code { background: none; padding: 0; color: inherit; }
        .blog-body strong { color: var(--text); font-weight: 700; }
        .blog-body hr { border: none; border-top: 1px solid var(--border); margin: 36px 0; }
      `}</style>
    </div>
  );
}
