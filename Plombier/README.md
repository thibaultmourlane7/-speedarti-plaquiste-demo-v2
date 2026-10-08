# SpeedArti — Plombier v0.7.1 — Sprint D automatisations audit humain

Cette version continue le module Plombier existant.

## Sprint D v0.7.1 — corrections issues de l’audit humain

Objectif : automatiser les actions sûres et ne demander une intervention artisan que lorsqu’aucune règle fiable n’existe.

- **Temps sanitaire** : aucun barème arbitraire n’est inventé. Une durée saisie par l’artisan devient une habitude entreprise et est réutilisée automatiquement pour les prochains équipements comparables. Priorité : saisie équipement > habitude entreprise > base explicitement validée.
- **Évier neuf** : la configuration initiale est désormais `simple`; même sur un ancien brouillon sans `config`, le moteur considère l’évier comme simple bac pour l’automatisation sûre. La bonde `4272991` apparaît donc immédiatement.
- **Élément spécifique + évacuation** : le champ diamètre propose DN40 / DN100 / autre. DN40 et DN100 déclenchent automatiquement les références Téréva déjà validées (tube + raccord). Sans diamètre exploitable, aucune référence n’est inventée et la fourniture non chiffrée est signalée.
- **Robinetterie meuble vasque / lave-mains** : possibilité d’enregistrer une référence habituelle entreprise. Lorsqu’elle existe, elle est reprise automatiquement, avec quantité 2 pour un meuble double vasque. Le temps de robinetterie peut lui aussi être mémorisé comme habitude.
- Les messages réellement actionnables (temps manquant, robinetterie non paramétrée, évacuation spécifique sans diamètre) ne sont plus masqués par l’interface.
- Ángel Plombier passe en **v1.6**.

## Sprint C v0.7.0 — Téréva source unique pour le réseau

- `engine-current.js` ne recopie plus les prix ni les métadonnées des références techniques réseau Téréva ;
- le moteur conserve uniquement les codes métier nécessaires et les conditionnements utiles au calcul au ml ;
- `catalogue-service.js` expose une résolution exacte `byCode()` depuis `catalogue-data.js` ;
- tubes PER/multicouche, raccords, platines, PVC DN40/DN100 et robinets d’arrêt utilisent le prix réel du catalogue embarqué au moment du calcul ;
- une référence technique absente, incompatible ou sans prix exploitable génère un blocage explicite ;
- les fallbacks PER/multicouche ont été supprimés ;
- seul le fallback cuivre validé à **8 €/ml** est conservé.

## Règles métier conservées

- la main-d’œuvre sanitaire comprend pose appareil + raccordements locaux + platines + bonde/siphon + petite évacuation locale ;
- le réseau général EF/EC/évacuation reste séparé ;
- aucun temps forfaitaire arbitraire de platine n’est ajouté ;
- WC local = DN100, autres sanitaires locaux = DN40 ;
- un réseau général/spécifique ne reçoit jamais un diamètre inventé ;
- ordre de priorité des références : **sélection sanitaire > habitude entreprise > défaut SpeedArti** ;
- une référence Téréva exacte conserve son prix exact ;
- complexité uniquement sur la main-d’œuvre ;
- aléas uniquement sur la main-d’œuvre HT ;
- aucun composant déjà compris dans un produit principal n’est doublé.
