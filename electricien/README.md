# SpeedArti — Démo Chiffrage Électricien V5

Cette démo **ne recrée pas** le module Électricien. Elle prolonge la copie de validation existante avec la sélection d'appareillage multi-marques / multi-gammes.

## V5 — Appareillage & finitions

Dans l'étape **Points**, un bloc `Appareillage & finitions` permet maintenant :

- un choix global rapide facultatif ;
- puis un choix **indépendant par famille** ;
- marque → gamme → modèle / finition → référence exacte ;
- chaque famille peut utiliser une marque différente ;
- les prises simples, doubles et triples sont réparties physiquement sans modifier le besoin normatif ;
- pour les gammes composables, le prix peut être la somme `mécanisme + enjoliveur + plaque` lorsque tous les composants compatibles sont présents ;
- les compositions incomplètes sont signalées comme telles : la démo ne mélange plus automatiquement deux finitions incompatibles ;
- le résultat affiche la référence, le PU HT, la quantité, le total et la source.

### Exemple autorisé sur un même chantier

- Prises simples : **Legrand Dooxie blanc** ;
- prises doubles / triples : **Schneider Odace** ;
- interrupteurs : **Schneider Odace anthracite** ;
- RJ45 : **Hager Essensya** ;
- TV : **Legrand Dooxie** ;
- volets : **Legrand Dooxie** ;
- VMC : **Hager Essensya** ;
- prises extérieures : **Hager Cubyko**.

Le choix d'une famille n'impose jamais la même marque aux autres familles.

## Catalogue embarqué

La démo charge :

- `catalogue-appareillage.js` : 258 références issues de la base multi-gammes 2026 ;
- `catalogue-selector.js` : filtres par famille / marque / gamme et composition des références modulaires.

La base comprend notamment des références Schneider Electric, Hager et Legrand, avec plusieurs gammes, modèles et finitions.

## Règle de prix V5

Pour l'appareillage :

1. prix exact de la référence choisie dans la démo ;
2. si aucune référence exacte n'est choisie : moyenne de la marque / gamme compatible ;
3. sinon : moyenne générale de la famille.

Dans SpeedArti production, le **prix fournisseur personnel de l'artisan devra rester prioritaire** devant ce catalogue de référence.

Les câbles et gaines restent sur les prix moyens existants du moteur de validation.

## Quantités métier conservées

La V5 ne change pas les règles Guillaume :

- Neuf / Rénovation ;
- mono / tri ;
- AUTO des points ;
- métrés Annexe 1 ;
- coefficient chantier 0,80 / 1,00 / 1,25 ;
- circuits et tableau ;
- temps de main-d'œuvre ;
- Consuel / diagnostic ;
- VMC / sonnette / Somfy.

Le catalogue agit sur **la référence et le prix du matériel**, pas sur le besoin métier.

## Important pour la production

Cette version est une démo GitHub statique. L'intégration SpeedArti finale devra conserver cette UX mais lire les références dans la base catalogue existante au lieu de charger `catalogue-appareillage.js`.
