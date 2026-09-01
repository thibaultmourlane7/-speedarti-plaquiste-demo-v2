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
