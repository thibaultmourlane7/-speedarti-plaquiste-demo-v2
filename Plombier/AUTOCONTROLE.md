# SpeedArti — Plombier v0.6.0 — Auto-contrôle

Date : 2026-09-07

## Objet du lot

Réorganisation du module Plombier existant autour d’une première page **Base chantier**, sans refonte du moteur métier validé.

Contrôles spécifiques ajoutés :
- 3 étapes du nouveau parcours ;
- 4 zones RDC/R+1 avec/sans sanitaire ;
- instances sanitaires indépendantes ;
- absence du bouton Configurer sur la première page ;
- bouton Configurer uniquement lorsqu’un sanitaire existe ;
- réseau seul sans configuration sanitaire ;
- calcul automatique EF/EC/évacuation ;
- propositions automatiques de platines, raccords et robinets d’arrêt ;
- remplacement manuel des propositions automatiques pris en compte dans le moteur ;
- conservation des distances chauffe-eau dans la Base chantier ;
- nettoyage des libellés internes dans l’interface artisan ;
- maintien des règles TVA, complexité, aléas, catalogue, stock et approvisionnement.

## Résultat automatique

- syntaxe JavaScript validée ;
- catalogue : 7 456 références / 7 451 prix exploitables ;
- prix témoin Téréva -20 % conservé ;
- tests historiques du moteur conservés ;
- nouveaux tests du parcours Base chantier ajoutés.

**Résultat : 428 / 428 assertions réussies.**

Balises : `BALISES-ABSOLUES-v1.6`.
