# Vérification V6.5 — Multi-matériaux global

Version : `AMEXT-V6.5-MULTI-MATERIAUX-2026-09-15`

## Changements demandés

### Multi-sélection appliquée à tout le métier
La multi-sélection n'est plus limitée aux clôtures.

Disponible pour :
- terrasse bois
- terrasse composite
- terrasse dalles
- clôture panneaux
- clôture à lames
- occultation
- ganivelle
- retenue de terre

### Catégories multi-sélectionnables
Selon l'ouvrage :
- lames terrasse bois
- lames terrasse composite
- lambourdes / structure
- plots / supports
- fixations terrasse / visserie
- panneaux / claustras
- lames de clôture
- poteaux
- pieds / platines
- fixations clôture / connecteurs
- chapeaux
- profils / traverses / glissières
- soubassements
- ganivelle
- piquets
- bois / traverses de retenue
- pieux
- Quincaillerie & accessoires
- Traitements / entretien / protection
- Toute la base Idéa Bois

## Quantités
- Chaque ligne principale conserve une quantité calculée automatiquement.
- Cette quantité est maintenant modifiable directement dans le panier.
- Un bouton `Auto` remet la quantité calculée par le moteur.
- Les références complémentaires ont elles aussi une quantité calculée ou manuelle.
- Plusieurs références d'une même catégorie peuvent coexister.

### Test lambourdes
Terrasse 10 × 5 m, entraxe 40 cm :
- besoin automatique : 140 ml
- IDEA-0137 : 80 ml → 30 pièces de 2,75 m
- IDEA-0138 : 60 ml → 33 pièces de 1,85 m
- total affecté : 140 ml

### Test visserie
Besoin calculé : 1 176 vis :
- IDEA-0296 : 588 vis → 1 kit de 650
- IDEA-0299 : 588 vis → 1 seau de 1 000

### Traitements
4 références `Entretien / protection` sont actuellement présentes dans le catalogue maître.
Le traitement peut être ajouté à n'importe quel ouvrage.
Pour un calcul automatique, le rendement fabricant en m²/L est obligatoire.
Exemple contrôlé :
- 50 m²
- rendement 10 m²/L
- besoin 5 L
- IDEA-0286 → 1 bidon 5 L

## Catalogue actuel
- 299 références dans la base maître
- 7 lambourdes
- 2 fixations terrasse
- 66 produits routés dans Quincaillerie & accessoires
- 4 produits Traitements / entretien / protection

IMPORTANT : cela ne signifie pas que les 388 produits de la rubrique complète Outillage & quincaillerie du site fournisseur sont déjà récupérés. La V6.5 expose correctement tous les produits présents dans la base actuelle et n'invente aucune référence manquante.

## Contrôles techniques
- Syntaxe JavaScript : OK
- Tests métier Node : OK
- 8 ouvrages : catégorie Quincaillerie & accessoires présente
- 8 ouvrages : catégorie Traitements présente
- multi-lambourdes : OK
- multi-visserie : OK
- quantités principales modifiables : OK
- retour `Auto` prévu : OK
- traitement avec rendement fabricant : OK
- conditionnements fournisseur conservés : OK

## GitHub attendu après push
Chemin : `amenagement-exterieur/index.html`

Taille : **290733 octets**

SHA-256 :
`d2cb30d6fa39794ad614595013eab42450435b8671a4c76fa047ad64395aab1f`

Git blob SHA :
`3aa98c087492bda4510596e6f1a33757918d9c27`

Marqueur :
`AMEXT-V6.5-MULTI-MATERIAUX-2026-09-15`

Pastille :
`V6.5 — MULTI-MATÉRIAUX`

## Statut
`PRÉPARÉE`

Cette version n'est pas considérée comme poussée ni validée sur GitHub tant qu'un commit détaillé, un push et une vérification distante n'ont pas été effectués.
