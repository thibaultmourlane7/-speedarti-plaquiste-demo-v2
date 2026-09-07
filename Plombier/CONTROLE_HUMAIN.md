# SpeedArti — Plombier v0.6.0 — Contrôle navigateur

Un contrôle comportemental a été exécuté dans Chromium sur le HTML/CSS/JavaScript exact du module.

L’environnement de contrôle bloquant la navigation HTTP/file locale, le module a été injecté dans une page Chromium via Playwright. Seul `localStorage` est remplacé par un stockage mémoire dans le harnais de test ; le code métier, le DOM, les clics, les saisies et les calculs testés restent ceux du package.

## Parcours contrôlé

- 3 étapes visibles ;
- aucun libellé Guillaume / Annexe 1 / Annexe 2 visible sur les pages artisan contrôlées ;
- sélection RDC avec sanitaires ;
- ajout WC deux fois + Douche une fois → WC 1, WC 2, Douche 1 indépendants ;
- aucun bouton Configurer sur la Base chantier ;
- calcul automatique EF 24 ml, EC 13 ml, évacuation 3 ml ;
- propositions platines/raccords/robinets cohérentes avec ce scénario ;
- modification artisan de l’EF et des raccords conservée en changeant de page ;
- page Configuration : un bouton Configurer par sanitaire ;
- WC 2 configuré indépendamment en WC suspendu ;
- réinitialisation puis RDC sans sanitaire ;
- réseau seul : EF 8 ml, EC 8 ml, évacuation 1 ml ;
- aucune palette sanitaire et aucun bouton Configurer en réseau seul ;
- affichage mobile 390 px sans débordement horizontal ;
- aucune erreur JavaScript capturée.

**Résultat : 28 / 28 contrôles réussis.**
