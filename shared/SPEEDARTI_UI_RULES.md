# Règles UI communes SpeedArti — Chiffrage métiers

## NAV-001 — Navigation clavier entre champs

Statut : VALIDÉ  
Portée : tous les corps de métier du dépôt.

- La touche Tab passe au champ de saisie suivant dans l’ordre visuel.
- Shift+Tab revient au champ précédent.
- Une saisie qui déclenche un nouveau rendu de l’interface ne doit jamais renvoyer le focus au premier champ.
- Les boutons ne font pas partie de la séquence de saisie accélérée : la navigation vise input, select et textarea visibles.
- Cette règle est implémentée par `shared/field-navigation.js`.
- Toute nouvelle démo métier doit charger ce fichier partagé.

Cette règle est commune et ne doit pas être redéfinie différemment dans un module métier.
