# SpeedArti — Plombier v0.6.7 — Auto-contrôle

Date : 2026-10-07

## Résultat

**533 / 533 assertions réussies** sur la suite complète chargée avec le catalogue Téréva réel embarqué.

Catalogue contrôlé :
- 7 456 références ;
- 7 451 prix exploitables.

Balises : `BALISES-ABSOLUES-v1.8`.

## Contrôles ajoutés en v0.6.7

- séparation explicite de la main-d’œuvre sanitaire/raccordements locaux et du réseau général ;
- un lavabo à 2 h avec son réseau PER automatique donne :
  - 2,00 h pose sanitaire + raccordements locaux ;
  - 1,34 h réseau général ;
  - 3,34 h cumulées ;
- le mètre d'évacuation locale du lavabo n'ajoute pas de temps PVC réseau supplémentaire ;
- si l'évacuation passe de 1 m local à 3 m, seuls les 2 m supplémentaires sont traités comme évacuation générale ;
- décomposition des heures affichée dans le résultat ;
- libellés UI précisent que platines/raccordements locaux sont compris dans le temps sanitaire ;
- règle connue par Angel Plombier v1.2.

## Contrôles antérieurs conservés

- distances chauffe-eau SDB/cuisine ;
- platines et éléments spécifiques ;
- meuble vasque multi-articles ;
- robinetterie rapide ;
- composants automatiques siphon/bonde ;
- habitudes d'entreprise ;
- non-double-comptage des composants compris dans un produit principal.

## Limite

Le contrôle logique complet est validé. Le contrôle visuel interactif dans un navigateur réel reste distinct.
