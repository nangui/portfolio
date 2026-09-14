---
slug: "institut-pasteur-dakar-fr"
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
ogImage: "/images/projects/institut-pasteur-dakar-og-fr.jpg"
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
contributions_fr:
  - title: "Service de gestion des formulaires"
    role: "Conception et développement"
    share: "≈ 98 % des commits"
    stack: ["NestJS 10", "Fastify", "TypeScript", "Drizzle ORM", "PostgreSQL", "Kafka", "Keycloak", "Jest"]
    summary: "Le cœur de la plateforme, écrit pour se substituer au service historique route par route."
    details:
      - title: "Migration progressive à contrat constant."
        text: " Le nouveau service reproduit exactement le contrat HTTP de l'ancien. Chaque route peut basculer indépendamment, sans qu'aucune application cliente ait à changer, et sans fenêtre d'interruption."
      - title: "Architecture hexagonale, dix contextes bornés."
        text: " Domaine, ports, infrastructure et présentation séparés, ports injectés par jetons. Les tests de bout en bout s'exécutent sur des doubles en mémoire, sans infrastructure réelle."
      - title: "Messagerie fiable par transactional outbox."
        text: " Les événements Kafka sont écrits en base dans la même transaction que la donnée, puis drainés par un worker dédié avec purge planifiée et métriques Prometheus. La base reste la source de vérité : un incident du broker ne fait jamais échouer la soumission d'un agent sur le terrain."
      - title: "Sécurité multi-realm."
        text: " Authentification Keycloak avec validation stricte de l'émetteur, et contrôle d'accès par liaisons rôle / site / étape, avec des politiques distinctes pour lire, démarrer et remplir un formulaire."
      - title: "Formulaires pilotés par les données."
        text: " Un nouveau formulaire alimente le circuit des prélèvements dès que son schéma déclare le bloc correspondant. Plus de liste codée en dur, plus de redéploiement backend pour publier une fiche."
      - title: "Intégrations"
        text: " avec les services patients, analyses et biobanque, référentiels résolus et mis en cache, stockage objet MinIO, synchronisation avec le système de formulaires existant."
  - title: "Bibliothèque de composants Angular"
    role: "Conception et maintenance"
    share: "≈ 92 % des commits"
    stack: ["Angular", "PrimeNG", "ng-packagr", "Storybook", "jetons de design CSS", "publication par tags Git"]
    summary: "Dix-neuf composants partagés par trois applications, construits selon une stratégie « kit-first » : extraire plutôt que dupliquer. Wizard et navigation par sous-étapes, grilles éditables, champs texte, sélection, chips, tuiles, compteur, date et heure, téléversement, géolocalisation, enregistrement automatique."
  - title: "Console d'administration des formulaires"
    role: "Conception et développement"
    share: "≈ 98 % des commits"
    summary: "Application Angular de conception, versionnement, publication et gestion des accès aux formulaires. C'est elle qui rend le reste utilisable sans développeur."
  - title: "Application de saisie terrain"
    role: "Contributeur majeur"
    share: "≈ 24 % des commits"
    stack: ["Angular standalone", "PrimeNG", "Dexie / IndexedDB", "Keycloak", "service worker"]
    summary: "Progressive Web App utilisée par les agents de santé."
    details:
      - title: "Moteur de rendu de formulaires sur mesure"
        text: ", environ 4 400 lignes, sans dépendance à la bibliothèque tierce utilisée jusque-là : wizard, champs conditionnels, grilles, validation par étape, préremplissage."
      - title: "Offline-first"
        text: " : brouillons persistés localement et repris hors connexion."
      - title: "Surveillance communautaire"
        text: " : passage d'un signalement communautaire à une fiche clinique préremplie."
  - title: "Application laboratoire"
    role: "Intégration"
    summary: "Rattachement des fiches aux échantillons et publication des prélèvements vers la biobanque, principalement côté backend. Réalignement du moteur de rendu de cette application sur celui de l'application terrain."
  - title: "Infrastructure et livraison"
    stack: ["Kubernetes", "kustomize", "Jenkins", "Docker"]
    summary: "Overlays par environnement, chaînes CI/CD, gestion de la configuration et des secrets. Diagnostic et remise en état d'un environnement bloqué, avec la correction portée dans l'infrastructure-as-code plutôt qu'appliquée à la main."
