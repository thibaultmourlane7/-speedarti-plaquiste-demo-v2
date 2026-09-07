# SpeedArti — Démo Chiffrage Maçon V2 + Catalogue

## Principe absolu

Le module Maçon reste le module V2 validé. L'intégration catalogue ne remplace aucun calcul métier : elle se branche uniquement après le calcul des quantités, à l'étape **Prix / catalogue**.

## Catalogue Maçon SpeedArti

- 227 articles métier intégrés dans `catalogue-macon.js` ;
- catalogue neutre : aucune enseigne d'origine n'est exposée dans l'interface, le code ou les tests ;
- marque fabricant, produit, référence catalogue, unité de vente et prix artisan moyen HT restent disponibles ;
- prix personnel artisan toujours prioritaire sur le prix catalogue ;
- aucun prix absent ou conditionnement incompatible n'est transformé en prix silencieux.

## Correspondance automatique

Le moteur propose des articles selon le poste calculé :

- blocs béton / parpaings ;
- briques terre cuite ;
- béton cellulaire ;
- mortiers / colles ;
- fibres ;
- coffrage ;
- aciers / armatures ;
- étanchéité / protection ;
- enduits / façade ;
- drainage, caniveaux, assainissement, scellement et éléments préfabriqués lorsque le poste le permet.

La sélection reste toujours modifiable par l'artisan.

## Conditionnements

Conversions automatiques autorisées uniquement lorsque l'unité est démontrable :

- unité ↔ pièce ;
- unité ↔ tarif au cent ;
- kg ↔ sac / sachet / boîte avec poids explicite ;
- m² ↔ m², rouleau ou panneau avec surface explicite ;
- m / ml ↔ mètre ou pièce avec longueur explicite ;
- m³ ↔ m³.

Si la conversion n'est pas fiable, le résultat reste bloqué jusqu'à la saisie d'un prix personnel ou le choix d'un autre article.

## Priorité des prix

1. prix personnel renseigné par l'artisan ;
2. article sélectionné dans le Catalogue Maçon SpeedArti avec conversion compatible ;
3. saisie manuelle obligatoire si aucun prix exploitable n'est disponible.

## Balisage

Chaque contrôle généré par `core.js` possède un `data-trace`. Le sélecteur catalogue utilise la trace `catalogSelection` et reste soumis à la règle absolue de balisage.

## Tests

Lancer :

```bash
node tests.mjs
```

Les tests couvrent la V2 métier existante et l'intégration catalogue :

- persistance des sélections ;
- 40 ouvrages accessibles et calculables ;
- blocage des prix manquants ;
- parité simple / multi ;
- conditionnement au cent ;
- arrondi des sacs au conditionnement complet ;
- conversion m² ;
- prix personnel prioritaire ;
- incompatibilité d'unité bloquante ;
- absence d'enseigne source dans les fichiers Git Maçon.

## v2.2 — correction correspondance catalogue

Cette version renforce la sélection des articles à l'étape « Prix / catalogue » :

- la catégorie calculée (Béton, Ferraillage, Coffrage, etc.) est prioritaire sur les mots présents dans le libellé de l'ouvrage ;
- une famille catalogue incompatible est exclue avant classement ;
- une unité de vente incompatible est exclue avant affichage ;
- le coffrage exprimé en m² propose uniquement des panneaux/contreplaqués compatibles, jamais des accessoires de coffrage à la pièce ;
- les armatures sont filtrées par rôle métier (chaînage horizontal, vertical, linteau, semelle, treillis, etc.) ;
- lorsque l'ouvrage fournit un linéaire physique, ce linéaire est conservé pour convertir un besoin en armatures de longueur connue, tout en gardant le poids calculé pour le chiffrage ;
- les références dépendantes d'une zone sismique ne sont pas proposées automatiquement tant que cette zone n'est pas renseignée ;
- une ancienne sélection devenue incompatible est ignorée et ne peut plus alimenter le prix.

Les contrôles fonctionnels incluent désormais des scénarios de non-régression dédiés à ces cas.
