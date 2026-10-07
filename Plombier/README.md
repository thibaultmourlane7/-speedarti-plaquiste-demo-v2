# SpeedArti — Plombier v0.6.6 — Composition automatique des sanitaires

Cette version continue le module Plombier existant.

## Lot v0.6.6 — composants automatiques et habitudes entreprise

- lavabo, meuble vasque et lave-mains préremplissent désormais automatiquement les composants récurrents couverts par une référence Téréva vérifiée ;
- défaut SpeedArti siphon lavabo/vasque : **Nicoll EASYPHON BM211 — code Téréva `1054371`** ;
- défaut SpeedArti bonde lavabo/vasque : **code Téréva `2864095`** ;
- défaut SpeedArti bonde lave-mains : **Nicoll L2263 — code Téréva `997361L`** ;
- les prix ne sont pas recopiés en dur pour ces composants : le moteur résout le code dans le catalogue Téréva embarqué au moment du calcul ;
- quantité automatique d’un meuble vasque : 1 en simple, 2 en double, ou quantité réelle des vasques ajoutées dans une composition multi-articles ;
- l’artisan peut remplacer une référence automatique sur un sanitaire ;
- il peut déclarer qu’un siphon/une bonde est déjà compris dans le produit principal pour supprimer le double comptage ;
- une préférence enregistrée dans **Habitudes de l’entreprise** devient prioritaire sur le défaut SpeedArti ;
- ordre de priorité : **sélection sanitaire > habitude entreprise > défaut SpeedArti** ;
- la base Angel connaît maintenant ces règles et références.

## Lot v0.6.5 — retour Guillaume

- les accessoires de douche/baignoire restent visuellement attachés à l’option qui les active ;
- le produit principal est replacé avant les accessoires pour éviter qu’il se retrouve en bas de la fiche ;
- un meuble vasque peut désormais être composé de plusieurs références (meuble/pack + une ou plusieurs vasques) avec quantités ;
- meuble vasque et lave-mains disposent d’une option rapide de robinetterie avec référence, quantité et temps total ;
- un élément spécifique sans EF/EC/évacuation affiche clairement qu’aucune platine n’est calculée ; dès qu’un raccordement est coché, il alimente le réseau automatique ;
- les distances chauffe-eau SDB/cuisine sont explicitement tracées dans l’aperçu réseau ;
- les longueurs réseau modifiées manuellement peuvent être remises au calcul automatique ;
- la surface reste une donnée chantier informative tant qu’aucune règle métier validée ne relie directement m² et métrés de tuyaux.

 Le parcours chantier est conservé ; le lot v0.6.4 ajoute des prix moyens d’appareillage quand aucune référence Téréva n’est sélectionnée et une base de connaissances Plombier interrogeable par Angel. Le référentiel réseau Téréva v0.6.3 reste conservé.

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


## v0.6.4 — appareillage sans sélection Téréva

Quand l’artisan ne choisit pas de référence Téréva pour l’appareil principal, le moteur utilise automatiquement une moyenne SpeedArti calculée sur le catalogue Téréva 2026 embarqué (-20 %). Les accessoires sont exclus, les 10 % de prix les plus bas et les 10 % les plus hauts sont retirés, puis une moyenne est calculée pour chaque tiers de gamme.

| Appareil | Éco HT | Standard HT | Premium HT | Références retenues |
| --- | ---: | ---: | ---: | ---: |
| Lavabo / vasque | 82,66 € | 165,11 € | 231,37 € | 49 / 61 |
| Meuble vasque | 138,34 € | 204,19 € | 282,76 € | 82 / 102 |
| Receveur / douche | 305,27 € | 428,06 € | 605,94 € | 289 / 361 |
| Baignoire | 179,04 € | 307,93 € | 1 046,72 € | 28 / 34 |
| Évier | 124,57 € | 194,69 € | 352,22 € | 89 / 111 |
| Lave-main | 58,94 € | 83,59 € | 101,01 € | 20 / 24 |

Priorité : référence Téréva exacte > prix manuel explicite > prix moyen SpeedArti. Le résultat identifie les lignes au moyen de la balise `moyenne_catalogue`.

## Base de connaissances Angel

Le fichier `angel-knowledge.js` expose `window.SpeedArtiAngelPlombierKnowledge` avec :
- les règles métier Plombier vérifiées dans le moteur ;
- les références techniques réseau ;
- les prix moyens d’appareillage ;
- une méthode `search(query, limit)` ;
- une méthode `answer(query)`.

Cette couche est chargée dans la démo après le moteur et avant l’interface.
