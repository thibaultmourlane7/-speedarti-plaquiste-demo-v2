# Intégration future dans SpeedArti

## Emplacement recommandé

Ne pas copier ce projet Vite entier dans l'application de production.

Après validation visuelle et fonctionnelle de la démo, extraire :

```text
src/App.tsx
src/components/
src/lib/
src/integration/speedartiAdapter.ts
```

et les convertir en composants du module chiffrage existant.

Exemple de destination future, **uniquement au moment de l'intégration** :

```text
src/components/chiffrage/amenagement-exterieur/
  AmenagementExterieurWizard.tsx
  AmenagementExterieurOuvrageStep.tsx
  AmenagementExterieurDimensionsStep.tsx
  AmenagementExterieurMateriauxStep.tsx
  AmenagementExterieurOptionsStep.tsx
  AmenagementExterieurMainOeuvreStep.tsx
  AmenagementExterieurResults.tsx
```

Le calcul financier final doit revenir au moteur SpeedArti existant.

Aucun fichier de production n'est modifié par ce dossier de démonstration.

## Règle absolue — balises / traçabilité

Lors de l'intégration dans le vrai chiffrage SpeedArti, conserver les balises présentes dans la démo :

- `AMEXT.UI.*` : donnée visible / saisie utilisateur ;
- `AMEXT.CATALOGUE.*` : référence exacte sélectionnée ;
- `AMEXT.CALC.*` : formule ou transformation ;
- `AMEXT.QTE.*` : quantité calculée ;
- `AMEXT.PRIX.*` : origine du prix ;
- `AMEXT.TOTAL.*` : total de ligne / total du chiffrage.

Le calcul doit rester non validable si une référence ou un prix obligatoire est absent. Aucun fallback moyen ne doit remplacer silencieusement une référence fournisseur.

Le champ `traceability_version: AMEXT_BALISES_V2` est déjà transmis par `speedartiAdapter.ts`.
