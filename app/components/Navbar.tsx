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
          {/* <Link href="/dashboard"
            onClick={() => setMenuOpen(false)}
            style={{
              marginTop: 10,
              textDecoration: "none",
              padding: "11px 16px",
              borderRadius: 0,
              fontSize: 15,
              fontWeight: 600,
              color: "#fff",
              background: "linear-gradient(135deg, var(--primary), var(--primary-dark))",
              textAlign: "center",
            }}>
              {t.common.dashboardBtn}
          </Link> */}
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
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-actions { display: flex !important; }
        }
      `}</style>
    </nav>
    </div>
  );
}
