# SpeedArti — Électricien V5 — Intégration appareillage multi-gammes

## Principe
Le module Électricien existant n'est pas recréé. La V5 ajoute une couche de sélection catalogue à l'étape **Points**.

## Sélection enregistrée
`state.appareillage` contient :
- `global.brand` / `global.gamme` : raccourci facultatif ;
- `socketDistribution.double` / `triple` : répartition physique des prises ;
- `families.<famille>.brand` ;
- `families.<famille>.gamme` ;
- `families.<famille>.choiceId` : référence/composition exacte.

Familles actuellement raccordées :
- `priseSimple`
- `priseDouble`
- `priseTriple`
- `interrupteur`
- `rj45`
- `tv`
- `volet`
- `vmc`
- `priseExtSimple`

## Prix
Ordre de repli dans la démo :
1. référence exacte sélectionnée ;
2. moyenne de la marque / gamme sélectionnée ;
3. moyenne générale de la famille ;
4. ancien prix SpeedArti uniquement si le catalogue multi-gammes ne peut pas résoudre la famille.

En production, le prix fournisseur personnel de l'artisan devra passer avant tous ces niveaux.

## Gammes composables
`catalogue-selector.js` assemble les composants disponibles quand la référence n'est pas un produit complet :
- mécanisme ;
- enjoliveur quand la gamme en possède dans la base ;
- plaque compatible par nombre de postes.

Exemple : Hager Gallery peut produire une composition `mécanisme + enjoliveur + plaque` et calculer le PU HT total.

## Répartition prises
Le besoin de prises calculé par le moteur Guillaume ne change pas.
L'artisan renseigne seulement le nombre de blocs doubles/triples.
Le reste est automatiquement converti en prises simples.

Exemple : besoin 30 prises, 4 doubles et 2 triples :
- 16 simples ;
- 4 doubles = 8 prises ;
- 2 triples = 6 prises ;
- total normatif = 30.

## Limites volontairement conservées pour validation
- le calcul des boîtes d'encastrement reste la logique existante SpeedArti ; il n'est pas encore recalculé selon la composition multi-postes ;
- le choix `interrupteur` est actuellement une famille globale pour toutes les commandes du chantier ; une future passe peut séparer simple / va-et-vient / poussoir / permutateur ;
- le catalogue GitHub est statique ; la production devra lire les références depuis la base catalogue SpeedArti.

Ces limites évitent de modifier des règles métier non encore validées tout en permettant de valider immédiatement l'UX marque/gamme/modèle/finition et le recalcul du prix.
