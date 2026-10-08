# SpeedArti — Plombier v0.7.1 — Contrôle ciblé Sprint D

Date : 2026-10-08

Origine : audit navigateur humain v0.7.0 ayant remonté 4 anomalies.

## Correctifs implémentés

1. **Temps sanitaire vide**
   - automatisation par habitude entreprise ;
   - aucune durée arbitraire inventée ;
   - sans valeur fiable, le message n’est plus masqué.

2. **Évier simple**
   - configuration initiale `simple` ;
   - moteur robuste aux anciens brouillons sans `config` ;
   - bonde `4272991` automatique immédiatement.

3. **Élément spécifique avec évacuation**
   - choix diamètre DN40 / DN100 / autre ;
   - DN40/DN100 chiffrés automatiquement avec les références Téréva validées ;
   - sans diamètre, fourniture clairement signalée comme non chiffrée.

4. **Robinetterie meuble double**
   - référence habituelle entreprise utilisable automatiquement ;
   - quantité 2 automatiquement conservée pour double vasque ;
   - temps de robinetterie mémorisable comme habitude ;
   - sans référence fiable, message utilisateur explicite.

## Statut logique

**608 / 608 assertions réussies.**

## À retester dans le navigateur

Retester uniquement les 4 scénarios ci-dessus sur la version publique v0.7.1. Le Sprint D ne doit être déclaré validé ergonomiquement qu’après ce contrôle humain ciblé.
