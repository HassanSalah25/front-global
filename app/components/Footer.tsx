"use client";

import Link from "next/link";
import { useLanguage } from "./LanguageContext";

export default function Footer() {
  const { t, dir } = useLanguage();
  const f = t.footer;

  return (
    <footer style={{
      background: "#0a0a0a",
      color: "#fff",
      padding: "64px 24px 32px",
      marginTop: 0,
      borderTop: "3px solid var(--primary)",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 40,
          marginBottom: 48,
        }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
            <img
              src="/white.png"
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
          <p style={{ color: "#94a3b8", fontSize: 14.5, lineHeight: 1.8, maxWidth: 320 }}>
              {f.brandDesc}
            </p>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <a href={"https://www.instagram.com/globaluntoldstory?igsh=dGpjdDJ6cHRkMHB2"} target="_blank" rel="noreferrer"
              style={{ color: "#64748b", transition: "color 0.25s, transform 0.25s", display: "flex" }}
              className="social-footer-icon"
              aria-label="Instagram">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <circle cx="12" cy="12" r="5"/>
                <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none"/>
              </svg>
            </a>
            <a href={"https://www.facebook.com/theuntoldstory.adv?mibextid=wwXIfr&rdid=af9DWeREpm7V5uTN&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1YefpKiSk8%2F%3Fmibextid%3DwwXIfr#"} target="_blank" rel="noreferrer"
              style={{ color: "#64748b", transition: "color 0.25s, transform 0.25s", display: "flex" }}
              className="social-footer-icon"
              aria-label="Facebook">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3V2z"/>
              </svg>
            </a>
            <a href={"https://www.linkedin.com/company/the-untold-story-film-production-services/"} target="_blank" rel="noreferrer"
              style={{ color: "#64748b", transition: "color 0.25s, transform 0.25s", display: "flex" }}
              className="social-footer-icon"
              aria-label="LinkedIn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                <rect x="2" y="9" width="4" height="12"/>
                <circle cx="4" cy="4" r="2"/>
              </svg>
            </a>
            <a href={"https://vimeo.com/globaluntoldstory"} target="_blank" rel="noreferrer"
              style={{ color: "#64748b", transition: "color 0.25s, transform 0.25s", display: "flex" }}
              className="social-footer-icon"
              aria-label="Vimeo">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 6.5c-.1 2.1-1.6 5-4.4 8.7C14.7 19 12.2 21 10 21c-1.1 0-2-1-2.9-3.1-.5-1.9-1-3.7-1.5-5.6-.6-2.1-1.2-3.2-1.8-3.2-.1 0-.6.3-1.3.8L2 9.1c.8-.7 1.6-1.5 2.4-2.2 1.1-.9 1.9-1.4 2.6-1.5 1.4-.1 2.2.8 2.6 2.7.4 2 .7 3.3 1 3.8.5 1.2 1.1 1.8 1.8 1.8.5 0 1.3-.8 2.2-2.5.9-1.6.9-2.7-.1-3.3-.6-.5-1.7-.4-3 .2C11.6 4.7 14.3 2 18 2c2.5 0 3.6 1.5 3.8 4.5H22z"/>
              </svg>
            </a>
          </div>
          </div>


          <div>
            <h4 style={{ fontWeight: 700, marginBottom: 20, fontSize: 16, color: "#fff" }}>{f.aboutTitle}</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {f.aboutLinks.map(link => (
                <Link key={link.href} href={link.href} style={{ color: "#94a3b8", textDecoration: "none", fontSize: 14 }} className="footer-link">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 style={{ fontWeight: 700, marginBottom: 20, fontSize: 16, color: "#fff" }}>{f.servicesTitle}</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {t.servicesData.slice(0, 6).map(s => (
                <Link key={s.id} href={`/services/${s.id}`} style={{ color: "#94a3b8", textDecoration: "none", fontSize: 14 }} className="footer-link">
                  {s.title}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 style={{ fontWeight: 700, marginBottom: 20, fontSize: 16, color: "#fff" }}>{f.contactUs}</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 14, color: "#94a3b8", fontSize: 14 }}>
              <div>
                <div style={{ fontWeight: 600, color: "#cbd5e1", marginBottom: 4 }}>{f.emailLabel}</div>
                <a href={`mailto:${t.siteConfig.email}`} style={{ color: "inherit", textDecoration: "none", direction: "ltr", display: "inline-block" }}>{t.siteConfig.email}</a>
              </div>
              {f.offices.map((office, i) => (
                <div key={i}>
                  <div style={{ fontWeight: 700, color: "#fff", marginBottom: 4 }}>{office.region}</div>
                  <div>{office.address}</div>
                  <a href={`tel:${office.phone.replace(/\s/g, "")}`} style={{ color: "inherit", textDecoration: "none", direction: "ltr", display: "inline-block", marginTop: 4 }}>{office.phone}</a>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{
          borderTop: "1px solid #1e293b",
          paddingTop: 32,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16,
        }}>
          <p style={{ color: "#64748b", fontSize: 13.5 }}>
            © {new Date().getFullYear()} The Untold Story. {f.allRights}
          </p>
          
        </div>
      </div>

      <style>{`
        .footer-link:hover {
          color: var(--primary) !important;
          transform: translateX(${dir === "rtl" ? "-4px" : "4px"});
        }
        .social-footer-icon:hover {
          color: var(--primary) !important;
          transform: translateY(-2px);
        }
      `}</style>
    </footer>
  );
}
