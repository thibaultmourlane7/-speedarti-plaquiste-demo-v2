import {
  STRUCTURE_WARNING, FIBRE_WARNING, PREFAB_TEAM_ADVICE, PREFAB_H_PER_ML,
  TRUCK_8X4_DEFAULT, FIBRES, CHIMNEY_CONDUITS, CHIMNEY_STACKS, CHIMNEY_CAPS,
  WORKS, WORK_BY_ID
} from './references.js';

const STORAGE_KEY = 'speedarti-macon-demo-v1';
const steps = ['Mode', 'Ouvrage(s)', 'Configuration', 'Options', 'Résultat'];
const simpleTypes = [
  {id:'murs', icon:'🧱', label:'Murs / Cloisons', desc:'Blocs, briques'},
  {id:'dalle', icon:'⬜', label:'Dalle / Chape', desc:'Béton coulé'},
  {id:'fondations', icon:'🏗️', label:'Fondations', desc:'Semelles'},
  {id:'escalier', icon:'⭐', label:'Escalier', desc:'Béton armé'},
  {id:'terrasse', icon:'▤', label:'Terrasse', desc:'Extérieur'},
  {id:'cheminee', icon:'🔥', label:'Cheminée', desc:'Conduit'}
];
const multiCards = [
  {id:'fondations', type:'fondations', icon:'🏗️', label:'Fondations', name:'Fondation'},
  {id:'murs_porteurs', type:'murs_porteurs', icon:'🧱', label:'Murs porteurs', name:'Mur porteur'},
  {id:'murs_elevations', type:'murs_elevations', icon:'🏠', label:"Murs d'élévations", name:'Murs extérieurs'},
  {id:'escalier', type:'escalier', icon:'⭐', label:'Élément spécial', name:'Escalier'},
  {id:'dalle', type:'dalle', icon:'🟫', label:'Dalle seule', name:'Dalle'},
  {id:'cheminee', type:'cheminee', icon:'🔥', label:'Cheminée', name:'Cheminée'}
];

const defaultState = () => ({
  step:0,
  mode:'simple',
  simpleType:'murs',
  simple:{},
  globals:{workers:1, complexity:'moyenne', truck:false, truckPrice:TRUCK_8X4_DEFAULT, truckDays:1, pump:false, toupie:false, toupies:1},
  elements:[],
  manualPrices:{},
  result:null
});
let state = loadState();