decisions_fr:
  - title: "Reproduire à l'identique le contrat HTTP du service historique"
    text: "Cela oblige à hériter de choix d'API qu'on n'aurait pas faits soi-même, et à les porter dans une architecture neuve. En échange, la bascule se fait route par route, chaque étape est réversible, et aucune application cliente dans les dix pays n'a eu à être modifiée. Sur un système de surveillance sanitaire, la réversibilité vaut plus que l'élégance."
  - title: "Outbox transactionnel plutôt que publication directe vers Kafka"
    text: "Un worker de drainage et une purge de plus à exploiter, contre la garantie qu'une indisponibilité du broker ne remonte jamais jusqu'à l'agent. Quand la saisie a lieu sur le terrain, un échec d'envoi ne se rattrape pas : la personne est repartie."
  - title: "Doubles en mémoire plutôt que conteneurs de test"
    text: "Cela impose une discipline de conception — tout ce qui sort du domaine doit passer par un port — mais la suite de bout en bout s'exécute n'importe où, sans base, sans broker, sans fournisseur d'identité."
  - title: "Déclarer le circuit des prélèvements dans le schéma du formulaire"
    text: "L'alternative, une liste de types maintenue côté backend, aurait conservé le couplage qu'on cherchait précisément à supprimer. Le critère de réussite était qu'une nouvelle fiche ne demande plus de développeur."
  - title: "Écrire un moteur de rendu sur mesure côté terrain"
    text: "Plutôt que de conserver la dépendance existante. Environ 4 400 lignes à maintenir, contre la maîtrise complète du comportement hors ligne, de la validation par étape et du préremplissage — soit exactement ce dont dépendait l'usage réel."
  - title: "Extraire les composants avant de les dupliquer"
    text: "Trois applications, une bibliothèque versionnée et publiée : une correction faite une fois profite aux trois, et les divergences visuelles ne s'installent pas."
  - title: "Corriger un environnement bloqué dans l'infrastructure-as-code"
    text: "Une remise en route manuelle aurait été plus rapide et se serait redéfaite au déploiement suivant."
deliveries_fr:
  intro: "Un moteur de formulaires ne vaut que par ce qu'il accepte de porter. Quatre fiches ont été mises en service, de natures délibérément éloignées."
  items:
    - title: "SARI — surveillance des infections respiratoires aiguës sévères"
      text: "Circuit hospitalier, avec rattachement des prélèvements et remontée vers le laboratoire puis la biobanque."
    - title: "CVACi — Cellules de Veille et d'Alerte Communautaire intégrée"
      text: "La surveillance à base communautaire est l'un des piliers de la sécurité sanitaire : elle capte les signaux là où ils apparaissent, avant qu'ils n'atteignent une structure de soins. Le circuit est à deux étapes, d'un agent communautaire vers un professionnel de santé qui valide, avec passage automatique dans la file du valideur. Une passerelle bidirectionnelle relie ces signalements à la fiche clinique correspondante, préremplie depuis la source."
    - title: "Déclaration des décès maternels et néonatals"
      text: "Une notification, pas une observation clinique : la transmission est définitive, ce qui impose un récapitulatif exhaustif avant envoi."
    - title: "Diphtérie"
      text: "Publiée pendant l'épidémie."
  outro: "Les trois premières ont été livrées pendant la construction de la plateforme. Ce sont elles qui ont éprouvé la généralité du moteur : un circuit hospitalier, un circuit communautaire à validation en deux temps et une notification irréversible n'ont presque rien en commun, et devoir les faire tenir dans la même abstraction est ce qui a façonné la conception."
proof_fr:
  intro: "La quatrième démontre autre chose."
  lead: "Toute la plateforme repose sur une promesse : publier une nouvelle fiche ne doit plus demander de développeur. Dans le contexte de la réponse à une épidémie de diphtérie, la fiche de surveillance correspondante a été mise en service via la console d'administration, sans écrire de code et sans redéployer le backend."
  text: "C'est la seule validation qui compte pour ce type de système. Tant qu'une fiche n'a pas été publiée dans l'urgence, par la voie prévue, une architecture découplée reste une intention."
  note: "La mission s'est achevée au terme des cinq mois de contrat, suivie d'une intervention ponctuelle d'une semaine en septembre dans le cadre de la réponse épidémique."
---

## Le contexte

L'Institut Pasteur de Dakar est l'un des principaux acteurs de santé publique d'Afrique de l'Ouest. Son programme 4S assure la surveillance sanitaire syndromique et sentinelle.

Concrètement : des agents de santé recueillent sur le terrain des fiches épidémiologiques — infections respiratoires, surveillance communautaire, décès maternels et néonatals, diphtérie — et les prélèvements associés remontent vers le laboratoire puis vers la biobanque. La chaîne va du carnet de l'agent jusqu'à l'échantillon conservé.

## Le problème

Le système reposait sur un service Django historique dans lequel chaque nouvelle fiche impliquait du code : une liste de types en dur, et un redéploiement du backend pour publier un formulaire. Une temporalité de développement logiciel imposée à un besoin de santé publique.

La difficulté n'était pas de concevoir un meilleur système. Elle était de le substituer à un système déjà en service dans dix pays, sans interruption. On n'arrête pas une chaîne de surveillance sanitaire le temps d'une migration.

## Les contraintes

**Pas d'interruption possible.** Des applications clientes en production, dans dix pays, dépendaient du service existant.

**Des environnements de déploiement hétérogènes.** Les pays ne sont pas tous outillés de la même manière. Une même livraison doit atteindre des cibles de nature différente.

**Le réseau n'est pas garanti.** Les agents saisissent là où ils rencontrent les patients, pas là où il y a de la connectivité.

**Une fiche traverse plusieurs métiers.** Elle est découpée en étapes attribuées à des rôles différents, avec passation, revue et droits distincts selon qu'on lit, qu'on démarre ou qu'on remplit.

**Plusieurs périmètres d'authentification.** Les applications consommatrices ne partagent pas le même realm.

**Des données de santé.** Cloisonnement strict, traçabilité, intégrité des prélèvements une fois entrés dans le circuit laboratoire.
