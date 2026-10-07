# SpeedArti — Plombier v0.6.9 — Auto-contrôle

Date : 2026-10-07

## Résultat

**580 / 580 assertions réussies** avec le catalogue Téréva réel embarqué.

Catalogue contrôlé :
- 7 456 références ;
- 7 451 prix exploitables.

Balises : `BALISES-ABSOLUES-v1.8`.

## Contrôles ajoutés en v0.6.9

- douche standard : bonde automatique Téréva `4273010` ;
- douche extra-plate : bonde automatique `4281682` ;
- douche italienne : aucune bonde générique imposée ;
- baignoire : vidage `767547L` + siphon `4273012` ;
- évier 1 cuve : bonde `4272991` + siphon `1066748` ;
- évier 2 cuves : bonde `4273023` + siphon `1066748` ;
- WC à poser : fixation au sol `1085426` ;
- aucune pipe WC automatique ;
- aucun accessoire générique arbitraire ajouté au WC suspendu ;
- composant déclaré compris dans le produit principal non doublé ;
- préférences entreprise étendues à tous les nouveaux composants automatiques ;
- UI conditionnelle selon type de douche / configuration d'évier / type de WC ;
- Ángel Plombier v1.4 interrogé sur douche, baignoire, évier, WC et limites de l'automatisation.

## Contrôles antérieurs conservés

- évacuations locales DN40 / DN100 ;
- réseau général sans diamètre inventé ;
- cumul main-d’œuvre sanitaire + réseau ;
- distances chauffe-eau ;
- platines EF/EC ;
- meuble vasque multi-articles ;
- robinetterie rapide ;
- habitudes entreprise ;
- TVA, complexité, aléas, approvisionnement et catalogue.

## Limite

Le contrôle logique complet est validé. Le contrôle visuel interactif dans un navigateur réel reste distinct.
