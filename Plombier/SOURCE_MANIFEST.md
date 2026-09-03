# Source de reprise — Plombier v0.2.0

Base technique : module Plombier existant du snapshot SpeedArti `speedarti-code-29-07-26` via la copie de travail Plaquiste améliorée V2.

Fichiers source métier / technique de référence :
- `src/components/chiffrage/ChiffrageWizard.tsx`
- `src/components/chiffrage/steps/PlombierTypeProjetStep.tsx`
- `src/components/chiffrage/steps/PlombierDimensionsStep.tsx`
- `src/components/chiffrage/steps/PlombierOptionsStep.tsx`
- `src/services/chiffrage/calculateurs/PlombierCalculateur.ts`
- `src/services/chiffrage/calculateurs/BaseCalculateur.ts`
- `src/services/chiffrage/chiffrageService.ts`
- `src/services/chiffrage/integration/catalogueIntegration.ts`
- `src/services/chiffrage/types.ts`
- `src/services/chiffrage/regles/plombier.rules.json`
- `src/services/chiffrage/__tests__/PlombierCalculateur.test.ts`

Documents métier :
- `Questionnaire_cible_correction_module_Plombier_Guillaume ok.docx`
- `SpeedArti_Questionnaire_complementaire_Plomberie_Guillaume MODIF.docx`
- Annexe 1 validée par Guillaume comme grille à intégrer en forfait complet ou unitaire selon l’élément.
- Dernière décision Guillaume : une Installation complète peut être un réseau seul sans sanitaire ; les attentes EF/EC et raccordements/platines restent chiffrables.

La démo v0.2.0 reste un environnement de validation. Elle ne remplace pas directement le module React de production.
