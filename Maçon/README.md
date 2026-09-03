# SpeedArti — Démo Chiffrage Maçon

Cette démo est destinée au dépôt GitHub unique des démonstrations de chiffrage SpeedArti.

## Principe absolu

Le module Maçon n'est pas recréé. La démo reprend le parcours et le vocabulaire du module Maçon existant puis y applique les corrections techniques et les décisions métier validées.

## Accès

Depuis la page d'accueil du dépôt :

`Maçon` → `./macon/`

Le bouton **Retour aux métiers** renvoie vers `../`.

## Corrections visibles dans la démo

- modes simple / multi séparés ;
- semelle : m × cm × cm avec profondeur de fouille séparée ;
- cheminée distincte de l'escalier ;
- heures-homme séparées de la durée chantier ;
- aucun coefficient silencieux ;
- 40 ouvrages de référence ;
- mur préfabriqué : +30 % sur fourniture uniquement si pas de prix fournisseur réel ;
- temps préfabriqué 1,55 / 1,90 / 2,75 h-homme/ml ;
- camion-benne 8×4 : 800 € HT/jour, modifiable ;
- fibres : plages 3–4 / 5–6 / 7–9 / 20–40 kg/m³ ;
- prix catalogue manquant = alerte + prix manuel éditable ;
- TVA et taux horaire obligatoires, sans valeur cachée.

## Fichiers

- `index.html` : écran Maçon ;
- `styles.css` : style SpeedArti, basé sur les cartes/panneaux du module existant ;
- `references.js` : référentiel métier validé ;
- `app.js` : parcours, calculs et totalisation ;
- `tests.mjs` : contrôles de non-régression du référentiel.

## Test local

```bash
node tests.mjs
```
