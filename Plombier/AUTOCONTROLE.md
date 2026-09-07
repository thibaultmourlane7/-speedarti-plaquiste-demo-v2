# SpeedArti — Plombier v0.6.1 — Auto-contrôle

Date : 2026-09-07

## Objet

Contrôle complet de la réorganisation demandée du module Plombier, sans recréer le moteur métier.

## Contrôles spécifiques du lot

- parcours principal en 4 pages ;
- Base chantier en page 1 ;
- distances chauffe-eau présentes en page 1 et absentes de la page Configuration ;
- 4 cases RDC/R+1 avec/sans sanitaire ;
- équipement rattaché au niveau RDC/R+1 lors de l'ajout ;
- chaque clic crée une instance sanitaire indépendante ;
- icônes sanitaires SVG ;
- panier latéral qui apparaît après sélection ;
- aucun Configurer en page 2 ;
- Configurer uniquement en page 3 et uniquement avec sanitaires ;
- réseau seul sans configuration sanitaire ;
- calcul automatique EF/EC/évacuation ;
- platines, raccords et robinets/vannes automatiques ;
- quantités automatiques modifiables et reprises par le moteur ;
- nettoyage des libellés de travail dans l'interface artisan ;
- absence de champs demandant un prix dans le parcours artisan normal ;
- services petits travaux alimentables par tarifs entreprise SpeedArti sans saisie chantier ;
- page Résultats réellement routée en étape 4 ;
- maintien TVA, complexité, aléas, catalogue, stock et approvisionnement.

## Résultat

- syntaxe JavaScript : OK ;
- catalogue : 7 456 références / 7 451 prix exploitables ;
- prix témoin Téréva -20 % : OK ;
- tests historiques conservés ;
- tests structurels v0.6.1 ajoutés.

**439 / 439 assertions réussies.**

Le package est ensuite vérifié par SHA-256, extrait dans un dossier vierge, puis les tests sont relancés depuis l'extraction.

Balises : `BALISES-ABSOLUES-v1.6`.
