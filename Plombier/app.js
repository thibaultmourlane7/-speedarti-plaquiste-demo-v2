const API=window.SpeedArtiPlombierCurrent;
if(!API) throw new Error('Moteur Plombier non chargé');

const steps=[
  ['Métier','Plombier'],
  ['Type projet','Petits travaux / Installation'],
  ['Workflow','Prestations / équipements / réseau'],
  ['Options','Configuration métier'],
  ['Résultats','Contrôle avant devis']
];
const storeKey='speedarti-plombier-demo-v020';
let step=0;
let d=load()||initial();
const q=s=>document.querySelector(s);
const content=q('#content');

q('#prev').onclick=()=>go(step-1);
q('#next').onclick=()=>step===4?run():go(step+1);
q('#calcBtn').onclick=()=>run(true);
q('#saveBtn').onclick=()=>save(true);
q('#resetBtn').onclick=()=>{if(confirm('Réinitialiser le brouillon Plombier ?')){localStorage.removeItem(storeKey);d=initial();step=0;render()}};
q('#steps').addEventListener('click',e=>{const b=e.target.closest('[data-step]');if(b)go(+b.dataset.step)});
content.addEventListener('click',clickHandler);
content.addEventListener('change',inputHandler);
content.addEventListener('input',inputHandler);
render();

