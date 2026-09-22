# SpeedArti — Démo Chiffrage Maçon V2 + Catalogue

## Principe absolu

Le module Maçon reste le module V2 validé. L'intégration catalogue ne remplace aucun calcul métier : elle se branche uniquement après le calcul des quantités, à l'étape **Prix / catalogue**.

## Catalogue Maçon SpeedArti

- 227 articles métier intégrés dans `catalogue-macon.js` ;
- catalogue neutre : aucune enseigne d'origine n'est exposée dans l'interface, le code ou les tests ;
- marque fabricant, produit, référence catalogue, unité de vente et prix artisan moyen HT restent disponibles ;
- prix personnel artisan toujours prioritaire sur le prix catalogue ;
- aucun prix absent ou conditionnement incompatible n'est transformé en prix silencieux.

## Correspondance automatique

Le moteur propose des articles selon le poste calculé :

- blocs béton / parpaings ;
- briques terre cuite ;
- béton cellulaire ;
- mortiers / colles ;
- fibres ;
- coffrage ;
- aciers / armatures ;
- étanchéité / protection ;
- enduits / façade ;
- drainage, caniveaux, assainissement, scellement et éléments préfabriqués lorsque le poste le permet.

La sélection reste toujours modifiable par l'artisan.

## Conditionnements

Conversions automatiques autorisées uniquement lorsque l'unité est démontrable :

- unité ↔ pièce ;
- unité ↔ tarif au cent ;
- kg ↔ sac / sachet / boîte avec poids explicite ;
- m² ↔ m², rouleau ou panneau avec surface explicite ;
- m / ml ↔ mètre ou pièce avec longueur explicite ;
- m³ ↔ m³.

Si la conversion n'est pas fiable, le résultat reste bloqué jusqu'à la saisie d'un prix personnel ou le choix d'un autre article.

## Priorité des prix

1. prix personnel renseigné par l'artisan ;
2. article sélectionné dans le Catalogue Maçon SpeedArti avec conversion compatible ;
3. saisie manuelle obligatoire si aucun prix exploitable n'est disponible.

## Balisage

Chaque contrôle généré par `core.js` possède un `data-trace`. Le sélecteur catalogue utilise la trace `catalogSelection` et reste soumis à la règle absolue de balisage.

## Tests

Lancer :

```bash
node tests.mjs
```

Les tests couvrent la V2 métier existante et l'intégration catalogue :

- persistance des sélections ;
- 40 ouvrages accessibles et calculables ;
- blocage des prix manquants ;
- parité simple / multi ;
- conditionnement au cent ;
- arrondi des sacs au conditionnement complet ;
- conversion m² ;
- prix personnel prioritaire ;
- incompatibilité d'unité bloquante ;
- absence d'enseigne source dans les fichiers Git Maçon.

## v2.2 — correction correspondance catalogue

Cette version renforce la sélection des articles à l'étape « Prix / catalogue » :

- la catégorie calculée (Béton, Ferraillage, Coffrage, etc.) est prioritaire sur les mots présents dans le libellé de l'ouvrage ;
- une famille catalogue incompatible est exclue avant classement ;
- une unité de vente incompatible est exclue avant affichage ;
- le coffrage exprimé en m² propose uniquement des panneaux/contreplaqués compatibles, jamais des accessoires de coffrage à la pièce ;
- les armatures sont filtrées par rôle métier (chaînage horizontal, vertical, linteau, semelle, treillis, etc.) ;
- lorsque l'ouvrage fournit un linéaire physique, ce linéaire est conservé pour convertir un besoin en armatures de longueur connue, tout en gardant le poids calculé pour le chiffrage ;
- les références dépendantes d'une zone sismique ne sont pas proposées automatiquement tant que cette zone n'est pas renseignée ;
- une ancienne sélection devenue incompatible est ignorée et ne peut plus alimenter le prix.

Les contrôles fonctionnels incluent désormais des scénarios de non-régression dédiés à ces cas.


## v2.3 — audit humain complet et balisage absolu

Corrections issues du contrôle exhaustif du module :

- ajout d’un champ **épaisseur réelle de dalle associée** pour micro-pieux, vide sanitaire et terre-plein ;
- ajout des contrôles **treillis soudé / fibres / type de fibres / dosage** sur les dalles associées ;
- balisage des boutons **Précédent / Suivant** et des retours vers les métiers ;
- suppression des traces mortes du registre de balisage ;
- suppression d’une double ligne d’isolation du plancher sur vide sanitaire ;
- correction du filtrage catalogue des **fibres béton**, afin de proposer uniquement des conditionnements réellement compatibles et d’exclure les lamelles carbone ;
- `assertBalisage()` contrôle désormais aussi les liens interactifs.

