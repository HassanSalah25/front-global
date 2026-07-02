"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "./LanguageContext";
import { getLocaleMeta, SUPPORTED_LOCALES } from "../lib/i18n";

type LanguageSwitcherProps = {
  variant?: "desktop" | "mobile";
};

export default function LanguageSwitcher({ variant = "desktop" }: LanguageSwitcherProps) {
  const { locale, setLocale } = useLanguage();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const current = getLocaleMeta(locale);
  const isMobile = variant === "mobile";

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  return (
    <div ref={rootRef} style={{ position: "relative" }}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Select language"
        style={{
          background: isMobile ? "#0a0a0a" : "#ffffff",
          border: isMobile ? "1px solid #0a0a0a" : "1.5px solid #ffffff",
          color: "#fff",
          padding: isMobile ? "5px 10px" : "6px 12px",
          borderRadius: 0,
          fontSize: isMobile ? 13 : 14,
          fontWeight: 600,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 6,
          transition: "all 0.2s ease",
        }}
        className={isMobile ? undefined : "lang-toggle-btn"}
      >
        <span
          className={`fi ${current.flag}`}
          style={{ fontSize: isMobile ? 20 : 22, lineHeight: 1, borderRadius: 3, boxShadow: "0 1px 4px rgba(0,0,0,0.3)" }}
        />
        <span style={{ fontSize: 12, opacity: 0.85 }}>{current.nativeLabel}</span>
        <span style={{ fontSize: 10, opacity: 0.7 }}>{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label="Languages"
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            insetInlineEnd: 0,
            minWidth: 180,
            margin: 0,
            padding: 6,
            listStyle: "none",
            background: "#fff",
            border: "1px solid var(--border, #e5e7eb)",
            boxShadow: "0 12px 32px rgba(0,0,0,0.12)",
            zIndex: 200,
          }}
        >
          {SUPPORTED_LOCALES.map((code) => {
            const meta = getLocaleMeta(code);
            const active = code === locale;
            return (
              <li key={code}>
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => {
                    setLocale(code);
                    setOpen(false);
                  }}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "10px 12px",
                    border: "none",
                    background: active ? "var(--primary-light, #fef2f2)" : "transparent",
                    color: "#0a0a0a",
                    cursor: "pointer",
                    fontSize: 14,
                    fontWeight: active ? 700 : 500,
                    textAlign: "start",
                  }}
                >
                  <span className={`fi ${meta.flag}`} style={{ fontSize: 18, lineHeight: 1, borderRadius: 2 }} />
                  <span>{meta.nativeLabel}</span>
                  <span style={{ marginInlineStart: "auto", fontSize: 12, color: "#64748b" }}>{meta.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
