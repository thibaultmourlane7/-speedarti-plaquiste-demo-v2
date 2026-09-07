# SpeedArti — Démo Plombier v0.5.2

Cette version reprend la v0.5.1 contrôlée et finalise la dernière règle métier ouverte.

## Règle Aléas désormais validée

- **Aléas = 4 % uniquement sur la main-d’œuvre HT**.
- Le calcul est effectué après application du coefficient de complexité sur la main-d’œuvre.
- Les matériaux, fournitures catalogue et forfaits complets ne modifient pas le montant des aléas.
- Les aléas sont ajoutés au total HT avant calcul de la TVA.
- Le résultat distingue : main-d’œuvre HT avant aléas, aléas HT, main-d’œuvre HT totale.

## Catalogue et règles conservés

- 7 456 références Téréva 2026 ;
- 7 451 références avec prix exploitable ;
- prix catalogue diminués de 20 % ;
- recherche contextuelle, Annexe 2, réseau seul, petits travaux, approvisionnement fournisseur ;
- aucun stock inventé ;
- aucun prix/temps métier non validé ajouté silencieusement.

## Balises absolues

Version : `BALISES-ABSOLUES-v1.5`.

Chaîne contrôlée : UI → donnée → quantité → unité → prix → source → calcul → total → approvisionnement / stock.
Le contrôle vérifie maintenant aussi explicitement que les aléas valent exactement 4 % de la main-d’œuvre HT.

## Sauvegarde

Clé v0.5.2 : `speedarti-plombier-demo-v052`.
Migration prévue depuis v0.5.1, v0.4.0 et v0.3.1.
