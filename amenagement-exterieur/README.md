# SpeedArti — Démo GitHub — Chiffrage Aménagement extérieur

## Règle absolue respectée

Ce dossier est **nouveau et autonome**. Il ne modifie aucun fichier existant du Drive ou de SpeedArti.

## Comment l'ajouter dans le dépôt de démo

Créer à la racine du dépôt un dossier :

```text
amenagement-exterieur/
```

Puis copier **tout le contenu de ce dossier** dedans.

Ensuite :

```bash
cd amenagement-exterieur
npm install
npm run dev
```

Pour un build GitHub Pages / statique :

```bash
npm run build
```

Le `vite.config.ts` utilise `base: './'` pour fonctionner facilement dans un sous-dossier.

## Ce que contient la démo

- React 18 + TypeScript + Vite.
- Interface responsive type SpeedArti.
- Wizard en 6 étapes :
  1. Ouvrage
  2. Dimensions
  3. Matériaux
  4. Options
  5. Main-d'œuvre
  6. Résultats
- Catalogue Idea Bois maître embarqué : **299 lignes**.
- Sous-catalogues terrasse et clôture directement filtrables.
- Calculs matériaux + main-d'œuvre.
- Nombre d'ouvriers modifiable.
- Taux horaires par activité.
- Aperçu 2D terrasse / clôture.
- Alertes métier.
- Export JSON au format d'intégration SpeedArti.

## Ouvrages prévus

- Terrasse bois
- Terrasse composite
- Terrasse sur dalles
- Clôture panneaux
- Clôture à lames
- Occultation
- Ganivelle
- Retenue de terre

## Point d'intégration SpeedArti

Le fichier :

```text
src/integration/speedartiAdapter.ts
```

transforme l'état de la démo en `DonneesChantier` compatible avec le futur appel au calculateur existant :

```text
src/services/chiffrage/calculateurs/AmenagementExterieurCalculateur.ts
```

**À l'intégration production : ne pas créer un second calculateur.**
Le composant UI doit envoyer ses données au calculateur existant.

## Catalogue fournisseur

Le fichier :

```text
src/data/catalogueIdeaBois.json
```

vient du catalogue maître créé le 04/09/2026.

Règle de prix :

1. Prix propre artisan.
2. Référence exacte catalogue.
3. Saisie manuelle contrôlée.
4. Jamais de moyenne automatique.

Dans cette démo, les prix Idea Bois sont utilisés pour visualiser le fonctionnement.

## Calepinage

Cette démo affiche un aperçu 2D et applique des règles de pertes déterministes. Lors de l'intégration SpeedArti, le vrai module Calepinage existant doit rester prioritaire pour :

- coupes ;
- optimisation des chutes ;
- réutilisation ;
- lambourdes ;
- plots ;
- fixations ;
- surface réelle de commande.

Le chiffrage consommera son payload, sans recopier son algorithme.

## À faire après validation de la démo

- brancher le composant dans le menu Chiffrage ;
- reprendre les classes Tailwind/shadcn du projet si souhaité ;
- appeler `AmenagementExterieurCalculateur` existant ;
- connecter le vrai catalogue personnel / catalogue maître Supabase ;
- connecter stock et devis ;
- brancher le résultat du vrai Calepinage ;
- ajouter les tests d'intégration au dépôt SpeedArti.

## Balises SpeedArti V2

La démo applique désormais la règle stricte de traçabilité SpeedArti :

- chaque champ UI possède une balise `AMEXT.UI.*` ;
- chaque référence produit possède une balise `AMEXT.CATALOGUE.*` ;
- chaque formule possède une balise `AMEXT.CALC.*` ;
- chaque quantité, prix et total possède sa propre balise ;
- un prix ou une référence obligatoire manquante crée un blocage ;
- `Mettre à jour le devis` reste désactivé tant que `canValidate` vaut `false` ;
- l'export JSON embarque toutes les traces et les blocages.

Contrôle rapide sans dépendances :

```bash
npm run verify:balises
```

Contrôle complet après installation des dépendances :

```bash
npm install
npm run check
```

Voir aussi `VERIFICATION_BALISES.md`.
