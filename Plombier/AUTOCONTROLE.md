# SpeedArti — Plombier v0.5.2 — Rapport d’auto-contrôle final

Date : 2026-09-07

## Modification finale

La dernière règle métier ouverte est maintenant intégrée : **Aléas = 4 % de la main-d’œuvre HT uniquement**.

Le moteur calcule :
1. heures-homme × taux horaire × coefficient de complexité ;
2. aléas = 4 % de cette main-d’œuvre HT ;
3. total HT = matériaux / forfaits + main-d’œuvre HT + aléas ;
4. TVA sur le total HT.

Les matériaux, fournitures catalogue et forfaits complets ne modifient pas le montant des aléas.

## Contrôles automatiques

- syntaxe JavaScript validée ;
- catalogue : 7 456 références / 7 451 prix ;
- prix témoin Téréva -20 % conservé ;
- réseau seul, Annexe 2, catalogue, TVA, complexité, petits travaux, approvisionnement, stock non connecté et migration de brouillon toujours couverts ;
- contrôle spécifique Aléas : base MO, indépendance vis-à-vis des matériaux/forfaits, complexité, TVA 10/20 et total HT.

**Résultat : 392 / 392 assertions réussies.**

Balises : `BALISES-ABSOLUES-v1.5`.

## Contrôle navigateur ciblé v0.5.2

Un vrai Chromium a été utilisé sur la version embarquée :
- v0.5.2 visible ;
- aide UI correcte ;
- aléas non bloquants ;
- 208,00 € de MO → 8,32 € d’aléas ;
- ajout d’un forfait ne change pas les aléas ;
- TVA calculée après les aléas ;
- ligne Aléas visible dans le résultat ;
- affichage mobile 390 px sans débordement.

**Résultat : 8 / 8 contrôles ciblés réussis.**
