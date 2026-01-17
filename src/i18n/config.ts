/**
 * i18n Configuration
 * Configuration for internationalization support
 */

export type Locale = 'fr' | 'en';

export const defaultLocale: Locale = 'fr';

export const locales: Locale[] = ['fr', 'en'];

export const localeLabels: Record<Locale, string> = {
  fr: 'Français',
  en: 'English',
};

export const localeCodes: Record<Locale, string> = {
  fr: 'FR',
  en: 'EN',
};

/**
 * Check if a string is a valid locale
 */
export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

/**
 * Get locale from pathname
 * Example: /fr/blog -> 'fr', /en -> 'en', /blog -> defaultLocale
 */
export function getLocaleFromPath(pathname: string): Locale {
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];
  return isValidLocale(firstSegment) ? firstSegment : defaultLocale;
}

/**
 * Get path with locale prefix
 * Example: getPathWithLocale('/blog', 'en') -> '/en/blog'
 */
export function getPathWithLocale(path: string, locale: Locale): string {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // If path is empty or just '/', return locale root
  if (!cleanPath || cleanPath === '/') {
    return `/${locale}`;
  }
  
  // If path already has a locale, replace it
  const segments = cleanPath.split('/');
  if (isValidLocale(segments[0])) {
    segments[0] = locale;
    return `/${segments.join('/')}`;
  }
  
  // Otherwise, prepend locale
  return `/${locale}/${cleanPath}`;
}

/**
 * Remove locale from path
 * Example: /en/blog -> /blog, /fr -> /
 */
export function removeLocaleFromPath(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length > 0 && isValidLocale(segments[0])) {
    segments.shift();
  }
  return segments.length > 0 ? `/${segments.join('/')}` : '/';
}
