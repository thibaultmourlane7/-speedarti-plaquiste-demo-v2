# SpeedArti — Plombier v0.8.0 — Auto-contrôle

Date : 2026-10-08

## Résultat

**634 / 634 assertions réussies** sur le code réellement présent sur `main`.

Catalogue Téréva contrôlé :
- 7 456 références ;
- 7 451 prix exploitables.

Balises : `BALISES-ABSOLUES-v1.8`.

## Contrôles Sprint E

- distances SDB/cuisine appliquées à EF + EC ;
- lavabo SDB : 8 ml + 5 m = 13 ml EF et 13 ml EC ;
- scénario douche + évier : 5/8 m → 29 ml EF et EC ; 10/10 m → 36 ml EF et EC ;
- lave-main = EF + EC + platine double Téréva `3160404` ;
- ancien mode lave-main EF seul absent de l’UI ;
- choix rapide robinet sur lavabo/vasque ;
- habitude robinetterie lavabo réutilisée automatiquement ;
- habitudes entreprise génériques pour accessoires configurables ;
- fournisseur Téréva tracé dans les sélections et l’approvisionnement ;
- CCL préparé mais inactif avec zéro article ;
- payload fournisseur `PLB-APPRO-V2` ;
- catalogue visuel présent à l’étape 3 ;
- protection CSS anti-chevauchement et layout empilé sous 1180 px ;
- résumé visible des composants automatiques ;
- Ángel Plombier v1.7 cohérent avec les nouvelles règles.

## Régressions

Les **608 assertions** de la v0.7.1 restent intégrées dans la suite.

## Limite

Les tests logiques ne remplacent pas un contrôle visuel navigateur. Les chevauchements signalés par Guillaume doivent être revalidés sur la page publique v0.8.0.
