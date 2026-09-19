---
slug: "institut-pasteur-dakar-fr"
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
ogImage: "/images/projects/institut-pasteur-dakar-og-fr.jpg"
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
contributions_fr:
  - title: "Service de gestion des formulaires"
    role: "Conception et développement"
    summary: "Le cœur de la plateforme, écrit pour se substituer au service historique route par route."
    details:
      - title: "Migration progressive à contrat constant."
        text: " Le nouveau service reproduit exactement le contrat HTTP de l'ancien. Chaque route peut basculer indépendamment, sans qu'aucune application cliente ait à changer, et sans fenêtre d'interruption."
      - title: "Architecture hexagonale."
        text: " Domaine, ports, infrastructure et présentation séparés, ports injectés par jetons. Les tests de bout en bout s'exécutent sur des doubles en mémoire, sans infrastructure réelle."
      - title: "Messagerie fiable."
        text: " Les événements sont écrits en base dans la même transaction que la donnée, puis publiés par un worker dédié. La base reste la source de vérité : un incident de la messagerie ne fait jamais échouer la soumission d'un agent sur le terrain."
      - title: "Formulaires pilotés par les données."
        text: " Un nouveau formulaire alimente le circuit des prélèvements dès que son schéma déclare le bloc correspondant. Plus de liste codée en dur, plus de redéploiement backend pour publier une fiche."
  - title: "Librairie de composants partagés"
    role: "Conception et maintenance"
    summary: "Dix-neuf composants partagés par trois applications, construits selon une stratégie « kit-first » : extraire plutôt que dupliquer. Wizard et navigation par sous-étapes, grilles éditables, champs texte, sélection, chips, tuiles, compteur, date et heure, téléversement, géolocalisation, enregistrement automatique."
  - title: "Console d'administration des formulaires"
    role: "Conception et développement"
    summary: "L'application de conception, versionnement, publication et gestion des accès aux formulaires. C'est elle qui rend le reste utilisable sans développeur."
  - title: "Application de saisie terrain"
    role: "Contributeur majeur"
    summary: "La Progressive Web App utilisée par les agents de santé, déjà en production à mon arrivée."
    details:
      - title: "Moteur de rendu de formulaires sur mesure"
        text: ", environ 4 400 lignes, sans dépendance à la bibliothèque tierce utilisée jusque-là : wizard, champs conditionnels, grilles, validation par étape, préremplissage."
      - title: "Offline-first"
        text: " : brouillons persistés localement et repris hors connexion."
      - title: "Surveillance communautaire"
        text: " : passage d'un signalement communautaire à une fiche clinique préremplie."
  - title: "Application laboratoire"
    role: "Intégration"
    summary: "Rattachement des prélèvements à une fiche : on choisit un projet puis une fiche, on la saisit et on l'envoie au service de formulaires, qui transmet ensuite les données à la biobanque. Travail principalement côté backend, avec le réalignement du moteur de rendu de cette application sur celui de l'application terrain."
  - title: "Infrastructure et livraison"
    summary: "Configuration par environnement, chaînes d'intégration et de déploiement continus, gestion des secrets."
decisions_fr:
  - title: "Reproduire à l'identique le contrat HTTP du service historique"
    text: "Cela oblige à hériter de choix d'API qu'on n'aurait pas faits soi-même, et à les porter dans une architecture neuve. En échange, la bascule se fait route par route, chaque étape est réversible, et aucune application cliente n'a eu à être modifiée. Sur un système de surveillance sanitaire, la réversibilité vaut plus que l'élégance."
  - title: "Écrire les événements en base avant de les publier"
    text: "Un worker de publication et une purge de plus à exploiter, contre la garantie qu'une indisponibilité de la messagerie ne remonte jamais jusqu'à l'agent. Quand la saisie a lieu sur le terrain, un échec d'envoi ne se rattrape pas : la personne est repartie."
  - title: "Doubles en mémoire plutôt que conteneurs de test"
    text: "Cela impose une discipline de conception — tout ce qui sort du domaine doit passer par un port — mais la suite de bout en bout s'exécute n'importe où, sans base, sans messagerie, sans fournisseur d'identité."
  - title: "Déclarer le circuit des prélèvements dans le schéma du formulaire"
    text: "L'alternative, une liste de types maintenue côté backend, aurait conservé le couplage qu'on cherchait précisément à supprimer. Le critère de réussite était qu'une nouvelle fiche ne demande plus de développeur."
  - title: "Écrire un moteur de rendu sur mesure côté terrain"
    text: "Plutôt que de conserver la dépendance existante. Environ 4 400 lignes à maintenir, contre la maîtrise complète du comportement hors ligne, de la validation par étape et du préremplissage — soit exactement ce dont dépendait l'usage réel."
  - title: "Extraire les composants avant de les dupliquer"
    text: "Trois applications, une bibliothèque versionnée et publiée : une correction faite une fois profite aux trois, et les divergences visuelles ne s'installent pas."
