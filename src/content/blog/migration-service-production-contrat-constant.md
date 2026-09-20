---
title: "Remplacer un service en production sans fenêtre d'interruption"
slug: "migration-service-production-contrat-constant"
description: "Comment remplacer un service critique route par route, sans interruption : reproduire le contrat HTTP à l'identique, garantir qu'aucun envoi n'est perdu avec un outbox transactionnel, et tester de bout en bout sans infrastructure."
pubDate: 2026-09-15T00:00:00.000Z
tags: ["Architecture", "NestJS", "Migration", "TypeScript", "Backend"]
image: "/images/migration-contrat-constant/cover.jpg"
---

## Le service qu'on ne peut pas arrêter

Un service backend est en production depuis des années. Il est lent à faire évoluer, chaque nouveauté demande du code et un redéploiement, et plus personne n'a envie d'y toucher. La décision de le réécrire est facile à prendre. La vraie question arrive juste après : **comment le remplacer alors que des applications s'en servent tous les jours ?**

Sur un programme de surveillance sanitaire, j'ai remplacé un service de formulaires de ce type. Des agents saisissaient des données sur le terrain, souvent sans réseau, et des laboratoires rattachaient des prélèvements à ces données. Aucune fenêtre d'arrêt n'était négociable : on n'interrompt pas une chaîne de surveillance sanitaire le temps d'une migration.

La stratégie qui a marché tient en trois décisions. Aucune n'est spectaculaire, et c'est précisément pour ça qu'elles tiennent.

## 1. Reproduire le contrat à l'identique

La tentation, quand on réécrit, c'est de corriger au passage ce qui ne va pas dans l'API : renommer ce champ mal nommé, remplacer ce code d'erreur incohérent, aplatir cette réponse imbriquée.

C'est le piège. Chaque correction d'API transforme une migration d'infrastructure en projet coordonné entre plusieurs équipes, avec autant d'applications clientes à modifier et à redéployer en même temps.

J'ai donc reproduit le contrat HTTP existant **à l'identique** : mêmes routes, mêmes formats d'entrée et de sortie, mêmes codes d'erreur, y compris les choix que je n'aurais jamais faits moi-même.

```typescript
// On hérite du format de réponse historique, imbrication comprise.
// Le domaine, lui, reste propre : la traduction se fait à la frontière.
@Get(':id')
async findOne(@Param('id') id: string): Promise<LegacyFormResponse> {
  const form = await this.forms.byId(FormId.parse(id));
  return LegacyFormPresenter.toResponse(form);
}
```

Le point important est ce `Presenter` : la forme héritée est isolée dans une seule couche, à la frontière du service. À l'intérieur, le domaine est modélisé comme il devrait l'être. Le jour où les clients pourront évoluer, on ajoute une nouvelle représentation sans toucher au cœur.

Ce que ça coûte : on porte une dette qu'on n'a pas créée, et on écrit des tests qui figent des comportements qu'on trouve mauvais. Ce que ça rapporte : les clients ne savent même pas que le service a changé. Sur un système critique, ce silence vaut très cher.

## 2. Basculer route par route, et pouvoir revenir en arrière

Avec un contrat identique, la bascule n'est plus un événement : c'est une suite de petits pas. On place un aiguillage devant les deux services, et on redirige une route à la fois.

```
              ┌──────────────┐
  clients ──▶ │  aiguillage  │──▶ ancien service (routes restantes)
              └──────┬───────┘
                     └────────▶ nouveau service (routes basculées)
```

C'est le principe du *strangler fig* : le nouveau service enserre l'ancien, route par route, jusqu'à ce qu'il ne reste plus rien à enserrer.

Trois règles rendent la chose supportable :

- **Une route à la fois**, en commençant par les moins risquées : les lectures avant les écritures.
- **Le retour en arrière est un changement de configuration**, pas un redéploiement. Si une route se comporte mal, on la renvoie vers l'ancien service en quelques secondes.
- **Les deux services partagent la même source de vérité** pendant la transition, sinon on ne peut plus revenir en arrière sans perdre des données.

Cette dernière règle est la plus contraignante, et la plus importante. Tant que la donnée est dupliquée entre deux bases, un retour arrière devient une réconciliation manuelle, c'est-à-dire exactement le genre d'opération qu'on veut éviter un vendredi soir.

## 3. Ne jamais perdre un envoi : l'outbox transactionnel

Le nouveau service devait publier des événements vers une messagerie : d'autres services attendent de savoir qu'une donnée est arrivée.

La version naïve enregistre en base, puis publie :

```typescript
// À éviter : deux systèmes, aucune garantie commune
await this.repository.save(submission);
await this.messageBus.emit('submission.created', submission); // et si ça échoue ici ?
```

