# Portfolio - Adonai Nangui

Portfolio professionnel d'Adonai Nangui, Senior Frontend Engineer & Tech Lead.

## 🚀 Technologies

- **Framework**: [Astro](https://astro.build) - Framework web moderne et performant
- **Styling**: [Tailwind CSS](https://tailwindcss.com) - Framework CSS utility-first
- **3D Graphics**: [Three.js](https://threejs.org) - Bibliothèque WebGL pour les effets visuels
- **Animations**: [GSAP](https://gsap.com) - Bibliothèque d'animations haute performance
- **Language**: TypeScript - Typage statique pour une meilleure maintenabilité

## ✨ Fonctionnalités

- **Design moderne** : Interface élégante avec animations fluides
- **Effets WebGL** : Hover effects sur les cartes de projets avec Three.js et filtres SVG
- **Blog** : Articles techniques sur le développement web et les projets
- **Projets** : Présentation détaillée des projets avec stack technique
- **Responsive** : Design adaptatif pour mobile, tablette et desktop
- **Performance** : Optimisé pour un chargement rapide et une expérience fluide
- **SEO** : Sitemap automatique et meta tags optimisés

## 📁 Structure du Projet

```
portfolio/
├── src/
│   ├── components/      # Composants Astro réutilisables
│   │   ├── blog/       # Composants spécifiques au blog
│   │   ├── sections/   # Sections de la page d'accueil
│   │   └── ui/         # Composants UI (boutons, loader, etc.)
│   ├── content/        # Contenu markdown (blog, projets)
│   ├── layouts/        # Layouts de base
│   ├── pages/          # Pages du site
│   ├── styles/         # Styles globaux
│   └── utils/          # Utilitaires (logger, i18n, etc.)
├── public/             # Assets statiques (images, favicon)
└── dist/               # Build de production
```

## 🧞 Commandes

Toutes les commandes sont exécutées depuis la racine du projet :

| Commande                | Action                                           |
| :---------------------- | :----------------------------------------------- |
| `pnpm install`          | Installe les dépendances                         |
| `pnpm dev`              | Démarre le serveur de développement             |
| `pnpm build`            | Build le site pour la production                 |
| `pnpm preview`           | Prévisualise le build localement                 |
| `pnpm astro check`      | Vérifie les erreurs TypeScript                   |

## 🚀 Déploiement

Le site est déployé sur **Vercel** et accessible à l'adresse : [https://adonainangui.dev](https://adonainangui.dev)

### Configuration Vercel

Le projet utilise la configuration par défaut d'Astro pour Vercel. Aucune configuration supplémentaire n'est nécessaire.

## 📝 Contenu

### Ajouter un article de blog

1. Créer un fichier `.md` dans `src/content/blog/`
2. Ajouter le frontmatter avec les métadonnées :
   ```markdown
   ---
   title: "Titre de l'article"
   slug: "slug-de-l-article"
   description: "Description de l'article"
   pubDate: 2025-01-15T00:00:00.000Z
   tags: ["Tag1", "Tag2"]
   image: "/images/article.png"
   ---
   ```
3. Écrire le contenu en Markdown

### Ajouter un projet

1. Créer un fichier `.md` dans `src/content/projects/`
2. Ajouter le frontmatter avec les métadonnées :
   ```markdown
   ---
   slug: "nom-du-projet"
   title: "Titre du projet"
   description: "Description du projet"
   stack: ["Tech1", "Tech2"]
   featured: true
   role: "Rôle dans le projet"
   period: "Période"
   demoUrl: "https://demo.com"
   image: "/images/projects/project.png"
   ---
   ```
3. Écrire la description détaillée en Markdown

## 🎨 Personnalisation

### Thème

Les couleurs et variables de thème sont définies dans `src/config/theme.ts` et `src/styles/global.css`.

### Composants

Les composants sont modulaires et réutilisables. Chaque section de la page d'accueil est un composant séparé dans `src/components/sections/`.

## 🔧 Développement

### Prérequis

- Node.js 18+ 
- pnpm (recommandé) ou npm/yarn

### Installation

```bash
# Cloner le repository
git clone https://github.com/nangui/portfolio.git

# Installer les dépendances
pnpm install

# Démarrer le serveur de développement
pnpm dev
```

Le site sera accessible sur `http://localhost:4321`

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👤 Auteur

**Adonai Nangui**

- Portfolio: [https://adonainangui.dev](https://adonainangui.dev)
- GitHub: [@nangui](https://github.com/nangui)
- Email: adonainangui03@gmail.com

---

_Fait avec ❤️ en utilisant Astro_
