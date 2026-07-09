"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useLanguage } from "./LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <div style={{
      position: "sticky",
      top: 0,
      zIndex: 100,
      boxShadow: "var(--shadow-sm)",
      overflow: "visible",
    }}>
      {t.showAnnouncementBar && t.announcementBar && (
        <div style={{
          background: "#0a0a0a",
          color: "#fff",
          padding: "10px 24px",
          textAlign: "center",
          fontSize: 13.5,
          fontWeight: 600,
          borderBottom: "2px solid var(--primary)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          animation: "fadeIn 0.5s ease"
        }}>
          {t.announcementBar}
        </div>
      )}
      <nav style={{
        background: "var(--bg-card)",
        borderBottom: "1px solid var(--border)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        overflow: "visible",
      }}>
      <div style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: "0 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: 72,
      }}>
        {/* Logo */}
        {/* <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 40, height: 40,
            background: "linear-gradient(135deg, var(--primary), var(--primary-dark))",
            borderRadius: 12,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontWeight: 800, fontSize: 20,
            boxShadow: "0 4px 12px rgba(99, 102, 241, 0.2)",
          }}>A</div>
          <span style={{ fontWeight: 800, fontSize: 22, color: "var(--text)", letterSpacing: "-0.5px" }}>
            Ad<span style={{ color: "var(--primary)" }}>Vision</span>
          </span>
        </Link> */}
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
          <img
            src="/black.png"
            alt="Logo"
            style={{
              height: 50,
              width: "auto",
              maxWidth: 140,
              objectFit: "contain",
              display: "block",
            }}
          />
        </Link>

        {/* Desktop Links */}
        <div style={{ display: "flex", gap: 6, alignItems: "center" }} className="desktop-nav">
          {t.navLinks.map(link => (
            <Link key={link.href} href={link.href} style={{
              textDecoration: "none",
              padding: "8px 16px",
              borderRadius: 0,
              fontSize: 15,
              fontWeight: pathname === link.href ? 700 : 500,
              color: pathname === link.href ? "#0a0a0a" : "var(--text-muted)",
              background: "transparent",
              borderBottom: pathname === link.href ? "2px solid var(--primary)" : "2px solid transparent",
              transition: "all 0.25s ease",
            }}>
              {link.label}
            </Link>
          ))}

          {/* Social Icons */}
          <div className="nav-social" style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <a href="https://www.instagram.com/globaluntoldstory?igsh=dGpjdDJ6cHRkMHB2" target="_blank" rel="noreferrer"
              className="nav-social-icon" aria-label="Instagram" style={{ color: "var(--text-muted)", display: "flex" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <circle cx="12" cy="12" r="5"/>
                <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none"/>
              </svg>
            </a>
            <a href="https://www.facebook.com/theuntoldstory.adv?mibextid=wwXIfr&rdid=af9DWeREpm7V5uTN&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1YefpKiSk8%2F%3Fmibextid%3DwwXIfr#" target="_blank" rel="noreferrer"
              className="nav-social-icon" aria-label="Facebook" style={{ color: "var(--text-muted)", display: "flex" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3V2z"/>
              </svg>
            </a>
            <a href="https://www.linkedin.com/company/the-untold-story-film-production-services/" target="_blank" rel="noreferrer"
              className="nav-social-icon" aria-label="LinkedIn" style={{ color: "var(--text-muted)", display: "flex" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                <rect x="2" y="9" width="4" height="12"/>
                <circle cx="4" cy="4" r="2"/>
              </svg>
            </a>
            <a href="https://vimeo.com/globaluntoldstory" target="_blank" rel="noreferrer"
              className="nav-social-icon" aria-label="Vimeo" style={{ color: "var(--text-muted)", display: "flex" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 6.5c-.1 2.1-1.6 5-4.4 8.7C14.7 19 12.2 21 10 21c-1.1 0-2-1-2.9-3.1-.5-1.9-1-3.7-1.5-5.6-.6-2.1-1.2-3.2-1.8-3.2-.1 0-.6.3-1.3.8L2 9.1c.8-.7 1.6-1.5 2.4-2.2 1.1-.9 1.9-1.4 2.6-1.5 1.4-.1 2.2.8 2.6 2.7.4 2 .7 3.3 1 3.8.5 1.2 1.1 1.8 1.8 1.8.5 0 1.3-.8 2.2-2.5.9-1.6.9-2.7-.1-3.3-.6-.5-1.7-.4-3 .2C11.6 4.7 14.3 2 18 2c2.5 0 3.6 1.5 3.8 4.5H22z"/>
              </svg>
            </a>
          </div>

          {/* Divider */}
          <div style={{ width: 1, height: 20, background: "var(--border)", margin: "0 12px" }} />

          {/* Language Switcher */}
          <LanguageSwitcher variant="desktop" />

          {/* Dashboard Button */}
          {/* <Link href="/dashboard" style={{
            marginInlineStart: 8,
            textDecoration: "none",
            padding: "8px 20px",
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 600,
            color: "#fff",
            background: "linear-gradient(135deg, var(--primary), var(--primary-dark))",
            boxShadow: "0 4px 12px rgba(99, 102, 241, 0.15)",
            transition: "all 0.2s",
          }}>
            {t.common.dashboardBtn}
          </Link> */}
        </div>

        {/* Mobile Actions (Language Toggle + Hamburger) */}
        <div style={{ display: "none", gap: 12, alignItems: "center" }} className="mobile-actions">
          {/* Language Switcher Mobile */}
          <LanguageSwitcher variant="mobile" />

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: "none", border: "none",
              fontSize: 24, cursor: "pointer", color: "var(--text)",
              padding: 4,
            }}
            aria-label="Menu"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{
          background: "var(--bg-card)",
          borderTop: "1px solid var(--border)",
          padding: "16px 24px",
          display: "flex",
          flexDirection: "column",
          gap: 6,
          boxShadow: "var(--shadow-md)",
        }}>
          {t.navLinks.map(link => (
            <Link key={link.href} href={link.href}
              onClick={() => setMenuOpen(false)}
              style={{
                textDecoration: "none",
                padding: "10px 16px",
                borderRadius: 0,
                fontSize: 15,
                fontWeight: pathname === link.href ? 600 : 500,
                color: pathname === link.href ? "var(--primary)" : "var(--text)",
                background: pathname === link.href ? "var(--primary-light)" : "transparent",
              }}>
                {link.label}
            </Link>
          ))}
          {/* Social Icons - Mobile */}
          <div style={{ display: "flex", gap: 16, padding: "16px 16px 8px", borderTop: "1px solid var(--border)", marginTop: 8 }}>
            <a href="https://www.instagram.com/globaluntoldstory?igsh=dGpjdDJ6cHRkMHB2" target="_blank" rel="noreferrer"
              className="nav-social-icon" aria-label="Instagram" style={{ color: "var(--text-muted)", display: "flex" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <circle cx="12" cy="12" r="5"/>
                <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none"/>
              </svg>
            </a>
            <a href="https://www.facebook.com/theuntoldstory.adv?mibextid=wwXIfr&rdid=af9DWeREpm7V5uTN&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1YefpKiSk8%2F%3Fmibextid%3DwwXIfr#" target="_blank" rel="noreferrer"
              className="nav-social-icon" aria-label="Facebook" style={{ color: "var(--text-muted)", display: "flex" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3V2z"/>
              </svg>
            </a>
            <a href="https://www.linkedin.com/company/the-untold-story-film-production-services/" target="_blank" rel="noreferrer"
              className="nav-social-icon" aria-label="LinkedIn" style={{ color: "var(--text-muted)", display: "flex" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                <rect x="2" y="9" width="4" height="12"/>
                <circle cx="4" cy="4" r="2"/>
              </svg>
            </a>
            <a href="https://vimeo.com/globaluntoldstory" target="_blank" rel="noreferrer"
              className="nav-social-icon" aria-label="Vimeo" style={{ color: "var(--text-muted)", display: "flex" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 6.5c-.1 2.1-1.6 5-4.4 8.7C14.7 19 12.2 21 10 21c-1.1 0-2-1-2.9-3.1-.5-1.9-1-3.7-1.5-5.6-.6-2.1-1.2-3.2-1.8-3.2-.1 0-.6.3-1.3.8L2 9.1c.8-.7 1.6-1.5 2.4-2.2 1.1-.9 1.9-1.4 2.6-1.5 1.4-.1 2.2.8 2.6 2.7.4 2 .7 3.3 1 3.8.5 1.2 1.1 1.8 1.8 1.8.5 0 1.3-.8 2.2-2.5.9-1.6.9-2.7-.1-3.3-.6-.5-1.7-.4-3 .2C11.6 4.7 14.3 2 18 2c2.5 0 3.6 1.5 3.8 4.5H22z"/>
              </svg>
            </a>
          </div>
        </div>
      )}

      <style>{`
        .lang-toggle-btn:hover {
          background: #0a0a0a !important;
          border-color: #0a0a0a !important;
          color: #fff !important;
        }
        .desktop-nav a:hover {
          color: #0a0a0a !important;
          border-bottom-color: var(--primary) !important;
        }
        .nav-social-icon:hover {
          color: var(--primary) !important;
          transform: translateY(-1px);
        }
        .nav-social {
          margin-inline-start: 10px;
        }
        @media (max-width: 968px) {
          .nav-social { display: none !important; }
        }
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-actions { display: flex !important; }
        }
      `}</style>
    </nav>
    </div>
  );
}
