# SpeedArti — Plombier v0.3.1 — Rapport d’auto-contrôle final

Date : 2026-09-04

## Périmètre

Contrôle de la démo Plombier existante enrichie avec le catalogue Téréva 2026 ajusté à -20 %, sans refonte du module.

Catalogue embarqué :
- 7 456 références ;
- 7 451 références avec prix ;
- 5 références sans prix Téréva ;
- 551 références sans titre produit exact extrait ;
- 2 139 références avec marque « À identifier ».

Les cas incomplets sont conservés sans invention : les prix absents exigent une saisie manuelle explicite ; les titres ou marques non identifiés restent tracés par code Téréva et page source et ne provoquent pas une substitution silencieuse.

## Règle absolue des balises

Chaîne contrôlée :
**UI → donnée enregistrée → quantité → unité → prix → source du prix → calcul → total.**

Balises contrôlées : identifiant, désignation, catégorie, unité, source, balise UI, quantité, prix, cohérence quantité × prix, référence catalogue, version catalogue, page source, main-d’œuvre, HT et TVA.

Version : `BALISES-ABSOLUES-v1.1`.

## Anomalies détectées et corrigées pendant les contrôles renforcés

1. Ancien débouchage 180 € caché supprimé : le forfait est bien tout compris MO + déplacement mais son montant doit être renseigné explicitement.
2. Ancienne réparation/nettoyage chauffe-eau 120 € cachée supprimée : forfait complet, montant explicite.
3. Ancien rendement réseau 0,15 h/ml supprimé : temps réseau visible et renseigné par l’artisan.
4. Platines EF / EC / EF+EC / évacuation rendues résolubles par référence catalogue ou prix manuel.
5. Raccords filtrés et contrôlés séparément pour PER / multicouche / cuivre.
6. Quantité raccords corrigée : 6 raccords par appareil/point +10 %, sans doubler un appareil EF+EC.
7. Robinets d’arrêt corrigés selon la composition Annexe 2 : 1 sur WC, 2 sur appareils EF+EC listés, pas de doublon sur MLL/MLV déjà couverts par leur prestation unitaire.
8. Capacité/type du chauffe-eau catalogue contrôlés lorsqu’ils sont détectables.
9. MLL / MLV utilisent réellement les valeurs des paramètres entreprise.
10. Déplacement non affiché en installation complète lorsqu’il n’a pas d’effet dans cette branche.
11. Prix Téréva absent résoluble par saisie manuelle explicite tout en conservant code/source catalogue.
12. Titre exact / marque non identifiés : information non bloquante, sans invention.
13. SPEC/natte/chape sélectionné sans surface : blocage explicite.
14. Petits travaux sans prestation : blocage moteur explicite.
15. Recherche de fuite « tout compris » : suppression d’une seconde main-d’œuvre qui pouvait être ajoutée en plus du diagnostic + méthode.

## Contrôles automatiques

### Syntaxe JavaScript

Validée pour :
- `catalogue-data.js`
- `catalogue-service.js`
- `engine-current.js`
- `app.js`
- `autocontrol.test.js`

### Tests logiques et statiques

Résultat final : **OK — 167 assertions réussies**.

Couverture principale :
- intégrité 7 456 / 7 451 / 5 / 551 / 2 139 ;
- prix -20 % connu (code Téréva 1306629 = 117,19 € HT) ;
- recherche multi-critères et filtres contextuels ;
- intégrité de sélection des 7 456 références ;
- WC, lavabo, Annexe 2, raccords et robinets d’arrêt ;
- réseau seul 4 points EF+EC = 32 ml EF + 32 ml EC ;
- longueurs manuelles et temps réseau ;
- raccords PER / multicouche / cuivre + incompatibilité bloquante ;
- platines catalogue et prix manuel ;
- référence Téréva sans prix puis résolution manuelle ;
- titre produit absent non bloquant et tracé ;
- douche italienne +40 % sur sa durée et SPEC ;
- complexité uniquement MO ;
- nombre d’ouvriers uniquement sur durée chantier ;
- TVA 10 / 20 ;
- petits travaux vide ;
- débouchage tout compris ;
- réparation chauffe-eau tout compris ;
- recherche de fuite sans MO doublée ;
- déplacement unique ;
- chauffe-eau exact + contrôle capacité ;
- MLL / MLV paramètres entreprise ;
- override prix manuel ;
- cohérence matériaux / MO / HT / TVA ;
- ordre de chargement catalogue → service → moteur → app ;
- absence statique des anciens prix/rendements cachés 180 / 120 / 0,15 h/ml.

### Contrôle navigateur

Chromium headless n’est pas retenu comme preuve dans cet environnement : il reste bloqué par les contraintes DBus/conteneur avant de rendre la page. Aucun succès navigateur n’est revendiqué pour v0.3.1. Les contrôles de livraison reposent donc sur Node, syntaxe, intégrité catalogue, tests métier, contrôle statique et validation du ZIP extrait.

## Contrôle de l’artefact

Le package livré a passé :
- recalcul SHA-256 ;
- `sha256sum -c` ;
- test d’intégrité ZIP ;
- extraction du ZIP dans un dossier vierge ;
- relance de la syntaxe et des 167 assertions depuis l’extraction.

## Verdict

**AUTO-CONTRÔLE FINAL : VALIDÉ POUR LA DÉMO GITHUB PAGES v0.3.1.**

Ce feu vert concerne la démo GitHub Pages. Il ne remplace pas les tests de régression du dépôt de production SpeedArti lors de l’intégration finale.
