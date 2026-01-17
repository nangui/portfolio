---
slug: "gebeya-fr"
title_fr: "Gebeya - Plateforme SaaS Multi-Tenant"
title_en: "Gebeya - Multi-Tenant SaaS Platform"
description_fr: "Architecture et développement d'une plateforme SaaS multi-tenant avec 13 micro-frontends orchestrés via Single-SPA, supportant 3 profils utilisateurs distincts."
description_en: "Architecture and development of a multi-tenant SaaS platform with 13 orchestrated micro-frontends via Single-SPA, supporting 3 distinct user profiles."
stack: ["Single-SPA", "Angular", "React", "TypeScript", "RxJS", "Webpack", "SystemJS", "Firebase", "PrimeNG", "Jest", "NgRx", "Formio"]
featured: true
role_fr: "Senior Frontend Developer"
role_en: "Senior Frontend Developer"
period_fr: "Mars 2023 - Avril 2025"
period_en: "March 2023 - April 2025"
demoUrl: "https://ms.gebeya.com"
images: ["/images/projects/aws-landing-page.png", "/images/projects/microsoft-landing-page.png"]
---

## Contexte

Gebeya Marketplace est une plateforme SaaS multi-tenant sophistiquée utilisant une architecture micro-frontend avec Single-SPA. Le projet orchestre **13 micro-frontends** répartis sur **5 modules**, supportant **3 profils utilisateurs distincts** :

1. **Admin SaaS (Super Admin)** - Gestion de la plateforme globale
2. **Admin Tenant** - Administration d'un tenant spécifique
3. **Tenant Marketplace** - Interface marketplace pour les utilisateurs finaux (Microsoft Talent Cloud, AWS Talent Cloud)

## Mon Rôle

En tant que Senior Frontend Developer et Architecte Micro-Frontend, j'ai été responsable de l'architecture et de l'implémentation de l'écosystème micro-frontend multi-framework utilisant Single-SPA.

### Responsabilités principales

- **Architecture Micro-Frontend** : Conception et orchestration de 13 micro-frontends via 3 root configs Single-SPA
- **Intégration Multi-Framework** : Coordination de micro-frontends Angular 15 et intégration de modules React 17
- **Modules Partagés** : Développement de 5 micro-frontends core réutilisables entre les 3 profils
- **Build & Déploiement** : Configuration de 13 pipelines CI/CD indépendants avec déploiement sur Google Cloud Storage
- **Optimisation des Performances** : Lazy-loading, code splitting et optimisation du chargement initial

## Architecture

Le projet est organisé en **5 modules** contenant **16 applications** (3 root configs + 13 micro-frontends) :

```
┌─────────────────────────────────────────────────────────┐
│                    3 ROOT CONFIGS                        │
│  (Orchestrateurs Single-SPA avec import-maps)           │
└─────────────────────────────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ Admin SaaS   │  │ Admin Tenant │  │  Marketplace │
│              │  │              │  │              │
│ 4 MF locaux  │  │ 2 MF locaux  │  │ 2 MF locaux  │
└──────────────┘  └──────────────┘  └──────────────┘
        │                  │                  │
        └──────────────────┼──────────────────┘
                           │
                           ▼
                ┌──────────────────┐
                │   g-saas-core    │
                │  5 MF partagés   │
                └──────────────────┘
```

Architecture **hub-and-spoke** où chaque root config orchestre ses micro-frontends locaux et partage les 5 micro-frontends core entre les 3 profils.

## Technologies utilisées

### Frameworks & Bibliothèques
- **Single-SPA** : Orchestration micro-frontend
- **Angular** : Framework principal
- **React** : Composants spécifiques
- **TypeScript** : Langage de développement
- **RxJS** : Programmation réactive

### UI & Design System
- **PrimeNG** : Composants UI Angular
- **PrimeFlex** : Utility CSS
- **Formio** : Moteur de formulaires dynamiques
- **Chart.js** : Visualisation de données

### Build & Tooling
- **Webpack** : Bundler avec configuration Single-SPA
- **SystemJS** : Module loader runtime
- **Jest** : Tests unitaires
- **ESLint + Prettier** : Qualité de code

### Backend & Services
- **Firebase** : Authentification, Firestore, Storage
- **Google Cloud Storage** : Hébergement des micro-frontends
- **Sentry** : Monitoring d'erreurs

### State Management
- **NgRx Store** : State management Angular
- **ngx-permissions** : Gestion des permissions

## Défis techniques

### Orchestration Multi-Framework à Grande Échelle
**Défi** : Orchestrer 13 micro-frontends développés avec Angular et React dans 3 applications distinctes

**Solution** :
- Architecture Single-SPA avec 3 root configs indépendants
- Configuration d'import-maps pour isolation des dépendances
- Gestion de Zone.js pour cohabitation Angular/React
- Communication inter-micro-frontends via RxJS et Custom Events

### Partage de Dépendances
**Défi** : Éviter la duplication d'Angular, RxJS (200+ KB chacun) entre 13 micro-frontends

**Solution** :
- Configuration CDN via import-maps pour dépendances communes
- Bundling sélectif avec webpack-config-single-spa
- Partage via SystemJS pour résolution dynamique

### Déploiement Indépendant
**Défi** : Déployer un micro-frontend parmi 13 sans rebuilder toute la plateforme

**Solution** :
- 13 pipelines CI/CD indépendants
- Versioning des bundles avec cache-busting
- Import-maps dynamiques générées post-build
- Rollback granulaire par micro-frontend

### Performance & Scalabilité
**Défi** : Optimiser le chargement initial avec 13 micro-frontends potentiels

**Solution** :
- Lazy loading des micro-frontends non critiques
- Code splitting : bundles < 300KB par micro-frontend
- Preloading des ressources critiques
- CDN pour assets statiques et dépendances communes

### Type Safety Cross-Micro-Frontend
**Défi** : Partager types TypeScript entre 13 micro-frontends

**Solution** :
- Module core (g-saas-core-mf-shared-ts) avec exports types
- Build de .d.ts files pour chaque micro-frontend
- Type safety maintenue via TypeScript strict mode

## Résultats

### Architecture
- ✅ **16 applications** : 3 orchestrateurs + 13 micro-frontends
- ✅ **5 modules** organisés par domaine métier
- ✅ Architecture hub-and-spoke : 5 MF core partagés par 3 profils
- ✅ Réutilisation massive : ~40% de composants partagés

### Performance
- ✅ Lazy loading : chargement initial réduit de **60%**
- ✅ Code splitting : bundles < 300KB par micro-frontend
- ✅ Time to Interactive : **< 3s** sur desktop
- ✅ CDN caching : dépendances communes optimisées

### Developer Experience
- ✅ Développement isolé : chaque équipe travaille indépendamment
- ✅ Hot reload : < 2s pour chaque micro-frontend en local
- ✅ CI/CD optimisé : build & deploy en **5-8 min** par micro-frontend
- ✅ Type safety : types partagés TypeScript

### Business Impact
- ✅ Multi-tenancy : support de **milliers de tenants**
- ✅ White-labeling : customisation par tenant
- ✅ Feature flags : rollout progressif par micro-frontend
- ✅ A/B testing : test de versions en parallèle

### Qualité
- ✅ Monitoring Sentry : tracking erreurs par micro-frontend
- ✅ Tests unitaires Jest : couverture **>70%**
- ✅ ESLint + Prettier : code standardisé
- ✅ Validation pre-commit avec Husky
