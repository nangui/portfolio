---
slug: "djoubo"
title: "Adonai Nangui | Djoubo - Vehicle Booking Platform"
description: "Plateforme internationale de réservation de véhicules avec chauffeur depuis les aéroports. Système géographique mondial, multi-devise, multi-trajets et paiements intégrés."
stack: ["Laravel", "React", "React Native", "Astro", "Next.js", "Google Maps API", "Gemini AI", "Stripe", "PayPal", "Mollie", "Wave", "Laravel Reverb", "Filament", "GADM"]
featured: true
role: "Tech Lead / Full-Stack Developer"
period: "Janvier 2024 - Décembre 2024"
demoUrl: "https://djoubo.eu"
image: "/images/projects/djoubo-landing.png"
---

## Contexte & Problématique

Le projet est né d'un constat simple du CEO : lorsque les voyageurs arrivent dans un aéroport, ils ont du mal à trouver une voiture de qualité pour se déplacer. Souvent obligés de prendre des taxis qui, dans certains pays, ne sont pas forcément de bonne qualité, et dans les plus grands aéroports, on a même du mal à se retrouver.

**La solution** : Une application permettant aux voyageurs de réserver une voiture à l'avance, soit pour être conduits à l'aéroport, soit pour être récupérés dans un aéroport, garantissant ainsi un service fiable et de qualité.

## Mon Rôle & Arrivée sur le Projet

Je suis arrivé alors que le projet était déjà en cours de développement par une boîte française, mais la direction prise ne correspondait pas aux attentes. J'ai donc repris entièrement le projet en main.

### Reprise du Projet

- **Récupération du code existant** : Laravel backend, React frontend, et HTML + JavaScript pour la landing page
- **Mise en place de l'infrastructure** :
  - Création d'un dépôt interne sur GitHub
  - Configuration de serveurs sur Digital Ocean
  - Intégration de Laravel Forge pour le déploiement
- **Migration de la landing page** : Transformation de la landing page HTML/JS en un projet Astro moderne et performant ([djoubo.eu](https://djoubo.eu))

### Développement sur 12 mois

Sur une période de 12 mois (Janvier 2024 - Décembre 2024), j'ai développé un système complet et robuste :

#### Système Géographique Mondial
- Intégration de **GADM** (Global Administrative Areas Database) pour les données spatiales
- Système géographique prenant en compte tous les pays et toutes les zones dans le monde
- Gestion des aéroports internationaux avec leurs spécificités locales

#### Multi-Devise & Multi-Trajets
- Système multi-devise pour supporter les paiements internationaux
- Gestion de trajets prédéfinis (aéroport → destination populaire)
- Système de trajets au kilomètre pour des destinations personnalisées
- Calcul dynamique des tarifs selon la distance et la zone géographique

#### Gateway de Paiement Multi-Provider
- Intégration de **Stripe** pour les paiements par carte bancaire
- Intégration de **PayPal** pour les paiements alternatifs
- Intégration de **Mollie** pour le marché européen
- Intégration de **Wave** pour le marché africain
- Système unifié de gestion des paiements avec fallback automatique

#### Communication Temps Réel
- **Web Push** pour la communication serveur vers client web
- **Pusher** pour le temps réel sur les applications mobiles
- **Laravel Reverb** pour la communication temps réel côté application admin
- Notifications en temps réel pour les statuts de réservation, arrivée du chauffeur, etc.

#### Application Admin avec Filament
- Interface d'administration complète construite avec **Filament**
- Gestion des réservations, chauffeurs, véhicules, et paiements
- Tableaux de bord analytiques et reporting

#### Intelligence Artificielle
- Intégration de **Google Gemini** pour la recommandation intelligente de l'heure de départ du chauffeur
- Optimisation des trajets et estimation des temps d'arrivée

## Choix Techniques

### Backend
- **Laravel** : Framework robuste pour la gestion de la complexité métier, API REST, et gestion des queues
- **Laravel Reverb** : WebSockets pour la communication temps réel
- **Filament** : Framework admin pour une interface d'administration rapide et moderne

### Frontend
- **React** : Application web principale pour les voyageurs
- **React Native** : Applications mobiles iOS et Android
- **Astro** : Landing page performante et SEO-friendly
- **Next.js** : Application B2B/B2C (en cours de finalisation)

### Services & Intégrations
- **Google Maps API** : Cartographie, calcul d'itinéraires, géolocalisation
- **Google Gemini AI** : Recommandations intelligentes et optimisation
- **GADM** : Données géographiques précises pour tous les pays
- **Pusher** : Communication temps réel pour les applications mobiles
- **Stripe, PayPal, Mollie, Wave** : Gateways de paiement multi-providers
- **Laravel Nightwatch**: Monitoring approfondi pour les apps Laravel

### Infrastructure
- **Digital Ocean** : Hébergement des serveurs
- **Laravel Forge** : Déploiement automatisé et gestion des serveurs
- **GitHub** : Versioning et collaboration

## Défis & Solutions

### Défi 1 : Complexité Géographique
**Problème** : Gérer les spécificités géographiques de tous les pays du monde (zones administratives, aéroports, réglementations locales).

**Solution** : Intégration de GADM pour avoir des données spatiales précises et fiables, avec un système de zones géographiques extensible.

### Défi 2 : Multi-Devise & Paiements
**Problème** : Chaque région a ses propres méthodes de paiement préférées et réglementations différentes.

**Solution** : Système de gateway unifié avec support de 4 providers (Stripe, PayPal, Mollie, Wave) et détection automatique de la meilleure option selon la région.

### Défi 3 : Communication Temps Réel
**Problème** : Les voyageurs et chauffeurs ont besoin d'informations en temps réel (position, statut, notifications).

**Solution** : Architecture multi-protocole avec Web Push pour le web, Pushr pour mobile, et Laravel Reverb pour l'admin, garantissant une communication fluide sur tous les canaux.

### Défi 4 : Migration & Refactoring
**Problème** : Reprendre un projet existant qui ne correspondait pas aux attentes, avec du code legacy.

**Solution** : Migration progressive, refactoring du backend Laravel, modernisation du frontend React, et transformation de la landing page en Astro pour de meilleures performances.

## Résultats / Impact

**Plateforme opérationnelle** : Système complet et fonctionnel couvrant 101 pays et 125 aéroports, avec une architecture scalable conçue pour supporter la croissance internationale.

**Expérience utilisateur optimale** : Applications mobiles natives (iOS & Android) et interface web moderne offrant une expérience fluide et intuitive pour tous les utilisateurs.

**Fiabilité des paiements** : Système multi-provider (Stripe, PayPal, Mollie, Wave) avec fallback automatique, garantissant une disponibilité maximale des transactions.

**Performance et SEO** : Landing page Astro optimisée pour le référencement et les performances, avec des temps de chargement réduits et une meilleure indexation.

**Communication temps réel** : Architecture multi-protocole permettant une communication fluide entre tous les acteurs (voyageurs, chauffeurs, administration) avec notifications instantanées.

**Intelligence artificielle** : Intégration de Google Gemini pour optimiser les trajets, recommander les heures de départ optimales et améliorer continuellement l'expérience utilisateur.

Le projet est aujourd'hui une plateforme complète et opérationnelle, prête à l'échelle internationale. Avec une infrastructure solide et des fonctionnalités avancées, elle répond aux besoins réels des voyageurs dans les aéroports du monde entier, offrant un service fiable et de qualité à chaque étape du trajet.
