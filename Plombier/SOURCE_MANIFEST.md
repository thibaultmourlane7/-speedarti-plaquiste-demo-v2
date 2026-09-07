# SpeedArti — Plombier v0.6.1 — Sources du lot

## Base technique

- module Plombier SpeedArti existant ;
- moteur et règles consolidés jusqu'à la v0.5.2 ;
- catalogue Téréva 2026 intégré ;
- base catalogue avec prix -20 % ;
- nomenclatures internes des équipements ;
- approvisionnement fournisseur v0.5.x.

## Évolution v0.6.1

- nouvelle organisation Base chantier / Équipements & réseau / Configuration & options / Résultats ;
- distances chauffe-eau déplacées en Base chantier ;
- 4 zones chantier RDC/R+1 ;
- instances sanitaires indépendantes ;
- affectation RDC/R+1 à la création lorsqu'il existe plusieurs niveaux sanitaires ;
- icônes sanitaires et panier latéral ;
- configuration uniquement en page 3 ;
- réseau calculé automatiquement puis modifiable ;
- nettoyage de l'interface artisan ;
- retrait des demandes directes de prix du parcours artisan ;
- tarifs de services issus des paramètres SpeedArti/entreprise lorsqu'ils existent.

Les libellés/source de validation internes restent disponibles uniquement pour les tests et la traçabilité du moteur, jamais comme vocabulaire métier présenté à l'artisan.
