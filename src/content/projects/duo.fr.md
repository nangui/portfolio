---
slug: "duo-fr"
title_fr: "Duo - Application mobile de budget à deux"
title_en: "Duo - A Budgeting App for Two"
description_fr: "Projet personnel en cours de développement : une application mobile où un couple ou un foyer tient son budget ensemble, comme un jeu coopératif. Conception du produit, application Expo et backend Supabase."
description_en: "Personal project in development: a mobile app where a couple or a household keeps its budget together, as a cooperative game. Product design, Expo app and Supabase backend."
stack: ["React Native", "Expo", "TypeScript", "Reanimated", "Skia", "TanStack Query", "Supabase", "PostgreSQL"]
featured: false
role_fr: "Conception et développement - Projet personnel"
role_en: "Design and Development - Personal Project"
period_fr: "Septembre 2026 - Aujourd'hui"
period_en: "September 2026 - Present"
image: "/images/projects/duo-tap.png"
decisions_fr:
  - title: "Calculer le jeu côté serveur, jamais dans l'app"
    text: "Série, expérience et quêtes sont calculées par des fonctions Postgres. L'app envoie une dépense et reçoit une récompense. Cela demande des fonctions SQL à tester, mais un client ne peut pas s'attribuer de points, et la série dépend de ce que fait l'autre membre du foyer, que le téléphone ne connaît pas de façon fiable."
  - title: "Stocker l'argent en entiers, avec la devise du foyer"
    text: "Les montants sont des entiers en plus petite unité (centimes, ou francs CFA sans décimale). Aucun flottant, ni à l'écran, ni sur le réseau, ni en base. La saisie s'adapte : sans décimales, la touche virgule devient une touche « 000 »."
  - title: "Générer l'identifiant de chaque dépense sur l'appareil"
    text: "Sur mobile, une requête peut échouer après avoir réussi. Chaque saisie porte un identifiant unique créé avant tout appel réseau : un renvoi ne crée jamais de doublon."
  - title: "Animer sur le thread UI"
    text: "Les retours tactiles et les animations passent par Reanimated et Skia, sans rendu React par image. Une touche réagit même quand le thread JavaScript est occupé. En contrepartie, ce code s'écrit autrement et doit rester petit."
  - title: "Coopératif, jamais compétitif"
    text: "Pas de classement entre les membres d'un foyer, pas de message qui désigne qui a trop dépensé. Le jeu récompense la régularité de la saisie, jamais le montant. C'est une règle de produit, et elle est écrite dans les consignes du dépôt au même titre que les règles techniques."
decisions_en:
  - title: "Compute the game on the server, never in the app"
    text: "Streak, experience and quests are computed by Postgres functions. The app sends an expense and receives a reward. It means SQL functions to test, but a client cannot award itself points, and the streak depends on what the other household member did, which the phone does not reliably know."
  - title: "Store money as integers, with the household's currency"
    text: "Amounts are integers in the smallest unit (cents, or CFA francs with no decimals). No floats, on screen, on the network or in the database. Entry adapts: without decimals, the comma key becomes a “000” key."
  - title: "Generate each expense's identifier on the device"
    text: "On mobile, a request can fail after it succeeded. Every entry carries a unique identifier created before any network call: a retry never creates a duplicate."
  - title: "Animate on the UI thread"
    text: "Touch feedback and animations go through Reanimated and Skia, with no React render per frame. A key responds even when the JavaScript thread is busy. In return, this code is written differently and has to stay small."
  - title: "Cooperative, never competitive"
    text: "No leaderboard between household members, no message pointing at who spent too much. The game rewards the habit of logging, never the amount. It is a product rule, written in the repository's guidelines alongside the technical ones."
---

## Contexte

Duo est un projet personnel : une application mobile pour tenir un budget à deux. Chaque dépense notée fait avancer le foyer, avec une série partagée, des quêtes et une créature qui grandit. La saisie est manuelle et rapide, sans lien bancaire, pour convenir aussi bien au cash et au mobile money qu'aux cartes.

**État du projet.** L'application est en cours de développement et n'est pas encore publiée sur les stores. Le nom est provisoire.

## Mon rôle

Je conçois et développe l'ensemble : le document produit, l'application mobile et le backend.

## Ce qui est construit

- **Application mobile** avec Expo et Expo Router : parcours d'accueil, connexion, création du foyer, saisie rapide, historique, quêtes, statistiques et réglages, en français et en anglais.
- **Backend Supabase** : 8 migrations SQL, la sécurité au niveau des lignes sur toutes les tables, et 5 fonctions Edge (invitations, notifications, abonnement, suppression de compte).
- **Invitation par QR code** pour lier deux comptes dans un même foyer.
- **Tests** : 19 fichiers de tests unitaires côté application et 199 assertions pgTAP côté base, pour les règles d'accès et les règles du jeu.

## Pour aller plus loin

J'ai détaillé le parcours d'une saisie, du doigt jusqu'au serveur, dans un article accompagné d'une figure interactive : [Le trajet d'un tap dans une app React Native](/fr/blog/trajet-tap-react-native).
