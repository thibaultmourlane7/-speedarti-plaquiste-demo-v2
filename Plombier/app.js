const API=window.SpeedArtiPlombierCurrent;
if(!API) throw new Error('Moteur Plombier non chargé');
const CAT=window.SpeedArtiCatalogueService;
if(!CAT) throw new Error('Catalogue Téréva Plombier non chargé');
const CATALOGUE_VERSION='Téréva 2026 — prix -20 %';

const steps=[
  ['Base chantier','Dimensionnement & distances'],
  ['Équipements & réseau','Sanitaires & quantités'],
  ['Configuration & options','Réglages facultatifs'],
  ['Résultats','Contrôle avant devis']
];
const storeKey='speedarti-plombier-demo-v061';
const legacyStoreKeys=['speedarti-plombier-demo-v060','speedarti-plombier-demo-v052','speedarti-plombier-demo-v051','speedarti-plombier-demo-v040','speedarti-plombier-demo-v031'];
let step=0;
let d=load()||initial();
const q=s=>document.querySelector(s);
const content=q('#content');
const catalogueHost=document.createElement('div');catalogueHost.id='catalogueHost';document.body.appendChild(catalogueHost);
let catalogueUi={open:false,target:'',pricePath:'',context:'all',label:'Catalogue Plombier',q:'',brand:'',type:'',finish:'',mode:'replace'};
let catalogueRenderTimer=null;
let activeEquipmentId=null;

q('#prev').onclick=()=>go(step-1);
q('#next').onclick=()=>step===3?run():go(step+1);
q('#calcBtn').onclick=()=>run(true);
q('#saveBtn').onclick=()=>save(true);
q('#resetBtn').onclick=()=>{if(confirm('Réinitialiser le brouillon Plombier ?')){[storeKey,...legacyStoreKeys].forEach(k=>localStorage.removeItem(k));d=initial();step=0;render()}};
q('#steps').addEventListener('click',e=>{const b=e.target.closest('[data-step]');if(b)go(+b.dataset.step)});
content.addEventListener('click',clickHandler);
content.addEventListener('change',inputHandler);
content.addEventListener('input',inputHandler);
document.addEventListener('click',catalogueClickHandler);
document.addEventListener('input',catalogueInputHandler);
document.addEventListener('change',catalogueInputHandler);
render();

