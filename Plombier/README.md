# SpeedArti — Plombier v0.6.0 — Base chantier

Cette version fait évoluer le module Plombier existant sans recréer le métier ni modifier les règles de calcul validées.

## Nouveau parcours artisan

Le parcours installation complète est organisé en 3 pages :

1. **Base chantier** — dimensionnement, distances chauffe-eau, zones RDC/R+1, sélection des sanitaires et calcul automatique du réseau.
2. **Configuration & options** — configuration individuelle des sanitaires sélectionnés et options complémentaires.
3. **Résultats** — contrôle du chiffrage, matériaux, main-d’œuvre, TVA et approvisionnement.

Les termes internes de travail (Guillaume, questionnaires, annexes, mapping) ne sont plus affichés dans l’interface artisan. Ils restent uniquement des sources techniques internes lorsque nécessaires au contrôle.

## Base chantier

Quatre zones indépendantes peuvent être sélectionnées ou désélectionnées :
- RDC — sans sanitaire ;
- R+1 — sans sanitaire ;
- RDC — avec sanitaires ;
- R+1 — avec sanitaires.

Chaque clic sur un sanitaire crée une **instance indépendante** : deux clics sur WC créent WC 1 et WC 2. La page Base chantier affiche un panier latéral avec les éléments sélectionnés et leur suppression, sans bouton Configurer.

Le réseau est proposé automatiquement et reste modifiable : EF, EC, évacuation, platines, raccords, robinets d’arrêt et temps réseau. Une valeur modifiée par l’artisan devient la valeur réellement utilisée dans le calcul.

## Configuration

Le bouton **Configurer** apparaît uniquement lorsqu’au moins un sanitaire existe. Chaque équipement se configure séparément. En réseau seul, aucune configuration sanitaire n’est affichée.

La page centrale ne reprend plus les distances ou le dimensionnement du réseau : elle est dédiée aux configurations des sanitaires et aux options complémentaires.

## Tarifs

Le parcours normal ne demande pas à l’artisan d’inventer un prix. Une donnée tarifaire technique indisponible reste signalée comme donnée SpeedArti à compléter ; aucun prix n’est fabriqué silencieusement.

## Règles conservées

- catalogue Téréva 2026 : 7 456 références, dont 7 451 avec prix exploitable ;
- prix catalogue de la base diminués de 20 % ;
- complexité appliquée uniquement à la main-d’œuvre ;
- aléas = 4 % de la main-d’œuvre HT uniquement, avant TVA ;
- quantités réseau et accessoires traçables et modifiables ;
- stock réel uniquement, jamais de stock inventé ;
- approvisionnement fournisseur conservé.

## Balises absolues

Version : `BALISES-ABSOLUES-v1.6`.

Chaîne de contrôle : UI → donnée → quantité → unité → prix → source → calcul → total → approvisionnement / stock.
