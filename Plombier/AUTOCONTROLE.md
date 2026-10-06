# SpeedArti — Plombier v0.6.4 — Auto-contrôle

Date : 2026-10-06

## Contrôles effectués
- conservation de tous les contrôles historiques du module Plombier ;
- catalogue Téréva embarqué : 7 456 références, dont 7 451 avec prix exploitable ;
- références Téréva réseau automatiques pour PER, multicouche, PVC, platines, raccords et robinets d’arrêt ;
- conservation du fallback cuivre 8 €/ml uniquement parce que le catalogue Téréva 2026 ne publie pas de prix exploitable pour le tube cuivre ;
- temps réseau proposé automatiquement à partir du référentiel CYPE France, mais toujours modifiable par l’artisan ;
- priorité conservée à une référence Téréva choisie par l’artisan ;
- prix moyen automatique pour lavabo, meuble vasque, receveur/douche, baignoire, évier et lave-main quand aucune référence Téréva ni prix manuel n’est fourni ;
- contrôle des trois gammes Éco / Standard / Premium ;
- traçabilité des prix moyens avec la balise `moyenne_catalogue` ;
- base de connaissances Angel chargée et interrogeable ;
- recherche Angel vérifiée sur le cas « prix lavabo sans catalogue » ;
- interface vérifiée statiquement pour l’affichage « Prix moyen SpeedArti » ;
- ordre de chargement catalogue → service → moteur → Angel → app vérifié.

## Résultat

**490 / 490 assertions réussies.**

Balises : `BALISES-ABSOLUES-v1.8`.

Le contrôle a été relancé sur les fichiers réellement présents sur la branche `main` après publication.
