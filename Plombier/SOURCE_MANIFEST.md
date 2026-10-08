# SpeedArti — Plombier v0.7.1 — Sources du Sprint D

## Sprint D — automatisations après audit humain

### Temps sanitaires

Aucune grille chiffrée Guillaume n’a été retrouvée pour lavabo/vasque, meuble vasque, douche, baignoire, évier ou lave-mains. La règle reste donc : **ne pas inventer de temps**.

Automatisation ajoutée :
- une durée saisie sur un type d’équipement devient une habitude entreprise ;
- cette habitude est réutilisée automatiquement sur les prochains équipements comparables ;
- une durée spécifique sur l’équipement reste prioritaire.

Les bases WC historiquement validées restent inchangées.

### Évier simple

Référence métier validée déjà existante :
- bonde évier 1 cuve : `4272991` ;
- siphon évier : `1066748`.

Le moteur traite désormais l’absence de configuration d’un évier comme `simple`, cohérent avec l’interface affichant « Simple bac » par défaut.

### Élément spécifique — évacuation

Règle conservée : aucun diamètre ne doit être inventé.

Si l’artisan choisit :
- DN40 → tube `044755V` + raccord `059805D` ;
- DN100 → tube `044788U` + raccord `027749Z`.

Sans diamètre exploitable, la fourniture reste explicitement non chiffrée.

### Robinetterie meuble vasque / lave-mains

Aucune référence générique n’est imposée automatiquement. Une référence habituelle entreprise peut être définie depuis le catalogue Téréva et devient alors automatique.

Priorité :
1. sélection sur l’équipement ;
2. habitude entreprise ;
3. aucun défaut arbitraire.

La quantité d’un meuble double vasque reste automatiquement à 2 robinets.

## Base Téréva conservée

- 7 456 références ;
- 7 451 prix exploitables ;
- source unique réseau via `catalogue-data.js` + `catalogue-service.js`.
