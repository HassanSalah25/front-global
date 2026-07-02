"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLanguage } from "./LanguageContext";
import { getLocaleMeta } from "../lib/i18n";

type LanguageSwitcherProps = {
  variant?: "desktop" | "mobile";
};

type MenuPosition = {
  top: number;
  left: number;
  width: number;
};

export default function LanguageSwitcher({ variant = "desktop" }: LanguageSwitcherProps) {
  const { locale, locales, setLocale } = useLanguage();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [menuPosition, setMenuPosition] = useState<MenuPosition | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const current = getLocaleMeta(locale);
  const isMobile = variant === "mobile";

  const updateMenuPosition = useCallback(() => {
    const button = buttonRef.current;
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const menuWidth = Math.max(rect.width, 200);

    setMenuPosition({
      top: rect.bottom + 8,
      left: Math.max(8, rect.right - menuWidth),
      width: menuWidth,
    });
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    updateMenuPosition();

    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        !rootRef.current?.contains(target) &&
        !menuRef.current?.contains(target)
      ) {
        setOpen(false);
      }
    };

    const onReposition = () => updateMenuPosition();

    document.addEventListener("mousedown", onPointerDown);
    window.addEventListener("resize", onReposition);
    window.addEventListener("scroll", onReposition, true);

    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("resize", onReposition);
      window.removeEventListener("scroll", onReposition, true);
    };
  }, [open, updateMenuPosition]);

  const menu =
    open && menuPosition && mounted ? (
      <ul
        ref={menuRef}
        role="listbox"
        aria-label="Languages"
        style={{
          position: "fixed",
          top: menuPosition.top,
          left: menuPosition.left,
          width: menuPosition.width,
          minWidth: 200,
          maxHeight: "min(320px, calc(100vh - 96px))",
          overflowY: "auto",
          margin: 0,
          padding: 6,
          listStyle: "none",
          background: "#fff",
          border: "1px solid var(--border, #e5e7eb)",
          boxShadow: "0 12px 32px rgba(0, 0, 0, 0.16)",
          zIndex: 10000,
          fontFamily: "'Inter', 'Cairo', system-ui, sans-serif",
        }}
      >
        {locales.map((code) => {
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
                <span className={`fi ${meta.flag}`} style={{ fontSize: 18, lineHeight: 1, borderRadius: 2, flexShrink: 0 }} />
                <span>{meta.nativeLabel}</span>
                <span style={{ marginInlineStart: "auto", fontSize: 12, color: "#64748b" }}>{meta.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    ) : null;

  return (
    <div ref={rootRef} style={{ position: "relative" }}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => {
          setOpen((prev) => {
            const next = !prev;
            if (next) updateMenuPosition();
            return next;
          });
        }}
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

      {mounted && menu ? createPortal(menu, document.body) : null}
    </div>
  );
}
