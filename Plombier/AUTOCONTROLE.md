# SpeedArti — Plombier v0.7.1 — Auto-contrôle

Date : 2026-10-08

## Résultat

**608 / 608 assertions réussies** avec le code réellement poussé sur `main`.

Catalogue contrôlé :
- 7 456 références ;
- 7 451 prix exploitables.

Balises : `BALISES-ABSOLUES-v1.8`.

## Contrôles Sprint D

- évier sans configuration explicite → simple bac + bonde `4272991` ;
- habitude de temps sanitaire automatiquement réutilisée ;
- aucune durée sanitaire inventée si aucune habitude/base fiable n’existe ;
- élément spécifique DN40 → tube `044755V` + raccord `059805D` ;
- élément spécifique sans diamètre → fourniture explicitement non chiffrée ;
- robinetterie meuble double : habitude entreprise + quantité 2 ;
- habitude de temps robinetterie réutilisée automatiquement ;
- absence d’habitude robinetterie → message explicite ;
- UI initialise réellement l’évier en simple bac ;
- UI expose le diamètre évacuation spécifique ;
- Ángel v1.6 cohérent avec le moteur.

## Régressions

Les **590 assertions** précédentes restent validées.

## Limite

Le contrôle logique est validé. Un nouveau contrôle navigateur ciblé doit encore être réalisé sur les quatre anomalies de l’audit humain.
