// Central i18n configuration — add locales here or via NEXT_PUBLIC_LOCALES env var.

export const LOCALE_META = {
  en: {
    label: "English",
    nativeLabel: "English",
    flag: "fi-us",
    dir: "ltr" as const,
    numberLocale: "en-US",
  },
  ar: {
    label: "Arabic",
    nativeLabel: "العربية",
    flag: "fi-sa",
    dir: "rtl" as const,
    numberLocale: "ar-SA",
  },
  fr: {
    label: "French",
    nativeLabel: "Français",
    flag: "fi-fr",
    dir: "ltr" as const,
    numberLocale: "fr-FR",
  },
  de: {
    label: "German",
    nativeLabel: "Deutsch",
    flag: "fi-de",
    dir: "ltr" as const,
    numberLocale: "de-DE",
  },
  es: {
    label: "Spanish",
    nativeLabel: "Español",
    flag: "fi-es",
    dir: "ltr" as const,
    numberLocale: "es-ES",
  },
  it: {
    label: "Italian",
    nativeLabel: "Italiano",
    flag: "fi-it",
    dir: "ltr" as const,
    numberLocale: "it-IT",
  },
  pt: {
    label: "Portuguese",
    nativeLabel: "Português",
    flag: "fi-pt",
    dir: "ltr" as const,
    numberLocale: "pt-PT",
  },
  tr: {
    label: "Turkish",
    nativeLabel: "Türkçe",
    flag: "fi-tr",
    dir: "ltr" as const,
    numberLocale: "tr-TR",
  },
} as const;

export type Locale = keyof typeof LOCALE_META;

export const DEFAULT_LOCALE: Locale = "en";
export const FALLBACK_LOCALE: Locale = "en";

export function isValidLocale(value: string): value is Locale {
  return value in LOCALE_META;
}

const ENV_LOCALES = process.env.NEXT_PUBLIC_LOCALES?.split(",")
  .map((code) => code.trim().toLowerCase())
  .filter(Boolean)
  .filter(isValidLocale);

export const SUPPORTED_LOCALES: Locale[] =
  ENV_LOCALES?.length
    ? (ENV_LOCALES as Locale[])
    : (["en", "ar", "fr", "de", "es", "it", "pt", "tr"] as Locale[]);

export type ApiLocale = Locale;

export function normalizeLocale(value: string | null | undefined): Locale {
  if (!value) return DEFAULT_LOCALE;
  const code = value.toLowerCase().split("-")[0];
  if (isValidLocale(code) && SUPPORTED_LOCALES.includes(code)) return code;
  return DEFAULT_LOCALE;
}

export function getLocaleMeta(locale: Locale) {
  return LOCALE_META[locale];
}

export function getLocaleDirection(locale: Locale): "ltr" | "rtl" {
  return LOCALE_META[locale].dir;
}

export function isRtlLocale(locale: Locale): boolean {
  return getLocaleDirection(locale) === "rtl";
}

export function getNumberLocale(locale: Locale): string {
  return LOCALE_META[locale].numberLocale;
}

/** Inline copy map — `en` required; other locale keys optional. */
export type LocalizedMap<T = string> = Partial<Record<Locale, T>> & Record<string, T> & { en: T };

/** Pick a locale-specific value with fallback to English. */
export function pickLocalized<T>(
  content: Partial<Record<Locale, T>> & Record<string, T>,
  locale: Locale
): T {
  if (content[locale] !== undefined) return content[locale] as T;
  if (content[FALLBACK_LOCALE] !== undefined) return content[FALLBACK_LOCALE] as T;
  if (content.en !== undefined) return content.en as T;
  const first = Object.values(content)[0];
  return first as T;
}

/** Inline UI copy helper — add new locale keys as translations become available. */
export function tx(locale: Locale, strings: LocalizedMap): string {
  return pickLocalized(strings, locale);
}

export function getNextLocale(current: Locale): Locale {
  const index = SUPPORTED_LOCALES.indexOf(current);
  const next = index === -1 ? 0 : (index + 1) % SUPPORTED_LOCALES.length;
  return SUPPORTED_LOCALES[next];
}
