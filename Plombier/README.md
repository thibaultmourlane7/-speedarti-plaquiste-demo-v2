# SpeedArti — Plombier v0.6.3 — Référentiel réseau Téréva

Cette version continue le module Plombier existant. Le parcours chantier v0.6.2 est conservé ; le lot v0.6.3 complète les fournitures réseau qui apparaissaient auparavant comme « référentiel à compléter ».

## Principe de prix réseau

Priorité appliquée par le moteur :

1. référence catalogue choisie explicitement par l'artisan si elle existe ;
2. référence technique Téréva 2026 définie par SpeedArti pour le contexte réseau ;
3. fallback uniquement quand Téréva ne publie pas de prix exploitable.

Aucun prix n'est demandé à l'artisan dans le parcours normal pour le PVC, les platines, raccords ou robinets d'arrêt.

## Références techniques Téréva automatiques

Les prix de la base embarquée sont ceux du catalogue Téréva 2026 déjà diminués de 20 %.

### PER
- tube PER 13x16 : code `2272355`, couronne 120 m ; prix de la couronne ramené au ml ;
- raccord de référence : `1098216` ;
- platine simple : `4312345` ;
- platine EF+EC double : `3160404`.

### Multicouche
- tube multicouche Ø16 : code `4146584`, couronne 100 m ; prix ramené au ml ;
- raccord de référence : `4146484` ;
- platine simple : `4312343` ;
- platine EF+EC double : `3160402`.

### Cuivre
- le catalogue Téréva 2026 indique les tubes cuivre comme prix variable/non publié : le fallback SpeedArti validé de 8 €/ml est donc conservé ;
- raccord de référence : `024317Z` ;
- platine simple : `2857663` ;
- platine double : `1181674`.

### Évacuation PVC
- DN40 : `044755V`, prix catalogue au mètre ;
- DN100 pour WC : `044788U`, prix catalogue au mètre ;
- raccord appareil DN40 : `059805D` ;
- raccord WC DN100 : `027749Z`.

### Robinet d'arrêt
- référence automatique : `142568G`.

Les références automatiques restent traçables dans chaque ligne : code Téréva, page source, prix, quantité et formule.

## Temps de pose réseau

Le champ « Temps de pose réseau total » n'est plus vide par défaut. SpeedArti fait une proposition technique calculée depuis les longueurs, puis l'artisan peut la modifier.

Référentiel externe utilisé pour cette proposition : Générateur de prix CYPE France.

- PER/PE-X Ø16 : `0,064 h-h/ml` (0,032 h compagnon + 0,032 h ouvrier) ;
- multicouche Ø16 : `0,064 h-h/ml` ;
- cuivre 13/15 : `0,45 h-h/ml` (0,225 + 0,225) ;
- évacuation PVC : `0,12 h-h/ml` (0,080 + 0,040).

Ce sont des propositions techniques, pas des réponses Guillaume. Dès que l'artisan modifie le temps, sa valeur devient la base réelle du calcul et la balise mémorise l'override.

## Parcours conservé

1. **Base chantier** — dimensionnement, distances chauffe-eau, zones RDC/R+1 avec/sans sanitaire.
2. **Équipements & réseau** — sanitaires indépendants, icônes, panier, quantités réseau automatiques et modifiables.
3. **Configuration & options** — configuration individuelle uniquement si sanitaires + options chantier.
4. **Résultats** — matériaux, MO, TVA, aléas, approvisionnement et contrôles.

Aucun libellé Guillaume / Annexe 1 / Annexe 2 / question de travail n'est destiné à l'interface artisan.

## Balises

Version : `BALISES-ABSOLUES-v1.8`.

Chaîne : UI → donnée → quantité → unité → référence → prix → source → calcul → temps/MO → total → approvisionnement/stock.
