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
      marginTop: 80,
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
              {f.serviceLinks.map(link => (
                <Link key={link.href} href={link.href} style={{ color: "#94a3b8", textDecoration: "none", fontSize: 14 }} className="footer-link">
                  {link.label}
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
      `}</style>
    </footer>
  );
}
