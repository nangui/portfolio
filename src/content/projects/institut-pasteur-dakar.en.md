---
slug: "institut-pasteur-dakar-en"
title_fr: "Institut Pasteur de Dakar - Plateforme de surveillance épidémiologique"
title_en: "Institut Pasteur de Dakar - Epidemiological Surveillance Platform"
description_fr: "Conception et remplacement progressif du service de formulaires d'un programme national de surveillance sanitaire, en service au Sénégal et prêt pour les autres pays où la plateforme est déployée."
description_en: "Design and progressive replacement of the forms service of a national health surveillance programme, in service in Senegal and ready for the other countries where the platform is deployed."
stack: ["NestJS", "Angular", "TypeScript", "PostgreSQL", "Docker"]
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
  - title: "Forms management service"
    role: "Design and development"
    summary: "The core of the platform, written to replace the legacy service one route at a time."
    details:
      - title: "Progressive migration at constant contract."
        text: " The new service reproduces the legacy HTTP contract exactly. Each route can switch over independently, with no change required in any client application and no downtime window."
      - title: "Hexagonal architecture."
        text: " Domain, ports, infrastructure, and presentation kept separate, with ports injected by token. End-to-end tests run against in-memory doubles, with no real infrastructure."
      - title: "Reliable messaging."
        text: " Events are written to the database in the same transaction as the data, then published by a dedicated worker. The database stays the source of truth: a messaging incident never causes a field worker's submission to fail."
      - title: "Data-driven forms."
        text: " A new form feeds the sample circuit as soon as its schema declares the corresponding block. No hard-coded list, no backend redeployment to publish a form."
  - title: "Shared component library"
    role: "Design and maintenance"
    summary: "Nineteen components shared by three applications, built on a kit-first strategy: extract rather than duplicate. Wizard and sub-step navigation, editable grids, text, select, chip, tile, counter, date and time fields, upload, geolocation, autosave."
  - title: "Forms administration console"
    role: "Design and development"
    summary: "The application for designing, versioning, publishing, and managing access to forms. It is what makes the rest usable without a developer."
  - title: "Field data entry application"
    role: "Major contributor"
    summary: "The Progressive Web App used by health workers, already in production when I joined."
    details:
      - title: "Custom form rendering engine"
        text: ", roughly 4,400 lines, with no dependency on the third-party library used until then: wizard, conditional fields, grids, per-step validation, prefilling."
      - title: "Offline-first"
        text: ": drafts persisted locally and resumed without a connection."
      - title: "Community surveillance"
        text: ": moving from a community alert to a prefilled clinical form."
  - title: "Laboratory application"
    role: "Integration"
    summary: "Linking specimens to a form: pick a project, then a form, fill it in and send it to the forms service, which then forwards the data to the biobank. Mostly backend work, along with realigning this application's rendering engine with the field application's."
  - title: "Infrastructure and delivery"
    summary: "Per-environment configuration, continuous integration and deployment pipelines, secrets management."
decisions_en:
  - title: "Reproducing the legacy HTTP contract exactly"
    text: "This means inheriting API choices you would not have made yourself, and carrying them into a new architecture. In exchange, the switchover happens route by route, every step is reversible, and no client application had to change. On a health surveillance system, reversibility is worth more than elegance."
  - title: "Writing events to the database before publishing them"
    text: "One more worker and one more purge to operate, against the guarantee that a messaging outage never reaches the field worker. When data entry happens in the field, a failed submission cannot be retried: the person has already left."
  - title: "In-memory doubles rather than test containers"
    text: "This imposes design discipline — anything leaving the domain has to go through a port — but the end-to-end suite runs anywhere, with no database, no messaging, and no identity provider."
  - title: "Declaring the sample circuit in the form schema"
    text: "The alternative, a list of types maintained in the backend, would have preserved exactly the coupling we were trying to remove. The success criterion was that a new form should no longer require a developer."
  - title: "Writing a custom rendering engine on the field side"
    text: "Rather than keeping the existing dependency. Roughly 4,400 lines to maintain, against full control of offline behaviour, per-step validation, and prefilling — precisely what real-world use depended on."
  - title: "Extracting components before duplicating them"
    text: "Three applications, one versioned and published library: a fix made once benefits all three, and visual drift never sets in."
deliveries_en:
  intro: "A forms engine is only worth what it is willing to carry. Four forms went into service in Senegal, deliberately different in nature."
  items:
    - title: "A hospital circuit"
      text: "Samples attached to the form, processed by the forms service and then forwarded to the biobank."
    - title: "A community circuit"
      text: "Community-based surveillance picks up signals where they appear, before they reach a care facility. The circuit has two steps, from a community worker to a health professional who validates, with automatic routing into the validator's queue. A bidirectional bridge links these alerts to the corresponding clinical form, prefilled from the source."
    - title: "An irreversible notification"
      text: "A notification, not a clinical observation: transmission is final, which calls for an exhaustive summary before sending."
    - title: "A fourth form, published under pressure"
      text: "Put into service through the intended path, with no developer involved."
  outro: "The first three were delivered while the platform was being built. They are what tested the engine's generality: a hospital circuit, a community circuit with two-stage validation, and an irreversible notification have almost nothing in common, and having to fit them into the same abstraction is what shaped the design."
proof_en:
  intro: "The fourth demonstrates something else."
  lead: "The whole platform rests on one promise: publishing a new form should no longer require a developer. Under the pressure of a health response, the corresponding form went into service through the administration console, with no code written and no backend redeployment."
  text: "That is the only validation that counts for a system of this kind. Until a form has been published under pressure, through the intended path, a decoupled architecture remains an intention."
---

## Context

Institut Pasteur de Dakar is one of West Africa's leading public health institutions, and runs health surveillance programmes.

In practice: health workers enter epidemiological forms in the field, some of them with samples. At the laboratory, specimens are linked to a form. Both applications send their data to the forms service, which processes it and then forwards it to the biobank.

When I joined, the field data entry application was already deployed. I added the building blocks that make forms configurable without a developer: the forms management backend, the administration console, and a shared component library. The forms are in service in Senegal today; the solution is delivered and configured to be used in the other countries where the platform is deployed.

## The problem

The system relied on a legacy service in which every new form meant writing code: a hard-coded list of types, and a backend redeployment to publish a form. A software delivery timeline imposed on a public health need.

The difficulty was not designing a better system. It was substituting it for one already in production, used in several countries, without interruption. You do not take a health surveillance chain offline for the duration of a migration.

## The constraints

**No downtime available.** Client applications in production, across several countries, depended on the existing service.

**Heterogeneous deployment environments.** Countries are not all equally equipped. A single release has to reach targets of different kinds.

**The network is not guaranteed.** Field workers enter data where they meet patients, not where there is connectivity.

**A form crosses several roles.** It is split into steps assigned to different roles, with handover, review, and distinct permissions depending on whether you read, start, or fill it.

**Several authentication boundaries.** The consuming applications do not share a directory.

**Health data.** Strict compartmentalisation, traceability, and sample integrity once a specimen has entered the laboratory circuit.
