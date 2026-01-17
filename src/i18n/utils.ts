/**
 * i18n Utility functions
 * Helper functions for working with translations and locales
 */

import type { Locale } from './config';
import { getTranslation, getSectionTranslations } from './translations';

/**
 * Get translation helper - simplified interface
 */
export function t(sectionId: string, key: string, locale: Locale = 'fr'): string {
  return getTranslation(sectionId, key, locale);
}

/**
 * Get all translations for a section - simplified interface
 */
export function getTranslations(sectionId: string, locale: Locale = 'fr') {
  return getSectionTranslations(sectionId, locale);
}

/**
 * Format a path with locale
 * Handles both absolute and relative paths
 */
export function formatPath(path: string, locale: Locale): string {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // If path is empty, return locale root
  if (!cleanPath) {
    return `/${locale}`;
  }
  
  // If path already starts with a locale, replace it
  const segments = cleanPath.split('/');
  const firstSegment = segments[0];
  
  // Check if first segment is a locale
  if (firstSegment === 'fr' || firstSegment === 'en') {
    segments[0] = locale;
    return `/${segments.join('/')}`;
  }
  
  // Otherwise, prepend locale
  return `/${locale}/${cleanPath}`;
}

/**
 * Get alternate language URLs for hreflang tags
 */
export function getAlternateUrls(pathname: string, site: string | undefined): Array<{ lang: string; url: string }> {
  const cleanPath = pathname.replace(/^\/(fr|en)/, '') || '/';
  const baseUrl = site || 'https://adonainangui.dev';
  
  return [
    { lang: 'fr', url: `${baseUrl}/fr${cleanPath === '/' ? '' : cleanPath}` },
    { lang: 'en', url: `${baseUrl}/en${cleanPath === '/' ? '' : cleanPath}` },
  ];
}
