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
      // MassKode
      'masskode.role': 'Senior Full Stack Engineer',
      'masskode.period': 'Oct 2025 - Présent',
      'masskode.impact1': 'Développement d\'une plateforme healthcare innovante pour l\'accompagnement maternel aux États-Unis',
      'masskode.impact2': 'Architecture moderne et scalable en monorepo (NX) pour garantir performance et maintenabilité',
      'masskode.impact3': 'Développement full-stack de fonctionnalités critiques avec ownership complète',
      'masskode.impact4': 'Développement d\'applications mobiles cross-platform avec React Native pour iOS et Android',
      'masskode.impact5': 'Collaboration avec des équipes produit et techniques internationales en mode remote',
      // Djoubo
      'djoubo.role': 'Tech Lead',
      'djoubo.period': 'Jan 2025 - Déc 2025',
      'djoubo.impact1': 'Orchestration de projets en alliant expertise technique et développement pratique',
      'djoubo.impact2': 'Architecture backend multi-pays avec Laravel : API RESTful, intégration Odoo ERP, infrastructure Digital Ocean',
      'djoubo.impact3': 'Développement full-stack : applications React Native et interfaces React réactives',
      'djoubo.impact4': 'Intégration de systèmes de paiement (PayPal, Stripe, Mollie, Wave) et services géolocalisés (Google Maps)',
      'djoubo.impact5': 'Direction d\'équipe : best practices, revues de code, formation et optimisation des processus avec IA',
      // Gebeya Inc (Senior)
      'gebeya-senior.role': 'Senior Frontend Developer',
      'gebeya-senior.period': 'Mar 2023 - Avr 2025',
      'gebeya-senior.impact1': 'Travail étroit avec designers, UX et autres développeurs pour comprendre nouvelles fonctionnalités et dépendances',
      'gebeya-senior.impact2': 'Conception, développement et test d\'applications web en mode Agile',
      'gebeya-senior.impact3': 'Garantie que les livrables répondent aux attentes du marché Gebeya SaaS',
      'gebeya-senior.impact4': 'Contribution directe aux efforts de développement avec focus sur la qualité',
      // Socium
      'socium.role': 'Senior Software Engineering',
      'socium.period': 'Nov 2022 - Sep 2024',
      'socium.impact1': 'Développement de modules critiques du SIRH : Socium Doc, Payroll, Perf avec NestJS et Angular',
      'socium.impact2': 'Architecture découplée pour portail de recrutement et blog (Nuxt.js + Strapi)',
      'socium.impact3': 'APIs robustes et scalables avec intégration de services (Koa.js)',
      'socium.impact4': 'Architecture full-stack de bout en bout avec focus sur performance et scalabilité',
      // Sonatel
      'sonatel.role': 'Full Stack Engineer',
      'sonatel.period': 'Juil 2019 - Nov 2022',
      'sonatel.impact1': 'Initiateur de React.js au Pôle Digital Orange Sénégal : POC Drupal API découplé avec Next.js pour e-commerce',
      'sonatel.impact2': 'Architecture microservices : Selfcare HR (Laravel/Symfony/Angular) avec Vrata, Activiti, LDAP',
      'sonatel.impact3': 'Développement full-stack de projets critiques : Moodboard (Laravel), Andando (React/Drupal), Sen Pil Pro (Angular)',
      'sonatel.impact4': 'Introduction de l\'architecture Micro frontend avec POC utilisant NX, Module Federation et Web Components',
      // Gebeya Inc (Full Stack)
      'gebeya-fullstack.role': 'Full Stack Engineer',
      'gebeya-fullstack.period': 'Fév 2019 - Fév 2023',
      'gebeya-fullstack.impact1': 'Développement full-stack avec stack varié : PHP, Docker, OpenShift, React.js, Next.js',
      'gebeya-fullstack.impact2': 'Travail avec Kubernetes, Laravel, Nuxt.js, Strapi.js, Drupal, Angular, Symfony',
      'gebeya-fullstack.impact3': 'Développement React Native et Vue.js',
      'gebeya-fullstack.impact4': 'Méthodologie Scrum et architecture REST',
    },
    en: {
      heading: 'Professional Experience',
      scrollHint: 'Scroll',
      // MassKode
      'masskode.role': 'Senior Full Stack Engineer',
      'masskode.period': 'Oct 2025 - Present',
      'masskode.impact1': 'Development of an innovative healthcare platform for maternal support in the United States',
      'masskode.impact2': 'Modern and scalable architecture in monorepo (NX) to ensure performance and maintainability',
      'masskode.impact3': 'Full-stack development of critical features with complete ownership',
      'masskode.impact4': 'Cross-platform mobile application development with React Native for iOS and Android',
      'masskode.impact5': 'Collaboration with international product and technical teams in remote mode',
      // Djoubo
      'djoubo.role': 'Tech Lead',
      'djoubo.period': 'Jan 2025 - Dec 2025',
      'djoubo.impact1': 'Project orchestration combining technical expertise and practical development',
      'djoubo.impact2': 'Multi-country backend architecture with Laravel: RESTful API, Odoo ERP integration, Digital Ocean infrastructure',
      'djoubo.impact3': 'Full-stack development: React Native applications and reactive React interfaces',
      'djoubo.impact4': 'Payment system integration (PayPal, Stripe, Mollie, Wave) and geolocation services (Google Maps)',
      'djoubo.impact5': 'Team leadership: best practices, code reviews, training and process optimization with AI',
      // Gebeya Inc (Senior)
      'gebeya-senior.role': 'Senior Frontend Developer',
      'gebeya-senior.period': 'Mar 2023 - Apr 2025',
      'gebeya-senior.impact1': 'Close collaboration with designers, UX and other developers to understand new features and dependencies',
      'gebeya-senior.impact2': 'Design, development and testing of web applications in Agile mode',
      'gebeya-senior.impact3': 'Ensuring deliverables meet Gebeya SaaS market expectations',
      'gebeya-senior.impact4': 'Direct contribution to development efforts with focus on quality',
      // Socium
      'socium.role': 'Senior Software Engineering',
      'socium.period': 'Nov 2022 - Sep 2024',
      'socium.impact1': 'Development of critical HRIS modules: Socium Doc, Payroll, Perf with NestJS and Angular',
      'socium.impact2': 'Decoupled architecture for recruitment portal and blog (Nuxt.js + Strapi)',
      'socium.impact3': 'Robust and scalable APIs with service integration (Koa.js)',
      'socium.impact4': 'End-to-end full-stack architecture with focus on performance and scalability',
      // Sonatel
      'sonatel.role': 'Full Stack Engineer',
      'sonatel.period': 'Jul 2019 - Nov 2022',
      'sonatel.impact1': 'React.js initiator at Orange Digital Hub Senegal: Decoupled Drupal API POC with Next.js for e-commerce',
      'sonatel.impact2': 'Microservices architecture: Selfcare HR (Laravel/Symfony/Angular) with Vrata, Activiti, LDAP',
      'sonatel.impact3': 'Full-stack development of critical projects: Moodboard (Laravel), Andando (React/Drupal), Sen Pil Pro (Angular)',
      'sonatel.impact4': 'Introduction of Micro frontend architecture with POC using NX, Module Federation and Web Components',
      // Gebeya Inc (Full Stack)
      'gebeya-fullstack.role': 'Full Stack Engineer',
      'gebeya-fullstack.period': 'Feb 2019 - Feb 2023',
      'gebeya-fullstack.impact1': 'Full-stack development with varied stack: PHP, Docker, OpenShift, React.js, Next.js',
      'gebeya-fullstack.impact2': 'Work with Kubernetes, Laravel, Nuxt.js, Strapi.js, Drupal, Angular, Symfony',
      'gebeya-fullstack.impact3': 'React Native and Vue.js development',
      'gebeya-fullstack.impact4': 'Scrum methodology and REST architecture',
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