function initial(){
  return {
    metier:'plombier',
    nom_calcul:'Chiffrage Plombier — workflow Guillaume',
    options:{
      type_projet:'',gamme:'standard',complexite:'moyen',taux_horaire:52,nb_ouvriers:1,taux_tva:20,type_tuyau:'per',
      forfaits:{},chauffe_eau:{enabled:false,type:'cumulus',capacity:200},adoucisseur:{enabled:false,price_ht:1000}
    },
    installation:{
      surface_maison_m2:'',equipments:[],
      network:{distance_ce_sdb:5,distance_ce_cuisine:8,attente_rdc:0,attente_r1:0,ef_only:0,ec_only:0,ef_ec:0,evac_points:0,platines_ef:0,platines_ec:0,platines_ef_ec:0,platines_evac:0},
      annexe1:{}
    },
    petits_travaux:{prestations:[]},
    settings:{annexe1:{},forfaits:{}}
  };
}
function save(show=false){localStorage.setItem(storeKey,JSON.stringify(d));if(show)flash('Brouillon enregistré','ok')}
function load(){try{return JSON.parse(localStorage.getItem(storeKey))}catch{return null}}
function uid(prefix='id'){return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,7)}`}
function go(n){const next=Math.max(0,Math.min(4,n));if(next>step&&!canLeave(step)){flash('Complète les informations obligatoires avant de continuer','warn');return}step=next;render();window.scrollTo({top:0,behavior:'smooth'})}
function canLeave(i){if(i===0)return !!d.nom_calcul;if(i===1)return !!d.options.type_projet;if(i===2&&d.options.type_projet==='petits_travaux')return (d.petits_travaux.prestations||[]).length>0;return true}
function render(){
  q('#steps').innerHTML=steps.map((s,i)=>`<button class="step ${i===step?'active':i<step?'done':''}" data-step="${i}"><b>${i+1}. ${s[0]}</b><span>${s[1]}</span></button>`).join('');
  q('#prev').style.visibility=step?'visible':'hidden';
  q('#next').textContent=step===4?'Recalculer':'Suivant →';
  [renderMetier,renderType,renderWorkflow,renderOptions,renderResults][step]();
}
function head(k,t,p){return `<div class="head"><span class="eyebrow">${k}</span><h1>${t}</h1><p>${p}</p></div>`}
function choice(value,title,desc,current,attr='data-choice'){return `<button class="choice ${current===value?'active':''}" ${attr}="${value}"><strong>${title}</strong><span>${desc}</span></button>`}
function numField(label,path,value,cl='c4',min=0,step=1,placeholder=''){return `<div class="field ${cl}"><label>${label}</label><input class="input" type="number" min="${min}" step="${step}" placeholder="${placeholder}" data-path="${path}" value="${value??''}"></div>`}
function textField(label,path,value,cl='c6',placeholder=''){return `<div class="field ${cl}"><label>${label}</label><input class="input" data-path="${path}" value="${esc(value||'')}" placeholder="${placeholder}"></div>`}
function selectField(label,path,opts,value,cl='c6'){return `<div class="field ${cl}"><label>${label}</label><select class="select" data-path="${path}">${opts.map(([v,l])=>`<option value="${v}" ${String(v)===String(value)?'selected':''}>${l}</option>`).join('')}</select></div>`}
function toggle(path,label,help=''){return `<label class="switch-row"><input class="switch" type="checkbox" data-path="${path}" ${get(d,path)?'checked':''}><span><b>${label}</b>${help?`<small>${help}</small>`:''}</span></label>`}

function renderMetier(){
  content.innerHTML=head('Étape 1','Métier et nom du calcul','On conserve le module Plombier SpeedArti existant et son identité visuelle.')+
  `<div class="card"><div class="grid"><div class="field c6"><label>Métier</label><input class="input" value="Plombier" disabled></div>${textField('Nom du calcul','nom_calcul',d.nom_calcul,'c6')}</div>
  <div class="status-line"><span class="pill">Base : module existant</span><span class="pill">Mapping intégré</span><span class="pill ok-pill">Décisions Guillaume clôturées</span></div></div>
  <div class="info"><strong>Principe de cette version :</strong> les boutons et champs visibles doivent agir sur le prix, le temps, les matériaux, le réseau, une recommandation ou une alerte.</div>`;
}
function renderType(){
  content.innerHTML=head('Étape 2','Quel type de chantier ?','Le point d’entrée reste identique au module actuel, mais la suite devient réellement conditionnelle.')+
  `<div class="choice-grid">${choice('installation_complete','🏗️ Installation complète','Avec sanitaires ou réseau seul : arrivées EF/EC, attentes et raccordements.',d.options.type_projet)}${choice('petits_travaux','🔧 Petits travaux','Recherche de fuite, chauffe-eau, débouchage, remplacement sanitaire.',d.options.type_projet)}</div>`;
}
function renderWorkflow(){
  if(d.options.type_projet==='petits_travaux') renderSmallWorkflow();
  else renderInstallationWorkflow();
}

function renderInstallationWorkflow(){
  const eqs=d.installation.equipments||[];const net=d.installation.network||{};
  const kinds=[['wc','WC'],['douche','Douche'],['baignoire','Baignoire'],['lavabo','Lavabo / vasque'],['meuble_vasque','Meuble vasque'],['lave_main','Lave-main'],['evier','Évier'],['lave_linge','Lave-linge'],['lave_vaisselle','Lave-vaisselle'],['element_specifique','Élément spécifique']];
  content.innerHTML=head('Étape 3','Installation complète — construire le chantier','Les sanitaires sont facultatifs : une installation complète peut être composée uniquement du réseau et des attentes EF/EC.')+
  `<div class="card"><h2>Informations chantier</h2><div class="grid">${numField('Surface de la maison (m²)','installation.surface_maison_m2',d.installation.surface_maison_m2,'c4',0,.1,'ex. 120')}${selectField('Type de canalisation','options.type_tuyau',[['per','PER'],['multicouche','Multicouche'],['cuivre','Cuivre']],d.options.type_tuyau,'c4')}${numField('Nombre d’ouvriers','options.nb_ouvriers',d.options.nb_ouvriers,'c4',1,1)}</div><p class="subtle">La surface est conservée dans le chiffrage. La formule de pondération par surface n’existe pas explicitement dans le code Plombier original : elle n’est pas inventée dans cette démo.</p></div>
  <div class="card"><div class="row between"><div><h2>Équipements sanitaires</h2><p class="muted">Chaque appareil est indépendant : deux douches peuvent avoir des configurations différentes.</p></div><span class="pill">${eqs.length} élément(s)</span></div>
    <div class="add-grid">${kinds.map(([k,l])=>`<button class="btn secondary add-btn" data-add-equipment="${k}">+ ${l}</button>`).join('')}</div>
    <div class="equipment-list">${eqs.length?eqs.map((eq,i)=>equipmentSummary(eq,i)).join(''):`<div class="empty-state">Aucun sanitaire ajouté. C’est autorisé si le chantier concerne uniquement le réseau.</div>`}</div>
  </div>
  <div class="card"><h2>Réseau seul / attentes sanitaires</h2><p class="muted">Ces points alimentent directement l’estimation EF / EC / évacuation, même avec zéro sanitaire.</p>
    <div class="grid">${numField('Attentes EC/EF RDC — Annexe 1','installation.annexe1.attente_rdc',d.installation.annexe1?.attente_rdc)}${numField('Attentes EC/EF R+1 — Annexe 1','installation.annexe1.attente_r1',d.installation.annexe1?.attente_r1)}${numField('Arrivées EF seules','installation.network.ef_only',net.ef_only)}${numField('Arrivées EC seules','installation.network.ec_only',net.ec_only)}${numField('Arrivées EF + EC','installation.network.ef_ec',net.ef_ec)}${numField('Points évacuation seuls','installation.network.evac_points',net.evac_points)}</div>
    <h3 class="subhead">Platines sanitaires</h3><div class="grid">${numField('Platines EF','installation.network.platines_ef',net.platines_ef)}${numField('Platines EC','installation.network.platines_ec',net.platines_ec)}${numField('Platines EF + EC','installation.network.platines_ef_ec',net.platines_ef_ec)}${numField('Platines avec évacuation','installation.network.platines_evac',net.platines_evac)}</div>
  </div>`;
}
function equipmentSummary(eq,index){
  const labels={wc:'WC',douche:'Douche',baignoire:'Baignoire',lavabo:'Lavabo / vasque',meuble_vasque:'Meuble vasque',lave_main:'Lave-main',evier:'Évier',lave_linge:'Lave-linge',lave_vaisselle:'Lave-vaisselle',element_specifique:'Élément spécifique'};
  const subtitle=eq.subtype?` — ${labelSubtype(eq)}`:'';
  return `<div class="mini-card"><div><strong>${index+1}. ${labels[eq.kind]||eq.kind}${subtitle}</strong><span>${equipmentImpact(eq)}</span></div><div class="row"><button class="btn secondary compact" data-edit-equipment="${eq.id}">Configurer</button><button class="btn danger compact" data-remove-equipment="${eq.id}">Supprimer</button></div></div>`;
}
function equipmentImpact(eq){const p=profile(eq);const arr=[];if(p.ef)arr.push('EF');if(p.ec)arr.push('EC');if(p.evac)arr.push('évac.');return arr.length?`Impact réseau : ${arr.join(' + ')}`:'Réseau défini dans la configuration'}
function profile(eq){if(eq.kind==='element_specifique')return{ef:!!eq.ef,ec:!!eq.ec,evac:!!eq.evac};const hot=['lavabo','meuble_vasque','douche','baignoire','evier'];const ef=['lavabo','meuble_vasque','douche','baignoire','evier','wc','lave_main','lave_linge','lave_vaisselle'];const ev=['lavabo','meuble_vasque','douche','baignoire','evier','wc','lave_main','lave_linge','lave_vaisselle'];return{ef:ef.includes(eq.kind),ec:hot.includes(eq.kind)||(eq.kind==='lave_main'&&!!eq.ec),evac:ev.includes(eq.kind)}}
function labelSubtype(eq){const m={poser:'à poser',suspendu:'suspendu',urinoir:'urinoir',urinoir_bati:'urinoir + bâti',bac:'bac classique',extra_plat:'extra-plat',italienne:'italienne',droite:'droite',asymetrique:'asymétrique',angle:'angle',simple:'simple',double:'double',inox:'inox',resine:'résine',ceramique:'céramique',timbre:'timbre céramique'};return m[eq.subtype]||eq.subtype}

function renderSmallWorkflow(){
  const ps=d.petits_travaux.prestations||[];
  content.innerHTML=head('Étape 3','Petits travaux — plusieurs prestations dans le même chiffrage','Chaque prestation possède ses propres données. Un seul déplacement est compté pour le chantier.')+
  `<div class="card"><div class="row between"><div><h2>Prestations</h2><p class="muted">Débouchage + recherche de fuite + remplacement peuvent coexister.</p></div><button class="btn primary" data-add-prestation>+ Ajouter une prestation</button></div>
  <div class="equipment-list">${ps.length?ps.map((p,i)=>prestationCard(p,i)).join(''):`<div class="empty-state">Ajoute la première prestation pour commencer.</div>`}</div></div>`;
}
function prestationCard(p,i){
  const opts=[['','Choisir...'],['fuite','Recherche de fuite'],['chauffe_eau','Chauffe-eau'],['debouchage','Débouchage'],['remplacement','Remplacement sanitaire']];
  let body=`${selectField('Type de prestation',`petits_travaux.prestations.${i}.type`,opts,p.type,'c6')}`;
  if(p.type==='fuite')body+=`${selectField('Méthode',`petits_travaux.prestations.${i}.method`,[['','Choisir...'],['camera','Caméra endoscopique'],['colorant','Test au colorant'],['demolition','Démolition + recherche'],['fumee','Test à la fumée'],['exterieure','Recherche extérieure'],['circuits','Mise en évidence circuits']],p.method,'c6')}${numField('Prix méthode HT (catalogue / saisie)',`petits_travaux.prestations.${i}.method_price_ht`,p.method_price_ht,'c6',0,.01)}${numField('Durée proposée / modifiable (h)',`petits_travaux.prestations.${i}.duration_h`,p.duration_h??2,'c6',0,.25)}`;
  if(p.type==='chauffe_eau')body+=`${selectField('Intervention',`petits_travaux.prestations.${i}.ce_type`,[['reparation','Réparation / nettoyage'],['changement_200l_elec','Changement 200 L électrique'],['changement_300l_elec','Changement 300 L électrique'],['ballon_thermo_air_ext','Thermodynamique air extérieur'],['ballon_thermo_groupe_ext','Thermodynamique groupe ext. / sortie toit']],p.ce_type||'reparation','c6')}${numField('Durée proposée / modifiable (h)',`petits_travaux.prestations.${i}.duration_h`,p.duration_h??3,'c6',0,.25)}`;
  if(p.type==='debouchage')body+=`<div class="info c12"><b>Forfait débouchage 180 €</b> — tout compris, main-d’œuvre et déplacement inclus.</div>`;
  if(p.type==='remplacement')body+=`<div class="c12">${p.equipment?`<div class="mini-card"><div><strong>${labelForKind(p.equipment.kind)} — ${labelSubtype(p.equipment)||'à configurer'}</strong><span>${equipmentImpact(p.equipment)}</span></div><button class="btn secondary compact" data-edit-prestation-equipment="${p.id}">Configurer</button></div>`:`<div><p class="subtle">Choisir l’élément à remplacer :</p><div class="add-grid compact-grid">${[['wc','WC'],['douche','Douche'],['baignoire','Baignoire'],['lavabo','Lavabo / vasque'],['meuble_vasque','Meuble vasque'],['lave_main','Lave-main'],['evier','Évier'],['element_specifique','Élément spécifique']].map(([k,l])=>`<button class="btn secondary add-btn" data-create-prestation-equipment="${p.id}" data-equipment-kind="${k}">${l}</button>`).join('')}</div></div>`}</div>`;
  return `<div class="card nested"><div class="row between"><h3>Prestation ${i+1}</h3><button class="btn danger compact" data-remove-prestation="${p.id}">Supprimer</button></div><div class="grid">${body}</div></div>`;
}
function labelForKind(k){return {wc:'WC',douche:'Douche',baignoire:'Baignoire',lavabo:'Lavabo / vasque',meuble_vasque:'Meuble vasque',lave_main:'Lave-main',evier:'Évier',lave_linge:'Lave-linge',lave_vaisselle:'Lave-vaisselle',element_specifique:'Élément spécifique'}[k]||'Équipement'}

function renderOptions(){
  if(d.options.type_projet==='petits_travaux')renderSmallOptions();else renderInstallationOptions();
}
function renderInstallationOptions(){
  const eqs=d.installation.equipments||[];const net=d.installation.network||{};const a=d.installation.annexe1||{};
  content.innerHTML=head('Étape 4','Options et configuration métier','Chaque équipement est configuré individuellement. Les options générales restent séparées des sanitaires.')+
  `<div class="card"><h2>Équipements à configurer</h2>${eqs.length?eqs.map((eq,i)=>equipmentEditor(eq,i,'installation')).join(''):`<div class="empty-state">Aucun sanitaire : le chantier peut rester « réseau seul ».</div>`}</div>
  ${networkEditor(net)}
  ${generalOptions()}
  ${annexe1Editor(a)}
  ${settingsEditor()}`;
}
function renderSmallOptions(){
  const ps=d.petits_travaux.prestations||[];
  content.innerHTML=head('Étape 4','Options des petits travaux','Les remplacements réutilisent exactement les mêmes blocs équipements que l’installation complète.')+
  `<div class="card"><h2>Prestations et équipements</h2>${ps.map((p,i)=>`<div class="section-left"><h4>Prestation ${i+1} — ${p.type||'à choisir'}</h4>${p.type==='remplacement'&&p.equipment?equipmentEditor(p.equipment,i,'prestation',p.id):`<p class="muted">${p.type==='remplacement'?'Équipement non configuré.':'Aucune option sanitaire spécifique.'}</p>`}</div>`).join('')}</div>${generalOptions()}${settingsEditor()}`;
}
function equipmentEditor(eq,index,scope,pid=''){
  const prefix=scope==='installation'?`installation.equipments.${index}`:`petits_travaux.prestations.${findPrestationIndex(pid)}.equipment`;
  const common=`${numField('Prix matériel / prestation HT',`${prefix}.price_ht`,eq.price_ht,'c4',0,.01,'catalogue')}${numField('Temps de pose (h)',`${prefix}.time_h`,eq.time_h,'c4',0,.25,'catalogue')}`;
  let specific='';
  if(eq.kind==='wc')specific=`${selectField('Type de WC',`${prefix}.subtype`,[['poser','WC à poser'],['suspendu','WC suspendu + bâti'],['urinoir','Urinoir suspendu'],['urinoir_bati','Urinoir suspendu + bâti']],eq.subtype||'poser','c4')}${toggle(`${prefix}.pmr_wc`,'Forfait PMR WC — 300 €','Barres de maintien et adaptation PMR')}`;
  if(eq.kind==='douche')specific=`${selectField('Type de douche',`${prefix}.subtype`,[['bac','Bac classique'],['extra_plat','Extra-plat'],['italienne','Douche italienne']],eq.subtype||'bac','c4')}${toggle(`${prefix}.mitigeur`,'Mitigeur','Prix + temps obligatoirement reliés')}${eq.mitigeur?`<div class="option-values">${numField('Prix mitigeur HT',`${prefix}.mitigeur_price_ht`,eq.mitigeur_price_ht,'c6',0,.01)}${numField('Temps mitigeur (h)',`${prefix}.mitigeur_time_h`,eq.mitigeur_time_h,'c6',0,.25)}</div>`:''}${toggle(`${prefix}.colonne`,'Colonne de douche','Prix + temps obligatoirement reliés')}${eq.colonne?`<div class="option-values">${numField('Prix colonne HT',`${prefix}.colonne_price_ht`,eq.colonne_price_ht,'c6',0,.01)}${numField('Temps colonne (h)',`${prefix}.colonne_time_h`,eq.colonne_time_h,'c6',0,.25)}</div>`:''}${toggle(`${prefix}.paroi`,'Paroi de douche','Prix + temps obligatoirement reliés')}${eq.paroi?`<div class="option-values">${numField('Prix paroi HT',`${prefix}.paroi_price_ht`,eq.paroi_price_ht,'c6',0,.01)}${numField('Temps paroi (h)',`${prefix}.paroi_time_h`,eq.paroi_time_h,'c6',0,.25)}</div>`:''}${toggle(`${prefix}.pmr_douche`,'Forfait PMR douche — 300 €','Forfait distinct du WC PMR')}${eq.subtype==='italienne'?`<div class="special-panel"><h4>Douche italienne</h4>${selectField('Prestation étanchéité / chape',`${prefix}.spec_mode`,[['','Aucune'],['spec','SPEC — 16 €/m²'],['natte','SPEC + natte — 43 €/m²'],['chape','Chape — 54 €/m²']],eq.spec_mode||'','c6')}${numField('Surface réelle (m²)',`${prefix}.spec_surface_m2`,eq.spec_surface_m2,'c6',0,.01)}</div>`:''}`;
  if(eq.kind==='baignoire')specific=`${selectField('Type de baignoire',`${prefix}.subtype`,[['droite','Droite'],['asymetrique','Asymétrique'],['angle','D’angle']],eq.subtype||'droite','c4')}${textField('Dimensions',`${prefix}.dimensions`,eq.dimensions,'c4','170 × 75')}${toggle(`${prefix}.colonne`,'Colonne / ensemble douche','Prix + temps obligatoirement reliés')}${eq.colonne?`<div class="option-values">${numField('Prix colonne HT',`${prefix}.colonne_price_ht`,eq.colonne_price_ht,'c6',0,.01)}${numField('Temps colonne (h)',`${prefix}.colonne_time_h`,eq.colonne_time_h,'c6',0,.25)}</div>`:''}`;
  if(eq.kind==='meuble_vasque')specific=`${selectField('Configuration',`${prefix}.subtype`,[['simple','Simple vasque'],['double','Double vasque']],eq.subtype||'simple','c4')}${textField('Dimensions',`${prefix}.dimensions`,eq.dimensions,'c4','ex. 120 cm')}`;
  if(eq.kind==='lave_main')specific=`${selectField('Format',`${prefix}.subtype`,[['standard','Standard'],['angle','D’angle']],eq.subtype||'standard','c4')}${toggle(`${prefix}.ec`,'Eau chaude prévue','Sinon EF uniquement')}`;
  if(eq.kind==='evier')specific=`${selectField('Matière',`${prefix}.subtype`,[['inox','Inox'],['resine','Résine'],['ceramique','Céramique'],['timbre','Timbre céramique']],eq.subtype||'inox','c4')}${selectField('Configuration',`${prefix}.config`,[['simple','Simple bac'],['double','Double bac'],['sous_plan_simple','Sous-plan simple'],['sous_plan_double','Sous-plan double']],eq.config||'simple','c4')}`;
  if(eq.kind==='element_specifique')specific=`${textField('Désignation',`${prefix}.label`,eq.label,'c4','ex. broyeur / bidet / platine')}${toggle(`${prefix}.ef`,'Alimentation EF')}${toggle(`${prefix}.ec`,'Alimentation EC')}${toggle(`${prefix}.evac`,'Évacuation')}`;
  return `<details class="accordion" open><summary>${index+1}. ${labelForKind(eq.kind)}${eq.subtype?` — ${labelSubtype(eq)}`:''}</summary><div class="inside"><div class="grid">${specific}${common}</div>${equipmentRuleNote(eq)}</div></details>`;
}
function equipmentRuleNote(eq){
  if(eq.kind==='wc')return `<div class="info compact-info">Valeurs Guillaume : WC à poser 300 € + 2 h ; suspendu + bâti 700 € + 5 h ; urinoir 300 € + 2 h ; urinoir + bâti 600 € + 5 h.</div>`;
  if(eq.kind==='lave_linge'||eq.kind==='lave_vaisselle')return `<div class="info compact-info">Annexe 1 : 83,60 € HT par unité. Le réseau associé reste EF + évacuation.</div>`;
  return `<div class="subtle">Le catalogue doit fournir le prix et le temps. Si une donnée manque, le traceur bloque la finalisation et la remonte en alerte.</div>`;
}
function findPrestationIndex(id){return (d.petits_travaux.prestations||[]).findIndex(p=>p.id===id)}
function networkEditor(net){
  return `<div class="card"><h2>Réseau automatique visible et modifiable</h2><div class="grid">${numField('Distance chauffe-eau → SDB (m)','installation.network.distance_ce_sdb',net.distance_ce_sdb,'c6',0,.1)}${numField('Distance chauffe-eau → cuisine (m)','installation.network.distance_ce_cuisine',net.distance_ce_cuisine,'c6',0,.1)}</div><div class="grid override-grid">${numField('Forcer longueur EF (ml)','installation.network.manual_ef_ml',net.manual_ef_ml,'c4',0,.1,'laisser vide = auto')}${numField('Forcer longueur EC (ml)','installation.network.manual_ec_ml',net.manual_ec_ml,'c4',0,.1,'laisser vide = auto')}${numField('Forcer évacuation (ml)','installation.network.manual_evac_ml',net.manual_evac_ml,'c4',0,.1,'laisser vide = auto')}</div><p class="subtle">Auto : EF = 8 ml par point EF ; EC = 8 ml par point EC + distances visibles ; évacuation = 1 ml par point. Une valeur forcée devient la base du devis.</p></div>`;
}
function generalOptions(){
  const f=d.options.forfaits||{};
  return `<div class="card"><h2>Gamme, complexité et TVA</h2><h3>Gamme matériel</h3><div class="gamme">${['eco','standard','premium'].map(v=>`<button class="choice ${d.options.gamme===v?'active':''}" data-gamme="${v}"><strong>${v==='eco'?'ECO':v==='standard'?'Standard':'Premium'}</strong><span>${v==='eco'?'× 0,70':v==='standard'?'× 1,00':'× 1,60'}</span></button>`).join('')}</div><p class="subtle">La gamme agit uniquement sur les sanitaires, chauffe-eau et adoucisseur.</p>
  <h3 class="subhead">Complexité du chantier</h3><div class="gamme">${[['simple','Simple × 0,80'],['moyen','Moyen × 1'],['complexe','Complexe × 1,40']].map(([v,l])=>`<button class="choice ${d.options.complexite===v?'active':''}" data-complexite="${v}"><strong>${l}</strong><span>${v==='simple'?'Accès facile':v==='moyen'?'Chantier normal':'Contraintes importantes'}</span></button>`).join('')}</div><p class="subtle"><b>Important :</b> le coefficient de complexité s’applique uniquement à la main-d’œuvre.</p>
  <h3 class="subhead">TVA</h3><div class="choice-grid">${choice('10','TVA 10 %','Bâtiment en rénovation de plus de 2 ans sans permis de construire',String(d.options.taux_tva),'data-tva')}${choice('20','TVA 20 %','Bâtiment neuf ou avec permis de construire',String(d.options.taux_tva),'data-tva')}</div></div>
  <div class="card"><h2>Production d’eau chaude / équipements</h2>${toggle('options.chauffe_eau.enabled','Ajouter un chauffe-eau','Article catalogue selon type/capacité + temps de pose')}${d.options.chauffe_eau.enabled?`<div class="grid inset">${selectField('Type','options.chauffe_eau.type',[['cumulus','Cumulus électrique'],['ballon_thermo','Ballon thermodynamique'],['instantane','Instantané'],['chaudiere','Via chaudière']],d.options.chauffe_eau.type,'c4')}${selectField('Capacité','options.chauffe_eau.capacity',[[100,'100 L'],[150,'150 L'],[200,'200 L'],[300,'300 L']],d.options.chauffe_eau.capacity,'c4')}${numField('Prix catalogue HT','options.chauffe_eau.price_ht',d.options.chauffe_eau.price_ht,'c4',0,.01)}${numField('Temps de pose (h)','options.chauffe_eau.time_h',d.options.chauffe_eau.time_h,'c4',0,.25)}</div>`:''}${toggle('options.adoucisseur.enabled','Ajouter un adoucisseur','Base 1 000 € puis gamme, catalogue prioritaire')}${d.options.adoucisseur.enabled?`<div class="grid inset">${numField('Prix HT','options.adoucisseur.price_ht',d.options.adoucisseur.price_ht,'c4',1000,.01)}${numField('Temps de pose (h)','options.adoucisseur.time_h',d.options.adoucisseur.time_h,'c4',0,.25)}</div>`:''}</div>
  <div class="card"><h2>Prestations complémentaires</h2><div class="choice-grid">${['deplacement','demolition','platrerie','raccordement','traversee','renovation','acces_difficile','boucle_ecs','pompe_relevage'].map(k=>toggle(`options.forfaits.${k}`,forfaitLabel(k),forfaitHelp(k))).join('')}</div><div class="grid inset">${numField('Forfait pose — montant artisan','options.forfaits.pose_manual',f.pose_manual,'c6',0,.01)}${numField('Forfait dépose — montant artisan','options.forfaits.depose_manual',f.depose_manual,'c6',0,.01)}</div></div>`;
}
function forfaitLabel(k){return {deplacement:'Déplacement',demolition:'Démolition',platrerie:'Petits travaux plâtrerie',raccordement:'Raccordement sur existant',traversee:'Traversée plancher / mur',renovation:'Rénovation',acces_difficile:'Accès difficile',boucle_ecs:'Boucle ECS',pompe_relevage:'Pompe de relevage'}[k]}
function forfaitHelp(k){return {deplacement:'Un seul déplacement par chantier',acces_difficile:'Forfait 300 € modifiable',boucle_ecs:'Forfait complet',pompe_relevage:'Forfait complet'}[k]||'Valeur SpeedArti modifiable dans les paramètres entreprise'}
function annexe1Editor(a){
  return `<div class="card"><h2>Annexe 1 — grille Guillaume validée</h2><p class="muted">Toutes les lignes sont intégrées. « Unité » = quantité multipliable ; « forfait » = une ligne complète.</p><div class="grid">${numField('Attente EC/EF RDC — 143 €/u','installation.annexe1.attente_rdc',a.attente_rdc)}${numField('Attente EC/EF R+1 — 143 €/u','installation.annexe1.attente_r1',a.attente_r1)}${numField('Robinet extérieur — 83,60 €/u','installation.annexe1.robinet_exterieur',a.robinet_exterieur)}${numField('Limiteur de pression — 86,50 €/u','installation.annexe1.limiteur_pression',a.limiteur_pression)}</div><div class="choice-grid annexe-switches">${toggle('installation.annexe1.arret_general',"Alimentation + robinet d’arrêt général — 121 €")}${toggle('installation.annexe1.raccordement_exterieur','Raccordement extérieur eau — 72 €')}${toggle('installation.annexe1.ventilation_wc','Ventilation haute WC — 107 €')}${toggle('installation.annexe1.ventilation_fosse','Ventilation fosse + extracteur — 186 €')}${toggle('installation.annexe1.forfait_etage','Forfait étage canalisation + alimentation — 428 €')}${toggle('installation.annexe1.aleas','Aléas — 4 %','Appliqués au sous-total HT avant TVA dans cette version')}</div></div>`;
}
function settingsEditor(){
  const a=API.ANNEXE1_DEFAULTS||{};const f=API.FORFAITS_DEFAULTS||{};
  return `<details class="accordion"><summary>⚙️ Valeurs SpeedArti modifiables — simulation paramètres entreprise</summary><div class="inside"><p class="muted">Ces champs montrent le principe demandé par Guillaume : valeurs par défaut, jamais figées définitivement dans le code.</p><div class="grid">${Object.entries(a).filter(([k,v])=>v.mode!=='pourcentage').map(([k,v])=>numField(v.label,`settings.annexe1.${k}`,d.settings.annexe1[k]??v.price,'c4',0,.01)).join('')}${Object.entries(f).map(([k,v])=>numField(v.label,`settings.forfaits.${k}`,d.settings.forfaits[k]??v.price,'c4',0,.01)).join('')}</div></div></details>`;
}

async function renderResults(){content.innerHTML=head('Étape 5','Résultats et contrôle','Le résultat montre le chiffrage, le réseau, les heures-homme et les données encore manquantes avant devis.')+`<div id="resultHost"><div class="muted">Calcul en cours…</div></div>`;await run(false)}
async function run(force=false){
  try{const r=API.calculate(d);d._lastResult=r;save(false);if(force&&step!==4){step=4;render();return}if(step===4)showResult(r);else flash(`Calcul OK : ${eur(r.totaux.total_ttc)} TTC`,'ok')}
  catch(e){if(force&&step!==4){step=4;render();setTimeout(()=>showError(e),0);return}showError(e)}
}
function showError(e){const h=q('#resultHost')||content;h.innerHTML=`<div class="alert err"><b>Calcul bloqué :</b> ${esc(e.message||String(e))}</div>`}
function showResult(r){
  const h=q('#resultHost');if(!h)return;const det=r.surfaces.detail_par_face||{};
  h.innerHTML=`<div class="status-banner ${r.finalisation_bloquee?'blocked':'ready'}"><strong>${r.finalisation_bloquee?'⚠️ Finalisation bloquée':'✅ Chiffrage contrôlé'}</strong><span>${r.finalisation_bloquee?'Une ou plusieurs données catalogue / temps restent à compléter.':'Aucun blocage critique détecté dans la démo.'}</span></div>
  ${(r.recommandations||[]).map(x=>`<div class="alert info-alert">ℹ️ ${esc(x)}</div>`).join('')}${(r.alertes||[]).map(x=>`<div class="alert warn">⚠️ ${esc(x)}</div>`).join('')}
  <div class="metrics"><div class="metric"><span>Durée chantier</span><strong>${fmt(r.main_oeuvre.temps_estime_heures)} h</strong></div><div class="metric"><span>Heures-homme</span><strong>${fmt(r.main_oeuvre.heures_homme)} h</strong></div><div class="metric"><span>Matériaux / forfaits HT</span><strong>${eur(r.totaux.materiaux_ht)}</strong></div><div class="metric"><span>Total TTC</span><strong>${eur(r.totaux.total_ttc)}</strong></div></div>
  ${Object.keys(det).length?`<div class="card"><h2>Réseau calculé</h2><div class="network-metrics">${Object.entries(det).map(([k,v])=>`<div><span>${esc(k.replaceAll('_',' '))}</span><strong>${fmt(v)}</strong></div>`).join('')}</div></div>`:''}
  <div class="card"><h2>Détail des lignes</h2><div class="table-wrap"><table class="table"><thead><tr><th>Désignation</th><th>Catégorie</th><th>Qté</th><th>Unité</th><th>PU HT</th><th>Total HT</th><th>Source</th></tr></thead><tbody>${r.materiaux.map(m=>`<tr><td>${esc(m.nom)}</td><td>${esc(m.categorie)}</td><td>${fmt(m.quantite_finale)}</td><td>${esc(m.unite)}</td><td>${eur(m.prix_unitaire_ht)}</td><td>${eur(m.total_ht)}</td><td>${esc(m.source||'—')}</td></tr>`).join('')}</tbody></table></div></div>
  <div class="card"><h2>Main-d’œuvre et totaux</h2><div class="summary-lines"><div><span>Coefficient complexité</span><b>× ${fmt(r.main_oeuvre.coefficient_complexite)}</b></div><div><span>Main-d’œuvre HT</span><b>${eur(r.totaux.main_oeuvre_ht)}</b></div><div><span>Total HT</span><b>${eur(r.totaux.total_ht)}</b></div><div><span>TVA ${fmt(r.totaux.taux_tva)} %</span><b>${eur(r.totaux.tva)}</b></div><div class="grand"><span>Total TTC</span><b>${eur(r.totaux.total_ttc)}</b></div></div></div>`;
}

function clickHandler(e){
  const el=e.target.closest('[data-choice],[data-step],[data-add-equipment],[data-remove-equipment],[data-edit-equipment],[data-add-prestation],[data-remove-prestation],[data-create-prestation-equipment],[data-edit-prestation-equipment],[data-gamme],[data-complexite],[data-tva]');
  if(!el)return;
  if(el.dataset.choice!==undefined){d.options.type_projet=el.dataset.choice;save();render();return}
  if(el.dataset.addEquipment){d.installation.equipments.push(newEquipment(el.dataset.addEquipment));save();render();return}
  if(el.dataset.removeEquipment){d.installation.equipments=d.installation.equipments.filter(x=>x.id!==el.dataset.removeEquipment);save();render();return}
  if(el.dataset.editEquipment){step=3;render();setTimeout(()=>document.querySelector(`[data-equipment-anchor="${el.dataset.editEquipment}"]`)?.scrollIntoView({behavior:'smooth'}),0);return}
  if(el.hasAttribute('data-add-prestation')){d.petits_travaux.prestations.push({id:uid('pt'),type:'',duration_h:2});save();render();return}
  if(el.dataset.removePrestation){d.petits_travaux.prestations=d.petits_travaux.prestations.filter(x=>x.id!==el.dataset.removePrestation);save();render();return}
  if(el.dataset.createPrestationEquipment){const p=d.petits_travaux.prestations.find(x=>x.id===el.dataset.createPrestationEquipment);if(p){p.equipment=newEquipment(el.dataset.equipmentKind||'element_specifique');save();render()}return}
  if(el.dataset.editPrestationEquipment){step=3;render();return}
  if(el.dataset.gamme){d.options.gamme=el.dataset.gamme;save();render();return}
  if(el.dataset.complexite){d.options.complexite=el.dataset.complexite;save();render();return}
  if(el.dataset.tva){d.options.taux_tva=+el.dataset.tva;save();render();return}
}
function newEquipment(kind){
  const eq={id:uid('eq'),kind,subtype:''};
  if(kind==='wc'){eq.subtype='poser';eq.price_ht=300;eq.time_h=2}
  if(kind==='douche')eq.subtype='bac';
  if(kind==='baignoire')eq.subtype='droite';
  if(kind==='meuble_vasque')eq.subtype='simple';
  if(kind==='lave_main')eq.subtype='standard';
  if(kind==='evier')eq.subtype='inox';
  if(kind==='lave_linge'||kind==='lave_vaisselle'){eq.price_ht=83.6;eq.time_h=0}
  return eq;
}
function inputHandler(e){
  const t=e.target;if(!t.dataset.path)return;let v;
  if(t.type==='checkbox')v=t.checked;else if(t.type==='number')v=t.value===''?undefined:+t.value;else v=t.value;
  set(d,t.dataset.path,v);
  // When changing a WC subtype, refresh Guillaume defaults unless artisan already changed them deliberately after selection.
  if(/\.subtype$/.test(t.dataset.path)&&t.dataset.path.includes('equipment')){const eq=get(d,t.dataset.path.replace(/\.subtype$/,''));if(eq?.kind==='wc'){const def={poser:[300,2],suspendu:[700,5],urinoir:[300,2],urinoir_bati:[600,5]}[eq.subtype];if(def){eq.price_ht=def[0];eq.time_h=def[1]}}}
  save(false);
  if(t.type==='checkbox'||t.tagName==='SELECT')render();
}
function set(o,path,v){const a=path.split('.');let x=o;for(let i=0;i<a.length-1;i++){const k=a[i];const next=a[i+1];if(x[k]===undefined)x[k]=/^\d+$/.test(next)?[]:{};x=x[k]}x[a.at(-1)]=v}
function get(o,path){return path.split('.').reduce((x,k)=>x?.[k],o)}
function fmt(n){return Number(n||0).toLocaleString('fr-FR',{maximumFractionDigits:2})}
function eur(n){return Number(n||0).toLocaleString('fr-FR',{style:'currency',currency:'EUR'})}
function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function flash(msg,type){const z=document.createElement('div');z.className=`alert ${type==='ok'?'ok':'warn'}`;z.style.position='fixed';z.style.right='18px';z.style.bottom='18px';z.style.zIndex='100';z.textContent=msg;document.body.appendChild(z);setTimeout(()=>z.remove(),1800)}
