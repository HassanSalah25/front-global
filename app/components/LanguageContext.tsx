"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { translations, getStaticTranslation, type Translation } from "../lib/data";
import type { CmsHeroSlide, CmsWorkShowcase } from "../lib/cmsMerge";
import {
  type Locale,
  SUPPORTED_LOCALES,
  DEFAULT_LOCALE,
  normalizeLocale,
  getLocaleDirection,
  getNextLocale,
} from "../lib/i18n";

interface LanguageContextProps {
  locale: Locale;
  locales: Locale[];
  t: Translation;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  dir: "rtl" | "ltr";
  cmsReady: boolean;
  heroSlides: CmsHeroSlide[] | null;
  workShowcase: CmsWorkShowcase | null;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

function buildInitialTranslations(): Record<Locale, Translation> {
  const initial = {} as Record<Locale, Translation>;
  for (const code of SUPPORTED_LOCALES) {
    initial[code] = getStaticTranslation(code);
  }
  return initial;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);
  const [dynamicTrans, setDynamicTrans] = useState<Record<Locale, Translation>>(buildInitialTranslations);
  const [cmsReady, setCmsReady] = useState(false);
  const [heroSlides, setHeroSlides] = useState<CmsHeroSlide[] | null>(null);
  const [workShowcase, setWorkShowcase] = useState<CmsWorkShowcase | null>(null);

  const loadCms = useCallback(async (activeLocale: Locale) => {
    setCmsReady(false);
    try {
      const { loadCmsForLocale } = await import("../lib/cmsMerge");
      const base = getStaticTranslation(activeLocale);
      const result = await loadCmsForLocale(activeLocale, base);

      setDynamicTrans((prev) => ({
        ...prev,
        [activeLocale]: result.translation,
      }));
      setHeroSlides(result.heroSlides.length ? result.heroSlides : null);
      setWorkShowcase(result.workShowcase);
    } catch (err) {
      console.error("CMS load failed, using static translations:", err);
    } finally {
      setCmsReady(true);
    }
  }, []);

  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("locale") : null;
    if (saved) {
      setLocaleState(normalizeLocale(saved));
      return;
    }

    if (typeof navigator !== "undefined") {
      setLocaleState(normalizeLocale(navigator.language));
    }
  }, []);

  useEffect(() => {
    loadCms(locale);
  }, [locale, loadCms]);

  useEffect(() => {
    document.documentElement.dir = getLocaleDirection(locale);
    document.documentElement.lang = locale;
    localStorage.setItem("locale", locale);
  }, [locale]);

  const setLocale = useCallback((nextLocale: Locale) => {
    setLocaleState(nextLocale);
  }, []);

  const toggleLocale = useCallback(() => {
    setLocaleState((prev) => getNextLocale(prev));
  }, []);

  const t = dynamicTrans[locale] ?? dynamicTrans[DEFAULT_LOCALE];
  const dir = getLocaleDirection(locale);

  const value = useMemo(
    () => ({
      locale,
      locales: SUPPORTED_LOCALES,
      t,
      setLocale,
      toggleLocale,
      dir,
      cmsReady,
      heroSlides,
      workShowcase,
    }),
    [locale, t, setLocale, toggleLocale, dir, cmsReady, heroSlides, workShowcase]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
