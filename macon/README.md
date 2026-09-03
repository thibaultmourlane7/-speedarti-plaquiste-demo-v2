# SpeedArti — Démo Chiffrage Maçon V2

## Principe absolu

Cette V2 ne repart pas du métier Maçon à zéro. Elle reprend le parcours et les sous-ouvrages du module Maçon SpeedArti original, puis réintègre les corrections techniques et les décisions validées avec Guillaume.

## Changements majeurs V2

- correction de la persistance de tous les menus déroulants après rerender ;
- restauration des sous-ouvrages supprimés dans la V1 : ouvertures, poutres BA, pignons, refends, plancher VS, longrines, jambes de force, etc. ;
- ajout d'une vraie étape **Prix / catalogue** avant le résultat ;
- tout prix obligatoire absent possède une case de saisie et bloque le résultat final ;
- les 40 ouvrages de l'Annexe 1 sont réellement sélectionnables et calculables ;
- béton / acier / coffrage / MO de l'Annexe 1 sont modifiables par l'artisan ;
- dalle : treillis / fibres indépendants et cumulables ;
- préfabriqué : +30 % sur fourniture seule, supprimé si prix fournisseur réel ;
- cheminée : conduit, souche et chapeau séparés, temps et montants modifiables, prix manuel sans double comptage ;
- heures-homme, durée et coût MO séparés ;
- aucun ancien coefficient silencieux réintroduit ;
- toutes les options visibles sont balisées vers quantité, matériau, prix, MO, alerte ou rapport.

## Balisage

Chaque contrôle métier généré par `core.js` porte un attribut `data-trace` associé à une destination dans `TRACE_TARGETS`.
Le test `assertBalisage()` échoue si un contrôle visible n'a pas de trace ou si une trace n'a pas de destination.

## Tests

Lancer :

```bash
node tests.mjs
```

La V2 passe 29 contrôles fonctionnels, dont :

- persistance réelle des sélections ;
- accessibilité et calculabilité des 40 ouvrages ;
- parité dalle simple / multi ;
- blocage des prix manquants ;
- présence des champs prix des options ;
- semelle m × cm × cm ;
- préfabriqué ;
- cheminée ;
- ouvertures + linteaux ;
- poutres BA ;
- pignons ;
- absence de double facturation prix manuel / MO.

## Limite volontaire de la démo GitHub

La démo GitHub est statique : elle ne se connecte pas au vrai catalogue SpeedArti. En production, le catalogue entreprise/fournisseur doit rester prioritaire. Dans la démo, les prix non validés sont donc saisis manuellement et le résultat final reste bloqué tant qu'ils ne sont pas renseignés.
