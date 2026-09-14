# SpeedArti — Plombier v0.6.3 — Sources du lot

## Base conservée
- module Plombier SpeedArti existant ;
- règles métier consolidées jusqu'à la v0.6.2 ;
- catalogue Téréva 2026 embarqué : 7 456 références, prix de la base -20 % ;
- parcours chantier en 4 pages ;
- balises, stock et approvisionnement existants.

## Téréva 2026 utilisés comme références techniques réseau
- `2272355` — tube PER 13x16, 120 m ;
- `4146584` — tube multicouche Ø16, 100 m ;
- `044755V` — tube PVC évacuation DN40 ;
- `044788U` — tube PVC évacuation DN100 ;
- `4312345` / `3160404` — platines PER simple/double ;
- `4312343` / `3160402` — platines multicouche simple/double ;
- `2857663` / `1181674` — références platine cuivre simple/double ;
- `1098216` — raccord PER ;
- `4146484` — raccord multicouche ;
- `024317Z` — raccord cuivre ;
- `059805D` — raccord sanitaire PVC DN40 ;
- `027749Z` — raccord PVC DN100 ;
- `142568G` — robinet d'arrêt.

Les tubes cuivre du catalogue 2026 n'ayant pas de prix T exploitable, le fallback SpeedArti validé de 8 €/ml est conservé et explicitement tracé comme fallback.

## Référentiel externe de temps
Source : Générateur de prix de la construction CYPE France.
- PE-X/PER Ø16 : 0,032 h compagnon + 0,032 h ouvrier par ml ;
- multicouche Ø16 : 0,032 h + 0,032 h par ml ;
- cuivre 13/15 : 0,225 h + 0,225 h par ml ;
- PVC faible évacuation : 0,080 h + 0,040 h par ml.

Ces rendements servent uniquement de proposition automatique modifiable et leur provenance est conservée dans les balises.
