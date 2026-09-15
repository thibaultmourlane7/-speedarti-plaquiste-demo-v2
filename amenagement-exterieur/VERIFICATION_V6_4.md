# Vérification V6.4 — Panier à droite

Version : `AMEXT-V6.4-PANIER-DROIT-2026-09-14`

## Comportement responsive

### Ordinateur
- Panier visible en permanence à droite.
- Largeur contrôlée : 330 px.
- Le formulaire reste au centre.
- Le panier ne passe jamais sous le formulaire.

### Tablette
- Navigation métier en haut.
- Formulaire à gauche.
- Panier maintenu à droite en permanence.
- Largeur panier : 300 px.

### Mobile
- Le panier n'est jamais injecté sous le formulaire.
- Bouton flottant `Panier` en bas à droite.
- Le bouton affiche :
  - nombre de lignes du panier ;
  - montant matériaux HT.
- Au clic : tiroir latéral ouvrant depuis la droite.
- Fond assombri derrière le tiroir.
- Bouton X pour fermer.
- Le défilement arrière-plan est bloqué quand le panier est ouvert.

## Contrôles Chromium
- Desktop 1366 px : panier à droite : OK
- Tablette 820 px : panier à droite : OK
- Mobile 390 px : bouton flottant : OK
- Mobile 390 px : ouverture tiroir droit : OK
- Mobile 390 px : fermeture tiroir : OK
- Débordement horizontal mobile : 0
- Erreurs JavaScript : 0

## GitHub attendu
Chemin :
`amenagement-exterieur/index.html`

Taille :
**279813 octets**

SHA-256 :
`ef200e369d3090cebd6e9bd78af1d5a69529310b4bac5582f5dd652e53926794`

Git blob SHA :
`ca4a5883bfeb45d36e5f8c9953aa758a208d88df`

Marqueur :
`AMEXT-V6.4-PANIER-DROIT-2026-09-14`

Pastille :
`V6.4 — PANIER À DROITE`

Aucun fichier du Drive SpeedArti n'a été modifié.
