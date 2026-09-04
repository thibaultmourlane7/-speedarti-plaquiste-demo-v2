# Sources de reprise — Plombier v0.3.1

## Base technique

Module Plombier existant SpeedArti / démo v0.2.0, elle-même reprise du snapshot SpeedArti disponible. **Aucun module parallèle n’est créé.**

Fichiers techniques principaux de référence :
- `Plombier/index.html`
- `Plombier/app.js`
- `Plombier/engine-current.js`
- `Plombier/styles.css`

## Sources métier

- questionnaire principal Guillaume Plombier ;
- questionnaire complémentaire Guillaume ;
- mapping / workflow Plombier transmis par Thibault ;
- Annexe 1 validée en unitaire / forfait complet selon la ligne ;
- installation complète réseau seul sans sanitaire : validée ;
- longueurs réseau EF / EC / évacuation : règles Guillaume conservées ;
- raccords : 6 par appareil + 10 %, avec prix/type dépendant du matériau réseau ;
- prix de secours tuyaux : PER 0,80 €/ml, multicouche 1,12 €/ml, cuivre 8 €/ml ;
- débouchage : forfait tout compris, main-d’œuvre + déplacement inclus ; aucun montant unique ajouté sans validation ;
- réparation/nettoyage chauffe-eau : forfait complet ; aucun montant unique ajouté sans validation.

## Source catalogue v0.3.1

- fichier de travail : `SpeedArti_Catalogue_Plomberie_Tereva_2026_PRIX_MOINS_20.xlsx` ;
- source amont : `Catalogue général Téréva - 2026.pdf` ;
- base embarquée : `catalogue-data.js` ;
- moteur de recherche / filtres : `catalogue-service.js` ;
- références embarquées : **7 456** ;
- références avec prix : **7 451** ;
- références sans prix Téréva : **5** ;
- règle de prix : prix de la base Excel déjà diminués de 20 %.

## Règles de sécurité

- une référence exacte sélectionnée conserve son prix exact ;
- les coefficients de gamme ne remultiplient pas une référence Téréva exacte ;
- les prix manquants ne sont pas inventés ;
- les temps non validés ne sont pas inventés ;
- une configuration incompatible avec la référence choisie déclenche une balise ;
- chaque ligne reste traçable UI → donnée → quantité → prix → source → calcul → total.

## Précisions v0.3.1 issues du contrôle final

- raccords : 6 par appareil / point réseau + 10 %, sans compter EF et EC comme deux appareils distincts ;
- robinets d’arrêt : composition issue de l’Annexe 2 (notamment WC = 1, appareils EF+EC listés = 2), MLL/MLV sans doublon de robinet générique ;
- recherche de fuite : diagnostic 150 € + méthode catalogue/saisie, nature tout compris sans deuxième ligne de main-d’œuvre ;
- temps réseau : saisie explicite, aucun rendement h/ml inventé.
