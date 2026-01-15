/**
 * Translations for all sections
 * Each section has its own translations object
 */

export type Locale = 'fr' | 'en';

export interface SectionTranslations {
  [key: string]: string | string[];
}

export interface Translations {
  [sectionId: string]: {
    [locale in Locale]: SectionTranslations;
  };
}

export const translations: Translations = {
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
  skills: {
    fr: {
      heading: 'Compétences',
      // Les compétences techniques seront traduites dans le composant
    },
    en: {
      heading: 'Skills',
    },
  },
  projects: {
    fr: {
      heading: 'Projets Sélectionnés',
      learnMore: 'En savoir plus →',
      noProjects: 'Les projets seront affichés ici une fois ajoutés dans le dossier content/projects.',
    },
    en: {
      heading: 'Featured Projects',
      learnMore: 'Learn more →',
      noProjects: 'Projects will be displayed here once added to the content/projects folder.',
    },
  },
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
