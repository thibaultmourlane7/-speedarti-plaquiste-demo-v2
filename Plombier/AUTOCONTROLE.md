# SpeedArti — Plombier v0.6.5 — Auto-contrôle ciblé

Date : 2026-10-07

## Contrôles effectués sur le lot v0.6.5
- syntaxe de `app.js`, `engine-current.js` et `autocontrol.test.js` contrôlée ;
- distances chauffe-eau vérifiées : 5 m SDB + 8 m cuisine donnent 29 ml EC sur le scénario douche + évier ; 10 m + 10 m donnent 36 ml EC ;
- élément spécifique vérifié : aucune platine sans EF/EC/évacuation ; platine EF+EC + raccordement évacuation dès que ces raccordements sont activés ;
- meuble vasque multi-articles vérifié avec 1 meuble + 2 vasques ;
- robinetterie rapide meuble vasque vérifiée avec quantité 2 ;
- ancienne sélection « mitigeur » de la composition détaillée ignorée sur meuble vasque / lave-mains pour éviter un double comptage avec la nouvelle option rapide ;
- retour aux valeurs réseau automatiques présent dans l’interface après une modification manuelle ;
- avertissement visible prévu pour les éléments spécifiques sans raccordement défini.

## Base précédente conservée

Le dernier contrôle complet documenté avant ce lot était celui de la v0.6.4 : **490 / 490 assertions réussies**.

Cette valeur n’est pas présentée comme un nouveau résultat v0.6.5 : le lot actuel a reçu des contrôles ciblés supplémentaires, mais le parcours navigateur Chromium complet et la relance intégrale de toute la suite avec le catalogue embarqué doivent encore être effectués avant de déclarer la v0.6.5 totalement validée.

Balises conservées : `BALISES-ABSOLUES-v1.8`.
