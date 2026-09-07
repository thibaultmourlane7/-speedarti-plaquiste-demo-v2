# SpeedArti — Plombier v0.6.1 — Parcours chantier intégral

Cette version repart du module Plombier déjà développé. Le moteur métier, le catalogue Téréva, les règles de réseau, les balises, la TVA, la complexité, les aléas, l'approvisionnement et les contrôles existants sont conservés. La modification principale concerne l'organisation du parcours artisan.

## Parcours installation complète

Le parcours est maintenant organisé en 4 pages :

1. **Base chantier** — dimensionnement, distances depuis le chauffe-eau et 4 zones indépendantes RDC/R+1 avec ou sans sanitaire.
2. **Équipements & réseau** — sélection des sanitaires, panier latéral, calcul automatique et modification des quantités réseau.
3. **Configuration & options** — configuration individuelle facultative des sanitaires + options du chantier, avec le même panier latéral.
4. **Résultats** — contrôle du chiffrage, matériaux, main-d'œuvre, TVA et approvisionnement.

## Page 1 — Base chantier

- dimensionnement du chantier ;
- surface ;
- type de canalisation ;
- nombre d'ouvriers ;
- distance chauffe-eau → salle de bains ;
- distance chauffe-eau → cuisine ;
- 4 cases indépendantes :
  - RDC — Sans sanitaire ;
  - R+1 — Sans sanitaire ;
  - RDC — Avec sanitaires ;
  - R+1 — Avec sanitaires.

Les distances ne sont plus répétées dans les options.

## Page 2 — Équipements & réseau

Chaque clic crée une instance séparée. Deux clics sur WC créent **WC 1** et **WC 2**.

Lorsque RDC et R+1 avec sanitaires sont tous les deux sélectionnés, les palettes d'ajout sont séparées par niveau afin que chaque nouvel équipement conserve sa zone chantier.

Les sanitaires disposent d'icônes SVG dédiées. Le panier latéral apparaît dès le premier sanitaire sélectionné. Sur cette page il permet uniquement de voir les éléments et de les supprimer : **aucun bouton Configurer**.

Les quantités proposées automatiquement et modifiables comprennent :
- eau froide ;
- eau chaude ;
- évacuation ;
- platines EF ;
- platines EC ;
- platines EF + EC ;
- raccordements évacuation ;
- raccords ;
- robinets d'arrêt / vannes ;
- temps de pose réseau.

Une valeur modifiée par l'artisan devient la valeur réellement utilisée dans le calcul.

## Page 3 — Configuration & options

La configuration apparaît uniquement ici, au même niveau que les options.

Le panier latéral est conservé. Un bouton **Configurer** apparaît pour chaque sanitaire présent. Chaque élément reste indépendant : WC 1 et WC 2 peuvent avoir des configurations différentes.

En installation sans sanitaire :
- aucune palette sanitaire ;
- aucun panier sanitaire ;
- aucun bouton Configurer ;
- uniquement les options utiles au chantier.

Les anciennes références de travail ne sont pas exposées à l'artisan. Les intitulés visibles sont des intitulés métier SpeedArti.

## Tarifs

Le parcours normal ne demande plus à l'artisan de saisir un prix pendant le chiffrage.

- les articles utilisent le catalogue ou les valeurs SpeedArti/entreprise existantes ;
- les prestations de service utilisent le tarif entreprise lorsqu'il existe ;
- si un tarif nécessaire n'est pas paramétré, le contrôle le signale sans inventer un montant et sans demander un prix dans le chantier.

## Règles conservées

- catalogue Téréva 2026 : 7 456 références, 7 451 prix exploitables ;
- prix de la base catalogue diminués de 20 % ;
- réseau EF/EC/évacuation et accessoires traçables ;
- 6 raccords par appareil/point + 10 % selon les règles validées ;
- robinets d'arrêt selon la composition de chaque équipement ;
- complexité appliquée uniquement à la main-d'œuvre ;
- aléas = 4 % de la main-d'œuvre HT uniquement ;
- nombre d'ouvriers agit sur la durée chantier, pas sur les heures-homme facturées ;
- TVA 10 % / 20 % conservée ;
- stock réel uniquement ;
- besoins fournisseur et exports conservés.

## Balises

Version : `BALISES-ABSOLUES-v1.6`.

Chaîne : UI → donnée → quantité → unité → prix → source → calcul → total → approvisionnement / stock.
