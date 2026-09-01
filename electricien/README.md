# SpeedArti — Démo Chiffrage Électricien

Cette démo **ne remplace pas** le module Électricien SpeedArti. Elle sert uniquement à valider les corrections métier avant toute intégration en production.

## Base conservée
- parcours multi-étapes du chiffrage ;
- champs existants utiles (type de bien, surface, niveaux, tableau, conformité, options) ;
- calcul des circuits, matériaux, main-d’œuvre, alertes ;
- liaison prévue avec le catalogue SpeedArti ;
- visuel de la démo chiffrage déjà utilisé pour Plaquiste.

## Corrections intégrées
- Neuf / Rénovation uniquement ;
- Monophasé / Triphasé ;
- composition du logement par type de pièce ;
- mode AUTO modifiable ;
- RJ45 / TV + coffret communication ;
- VMC / sonnette / visiophone ;
- circuits monophasés et triphasés d’après les annexes ;
- chauffage électrique d’après le tableau Guillaume ;
- rénovation : conserver / remplacer / déplacer / créer ;
- temps de main-d’œuvre validés ;
- Somfy / TaHoma annexe 5 ;
- aucune règle ou prix manquant n’est inventé.

## Blocages volontaires
Les points non chiffrés faute de valeur validée restent visibles comme blocages :
1. coefficient surface → longueurs de fils/gaines ;
2. coefficients exacts difficulté/support ;
3. majoration temps/prix tableau triphasé ;
4. forfait Consuel / diagnostic ;
5. prix catalogue généraux.

Aucune donnée n’est envoyée en production.
