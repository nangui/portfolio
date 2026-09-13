---
slug: "institut-pasteur-dakar-en"
title_fr: "Institut Pasteur de Dakar - Plateforme de surveillance épidémiologique"
title_en: "Institut Pasteur de Dakar - Epidemiological Surveillance Platform"
description_fr: "Conception et remplacement progressif du service de formulaires d'un programme national de surveillance sanitaire, en service au Sénégal et dans neuf autres pays."
description_en: "Design and progressive replacement of the forms service of a national health surveillance programme, running in Senegal and nine other countries."
stack: ["NestJS", "Angular", "Kafka", "PostgreSQL", "Keycloak", "Drizzle ORM", "Fastify", "TypeScript", "IndexedDB", "Storybook", "Kubernetes"]
featured: true
role_fr: "Ingénieur logiciel full-stack - Consultant"
role_en: "Full-Stack Software Engineer - Consultant"
period_fr: "Mars - Août 2026"
period_en: "March - August 2026"
highlights_fr:
  - value: "10"
    label: "pays, sans interruption"
  - value: "4"
    label: "fiches mises en service"
  - value: "0"
    label: "ligne de code pour la 4ᵉ"
highlights_en:
  - value: "10"
    label: "countries, no downtime"
  - value: "4"
    label: "forms put into service"
  - value: "0"
    label: "lines of code for the 4th"
---

## Context

Institut Pasteur de Dakar is one of West Africa's leading public health institutions. Its 4S programme runs syndromic and sentinel health surveillance.

In practice: health workers collect epidemiological forms in the field — respiratory infections, community surveillance, maternal and neonatal deaths, diphtheria — and the associated samples travel on to the laboratory and then the biobank. The chain runs from the field worker's notebook to the stored specimen.

## The problem

The system relied on a legacy Django service in which every new form meant writing code: a hard-coded list of types, and a backend redeployment to publish a form. A software delivery timeline imposed on a public health need.

The difficulty was not designing a better system. It was substituting it for one already running in ten countries, without interruption. You do not take a health surveillance chain offline for the duration of a migration.

## The constraints

**No downtime available.** Client applications in production, across ten countries, depended on the existing service.

**Heterogeneous deployment environments.** Countries are not all equally equipped. A single release has to reach targets of different kinds.

**The network is not guaranteed.** Field workers enter data where they meet patients, not where there is connectivity.

**A form crosses several roles.** It is split into steps assigned to different roles, with handover, review, and distinct permissions depending on whether you read, start, or fill it.

**Several authentication boundaries.** The consuming applications do not share a realm.

**Health data.** Strict compartmentalisation, traceability, and sample integrity once a specimen has entered the laboratory circuit.

## What I designed and built

### Forms management service — design and development (≈ 98% of commits)

`NestJS 10` · `Fastify` · `TypeScript` · `Drizzle ORM` · `PostgreSQL` · `Kafka` · `Keycloak` · `Jest`

The core of the platform, written to replace the legacy service one route at a time.

- **Progressive migration at constant contract.** The new service reproduces the legacy HTTP contract exactly. Each route can switch over independently, with no change required in any client application and no downtime window.
- **Hexagonal architecture, ten bounded contexts.** Domain, ports, infrastructure, and presentation kept separate, with ports injected by token. End-to-end tests run against in-memory doubles, with no real infrastructure.
- **Reliable messaging via transactional outbox.** Kafka events are written to the database in the same transaction as the data, then drained by a dedicated worker with scheduled purging and Prometheus metrics. The database stays the source of truth: a broker incident never causes a field worker's submission to fail.
- **Multi-realm security.** Keycloak authentication with strict issuer validation, and access control through role / site / step bindings, with distinct policies for reading, starting, and filling a form.
- **Data-driven forms.** A new form feeds the sample circuit as soon as its schema declares the corresponding block. No hard-coded list, no backend redeployment to publish a form.
- **Integrations** with the patient, analysis, and biobank services, resolved and cached reference data, MinIO object storage, and synchronisation with the existing forms system.

### Angular component library — design and maintenance (≈ 92% of commits)

`Angular` · `PrimeNG` · `ng-packagr` · `Storybook` · `CSS design tokens` · `released via Git tags`

