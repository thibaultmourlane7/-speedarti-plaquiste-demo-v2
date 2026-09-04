# SpeedArti — Démo Plombier v0.3.1

Cette version **ne recrée pas le module Plombier**. Elle corrige et enrichit la démo existante SpeedArti en conservant son parcours et son identité visuelle.

## Catalogue Téréva connecté

- base embarquée : **7 456 références** issues du catalogue Téréva 2026 ;
- **7 451 références avec prix Téréva exploitable** ; 5 références ont réellement un prix « - » dans le catalogue source ;
- prix utilisés : base Téréva **diminuée de 20 %** ;
- recherche par produit, marque, type, finition, référence fabricant et code Téréva ;
- filtres contextuels par équipement ;
- filtres raccords distincts **PER / multicouche / cuivre** ;
- recherche dédiée aux **platines sanitaires** ;
- sélection d’une référence exacte = prix exact de cette référence, sans coefficient ECO/Standard/Premium supplémentaire ;
- prix manuel possible et tracé lorsqu’il est explicitement saisi ;
- articles libres possibles depuis l’ensemble du catalogue.

## Règle absolue des balises

Chaque ligne de calcul conserve au minimum :
- l’origine UI / donnée ;
- la quantité et l’unité ;
- le prix et sa source ;
- la formule quantité × prix ;
- la référence catalogue lorsqu’elle existe ;
- le lien avec la main-d’œuvre et les totaux.

Le moteur `BALISES-ABSOLUES-v1.1` vérifie systématiquement les lignes, la main-d’œuvre, le total HT et la TVA avant de déclarer le chiffrage contrôlé.

## Corrections de contrôle v0.3.1

- suppression du prix caché **120 €** sur réparation/nettoyage chauffe-eau : le forfait complet doit recevoir un montant explicite ;
- suppression du prix caché **180 €** sur débouchage : Guillaume a validé « tout compris MO + déplacement », mais pas un montant unique ;
- suppression du rendement réseau caché **0,15 h/ml** : le temps réseau est désormais visible et doit être renseigné tant qu’aucun rendement métier n’est validé ;
- les platines EF / EC / EF+EC / évacuation peuvent être résolues par une référence catalogue exacte ou un prix manuel ;
- une référence raccord incompatible avec PER / multicouche / cuivre est bloquée ;
- la capacité d’un chauffe-eau catalogue est contrôlée contre la capacité choisie lorsqu’elle est identifiable ;
- les valeurs MLL / MLV modifiées dans les paramètres entreprise alimentent réellement les prestations correspondantes ;
- le déplacement n’est plus affiché dans l’installation complète s’il n’a pas d’effet dans cette branche ;
- réseau seul : les 5 m SDB + 8 m cuisine ne sont pas ajoutés quand aucune zone EC correspondante n’existe.

## Garde-fous volontaires

- les 5 références Téréva avec prix « - » ne reçoivent aucun prix inventé ; une saisie manuelle explicite peut résoudre le blocage ;
- **551 références** dont le titre exact n’a pas été extrait restent utilisables via code/type/variante/page avec un statut d’information, sans inventer de désignation ;
- **2 139 références** portent encore la marque « À identifier » : aucune marque n’est devinée ;
- prix de secours tuyaux uniquement : PER 0,80 €/ml ; Multicouche 1,12 €/ml ; Cuivre 8 €/ml ;
- évacuation PVC : prix HT/ml explicite tant que les conditionnements catalogue ne sont pas normalisés ;
- aucun temps métier non validé n’est ajouté silencieusement.

Voir `AUTOCONTROLE.md` pour le rapport de contrôle de la version livrée.

## Contrôle final de livraison

La version v0.3.1 est livrée avec `autocontrol.test.js` et `SHA256SUMS.txt`.
Le dernier cycle de contrôle exécute **167 assertions** et vérifie aussi le ZIP après extraction dans un dossier vierge.
