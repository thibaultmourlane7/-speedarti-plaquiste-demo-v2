# SpeedArti — Plombier v0.7.0 — Auto-contrôle

Date : 2026-10-07

## Résultat

**590 / 590 assertions réussies** avec le catalogue Téréva réel embarqué.

Catalogue contrôlé :
- 7 456 références ;
- 7 451 prix exploitables.

Balises : `BALISES-ABSOLUES-v1.8`.

## Contrôles Sprint C

- résolution exacte des références réseau avec `catalogue-service.byCode()` ;
- prix et métadonnées réseau lus depuis `catalogue-data.js`, sans copie dans le moteur ;
- disparition d’une référence technique détectée ;
- incompatibilité d’une référence technique détectée ;
- aucun prix Téréva réseau recopié en dur dans `engine-current.js` ;
- seuls les codes métier et conditionnements nécessaires restent dans le moteur ;
- fallbacks PER/multicouche supprimés ;
- fallback cuivre validé 8 €/ml conservé ;
- Ángel Plombier v1.5 cohérent avec la règle de source unique.

## Régressions conservées

Les 580 assertions précédentes restent validées : composition sanitaire, DN40/DN100, raccordement local/réseau général, cumul main-d’œuvre, catalogue, TVA, aléas, approvisionnement, habitudes entreprise et non-double-comptage.

## Limite

Le contrôle logique complet est validé. Le contrôle visuel interactif dans un navigateur réel reste distinct.
