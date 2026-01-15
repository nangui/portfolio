---
title: "WebGL et Shaders : Introduction au développement créatif"
slug: "webgl-shaders-introduction-effets-creatifs"
description: "Découverte de WebGL et des shaders GLSL. Retour sur mon apprentissage avec Yuri Artiukh et mes premiers pas dans le développement créatif, loin des grids et flexbox."
pubDate: 2025-01-15T00:00:00.000Z
tags: ["WebGL", "Shaders", "GLSL", "Three.js", "Creative Coding", "Frontend"]
image: "/images/makoki/banner.png"
---

## Introduction : Au-delà du CSS traditionnel

En tant que développeur frontend, j'ai passé des années à maîtriser CSS : grids, flexbox, animations, transitions. Ces outils sont puissants et suffisent pour la plupart des projets web. Mais il arrive un moment où l'on veut créer quelque chose de différent, quelque chose qui sort de l'ordinaire.

C'est ainsi que j'ai découvert **WebGL** et les **shaders**. Un monde où l'on programme directement le GPU, où chaque pixel peut être calculé individuellement, où les limites sont celles de notre imagination et de notre compréhension des mathématiques.

## Qu'est-ce que WebGL ?

**WebGL** (Web Graphics Library) est une API JavaScript qui permet de rendre des graphiques 2D et 3D dans le navigateur. Contrairement à Canvas 2D qui dessine des formes simples, WebGL donne un accès direct au GPU (Graphics Processing Unit), permettant des rendus extrêmement performants.

### Pourquoi WebGL ?

- **Performance** : Le GPU est conçu pour traiter des milliers de calculs en parallèle
- **Effets visuels avancés** : Distortions, particules, effets de lumière, simulations
- **3D** : Création de scènes 3D complexes dans le navigateur
- **Interactivité** : Effets réactifs en temps réel

## Les Shaders : Le Cœur de WebGL

Les **shaders** sont de petits programmes écrits en **GLSL** (OpenGL Shading Language) qui s'exécutent sur le GPU. Et le GPU c'est Graphic Processing Unit, c'est-à-dire qu'il est spécialisé dans le traitement graphique. 
Il existe deux types principaux :

### Vertex Shader

Le **vertex shader** s'exécute pour chaque sommet (point) d'une géométrie. Il détermine la position finale de chaque point dans l'espace 3D. (Dixit Dadja Bassou)

Dans sa forme la plus simple, il passe simplement les coordonnées UV au fragment shader :

```glsl
varying vec2 vUv;

void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
```

Mais il peut aussi modifier la géométrie en 3D, par exemple en déplaçant les sommets selon une fonction mathématique pour créer des effets de vague ou de distorsion.

### Fragment Shader

Le **fragment shader** (ou pixel shader) s'exécute pour chaque pixel à l'écran. Il détermine la couleur finale de chaque pixel en échantillonnant des textures, appliquant des transformations, ou calculant des effets visuels.

Dans sa forme de base, il échantillonne une texture :

```glsl
uniform sampler2D uTexture;
varying vec2 vUv;

void main() {
    vec4 color = texture2D(uTexture, vUv);
    gl_FragColor = color;
}
```

Mais il peut aussi appliquer des effets comme le brightness, la distorsion, ou mélanger plusieurs textures avec des fonctions comme `mix()` et `smoothstep()`.

## Mon Apprentissage avec Yuri Artiukh

J'ai commencé mon apprentissage de WebGL en suivant les cours de **Yuri Artiukh** (également connu sous le nom de "akella" sur YouTube). Ses tutoriels sont excellents pour comprendre les concepts fondamentaux :

- **Les bases de WebGL** : Comment initialiser un contexte, créer un canvas
- **Les shaders** : Comprendre le pipeline de rendu, écrire ses premiers shaders
- **Three.js** : Utiliser cette bibliothèque pour simplifier le travail avec WebGL
- **Les effets créatifs** : Créer des animations, des interactions, des effets visuels

Ses cours m'ont permis de comprendre que WebGL n'est pas juste une API technique, mais un outil créatif puissant.

## La Réalité de l'Apprentissage

Après avoir suivi ces cours et commencé à expérimenter, j'ai rapidement réalisé une chose importante : **le développement créatif demande beaucoup plus que la maîtrise des grids et flexbox**.

### Compétences Nécessaires

1. **Mathématiques** : Vecteurs, matrices, trigonométrie, bruit de Perlin
2. **Algorithmes** : Comprendre comment créer des effets visuels
3. **Performance** : Optimiser les shaders pour maintenir 60 FPS
4. **Créativité** : Imaginer et concevoir des effets visuels
5. **Patience** : Debugger des shaders est complexe (pas de console.log facile !)

### Où j'en suis