deliveries_fr:
  intro: "Un moteur de formulaires ne vaut que par ce qu'il accepte de porter. Quatre fiches ont été mises en service au Sénégal, de natures délibérément éloignées."
  items:
    - title: "Un circuit hospitalier"
      text: "Des échantillons rattachés à la fiche, traités par le service de formulaires puis transmis à la biobanque."
    - title: "Un circuit communautaire"
      text: "La surveillance à base communautaire capte les signaux là où ils apparaissent, avant qu'ils n'atteignent une structure de soins. Le circuit est à deux étapes, d'un agent communautaire vers un professionnel de santé qui valide, avec passage automatique dans la file du valideur. Une passerelle bidirectionnelle relie ces signalements à la fiche clinique correspondante, préremplie depuis la source."
    - title: "Une notification irréversible"
      text: "Une notification, pas une observation clinique : la transmission est définitive, ce qui impose un récapitulatif exhaustif avant envoi."
    - title: "Une quatrième fiche, publiée en urgence"
      text: "Mise en service par la voie prévue, sans développeur."
  outro: "Les trois premières ont été livrées pendant la construction de la plateforme. Ce sont elles qui ont éprouvé la généralité du moteur : un circuit hospitalier, un circuit communautaire à validation en deux temps et une notification irréversible n'ont presque rien en commun, et devoir les faire tenir dans la même abstraction est ce qui a façonné la conception."
proof_fr:
  intro: "La quatrième démontre autre chose."
  lead: "Toute la plateforme repose sur une promesse : publier une nouvelle fiche ne doit plus demander de développeur. Dans l'urgence d'une réponse sanitaire, la fiche correspondante a été mise en service via la console d'administration, sans écrire de code et sans redéployer le backend."
  text: "C'est la seule validation qui compte pour ce type de système. Tant qu'une fiche n'a pas été publiée dans l'urgence, par la voie prévue, une architecture découplée reste une intention."
---

## Le contexte

L'Institut Pasteur de Dakar est l'un des principaux acteurs de santé publique d'Afrique de l'Ouest, et conduit des programmes de surveillance sanitaire.

Concrètement : des agents de santé saisissent sur le terrain des fiches épidémiologiques, accompagnées pour certaines d'échantillons. Au laboratoire, les prélèvements sont rattachés à une fiche. Les deux applications envoient leurs données au service de formulaires, qui les traite puis les transmet à la biobanque.

À mon arrivée, l'application de saisie terrain était déjà déployée. J'ai ajouté les briques qui rendent les fiches configurables sans développeur : le backend de gestion des formulaires, la console d'administration, et une librairie de composants partagés. Les fiches sont aujourd'hui en service au Sénégal ; la solution est livrée et configurée pour être utilisée dans les autres pays où la plateforme est déployée.

## Le problème

Le système reposait sur un service historique dans lequel chaque nouvelle fiche impliquait du code : une liste de types en dur, et un redéploiement du backend pour publier un formulaire. Une temporalité de développement logiciel imposée à un besoin de santé publique.

La difficulté n'était pas de concevoir un meilleur système. Elle était de le substituer à un système déjà en production, utilisé dans plusieurs pays, sans interruption. On n'arrête pas une chaîne de surveillance sanitaire le temps d'une migration.

## Les contraintes

**Pas d'interruption possible.** Des applications clientes en production, dans plusieurs pays, dépendaient du service existant.

**Des environnements de déploiement hétérogènes.** Les pays ne sont pas tous outillés de la même manière. Une même livraison doit atteindre des cibles de nature différente.

**Le réseau n'est pas garanti.** Les agents saisissent là où ils rencontrent les patients, pas là où il y a de la connectivité.

**Une fiche traverse plusieurs métiers.** Elle est découpée en étapes attribuées à des rôles différents, avec passation, revue et droits distincts selon qu'on lit, qu'on démarre ou qu'on remplit.

**Plusieurs périmètres d'authentification.** Les applications consommatrices ne partagent pas le même annuaire.

**Des données de santé.** Cloisonnement strict, traçabilité, intégrité des prélèvements une fois entrés dans le circuit laboratoire.