Si la publication échoue, la donnée est en base mais personne n'est prévenu. Si on inverse l'ordre, on peut annoncer une donnée qui n'a jamais été enregistrée. Dans les deux cas, l'incohérence est silencieuse.

Le motif **outbox transactionnel** supprime le problème : l'événement est écrit en base, dans la même transaction que la donnée.

```typescript
await this.db.transaction(async (tx) => {
  await tx.insert(submissions).values(submission);
  await tx.insert(outbox).values({
    topic: 'submission.created',
    payload: toEvent(submission),
    createdAt: new Date(),
  });
});
```

Un worker dédié lit ensuite la table `outbox` et publie vers la messagerie, en marquant chaque ligne traitée :

```typescript
@Cron('*/5 * * * * *')
async drain(): Promise<void> {
  const pending = await this.outbox.takePending({ limit: 100 });

  for (const message of pending) {
    try {
      await this.messageBus.emit(message.topic, message.payload);
      await this.outbox.markSent(message.id);
    } catch (error) {
      // On laisse la ligne en attente : elle repartira au prochain passage
      await this.outbox.markFailed(message.id, error);
    }
  }
}
```

La base redevient la seule source de vérité. Une panne du broker retarde la publication, elle ne fait plus échouer l'enregistrement.

Ça compte particulièrement quand la saisie a lieu sur le terrain : un envoi qui échoue ne se rattrape pas, parce que la personne qui saisissait est déjà repartie.

Le prix à payer est réel : un worker de plus à exploiter, une purge à planifier pour que la table ne gonfle pas indéfiniment, et des métriques à surveiller (taille de la file, âge du plus ancien message en attente). C'est le genre de coût qu'on accepte volontiers une fois qu'on a vécu l'alternative.

## 4. Tester de bout en bout sans infrastructure

Une migration se vérifie par les tests. Encore faut-il pouvoir les exécuter souvent, et pas seulement dans une chaîne d'intégration qui met dix minutes à démarrer une base et un broker.

J'ai fait passer tout ce qui sort du domaine par un **port**, injecté par jeton :

```typescript
export const SUBMISSION_REPOSITORY = Symbol('SUBMISSION_REPOSITORY');

export interface SubmissionRepository {
  save(submission: Submission): Promise<void>;
  byId(id: SubmissionId): Promise<Submission | null>;
}
```

En production, l'implémentation parle à PostgreSQL. Dans les tests, elle tient dans une `Map` :

```typescript
const moduleRef = await Test.createTestingModule({ imports: [SubmissionsModule] })
  .overrideProvider(SUBMISSION_REPOSITORY)
  .useClass(InMemorySubmissionRepository)
  .overrideProvider(EVENT_BUS)
  .useClass(RecordingEventBus)
  .compile();
```

La suite complète s'exécute alors n'importe où, sans base, sans broker, sans fournisseur d'identité. Elle tourne à chaque sauvegarde, pas seulement sur la chaîne d'intégration.

La contrepartie est une discipline de conception : dès qu'on prend un raccourci et qu'on appelle directement l'infrastructure depuis le domaine, le test redevient lourd. Cette friction est utile, c'est elle qui maintient l'architecture en place.

Les doubles en mémoire ne remplacent pas tout : il faut garder quelques tests contre une vraie base, parce qu'un double ne reproduit ni les contraintes d'unicité, ni le comportement transactionnel réel. Mais ils passent la majorité des cas métier en quelques secondes.

## Ce que je referais autrement

- **Mesurer la parité avant de basculer.** Rejouer un échantillon de trafic réel sur les deux services et comparer les réponses donne bien plus de confiance qu'une suite de tests, aussi complète soit-elle.
- **Écrire les tests de contrat en premier.** Ils décrivent l'existant, pas ce qu'on aimerait construire. Écrits après coup, ils ont tendance à décrire le nouveau service plutôt que l'ancien, et perdent leur utilité.
- **Supprimer l'aiguillage dès que la dernière route a basculé.** Une infrastructure de transition qui reste en place finit par devenir une infrastructure permanente que personne n'ose retirer.

## Ce qu'il faut retenir

Remplacer un service en production n'est pas un problème de framework, c'est un problème de réversibilité. Le contrat identique rend la bascule invisible pour les clients. La bascule route par route rend chaque étape annulable. L'outbox garantit qu'aucune donnée n'est perdue en chemin. Les doubles en mémoire permettent de vérifier tout ça en continu.

Aucune de ces décisions n'est élégante prise isolément. Ensemble, elles permettent de remplacer un système critique sans que personne ne s'en aperçoive, ce qui est exactement le résultat recherché.

