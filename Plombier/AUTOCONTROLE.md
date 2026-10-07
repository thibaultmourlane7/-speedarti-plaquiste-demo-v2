# SpeedArti — Plombier v0.6.6 — Auto-contrôle

Date : 2026-10-07

## Résultat

**522 / 522 assertions réussies** sur la suite complète chargée avec le catalogue Téréva réel embarqué.

Catalogue contrôlé :
- 7 456 références ;
- 7 451 prix exploitables.

Balises : `BALISES-ABSOLUES-v1.8`.

## Contrôles ajoutés en v0.6.6

- siphon lavabo/vasque par défaut résolu dans Téréva : `1054371` ;
- bonde lavabo/vasque par défaut résolue : `2864095` ;
- bonde lave-mains par défaut résolue : `997361L` ;
- lavabo sans sélection complémentaire génère automatiquement siphon + bonde ;
- meuble double avec deux vasques génère automatiquement deux siphons + deux bondes ;
- composant déclaré compris dans le produit principal supprimé du chiffrage pour éviter le double comptage ;
- préférence entreprise vérifiée avec remplacement du siphon par une autre référence Téréva ;
- priorité et origine de la préférence tracées ;
- quantité automatique conservée lorsqu’une référence automatique est remplacée ;
- interface vérifiée pour l’affichage des habitudes entreprise et du contrôle « compris dans le produit principal » ;
- base Angel Plombier v1.1 vérifiée sur les composants automatiques et les habitudes entreprise.

## Contrôles v0.6.5 conservés

- distances chauffe-eau SDB/cuisine actives dans le calcul EC ;
- élément spécifique sans EF/EC/évacuation = aucune platine, puis platines automatiques dès activation ;
- meuble vasque multi-articles ;
- robinetterie rapide meuble vasque / lave-mains sans doublon avec l’ancienne composition ;
- retour aux valeurs réseau automatiques après modification manuelle.

## Limite du contrôle

La suite logique complète est validée. Le contrôle visuel interactif dans un navigateur réel reste distinct de cet auto-contrôle et doit être fait sur la démo pour les détails purement graphiques.