Nineteen components shared by three applications, built on a kit-first strategy: extract rather than duplicate. Wizard and sub-step navigation, editable grids, text, select, chip, tile, counter, date and time fields, upload, geolocation, autosave.

### Forms administration console — design and development (≈ 98% of commits)

An Angular application for designing, versioning, publishing, and managing access to forms. It is what makes the rest usable without a developer.

### Field data entry application — major contributor (≈ 24% of commits)

`Angular standalone` · `PrimeNG` · `Dexie / IndexedDB` · `Keycloak` · `service worker`

A Progressive Web App used by health workers.

- **Custom form rendering engine**, roughly 4,400 lines, with no dependency on the third-party library used until then: wizard, conditional fields, grids, per-step validation, prefilling.
- **Offline-first**: drafts persisted locally and resumed without a connection.
- **Community surveillance**: moving from a community alert to a prefilled clinical form.

### Laboratory application — integration

Linking forms to specimens and publishing samples to the biobank, primarily on the backend side. Realigning this application's rendering engine with the field application's.

### Infrastructure and delivery

`Kubernetes` · `kustomize` · `Jenkins` · `Docker`

Per-environment overlays, CI/CD pipelines, configuration and secrets management. Diagnosis and recovery of a blocked environment, with the fix carried into infrastructure-as-code rather than applied by hand.

## Decisions and trade-offs

**Reproducing the legacy HTTP contract exactly.** This means inheriting API choices you would not have made yourself, and carrying them into a new architecture. In exchange, the switchover happens route by route, every step is reversible, and no client application across the ten countries had to change. On a health surveillance system, reversibility is worth more than elegance.

**Transactional outbox rather than publishing straight to Kafka.** One more worker and one more purge to operate, against the guarantee that a broker outage never reaches the field worker. When data entry happens in the field, a failed submission cannot be retried: the person has already left.

**In-memory doubles rather than test containers.** This imposes design discipline — anything leaving the domain has to go through a port — but the end-to-end suite runs anywhere, with no database, no broker, and no identity provider.

**Declaring the sample circuit in the form schema.** The alternative, a list of types maintained in the backend, would have preserved exactly the coupling we were trying to remove. The success criterion was that a new form should no longer require a developer.

**Writing a custom rendering engine on the field side** rather than keeping the existing dependency. Roughly 4,400 lines to maintain, against full control of offline behaviour, per-step validation, and prefilling — precisely what real-world use depended on.

**Extracting components before duplicating them.** Three applications, one versioned and published library: a fix made once benefits all three, and visual drift never sets in.

**Fixing a blocked environment in infrastructure-as-code.** Bringing it back by hand would have been faster and would have undone itself at the next deployment.

## The forms delivered

A forms engine is only worth what it is willing to carry. Four forms went into service, deliberately different in nature.

**SARI — surveillance of severe acute respiratory infections.** A hospital circuit, with specimens attached and passed on to the laboratory and then the biobank.

**CVACi — integrated community alert and surveillance cells.** Community-based surveillance is one of the pillars of health security: it picks up signals where they appear, before they reach a care facility. The circuit has two steps, from a community worker to a health professional who validates, with automatic routing into the validator's queue. A bidirectional bridge links these alerts to the corresponding clinical form, prefilled from the source.

**Maternal and neonatal death notification.** A notification, not a clinical observation: transmission is final, which calls for an exhaustive summary before sending.

**Diphtheria.** Published during the outbreak.

The first three were delivered while the platform was being built. They are what tested the engine's generality: a hospital circuit, a community circuit with two-stage validation, and an irreversible notification have almost nothing in common, and having to fit them into the same abstraction is what shaped the design.

## The proof

The fourth demonstrates something else.

The whole platform rests on one promise: publishing a new form should no longer require a developer. As part of the response to a diphtheria outbreak, the corresponding surveillance form went into service through the administration console, with no code written and no backend redeployment.

That is the only validation that counts for a system of this kind. Until a form has been published under pressure, through the intended path, a decoupled architecture remains an intention.

The engagement ended at the close of the five-month contract, followed by a one-week return in September as part of the outbreak response.
