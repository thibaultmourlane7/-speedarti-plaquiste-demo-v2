# SpeedArti — Plombier v0.6.8 — Auto-contrôle

Date : 2026-10-07

## Résultat

**553 / 553 assertions réussies** avec le catalogue Téréva réel embarqué.

Catalogue contrôlé :
- 7 456 références ;
- 7 451 prix exploitables.

Balises : `BALISES-ABSOLUES-v1.8`.

## Contrôles ajoutés en v0.6.8

- chantier mixte WC + douche : 1 raccord WC DN100 + 1 raccord douche DN40 ;
- raccord WC Téréva `027749Z` et tube local `044788U` ;
- raccord autre sanitaire Téréva `059805D` et tube local `044755V` ;
- suppression de l’ancienne ligne générique `platine_evac` ;
- catégories locales séparées du réseau général ;
- une évacuation locale augmentée reste locale et ne génère plus artificiellement du temps réseau général ;
- élément spécifique avec évacuation mais sans diamètre : aucun DN inventé et blocage explicite ;
- UI séparée local / général et DN100 / DN40 ;
- Ángel Plombier v1.3 chargé et interrogé sur WC + douche, longueur locale, réseau général et platines.

## Contrôles antérieurs conservés

- cumul main-d’œuvre sanitaire + réseau ;
- distances chauffe-eau ;
- platines EF/EC ;
- meuble vasque multi-articles ;
- robinetterie rapide ;
- composants automatiques ;
- habitudes entreprise ;
- TVA, complexité, aléas et catalogue.

## Limite

Le contrôle logique complet est validé. Le contrôle visuel interactif dans un navigateur réel reste distinct.