Contrôles après correction :

- **53/53 tests fonctionnels** ;
- audit de **208 états d’interface** ;
- **3 289 contrôles interactifs** analysés ;
- 0 contrôle sans balise ;
- 0 balise inconnue ;
- 0 balise morte ;
- 0 contrôle sans liaison ;
- **23/23 contrôles Chromium réels** sur les zones corrigées, sans alerte ni exception JavaScript.


## v2.4 — correction cheminée simple

- le nombre de conduits par défaut `1` est désormais réellement présent dans l’état ;
- le reset du mode simple conserve ce défaut ;
- le calcul d’une cheminée simple ne bloque plus à tort si l’utilisateur ne touche pas au champ.

## v2.5 — modifications Guillaume + séparation des contrôles métier / DTU

La v2.5 reste une évolution du module existant : aucun moteur n’a été recréé depuis zéro. Les décisions métier retournées par Guillaume sont intégrées avec des valeurs visibles et modifiables. Les estimations métier ne sont jamais présentées comme des règles DTU.

### Béton par ouvrage

- suppression du choix de classe béton unique dans les paramètres généraux ;
- classe béton portée par chaque ouvrage béton concerné ;
- compatibilité conservée avec les anciens états v2.4 qui possèdent encore une classe globale enregistrée ;
- aucune classe béton n’est inventée pour un nouveau chiffrage.

### Fondations et soubassements

- vide sanitaire / terre-plein : hauteur de bloc limitée au référentiel Guillaume **20 cm / 25 cm** ;
- hauteur totale calculée automatiquement à partir de la hauteur du bloc et du nombre de rangs ;
- consommations blocs et temps de pose déplacés dans les réglages métier avancés au lieu d’être supprimés du moteur ;
- terre-plein : retrait des choix **poutrelles-hourdis** et **prédalles** de la dalle associée ;
- choix de treillis Guillaume disponible sur les dalles concernées ; **ST25C** proposé comme valeur métier modifiable, sans prétention de dimensionnement structurel.

### Micro-pieux / longrines

- prix micro-pieu proposé selon profondeur : 600 / 900 / 1 300 / 1 700 / 2 200 / 3 000 / 5 000 € HT selon les tranches validées ;
- le prix micro-pieu est traité comme **fourniture + main-d’œuvre incluse** : aucune seconde main-d’œuvre facturée ;
- profondeur utilisée uniquement pour le chiffrage, jamais pour dimensionner automatiquement les micro-pieux ;
- longrine conservée en poste séparé avec référence Guillaume **135 €/ml**, modifiable ;
- quantités physiques béton/acier/coffrage de la longrine restent visibles comme incluses dans le forfait afin de ne pas perdre la traçabilité.

### Murs

- mur préfabriqué : suppression de l’ancien prix de base et de la règle `+30 %` ;
- prix préfabriqué par défaut **350 €/m² HT posé, livré et gruté**, modifiable, hors terrassement, drainage, remblai et fondations éventuelles ;
- heures de pose conservées pour le planning sans double facturation ;
- béton banché : méthodes **Coulé sur place / Préfabriqué** ; les choix Collé / Traditionnel restent réservés aux matériaux maçonnés ;
- chaînage horizontal prérempli à partir du linéaire connu et modifiable ;
- chaînage vertical proposé selon le ratio Guillaume `ceil(périmètre / 3,50) × hauteur`, explicitement affiché comme **estimation réalisée à partir de ratios** et non comme règle DTU ;
- parcours simple Murs / Cloisons qualifié par nature d’ouvrage pour permettre des contrôles normatifs distincts à terme.

### Fibres, transport béton et toupies

- le dosage exact des fibres reste une donnée du moteur, car la quantité = volume béton × dosage ;
- pompe : **950 € HT** par défaut, modifiable ;
- toupie : **190 €/m³ HT**, minimum facturé **6 m³ = 1 140 €**, modifiable ;
- capacité logistique retenue avec Guillaume : **7 m³ maximum par toupie** ;
- mode automatique selon le volume béton ou saisie manuelle du nombre de toupies ;
- prix commercial et estimation du nombre de camions sont conservés comme deux notions distinctes.

### Contrôles v2.5

- **69/69 tests fonctionnels** ;
- audit de **208 états d’interface** ;
- **3 446 contrôles interactifs** analysés ;
- 0 contrôle sans balise ;
- 0 balise inconnue ;
- 0 balise morte ;
- 0 contrôle sans liaison ;
- **6/6 parcours Chromium ciblés v2.5** : terre-plein, micro-pieux, préfabriqué, béton banché, transport béton et chaînage vertical ;
- aucune exception JavaScript observée sur ces parcours ciblés.