Je suis encore **très loin d'être bon** dans ce domaine. J'ai compris les concepts de base, je peux lire et modifier des shaders existants, mais créer des effets complexes de zéro reste un défi. C'est un domaine qui demande des années de pratique et d'expérimentation.

## Application dans Mon Portfolio

J'ai récemment implémenté un système d'affichage d'images au hover sur les cards de projets de mon portfolio. Après avoir étudié différents exemples (hoverwave, Codrops), j'ai finalement opté pour une approche hybride combinant WebGL pour le rendu et des filtres SVG pour la distorsion, inspirée de l'[effet demo2 de Codrops](https://github.com/codrops/SVGImageHover/).

### Architecture Hybride : WebGL + SVG Filters

L'implémentation finale combine le meilleur des deux mondes :
- **WebGL/Three.js** : Pour le rendu de l'image avec brightness dynamique
- **Filtres SVG** : Pour la distorsion performante basée sur la vitesse de la souris

#### Shaders Simplifiés

Après plusieurs itérations, j'ai simplifié les shaders pour se concentrer sur l'essentiel :

**Vertex Shader** :
```glsl
varying vec2 vUv;

void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
```

Simple et efficace : pas de distortion 3D complexe, juste le passage des coordonnées UV.

**Fragment Shader** :
```glsl
varying vec2 vUv;
uniform sampler2D uTexture;
uniform float uAlpha;
uniform float uAspectRatio;
uniform float uBrightness;

void main() {
    vec2 newUV = vUv;
    
    // Crop to square aspect ratio
    vec2 center = vec2(0.5, 0.5);
    vec2 fromCenter = newUV - center;
    if (uAspectRatio > 1.0) {
        fromCenter.x /= uAspectRatio;
    } else {
        fromCenter.y *= uAspectRatio;
    }
    newUV = center + fromCenter;
    
    // Sample texture and apply brightness
    vec4 color = texture2D(uTexture, newUV);
    color.rgb *= uBrightness;
    color.a *= uAlpha;
    
    gl_FragColor = color;
}
```

**Points clés** :
- Recadrage au centre pour afficher l'image en carré
- Brightness dynamique (1.0 à 4.0) selon la vitesse de la souris
- Pas de distortion dans le shader (déléguée au filtre SVG)

#### Rotation et Brightness Dynamiques (Approche Codrops)

Inspiré de l'[article Codrops sur les animations de menu](https://tympanus.net/codrops/2020/07/01/creating-a-menu-image-animation-on-hover/), j'ai implémenté :

- **Rotation dynamique** : -60° à +60° selon la vitesse et direction de la souris
- **Brightness dynamique** : 1.0 à 4.0 selon la vitesse de la souris
- **Interpolation fluide** : Utilisation de `lerp()` pour des transitions douces

```javascript
// Calcul de la vitesse de la souris
const mouseDistanceX = clamp(Math.abs(mousePosCache.x - mousepos.x), 0, 100);

// Rotation basée sur vitesse et direction
animatableProperties.rotation.current = map(
    mouseDistanceX, 0, 100, 0, 
    direction.x < 0 ? 60 : -60
);

// Brightness basé sur vitesse
animatableProperties.brightness.current = map(
    mouseDistanceX, 0, 100, 1, 4
);
```

#### Distorsion avec Filtres SVG (Approche Codrops demo2)

Pour la distorsion, j'ai utilisé l'approche de l'[effet demo2 de Codrops](https://github.com/codrops/SVGImageHover/) qui utilise des filtres SVG plutôt que des shaders complexes.

Le filtre SVG combine `feTurbulence` (génère un noise fractal) et `feDisplacementMap` (déplace les pixels selon ce noise). Le `scale` du `feDisplacementMap` est calculé dynamiquement en fonction de la distance entre la position interpolée de la souris et sa position actuelle.

**Fonctionnement** :
- La position de displacement est interpolée séparément avec `lerp()` (coefficient 0.1)
- La distance entre cette position interpolée et la position actuelle de la souris détermine le scale (0 à 100)
- Plus la souris bouge vite, plus la distance augmente, plus la distorsion est forte
- Quand la souris ralentit, la distorsion diminue progressivement

**Pourquoi les filtres SVG ?** :
- ✅ **Performance** : Gérés nativement par le navigateur, optimisés pour le GPU
- ✅ **Simplicité** : Pas besoin de shaders complexes ou de géométrie avec beaucoup de segments
- ✅ **Flexibilité** : Facile à ajuster et à combiner avec d'autres effets
- ✅ **Compatibilité** : Supportés par tous les navigateurs modernes

### Ce que J'ai Appris

Cette implémentation m'a permis de comprendre plusieurs concepts importants :