function initial(){
  return {
    metier:'plombier',
    nom_calcul:'Chiffrage Plombier',
    options:{
      type_projet:'installation_complete',gamme:'standard',complexite:'moyen',taux_horaire:52,nb_ouvriers:1,taux_tva:20,type_tuyau:'per',
      forfaits:{},chauffe_eau:{enabled:false,type:'cumulus',capacity:200},adoucisseur:{enabled:false,price_ht:1000},articles_libres:[]
    },
    installation:{
      surface_maison_m2:'',equipments:[],
      zones:{rdc_sans:false,r1_sans:false,rdc_avec:false,r1_avec:false},
      network:{distance_ce_sdb:5,distance_ce_cuisine:8,attente_rdc:0,attente_r1:0,ef_only:0,ec_only:0,ef_ec:0,evac_points:0,platines_ef:0,platines_ec:0,platines_ef_ec:0,platines_evac:0},
      annexe1:{}
    },
    petits_travaux:{prestations:[]},
    settings:{annexe1:{},forfaits:{},services:{}}
  };
}
function save(show=false){localStorage.setItem(storeKey,JSON.stringify(d));if(show)flash('Brouillon enregistré','ok')}
function migrateLegacyDraft(val){
  if(!val||typeof val!=='object')return val;
  const ps=val.petits_travaux?.prestations||[];ps.forEach(p=>{if(p?.type==='chauffe_eau'&&p.ce_type!=='reparation')delete p.duration_h});
  val.installation=val.installation||{};val.installation.network=val.installation.network||{};val.installation.annexe1=val.installation.annexe1||{};val.settings=val.settings||{};val.settings.services=val.settings.services||{};
  if(!val.installation.zones){val.installation.zones={rdc_sans:Number(val.installation.annexe1.attente_rdc||0)>0,r1_sans:Number(val.installation.annexe1.attente_r1||0)>0,rdc_avec:false,r1_avec:false}}
  const oldEqs=val.installation.equipments||[];const onlyZone=val.installation.zones.rdc_avec&&!val.installation.zones.r1_avec?'rdc':val.installation.zones.r1_avec&&!val.installation.zones.rdc_avec?'r1':'';if(onlyZone)oldEqs.forEach(eq=>{if(!eq.zone)eq.zone=onlyZone});
  if(!val.options?.type_projet){val.options=val.options||{};val.options.type_projet='installation_complete'}
  if(/Guillaume/i.test(val.nom_calcul||''))val.nom_calcul='Chiffrage Plombier';
  return val
}
function load(){for(const k of [storeKey,...legacyStoreKeys]){try{const raw=localStorage.getItem(k);if(raw){let val=JSON.parse(raw);if(k!==storeKey){val=migrateLegacyDraft(val);localStorage.setItem(storeKey,JSON.stringify(val))}return val}}catch{}}return null}
function uid(prefix='id'){return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,7)}`}
function go(n){const next=Math.max(0,Math.min(3,n));if(next>step&&!canLeave(step)){flash('Complète les informations obligatoires avant de continuer','warn');return}step=next;render();window.scrollTo({top:0,behavior:'smooth'})}
function canLeave(i){
  if(!d.nom_calcul)return false;
  if(i===1&&d.options.type_projet==='petits_travaux')return (d.petits_travaux.prestations||[]).length>0;
  return true
}
function render(){
  q('#steps').innerHTML=steps.map((s,i)=>`<button class="step ${i===step?'active':i<step?'done':''}" data-step="${i}"><b>${i+1}. ${s[0]}</b><span>${s[1]}</span></button>`).join('');
  q('#prev').style.visibility=step?'visible':'hidden';
  q('#next').textContent=step===3?'Recalculer':'Suivant →';
  [renderBase,renderEquipmentNetwork,renderConfiguration,renderResults][step]();
  renderCatalogueModal();
}
function head(k,t,p){return `<div class="head"><span class="eyebrow">${k}</span><h1>${t}</h1><p>${p}</p></div>`}
function choice(value,title,desc,current,attr='data-choice'){return `<button class="choice ${current===value?'active':''}" ${attr}="${value}"><strong>${title}</strong><span>${desc}</span></button>`}
function numField(label,path,value,cl='c4',min=0,step=1,placeholder=''){return `<div class="field ${cl}"><label>${label}</label><input class="input" type="number" min="${min}" step="${step}" placeholder="${placeholder}" data-path="${path}" value="${value??''}"></div>`}
function textField(label,path,value,cl='c6',placeholder=''){return `<div class="field ${cl}"><label>${label}</label><input class="input" data-path="${path}" value="${esc(value||'')}" placeholder="${placeholder}"></div>`}
function selectField(label,path,opts,value,cl='c6'){return `<div class="field ${cl}"><label>${label}</label><select class="select" data-path="${path}">${opts.map(([v,l])=>`<option value="${v}" ${String(v)===String(value)?'selected':''}>${l}</option>`).join('')}</select></div>`}
function toggle(path,label,help=''){return `<label class="switch-row"><input class="switch" type="checkbox" data-path="${path}" ${get(d,path)?'checked':''}><span><b>${label}</b>${help?`<small>${help}</small>`:''}</span></label>`}
function catalogueContext(eq,slot='main'){
  if(slot==='mitigeur')return'mitigeur_douche';if(slot==='colonne')return'colonne_douche';if(slot==='paroi')return'paroi_douche';
  if(!eq)return'all';
  if(eq.kind==='wc'){if(eq.subtype==='suspendu')return'wc_suspendu_main';if(eq.subtype==='urinoir'||eq.subtype==='urinoir_bati')return'urinoir';return'wc_poser'}
  return {douche:'receveur',baignoire:'baignoire',lavabo:'lavabo',meuble_vasque:'meuble_vasque',lave_main:'lave_main',evier:'evier',element_specifique:'all'}[eq.kind]||'all';
}
function cataloguePicker(target,pricePath,context,label,sel,compact=false,prefill=''){
  const current=sel||get(d,target);const has=!!current?.code;
  return `<div class="catalogue-picker ${compact?'compact-picker':''}">${has?`<div class="catalogue-selected"><div><span class="catalogue-badge">${esc(current.catalogue||CATALOGUE_VERSION)}</span><strong>${esc(current.marque||'')} — ${esc(current.produit||'Référence catalogue')}</strong><small>${current.variante?esc(current.variante):''}${current.finition?` · ${esc(current.finition)}`:''}</small><small>Code Téréva ${esc(current.code)} · ${current.prix!=null?eur(current.prix):'prix manquant'}${current.price_overridden?' · prix manuel actif':''}</small></div><div class="row"><button type="button" class="btn secondary compact" data-open-catalogue data-catalogue-target="${esc(target)}" data-catalogue-price-path="${esc(pricePath||'')}" data-catalogue-context="${esc(context||'all')}" data-catalogue-label="${esc(label)}" data-catalogue-q="${esc(prefill)}">Changer</button><button type="button" class="btn ghost compact" data-clear-catalogue="${esc(target)}" data-catalogue-price-path="${esc(pricePath||'')}">Retirer</button></div></div>`:`<button type="button" class="btn catalogue-search-btn" data-open-catalogue data-catalogue-target="${esc(target)}" data-catalogue-price-path="${esc(pricePath||'')}" data-catalogue-context="${esc(context||'all')}" data-catalogue-label="${esc(label)}" data-catalogue-q="${esc(prefill)}">🔎 Rechercher ${esc(label)} dans Téréva</button>`}</div>`;
}
function catalogueGlobalPanel(){
  const arr=d.options.articles_libres||[];
  return `<div class="card catalogue-global"><div class="row between"><div><h2>Catalogue Téréva 2026</h2><p class="muted">${fmt(CAT.count)} références — prix de la base diminués de 20 %. Recherche par produit, marque, finition, référence fabricant ou code Téréva.</p></div><button type="button" class="btn primary" data-open-catalogue data-catalogue-target="options.articles_libres" data-catalogue-context="all" data-catalogue-label="un article" data-catalogue-mode="append">🔎 Ouvrir le catalogue</button></div>${arr.length?`<div class="free-articles">${arr.map((x,i)=>`<div class="mini-card"><div><strong>${esc(x.catalogue?.marque||'')} — ${esc(x.catalogue?.produit||`Référence Téréva ${x.catalogue?.code||''}`)}</strong><span>Code ${esc(x.catalogue?.code||'')} · ${x.catalogue?.prix==null?'tarif catalogue indisponible — choisir une autre référence ou mettre à jour le catalogue':eur(x.catalogue?.prix)}</span></div><div class="row">${numField('Qté',`options.articles_libres.${i}.quantite`,x.quantite||1,'mini-field',0,1)}<button type="button" class="btn danger compact" data-remove-free-article="${i}">Supprimer</button></div></div>`).join('')}</div>`:''}</div>`;
}

function equipmentImpact(eq){const p=profile(eq);const arr=[];if(p.ef)arr.push('EF');if(p.ec)arr.push('EC');if(p.evac)arr.push('évac.');return arr.length?`Impact réseau : ${arr.join(' + ')}`:'Réseau défini dans la configuration'}
function profile(eq){if(eq.kind==='element_specifique')return{ef:!!eq.ef,ec:!!eq.ec,evac:!!eq.evac};const hot=['lavabo','meuble_vasque','douche','baignoire','evier'];const ef=['lavabo','meuble_vasque','douche','baignoire','evier','wc','lave_main','lave_linge','lave_vaisselle'];const ev=['lavabo','meuble_vasque','douche','baignoire','evier','wc','lave_main','lave_linge','lave_vaisselle'];return{ef:ef.includes(eq.kind),ec:hot.includes(eq.kind)||(eq.kind==='lave_main'&&!!eq.ec),evac:ev.includes(eq.kind)}}
function labelSubtype(eq){const m={poser:'à poser',suspendu:'suspendu',urinoir:'urinoir',urinoir_bati:'urinoir + bâti',bac:'bac classique',extra_plat:'extra-plat',italienne:'italienne',droite:'droite',asymetrique:'asymétrique',angle:'angle',simple:'simple',double:'double',inox:'inox',resine:'résine',ceramique:'céramique',timbre:'timbre céramique'};return m[eq.subtype]||eq.subtype}


function projectSelector(){
  return `<div class="project-switch"><button class="choice ${d.options.type_projet==='installation_complete'?'active':''}" data-choice="installation_complete"><strong>Installation complète</strong><span>Réseau seul ou avec sanitaires</span></button><button class="choice ${d.options.type_projet==='petits_travaux'?'active':''}" data-choice="petits_travaux"><strong>Petits travaux</strong><span>Dépannage, remplacement, chauffe-eau…</span></button></div>`;
}
function renderBase(){
  if(d.options.type_projet==='petits_travaux'){
    content.innerHTML=head('Étape 1','Base chantier','Renseigne les informations générales du chantier avant d’ajouter les prestations.')+projectSelector()+
      `<div class="card"><h2>Dimensionnement du chantier</h2><div class="grid">${textField('Nom du calcul','nom_calcul',d.nom_calcul,'c8')}${numField('Nombre d’ouvriers','options.nb_ouvriers',d.options.nb_ouvriers,'c4',1,1)}</div></div>`;
    return;
  }
  renderInstallationBase();
}
function zoneCard(path,badge,title,desc){const on=!!get(d,path);return `<label class="zone-card ${on?'selected':''}"><input type="checkbox" data-path="${path}" ${on?'checked':''}><span class="zone-icon">${badge}</span><span><strong>${title}</strong><small>${desc}</small></span><span class="zone-check">${on?'✓':'+'}</span></label>`}
function equipmentIcon(kind){
  const common='viewBox="0 0 48 48" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"';
  const icons={
    wc:`<svg ${common}><path d="M13 8h18v9c0 6-4 10-9 10h-3c-5 0-8-4-8-9v-5h20"/><path d="M18 27v8h15"/><path d="M15 40h20"/></svg>`,
    douche:`<svg ${common}><path d="M10 37h28"/><path d="M14 37V17a10 10 0 0 1 20 0"/><path d="M28 18h10"/><path d="M31 22l-2 4m7-4-2 4m7-4-2 4"/></svg>`,
    baignoire:`<svg ${common}><path d="M8 24h32v6a8 8 0 0 1-8 8H16a8 8 0 0 1-8-8z"/><path d="M12 24V13a4 4 0 0 1 8 0v2"/><path d="M14 38l-2 4m22-4 2 4"/></svg>`,
    lavabo:`<svg ${common}><path d="M10 22h28c0 8-5 13-14 13S10 30 10 22z"/><path d="M24 11v11"/><path d="M20 11h8"/><path d="M24 35v7"/></svg>`,
    meuble_vasque:`<svg ${common}><path d="M10 20h28v22H10z"/><path d="M13 20c1 8 21 8 22 0"/><path d="M24 9v11"/><path d="M20 9h8"/><path d="M18 31h12"/></svg>`,
    lave_main:`<svg ${common}><path d="M12 22h24c0 7-4 11-12 11s-12-4-12-11z"/><path d="M24 12v10"/><path d="M20 12h8"/><path d="M24 33v9"/></svg>`,
    evier:`<svg ${common}><rect x="8" y="17" width="32" height="19" rx="3"/><path d="M24 9v8"/><path d="M20 9h8"/><path d="M24 25v4"/></svg>`,
    lave_linge:`<svg ${common}><rect x="10" y="6" width="28" height="36" rx="3"/><circle cx="24" cy="26" r="9"/><circle cx="17" cy="12" r="1"/><path d="M23 12h9"/></svg>`,
    lave_vaisselle:`<svg ${common}><rect x="10" y="6" width="28" height="36" rx="3"/><path d="M10 17h28"/><circle cx="16" cy="12" r="1"/><path d="M21 12h11"/><path d="M16 30h16m-12-6 4 12m4-12-4 12"/></svg>`,
    element_specifique:`<svg ${common}><path d="M29 9a8 8 0 0 0-9 10L9 30a4 4 0 0 0 6 6l11-11a8 8 0 0 0 10-9l-6 6-5-5z"/></svg>`
  };
  return icons[kind]||icons.element_specifique
}
function equipmentPalette(zone=''){const kinds=[['wc','WC'],['douche','Douche'],['baignoire','Baignoire'],['lavabo','Lavabo / vasque'],['meuble_vasque','Meuble vasque'],['lave_main','Lave-main'],['evier','Évier'],['lave_linge','Lave-linge'],['lave_vaisselle','Lave-vaisselle'],['element_specifique','Élément spécifique']];return `<div class="sanitary-palette">${kinds.map(([k,l])=>`<button class="sanitary-tile" data-add-equipment="${k}" data-zone="${zone}"><span class="sanitary-icon">${equipmentIcon(k)}</span><strong>${l}</strong></button>`).join('')}</div>`}
function instanceNumber(eqs,index){const kind=eqs[index].kind;return eqs.slice(0,index+1).filter(x=>x.kind===kind).length}
function selectedCart(eqs,configurable=false){
  return `<aside class="selection-cart"><div class="cart-head"><div><span class="eyebrow">Sélection chantier</span><h3>Éléments sélectionnés</h3></div><span class="pill">${eqs.length}</span></div>${eqs.length?`<div class="cart-items">${eqs.map((eq,i)=>{const n=instanceNumber(eqs,i);const active=activeEquipmentId===eq.id;const zone=eq.zone==='r1'?'R+1':eq.zone==='rdc'?'RDC':'';return `<div class="cart-item ${active?'active':''}"><span class="cart-icon">${equipmentIcon(eq.kind)}</span><div><strong>${esc(labelForKind(eq.kind))} ${n}</strong>${zone?`<small class="cart-zone">${zone}</small>`:''}</div><div class="cart-actions">${configurable?`<button class="btn secondary compact" data-configure-equipment="${eq.id}">Configurer</button>`:''}<button class="icon-delete" data-remove-equipment="${eq.id}" aria-label="Supprimer ${esc(labelForKind(eq.kind))} ${n}">×</button></div></div>`}).join('')}</div>`:`<div class="cart-empty">Aucun sanitaire sélectionné.</div>`}</aside>`;
}
function autoField(label,path,manual,auto,unit,cl='c4',step=.1){const value=manual!==undefined&&manual!==null&&manual!==''?manual:auto;const modified=manual!==undefined&&manual!==null&&manual!=='';return `<div class="field ${cl} auto-field"><label>${label}</label><div class="input-with-unit"><input class="input" type="number" min="0" step="${step}" data-path="${path}" value="${value??0}"><span>${unit}</span></div><small>${modified?'Valeur modifiée par l’artisan':`Proposition automatique : ${fmt(auto)} ${unit}`}</small></div>`}
function renderNetworkPreview(){
  const net=d.installation.network||{};const p=API.previewNetwork(d);
  return `<div class="card network-live"><div class="row between wrap"><div><h2>Quantités réseau proposées</h2><p class="muted">SpeedArti calcule les tuyaux et accessoires à partir des zones, des distances et de chaque sanitaire. Toutes les quantités restent modifiables par l’artisan.</p></div><span class="pill ok-pill">Calcul automatique</span></div>
  <div class="grid">${autoField('Tuyau eau froide','installation.network.manual_ef_ml',net.manual_ef_ml,p.autoEF,'ml')}${autoField('Tuyau eau chaude','installation.network.manual_ec_ml',net.manual_ec_ml,p.autoEC,'ml')}${autoField('Évacuation','installation.network.manual_evac_ml',net.manual_evac_ml,p.autoEvac,'ml')}</div>
  <h3 class="subhead">Platines, raccords et vannes</h3><div class="grid">${autoField('Platines EF','installation.network.manual_platine_ef_qty',net.manual_platine_ef_qty,p.autoPlatineEf,'u','c3',1)}${autoField('Platines EC','installation.network.manual_platine_ec_qty',net.manual_platine_ec_qty,p.autoPlatineEc,'u','c3',1)}${autoField('Platines EF + EC','installation.network.manual_platine_ef_ec_qty',net.manual_platine_ef_ec_qty,p.autoPlatineEfEc,'u','c3',1)}${autoField('Raccordements évacuation','installation.network.manual_platine_evac_qty',net.manual_platine_evac_qty,p.autoPlatineEvac,'u','c3',1)}${autoField('Raccords','installation.network.manual_fitting_qty',net.manual_fitting_qty,p.autoFittings,'u','c6',1)}${autoField("Robinets d’arrêt / vannes",'installation.network.manual_stop_valve_qty',net.manual_stop_valve_qty,p.autoStopValves,'u','c6',1)}</div>
  <div class="grid"><div class="field c6"><label>Temps de pose réseau total (h)</label><input class="input" type="number" min="0" step=".25" data-path="installation.network.time_h" value="${net.time_h??''}" placeholder="Temps artisan"></div></div></div>`;
}
function renderInstallationBase(){
  const z=d.installation.zones||{};
  const dim=`<div class="card"><h2>1. Dimensionnement du chantier</h2><div class="grid">${textField('Nom du calcul','nom_calcul',d.nom_calcul,'c6')}${numField('Surface du chantier (m²)','installation.surface_maison_m2',d.installation.surface_maison_m2,'c3',0,.1,'ex. 120')}${selectField('Type de canalisation','options.type_tuyau',[['per','PER'],['multicouche','Multicouche'],['cuivre','Cuivre']],d.options.type_tuyau,'c3')}${numField('Ouvriers','options.nb_ouvriers',d.options.nb_ouvriers,'c3',1,1)}</div></div>`;
  const distances=`<div class="card distance-card"><div class="row between wrap"><div><h2>2. Distances depuis le chauffe-eau</h2><p class="muted">Ces longueurs servent directement à la proposition automatique du réseau d’eau chaude.</p></div><span class="pill">Base réseau EC</span></div><div class="grid">${numField('Chauffe-eau → salle de bains (m)','installation.network.distance_ce_sdb',d.installation.network.distance_ce_sdb,'c6',0,.1)}${numField('Chauffe-eau → cuisine (m)','installation.network.distance_ce_cuisine',d.installation.network.distance_ce_cuisine,'c6',0,.1)}</div></div>`;
  const zones=`<div class="card"><h2>3. Type d’installation</h2><p class="muted">Chaque case est indépendante : tu peux combiner plusieurs zones sur le même chantier.</p><div class="zone-grid">${zoneCard('installation.zones.rdc_sans','RDC','RDC — Sans sanitaire','Eau froide + eau chaude + évacuation encastrable')}${zoneCard('installation.zones.r1_sans','R+1','R+1 — Sans sanitaire','Eau froide + eau chaude + évacuation encastrable')}${zoneCard('installation.zones.rdc_avec','RDC','RDC — Avec sanitaires','Eau froide + eau chaude + évacuation + sanitaires')}${zoneCard('installation.zones.r1_avec','R+1','R+1 — Avec sanitaires','Eau froide + eau chaude + évacuation + sanitaires')}</div></div>`;
  content.innerHTML=head('Étape 1','Base chantier','Commence par les dimensions, les distances du chauffe-eau et les zones du chantier.')+projectSelector()+dim+distances+zones;
}
function renderEquipmentNetwork(){
  if(d.options.type_projet==='petits_travaux'){
    const ps=d.petits_travaux.prestations||[];
    content.innerHTML=head('Étape 2','Prestations','Ajoute les prestations indépendantes du chantier.')+
      `<div class="card"><div class="row between"><div><h2>Prestations</h2><p class="muted">Chaque prestation reste indépendante.</p></div><button class="btn primary" data-add-prestation>+ Ajouter une prestation</button></div><div class="equipment-list">${ps.length?ps.map((p,i)=>prestationCard(p,i)).join(''):`<div class="empty-state">Ajoute la première prestation pour commencer.</div>`}</div></div>`;
    return;
  }
  const eqs=d.installation.equipments||[];const z=d.installation.zones||{};const hasRdc=!!z.rdc_avec,hasR1=!!z.r1_avec,hasSanitaryZone=hasRdc||hasR1;
  let palette='';
  if(hasRdc&&hasR1)palette=`<div class="sanitary-zone-section"><h3>Sanitaires — RDC</h3>${equipmentPalette('rdc')}</div><div class="sanitary-zone-section"><h3>Sanitaires — R+1</h3>${equipmentPalette('r1')}</div>`;
  else if(hasRdc)palette=equipmentPalette('rdc');
  else if(hasR1)palette=equipmentPalette('r1');
  else palette=`<div class="empty-state">Le chantier est actuellement « sans sanitaire ». Le réseau reste calculable, mais aucun sanitaire n’est à ajouter ni à configurer.</div>`;
  const sanitaires=`<div class="card"><div class="row between wrap"><div><h2>Sanitaires du chantier</h2><p class="muted">Chaque clic ajoute un sanitaire indépendant. Deux clics sur WC créent WC 1 et WC 2.</p></div><span class="pill">${eqs.length} sélectionné(s)</span></div>${palette}</div>`;
  content.innerHTML=head('Étape 2','Équipements & réseau','Ajoute les sanitaires lorsqu’il y en a, puis contrôle les quantités de réseau proposées automatiquement.')+
    `<div class="layout-with-cart"><div class="layout-main">${sanitaires}${renderNetworkPreview()}</div>${eqs.length?selectedCart(eqs,false):''}</div>`;
}
function renderConfiguration(){
  if(d.options.type_projet==='petits_travaux'){renderSmallOptions();return}
  const eqs=d.installation.equipments||[];const z=d.installation.zones||{};const hasSanitaryZone=!!(z.rdc_avec||z.r1_avec);const configurable=hasSanitaryZone&&eqs.length>0;
  if(configurable&&!eqs.some(x=>x.id===activeEquipmentId))activeEquipmentId=eqs[0].id;
  if(!configurable)activeEquipmentId=null;
  const active=configurable?eqs.find(x=>x.id===activeEquipmentId):null;const idx=active?eqs.findIndex(x=>x.id===active.id):-1;
  const config=active?`<div class="card equipment-config-focus"><div class="row between wrap"><div><span class="eyebrow">Configuration sanitaire</span><h2><span class="title-icon">${equipmentIcon(active.kind)}</span>${esc(labelForKind(active.kind))} ${instanceNumber(eqs,idx)}</h2><p class="muted">Si l’artisan ne modifie rien, les réglages de base de cet élément sont conservés.</p></div></div>${equipmentEditor(active,idx,'installation')}</div>`:'';
  const emptyConfig=configurable?'':`<div class="card"><h2>Configuration sanitaire</h2><div class="empty-state">${hasSanitaryZone?'Aucun sanitaire sélectionné : aucune configuration d’élément n’est affichée.':'Installation sans sanitaire : aucune configuration sanitaire n’est nécessaire.'}</div></div>`;
  content.innerHTML=head('Étape 3','Configuration & options','La configuration des sanitaires et les options du chantier sont réunies sur cette page.')+
    `<div class="layout-with-cart"><div class="layout-main">${config||emptyConfig}${artisanOptions()}</div>${configurable?selectedCart(eqs,true):''}</div>`;
}
function artisanOptions(){
  const a=d.installation.annexe1||{};const f=d.options.forfaits||{};
  const gamme=`<div class="card"><h2>Réglages du chiffrage</h2><h3>Gamme matériel</h3><div class="gamme">${['eco','standard','premium'].map(v=>`<button class="choice ${d.options.gamme===v?'active':''}" data-gamme="${v}"><strong>${v==='eco'?'ECO':v==='standard'?'Standard':'Premium'}</strong></button>`).join('')}</div><h3 class="subhead">Complexité du chantier</h3><div class="gamme">${[['simple','Simple × 0,80'],['moyen','Moyen × 1'],['complexe','Complexe × 1,40']].map(([v,l])=>`<button class="choice ${d.options.complexite===v?'active':''}" data-complexite="${v}"><strong>${l}</strong></button>`).join('')}</div><p class="subtle">La complexité agit uniquement sur la main-d’œuvre.</p><h3 class="subhead">TVA</h3><div class="choice-grid">${choice('10','TVA 10 %','Rénovation éligible',String(d.options.taux_tva),'data-tva')}${choice('20','TVA 20 %','Neuf / cas standard',String(d.options.taux_tva),'data-tva')}</div></div>`;
  const eauChaude=`<div class="card"><h2>Équipements complémentaires</h2>${toggle('options.chauffe_eau.enabled','Ajouter un chauffe-eau','Sélection du modèle dans le catalogue')}${d.options.chauffe_eau.enabled?`<div class="inset">${cataloguePicker('options.chauffe_eau.catalogue','options.chauffe_eau.price_ht','chauffe_eau','un chauffe-eau',d.options.chauffe_eau.catalogue)}<div class="grid">${selectField('Type','options.chauffe_eau.type',[['cumulus','Cumulus électrique'],['ballon_thermo','Ballon thermodynamique'],['instantane','Instantané'],['chaudiere','Via chaudière']],d.options.chauffe_eau.type,'c4')}${selectField('Capacité','options.chauffe_eau.capacity',[[100,'100 L'],[150,'150 L'],[200,'200 L'],[300,'300 L']],d.options.chauffe_eau.capacity,'c4')}${numField('Temps de pose (h)','options.chauffe_eau.time_h',d.options.chauffe_eau.time_h,'c4',0,.25)}</div></div>`:''}${toggle('options.adoucisseur.enabled','Ajouter un adoucisseur','Sélection du modèle dans le catalogue')}${d.options.adoucisseur.enabled?`<div class="inset">${cataloguePicker('options.adoucisseur.catalogue','options.adoucisseur.price_ht','adoucisseur','un adoucisseur',d.options.adoucisseur.catalogue)}<div class="grid">${numField('Temps de pose (h)','options.adoucisseur.time_h',d.options.adoucisseur.time_h,'c4',0,.25)}</div></div>`:''}</div>`;
  const opts=`<div class="card"><h2>Options complémentaires</h2><div class="grid">${numField('Robinets extérieurs','installation.annexe1.robinet_exterieur',a.robinet_exterieur,'c6',0,1)}${numField('Limiteurs de pression','installation.annexe1.limiteur_pression',a.limiteur_pression,'c6',0,1)}</div><div class="choice-grid option-clean">${toggle('installation.annexe1.arret_general',"Alimentation + robinet d’arrêt général")}${toggle('installation.annexe1.raccordement_exterieur','Raccordement extérieur eau')}${toggle('installation.annexe1.ventilation_wc','Ventilation haute WC')}${toggle('installation.annexe1.ventilation_fosse','Ventilation fosse + extracteur')}${toggle('installation.annexe1.forfait_etage','Canalisation + alimentation étage')}${toggle('installation.annexe1.aleas','Aléas 4 %','Appliqués uniquement à la main-d’œuvre HT')}${['demolition','platrerie','raccordement','traversee','renovation','acces_difficile','boucle_ecs','pompe_relevage'].map(k=>toggle(`options.forfaits.${k}`,forfaitLabel(k),forfaitHelp(k))).join('')}</div></div>`;
  return gamme+eauChaude+opts;
}
function renderSmallWorkflow(){
  const ps=d.petits_travaux.prestations||[];
  content.innerHTML=head('Étape 3','Petits travaux — plusieurs prestations dans le même chiffrage','Chaque prestation possède ses propres données. Un seul déplacement est compté pour le chantier.')+
  `<div class="card"><div class="row between"><div><h2>Prestations</h2><p class="muted">Débouchage + recherche de fuite + remplacement peuvent coexister.</p></div><button class="btn primary" data-add-prestation>+ Ajouter une prestation</button></div>
  <div class="equipment-list">${ps.length?ps.map((p,i)=>prestationCard(p,i)).join(''):`<div class="empty-state">Ajoute la première prestation pour commencer.</div>`}</div></div>`;
}
function prestationCard(p,i){
  const opts=[['','Choisir...'],['fuite','Recherche de fuite'],['chauffe_eau','Chauffe-eau'],['debouchage','Débouchage'],['remplacement','Remplacement sanitaire']];
  let body=`${selectField('Type de prestation',`petits_travaux.prestations.${i}.type`,opts,p.type,'c6')}`;
  if(p.type==='fuite')body+=`${selectField('Méthode',`petits_travaux.prestations.${i}.method`,[['','Choisir...'],['camera','Caméra endoscopique'],['colorant','Test au colorant'],['demolition','Démolition + recherche'],['fumee','Test à la fumée'],['exterieure','Recherche extérieure'],['circuits','Mise en évidence circuits']],p.method,'c6')}<div class="info c12"><b>Recherche de fuite : tout compris.</b> Le diagnostic de 150 € s’ajoute au tarif de la méthode enregistré dans SpeedArti. Aucun prix n’est demandé pendant le chiffrage.</div>`;
  if(p.type==='chauffe_eau'){const ceType=p.ce_type||'reparation';body+=`${selectField('Intervention',`petits_travaux.prestations.${i}.ce_type`,[['reparation','Réparation / nettoyage'],['changement_200l_elec','Changement 200 L électrique'],['changement_300l_elec','Changement 300 L électrique'],['ballon_thermo_air_ext','Thermodynamique air extérieur'],['ballon_thermo_groupe_ext','Thermodynamique groupe ext. / sortie toit']],ceType,'c6')}${ceType==='reparation'?`<div class="info c12">Le forfait entreprise enregistré dans SpeedArti est utilisé automatiquement. S’il n’est pas paramétré, le contrôle le signale sans demander de prix dans le chantier.</div>`:`${numField('Durée proposée / modifiable (h)',`petits_travaux.prestations.${i}.duration_h`,p.duration_h,'c6',0,.25,'temps de pose')}<div class="c12">${cataloguePicker(`petits_travaux.prestations.${i}.catalogue`,`petits_travaux.prestations.${i}.price_ht`,'chauffe_eau','un chauffe-eau',p.catalogue)}</div>`}`}
  if(p.type==='debouchage')body+=`<div class="info c12"><b>Débouchage tout compris.</b> Le tarif entreprise enregistré dans SpeedArti est utilisé automatiquement, déplacement inclus. Aucun prix n’est demandé pendant le chiffrage.</div>`;
  if(p.type==='remplacement')body+=`<div class="c12">${p.equipment?`<div class="mini-card"><div><strong>${labelForKind(p.equipment.kind)} — ${labelSubtype(p.equipment)||'configuration de base'}</strong><span>${equipmentImpact(p.equipment)}</span></div><button class="btn secondary compact" data-edit-prestation-equipment="${p.id}">Configurer</button></div>`:`<div><p class="subtle">Choisir l’élément à remplacer :</p><div class="add-grid compact-grid">${[['wc','WC'],['douche','Douche'],['baignoire','Baignoire'],['lavabo','Lavabo / vasque'],['meuble_vasque','Meuble vasque'],['lave_main','Lave-main'],['evier','Évier'],['element_specifique','Élément spécifique']].map(([k,l])=>`<button class="btn secondary add-btn" data-create-prestation-equipment="${p.id}" data-equipment-kind="${k}">${l}</button>`).join('')}</div></div>`}</div>`;
  return `<div class="card nested"><div class="row between"><h3>Prestation ${i+1}</h3><button class="btn danger compact" data-remove-prestation="${p.id}">Supprimer</button></div><div class="grid">${body}</div></div>`;
}
function labelForKind(k){return {wc:'WC',douche:'Douche',baignoire:'Baignoire',lavabo:'Lavabo / vasque',meuble_vasque:'Meuble vasque',lave_main:'Lave-main',evier:'Évier',lave_linge:'Lave-linge',lave_vaisselle:'Lave-vaisselle',element_specifique:'Élément spécifique'}[k]||'Équipement'}

function renderSmallOptions(){
  const ps=d.petits_travaux.prestations||[];
  content.innerHTML=head('Étape 3','Configuration & options — petits travaux','Configure uniquement les remplacements qui en ont besoin, puis choisis les options du chantier.')+
  `<div class="card"><h2>Prestations et équipements</h2>${ps.map((p,i)=>`<div class="section-left"><h4>Prestation ${i+1} — ${p.type||'à choisir'}</h4>${p.type==='remplacement'&&p.equipment?equipmentEditor(p.equipment,i,'prestation',p.id):`<p class="muted">${p.type==='remplacement'?'Équipement non configuré.':'Aucune configuration sanitaire spécifique.'}</p>`}</div>`).join('')}</div>${smallWorkOptions()}`;
}
function annexe2RoleStatus(def,eq){
  if(def.role==='network')return ['Réseau automatique','auto'];
  if(def.role==='main')return [eq.catalogue?.code?'Article principal sélectionné':'Article principal à vérifier',eq.catalogue?.code?'ok':'info'];
  if(def.role==='service')return ['Prestation unitaire','auto'];
  if(def.role==='dedicated'){
    if(def.dedicated==='mitigeur')return [eq.mitigeur?(eq.mitigeur_catalogue?.code?'Option catalogue sélectionnée':'Option activée à renseigner'):'Option non activée',eq.mitigeur_catalogue?.code?'ok':'info'];
    if(def.dedicated==='paroi')return [eq.paroi?(eq.paroi_catalogue?.code?'Option catalogue sélectionnée':'Option activée à renseigner'):'Option non activée',eq.paroi_catalogue?.code?'ok':'info'];
    if(def.dedicated==='spec')return [eq.spec_mode?'Prestation étanchéité sélectionnée':'Option non activée',eq.spec_mode?'ok':'info'];
  }
  return ['À associer si nécessaire','info'];
}
function annexe2Panel(eq,prefix){
  const defs=API.annexe2For?.(eq.kind,eq.subtype)||[];if(!defs.length)return'';const items=eq.annexe2_items||{};
  const rows=defs.map(def=>{
    if(def.role!=='selectable'){
      const [status,kind]=annexe2RoleStatus(def,eq);return `<div class="annexe2-row"><div><strong>${esc(def.label)}</strong>${def.optional?'<small>Conditionnel</small>':''}</div><span class="annexe2-status ${kind}">${esc(status)}</span></div>`;
    }
    const item=items[def.key]||{};const has=!!item.catalogue?.code;
    const picker=cataloguePicker(`${prefix}.annexe2_items.${def.key}.catalogue`,`${prefix}.annexe2_items.${def.key}.price_ht`,def.context||'all',def.label,item.catalogue,true,def.q||'');
    return `<div class="annexe2-row selectable"><div class="annexe2-row-head"><div><strong>${esc(def.label)}</strong>${def.optional?'<small>Conditionnel / si non compris dans le produit principal</small>':'<small>À vérifier selon le produit principal choisi</small>'}</div><span class="annexe2-status ${has?'ok':'info'}">${has?'Référence associée':'Non renseigné'}</span></div>${picker}${has?`<div class="grid annexe2-fields">${numField('Quantité',`${prefix}.annexe2_items.${def.key}.quantite`,item.quantite??1,'c4',0,1)}${textField('Note / inclusion pack',`${prefix}.annexe2_items.${def.key}.note`,item.note,'c4','optionnel')}</div>`:''}</div>`;
  }).join('');
  return `<details class="annexe2-panel"><summary>📋 Composition de l’équipement — ${defs.length} poste(s)</summary><div class="annexe2-body"><p class="muted">Les alimentations et raccords déjà calculés par le réseau ne sont pas doublés. Les composants complémentaires sont pris en compte uniquement lorsqu’ils sont réellement nécessaires.</p>${rows}</div></details>`;
}

function equipmentEditor(eq,index,scope,pid=''){
  const prefix=scope==='installation'?`installation.equipments.${index}`:`petits_travaux.prestations.${findPrestationIndex(pid)}.equipment`;
  const fixedService=eq.kind==='lave_linge'||eq.kind==='lave_vaisselle';
  const mainPicker=fixedService?'':cataloguePicker(`${prefix}.catalogue`,`${prefix}.price_ht`,catalogueContext(eq),labelForKind(eq),eq.catalogue);
  const common=fixedService?`<div class="c12 info compact-info">Tarif unitaire piloté par les paramètres de l’entreprise : ${eur(eq.kind==='lave_linge'?(d.settings.annexe1.robinet_mll??API.ANNEXE1_DEFAULTS.robinet_mll.price):(d.settings.annexe1.robinet_mlv??API.ANNEXE1_DEFAULTS.robinet_mlv.price))}. Aucun temps séparé n’est ajouté.</div>`:`<div class="c12">${mainPicker}</div>${numField('Temps de pose (h)',`${prefix}.time_h`,eq.time_h,'c4',0,.25,'base SpeedArti / artisan')}`;
  let specific='';
  if(eq.kind==='wc')specific=`${selectField('Type de WC',`${prefix}.subtype`,[['poser','WC à poser'],['suspendu','WC suspendu + bâti'],['urinoir','Urinoir suspendu'],['urinoir_bati','Urinoir suspendu + bâti']],eq.subtype||'poser','c4')}${toggle(`${prefix}.pmr_wc`,'Adaptation PMR WC','Barres de maintien et adaptation PMR')}`;
  if(eq.kind==='douche')specific=`${selectField('Type de douche',`${prefix}.subtype`,[['bac','Bac classique'],['extra_plat','Extra-plat'],['italienne','Douche italienne']],eq.subtype||'bac','c4')}
    ${toggle(`${prefix}.mitigeur`,'Mitigeur','Référence catalogue + temps de pose')}${eq.mitigeur?`<div class="option-values c12">${cataloguePicker(`${prefix}.mitigeur_catalogue`,`${prefix}.mitigeur_price_ht`,'mitigeur_douche','un mitigeur de douche',eq.mitigeur_catalogue,true)}<div class="grid">${numField('Temps mitigeur (h)',`${prefix}.mitigeur_time_h`,eq.mitigeur_time_h,'c6',0,.25)}</div></div>`:''}
    ${toggle(`${prefix}.colonne`,'Colonne de douche','Référence catalogue + temps de pose')}${eq.colonne?`<div class="option-values c12">${cataloguePicker(`${prefix}.colonne_catalogue`,`${prefix}.colonne_price_ht`,'colonne_douche','une colonne de douche',eq.colonne_catalogue,true)}<div class="grid">${numField('Temps colonne (h)',`${prefix}.colonne_time_h`,eq.colonne_time_h,'c6',0,.25)}</div></div>`:''}
    ${toggle(`${prefix}.paroi`,'Paroi de douche','Référence catalogue + temps de pose')}${eq.paroi?`<div class="option-values c12">${cataloguePicker(`${prefix}.paroi_catalogue`,`${prefix}.paroi_price_ht`,'paroi_douche','une paroi de douche',eq.paroi_catalogue,true)}<div class="grid">${numField('Temps paroi (h)',`${prefix}.paroi_time_h`,eq.paroi_time_h,'c6',0,.25)}</div></div>`:''}
    ${toggle(`${prefix}.pmr_douche`,'Adaptation PMR douche','Forfait distinct du WC PMR')}${eq.subtype==='italienne'?`<div class="special-panel c12"><h4>Douche italienne</h4><div class="grid">${selectField('Prestation étanchéité / chape',`${prefix}.spec_mode`,[['','Aucune'],['spec','SPEC — 16 €/m²'],['natte','SPEC + natte — 43 €/m²'],['chape','Chape — 54 €/m²']],eq.spec_mode||'','c6')}${numField('Surface réelle (m²)',`${prefix}.spec_surface_m2`,eq.spec_surface_m2,'c6',0,.01)}</div></div>`:''}`;
  if(eq.kind==='baignoire')specific=`${selectField('Type de baignoire',`${prefix}.subtype`,[['droite','Droite'],['asymetrique','Asymétrique'],['angle','D’angle']],eq.subtype||'droite','c4')}${textField('Dimensions',`${prefix}.dimensions`,eq.dimensions,'c4','170 × 75')}${toggle(`${prefix}.colonne`,'Colonne / ensemble douche','Référence catalogue + temps de pose')}${eq.colonne?`<div class="option-values c12">${cataloguePicker(`${prefix}.colonne_catalogue`,`${prefix}.colonne_price_ht`,'colonne_douche','une colonne / ensemble douche',eq.colonne_catalogue,true)}<div class="grid">${numField('Temps colonne (h)',`${prefix}.colonne_time_h`,eq.colonne_time_h,'c6',0,.25)}</div></div>`:''}`;
  if(eq.kind==='meuble_vasque')specific=`${selectField('Configuration',`${prefix}.subtype`,[['simple','Simple vasque'],['double','Double vasque']],eq.subtype||'simple','c4')}${textField('Dimensions',`${prefix}.dimensions`,eq.dimensions,'c4','ex. 120 cm')}`;
  if(eq.kind==='lave_main')specific=`${selectField('Format',`${prefix}.subtype`,[['standard','Standard'],['angle','D’angle']],eq.subtype||'standard','c4')}${toggle(`${prefix}.ec`,'Eau chaude prévue','Sinon EF uniquement')}`;
  if(eq.kind==='evier')specific=`${selectField('Matière',`${prefix}.subtype`,[['inox','Inox'],['resine','Résine'],['ceramique','Céramique'],['timbre','Timbre céramique']],eq.subtype||'inox','c4')}${selectField('Configuration',`${prefix}.config`,[['simple','Simple bac'],['double','Double bac'],['sous_plan_simple','Sous-plan simple'],['sous_plan_double','Sous-plan double']],eq.config||'simple','c4')}`;
  if(eq.kind==='element_specifique')specific=`${textField('Désignation',`${prefix}.label`,eq.label,'c4','ex. broyeur / bidet / platine')}${toggle(`${prefix}.ef`,'Alimentation EF')}${toggle(`${prefix}.ec`,'Alimentation EC')}${toggle(`${prefix}.evac`,'Évacuation')}${numField('Nombre de robinets d’arrêt nécessaires',`${prefix}.stop_valves`,eq.stop_valves,'c4',0,1,'0 si aucun')}`;
  return `<details class="accordion" open data-equipment-anchor="${esc(eq.id)}"><summary>${index+1}. ${labelForKind(eq.kind)}${eq.subtype?` — ${labelSubtype(eq)}`:''}</summary><div class="inside"><div class="grid">${specific}${common}</div>${equipmentRuleNote(eq)}${annexe2Panel(eq,prefix)}</div></details>`;
}
function equipmentRuleNote(eq){
  if(eq.kind==='wc')return `<div class="info compact-info">Réglages de base disponibles selon le type de WC. Ils restent modifiables appareil par appareil.</div>`;
  if(eq.kind==='lave_linge'||eq.kind==='lave_vaisselle')return `<div class="info compact-info">La prestation unitaire et le réseau associé sont pris en compte automatiquement.</div>`;
  return `<div class="subtle">Le produit est choisi dans le catalogue et le temps de pose peut être ajusté par l’artisan.</div>`;
}
function findPrestationIndex(id){return (d.petits_travaux.prestations||[]).findIndex(p=>p.id===id)}
function smallWorkOptions(){
  return `<div class="card"><h2>Réglages du chiffrage</h2><h3>Complexité du chantier</h3><div class="gamme">${[['simple','Simple × 0,80'],['moyen','Moyen × 1'],['complexe','Complexe × 1,40']].map(([v,l])=>`<button class="choice ${d.options.complexite===v?'active':''}" data-complexite="${v}"><strong>${l}</strong></button>`).join('')}</div><p class="subtle">La complexité agit uniquement sur la main-d’œuvre.</p><h3 class="subhead">TVA</h3><div class="choice-grid">${choice('10','TVA 10 %','Rénovation éligible',String(d.options.taux_tva),'data-tva')}${choice('20','TVA 20 %','Neuf / cas standard',String(d.options.taux_tva),'data-tva')}</div></div>
  <div class="card"><h2>Options complémentaires</h2><div class="choice-grid option-clean">${['deplacement','demolition','platrerie','raccordement','traversee','renovation','acces_difficile','boucle_ecs','pompe_relevage'].map(k=>toggle(`options.forfaits.${k}`,forfaitLabel(k),forfaitHelp(k))).join('')}</div><p class="subtle">Les tarifs proviennent des paramètres SpeedArti / entreprise. Aucun prix n’est demandé dans le chiffrage.</p></div>`;
}
function forfaitLabel(k){return {deplacement:'Déplacement',demolition:'Démolition',platrerie:'Petits travaux plâtrerie',raccordement:'Raccordement sur existant',traversee:'Traversée plancher / mur',renovation:'Rénovation',acces_difficile:'Accès difficile',boucle_ecs:'Boucle ECS',pompe_relevage:'Pompe de relevage'}[k]}
function forfaitHelp(k){return {deplacement:'Un seul déplacement par chantier',acces_difficile:'Forfait SpeedArti modifiable dans les paramètres entreprise',boucle_ecs:'Forfait complet',pompe_relevage:'Forfait complet'}[k]||'Valeur SpeedArti / entreprise'}

async function renderResults(){content.innerHTML=head('Étape 4','Résultats et contrôle','Le résultat montre le chiffrage, le réseau, les heures-homme et les données encore manquantes avant devis.')+`<div id="resultHost"><div class="muted">Calcul en cours…</div></div>`;await run(false)}
async function run(force=false){
  try{const r=API.calculate(d);d._lastResult=r;save(false);if(force&&step!==3){step=3;render();return}if(step===3)showResult(r);else flash(`Calcul OK : ${eur(r.totaux.total_ttc)} TTC`,'ok')}
  catch(e){if(force&&step!==3){step=3;render();setTimeout(()=>showError(e),0);return}showError(e)}
}
function showError(e){const h=q('#resultHost')||content;h.innerHTML=`<div class="alert err"><b>Calcul bloqué :</b> ${esc(e.message||String(e))}</div>`}
function artisanSource(src){const x=String(src||'');if(/Guillaume|Annexe/i.test(x))return 'Référentiel SpeedArti';if(/fallback/i.test(x))return 'Barème SpeedArti';if(/saisie artisan/i.test(x))return 'Valeur artisan';return x||'SpeedArti'}
function artisanMessage(msg){
  let x=String(msg||'').replace(/Annexe 2 Guillaume/gi,'composition équipement').replace(/Annexe 2/gi,'composition équipement').replace(/Annexe 1 Guillaume/gi,'référentiel SpeedArti').replace(/Guillaume/gi,'SpeedArti').replace(/BALISE\s*/gi,'').trim();
  if(/prix catalogue ou manuel manquant|prix catalogue manquant/i.test(x)){
    const m=x.match(/(?:pour|«)\s*[«"]?([^»"]+?)[»"]?(?:\s*\(|\s*:|\.|$)/i);const item=m?.[1]?.trim();
    return `Tarif technique indisponible${item?` pour ${item}`:''} — référentiel SpeedArti à compléter.`;
  }
  x=x.replace(/Renseigner exceptionnellement un prix[^.]*\.?/gi,'Référentiel SpeedArti à compléter.').replace(/prix catalogue ou manuel/gi,'tarif référentiel');
  return x;
}
function showResult(r){
  const h=q('#resultHost');if(!h)return;const det=r.surfaces.detail_par_face||{};const ctl=r.controle_balises||{};
  h.innerHTML=`<div class="status-banner ${r.finalisation_bloquee?'blocked':'ready'}"><strong>${r.finalisation_bloquee?'⚠️ Finalisation bloquée':'✅ Chiffrage contrôlé'}</strong><span>${r.finalisation_bloquee?'Certaines données techniques restent à synchroniser avant finalisation.':'Aucun blocage critique détecté dans la démo.'}</span></div>
  <details class="card control-card ${ctl.ok?'control-ok':'control-ko'}"><summary><b>Contrôle technique SpeedArti</b> — ${ctl.ok?'OK':'à vérifier'}</summary><div class="inside"><div class="row between"><div><h2>Contrôle technique SpeedArti</h2><p class="muted">${esc(ctl.version||'BALISES-ABSOLUES-v1')} — vérification automatique des données, quantités et calculs.</p></div><span class="pill ${ctl.ok?'ok-pill':'wait'}">${ctl.ok?'VALIDÉ':'BLOQUÉ'}</span></div><div class="network-metrics"><div><span>Lignes contrôlées</span><strong>${fmt(ctl.lignes_controlees)}</strong></div><div><span>Lignes catalogue</span><strong>${fmt(ctl.lignes_catalogue)}</strong></div><div><span>Matériaux contrôlés</span><strong>${eur(ctl.materiaux_ht_controles)}</strong></div><div><span>Total HT contrôlé</span><strong>${eur(ctl.total_ht_controle)}</strong></div></div></div></details>
  ${(r.recommandations||[]).map(x=>`<div class="alert info-alert">ℹ️ ${esc(artisanMessage(x))}</div>`).join('')}${(r.alertes||[]).map(x=>`<div class="alert warn">⚠️ ${esc(artisanMessage(x))}</div>`).join('')}
  <div class="metrics"><div class="metric"><span>Durée chantier</span><strong>${fmt(r.main_oeuvre.temps_estime_heures)} h</strong></div><div class="metric"><span>Heures-homme</span><strong>${fmt(r.main_oeuvre.heures_homme)} h</strong></div><div class="metric"><span>Matériaux / forfaits HT</span><strong>${eur(r.totaux.materiaux_ht)}</strong></div><div class="metric"><span>Total TTC</span><strong>${eur(r.totaux.total_ttc)}</strong></div></div>
  ${Object.keys(det).length?`<div class="card"><h2>Réseau calculé</h2><div class="network-metrics">${Object.entries(det).map(([k,v])=>`<div><span>${esc(k.replaceAll('_',' '))}</span><strong>${fmt(v)}</strong></div>`).join('')}</div></div>`:''}
  <div class="card"><h2>Détail des lignes</h2><div class="table-wrap"><table class="table"><thead><tr><th>Désignation</th><th>Référence catalogue</th><th>Catégorie</th><th>Qté</th><th>Unité</th><th>PU HT</th><th>Total HT</th></tr></thead><tbody>${r.materiaux.map(m=>`<tr><td>${esc(m.nom)}</td><td>${m.catalogue_code?`<b>${esc(m.catalogue_marque||'')}</b><br><small>Téréva ${esc(m.catalogue_code)}</small>`:'—'}</td><td>${esc(m.categorie)}</td><td>${fmt(m.quantite_finale)}</td><td>${esc(m.unite)}</td><td>${eur(m.prix_unitaire_ht)}</td><td>${eur(m.total_ht)}</td></tr>`).join('')}</tbody></table></div></div>
  <div class="card"><div class="row between wrap"><div><h2>Besoins matériaux / fournisseur</h2><p class="muted">${esc(r.approvisionnement?.message_stock||'Aucune donnée de stock réelle connectée.')}</p></div><span class="pill wait">Stock : non connecté</span></div><div class="network-metrics"><div><span>Lignes de besoin</span><strong>${fmt(r.approvisionnement?.nombre_lignes||0)}</strong></div><div><span>Références Téréva</span><strong>${fmt(r.approvisionnement?.articles_catalogue?.length||0)}</strong></div><div><span>Hors catalogue</span><strong>${fmt(r.approvisionnement?.articles_hors_catalogue?.length||0)}</strong></div><div><span>Total besoins HT</span><strong>${eur(r.approvisionnement?.total_besoins_ht||0)}</strong></div></div>${(r.approvisionnement?.items||[]).length?`<div class="table-wrap"><table class="table"><thead><tr><th>Désignation</th><th>Code Téréva</th><th>Besoin chantier</th><th>PU HT</th><th>Total HT</th><th>Stock</th></tr></thead><tbody>${r.approvisionnement.items.map(x=>`<tr><td>${esc(x.designation)}</td><td>${x.catalogue_code?esc(x.catalogue_code):'—'}</td><td>${fmt(x.quantite_besoin)} ${esc(x.unite)}</td><td>${eur(x.prix_unitaire_ht)}</td><td>${eur(x.total_ht)}</td><td><span class="pill wait">à vérifier</span></td></tr>`).join('')}</tbody></table></div><div class="row wrap result-actions"><button type="button" class="btn secondary" data-export-appro-csv>Exporter CSV</button><button type="button" class="btn secondary" data-export-appro-json>Exporter JSON SpeedArti</button><button type="button" class="btn ghost" data-copy-appro-json>Copier le payload</button></div><p class="subtle">Le payload prépare le futur raccord avec Demande de devis fournisseur / Commande fournisseur. Il ne prétend pas connaître le stock ni créer une commande dans cette démo.</p>`:`<div class="empty-state">Aucun article stockable dans ce chiffrage.</div>`}</div>
  ${(r.nomenclature_annexe2||[]).length?`<div class="card"><h2>Composition des équipements</h2><p class="muted">Composition par appareil. Les éléments déjà compris dans un produit principal ne sont pas ajoutés une seconde fois.</p><div class="annexe2-result-list">${r.nomenclature_annexe2.map(n=>`<details class="accordion"><summary>${esc(n.equipment)} — ${n.components.length} poste(s)</summary><div class="inside annexe2-result-grid">${n.components.map(c=>`<div class="annexe2-result-item"><span>${esc(c.label)}</span><b>${esc(c.status)}</b>${c.catalogue_code?`<small>Téréva ${esc(c.catalogue_code)}${c.catalogue_marque?` · ${esc(c.catalogue_marque)}`:''}</small>`:''}</div>`).join('')}</div></details>`).join('')}</div></div>`:''}
  <div class="card"><h2>Main-d’œuvre et totaux</h2><div class="summary-lines"><div><span>Coefficient complexité</span><b>× ${fmt(r.main_oeuvre.coefficient_complexite)}</b></div><div><span>Main-d’œuvre HT avant aléas</span><b>${eur(r.totaux.main_oeuvre_ht_avant_aleas??r.totaux.main_oeuvre_ht)}</b></div>${r.totaux.aleas_ht>0?`<div><span>Aléas — 4 % de la main-d’œuvre HT</span><b>${eur(r.totaux.aleas_ht)}</b></div>`:''}<div><span>Main-d’œuvre HT totale</span><b>${eur(r.totaux.main_oeuvre_ht)}</b></div><div><span>Total HT</span><b>${eur(r.totaux.total_ht)}</b></div><div><span>TVA ${fmt(r.totaux.taux_tva)} %</span><b>${eur(r.totaux.tva)}</b></div><div class="grand"><span>Total TTC</span><b>${eur(r.totaux.total_ttc)}</b></div></div></div>`;
}

const catalogueFiltersCache={};
function getCatalogueFilters(ctx){return catalogueFiltersCache[ctx]||(catalogueFiltersCache[ctx]=CAT.filters(ctx))}
function renderCatalogueModal(){
  if(!catalogueUi.open){catalogueHost.innerHTML='';return}
  const f=getCatalogueFilters(catalogueUi.context||'all');
  const results=CAT.search({q:catalogueUi.q,context:catalogueUi.context,brand:catalogueUi.brand,type:catalogueUi.type,finish:catalogueUi.finish,limit:40});
  const opt=(arr,current,empty)=>`<option value="">${empty}</option>${arr.map(v=>`<option value="${esc(v)}" ${v===current?'selected':''}>${esc(v)}</option>`).join('')}`;
  catalogueHost.innerHTML=`<div class="catalogue-overlay" data-close-catalogue-overlay><section class="catalogue-modal" role="dialog" aria-modal="true"><header><div><span class="eyebrow">Catalogue Plombier</span><h2>${esc(catalogueUi.label||'Choisir un produit')}</h2><p>${fmt(CAT.count)} références · ${CATALOGUE_VERSION}</p></div><button type="button" class="catalogue-close" data-close-catalogue aria-label="Fermer">×</button></header><div class="catalogue-toolbar"><div class="catalogue-search"><span>🔎</span><input id="catalogueSearchInput" value="${esc(catalogueUi.q)}" data-catalogue-search placeholder="Produit, marque, finition, référence ou code Téréva…"></div><div class="catalogue-filters"><select data-catalogue-filter="brand">${opt(f.brands,catalogueUi.brand,'Toutes les marques')}</select><select data-catalogue-filter="type">${opt(f.types,catalogueUi.type,'Tous les types')}</select><select data-catalogue-filter="finish">${opt(f.finishes,catalogueUi.finish,'Toutes les finitions')}</select></div></div><div class="catalogue-count">${results.length} résultat(s) affiché(s)${results.length===40?' — affinez la recherche pour aller plus loin':''}</div><div class="catalogue-results">${results.length?results.map(a=>`<article class="catalogue-result"><div class="catalogue-result-main"><div class="row wrap"><span class="catalogue-brand">${esc(a.marque||'À identifier')}</span><span class="catalogue-type">${esc(a.type||'')}</span></div><h3>${esc(a.produit||'Référence catalogue')}</h3>${a.variante?`<p>${esc(a.variante)}</p>`:''}${a.finition?`<p>Finition : <b>${esc(a.finition)}</b></p>`:''}<small>Réf. fabricant ${esc(a.ref_fab||'—')} · Code Téréva <b>${esc(a.code||'—')}</b> · ${esc(a.source||'')}</small></div><div class="catalogue-result-action"><strong class="catalogue-price ${a.prix==null?'missing':''}">${a.prix==null?'Prix manquant':eur(a.prix)}</strong><button type="button" class="btn primary compact" data-select-catalogue-index="${a.__index}">Sélectionner</button></div></article>`).join(''):`<div class="empty-state">Aucun article ne correspond à ces critères.</div>`}</div><footer class="catalogue-modal-footer"><span>Le prix sélectionné est le prix exact de la base Téréva -20 %. La gamme ne le remultiplie pas.</span><button type="button" class="btn secondary" data-close-catalogue>Fermer</button></footer></section></div>`;
}
function openCatalogueFrom(el){
  catalogueUi={open:true,target:el.dataset.catalogueTarget||'',pricePath:el.dataset.cataloguePricePath||'',context:el.dataset.catalogueContext||'all',label:el.dataset.catalogueLabel||'Choisir un produit',q:el.dataset.catalogueQ||'',brand:'',type:'',finish:'',mode:el.dataset.catalogueMode||'replace'};
  renderCatalogueModal();setTimeout(()=>q('#catalogueSearchInput')?.focus(),0);
}
function closeCatalogue(){catalogueUi.open=false;if(catalogueRenderTimer){clearTimeout(catalogueRenderTimer);catalogueRenderTimer=null}renderCatalogueModal()}
function syncCatalogueSelectionToUi(target,sel){
  const txt=`${sel.produit||''} ${sel.variante||''}`.toLowerCase();
  const cap=(txt.match(/(?:^|[^0-9])(100|150|200|300)\s*l(?:[^a-z]|$)/i)||[])[1];
  if(target==='options.chauffe_eau.catalogue'){
    if(cap)d.options.chauffe_eau.capacity=Number(cap);
    if(/thermodynamique/.test(txt))d.options.chauffe_eau.type='ballon_thermo';
    else if(/chauffe-eau/.test(txt))d.options.chauffe_eau.type='cumulus';
  }
  const m=target.match(/^petits_travaux\.prestations\.(\d+)\.catalogue$/);
  if(m&&cap){const p=d.petits_travaux.prestations[Number(m[1])];if(p){if(Number(cap)>=300)p.ce_type='changement_300l_elec';else p.ce_type='changement_200l_elec'}}
  const eqTarget=target.match(/^(installation\.equipments\.\d+|petits_travaux\.prestations\.\d+\.equipment)\.catalogue$/);
  if(eqTarget){const eq=get(d,eqTarget[1]);if(eq&&sel.variante&&['douche','baignoire','meuble_vasque','lavabo','lave_main','evier'].includes(eq.kind))eq.dimensions=sel.variante}
}
function catalogueClickHandler(e){
  const open=e.target.closest('[data-open-catalogue]');if(open){e.preventDefault();openCatalogueFrom(open);return}
  if(e.target.closest('[data-close-catalogue]')){e.preventDefault();closeCatalogue();return}
  const overlay=e.target.closest('[data-close-catalogue-overlay]');if(overlay&&e.target===overlay){closeCatalogue();return}
  const select=e.target.closest('[data-select-catalogue-index]');if(select){
    const a=CAT.byIndex(select.dataset.selectCatalogueIndex);if(!a)return;const sel=CAT.selection(a);sel.context=catalogueUi.context;
    if(catalogueUi.mode==='append'){
      d.options.articles_libres=d.options.articles_libres||[];d.options.articles_libres.push({catalogue:sel,price_ht:sel.prix,quantite:1});
    }else{
      set(d,catalogueUi.target,sel);if(catalogueUi.pricePath)set(d,catalogueUi.pricePath,sel.prix==null?undefined:sel.prix);const a2=catalogueUi.target.match(/^(.*\.annexe2_items\.[^.]+)\.catalogue$/);if(a2&&get(d,`${a2[1]}.quantite`)==null)set(d,`${a2[1]}.quantite`,1);syncCatalogueSelectionToUi(catalogueUi.target,sel);
    }
    save(false);closeCatalogue();render();flash(`Référence Téréva ${sel.code} sélectionnée`,'ok');return;
  }
  const clear=e.target.closest('[data-clear-catalogue]');if(clear){const target=clear.dataset.clearCatalogue;const a2=target.match(/^(.*\.annexe2_items\.[^.]+)\.catalogue$/);if(a2)set(d,a2[1],null);else set(d,target,null);if(clear.dataset.cataloguePricePath)set(d,clear.dataset.cataloguePricePath,undefined);save(false);render();return}
  const rm=e.target.closest('[data-remove-free-article]');if(rm){d.options.articles_libres.splice(Number(rm.dataset.removeFreeArticle),1);save(false);render();return}
}
function catalogueInputHandler(e){
  if(!catalogueUi.open)return;
  if(e.target.matches('[data-catalogue-search]')){
    catalogueUi.q=e.target.value;const pos=e.target.selectionStart;
    if(catalogueRenderTimer)clearTimeout(catalogueRenderTimer);
    catalogueRenderTimer=setTimeout(()=>{catalogueRenderTimer=null;if(!catalogueUi.open)return;renderCatalogueModal();const inp=q('#catalogueSearchInput');if(inp){inp.focus();try{inp.setSelectionRange(pos,pos)}catch{}}},90);
    return;
  }
  if(e.target.matches('[data-catalogue-filter]')){
    catalogueUi[e.target.dataset.catalogueFilter]=e.target.value;
    if(catalogueRenderTimer)clearTimeout(catalogueRenderTimer);
    catalogueRenderTimer=setTimeout(()=>{catalogueRenderTimer=null;if(catalogueUi.open)renderCatalogueModal()},0);
    return;
  }
}
function catalogueSelectionPathForPrice(path){
  if(path.endsWith('.mitigeur_price_ht'))return path.replace(/\.mitigeur_price_ht$/,'.mitigeur_catalogue');
  if(path.endsWith('.colonne_price_ht'))return path.replace(/\.colonne_price_ht$/,'.colonne_catalogue');
  if(path.endsWith('.paroi_price_ht'))return path.replace(/\.paroi_price_ht$/,'.paroi_catalogue');
  if(path.endsWith('.price_ht'))return path.replace(/\.price_ht$/,'.catalogue');
  if(/_price_ht$/.test(path))return path.replace(/_price_ht$/,'_catalogue');
  return'';
}
function markCataloguePriceOverride(path,value){
  const selPath=catalogueSelectionPathForPrice(path);if(!selPath)return;const sel=get(d,selPath);if(!sel?.code)return;
  const same=Number.isFinite(Number(value))&&Number.isFinite(Number(sel.prix))&&Math.abs(Number(value)-Number(sel.prix))<.011;
  sel.price_overridden=!same;if(sel.price_overridden)sel.manual_price_ht=value;else delete sel.manual_price_ht;
}
function invalidateCatalogueOnConfigChange(path){
  if(path==='options.chauffe_eau.type'||path==='options.chauffe_eau.capacity'){if(get(d,'options.chauffe_eau.catalogue')){set(d,'options.chauffe_eau.catalogue',null);set(d,'options.chauffe_eau.price_ht',undefined)}return}
  if(path==='options.type_tuyau'){set(d,'installation.network.fitting_catalogue',null);set(d,'installation.network.fitting_price_ht',undefined);return}
  const m=path.match(/^(.*\.equipment)\.(subtype|dimensions|config)$/);if(m){const base=m[1],eq=get(d,base);if(eq?.catalogue){eq.catalogue=null;if(eq.kind!=='wc')eq.price_ht=undefined}return}
  const m2=path.match(/^(installation\.equipments\.\d+)\.(subtype|dimensions|config)$/);if(m2){const base=m2[1],eq=get(d,base);if(eq?.catalogue){eq.catalogue=null;if(eq.kind!=='wc')eq.price_ht=undefined}}
}

function clickHandler(e){
  const el=e.target.closest('[data-choice],[data-step],[data-add-equipment],[data-remove-equipment],[data-edit-equipment],[data-add-prestation],[data-remove-prestation],[data-create-prestation-equipment],[data-edit-prestation-equipment],[data-gamme],[data-complexite],[data-tva],[data-export-appro-csv],[data-export-appro-json],[data-copy-appro-json],[data-configure-equipment]');
  if(!el)return;
  if(el.dataset.choice!==undefined){d.options.type_projet=el.dataset.choice;save();render();return}
  if(el.dataset.addEquipment){d.installation.equipments.push(newEquipment(el.dataset.addEquipment,el.dataset.zone||''));save();render();return}
  if(el.dataset.removeEquipment){d.installation.equipments=d.installation.equipments.filter(x=>x.id!==el.dataset.removeEquipment);if(activeEquipmentId===el.dataset.removeEquipment)activeEquipmentId=d.installation.equipments[0]?.id||null;save();render();return}
  if(el.dataset.editEquipment){step=2;render();setTimeout(()=>document.querySelector(`[data-equipment-anchor="${el.dataset.editEquipment}"]`)?.scrollIntoView({behavior:'smooth'}),0);return}
  if(el.hasAttribute('data-add-prestation')){d.petits_travaux.prestations.push({id:uid('pt'),type:''});save();render();return}
  if(el.dataset.removePrestation){d.petits_travaux.prestations=d.petits_travaux.prestations.filter(x=>x.id!==el.dataset.removePrestation);save();render();return}
  if(el.dataset.createPrestationEquipment){const p=d.petits_travaux.prestations.find(x=>x.id===el.dataset.createPrestationEquipment);if(p){p.equipment=newEquipment(el.dataset.equipmentKind||'element_specifique');save();render()}return}
  if(el.dataset.editPrestationEquipment){step=2;render();return}
  if(el.dataset.configureEquipment){activeEquipmentId=el.dataset.configureEquipment;step=2;render();return}
  if(el.dataset.gamme){d.options.gamme=el.dataset.gamme;save();render();return}
  if(el.dataset.complexite){d.options.complexite=el.dataset.complexite;save();render();return}
  if(el.dataset.tva){d.options.taux_tva=+el.dataset.tva;save();render();return}
  if(el.hasAttribute('data-export-appro-csv')){exportApproCsv();return}
  if(el.hasAttribute('data-export-appro-json')){exportApproJson();return}
  if(el.hasAttribute('data-copy-appro-json')){copyApproJson();return}
}
function downloadText(filename,text,mime='text/plain;charset=utf-8'){const blob=new Blob([text],{type:mime});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=filename;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),0)}
function currentAppro(){return d._lastResult?.approvisionnement||null}
function exportApproCsv(){const a=currentAppro();if(!a){flash('Aucun besoin fournisseur calculé','warn');return}const rows=[['Code Téréva','Réf fabricant','Marque','Désignation','Quantité besoin','Unité','PU HT','Total HT','Source prix','Statut stock']];for(const x of a.items||[])rows.push([x.catalogue_code||'',x.catalogue_ref_fabricant||'',x.catalogue_marque||'',x.designation||'',x.quantite_besoin,x.unite,x.prix_unitaire_ht,x.total_ht,x.source_prix,x.stock_status]);const csv=rows.map(r=>r.map(v=>`"${String(v??'').replaceAll('"','""')}"`).join(';')).join('\n');downloadText('SpeedArti_Plomber_Besoins_Fournisseur.csv','\ufeff'+csv,'text/csv;charset=utf-8');flash('Liste fournisseur CSV exportée','ok')}
function exportApproJson(){const a=currentAppro();if(!a){flash('Aucun besoin fournisseur calculé','warn');return}downloadText('SpeedArti_Plomber_Payload_Fournisseur.json',JSON.stringify(a.payload_fournisseur,null,2),'application/json;charset=utf-8');flash('Payload fournisseur JSON exporté','ok')}
async function copyApproJson(){const a=currentAppro();if(!a){flash('Aucun besoin fournisseur calculé','warn');return}try{await navigator.clipboard.writeText(JSON.stringify(a.payload_fournisseur,null,2));flash('Payload fournisseur copié','ok')}catch{flash('Copie impossible dans ce navigateur — utilise Export JSON','warn')}}
function newEquipment(kind,zone=''){
  const eq={id:uid('eq'),kind,subtype:'',zone:zone||''};
  if(kind==='wc'){eq.subtype='poser';eq.price_ht=300;eq.time_h=2}
  if(kind==='douche')eq.subtype='bac';
  if(kind==='baignoire')eq.subtype='droite';
  if(kind==='meuble_vasque')eq.subtype='simple';
  if(kind==='lave_main')eq.subtype='standard';
  if(kind==='evier')eq.subtype='inox';
  return eq;
}
function inputHandler(e){
  const t=e.target;if(!t.dataset.path)return;let v;
  if(t.type==='checkbox')v=t.checked;else if(t.type==='number')v=t.value===''?undefined:+t.value;else v=t.value;
  set(d,t.dataset.path,v);markCataloguePriceOverride(t.dataset.path,v);invalidateCatalogueOnConfigChange(t.dataset.path);
  // Changement de sous-type WC : une ancienne référence catalogue pourrait devenir incompatible, on la retire explicitement.
  if(/\.subtype$/.test(t.dataset.path)&&t.dataset.path.includes('equipment')){const eq=get(d,t.dataset.path.replace(/\.subtype$/,''));if(eq?.kind==='wc'){eq.catalogue=null;eq.annexe2_items={};const def={poser:[300,2],suspendu:[700,5],urinoir:[300,2],urinoir_bati:[600,5]}[eq.subtype];if(def){eq.price_ht=def[0];eq.time_h=def[1]}}}
  // Changer le type de petit chauffe-eau invalide la référence précédemment choisie.
  if(/petits_travaux\.prestations\.\d+\.ce_type$/.test(t.dataset.path)){const pp=t.dataset.path.replace(/\.ce_type$/, '');set(d,`${pp}.catalogue`,null);set(d,`${pp}.price_ht`,undefined);if(v==='reparation')set(d,`${pp}.duration_h`,undefined)}
  if(t.dataset.path==='installation.zones.rdc_sans')set(d,'installation.annexe1.attente_rdc',v?1:0);
  if(t.dataset.path==='installation.zones.r1_sans')set(d,'installation.annexe1.attente_r1',v?1:0);
  if(t.dataset.path==='installation.zones.rdc_avec'&&!v){d.installation.equipments=(d.installation.equipments||[]).filter(eq=>eq.zone!=='rdc');}
  if(t.dataset.path==='installation.zones.r1_avec'&&!v){d.installation.equipments=(d.installation.equipments||[]).filter(eq=>eq.zone!=='r1');}
  if((t.dataset.path==='installation.zones.rdc_avec'||t.dataset.path==='installation.zones.r1_avec')&&!get(d,'installation.zones.rdc_avec')&&!get(d,'installation.zones.r1_avec')){d.installation.equipments=[];activeEquipmentId=null;}
  save(false);
  if(t.type==='checkbox'||t.tagName==='SELECT')render();
}
function set(o,path,v){const a=path.split('.');let x=o;for(let i=0;i<a.length-1;i++){const k=a[i];const next=a[i+1];if(x[k]===undefined)x[k]=/^\d+$/.test(next)?[]:{};x=x[k]}x[a.at(-1)]=v}
function get(o,path){return path.split('.').reduce((x,k)=>x?.[k],o)}
function fmt(n){return Number(n||0).toLocaleString('fr-FR',{maximumFractionDigits:2})}
function eur(n){return Number(n||0).toLocaleString('fr-FR',{style:'currency',currency:'EUR'})}
function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function flash(msg,type){const z=document.createElement('div');z.className=`alert ${type==='ok'?'ok':'warn'}`;z.style.position='fixed';z.style.right='18px';z.style.bottom='18px';z.style.zIndex='100';z.textContent=msg;document.body.appendChild(z);setTimeout(()=>z.remove(),1800)}
