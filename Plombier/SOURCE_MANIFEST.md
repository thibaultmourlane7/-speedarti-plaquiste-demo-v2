# SpeedArti — Plombier v0.7.0 — Sources du Sprint C

## Sprint C — source unique Téréva réseau

Source de vérité technique : `catalogue-data.js` via `catalogue-service.js`.

Le moteur ne conserve plus de copie des prix/désignations/pages Téréva pour les références réseau. Il conserve uniquement les codes métier et, lorsque nécessaire, la longueur de conditionnement validée pour ramener le prix au ml.

Contrôles ajoutés :
- résolution exacte par code ;
- détection d’une référence disparue ;
- détection d’une référence incompatible avec l’usage attendu ;
- blocage d’une référence technique sans prix exploitable ;
- absence de fallback silencieux PER/multicouche ;
- fallback cuivre 8 €/ml conservé comme exception explicitement validée.

## Base conservée
- module Plombier SpeedArti existant ;
- catalogue Téréva 2026 embarqué : 7 456 références, prix de la base -20 % ;
- parcours chantier en 4 pages ;
- balises, stock et approvisionnement existants ;
- référentiel réseau Téréva de la v0.6.3 conservé.

## Composition automatique étendue — v0.6.9

Source métier : nomenclature sanitaire Guillaume (composition par appareil).

Le moteur n'automatise que les composants pour lesquels un défaut générique suffisamment sûr a été vérifié dans le catalogue Téréva embarqué :
- douche standard — bonde Ø90 : `4273010` ;
- douche extra-plate — bonde extra-plate : `4281682` ;
- baignoire — vidage avec trop-plein : `767547L` ;
- baignoire — siphon : `4273012` ;
- évier — siphon Ø40 : `1066748` ;
- évier 1 cuve — bonde avec trop-plein : `4272991` ;
- évier 2 cuves — bonde avec trop-plein : `4273023` ;
- WC à poser — fixation au sol : `1085426`.

Les éléments dépendants de la géométrie ou du produit principal restent à sélectionner : pipe WC, composants spécifiques de WC suspendu, douche italienne/caniveau/siphon spécifique, certains flexibles et fixations particulières.

Priorité : sélection sanitaire > habitude entreprise > défaut SpeedArti.

## Composition sanitaire automatique — v0.6.9

Source métier : nomenclature Guillaume par appareil.

Le moteur conserve l’ensemble des postes de composition, mais n’attribue automatiquement une référence catalogue que lorsqu’un produit générique peut être retenu sans supposer la géométrie ou le système de pose.

Références Téréva vérifiées dans le catalogue embarqué :
- `4273010` — MB Expert — bonde de douche Ø90 avec capot ;
- `4281682` — MB Expert — bonde de douche extra-plate sortie horizontale ;
- `767547L` — Nicoll — vidage baignoire avec trop-plein souple ;
- `4273012` — MB Expert — siphon baignoire sortie orientable ;
- `1066748` — Nicoll — siphon évier Ø40 BM552 ;
- `4272991` — MB Expert — bonde évier 1 cuve avec trop-plein ;
- `4273023` — MB Expert — bonde évier 2 cuves avec trop-plein ;
- `1085426` — MB Expert — fixation WC/bidet 70 × 6.

Non automatisé volontairement :
- douche italienne ;
- pipe WC ;
- accessoires WC suspendu ;
- tout composant dont le choix dépend du produit principal ou de la géométrie réelle.

## Évacuation locale / réseau général — v0.6.8

Règle Guillaume :
- le sanitaire comprend son raccordement local, dont la petite évacuation ;
- le réseau d’évacuation général de la maison est séparé et doit être traité comme un élément spécifique lorsqu’il est à refaire ;
- une valeur artisan modifiée reste la base du calcul, sans déduire silencieusement une autre nature de travaux.

Application :
- WC local : DN100 — tube Téréva `044788U`, raccord `027749Z` ;
- autres sanitaires locaux : DN40 — tube Téréva `044755V`, raccord `059805D` ;
- en mixte, les quantités et références sont séparées ;
- aucun DN n’est inventé pour un réseau général/spécifique dont le diamètre n’est pas renseigné.

## Règle main-d’œuvre v0.6.7

Source métier : réponses Guillaume + cahier de fonctionnement Plombier.
- un sanitaire comprend sa fourniture/configuration, son raccordement local et sa main-d'œuvre ;
- le raccordement local (platine(s), bonde/siphon, petite évacuation locale) ne doit pas être facturé une seconde fois dans le temps réseau ;
- les EF/EC et l'évacuation générale restent un poste réseau distinct ;
- les temps visibles restent modifiables par l'artisan ;
- en l'absence de temps fiable, le module doit alerter plutôt qu'inventer.

Conséquence moteur : le temps automatique réseau conserve les rendements techniques EF/EC, mais exclut le mètre d'évacuation locale par sanitaire. Toute longueur d'évacuation au-delà de ce local est traitée comme évacuation générale.

## Composants automatiques sanitaires v0.6.6

Les références ci-dessous ont été vérifiées dans le catalogue Téréva 2026 embarqué. Le moteur résout les produits par code au moment du calcul afin de conserver le prix et les métadonnées du catalogue comme source de vérité.

- `1054371` — Nicoll, **SIPHON LAVABO EASYPHON BM211**, Ø32, blanc ;
- `2864095` — MB Expert, **BONDE LAVABO CLIC CLAC OU ÉCOULEMENT LIBRE**, chromé ;
- `997361L` — Nicoll, **BONDE LAVE-MAINS À GRILLE L2263**, chromé.

Ces références sont des défauts SpeedArti, pas des préférences imposées. Une référence habituelle de l’entreprise ou une sélection faite sur le sanitaire devient prioritaire. Un composant explicitement compris dans le produit principal n’est pas ajouté une seconde fois.

## Prix moyens d’appareillage sans sélection catalogue

Source : catalogue Téréva 2026 embarqué dans `catalogue-data.js`, avec prix déjà diminués de 20 %.

Méthode appliquée par catégorie :
1. filtrer les produits principaux et exclure les accessoires ;
2. retirer les 10 % de prix les plus bas et les 10 % les plus hauts ;
3. répartir le reste en trois tiers de gamme ;
4. calculer la moyenne de chaque tiers pour Éco / Standard / Premium.

Valeurs intégrées :

| Appareil | Éco HT | Standard HT | Premium HT | Références retenues |
| --- | ---: | ---: | ---: | ---: |
| Lavabo / vasque | 82,66 € | 165,11 € | 231,37 € | 49 / 61 |
| Meuble vasque | 138,34 € | 204,19 € | 282,76 € | 82 / 102 |
| Receveur / douche | 305,27 € | 428,06 € | 605,94 € | 289 / 361 |
| Baignoire | 179,04 € | 307,93 € | 1 046,72 € | 28 / 34 |
| Évier | 124,57 € | 194,69 € | 352,22 € | 89 / 111 |
| Lave-main | 58,94 € | 83,59 € | 101,01 € | 20 / 24 |

Priorité de prix : référence Téréva exacte > prix manuel explicite > moyenne SpeedArti.

## Base de connaissances Angel

Fichier : `angel-knowledge.js`.

La base reprend les règles vérifiées du moteur Plombier : prix, réseau, références techniques, temps de pose, zones, WC, PMR, douche italienne, gamme, complexité, approvisionnement et balises. Elle expose une recherche structurée et une réponse textuelle pour l’interrogation par Angel.

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
