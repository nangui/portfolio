/**
 * Global translations for the entire site
 * All translations organized by section
 */

import type { Locale } from './config';

export interface SectionTranslations {
  [key: string]: string | string[];
}

export interface Translations {
  [sectionId: string]: {
    [locale in Locale]: SectionTranslations;
  };
}

export const translations: Translations = {
  // Navigation
  nav: {
    fr: {
      home: 'Accueil',
      projects: 'Projets',
      experience: 'Expérience',
      blog: 'Blog',
      contact: 'Contact',
      openMenu: 'Ouvrir le menu de navigation',
      closeMenu: 'Fermer le menu de navigation',
    },
    en: {
      home: 'Home',
      projects: 'Projects',
      experience: 'Experience',
      blog: 'Blog',
      contact: 'Contact',
      openMenu: 'Open navigation menu',
      closeMenu: 'Close navigation menu',
    },
  },

  // Footer
  footer: {
    fr: {
      copyright: 'Tous droits réservés',
      linkedin: 'LinkedIn',
      github: 'GitHub',
      cv: 'CV',
    },
    en: {
      copyright: 'All rights reserved',
      linkedin: 'LinkedIn',
      github: 'GitHub',
      cv: 'CV',
    },
  },

  // Hero section
  hero: {
    fr: {
      name: 'Adonai Nangui',
      title: 'Senior Frontend Engineer / Tech Lead',
      tagline: 'Je choisis les bons outils pour les bons problèmes',
      ctaProjects: 'Voir mes projets',
      ctaContact: 'Me contacter',
    },
    en: {
      name: 'Adonai Nangui',
      title: 'Senior Frontend Engineer / Tech Lead',
      tagline: 'I choose the right tools for the right problems',
      ctaProjects: 'View my projects',
      ctaContact: 'Contact me',
    },
  },

  // About section
  about: {
    fr: {
      heading: 'À propos',
      paragraph1: 'Senior Software Engineer & Tech Lead avec plus de 9 ans d\'expérience, je me spécialise dans la conception et la mise en œuvre de systèmes web scalables, performants et maintenables. J\'interviens aussi bien sur l\'architecture frontend que sur l\'intégration de systèmes de paiement et le développement d\'applications métier complexes, du temps réel au backend.',
      paragraph2: 'J\'ai dirigé des équipes de développement, piloté des choix architecturaux structurants et participé activement aux décisions métier, avec une approche pragmatique orientée impact business. Je porte une attention particulière à la qualité du code, à la performance, à la maintenabilité long terme et à l\'alignement entre enjeux techniques et objectifs produit.',
    },
    en: {
      heading: 'About',
      paragraph1: 'Senior Software Engineer & Tech Lead with over 9 years of experience, I specialize in designing and implementing scalable, performant, and maintainable web systems. I work on both frontend architecture and payment system integration, as well as complex business applications, from real-time to backend.',
      paragraph2: 'I have led development teams, driven structuring architectural choices, and actively participated in business decisions, with a pragmatic approach focused on business impact. I pay particular attention to code quality, performance, long-term maintainability, and alignment between technical challenges and product goals.',
    },
  },

  // Skills section
  skills: {
    fr: {
      heading: 'Stack & Expertises',
    },
    en: {
      heading: 'Stack & Expertise',
    },
  },

  // Projects section
  projects: {
    fr: {
      heading: 'Projets Sélectionnés',
      learnMore: 'En savoir plus →',
      noProjects: 'Les projets seront affichés ici une fois ajoutés dans le dossier content/projects.',
      viewDemo: 'Voir la démo',
      viewSource: 'Code source',
      role: 'Rôle',
      period: 'Période',
    },
    en: {
      heading: 'Featured Projects',
      learnMore: 'Learn more →',
      noProjects: 'Projects will be displayed here once added to the content/projects folder.',
      viewDemo: 'View demo',
      viewSource: 'Source code',
      role: 'Role',
      period: 'Period',
    },
  },

  // Experience section
  experience: {
    fr: {
      heading: 'Expérience Professionnelle',
      scrollHint: 'Défiler',
    },
    en: {
      heading: 'Professional Experience',
      scrollHint: 'Scroll',
    },
  },

  // Blog section
  blog: {
    fr: {
      title: 'Blog Technique',
      description: 'Retours d\'expérience et connaissances sur le développement frontend, l\'architecture et la productivité développeur.',
      noPosts: 'Aucun article pour le moment.',
      viewAll: 'Voir tout →',
      home: 'Accueil',
      readingTime: 'min de lecture',
      tags: 'Tags',
      share: 'Partager',
      previous: 'Article précédent',
      next: 'Article suivant',
    },
    en: {
      title: 'Technical Blog',
      description: 'Experience sharing and knowledge about frontend development, architecture and developer productivity.',
      noPosts: 'No articles yet.',
      viewAll: 'View all →',
      home: 'Home',
      readingTime: 'min read',
      tags: 'Tags',
      share: 'Share',
      previous: 'Previous article',
      next: 'Next article',
    },
  },

  // Contact section
  contact: {
    fr: {
      heading: 'Travaillons ensemble',
      description: 'Je suis toujours ouvert aux nouvelles opportunités et collaborations. N\'hésitez pas à me contacter.',
      location: 'Basé à Dakar, Sénégal · Disponible pour des missions à distance',
      emailLabel: 'Email',
      emailDescription: 'Envoyez-moi un message',
      linkedinLabel: 'LinkedIn',
      linkedinDescription: 'Connectons-nous',
      githubLabel: 'GitHub',
      githubDescription: 'Explorez mes projets',
      cvLabel: 'CV',
      cvDescription: 'Télécharger mon CV',
    },
    en: {
      heading: 'Let\'s work together',
      description: 'I\'m always open to new opportunities and collaborations. Feel free to contact me.',
      location: 'Based in Dakar, Senegal · Available for remote missions',
      emailLabel: 'Email',
      emailDescription: 'Send me a message',
      linkedinLabel: 'LinkedIn',
      linkedinDescription: 'Let\'s connect',
      githubLabel: 'GitHub',
      githubDescription: 'Explore my projects',
      cvLabel: 'CV',
      cvDescription: 'Download my CV',
    },
  },

  // Common/Shared translations
  common: {
    fr: {
      skipToContent: 'Aller au contenu principal',
      loading: 'Chargement...',
      error: 'Une erreur est survenue',
    },
    en: {
      skipToContent: 'Skip to main content',
      loading: 'Loading...',
      error: 'An error occurred',
    },
  },
};

/**
 * Get translation for a section and key
 */
export function getTranslation(
  sectionId: string,
  key: string,
  locale: Locale = 'fr'
): string {
  const section = translations[sectionId];
  if (!section) {
    console.warn(`Section "${sectionId}" not found in translations`);
    return key;
  }
  
  const translation = section[locale];
  if (!translation) {
    console.warn(`Locale "${locale}" not found for section "${sectionId}"`);
    return key;
  }
  
  const value = translation[key];
  if (typeof value === 'string') {
    return value;
  }
  
  if (Array.isArray(value)) {
    return value.join(' ');
  }
  
  console.warn(`Translation key "${key}" not found in section "${sectionId}" for locale "${locale}"`);
  return key;
}

/**
 * Get all translations for a section
 */
export function getSectionTranslations(
  sectionId: string,
  locale: Locale = 'fr'
): SectionTranslations {
  const section = translations[sectionId];
  if (!section) {
    console.warn(`Section "${sectionId}" not found in translations`);
    return {};
  }
  
  const translation = section[locale];
  if (!translation) {
    console.warn(`Locale "${locale}" not found for section "${sectionId}"`);
    return {};
  }
  
  return translation;
}
