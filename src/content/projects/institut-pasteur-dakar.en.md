---
slug: "institut-pasteur-dakar-en"
title_fr: "Institut Pasteur de Dakar - Plateforme de surveillance épidémiologique"
title_en: "Institut Pasteur de Dakar - Epidemiological Surveillance Platform"
description_fr: "Conception et remplacement progressif du service de formulaires d'un programme national de surveillance sanitaire, en service au Sénégal et prêt pour les autres pays où l'application Sentinelle est déployée."
description_en: "Design and progressive replacement of the forms service of a national health surveillance programme, in service in Senegal and ready for the other countries where the Sentinelle app is deployed."
stack: ["NestJS", "Angular", "Kafka", "PostgreSQL", "Keycloak", "Drizzle ORM", "Fastify", "TypeScript", "IndexedDB", "Storybook", "Kubernetes"]
featured: true
role_fr: "Ingénieur logiciel full-stack - Consultant"
role_en: "Full-Stack Software Engineer - Consultant"
period_fr: "Mars - Août 2026"
period_en: "March - August 2026"
ogImage: "/images/projects/institut-pasteur-dakar-og-en.jpg"
highlights_fr:
  - value: "Sénégal"
    label: "en service, prêt multi‑pays"
  - value: "4"
    label: "fiches mises en service"
  - value: "0"
    label: "ligne de code pour la 4ᵉ"
highlights_en:
  - value: "Senegal"
    label: "in service, multi‑country ready"
  - value: "4"
    label: "forms put into service"
  - value: "0"
    label: "lines of code for the 4th"
contributions_en:
  - title: "Forms management service (FMS)"
    role: "Design and development"
    share: "≈ 98% of commits"
    stack: ["NestJS 10", "Fastify", "TypeScript", "Drizzle ORM", "PostgreSQL", "Kafka", "Keycloak", "Jest"]
    summary: "FMS (Form Management Service), the core of the platform, written to replace the legacy service one route at a time."
    details:
      - title: "Progressive migration at constant contract."
        text: " The new service reproduces the legacy HTTP contract exactly. Each route can switch over independently, with no change required in any client application and no downtime window."
      - title: "Hexagonal architecture, ten bounded contexts."
        text: " Domain, ports, infrastructure, and presentation kept separate, with ports injected by token. End-to-end tests run against in-memory doubles, with no real infrastructure."
      - title: "Reliable messaging via transactional outbox."
        text: " Kafka events are written to the database in the same transaction as the data, then drained by a dedicated worker with scheduled purging and Prometheus metrics. The database stays the source of truth: a broker incident never causes a field worker's submission to fail."
      - title: "Multi-realm security."
        text: " Keycloak authentication with strict issuer validation, and access control through role / site / step bindings, with distinct policies for reading, starting, and filling a form."
      - title: "Data-driven forms."
        text: " A new form feeds the sample circuit as soon as its schema declares the corresponding block. No hard-coded list, no backend redeployment to publish a form."
      - title: "Integrations"
        text: " with the patient, analysis, and biobank services, resolved and cached reference data, MinIO object storage, and synchronisation with the existing forms system."
  - title: "Shared Angular component library"
    role: "Design and maintenance"
    share: "≈ 92% of commits"
    stack: ["Angular", "PrimeNG", "ng-packagr", "Storybook", "CSS design tokens", "released via Git tags"]
    summary: "Nineteen components shared by three applications, built on a kit-first strategy: extract rather than duplicate. Wizard and sub-step navigation, editable grids, text, select, chip, tile, counter, date and time fields, upload, geolocation, autosave."
  - title: "Forms administration console (Form Admin)"
    role: "Design and development"
    share: "≈ 98% of commits"
    summary: "Form Admin, the Angular application for designing, versioning, publishing, and managing access to forms. It is what makes the rest usable without a developer."
  - title: "Field data entry application (Sentinelle)"
    role: "Major contributor"
    share: "≈ 24% of commits"
    stack: ["Angular standalone", "PrimeNG", "Dexie / IndexedDB", "Keycloak", "service worker"]
    summary: "Sentinelle, the Progressive Web App used by health workers, already in production when I joined."
    details:
      - title: "Custom form rendering engine"
        text: ", roughly 4,400 lines, with no dependency on the third-party library used until then: wizard, conditional fields, grids, per-step validation, prefilling."
      - title: "Offline-first"
        text: ": drafts persisted locally and resumed without a connection."
      - title: "Community surveillance"
        text: ": moving from a community alert to a prefilled clinical form."
  - title: "Laboratory application"
    role: "Integration"
    summary: "Linking forms to specimens and publishing samples to the biobank, primarily on the backend side. Realigning this application's rendering engine with the field application's."
  - title: "Infrastructure and delivery"
    stack: ["Kubernetes", "kustomize", "Jenkins", "Docker"]
    summary: "Per-environment overlays, CI/CD pipelines, configuration and secrets management. Diagnosis and recovery of a blocked environment, with the fix carried into infrastructure-as-code rather than applied by hand."
