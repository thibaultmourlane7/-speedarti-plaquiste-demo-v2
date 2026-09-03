export const STRUCTURE_WARNING = "Ces données sont fournies à titre estimatif et indicatif. Elles ne constituent en aucun cas un calcul réel de structure ou de dimensionnement des charges. Les valeurs proposées sont modifiables par l’utilisateur afin de les adapter aux résultats de l’étude béton et aux exigences spécifiques du projet.";

export const FIBRE_WARNING = "Le dosage de fibres est estimatif. Un calcul adapté à l’ouvrage et à sa portée est obligatoire afin d’assurer un ouvrage durable dans le temps.";

export const PREFAB_TEAM_ADVICE = "Conseil : la pose d’un mur préfabriqué béton s’effectue généralement en équipe de 3 personnes. Le temps de référence est exprimé en heures-homme par mètre linéaire et concerne uniquement la pose sur site, hors grutage.";

export const PREFAB_H_PER_ML = { standard:1.55, hauteur_importante:1.90, lourd_complexe:2.75 };
export const TRUCK_8X4_DEFAULT = 800;
export const FIBRES = {
  courante:{min:3,max:4,label:"Dalle courante / limitation fissuration"},
  renforcee:{min:5,max:6,label:"Dalle renforcée"},
  fortement_sollicitee:{min:7,max:9,label:"Dalle fortement sollicitée"},
  metallique_structurelle:{min:20,max:40,label:"Fibres métalliques structurelles"}
};

export const CHIMNEY_CONDUITS = {
  "20x20":{supply:35,h:0.75,total:90,label:"Conduit en boisseau béton 20 × 20 cm"},
  "20x30":{supply:40,h:0.80,total:100,label:"Conduit en boisseau béton 20 × 30 cm"},
  "25x25":{supply:45,h:0.80,total:105,label:"Conduit en boisseau béton 25 × 25 cm"},
  "30x30":{supply:55,h:0.90,total:120,label:"Conduit en boisseau béton 30 × 30 cm"},
  "20x40":{supply:50,h:0.90,total:115,label:"Conduit en boisseau béton 20 × 40 cm"}
};
export const CHIMNEY_STACKS = {
  simple:{supply:120,h:3.5,total:370,label:"Souche béton simple"},
  standard_finition:{supply:150,h:4,total:450,label:"Souche béton standard avec finition"},
  importante_grande_hauteur:{supply:200,h:5.5,total:600,label:"Souche béton importante / grande hauteur"}
};
export const CHIMNEY_CAPS = {
  standard:{supply:80,h:1,total:150,label:"Chapeau béton standard"},
  renforce_grande_dimension:{supply:120,h:1.25,total:210,label:"Chapeau béton renforcé / grande dimension"}
};

