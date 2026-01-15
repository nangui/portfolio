/**
 * Hook/composable for managing i18n state per section
 */

export type Locale = 'fr' | 'en';

const STORAGE_PREFIX = 'i18n_section_';

/**
 * Get the current locale for a section
 */
export function getSectionLocale(sectionId: string, defaultLocale: Locale = 'fr'): Locale {
  if (typeof window === 'undefined') return defaultLocale;
  
  try {
    const stored = localStorage.getItem(`${STORAGE_PREFIX}${sectionId}`);
    if (stored && (stored === 'fr' || stored === 'en')) {
      return stored as Locale;
    }
  } catch (error) {
    console.warn('Failed to read locale from localStorage:', error);
  }
  
  return defaultLocale;
}

/**
 * Set the locale for a section
 */
export function setSectionLocale(sectionId: string, locale: Locale): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${sectionId}`, locale);
  } catch (error) {
    console.warn('Failed to save locale to localStorage:', error);
  }
}

/**
 * Get all available locales
 */
export function getAvailableLocales(): Locale[] {
  return ['fr', 'en'];
}

/**
 * Get locale label
 */
export function getLocaleLabel(locale: Locale): string {
  const labels: Record<Locale, string> = {
    fr: 'Français',
    en: 'English'
  };
  return labels[locale];
}

/**
 * Get locale code (for display in button)
 */
export function getLocaleCode(locale: Locale): string {
  return locale.toUpperCase();
}
