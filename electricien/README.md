# SpeedArti — Démo Chiffrage Électricien V2

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
- **Annexe 1 complémentaire : métrés automatiques par élément et tranche de surface** ;
- **Annexe 2 complémentaire : coefficient chantier 0,80 / 1,00 / 1,25** ;
- **Annexe 3 complémentaire : temps tableau monophasé / triphasé selon nombre de circuits** ;
- **Consuel et diagnostic : 150 € HT chacun** ;
- aucune règle ou prix manquant n’est inventé.

## Règle d’application du tableau
L’annexe 3 donne des valeurs à 8, 12, 16, 20, 24, 28, 32, 36 et 40 circuits. Pour un nombre intermédiaire, la démo utilise le **palier supérieur** afin d’éviter un sous-chiffrage. Au-delà de 40 circuits, le calcul est bloqué et demande validation.

## Points encore volontairement non inventés
- prix des matériaux généraux : liaison catalogue SpeedArti ;
- sections/protections PAC, climatisation, gainable, T.One, IRVE, photovoltaïque : saisie selon fabricant quand nécessaire ;
- multiplicateur spécifique à chaque type de support : non fourni, le support reste utilisé comme information/alerte et le coefficient général chantier pilote la main-d’œuvre.

Aucune donnée n’est envoyée en production.


## V3 — Catalogue prix Drive
- Intégration des prix HT présents dans `catalogueIntegration.ts` / `PRIX_MARCHE_DEFAUT` retrouvé sur le Drive SpeedArti.
- Réintégration des matériels existants : boîtes d'encastrement, tableau, différentiels, protections, terre, parafoudre.
- Les nouvelles références non présentes dans cette base (ex. RJ45/coax/coffret communication) restent sans prix et sont signalées ; aucun tarif n'est inventé.
