export const LOCALES = ["en", "cy"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

export type LocalizedString = Record<Locale, string>;

export interface LocalizedLink {
  href: string;
  label: LocalizedString;
  description?: LocalizedString;
}

export function isLocale(value: string): value is Locale {
  return LOCALES.includes(value as Locale);
}

export function getLocalizedString(
  value: LocalizedString | undefined,
  locale: Locale,
  fallback = "",
) {
  if (!value) {
    return fallback;
  }

  return value[locale] || value[DEFAULT_LOCALE] || fallback;
}

export function buildLocalizedPath(locale: Locale, slug = "") {
  return slug ? `/${locale}/${slug}` : `/${locale}/`;
}

export function stripLocaleFromPath(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  const [maybeLocale, ...rest] = segments;

  if (!maybeLocale || !isLocale(maybeLocale)) {
    return { locale: undefined, slug: rest.join("/") };
  }

  return {
    locale: maybeLocale,
    slug: rest.join("/"),
  };
}

export function swapLocalePath(pathname: string, nextLocale: Locale) {
  const { slug } = stripLocaleFromPath(pathname);
  return buildLocalizedPath(nextLocale, slug);
}

export function formatDate(value: string, locale: Locale) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(locale === "cy" ? "cy-GB" : "en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(parsed);
}

export function formatDateTime(value: string, locale: Locale) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(locale === "cy" ? "cy-GB" : "en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(parsed);
}

export function formatDateTimeShort(value: string, locale: Locale): string {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return new Intl.DateTimeFormat(locale === "cy" ? "cy-GB" : "en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(parsed);
}

export function formatDateRelative(value: string, locale: Locale): string {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;

  const diffMs = Date.now() - parsed.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return locale === "en" ? "Today" : "Heddiw";
  if (diffDays === 1) return locale === "en" ? "Yesterday" : "Ddoe";
  if (diffDays < 7)
    return locale === "en"
      ? `${diffDays} days ago`
      : `${diffDays} diwrnod yn ôl`;
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return locale === "en" ? `${weeks}w ago` : `${weeks} wythnos yn ôl`;
  }
  if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return locale === "en" ? `${months}mo ago` : `${months} mis yn ôl`;
  }
  const years = Math.floor(diffDays / 365);
  return locale === "en" ? `${years}y ago` : `${years} blynedd yn ôl`;
}