- ✅ **Simplifier les shaders** : Parfois, moins c'est plus. Des shaders simples avec des filtres SVG peuvent être plus performants que des shaders complexes
- ✅ **Interpolation (lerp)** : Essentiel pour créer des mouvements fluides et naturels
- ✅ **Hybridation** : Combiner WebGL et SVG permet d'utiliser le meilleur de chaque technologie
- ✅ **Vitesse de la souris** : Calculer la distance parcourue permet de créer des effets réactifs et dynamiques

### Défis Rencontrés

1. **Positionnement de l'image** : Au début, l'image n'apparaissait pas au bon endroit. Solution : Utiliser `left` et `top` directement au lieu de `translate()` pour un container `fixed`.

2. **Taille de l'image** : L'image était trop petite. Solution : Augmenter la taille du canvas à 300x300 et ajuster le scale du mesh à 1.0.

3. **Distorsion SVG** : Comprendre comment le filtre SVG fonctionne avec la distance de la souris. Solution : Analyser le code de [demo2.js](https://raw.githubusercontent.com/codrops/SVGImageHover/master/js/demo2.js) pour comprendre l'approche.

4. **Performance** : Les shaders complexes avec vagues 3D étaient trop lourds. Solution : Simplifier les shaders et utiliser des filtres SVG pour la distorsion, plus performants et gérés nativement par le navigateur.

### Résultat Final

L'effet fonctionne maintenant avec une approche hybride optimisée : l'image suit le curseur de manière fluide avec une rotation dynamique (-60° à +60°) et un brightness dynamique (1.0 à 4.0) selon la vitesse de la souris, tandis qu'une distorsion SVG réactive s'active lorsque la souris bouge rapidement. Cette combinaison WebGL + SVG offre de bonnes performances tout en créant un effet visuellement impressionnant.

## Les Défis du Développement Créatif

### 1. Debugging Complexe

Debugger un shader n'est pas comme debugger du JavaScript. Pas de `console.log`, pas de breakpoints faciles. Il faut souvent visualiser les valeurs en les convertissant en couleurs.

```glsl
// Debug : visualiser une valeur comme couleur
gl_FragColor = vec4(dist, 0.0, 0.0, 1.0); // Rouge = distance
```

### 2. Performance Critique

Chaque pixel exécute le fragment shader. Sur un écran 4K, c'est 8 millions de pixels par frame. À 60 FPS, cela fait 480 millions d'exécutions par seconde. Chaque opération compte.

### 3. Mathématiques Avancées

Les shaders nécessitent une bonne compréhension de :
- **Vecteurs** : Addition, soustraction, produit scalaire, produit vectoriel
- **Matrices** : Transformations 3D, projections
- **Trigonométrie** : `sin()`, `cos()`, pour créer des ondes et rotations
- **Interpolation** : `mix()`, `smoothstep()`, pour créer des transitions

### 4. Créativité Technique

Il ne suffit pas de connaître la syntaxe. Il faut comprendre comment combiner les opérations mathématiques pour créer l'effet visuel désiré. C'est un mélange unique de logique et de créativité.

## Ressources pour Apprendre

Si vous voulez vous lancer dans WebGL et les shaders, voici mes recommandations :

### Cours et Tutoriels

- **Yuri Artiukh (akella)** : Excellent pour débuter, explications claires
- **The Book of Shaders** : Ressource gratuite et complète sur les shaders
- **ShaderToy** : Plateforme pour expérimenter et voir des exemples

### Bibliothèques

- **Three.js** : Simplifie grandement l'utilisation de WebGL
- **GSAP** : Pour animer les uniforms des shaders
- **glslify** : Système de modules pour GLSL

### Pratique

- **Créer des effets simples** : Commencez par des distorsions basiques
- **Analyser des exemples** : Regardez le code d'effets existants
- **Expérimenter** : Modifiez les valeurs, observez les résultats

## Conclusion : Un Voyage qui Commence

WebGL et les shaders représentent un nouveau domaine pour moi. Après des années à maîtriser CSS et JavaScript, découvrir ce monde où l'on programme directement le GPU est à la fois excitant et intimidant.

**Je suis encore débutant**, et c'est OK. Le développement créatif est un domaine vaste qui demande du temps, de la pratique et de la patience. Mais chaque petit effet que je réussis à créer, chaque shader que je comprends, me rapproche un peu plus de maîtriser cet outil puissant.

L'important, c'est de continuer à apprendre, à expérimenter, et à ne pas avoir peur de sortir de sa zone de confort. Parce que c'est là, en dehors des grids et flexbox, que se trouvent les possibilités les plus créatives du web.

---

**Prochaines étapes** : Continuer à explorer les possibilités de WebGL, expérimenter avec d'autres effets visuels, et peut-être un jour créer mes propres shaders complexes de zéro.

_Merci à Yuri Artiukh pour ses excellents cours qui m'ont ouvert les portes de WebGL et des shaders, et à Codrops pour leurs exemples inspirants d'effets visuels._
