# SpeedArti — Démo Plombier v0.2.0

Cette démo **ne recrée pas le module Plombier**. Elle améliore la démonstration construite à partir du module Plombier SpeedArti existant, en conservant son identité visuelle et son parcours en 5 étapes.

## Références utilisées

- code Plombier existant SpeedArti ;
- questionnaire métier principal rempli par Guillaume ;
- questionnaire complémentaire rempli par Guillaume ;
- mapping / workflow transmis par Thibault ;
- validation de l’Annexe 1 ;
- validation du cas « installation complète réseau seul sans sanitaire ».

## v0.2.0 — premier lot codé

- Installation complète avec **0 sanitaire autorisé** ;
- points réseau / attentes EF, EC, EF+EC et platines ;
- ajout d’équipements sanitaires **un par un** et configuration indépendante ;
- Petits travaux **multi-prestations** avec bouton `+ Ajouter une prestation` ;
- aucun WC ajouté silencieusement en remplacement ;
- gamme ECO / Standard / Premium sur les familles validées ;
- complexité appliquée uniquement à la main-d’œuvre ;
- TVA 10 % / 20 % ;
- PMR WC et PMR douche séparés, forfaits 300 € ;
- douche italienne : +40 % sur la douche concernée uniquement, SPEC / natte / chape facultatifs ;
- réseau proposé EF / EC / évacuation, visible et modifiable ;
- Annexe 1 intégrée en unitaire / forfait complet ;
- valeurs SpeedArti simulées comme paramètres entreprise modifiables ;
- traceur d’alertes pour prix catalogue et temps manquants ;
- résultat avec durée chantier, heures-homme, réseau, HT / TVA / TTC et statut de finalisation.

## Principe de sécurité métier

Un champ visible doit avoir un effet réel sur le prix, le temps, les matériaux, le réseau, une recommandation ou une alerte. Lorsqu’une donnée métier n’est pas explicitement disponible, la démo n’invente pas un prix catalogue ou un temps de pose.

## Point technique conservé de l’original

Le code Plombier original utilise actuellement une référence de `0,15 h/ml` pour la pose de tuyauterie. Elle est conservée dans cette démo comme comportement existant tant qu’une table de temps métier / catalogue ne la remplace pas.

La surface de la maison est maintenant saisissable et conservée, mais aucune formule de pondération par surface n’a été inventée : elle n’apparaît pas explicitement dans le calculateur Plombier original disponible.
