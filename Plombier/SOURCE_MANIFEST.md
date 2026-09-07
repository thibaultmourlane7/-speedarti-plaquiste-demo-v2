# Sources de reprise — Plombier v0.6.0

La v0.6.0 est une évolution de la v0.5.2 du module Plombier existant SpeedArti. Elle ne recrée pas le métier.

Sources métier internes conservées pour le moteur et les contrôles :
- module Plombier SpeedArti existant ;
- workflow et décisions métier déjà validés ;
- compositions techniques des équipements ;
- catalogue Téréva 2026 avec prix de base diminués de 20 %.

Décisions UX intégrées dans ce lot :
- Base chantier en première page ;
- quatre zones RDC/R+1 avec/sans sanitaire ;
- chaque sanitaire est une instance indépendante ;
- pas de Configurer sur la première page ;
- Configurer uniquement si au moins un sanitaire a été sélectionné ;
- réseau et accessoires proposés automatiquement mais modifiables ;
- termes de validation internes supprimés de l’interface artisan ;
- aucune demande de prix inventé dans le parcours normal.

Balises : `BALISES-ABSOLUES-v1.6`.
Package cible : v0.6.0.