export const WORKS = [
  {
    "id": "beton_proprete",
    "label": "Béton de propreté",
    "unite": "m³",
    "betonParUnite": 1.0,
    "acierParUnite": 0.0,
    "acierUnite": "kg/m³",
    "coffrageParUnite": 0.0,
    "moHParUnite": 0.5
  },
  {
    "id": "semelle_filante",
    "label": "Semelle filante",
    "unite": "m³",
    "betonParUnite": 1.0,
    "acierParUnite": 50.0,
    "acierUnite": "kg/m³",
    "coffrageParUnite": 1.5,
    "moHParUnite": 3.0
  },
  {
    "id": "semelle_isolee",
    "label": "Semelle isolée",
    "unite": "m³",
    "betonParUnite": 1.0,
    "acierParUnite": 60.0,
    "acierUnite": "kg/m³",
    "coffrageParUnite": 2.0,
    "moHParUnite": 3.5
  },
  {
    "id": "semelle_sous_mur",
    "label": "Semelle sous mur",
    "unite": "m³",
    "betonParUnite": 1.0,
    "acierParUnite": 50.0,
    "acierUnite": "kg/m³",
    "coffrageParUnite": 1.5,
    "moHParUnite": 3.0
  },
  {
    "id": "longrine_fondation",
    "label": "Longrine de fondation",
    "unite": "m³",
    "betonParUnite": 1.0,
    "acierParUnite": 80.0,
    "acierUnite": "kg/m³",
    "coffrageParUnite": 4.0,
    "moHParUnite": 5.0
  },
  {
    "id": "longrine_redressement",
    "label": "Longrine de redressement",
    "unite": "m³",
    "betonParUnite": 1.0,
    "acierParUnite": 90.0,
    "acierUnite": "kg/m³",
    "coffrageParUnite": 4.0,
    "moHParUnite": 5.5
  },
  {
    "id": "radier_general",
    "label": "Radier général",
    "unite": "m³",
    "betonParUnite": 1.0,
    "acierParUnite": 60.0,
    "acierUnite": "kg/m³",
    "coffrageParUnite": 0.3,
    "moHParUnite": 2.5
  },
  {
    "id": "radier_renforce",
    "label": "Radier renforcé",
    "unite": "m³",
    "betonParUnite": 1.0,
    "acierParUnite": 80.0,
    "acierUnite": "kg/m³",
    "coffrageParUnite": 0.5,
    "moHParUnite": 3.0
  },
  {
    "id": "dallage_non_arme",
    "label": "Dallage béton non armé",
    "unite": "m²",
    "betonParUnite": 0.12,
    "acierParUnite": 0.0,
    "acierUnite": "kg/m²",
    "coffrageParUnite": 0.05,
    "moHParUnite": 0.6
  },
  {
    "id": "dallage_arme",
    "label": "Dallage béton armé",
    "unite": "m²",
    "betonParUnite": 0.12,
    "acierParUnite": 3.5,
    "acierUnite": "kg/m²",
    "coffrageParUnite": 0.05,
    "moHParUnite": 0.75
  },
  {
    "id": "dalle_pleine_ba",
    "label": "Dalle pleine BA",
    "unite": "m²",
    "betonParUnite": 0.2,
    "acierParUnite": 12.0,
    "acierUnite": "kg/m²",
    "coffrageParUnite": 1.0,
    "moHParUnite": 1.5
  },
  {
    "id": "dalle_pleine_fortement_armee",
    "label": "Dalle pleine fortement armée",
    "unite": "m²",
    "betonParUnite": 0.2,
    "acierParUnite": 16.0,
    "acierUnite": "kg/m²",
    "coffrageParUnite": 1.0,
    "moHParUnite": 1.8
  },
  {
    "id": "dalle_portee",
    "label": "Dalle portée",
    "unite": "m²",
    "betonParUnite": 0.2,
    "acierParUnite": 12.0,
    "acierUnite": "kg/m²",
    "coffrageParUnite": 1.0,
    "moHParUnite": 1.5
  },
  {
    "id": "plancher_poutrelles_hourdis",
    "label": "Plancher poutrelles-hourdis",
    "unite": "m²",
    "betonParUnite": 0.15,
    "acierParUnite": 5.0,
    "acierUnite": "kg/m²",
    "coffrageParUnite": 0.1,
    "moHParUnite": 1.2
  },
  {
    "id": "plancher_predalles",
    "label": "Plancher prédalles",
    "unite": "m²",
    "betonParUnite": 0.15,
    "acierParUnite": 5.0,
    "acierUnite": "kg/m²",
    "coffrageParUnite": 0.1,
    "moHParUnite": 1.2
  },
  {
    "id": "mur_banche_courant",
    "label": "Mur banché courant",
    "unite": "m²",
    "betonParUnite": 0.2,
    "acierParUnite": 16.0,
    "acierUnite": "kg/m²",
    "coffrageParUnite": 2.0,
    "moHParUnite": 1.8
  },
  {
    "id": "mur_banche_enterre",
    "label": "Mur banché enterré",
    "unite": "m²",
    "betonParUnite": 0.2,
    "acierParUnite": 18.0,
    "acierUnite": "kg/m²",
    "coffrageParUnite": 2.0,
    "moHParUnite": 2.0
  },
  {
    "id": "voile_ba_interieur",
    "label": "Voile BA intérieur",
    "unite": "m²",
    "betonParUnite": 0.2,
    "acierParUnite": 16.0,
    "acierUnite": "kg/m²",
    "coffrageParUnite": 2.0,
    "moHParUnite": 1.8
  },
  {
    "id": "mur_soutenement",
    "label": "Mur de soutènement",
    "unite": "m³",
    "betonParUnite": 1.0,
    "acierParUnite": 80.0,
    "acierUnite": "kg/m³",
    "coffrageParUnite": 3.0,
    "moHParUnite": 6.0
  },
  {
    "id": "poteau_ba_courant",
    "label": "Poteau BA courant",
    "unite": "m³",
    "betonParUnite": 1.0,
    "acierParUnite": 120.0,
    "acierUnite": "kg/m³",
    "coffrageParUnite": 6.0,
    "moHParUnite": 7.0
  },
  {
    "id": "poteau_ba_fortement_arme",
    "label": "Poteau BA fortement armé",
    "unite": "m³",
    "betonParUnite": 1.0,
    "acierParUnite": 160.0,
    "acierUnite": "kg/m³",
    "coffrageParUnite": 6.0,
    "moHParUnite": 8.0
  },
  {
    "id": "potelet_raidisseur_vertical",
    "label": "Potelet / raidisseur vertical",
    "unite": "ml",
    "betonParUnite": 0.025,
    "acierParUnite": 3.0,
    "acierUnite": "kg/ml",
    "coffrageParUnite": 0.4,
    "moHParUnite": 0.35
  },
  {
    "id": "raidisseur_horizontal",
    "label": "Raidisseur horizontal",
    "unite": "ml",
    "betonParUnite": 0.025,
    "acierParUnite": 3.0,
    "acierUnite": "kg/ml",
    "coffrageParUnite": 0.4,
    "moHParUnite": 0.35
  },
  {
    "id": "chainage_horizontal",
    "label": "Chaînage horizontal",
    "unite": "ml",
    "betonParUnite": 0.025,
    "acierParUnite": 3.0,
    "acierUnite": "kg/ml",
    "coffrageParUnite": 0.4,
    "moHParUnite": 0.35
  },
  {
    "id": "chainage_vertical",
    "label": "Chaînage vertical",
    "unite": "ml",
    "betonParUnite": 0.025,
    "acierParUnite": 3.0,
    "acierUnite": "kg/ml",
    "coffrageParUnite": 0.4,
    "moHParUnite": 0.35
  },
  {
    "id": "chainage_toiture",
    "label": "Chaînage de toiture",
    "unite": "ml",
    "betonParUnite": 0.025,
    "acierParUnite": 3.5,
    "acierUnite": "kg/ml",
    "coffrageParUnite": 0.4,
    "moHParUnite": 0.4
  },
  {
    "id": "linteau_ba_courant",
    "label": "Linteau BA courant",
    "unite": "ml",
    "betonParUnite": 0.04,
    "acierParUnite": 4.0,
    "acierUnite": "kg/ml",
    "coffrageParUnite": 1.0,
    "moHParUnite": 0.7
  },
  {
    "id": "linteau_ba_renforce",
    "label": "Linteau BA renforcé",
    "unite": "ml",
    "betonParUnite": 0.06,
    "acierParUnite": 7.0,
    "acierUnite": "kg/ml",
    "coffrageParUnite": 1.2,
    "moHParUnite": 0.9
  },
  {
    "id": "poutre_ba_courante",
    "label": "Poutre BA courante",
    "unite": "m³",
    "betonParUnite": 1.0,
    "acierParUnite": 130.0,
    "acierUnite": "kg/m³",
    "coffrageParUnite": 6.0,
    "moHParUnite": 7.0
  },
  {
    "id": "poutre_ba_fortement_chargee",
    "label": "Poutre BA fortement chargée",
    "unite": "m³",
    "betonParUnite": 1.0,
    "acierParUnite": 160.0,
    "acierUnite": "kg/m³",
    "coffrageParUnite": 6.0,
    "moHParUnite": 8.0
  },
  {
    "id": "poutre_rive",
    "label": "Poutre de rive",
    "unite": "m³",
    "betonParUnite": 1.0,
    "acierParUnite": 140.0,
    "acierUnite": "kg/m³",
    "coffrageParUnite": 6.0,
    "moHParUnite": 7.5
  },
  {
    "id": "poutre_redressement",
    "label": "Poutre de redressement",
    "unite": "m³",
    "betonParUnite": 1.0,
    "acierParUnite": 150.0,
    "acierUnite": "kg/m³",
    "coffrageParUnite": 6.0,
    "moHParUnite": 7.5
  },
  {
    "id": "chevetre",
    "label": "Chevêtre",
    "unite": "m³",
    "betonParUnite": 1.0,
    "acierParUnite": 70.0,
    "acierUnite": "kg/m³",
    "coffrageParUnite": 5.0,
    "moHParUnite": 6.0
  },
  {
    "id": "escalier_ba",
    "label": "Escalier BA",
    "unite": "m²",
    "betonParUnite": 0.2,
    "acierParUnite": 15.0,
    "acierUnite": "kg/m²",
    "coffrageParUnite": 1.5,
    "moHParUnite": 2.0
  },
  {
    "id": "paillasse_escalier",
    "label": "Paillasse d'escalier",
    "unite": "m²",
    "betonParUnite": 0.15,
    "acierParUnite": 10.0,
    "acierUnite": "kg/m²",
    "coffrageParUnite": 1.3,
    "moHParUnite": 1.7
  },
  {
    "id": "palier_ba",
    "label": "Palier BA",
    "unite": "m²",
    "betonParUnite": 0.2,
    "acierParUnite": 12.0,
    "acierUnite": "kg/m²",
    "coffrageParUnite": 1.0,
    "moHParUnite": 1.5
  },
  {
    "id": "acrotere_ba",
    "label": "Acrotère BA",
    "unite": "ml",
    "betonParUnite": 0.08,
    "acierParUnite": 6.0,
    "acierUnite": "kg/ml",
    "coffrageParUnite": 2.0,
    "moHParUnite": 1.2
  },
  {
    "id": "appui_fenetre_ba",
    "label": "Appui de fenêtre BA",
    "unite": "ml",
    "betonParUnite": 0.025,
    "acierParUnite": 2.0,
    "acierUnite": "kg/ml",
    "coffrageParUnite": 0.5,
    "moHParUnite": 0.5
  },
  {
    "id": "seuil_ba",
    "label": "Seuil béton armé",
    "unite": "ml",
    "betonParUnite": 0.03,
    "acierParUnite": 2.0,
    "acierUnite": "kg/ml",
    "coffrageParUnite": 0.5,
    "moHParUnite": 0.5
  },
  {
    "id": "des_ba",
    "label": "Dés béton armé",
    "unite": "unité",
    "betonParUnite": 0.05,
    "acierParUnite": 3.0,
    "acierUnite": "kg/u",
    "coffrageParUnite": 0.8,
    "moHParUnite": 0.6
  }
];
export const WORK_BY_ID = Object.fromEntries(WORKS.map(x=>[x.id,x]));