decisions_en:
  - title: "Reproducing the legacy HTTP contract exactly"
    text: "This means inheriting API choices you would not have made yourself, and carrying them into a new architecture. In exchange, the switchover happens route by route, every step is reversible, and no client application had to change. On a health surveillance system, reversibility is worth more than elegance."
  - title: "Transactional outbox rather than publishing straight to Kafka"
    text: "One more worker and one more purge to operate, against the guarantee that a broker outage never reaches the field worker. When data entry happens in the field, a failed submission cannot be retried: the person has already left."
  - title: "In-memory doubles rather than test containers"
    text: "This imposes design discipline — anything leaving the domain has to go through a port — but the end-to-end suite runs anywhere, with no database, no broker, and no identity provider."
  - title: "Declaring the sample circuit in the form schema"
    text: "The alternative, a list of types maintained in the backend, would have preserved exactly the coupling we were trying to remove. The success criterion was that a new form should no longer require a developer."
  - title: "Writing a custom rendering engine on the field side"
    text: "Rather than keeping the existing dependency. Roughly 4,400 lines to maintain, against full control of offline behaviour, per-step validation, and prefilling — precisely what real-world use depended on."
  - title: "Extracting components before duplicating them"
    text: "Three applications, one versioned and published library: a fix made once benefits all three, and visual drift never sets in."
  - title: "Fixing a blocked environment in infrastructure-as-code"
    text: "Bringing it back by hand would have been faster and would have undone itself at the next deployment."
deliveries_en:
  intro: "A forms engine is only worth what it is willing to carry. Four forms went into service in Senegal, deliberately different in nature."
  items:
    - title: "SARI — surveillance of severe acute respiratory infections"
      text: "A hospital circuit, with specimens attached and passed on to the laboratory and then the biobank."
    - title: "CVACi — integrated community alert and surveillance cells"
      text: "Community-based surveillance is one of the pillars of health security: it picks up signals where they appear, before they reach a care facility. The circuit has two steps, from a community worker to a health professional who validates, with automatic routing into the validator's queue. A bidirectional bridge links these alerts to the corresponding clinical form, prefilled from the source."
    - title: "Maternal and neonatal death notification"
      text: "A notification, not a clinical observation: transmission is final, which calls for an exhaustive summary before sending."
    - title: "Diphtheria"
      text: "Published during the outbreak."
  outro: "The first three were delivered while the platform was being built. They are what tested the engine's generality: a hospital circuit, a community circuit with two-stage validation, and an irreversible notification have almost nothing in common, and having to fit them into the same abstraction is what shaped the design."
proof_en:
  intro: "The fourth demonstrates something else."
  lead: "The whole platform rests on one promise: publishing a new form should no longer require a developer. As part of the response to a diphtheria outbreak, the corresponding surveillance form went into service through the administration console, with no code written and no backend redeployment."
  text: "That is the only validation that counts for a system of this kind. Until a form has been published under pressure, through the intended path, a decoupled architecture remains an intention."
  note: "The engagement ended at the close of the five-month contract, followed by a one-week return in September as part of the outbreak response."
---

## Context

Institut Pasteur de Dakar is one of West Africa's leading public health institutions. Its 4S programme runs syndromic and sentinel health surveillance.

In practice: health workers collect epidemiological forms in the field — respiratory infections, community surveillance, maternal and neonatal deaths, diphtheria — and the associated samples travel on to the laboratory and then the biobank. The chain runs from the field worker's notebook to the stored specimen.

When I joined, the Sentinelle app was already deployed. I added the building blocks that make forms configurable without a developer: FMS (Form Management Service), the forms management backend; Form Admin, the forms administration application; and a shared component library. The forms are in service in Senegal today; the solution is delivered and configured to be used in the other countries where Sentinelle is deployed.

## The problem

The system relied on a legacy Django service in which every new form meant writing code: a hard-coded list of types, and a backend redeployment to publish a form. A software delivery timeline imposed on a public health need.

The difficulty was not designing a better system. It was substituting it for one already in production, used in several countries, without interruption. You do not take a health surveillance chain offline for the duration of a migration.

## The constraints

**No downtime available.** Client applications in production, across several countries, depended on the existing service.

**Heterogeneous deployment environments.** Countries are not all equally equipped. A single release has to reach targets of different kinds.

**The network is not guaranteed.** Field workers enter data where they meet patients, not where there is connectivity.

**A form crosses several roles.** It is split into steps assigned to different roles, with handover, review, and distinct permissions depending on whether you read, start, or fill it.

**Several authentication boundaries.** The consuming applications do not share a realm.

**Health data.** Strict compartmentalisation, traceability, and sample integrity once a specimen has entered the laboratory circuit.
