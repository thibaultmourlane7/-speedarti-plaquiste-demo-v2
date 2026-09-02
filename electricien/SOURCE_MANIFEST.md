# SOURCE MANIFEST — Électricien V2

## Principe
Travail sur copie de démonstration. Le code source SpeedArti d’origine n’est ni supprimé ni remplacé.

## Sources utilisées
1. Module Électricien existant SpeedArti :
   - `ElectricienCalculateur.ts`
   - `ElectricienDimensionsStep.tsx`
   - `ElectricienOptionsStep.tsx`
   - `electricien.rules.json`
2. Questionnaire métier Électricien répondu par Guillaume.
3. Annexes 1 à 5 du questionnaire initial.
4. Synthèse Guillaume modifiée reçue le 1er septembre 2026 :
   - Annexe 1 : longueurs par surface et par élément ;
   - Annexe 2 : coefficients de difficulté 0,80 / 1,00 / 1,25 ;
   - Annexe 3 : temps tableau mono / triphasé par nombre de circuits ;
   - Consuel / diagnostic : 150 € HT.

## Règle de sécurité métier
Aucune valeur manquante n’est inventée. Les règles/prix non fournis sont soit :
- saisis manuellement pour la validation ;
- marqués comme non chiffrés ;
- bloqués avec une alerte explicite.

## Production
Cette version est une démo GitHub. Aucun déploiement ou intégration SpeedArti production n’est réalisé.


## Base tarifaire V3
Source Drive : export SpeedArti `codelovableé.md`, section `src/services/chiffrage/integration/catalogueIntegration.ts`, constante `PRIX_MARCHE_DEFAUT`.
Le moteur V3 reprend uniquement les prix existants dans cette table.


## Sources tarifaires V4
- Base SpeedArti Drive `catalogueIntegration.ts / PRIX_MARCHE_DEFAUT` : conservée en priorité.
- Compléments Internet relevés le 01/09/2026 : 123elec, Domomat, Elec44, Leroy Merlin, MaterielElectrique.com, ManoMano, Conrad, Galaxus/Reichelt selon la référence.
- Aucun prix Drive existant n'a été remplacé par la moyenne Internet.

## V5 — Appareillage multi-gammes
- Source catalogue : `SpeedArti_Catalogue_Electricien_Multi_Gammes_2026.xlsx` généré le 01/09/2026.
- Runtime GitHub : `catalogue-appareillage.js` (258 références appareillage) + `catalogue-selector.js`.
- Sélection indépendante par famille et composition des gammes modulaires lorsque les composants sont présents.
- Aucun changement des règles métier Guillaume pour les quantités de points, circuits, métrés ou temps.

## Sécurité compositions V5
- Les gammes composables utilisent uniquement des composants présents dans le catalogue embarqué.
- Une plaque et un enjoliveur de finitions incompatibles ne sont plus assemblés automatiquement.
- Si la composition complète n'existe pas dans la base de démo, elle est signalée comme incomplète au lieu d'être présentée comme une référence exacte.
