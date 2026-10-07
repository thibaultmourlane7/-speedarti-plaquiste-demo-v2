import {
  STRUCTURE_WARNING, FIBRE_WARNING, PREFAB_TEAM_ADVICE, PREFAB_H_PER_ML,
  TRUCK_8X4_DEFAULT, FIBRES, CHIMNEY_CONDUITS, CHIMNEY_STACKS, CHIMNEY_CAPS,
  CONCRETE_CLASSES, TREILLIS_GUILLAUME, MICROPILE_PRICE_BY_DEPTH, LONGRINE_PRICE_ML,
  PREFAB_DEFAULT_PRICE_M2, PUMP_DEFAULT_PRICE, TOUPIE_PRICE_M3, TOUPIE_MIN_BILLABLE_M3,
  TOUPIE_CAPACITY_M3, WORKS
} from './references.js';

const euro=n=>Number(n||0).toLocaleString('fr-FR',{minimumFractionDigits:2,maximumFractionDigits:2})+' € HT';
const fmt=(n,d=2)=>Number(n||0).toLocaleString('fr-FR',{minimumFractionDigits:d,maximumFractionDigits:d});
const norm=s=>String(s??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();

const baseEntries=[
  {
    id:'MAC-SEC-STRUCTURE',topic:'securite',
    tags:['structure','dimensionnement','charge','beton','acier','ferraillage','ingenieur','etude beton','securite'],
    title:'Limite de dimensionnement structurel',
    answer:STRUCTURE_WARNING
  },
  {
    id:'MAC-PRIX-PRIORITE',topic:'prix',
    tags:['prix','catalogue','automatique','manuel','a confirmer','priorite','resultat'],
    title:'Priorité des prix Maçon',
    answer:'Priorité SpeedArti Maçon : le moteur calcule d’abord les quantités, puis cherche automatiquement un article catalogue compatible et tarifé. Un prix personnel explicite remplace le prix automatique. Si aucun prix fiable n’existe, le résultat reste accessible et le poste est signalé « à confirmer » ; aucun prix n’est inventé.'
  },
  {
    id:'MAC-MO-OUVRIERS',topic:'main_oeuvre',
    tags:['ouvrier','ouvriers','heures homme','heures-homme','duree','planning','main oeuvre','cout'],
    title:'Heures-homme et nombre d’ouvriers',
    answer:'Le nombre d’ouvriers ne change pas les heures-homme nécessaires à l’ouvrage. Durée chantier = heures-homme totales ÷ nombre d’ouvriers. Coût de main-d’œuvre = heures-homme totales × taux horaire.'
  },
  {
    id:'MAC-MURS-OUVERTURES',topic:'murs',
    tags:['mur','murs','ouverture','ouvertures','fenetre','porte','surface nette','linteau','seuil','appui'],
    title:'Déduction des ouvertures dans les murs',
    answer:'Les ouvertures sont déduites de la surface brute du mur. Les ouvrages associés à l’ouverture, par exemple linteau, seuil ou appui, restent calculés séparément lorsqu’ils sont sélectionnés.'
  },
  {
    id:'MAC-SEMELLE-DIMENSIONS',topic:'fondations',
    tags:['semelle','fondation','longueur','largeur','hauteur','epaisseur','cm','metre','volume'],
    title:'Saisie des semelles',
    answer:'Format SpeedArti : longueur en mètres × largeur en centimètres × hauteur/épaisseur béton en centimètres. La profondeur de fouille reste une donnée séparée lorsqu’elle est utilisée.'
  },
  {
    id:'MAC-CHAINAGE-V',topic:'murs',
    tags:['chainage','vertical','ratio','estimation','perimetre','hauteur','3.5','3,5'],
    title:'Estimation du chaînage vertical',
    answer:'Estimation métier proposée : ceil(périmètre ÷ 3,50) × hauteur. Cette valeur reste modifiable et est explicitement présentée comme une estimation par ratio, jamais comme un contrôle DTU ou un dimensionnement structurel.'
  },
  {
    id:'MAC-TOUPIE-PRIX',topic:'beton',
    tags:['toupie','beton livre','prix','minimum','6 m3','capacite','7 m3','camion'],
    title:'Toupie — prix, minimum et capacité',
    answer:'Référence actuelle : '+euro(TOUPIE_PRICE_M3)+'/m³, minimum facturé '+fmt(TOUPIE_MIN_BILLABLE_M3,0)+' m³ soit '+euro(TOUPIE_PRICE_M3*TOUPIE_MIN_BILLABLE_M3)+'. Capacité logistique de référence : '+fmt(TOUPIE_CAPACITY_M3,0)+' m³ maximum par toupie. Ces valeurs commerciales restent modifiables.'
  },
  {
    id:'MAC-TOUPIE-CALCUL',topic:'beton',
    tags:['toupie','nombre','camion','camions','volume','automatique','calcul'],
    title:'Nombre de toupies estimé',
    answer:'En mode automatique, le nombre logistique estimé de toupies = ceil(volume béton ÷ '+fmt(TOUPIE_CAPACITY_M3,0)+' m³). La facturation au m³ et le nombre de camions sont deux notions distinctes.'
  },
  {
    id:'MAC-BETON-PRODUCTIVITE',topic:'main_oeuvre',
    tags:['betonniere','toupie','productivite','beton','4 h','1 h','heure homme','controle'],
    title:'Contrôle de productivité béton',
    answer:'Contrôle informatif actuel : béton à la bétonnière = 4 h-homme/m³ ; béton livré par toupie = 1 h-homme/m³. Ce contrôle n’est pas additionné automatiquement aux temps d’ouvrage afin d’éviter une double main-d’œuvre.'
  },
  {
    id:'MAC-POMPE',topic:'beton',
    tags:['pompe','camion pompe','beton','prix','forfait'],
    title:'Camion-pompe béton',
    answer:'Prix de référence actuel : '+euro(PUMP_DEFAULT_PRICE)+' par forfait. Valeur modifiable dans le chiffrage.'
  },
  {
    id:'MAC-BENNE',topic:'transport',
    tags:['camion','benne','8x4','transport','prix','jour'],
    title:'Camion-benne 8×4',
    answer:'Prix de référence actuel : '+euro(TRUCK_8X4_DEFAULT)+' par jour. Le prix peut être modifié et mémorisé lorsque l’option correspondante est utilisée.'
  },
  {
    id:'MAC-PREFAB',topic:'murs',
    tags:['mur','prefabrique','prefab','pose','grutage','planning','prix','m2'],
    title:'Mur préfabriqué béton',
    answer:'Prix de référence actuel : '+euro(PREFAB_DEFAULT_PRICE_M2)+'/m² posé, livré et gruté, modifiable. Temps de pose planning : '+fmt(PREFAB_H_PER_ML.standard,2)+' / '+fmt(PREFAB_H_PER_ML.hauteur_importante,2)+' / '+fmt(PREFAB_H_PER_ML.lourd_complexe,2)+' h-homme/ml selon le cas. Les heures restent au planning sans être refacturées une seconde fois lorsque le prix les inclut. '+PREFAB_TEAM_ADVICE
  },
  {
    id:'MAC-LONGRINE',topic:'fondations',
    tags:['longrine','micropieux','micro pieux','prix','ml','beton','acier','coffrage'],
    title:'Longrine avec micro-pieux',
    answer:'Référence actuelle : '+euro(LONGRINE_PRICE_ML)+'/ml, modifiable et séparée du prix des micro-pieux. Les quantités physiques béton/acier/coffrage peuvent rester visibles comme incluses pour conserver la traçabilité sans double facturation.'
  },
  {
    id:'MAC-MICROPIEUX-PRINCIPE',topic:'fondations',
    tags:['micropieu','micro-pieu','micro pieu','profondeur','prix','dimensionnement','main oeuvre'],
    title:'Micro-pieux — principe de chiffrage',
    answer:'La profondeur sert uniquement à proposer un prix métier par micro-pieu. Elle ne sert jamais à dimensionner automatiquement le micro-pieu. Le prix proposé est traité comme fourniture + main-d’œuvre incluse afin d’éviter une double facturation.'
  },
  {
    id:'MAC-FIBRES-FORMULE',topic:'beton',
    tags:['fibre','fibres','dosage','kg m3','dalle','volume','formule'],
    title:'Calcul des fibres béton',
    answer:'Quantité de fibres = volume béton × dosage saisi en kg/m³. Le dosage exact reste une donnée explicite et modifiable. '+FIBRE_WARNING
  },
  {
    id:'MAC-CLASSE-BETON',topic:'beton',
    tags:['classe','beton','c20 25','c25 30','c30 37','c35 45','ouvrage'],
    title:'Classe béton par ouvrage',
    answer:'La classe béton est portée par chaque ouvrage concerné. Les classes disponibles dans le moteur sont : '+CONCRETE_CLASSES.join(', ')+'. SpeedArti ne choisit pas automatiquement une classe structurelle pour un nouveau chiffrage.'
  },
  {
    id:'MAC-SIMPLE-MULTI',topic:'parcours',
    tags:['simple','multiple','mode','etat','ancienne valeur','calcul'],
    title:'Indépendance des parcours simple et multiple',
    answer:'Les parcours simple et multiple doivent rester indépendants. Une donnée devenue inactive après un changement de mode ne doit plus influencer les calculs.'
  },
  {
    id:'MAC-PRIX-MANUEL',topic:'prix',
    tags:['prix manuel','override','remplace','catalogue','personnel'],
    title:'Prix personnel artisan',
    answer:'Un prix personnel saisi explicitement par l’artisan devient prioritaire pour la ligne concernée. Il remplace le prix automatique sans modifier la quantité métier calculée.'
  },
  {
    id:'MAC-TRACABILITE',topic:'trace',
    tags:['source','trace','tracabilite','quantite','unite','prix','calcul','catalogue'],
    title:'Traçabilité du chiffrage',
    answer:'La base Angèle Maçon est dérivée du référentiel et des règles réellement présents dans macon/references.js et macon/core.js. Une réponse Angèle doit distinguer quantité métier, unité, référence, prix, source, main-d’œuvre et règles de sécurité.'
  }
];

const workEntries=WORKS.map(w=>({
  id:'MAC-OUVRAGE-'+w.id.toUpperCase(),
  sourceId:w.id,
  topic:'ouvrage',
  tags:['ouvrage','macon',w.id,w.label,w.unite,'beton','acier','coffrage','main oeuvre','heures homme'],
  title:'Ouvrage — '+w.label,
  answer:w.label+' : unité métier '+w.unite+' ; béton '+fmt(w.betonParUnite,3)+' m³/'+w.unite+' ; acier '+fmt(w.acierParUnite,2)+' '+w.acierUnite+' ; coffrage '+fmt(w.coffrageParUnite,2)+' m²/'+w.unite+' ; main-d’œuvre '+fmt(w.moHParUnite,2)+' h-homme/'+w.unite+'. Ces ratios sont des références de chiffrage modifiables et ne constituent pas un dimensionnement structurel.'
}));

const treillisEntries=Object.entries(TREILLIS_GUILLAUME).map(([id,t])=>({
  id:'MAC-TREILLIS-'+id,
  sourceId:id,
  topic:'treillis',
  tags:['treillis','ferraillage','dalle',id,t.label,t.diametre,t.maille,t.usage],
  title:'Treillis — '+t.label,
  answer:t.label+' : diamètre '+t.diametre+', maille '+t.maille+', usage indicatif « '+t.usage+' », prix métier '+euro(t.priceM2)+'/m² et temps de pose '+fmt(t.hPerM2,2)+' h-homme/m². Valeur de chiffrage modifiable ; pas de dimensionnement structurel automatique.'
}));

const fibreEntries=Object.entries(FIBRES).map(([id,f])=>({
  id:'MAC-FIBRE-'+id.toUpperCase(),
  sourceId:id,
  topic:'fibres',
  tags:['fibre','fibres','beton','dosage',id,f.label],
  title:'Fibres — '+f.label,
  answer:f.label+' : plage indicative '+fmt(f.min,0)+' à '+fmt(f.max,0)+' kg/m³. Le dosage réel doit rester explicite et modifiable. '+FIBRE_WARNING
}));

const chimneyConduitEntries=Object.entries(CHIMNEY_CONDUITS).map(([id,c])=>({
  id:'MAC-CHEM-CONDUIT-'+id,
  sourceId:id,
  topic:'cheminee',
  tags:['cheminee','conduit','boisseau',id,c.label],
  title:'Cheminée — '+c.label,
  answer:c.label+' : fourniture de référence '+euro(c.supply)+'/ml ; temps '+fmt(c.h,2)+' h-homme/ml ; total de référence '+euro(c.total)+'/ml. Les valeurs sont modifiables.'
}));
const chimneyStackEntries=Object.entries(CHIMNEY_STACKS).map(([id,c])=>({
  id:'MAC-CHEM-SOUCHE-'+id.toUpperCase(),
  sourceId:id,
  topic:'cheminee',
  tags:['cheminee','souche',id,c.label],
  title:'Cheminée — '+c.label,
  answer:c.label+' : fourniture de référence '+euro(c.supply)+' ; temps '+fmt(c.h,2)+' h-homme ; total de référence '+euro(c.total)+'. Valeurs modifiables.'
}));
const chimneyCapEntries=Object.entries(CHIMNEY_CAPS).map(([id,c])=>({
  id:'MAC-CHEM-CHAPEAU-'+id.toUpperCase(),
  sourceId:id,
  topic:'cheminee',
  tags:['cheminee','chapeau',id,c.label],
  title:'Cheminée — '+c.label,
  answer:c.label+' : fourniture de référence '+euro(c.supply)+' ; temps '+fmt(c.h,2)+' h-homme ; total de référence '+euro(c.total)+'. Valeurs modifiables.'
}));

const micropileEntries=MICROPILE_PRICE_BY_DEPTH.map((r,i)=>({
  id:'MAC-MICROPIEU-TRANCHE-'+String(i+1),
  sourceId:String(i+1),
  topic:'fondations',
  tags:['micropieu','micro-pieu','profondeur','prix',r.label],
  title:'Micro-pieu — '+r.label,
  answer:'Pour la tranche '+r.label+', proposition métier actuelle : '+euro(r.price)+' par micro-pieu, fourniture + main-d’œuvre incluse. Cette profondeur sert au chiffrage, jamais au dimensionnement.'
}));

export const ANGEL_MACON_ENTRIES=[
  ...baseEntries,
  ...workEntries,
  ...treillisEntries,
  ...fibreEntries,
  ...chimneyConduitEntries,
  ...chimneyStackEntries,
  ...chimneyCapEntries,
  ...micropileEntries
];

const ANGEL_STOP_WORDS=new Set(['le','la','les','un','une','des','du','de','d','a','au','aux','et','ou','pour','par','avec','sans','dans','sur','sous','quel','quelle','quels','quelles','combien','faire','fait','est','sont','mon','ma','mes','ton','ta','tes','son','sa','ses']);
function angelTokens(q){return norm(q).split(/\s+/).filter(t=>t.length>=3&&!ANGEL_STOP_WORDS.has(t)&&!/^\d+$/.test(t))}
function structuralSizingQuery(q){q=norm(q);return /dimension|dimensionnement|ferraillage|section|portee|profondeur|diametre|charge|charges|epaisseur minimale|quelle armature|quel acier/.test(q)&&/fondation|semelle|radier|poutre|poteau|mur porteur|soutenement|dalle|plancher|chainage|micro pieu|micropieu/.test(q)}
export function searchAngelMacon(query,limit=5){
 const tokens=angelTokens(query);if(!tokens.length)return [];const q=norm(query),min=tokens.length===1?1:Math.ceil(tokens.length*.5);
 return ANGEL_MACON_ENTRIES.map(e=>{const title=norm(e.title),tags=(e.tags||[]).map(norm),hay=norm([e.id,e.sourceId,e.topic,e.title,e.answer,...(e.tags||[])].join(' '));let score=0,matched=0;if(q.length>=4&&hay.includes(q))score+=10;for(const t of tokens){let hit=false;if(hay.includes(t)){score++;hit=true}if(title.includes(t)){score+=3;hit=true}if(tags.some(x=>x.includes(t))){score+=3;hit=true}if(norm(e.id).includes(t)||norm(e.sourceId).includes(t)){score+=2;hit=true}if(hit)matched++}return{...e,score,matched}}).filter(e=>e.matched>=min&&e.score>=5).sort((a,b)=>b.score-a.score||b.matched-a.matched||a.id.localeCompare(b.id)).slice(0,Math.max(1,Math.min(10,Number(limit)||5)));
}
export function answerAngelMacon(query){
 if(structuralSizingQuery(query))return `${STRUCTURE_WARNING}\n\nAngèle ne doit jamais proposer seule une profondeur, une section, un ferraillage ou un dimensionnement structurel : utiliser l’étude de sol / étude béton et les prescriptions du projet.`;
 const hits=searchAngelMacon(query,3);return hits.length?hits.map(x=>x.answer).join('\n\n'):'Aucune règle Maçon correspondante dans la base Angèle. Ne pas inventer : demander ou vérifier la règle dans le moteur SpeedArti.';
}
export function getAngelMaconEntry(id){
  return ANGEL_MACON_ENTRIES.find(e=>e.id===id||e.sourceId===id)||null;
}

export const SpeedArtiAngelMaconKnowledge=Object.freeze({
  version:'MAC-ANGEL-KB-v1.0',
  metier:'macon',
  source:'macon/references.js + macon/core.js + macon/catalogue-macon.js (main)',
  entries:ANGEL_MACON_ENTRIES,
  search:searchAngelMacon,
  answer:answerAngelMacon,
  getById:getAngelMaconEntry
});

if(typeof globalThis!=='undefined')globalThis.SpeedArtiAngelMaconKnowledge=SpeedArtiAngelMaconKnowledge;
