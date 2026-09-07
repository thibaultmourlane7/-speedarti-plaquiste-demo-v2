# SpeedArti — Plombier v0.6.1 — Contrôle navigateur

Le HTML/CSS/JavaScript exact du package a été chargé dans Chromium et manipulé par clics et saisies DOM. L'environnement empêche l'accès HTTP local direct ; les fichiers du package ont donc été injectés dans une page Chromium, avec `localStorage` remplacé uniquement par un stockage mémoire de test.

## Parcours contrôlé

- page 1 Base chantier ;
- deux distances chauffe-eau visibles ;
- 4 cases RDC/R+1 avec/sans sanitaire ;
- aucun libellé de travail interne visible ;
- sélection simultanée RDC + R+1 avec sanitaires ;
- deux WC au RDC + une douche au R+1 ;
- WC 1, WC 2 et Douche 1 indépendants ;
- icônes sanitaires visibles ;
- panier absent avant sélection puis présent après sélection ;
- aucun bouton Configurer sur la page 2 ;
- calcul automatique contrôlé avec distance SDB portée à 7 m : EF 24 ml, EC 15 ml, évacuation 3 ml ;
- platines, raccords et robinets/vannes présents et modifiables ;
- modification artisan EF à 31 ml conservée ;
- page 3 Configuration & options avec panier ;
- un bouton Configurer par sanitaire ;
- WC 2 configuré indépendamment ;
- distances chauffe-eau absentes de la page 3 ;
- aucune demande de prix visible sur la page 3 ;
- page 4 Résultats accessible ;
- scénario réseau seul : aucune palette sanitaire, aucun panier, aucun Configurer ;
- petits travaux débouchage : aucune demande de prix dans le chantier ;
- affichage mobile 390 px sans débordement horizontal ;
- aucun libellé interne visible sur les pages 1, 2, 3 et 4.

Le contrôle a ensuite été relancé sur le contenu extrait du ZIP final.

**47 / 47 contrôles réussis.**