const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => [...root.querySelectorAll(sel)];
const num = v => { const n=Number(String(v??'').replace(',','.')); return Number.isFinite(n)?n:0; };
const fmt = (n,d=2) => Number(n||0).toLocaleString('fr-FR',{minimumFractionDigits:d,maximumFractionDigits:d});
const money = n => `${fmt(n,2)} €`;
const esc = s => String(s??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const uid = () => (crypto.randomUUID ? crypto.randomUUID() : `m-${Date.now()}-${Math.random().toString(16).slice(2)}`);

function loadState(){
  try{const x=JSON.parse(localStorage.getItem(STORAGE_KEY));return {...defaultState(),...x,globals:{...defaultState().globals,...(x?.globals||{})}}}catch{return defaultState()}
}
function saveState(){localStorage.setItem(STORAGE_KEY,JSON.stringify({...state,result:null}));}
function workOptions(ids){return ids.map(id=>WORK_BY_ID[id]).filter(Boolean).map(r=>`<option value="${r.id}">${esc(r.label)} — MO ${r.moHParUnite} h/${r.unite}</option>`).join('');}
function chimneyOptions(obj, selected, emptyLabel){
  return `${emptyLabel?`<option value="">${emptyLabel}</option>`:''}`+Object.entries(obj).map(([id,r])=>`<option value="${id}" ${selected===id?'selected':''}>${esc(r.label)}</option>`).join('');
}
function field(label,key,value='',opts={}){
  const {type='number',step='any',min='0',placeholder='',scope='simple',required=false,help='',options=null}=opts;
  const attr = scope==='global'?'data-global':scope==='simple'?'data-simple':'data-field';
  let control;
  if(options){control=`<select ${attr}="${key}">${options}</select>`;}
  else control=`<input ${attr}="${key}" type="${type}" step="${step}" min="${min}" placeholder="${placeholder}" value="${esc(value)}">`;
  return `<div class="field"><label class="${required?'required':''}">${label}</label>${control}${help?`<small>${help}</small>`:''}</div>`;
}
function check(label,key,checked=false,scope='simple'){
  const attr=scope==='global'?'data-global':scope==='simple'?'data-simple':'data-field';
  return `<label class="check"><input ${attr}="${key}" type="checkbox" ${checked?'checked':''}><span>${label}</span></label>`;
}

function render(){
  renderSteps();
  const host=$('#stepHost');
  if(state.step===0) host.innerHTML=renderMode();
  if(state.step===1) host.innerHTML=renderWorks();
  if(state.step===2) host.innerHTML=renderConfig();
  if(state.step===3) host.innerHTML=renderOptions();
  if(state.step===4) host.innerHTML=renderResult();
  $('#prevBtn').disabled=state.step===0;
  $('#prevBtn').style.opacity=state.step===0?.45:1;
  $('#nextBtn').textContent=state.step===4?'Recalculer':'Suivant →';
  $('#footerNote').textContent=state.mode==='simple'?'Mode simple — un ouvrage':'Mode multiple — plusieurs éléments cumulés';
  bindEvents();
}
function renderSteps(){
  $('#stepsNav').innerHTML=steps.map((s,i)=>`<div class="step-chip ${i===state.step?'active':i<state.step?'done':''}"><span class="num">${i<state.step?'✓':i+1}</span>${s}</div>`).join('');
}

function renderMode(){
  const g=state.globals;
  return `<div class="section-title"><h2>Mode de chiffrage</h2><p>Le module conserve les deux parcours historiques SpeedArti. Le mode inactif est nettoyé pour éviter toute contamination des calculs.</p></div>
  <div class="grid cols-2">
    <button class="choice-card mode-card ${state.mode==='simple'?'selected':''}" data-mode="simple"><span class="icon">▣</span><span><strong>Mode simple</strong><small>Un seul ouvrage : mur, dalle, fondation, escalier, terrasse ou cheminée.</small></span></button>
    <button class="choice-card mode-card ${state.mode==='multiple'?'selected':''}" data-mode="multiple"><span class="icon">▦</span><span><strong>Mode multi-éléments</strong><small>Ajouter plusieurs fondations, murs, dalles, escaliers ou cheminées et additionner les résultats.</small></span></button>
  </div>
  <div class="separator"></div>
  <div class="section-title"><h2>Paramètres entreprise / chantier</h2><p>Ces données sont obligatoires pour calculer le coût de main-d’œuvre et la TVA. Aucun taux caché n’est imposé.</p></div>
  <div class="grid cols-3">
    ${field('Taux horaire Maçon HT (€ / h)','hourly',g.hourly??'',{scope:'global',step:'0.01',required:true,placeholder:'Ex. votre taux entreprise'})}
    ${field('TVA chantier (%)','vat',g.vat??'',{scope:'global',step:'0.1',required:true,placeholder:'Ex. taux du chantier'})}
    ${field("Nombre d'ouvriers",'workers',g.workers??1,{scope:'global',step:'1',min:'1',required:true})}
  </div>
  <div class="info-box">Heures-homme = somme des temps de travail. Durée chantier = heures-homme ÷ nombre d’ouvriers. Le coût de main-d’œuvre reste calculé sur les heures-homme totales.</div>`;
}

function renderWorks(){
  if(state.mode==='simple'){
    return `<div class="section-title"><h2>Type d'ouvrage</h2><p>Écran repris du module Maçon SpeedArti : choisissez l’ouvrage à chiffrer.</p></div>
      <div class="trade-grid">${simpleTypes.map(t=>`<button class="choice-card ${state.simpleType===t.id?'selected':''}" data-simple-type="${t.id}"><span class="icon">${t.icon}</span><strong>${t.label}</strong><small>${t.desc}</small></button>`).join('')}</div>`;
  }
  return `<div class="section-title"><h2>Sélectionnez les éléments du chantier</h2><p>Vous pouvez ajouter plusieurs éléments et plusieurs fois le même type.</p></div>
    <div class="trade-grid">${multiCards.map(c=>`<button class="choice-card" data-add-element="${c.id}"><span class="icon">${c.icon}</span><strong>${c.label}</strong><small>Cliquer pour ajouter</small></button>`).join('')}</div>
    ${state.elements.length?`<div class="added-list">${state.elements.map(e=>`<span class="pill">${iconFor(e.type)} ${esc(e.name)} <button type="button" data-remove-element="${e.id}" title="Supprimer">×</button></span>`).join('')}</div>`:`<div class="info-box">Aucun élément ajouté pour le moment.</div>`}`;
}

function iconFor(t){return ({fondations:'🏗️',murs_porteurs:'🧱',murs_elevations:'🏠',escalier:'⭐',dalle:'🟫',cheminee:'🔥'})[t]||'•'}
function newElement(cardId){
  const c=multiCards.find(x=>x.id===cardId); if(!c)return;
  const n=state.elements.filter(e=>e.type===c.type).length+1;
  const data={};
  if(c.type==='fondations') data.foundationType='vide_sanitaire';
  if(c.type==='murs_porteurs'){data.method='coule_sur_place';data.thickness=20;data.prefabType='standard'}
  if(c.type==='murs_elevations'){data.material='parpaing';data.thickness=20;data.chainH=true;data.chainV=true;data.openingsArea=0}
  if(c.type==='escalier') data.stairType='droit';
  if(c.type==='dalle'){data.thickness=12;data.fibreType='courante'}
  if(c.type==='cheminee'){data.conduit='20x20';data.stack='';data.cap='';data.count=1}
  state.elements.push({id:uid(),type:c.type,name:`${c.name} ${n}`,data});
}

function renderConfig(){
  if(state.mode==='simple') return renderSimpleConfig();
  if(!state.elements.length) return `<div class="section-title"><h2>Configuration des éléments</h2><p>Ajoutez d’abord au moins un élément à l’étape précédente.</p></div><div class="alert warn">⚠️ Aucun élément sélectionné.</div>`;
  return `<div class="section-title"><h2>Configuration des éléments</h2><p>Renseignez les dimensions et caractéristiques de chaque élément.</p></div>${state.elements.map(renderElementConfig).join('')}`;
}

function renderSimpleConfig(){
  const d=state.simple;
  if(state.simpleType==='murs') return `<div class="section-title"><h2>Dimensions de l'ouvrage</h2><p>Murs / Cloisons — aucune ancienne consommation cachée n’est reprise.</p></div>
    <div class="grid cols-3">${field('Longueur totale murs (m)','length',d.length??'',{required:true,step:'0.1'})}${field('Hauteur (m)','height',d.height??'',{required:true,step:'0.1'})}${field('Épaisseur (cm)','thickness',d.thickness??'',{required:true,step:'1'})}</div>
    <div class="separator"></div><div class="grid cols-3">${field('Consommation blocs (u/m²)','blocksPerM2',d.blocksPerM2??'',{required:true,step:'0.1'})}${field('Mortier / colle (kg/m²)','mortarKgM2',d.mortarKgM2??'',{step:'0.1'})}${field('Temps de pose (h-homme/m²)','wallHPerM2',d.wallHPerM2??'',{required:true,step:'0.01'})}</div>`;
  if(state.simpleType==='dalle'||state.simpleType==='terrasse'){
    const ids=['dallage_non_arme','dallage_arme','dalle_pleine_ba','dalle_pleine_fortement_armee','dalle_portee','plancher_poutrelles_hourdis','plancher_predalles'];
    return `<div class="section-title"><h2>Dimensions de l'ouvrage</h2><p>${state.simpleType==='terrasse'?'Terrasse':'Dalle / Chape'} — sélection d’un référentiel validé.</p></div>
      <div class="grid cols-3">${field('Surface (m²)','surface',d.surface??'',{required:true,step:'0.5'})}${field('Épaisseur (cm)','thickness',d.thickness??'',{required:true,step:'1'})}${field('Type de dalle de référence','slabRef',d.slabRef??'',{required:true,type:'select',options:`<option value="">Choisir…</option>${workOptions(ids)}`})}</div>`;
  }
  if(state.simpleType==='fondations') return `<div class="section-title"><h2>Dimensions de l'ouvrage</h2><p>Semelle : longueur en m, largeur et épaisseur béton en cm. La profondeur de fouille reste séparée.</p></div>
    <div class="grid cols-4">${field('Longueur semelle (m)','length',d.length??'',{required:true,step:'0.1'})}${field('Largeur semelle (cm)','widthCm',d.widthCm??'',{required:true,step:'1'})}${field('Épaisseur / hauteur béton (cm)','heightCm',d.heightCm??'',{required:true,step:'1'})}${field('Profondeur de fouille (m)','excavationDepth',d.excavationDepth??'',{step:'0.05'})}</div><div class="info-box">La profondeur de fouille ne remplace jamais l’épaisseur réelle de la semelle béton.</div>`;
  if(state.simpleType==='escalier') return `<div class="section-title"><h2>Dimensions de l'ouvrage</h2><p>Le calcul utilise la surface réelle de l’escalier et le référentiel « Escalier BA ».</p></div><div class="grid cols-2">${field("Surface réelle de l'escalier (m²)",'surface',d.surface??'',{required:true,step:'0.1'})}${field('Hauteur à franchir (m) — information','height',d.height??'',{step:'0.01'})}</div>`;
  if(state.simpleType==='cheminee') return `<div class="section-title"><h2>Dimensions de l'ouvrage</h2><p>Cheminée — prix et temps issus de l’annexe validée par Guillaume.</p></div>
    <div class="grid cols-3">${field('Hauteur du conduit (ml)','height',d.height??'',{required:true,step:'0.1'})}${field('Nombre de conduits','count',d.count??1,{required:true,step:'1',min:'1'})}${field('Type de conduit','conduit',d.conduit??'20x20',{options:chimneyOptions(CHIMNEY_CONDUITS,d.conduit??'20x20')})}</div>
    <div class="grid cols-3" style="margin-top:14px">${field('Souche','stack',d.stack??'',{options:chimneyOptions(CHIMNEY_STACKS,d.stack??'','Aucune')})}${field('Chapeau','cap',d.cap??'',{options:chimneyOptions(CHIMNEY_CAPS,d.cap??'','Aucun')})}${field('Prix manuel HT (€) — facultatif','manualPrice',d.manualPrice??'',{step:'1',help:'Remplace le prix automatique mais conserve la durée calculée.'})}</div>`;
  return '';
}

function renderElementConfig(e){
  const d=e.data;
  let body='';
  if(e.type==='fondations') body=renderFoundationElement(e);
  if(e.type==='murs_porteurs') body=renderBearingWallElement(e);
  if(e.type==='murs_elevations') body=renderElevationElement(e);
  if(e.type==='escalier') body=renderStairElement(e);
  if(e.type==='dalle') body=renderSlabElement(e);
  if(e.type==='cheminee') body=renderChimneyElement(e);
  return `<div class="element-card"><header><div><strong>${iconFor(e.type)} ${esc(e.name)}</strong> <span class="badge">${esc(e.type.replaceAll('_',' '))}</span></div><button class="btn danger small" data-remove-element="${e.id}" type="button">Supprimer</button></header><div class="body" data-element-root="${e.id}">${body}</div></div>`;
}
function ef(e,label,key,value='',opts={}){return field(label,key,value,{...opts,scope:'element'}).replaceAll('data-field=',`data-el-id="${e.id}" data-field=`)}
function ec(e,label,key,checked=false){return check(label,key,checked,'element').replace('data-field=',`data-el-id="${e.id}" data-field=`)}

function renderFoundationElement(e){
  const d=e.data;
  const typeOpts=`<option value="micro_pieux" ${d.foundationType==='micro_pieux'?'selected':''}>Micro-pieux</option><option value="plot_isole" ${d.foundationType==='plot_isole'?'selected':''}>Plot isolé</option><option value="vide_sanitaire" ${d.foundationType==='vide_sanitaire'?'selected':''}>Vide sanitaire</option><option value="terre_plein" ${d.foundationType==='terre_plein'?'selected':''}>Terre plein</option>`;
  let sub=`${ef(e,'Type de fondation','foundationType',d.foundationType,{options:typeOpts})}`;
  if(d.foundationType==='micro_pieux') sub+=`<div class="grid cols-3" style="margin-top:14px">${ef(e,'Nombre de micro-pieux','microCount',d.microCount??'',{required:true,step:'1'})}${ef(e,'Prix HT par micro-pieu','microPrice',d.microPrice??'',{required:true,step:'1'})}${ef(e,'Temps MO par micro-pieu (h-homme)','microHours',d.microHours??'',{required:true,step:'0.1'})}</div><div class="grid cols-3" style="margin-top:14px">${ef(e,'Longrine longueur (m)','beamLength',d.beamLength??'',{step:'0.1'})}${ef(e,'Largeur section (cm)','beamWidthCm',d.beamWidthCm??'',{step:'1'})}${ef(e,'Hauteur section (cm)','beamHeightCm',d.beamHeightCm??'',{step:'1'})}</div>`;
  if(d.foundationType==='plot_isole') sub+=`<div class="grid cols-3" style="margin-top:14px">${ef(e,'Quantité de plots','plotCount',d.plotCount??'',{required:true,step:'1'})}${ef(e,'Interprétation du volume','plotVolumeMode',d.plotVolumeMode??'',{required:true,options:`<option value="">Choisir…</option><option value="unitaire">Volume par plot</option><option value="total">Volume total</option>`})}${ef(e,d.plotVolumeMode==='unitaire'?'Volume par plot (m³)':'Volume total (m³)','plotVolume',d.plotVolume??'',{required:true,step:'0.01'})}</div>`;
  if(['vide_sanitaire','terre_plein'].includes(d.foundationType)) sub+=`<div class="grid cols-4" style="margin-top:14px">${ef(e,'Périmètre soubassement (m)','perimeter',d.perimeter??'',{required:true,step:'0.1'})}${ef(e,'Largeur semelle (cm)','footingWidthCm',d.footingWidthCm??'',{required:true,step:'1'})}${ef(e,'Hauteur semelle (cm)','footingHeightCm',d.footingHeightCm??'',{required:true,step:'1'})}${ef(e,'Hauteur bloc (m)','blockHeight',d.blockHeight??'',{step:'0.01'})}</div><div class="grid cols-4" style="margin-top:14px">${ef(e,'Nombre de rangs','rows',d.rows??'',{step:'1'})}${ef(e,'Blocs (u/m²)','blocksPerM2',d.blocksPerM2??'',{step:'0.1'})}${ef(e,'Temps mur (h/m²)','wallHPerM2',d.wallHPerM2??'',{step:'0.01'})}${ef(e,'Raidisseurs (nb)','stiffeners',d.stiffeners??'',{step:'1'})}</div><div class="grid cols-2" style="margin-top:14px">${ef(e,'Surface dalle associée (m²)','slabSurface',d.slabSurface??'',{step:'0.1'})}${ef(e,'Type dalle associée','slabRef',d.slabRef??'',{options:`<option value="">Aucune / choisir…</option>${workOptions(['dallage_non_arme','dallage_arme','dalle_pleine_ba','dalle_portee','plancher_poutrelles_hourdis','plancher_predalles'])}`})}</div>`;
  return sub;
}
function renderBearingWallElement(e){const d=e.data;return `<div class="grid cols-4">${ef(e,'Longueur / périmètre (m)','length',d.length??'',{required:true,step:'0.1'})}${ef(e,'Hauteur (m)','height',d.height??'',{required:true,step:'0.1'})}${ef(e,'Épaisseur (cm)','thickness',d.thickness??20,{required:true,step:'1'})}${ef(e,'Méthode','method',d.method??'coule_sur_place',{options:`<option value="coule_sur_place">Coulé sur place</option><option value="prefabrique">Préfabriqué</option>`})}</div>${d.method==='prefabrique'?`<div class="grid cols-3" style="margin-top:14px">${ef(e,'Type préfabriqué','prefabType',d.prefabType??'standard',{options:`<option value="standard">Standard — 1,55 h-homme/ml</option><option value="hauteur_importante">Hauteur importante — 1,90 h-homme/ml</option><option value="lourd_complexe">Lourd / complexe — 2,75 h-homme/ml</option>`})}${ef(e,'Prix fourniture base HT/ml','baseSupplyPrice',d.baseSupplyPrice??'',{step:'1',help:'+30 % uniquement si aucun prix fournisseur réel.'})}${ef(e,'Prix fournisseur réel HT/ml','realSupplyPrice',d.realSupplyPrice??'',{step:'1',help:'S’il est renseigné, il remplace la règle +30 %.'})}</div><div class="info-box">${PREFAB_TEAM_ADVICE}</div>`:`<div class="alert warn">${STRUCTURE_WARNING}</div>`}${renderChainFields(e,d)}`}
function renderChainFields(e,d){return `<div class="separator"></div><div class="grid cols-2">${ef(e,'Chaînage horizontal total (ml)','chainHml',d.chainHml??'',{step:'0.1'})}${ef(e,'Chaînage vertical total (ml)','chainVml',d.chainVml??'',{step:'0.1'})}</div><p class="tiny muted">Aucun linéaire de chaînage n’est inventé automatiquement.</p>`}
function renderElevationElement(e){const d=e.data;return `<div class="grid cols-4">${ef(e,'Périmètre / longueur (m)','length',d.length??'',{required:true,step:'0.1'})}${ef(e,'Hauteur (m)','height',d.height??'',{required:true,step:'0.1'})}${ef(e,'Épaisseur (cm)','thickness',d.thickness??20,{required:true,step:'1'})}${ef(e,'Matériau','material',d.material??'parpaing',{options:`<option value="parpaing">Parpaing</option><option value="brique">Brique</option><option value="siporex">Siporex</option><option value="beton_banche">Béton banché</option>`})}</div>${d.material!=='beton_banche'?`<div class="grid cols-3" style="margin-top:14px">${ef(e,'Consommation blocs (u/m²)','blocksPerM2',d.blocksPerM2??'',{required:true,step:'0.1'})}${ef(e,'Temps pose (h-homme/m²)','wallHPerM2',d.wallHPerM2??'',{required:true,step:'0.01'})}${ef(e,'Surface réelle des ouvertures (m²)','openingsArea',d.openingsArea??0,{step:'0.1'})}</div>`:`<div class="grid cols-2" style="margin-top:14px">${ef(e,'Surface réelle des ouvertures (m²)','openingsArea',d.openingsArea??0,{step:'0.1'})}<div class="alert warn" style="margin:0">${STRUCTURE_WARNING}</div></div>`}${renderChainFields(e,d)}`}
function renderStairElement(e){const d=e.data;return `<div class="grid cols-3">${ef(e,'Surface réelle (m²)','surface',d.surface??'',{step:'0.1'})}${ef(e,'Prix manuel HT (€) — facultatif','manualPrice',d.manualPrice??'',{step:'1'})}${ef(e,'Temps manuel si prix manuel (h)','manualHours',d.manualHours??'',{step:'0.1'})}</div><p class="tiny muted">Sans prix manuel, le référentiel « Escalier BA » est utilisé.</p>`}
function renderSlabElement(e){const d=e.data;const ids=['dallage_non_arme','dallage_arme','dalle_pleine_ba','dalle_pleine_fortement_armee','dalle_portee','plancher_poutrelles_hourdis','plancher_predalles'];return `<div class="grid cols-4">${ef(e,'Longueur (m)','length',d.length??'',{required:true,step:'0.1'})}${ef(e,'Largeur (m)','width',d.width??'',{required:true,step:'0.1'})}${ef(e,'Épaisseur (cm)','thickness',d.thickness??12,{required:true,step:'1'})}${ef(e,'Type de dalle','slabRef',d.slabRef??'',{required:true,options:`<option value="">Choisir…</option>${workOptions(ids)}`})}</div><div class="grid cols-3" style="margin-top:14px"><div class="panel soft">${ec(e,'Treillis soudé','treillis',!!d.treillis)}<br>${ec(e,'Fibres','fibres',!!d.fibres)}</div>${d.fibres?ef(e,'Type de fibres','fibreType',d.fibreType??'courante',{options:Object.entries(FIBRES).map(([id,r])=>`<option value="${id}">${r.label} — ${r.min} à ${r.max} kg/m³</option>`).join('')}):''}${d.fibres?ef(e,'Dosage retenu (kg/m³)','fibreDose',d.fibreDose??'',{required:true,step:'0.1'}):''}</div>`}
function renderChimneyElement(e){const d=e.data;return `<div class="grid cols-3">${ef(e,'Hauteur conduit (ml)','height',d.height??'',{required:true,step:'0.1'})}${ef(e,'Nombre de conduits','count',d.count??1,{required:true,step:'1',min:'1'})}${ef(e,'Type de conduit','conduit',d.conduit??'20x20',{options:chimneyOptions(CHIMNEY_CONDUITS,d.conduit??'20x20')})}</div><div class="grid cols-3" style="margin-top:14px">${ef(e,'Souche','stack',d.stack??'',{options:chimneyOptions(CHIMNEY_STACKS,d.stack??'','Aucune')})}${ef(e,'Chapeau','cap',d.cap??'',{options:chimneyOptions(CHIMNEY_CAPS,d.cap??'','Aucun')})}${ef(e,'Prix manuel HT (€) — facultatif','manualPrice',d.manualPrice??'',{step:'1'})}</div>`}

function renderOptions(){
  const g=state.globals,d=state.simple;
  let specific='';
  if(state.mode==='simple' && state.simpleType==='murs') specific=`<details class="accordion" open><summary>🏗️ Matériaux de construction</summary><div class="accordion-body"><div class="grid cols-2">${field('Type de bloc / matériau','material',d.material??'parpaing',{options:`<option value="parpaing">Parpaing</option><option value="brique">Brique de terre cuite</option><option value="beton_cellulaire">Béton cellulaire (Siporex)</option><option value="pierre">Pierre naturelle</option>`})}${field('Méthode de pose','method',d.method??'tradi',{options:`<option value="tradi">Traditionnelle (mortier)</option><option value="colle">Collée (joint mince)</option>`})}</div><div class="separator"></div>${check('Chaînage horizontal','chainH',!!d.chainH)} ${check('Chaînage vertical','chainV',!!d.chainV)}${d.chainH||d.chainV?`<div class="grid cols-2" style="margin-top:12px">${d.chainH?field('Linéaire horizontal total (ml)','chainHml',d.chainHml??'',{step:'0.1'}):''}${d.chainV?field('Linéaire vertical total (ml)','chainVml',d.chainVml??'',{step:'0.1'}):''}</div>`:''}</div></details>`;
  if(state.mode==='simple' && ['dalle','terrasse'].includes(state.simpleType)) specific=`<details class="accordion" open><summary>⬜ Options dalle</summary><div class="accordion-body">${check('Treillis soudé','treillis',!!d.treillis)}<br>${check('Fibres','fibres',!!d.fibres)}${d.fibres?`<div class="grid cols-2" style="margin-top:12px">${field('Type de fibres','fibreType',d.fibreType??'courante',{options:Object.entries(FIBRES).map(([id,r])=>`<option value="${id}">${r.label} — ${r.min} à ${r.max} kg/m³</option>`).join('')})}${field('Dosage retenu (kg/m³)','fibreDose',d.fibreDose??'',{required:true,step:'0.1'})}</div><div class="alert warn">${FIBRE_WARNING}</div>`:''}${state.simpleType==='terrasse'?`<div class="separator"></div>${check('Étanchéité terrasse — prix explicite requis','terraceWaterproof',!!d.terraceWaterproof)}<br>${check('Isolation sous dalle — prix explicite requis','terraceInsulation',!!d.terraceInsulation)}`:''}</div></details>`;
  return `<div class="section-title"><h2>Options chantier</h2><p>Les options conservées ont un effet réel ou déclenchent une alerte explicite. Aucun ancien coefficient silencieux n’est appliqué.</p></div>
  <div class="panel"><h3>Niveau de complexité</h3><div class="grid cols-3">${['simple','moyenne','complexe'].map(x=>`<button class="choice-card ${g.complexity===x?'selected':''}" data-complexity="${x}"><strong>${x[0].toUpperCase()+x.slice(1)}</strong><small>${x==='simple'?'Géométrie droite':x==='moyenne'?'Quelques angles':'Formes complexes'}</small></button>`).join('')}</div><p class="tiny muted">Information / alertes uniquement : aucun coefficient automatique global.</p></div>
  <div class="separator"></div>${specific}
  <details class="accordion" open><summary>🚚 Transport / préparation</summary><div class="accordion-body"><div class="grid cols-2"><div>${check('Camion-benne 8×4','truck',!!g.truck,'global')}${g.truck?`<div class="grid cols-2" style="margin-top:10px">${field('Prix HT / jour','truckPrice',g.truckPrice??TRUCK_8X4_DEFAULT,{scope:'global',step:'1'})}${field('Nombre de jours','truckDays',g.truckDays??1,{scope:'global',step:'1',min:'1'})}</div>`:''}</div><div>${check('Camion pompe — prix catalogue / manuel requis','pump',!!g.pump,'global')}<br>${check('Toupie béton — prix catalogue / manuel requis','toupie',!!g.toupie,'global')}${g.toupie?`<div style="margin-top:10px">${field('Nombre de toupies','toupies',g.toupies??1,{scope:'global',step:'1',min:'1'})}</div>`:''}</div></div></div></details>
  <details class="accordion"><summary>⛏️ Préparation et accès</summary><div class="accordion-body">${check('Terrassement — prix explicite requis','earthworks',!!g.earthworks,'global')}<br>${check('Remblaiement — prix explicite requis','backfill',!!g.backfill,'global')}<br>${check('Échafaudage — prix explicite requis','scaffold',!!g.scaffold,'global')}<br>${check('Accès difficile — information / plus-value manuelle','difficultAccess',!!g.difficultAccess,'global')}</div></details>
  <details class="accordion"><summary>🎨 Finitions</summary><div class="accordion-body">${check('Enduit de finition — prix explicite requis','finishCoat',!!g.finishCoat,'global')}<br>${check('Enduit hydrofuge — prix explicite requis','waterproofCoat',!!g.waterproofCoat,'global')}</div></details>`;
}

function commonLines(){
  const g=state.globals,lines=[];
  if(g.truck) lines.push(line('truck8x4','Camion-benne 8×4','Transport / location',Math.max(1,num(g.truckDays)||1),'jour',num(g.truckPrice)||TRUCK_8X4_DEFAULT,true));
  if(g.pump) lines.push(line('pump','Camion pompe béton','Transport béton',1,'forfait'));
  if(g.toupie) lines.push(line('toupie','Toupie béton','Transport béton',Math.max(1,num(g.toupies)||1),'unité'));
  return lines;
}
function line(id,name,category,qty,unit,price=0,fixed=false){return {id,name,category,qty:Math.max(0,num(qty)),unit,price:Math.max(0,num(price)),fixed};}
function addRefLines(lines,ref,quantity,prefix){
  const q=num(quantity); if(q<=0||!ref)return 0;
  if(ref.betonParUnite>0) lines.push(line(`${prefix}-beton`,`Béton — ${ref.label}`,'Béton',q*ref.betonParUnite,'m³'));
  if(ref.acierParUnite>0) lines.push(line(`${prefix}-acier`,`Acier indicatif — ${ref.label}`,'Ferraillage',q*ref.acierParUnite,'kg'));
  if(ref.coffrageParUnite>0) lines.push(line(`${prefix}-coffrage`,`Coffrage — ${ref.label}`,'Coffrage',q*ref.coffrageParUnite,'m²'));
  return q*ref.moHParUnite;
}
function addChainage(lines,hml,vml,prefix='chain'){
  let h=0;
  if(num(hml)>0) h+=addRefLines(lines,WORK_BY_ID.chainage_horizontal,num(hml),`${prefix}-h`);
  if(num(vml)>0) h+=addRefLines(lines,WORK_BY_ID.chainage_vertical,num(vml),`${prefix}-v`);
  return h;
}
function calcChimney(d,prefix='chimney'){
  const lines=[],alerts=[]; const height=num(d.height),count=Math.max(1,num(d.count)||1);
  if(height<=0) alerts.push('🚨 Hauteur de conduit obligatoire.');
  const c=CHIMNEY_CONDUITS[d.conduit||'20x20']; let hours=0,override=0;
  if(c&&height>0){lines.push(line(`${prefix}-conduit`,c.label,'Cheminée',height*count,'ml',c.supply,true));hours+=height*count*c.h;override+=height*count*(c.total-c.supply)}
  if(d.stack&&CHIMNEY_STACKS[d.stack]){const r=CHIMNEY_STACKS[d.stack];lines.push(line(`${prefix}-stack`,r.label,'Cheminée',1,'unité',r.supply,true));hours+=r.h;override+=r.total-r.supply}
  if(d.cap&&CHIMNEY_CAPS[d.cap]){const r=CHIMNEY_CAPS[d.cap];lines.push(line(`${prefix}-cap`,r.label,'Cheminée',1,'unité',r.supply,true));hours+=r.h;override+=r.total-r.supply}
  if(num(d.manualPrice)>0) return {lines:[line(`${prefix}-manual`,'Cheminée — prix manuel','Cheminée',1,'forfait',num(d.manualPrice),true)],hours,laborOverride:0,alerts,reco:['Le prix manuel remplace le prix automatique ; la durée reste calculée.']};
  return {lines,hours,laborOverride:override,alerts,reco:['Temps et prix issus de l’annexe cheminée validée par Guillaume.']};
}

function calculate(){
  const alerts=[],reco=[],lines=[]; const labor=[];
  const hourly=num(state.globals.hourly),vat=num(state.globals.vat),workers=Math.max(1,num(state.globals.workers)||1);
  if(!(hourly>0)) alerts.push('🚨 Taux horaire Maçon manquant.');
  if(state.globals.vat===''||state.globals.vat==null||!Number.isFinite(Number(state.globals.vat))) alerts.push('🚨 Taux de TVA du chantier manquant.');
  const pushLabor=(name,hours,override)=>{if(num(hours)>0||typeof override==='number') labor.push({name,hours:num(hours),override});};
  if(state.mode==='simple') calcSimple(lines,labor,alerts,reco,pushLabor); else calcMultiple(lines,labor,alerts,reco,pushLabor);
  lines.push(...commonLines());
  addNonPricedOptionAlerts(alerts);
  const enriched=lines.map(l=>({...l,price:l.fixed?l.price:(num(state.manualPrices[l.id])||l.price||0)}));
  enriched.filter(l=>l.qty>0&&l.price<=0).forEach(l=>alerts.push(`🚨 PRIX MANQUANT — ${l.name} : renseigner le catalogue ou saisir un prix manuel avant finalisation.`));
  const materials=enriched.reduce((s,l)=>s+l.qty*l.price,0);
  const laborCost=labor.reduce((s,p)=>s+(typeof p.override==='number'?p.override:p.hours*hourly),0);
  const hours=labor.reduce((s,p)=>s+p.hours,0),duration=hours/workers;
  const totalHT=materials+laborCost,tax=totalHT*(vat/100),ttc=totalHT+tax;
  return {lines:enriched,labor,alerts:[...new Set(alerts)],reco:[...new Set(reco)],hours,duration,workers,hourly,vat,materials,laborCost,totalHT,tax,ttc};
}

function calcSimple(lines,labor,alerts,reco,pushLabor){
  const d=state.simple;
  if(state.simpleType==='murs'){
    const L=num(d.length),H=num(d.height),T=num(d.thickness),cons=num(d.blocksPerM2),th=num(d.wallHPerM2),surface=L*H;
    if(!(L>0&&H>0&&T>0)) alerts.push('🚨 Dimensions du mur incomplètes.');
    if(!(cons>0)) alerts.push('🚨 Consommation blocs/m² à renseigner.');
    if(!(th>0)) alerts.push('🚨 Temps de pose h/m² à renseigner.');
    if(surface>0&&cons>0) lines.push(line(`wall-block-${d.material||'parpaing'}`,`${d.material||'parpaing'} ${T||''} cm`,'Maçonnerie',surface*cons,'unité'));
    if(surface>0&&num(d.mortarKgM2)>0) lines.push(line('wall-mortar','Mortier / colle maçonnerie','Liants',surface*num(d.mortarKgM2),'kg'));
    let ch=0;if(d.chainH&&!num(d.chainHml))alerts.push('🚨 Linéaire de chaînage horizontal obligatoire.');if(d.chainV&&!num(d.chainVml))alerts.push('🚨 Linéaire de chaînage vertical obligatoire.');ch=addChainage(lines,d.chainH?d.chainHml:0,d.chainV?d.chainVml:0,'simple-wall-chain');
    pushLabor('Maçonnerie murs',surface*th);if(ch)pushLabor('Chaînages',ch);reco.push('Les consommations et le temps de maçonnerie proviennent des valeurs explicites de l’artisan/catalogue.');
  }
  if(['dalle','terrasse'].includes(state.simpleType)){
    const s=num(d.surface),ep=num(d.thickness),ref=WORK_BY_ID[d.slabRef]; if(!(s>0&&ep>0))alerts.push('🚨 Surface et épaisseur de dalle obligatoires.');if(!ref)alerts.push('🚨 Choisir le type de dalle de référence.');
    if(s>0&&ep>0) lines.push(line('slab-concrete','Béton dalle','Béton',s*(ep/100),'m³'));
    if(ref&&d.treillis)lines.push(line('slab-steel',`Acier indicatif — ${ref.label}`,'Ferraillage',s*ref.acierParUnite,'kg'));
    if(d.fibres){const f=FIBRES[d.fibreType||'courante'],dose=num(d.fibreDose);if(!(dose>0))alerts.push('🚨 Dosage de fibres à confirmer manuellement.');if(dose>0&&s>0&&ep>0){lines.push(line('slab-fibres',`Fibres — ${f.label}`,'Ferraillage',s*(ep/100)*dose,'kg'));if(dose<f.min||dose>f.max)alerts.push(`⚠️ Dosage fibres hors plage indicative ${f.min}–${f.max} kg/m³.`)}alerts.push(FIBRE_WARNING)}
    if(ref)pushLabor(ref.label,s*ref.moHParUnite);alerts.push(STRUCTURE_WARNING);if(s>0&&ep>0)reco.push(`Volume béton réel selon épaisseur saisie : ${fmt(s*(ep/100),3)} m³.`);
  }
  if(state.simpleType==='fondations'){
    const L=num(d.length),W=num(d.widthCm),H=num(d.heightCm),vol=L*(W/100)*(H/100),ref=WORK_BY_ID.semelle_filante;if(!(vol>0))alerts.push('🚨 Longueur, largeur et épaisseur de semelle obligatoires.');if(vol>0){lines.push(line('foot-concrete','Béton semelle filante','Béton',vol,'m³'));lines.push(line('foot-steel','Acier indicatif semelle filante','Ferraillage',vol*ref.acierParUnite,'kg'));lines.push(line('foot-form','Coffrage indicatif semelle filante','Coffrage',vol*ref.coffrageParUnite,'m²'));pushLabor('Semelle filante',vol*ref.moHParUnite);reco.push(`Volume semelle = ${L} × (${W}/100) × (${H}/100) = ${fmt(vol,3)} m³.`);reco.push(`Profondeur de fouille séparée : ${fmt(num(d.excavationDepth),2)} m.`)}alerts.push(STRUCTURE_WARNING);
  }
  if(state.simpleType==='escalier'){
    const s=num(d.surface),ref=WORK_BY_ID.escalier_ba;if(!(s>0))alerts.push('🚨 Surface réelle de l’escalier obligatoire.');if(s>0){addRefLines(lines,ref,s,'stair');pushLabor(ref.label,s*ref.moHParUnite)}alerts.push(STRUCTURE_WARNING);
  }
  if(state.simpleType==='cheminee'){
    const c=calcChimney(d,'simple-chimney');lines.push(...c.lines);pushLabor('Cheminée / conduit',c.hours,c.laborOverride);alerts.push(...c.alerts);reco.push(...c.reco);
  }
}

function calcMultiple(lines,labor,alerts,reco,pushLabor){
  if(!state.elements.length){alerts.push('🚨 Aucun élément Maçon sélectionné.');return}
  alerts.push(STRUCTURE_WARNING);
  for(const e of state.elements){const d=e.data,p=e.id;
    if(e.type==='fondations') calcFoundationEl(e,lines,alerts,reco,pushLabor);
    if(e.type==='murs_porteurs'){
      const L=num(d.length),H=num(d.height),ep=num(d.thickness)/100;if(!(L>0&&H>0&&ep>0)){alerts.push(`🚨 ${e.name} : dimensions incomplètes.`);continue}
      let ch=addChainage(lines,d.chainHml,d.chainVml,`${p}-chain`);
      if(d.method==='prefabrique'){
        const hml=PREFAB_H_PER_ML[d.prefabType||'standard'];const real=num(d.realSupplyPrice),base=num(d.baseSupplyPrice),price=real>0?real:base>0?base*1.3:0;
        lines.push(line(`${p}-prefab`,`Mur préfabriqué béton — ${d.prefabType||'standard'}`,'Structure préfabriquée',L,'ml',price,price>0));pushLabor(e.name,L*hml+ch);reco.push(PREFAB_TEAM_ADVICE);if(!(price>0))alerts.push(`🚨 ${e.name} : prix fournisseur réel ou prix fourniture base obligatoire.`);
      }else{const s=L*H,ref=WORK_BY_ID.mur_banche_courant;lines.push(line(`${p}-concrete`,'Béton mur porteur coulé sur place','Béton',s*ep,'m³'));lines.push(line(`${p}-steel`,'Acier indicatif mur porteur','Ferraillage',s*ref.acierParUnite,'kg'));lines.push(line(`${p}-form`,'Coffrage mur porteur','Coffrage',s*ref.coffrageParUnite,'m²'));pushLabor(e.name,s*ref.moHParUnite+ch)}
    }
    if(e.type==='murs_elevations'){
      const L=num(d.length),H=num(d.height),gross=L*H,open=num(d.openingsArea),net=gross-open;if(!(L>0&&H>0)){alerts.push(`🚨 ${e.name} : dimensions incomplètes.`);continue}if(open>gross){alerts.push(`🚨 ${e.name} : ouvertures supérieures à la surface du mur.`);continue}
      const ch=addChainage(lines,d.chainHml,d.chainVml,`${p}-chain`);
      if(d.material==='beton_banche'){const ref=WORK_BY_ID.mur_banche_courant,ep=num(d.thickness)/100;lines.push(line(`${p}-concrete`,'Béton banché','Béton',net*ep,'m³'));lines.push(line(`${p}-steel`,'Acier indicatif mur banché','Ferraillage',net*ref.acierParUnite,'kg'));lines.push(line(`${p}-form`,'Coffrage mur banché','Coffrage',net*ref.coffrageParUnite,'m²'));pushLabor(e.name,net*ref.moHParUnite+ch)}else{if(!(num(d.blocksPerM2)>0))alerts.push(`🚨 ${e.name} : consommation blocs/m² manquante.`);else lines.push(line(`${p}-blocks`,`${d.material} ${d.thickness||20} cm`,'Maçonnerie',net*num(d.blocksPerM2),'unité'));if(!(num(d.wallHPerM2)>0))alerts.push(`🚨 ${e.name} : temps de pose h/m² manquant.`);pushLabor(e.name,net*num(d.wallHPerM2)+ch)}
    }
    if(e.type==='escalier'){
      if(num(d.manualPrice)>0){lines.push(line(`${p}-manual`,`${e.name} — prix manuel`,'Escalier',1,'forfait',num(d.manualPrice),true));pushLabor(e.name,num(d.manualHours));if(!(num(d.manualHours)>0))alerts.push(`⚠️ ${e.name} au prix manuel : durée chantier non renseignée.`)}else{const s=num(d.surface),ref=WORK_BY_ID.escalier_ba;if(!(s>0))alerts.push(`🚨 ${e.name} : surface m² ou prix manuel obligatoire.`);else{addRefLines(lines,ref,s,p);pushLabor(e.name,s*ref.moHParUnite)}}
    }
    if(e.type==='dalle'){
      const s=num(d.length)*num(d.width),ep=num(d.thickness),ref=WORK_BY_ID[d.slabRef];if(!(s>0&&ep>0)){alerts.push(`🚨 ${e.name} : dimensions incomplètes.`);continue}if(!ref){alerts.push(`🚨 ${e.name} : type de dalle de référence obligatoire.`);continue}lines.push(line(`${p}-concrete`,'Béton dalle','Béton',s*(ep/100),'m³'));if(d.treillis)lines.push(line(`${p}-steel`,'Acier indicatif dalle','Ferraillage',s*ref.acierParUnite,'kg'));if(d.fibres){const f=FIBRES[d.fibreType||'courante'],dose=num(d.fibreDose);if(dose>0)lines.push(line(`${p}-fibres`,`Fibres — ${f.label}`,'Ferraillage',s*(ep/100)*dose,'kg'));else alerts.push(`🚨 ${e.name} : dosage fibres manquant.`);alerts.push(FIBRE_WARNING)}pushLabor(e.name,s*ref.moHParUnite);
    }
    if(e.type==='cheminee'){const c=calcChimney(d,p);lines.push(...c.lines);pushLabor(e.name,c.hours,c.laborOverride);alerts.push(...c.alerts);reco.push(...c.reco)}
  }
}

function calcFoundationEl(e,lines,alerts,reco,pushLabor){
  const d=e.data,p=e.id;let h=0;
  if(d.foundationType==='micro_pieux'){
    const n=num(d.microCount),pr=num(d.microPrice),hu=num(d.microHours);if(n>0)lines.push(line(`${p}-micro`,'Micro-pieux', 'Fondations',n,'unité',pr,pr>0));if(n>0&&!(pr>0))alerts.push(`🚨 ${e.name} : prix micro-pieu manquant.`);if(n>0&&!(hu>0))alerts.push(`🚨 ${e.name} : temps par micro-pieu manquant.`);h+=n*hu;
    const L=num(d.beamLength),W=num(d.beamWidthCm),H=num(d.beamHeightCm);if(L||W||H){if(!(L>0&&W>0&&H>0))alerts.push(`🚨 ${e.name} : dimensions de longrine incomplètes.`);else{const v=L*(W/100)*(H/100),ref=WORK_BY_ID.longrine_fondation;h+=addRefLines(lines,ref,v,`${p}-beam`)}}
    reco.push('Micro-pieux : étude de sol G2 recommandée.');
  }
  if(d.foundationType==='plot_isole'){
    const n=num(d.plotCount),v=num(d.plotVolume);if(n>0&&v>0&&!d.plotVolumeMode)alerts.push(`🚨 ${e.name} : préciser si le volume est unitaire ou total.`);const total=d.plotVolumeMode==='unitaire'?n*v:d.plotVolumeMode==='total'?v:0;if(total>0)h+=addRefLines(lines,WORK_BY_ID.semelle_isolee,total,`${p}-plots`);
  }
  if(['vide_sanitaire','terre_plein'].includes(d.foundationType)){
    const per=num(d.perimeter),fw=num(d.footingWidthCm),fh=num(d.footingHeightCm),vol=per*(fw/100)*(fh/100);if(vol>0)h+=addRefLines(lines,WORK_BY_ID.semelle_filante,vol,`${p}-foot`);else alerts.push(`🚨 ${e.name} : semelle soubassement incomplète.`);
    const wallH=num(d.blockHeight)*num(d.rows),surf=per*wallH;if(surf>0){if(num(d.blocksPerM2)>0)lines.push(line(`${p}-blocks`,'Blocs soubassement','Maçonnerie',surf*num(d.blocksPerM2),'unité'));else alerts.push(`🚨 ${e.name} : consommation blocs/m² manquante.`);if(num(d.wallHPerM2)>0)h+=surf*num(d.wallHPerM2);else alerts.push(`🚨 ${e.name} : temps mur h/m² manquant.`)}
    const ml=num(d.stiffeners)*wallH;if(ml>0)h+=addRefLines(lines,WORK_BY_ID.potelet_raidisseur_vertical,ml,`${p}-stiff`);
    if(num(d.slabSurface)>0){const ref=WORK_BY_ID[d.slabRef];if(!ref)alerts.push(`🚨 ${e.name} : type de dalle associée obligatoire.`);else h+=addRefLines(lines,ref,num(d.slabSurface),`${p}-slab`)}
  }
  pushLabor(e.name,h);
}

function addNonPricedOptionAlerts(alerts){
  const g=state.globals; const opts=[['earthworks','Terrassement'],['backfill','Remblaiement'],['scaffold','Échafaudage'],['difficultAccess','Accès difficile'],['finishCoat','Enduit de finition'],['waterproofCoat','Enduit hydrofuge']];
  opts.forEach(([k,l])=>{if(g[k])alerts.push(`⚠️ ${l} sélectionné : aucune valeur silencieuse n’est appliquée ; catalogue/prix ou saisie explicite nécessaire.`)});
  if(state.mode==='simple'&&state.simpleType==='terrasse'){if(state.simple.terraceWaterproof)alerts.push('⚠️ Étanchéité terrasse : prix/quantité explicite nécessaire.');if(state.simple.terraceInsulation)alerts.push('⚠️ Isolation sous dalle : prix/quantité explicite nécessaire.');}
}

function renderResult(){
  state.result=calculate(); const r=state.result;
  const rows=r.lines.length?r.lines.map(l=>`<tr class="${l.qty>0&&l.price<=0?'missing-price':''}"><td><strong>${esc(l.name)}</strong><br><span class="muted">${esc(l.category)}</span></td><td>${fmt(l.qty,2)}</td><td>${esc(l.unit)}</td><td>${l.fixed?`<strong>${money(l.price)}</strong><br><span class="tiny muted">référence validée</span>`:`<input class="price-input" type="number" min="0" step="0.01" data-price-id="${l.id}" value="${l.price||''}" placeholder="Prix HT">`}</td><td><strong>${money(l.qty*l.price)}</strong></td></tr>`).join(''):`<tr><td colspan="5" class="muted">Aucune ligne calculée.</td></tr>`;
  return `<div class="section-title"><h2>Résultat du chiffrage</h2><p>Les prix catalogue absents restent visibles comme « prix manquant ». Aucun montant fournisseur n’est inventé.</p></div>
  <div class="metric-grid"><div class="metric"><span>Heures-homme</span><strong>${fmt(r.hours,1)} h</strong></div><div class="metric"><span>Durée chantier (${r.workers} ouvrier${r.workers>1?'s':''})</span><strong>${fmt(r.duration,1)} h</strong></div><div class="metric"><span>Coût main-d’œuvre</span><strong>${money(r.laborCost)}</strong></div></div>
  <div class="result-grid"><div><div class="table-wrap"><table><thead><tr><th>Poste</th><th>Qté</th><th>Unité</th><th>Prix U. HT</th><th>Total HT</th></tr></thead><tbody>${rows}</tbody></table></div>
  ${r.labor.length?`<div class="panel soft" style="margin-top:14px"><h3>Décomposition main-d’œuvre</h3>${r.labor.map(p=>`<div class="total-line"><span>${esc(p.name)}</span><strong>${fmt(p.hours,2)} h-homme${typeof p.override==='number'?' · prix MO annexe':''}</strong></div>`).join('')}</div>`:''}</div>
  <div><div class="panel"><h3>Totaux</h3><div class="totals"><div class="total-line"><span>Matériaux / fournitures HT</span><strong>${money(r.materials)}</strong></div><div class="total-line"><span>Main-d’œuvre HT</span><strong>${money(r.laborCost)}</strong></div><div class="total-line"><span>Total HT</span><strong>${money(r.totalHT)}</strong></div><div class="total-line"><span>TVA ${fmt(r.vat,1)} %</span><strong>${money(r.tax)}</strong></div><div class="total-line grand"><span>Total TTC</span><strong>${money(r.ttc)}</strong></div></div></div></div></div>
  ${r.alerts.length?`<div style="margin-top:16px"><h3>Alertes</h3>${r.alerts.map(a=>`<div class="alert ${a.startsWith('🚨')?'danger':'warn'}">${esc(a)}</div>`).join('')}</div>`:'<div class="alert ok">✓ Aucun blocage détecté.</div>'}
  ${r.reco.length?`<div style="margin-top:16px"><h3>Recommandations / traçabilité</h3>${r.reco.map(a=>`<div class="info-box">${esc(a)}</div>`).join('')}</div>`:''}`;
}

function validateStep(){
  if(state.step===0){if(!(num(state.globals.hourly)>0))return 'Renseigner le taux horaire Maçon.';if(state.globals.vat===''||state.globals.vat==null)return 'Renseigner le taux de TVA du chantier.';}
  if(state.step===1&&state.mode==='multiple'&&!state.elements.length)return 'Ajouter au moins un élément Maçon.';
  return '';
}

function bindEvents(){
  $$('[data-mode]').forEach(b=>b.onclick=()=>{state.mode=b.dataset.mode;if(state.mode==='simple')state.elements=[];else state.simple={};saveState();render()});
  $$('[data-simple-type]').forEach(b=>b.onclick=()=>{state.simpleType=b.dataset.simpleType;state.simple={};saveState();render()});
  $$('[data-add-element]').forEach(b=>b.onclick=()=>{newElement(b.dataset.addElement);saveState();render()});
  $$('[data-remove-element]').forEach(b=>b.onclick=()=>{state.elements=state.elements.filter(e=>e.id!==b.dataset.removeElement);if(!state.elements.length&&state.mode==='multiple'){}saveState();render()});
  $$('[data-complexity]').forEach(b=>b.onclick=()=>{state.globals.complexity=b.dataset.complexity;saveState();render()});
  $$('[data-simple]').forEach(el=>bindField(el,state.simple,el.dataset.simple));
  $$('[data-global]').forEach(el=>bindField(el,state.globals,el.dataset.global));
  $$('[data-el-id][data-field]').forEach(el=>{const e=state.elements.find(x=>x.id===el.dataset.elId);if(e)bindField(el,e.data,el.dataset.field,true)});
  $$('[data-price-id]').forEach(el=>{el.onchange=()=>{state.manualPrices[el.dataset.priceId]=num(el.value);saveState();render()}});
}
function bindField(el,obj,key,rerender=true){
  const evt=(el.type==='checkbox'||el.tagName==='SELECT')?'change':'change';
  el.addEventListener(evt,()=>{obj[key]=el.type==='checkbox'?el.checked:el.value;saveState();if(rerender||el.type==='checkbox'||el.tagName==='SELECT')render();});
}

$('#prevBtn').onclick=()=>{if(state.step>0){state.step--;saveState();render()}};
$('#nextBtn').onclick=()=>{if(state.step===4){render();return}const err=validateStep();if(err){alert(err);return}state.step++;saveState();render()};
render();
