# Vérification — Balises SpeedArti — Aménagement extérieur

Date : 2026-09-04

## Résultat

Le moteur et l'interface de démonstration ont été vérifiés après intégration de la règle des balises.

### Contrôles TypeScript

- Moteur métier (`types`, `catalogue`, `calculations`, `traceability`, `speedartiAdapter`) : **OK en mode strict**.
- Interface React/TSX : **syntaxe et typage interne OK** avec déclarations de contrôle locales.
- `npm install` n'a pas pu aboutir dans l'environnement de génération à cause du téléchargement réseau des dépendances ; ce point n'est pas lié au code du module.

### Scénarios fonctionnels

| Ouvrage | Validation | Blocages | Traces générées |
|---|---:|---:|---:|
| Terrasse bois | OK | 0 | 43 |
| Terrasse composite | OK | 0 | 43 |
| Terrasse dalles | OK | 0 | 39 |
| Clôture panneaux | OK | 0 | 38 |
| Clôture à lames | OK | 0 | 37 |
| Occultation | OK | 0 | 38 |
| Ganivelle | OK | 0 | 32 |
| Retenue de terre | OK | 0 | 32 |

Chaque scénario a été exécuté avec des références/prix valides. Aucun scénario valide ne présente de blocage.

### Test négatif

Un chiffrage Terrasse bois sans références produit a correctement été **bloqué** avec les codes :

- `TERRACE_PRODUCT_REQUIRED`
- `JOIST_PRODUCT_REQUIRED`
- `PLOT_PRODUCT_REQUIRED`
- `TERRACE_FIXING_REQUIRED`
- `PRICE_LAME`
- `PRICE_LAMBOURDE`
- `PRICE_PLOT`
- `PRICE_FIXATION`

La règle « prix/référence manquante = validation impossible » fonctionne donc réellement.

### Vérifications interface

- ProductPicker balisés : **16 / 16**
- Inputs numériques balisés : **20 / 20**
- Bouton `Mettre à jour le devis` désactivé si `canValidate === false` : **OK**
- Balises visibles dans les résultats : **OK**
- Export JSON avec traçabilité + blocages : **OK**

## Corrections effectuées pendant la vérification

1. Le champ `scellement` était auparavant visible sans modifier réellement le calcul : il agit maintenant sur la quantité de béton/mortier et le temps de pose des poteaux.
2. Les fixations Terrasse et Clôture pouvaient être absentes des filtres catalogue : le routage multi-familles a été corrigé.
3. Le conditionnement fournisseur des vis/clips est désormais pris en compte (`seau 1000`, `boîte 100`, `kit 650`, etc.) afin de ne pas multiplier un prix de boîte par un nombre de vis unitaires.
4. Terrasse dalles n'avait pas de référence exacte disponible dans le catalogue embarqué : une sélection **hors base contrôlée** a été ajoutée, avec référence fournisseur + prix obligatoires et balisés.
5. Les champs visibles mais sans effet dans certains contextes ont été masqués conditionnellement.

## Règle appliquée

Chaque donnée visible doit être reliée à au moins un effet réel : quantité, prix, temps, formule, alerte ou blocage. Chaque ligne de résultat porte une chaîne de traçabilité :

`BALISE UI → BALISE CALCUL → BALISE QUANTITÉ → BALISE PRIX → BALISE TOTAL`

Aucune ligne à prix nul ne peut être validée dans le devis.
