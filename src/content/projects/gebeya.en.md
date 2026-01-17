---
slug: "gebeya-en"
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

## Context

Gebeya Marketplace is a sophisticated multi-tenant SaaS platform using a micro-frontend architecture with Single-SPA. The project orchestrates **13 micro-frontends** distributed across **5 modules**, supporting **3 distinct user profiles**:

1. **SaaS Admin (Super Admin)** - Global platform management
2. **Tenant Admin** - Administration of a specific tenant
3. **Tenant Marketplace** - Marketplace interface for end users (Microsoft Talent Cloud, AWS Talent Cloud)

## My Role

As Senior Frontend Developer, I was responsible for the implementation of the multi-framework micro-frontend ecosystem using Single-SPA.

### Main Responsibilities

- **Micro-Frontend Architecture**: Design and orchestration of 13 micro-frontends via 3 Single-SPA root configs
- **Multi-Framework Integration**: Coordination of Angular 15 micro-frontends and integration of React 17 modules
- **Shared Modules**: Development of 5 reusable core micro-frontends across the 3 profiles
- **Build & Deployment**: Configuration of 13 independent CI/CD pipelines with deployment on Google Cloud Storage
- **Performance Optimization**: Lazy-loading, code splitting and initial load optimization

## Architecture

The project is organized into **5 modules** containing **16 applications** (3 root configs + 13 micro-frontends):

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

**Hub-and-spoke** architecture where each root config orchestrates its local micro-frontends and shares the 5 core micro-frontends across the 3 profiles.

## Technologies Used

### Frameworks & Libraries
- **Single-SPA 5.9.x**: Micro-frontend orchestration
- **Angular**: Main framework
- **React**: Specific components
- **TypeScript**: Development language
- **RxJS**: Reactive programming

### UI & Design System
- **PrimeNG**: Angular UI components
- **PrimeFlex**: Utility CSS
- **Formio**: Dynamic form engine
- **Chart.js**: Data visualization

### Build & Tooling
- **Webpack 5**: Bundler with Single-SPA configuration
- **SystemJS**: Runtime module loader
- **Jest**: Unit tests
- **ESLint + Prettier**: Code quality

### Backend & Services
- **Firebase**: Authentication, Firestore, Storage
- **Google Cloud Storage**: Micro-frontend hosting
- **Sentry**: Error monitoring

### State Management
- **NgRx Store**: Angular state management
- **ngx-permissions**: Permission management

## Technical Challenges

### Large-Scale Multi-Framework Orchestration
**Challenge**: Orchestrate 13 micro-frontends developed with Angular and React across 3 distinct applications

**Solution**:
- Single-SPA architecture with 3 independent root configs
- Import-maps configuration for dependency isolation
- Zone.js management for Angular/React coexistence
- Inter-micro-frontend communication via RxJS and Custom Events

### Dependency Sharing
**Challenge**: Avoid duplication of Angular, RxJS (200+ KB each) across 13 micro-frontends

**Solution**:
- CDN configuration via import-maps for common dependencies
- Selective bundling with webpack-config-single-spa
- Sharing via SystemJS for dynamic resolution

### Independent Deployment
**Challenge**: Deploy one micro-frontend among 13 without rebuilding the entire platform

**Solution**:
- 13 independent CI/CD pipelines
- Bundle versioning with cache-busting
- Dynamically generated import-maps post-build
- Granular rollback per micro-frontend

### Performance & Scalability
**Challenge**: Optimize initial load with 13 potential micro-frontends

**Solution**:
- Lazy loading of non-critical micro-frontends
- Code splitting: bundles < 300KB per micro-frontend
- Preloading of critical resources
- CDN for static assets and common dependencies

### Cross-Micro-Frontend Type Safety
**Challenge**: Share TypeScript types across 13 micro-frontends

**Solution**:
- Core module (g-saas-core-mf-shared-ts) with type exports
- Build .d.ts files for each micro-frontend
- Type safety maintained via TypeScript strict mode

## Results

### Architecture
- ✅ **16 applications**: 3 orchestrators + 13 micro-frontends
- ✅ **5 modules** organized by business domain
- ✅ Hub-and-spoke architecture: 5 core MF shared by 3 profiles
- ✅ Massive reuse: ~40% shared components

### Performance
- ✅ Lazy loading: **60%** reduction in initial load
- ✅ Code splitting: bundles < 300KB per micro-frontend
- ✅ Time to Interactive: **< 3s** on desktop
- ✅ CDN caching: optimized common dependencies

### Developer Experience
- ✅ Isolated development: each team works independently
- ✅ Hot reload: < 2s for each micro-frontend locally
- ✅ Optimized CI/CD: build & deploy in **5-8 min** per micro-frontend
- ✅ Type safety: shared TypeScript types

### Business Impact
- ✅ Multi-tenancy: support for **thousands of tenants**
- ✅ White-labeling: customization per tenant
- ✅ Feature flags: progressive rollout per micro-frontend
- ✅ A/B testing: test versions in parallel

### Quality
- ✅ Sentry monitoring: error tracking per micro-frontend
- ✅ Jest unit tests: **>70%** coverage
- ✅ ESLint + Prettier: standardized code
- ✅ Pre-commit validation with Husky
