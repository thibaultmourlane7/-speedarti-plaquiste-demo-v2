import {
  STRUCTURE_WARNING, FIBRE_WARNING, PREFAB_TEAM_ADVICE, PREFAB_H_PER_ML,
  TRUCK_8X4_DEFAULT, FIBRES, CHIMNEY_CONDUITS, CHIMNEY_STACKS, CHIMNEY_CAPS,
  CONCRETE_CLASSES, TREILLIS_GUILLAUME, MICROPILE_PRICE_BY_DEPTH, LONGRINE_PRICE_ML,
  PREFAB_DEFAULT_PRICE_M2, PUMP_DEFAULT_PRICE, TOUPIE_PRICE_M3, TOUPIE_MIN_BILLABLE_M3, TOUPIE_CAPACITY_M3,
  WORKS, WORK_BY_ID
} from './references.js';
import {
  CATALOGUE_MACON, catalogueCandidatesForLine, resolveCatalogueProduct, catalogueLabel
} from './catalogue-macon.js';

export const STEPS = ['Mode', 'Ouvrage(s)', 'Configuration', 'Options', 'Prix / catalogue', 'Résultat'];

export const SIMPLE_TYPES = [
  {id:'murs', icon:'🧱', label:'Murs / Cloisons', desc:'Blocs, briques, béton banché'},
  {id:'dalle', icon:'⬜', label:'Dallage / Dalle', desc:'Dallage ou ouvrage béton'},
  {id:'fondations', icon:'🏗️', label:'Fondations', desc:'Semelles et terrassement'},
  {id:'escalier', icon:'⭐', label:'Escalier', desc:'Béton armé'},
  {id:'terrasse', icon:'▤', label:'Terrasse', desc:'Dalle extérieure'},
  {id:'cheminee', icon:'🔥', label:'Cheminée', desc:'Conduit, souche, chapeau'}
];

export const MULTI_CARDS = [
  {id:'fondations', type:'fondations', icon:'🏗️', label:'Fondations', name:'Fondation'},
  {id:'murs_porteurs', type:'murs_porteurs', icon:'🧱', label:'Murs porteurs', name:'Mur porteur'},
  {id:'murs_elevations', type:'murs_elevations', icon:'🏠', label:"Murs d'élévations", name:'Murs extérieurs'},
  {id:'escalier', type:'escalier', icon:'⭐', label:'Élément spécial', name:'Escalier'},
  {id:'dalle', type:'dalle', icon:'🟫', label:'Dalle seule', name:'Dalle'},
  {id:'cheminee', type:'cheminee', icon:'🔥', label:'Cheminée', name:'Cheminée'},
  {id:'ouvrage_ba', type:'ouvrage_ba', icon:'▧', label:'Ouvrage BA / Annexe 1', name:'Ouvrage BA'}
];

// Chaque trace doit avoir une destination réelle. Les tests vérifient que tous les contrôles visibles sont balisés.
export const TRACE_TARGETS = {
  mode:'state+route', simpleType:'state+route', wizardPrev:'route-step-back', wizardNext:'validation+route-step-forward', returnTrades:'route-metiers',
  hourly:'labor+price', vat:'tax', workers:'duration', concreteClass:'material-variant', wallKind:'normative-context',
  wallLength:'quantity', wallWidth:'quantity', wallHeight:'quantity', wallThickness:'material-variant', wallBlocksPerM2:'quantity', wallMortarKgM2:'quantity', wallHoursPerM2:'labor',
  wallOpening:'quantity+associated-work', wallMaterial:'material-variant+price-key', wallMethod:'material-label', wallChainH:'material+labor', wallChainV:'material+labor',
  slabSurface:'quantity', slabLength:'quantity', slabWidth:'quantity', slabThickness:'quantity', slabRef:'material+labor', slabTreillis:'material', treillisType:'material+price+labor', slabFibres:'material', fibreType:'material', fibreDose:'quantity+alert',
  foundationRef:'material+labor', footingLength:'quantity', footingWidth:'quantity', footingHeight:'quantity', excavationDepth:'report+earthworks-context',
  stairRef:'material+labor', stairSurface:'quantity', stairHeight:'report', stairType:'report', stairManualPrice:'price-mode', stairManualIncludesLabor:'price-mode', stairManualHours:'planning',
  chimneyHeight:'quantity+labor', chimneyCount:'quantity+labor', chimneyConduit:'material+labor', chimneyStack:'material+labor', chimneyStackCount:'quantity+labor', chimneyCap:'material+labor', chimneyCapCount:'quantity+labor', chimneyFoyer:'report', chimneyManualPrice:'price-mode', chimneySupplyOverride:'price', chimneyHoursOverride:'labor', chimneyTotalOverride:'price',
  foundationType:'route', microCount:'quantity', microDepth:'commercial-price-rule', microPrice:'price', longrineType:'route', longrineLength:'quantity', longrineWidth:'quantity', longrineHeight:'quantity', longrinePrice:'price',
  plotCount:'quantity', plotVolumeMode:'quantity-meaning', plotVolume:'quantity', basementPerimeter:'quantity', basementBlockHeight:'quantity', basementRows:'quantity', basementBlocksPerM2:'quantity', basementHoursPerM2:'labor', basementFootingWidth:'quantity', basementFootingHeight:'quantity', basementStiffeners:'quantity',
  refendLength:'quantity', refendHeight:'quantity', refendBlocksPerM2:'quantity', refendHoursPerM2:'labor', refendStiffeners:'quantity', associatedSlabSurface:'quantity', associatedSlabThickness:'quantity', associatedSlabRef:'material+labor', associatedSlabInsulation:'material',
  bearingLength:'quantity', bearingHeight:'quantity', bearingThickness:'quantity', bearingMethod:'route', prefabType:'labor', prefabPriceM2:'price', bearingChainH:'material+labor', bearingChainV:'material+labor', braceQty:'quantity', bracePrice:'price', braceHours:'labor',
  elevationType:'report', elevationLength:'quantity', elevationHeight:'quantity', elevationThickness:'material-variant', elevationMaterial:'material-variant+price-key', elevationMethod:'material-label', elevationBlocksPerM2:'quantity', elevationMortarKgM2:'quantity', elevationHoursPerM2:'labor', elevationChainH:'material+labor', elevationChainV:'material+labor',
  openingType:'associated-work', openingWidth:'quantity', openingHeight:'quantity', openingLintelLength:'quantity', openingLintelRef:'material+labor', openingManualPrice:'price', openingManualHours:'labor',
  beamLength:'quantity', beamWidth:'quantity', beamHeight:'quantity', beamRef:'material+labor', pignonWidth:'quantity', pignonSlope:'quantity',
  elevationWaterproof:'material+price', elevationDecoration:'material+price', elevationAntiTermite:'material+price',
  genericWorkRef:'material+labor', genericWorkQty:'quantity', refBeton:'quantity', refAcier:'quantity', refCoffrage:'quantity', refHours:'labor',
  truck:'material+price', truckPrice:'price', truckDays:'quantity', saveTruckPrice:'preference', pump:'material+price', pumpPrice:'price', toupie:'material+price', toupiePrice:'price', toupieMode:'price-mode', toupies:'quantity', concreteControlMode:'report+planning-control',
  earthworks:'material+price', earthworksQty:'quantity', earthworksUnit:'unit', earthworksPrice:'price', backfill:'material+price', backfillQty:'quantity', backfillUnit:'unit', backfillPrice:'price', scaffold:'material+price', scaffoldQty:'quantity', scaffoldUnit:'unit', scaffoldPrice:'price', difficultAccess:'labor', difficultAccessHours:'labor',
  finishCoat:'material+price', finishCoatQty:'quantity', finishCoatUnit:'unit', finishCoatPrice:'price', waterproofCoat:'material+price', waterproofCoatQty:'quantity', waterproofCoatUnit:'unit', waterproofCoatPrice:'price',
  terraceWaterproof:'material+price', terraceWaterproofPrice:'price', terraceInsulation:'material+price', terraceInsulationPrice:'price',
  foundationOption:'material+price', foundationOptionPrice:'price', foundationOptionQty:'quantity',
  catalogSelection:'catalogue-selection+price+conditionnement',
  priceInput:'price-personnel', addOpening:'state+route', removeOpening:'state+route', addBeam:'state+route', removeBeam:'state+route', addPignon:'state+route', removePignon:'state+route', addElement:'state+route', removeElement:'state+route'
};

export function defaultState(){
  return {
    step:0,
    mode:'simple',
    simpleType:'murs',
    simple:{ openings:[], refOverrides:{}, chimneyOverrides:{}, count:1, wallKind:'mur', concreteClass:'' },
    globals:{
      hourly:'', vat:'', workers:1, concreteClass:'',
      truck:false, truckPrice:TRUCK_8X4_DEFAULT, truckDays:1, saveTruckPrice:false,
      pump:false, pumpPrice:PUMP_DEFAULT_PRICE, toupie:false, toupiePrice:TOUPIE_PRICE_M3, toupieMode:'auto_volume', toupieVolume:'', toupies:1,
      concreteControlMode:'aucun',
      earthworks:false, earthworksQty:'', earthworksUnit:'m³', earthworksPrice:'',
      backfill:false, backfillQty:'', backfillUnit:'m³', backfillPrice:'',
      scaffold:false, scaffoldQty:'', scaffoldUnit:'jour', scaffoldPrice:'',
      difficultAccess:false, difficultAccessHours:'',
      finishCoat:false, finishCoatQty:'', finishCoatUnit:'m²', finishCoatPrice:'',
      waterproofCoat:false, waterproofCoatQty:'', waterproofCoatUnit:'m²', waterproofCoatPrice:'',
      foundationOptions:{}
    },
    elements:[],
    manualPrices:{},
    catalogSelections:{},
    result:null
  };
}

export const num = v => {
  const n = Number(String(v ?? '').replace(',','.'));
  return Number.isFinite(n) ? n : 0;
};
export function concreteClassFor(container,globals){
  return container?.concreteClass || globals?.concreteClass || '';
}
export function micropileSuggestedPrice(depth){
  const d=num(depth);
  if(!(d>=3))return 0;
  return MICROPILE_PRICE_BY_DEPTH.find(r=>d<=r.max)?.price||0;
}
export function estimatedVerticalChainage(perimeter,height){
  const p=num(perimeter),h=num(height);
  if(!(p>0&&h>0))return 0;
  return Math.ceil(p/3.5)*h;
}
export function toupieCommercialCost(volumeM3,priceM3=TOUPIE_PRICE_M3){
  const v=num(volumeM3);
  if(!(v>0))return 0;
  return Math.max(v,TOUPIE_MIN_BILLABLE_M3)*num(priceM3);
}
export function toupieEstimatedCount(volumeM3){
  const v=num(volumeM3);
  return v>0?Math.ceil(v/TOUPIE_CAPACITY_M3):0;
}

export const fmt = (n,d=2) => Number(n||0).toLocaleString('fr-FR',{minimumFractionDigits:d,maximumFractionDigits:d});
export const money = n => `${fmt(n,2)} €`;
export const esc = s => String(s??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
export const uid = () => (globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID() : `m-${Date.now()}-${Math.random().toString(16).slice(2)}`);

export function getPath(obj,path){
  return String(path).split('.').reduce((a,k)=>a==null?undefined:a[k],obj);
}
export function setPath(obj,path,value){
  const parts=String(path).split('.'); let cur=obj;
  for(let i=0;i<parts.length-1;i++){
    const k=parts[i], next=parts[i+1];
    if(cur[k]==null) cur[k]=/^\d+$/.test(next)?[]:{};
    cur=cur[k];
  }
  cur[parts.at(-1)] = value;
  return obj;
}

function traceAttr(trace){
  if(!TRACE_TARGETS[trace]) throw new Error(`TRACE INCONNUE: ${trace}`);
  return `data-trace="${trace}"`;
}

export function optionHtml(options,value){
  return options.map(o=>`<option value="${esc(o.value)}" ${String(o.value)===String(value??'')?'selected':''}>${esc(o.label)}</option>`).join('');
}

export function field(label,key,value='',opts={}){
  const {type='number',step='any',min='0',placeholder='',scope='simple',required=false,help='',options=null,trace} = opts;
  if(!trace) throw new Error(`Champ sans balisage: ${label}`);
  const attr = scope==='global'?'data-global':scope==='simple'?'data-simple':'data-field';
  let control;
  if(options){
    control=`<select ${attr}="${esc(key)}" ${traceAttr(trace)}>${optionHtml(options,value)}</select>`;
  } else {
    control=`<input ${attr}="${esc(key)}" ${traceAttr(trace)} type="${type}" step="${step}" min="${min}" placeholder="${esc(placeholder)}" value="${esc(value)}">`;
  }
  return `<div class="field"><label class="${required?'required':''}">${label}</label>${control}${help?`<small>${help}</small>`:''}</div>`;
}

export function check(label,key,checked=false,scope='simple',trace){
  if(!trace) throw new Error(`Case sans balisage: ${label}`);
  const attr=scope==='global'?'data-global':scope==='simple'?'data-simple':'data-field';
  return `<label class="check"><input ${attr}="${esc(key)}" ${traceAttr(trace)} type="checkbox" ${checked?'checked':''}><span>${label}</span></label>`;
}

export function button(label,attrs='',trace){
  if(!trace) throw new Error(`Bouton sans balisage: ${label}`);
  return `<button type="button" ${attrs} ${traceAttr(trace)}>${label}</button>`;
}

export function workOptions(ids=WORKS.map(x=>x.id)){
  return ids.map(id=>WORK_BY_ID[id]).filter(Boolean).map(r=>({value:r.id,label:`${r.label} — ${r.moHParUnite} h/${r.unite}`}));
}

export function concreteClassOptions(){
  return CONCRETE_CLASSES.map(v=>({value:v,label:v}));
}
export function treillisOptions(){
  return Object.entries(TREILLIS_GUILLAUME).map(([value,r])=>({value,label:`${r.label} — ${r.maille} — ${r.usage}`}));
}

export function resolvedRef(container,refId){
  const base=WORK_BY_ID[refId]; if(!base)return null;
  const ov=container?.refOverrides?.[refId]||{};
  return {
    ...base,
    betonParUnite: ov.betonParUnite!==undefined?num(ov.betonParUnite):base.betonParUnite,
    acierParUnite: ov.acierParUnite!==undefined?num(ov.acierParUnite):base.acierParUnite,
    coffrageParUnite: ov.coffrageParUnite!==undefined?num(ov.coffrageParUnite):base.coffrageParUnite,
    moHParUnite: ov.moHParUnite!==undefined?num(ov.moHParUnite):base.moHParUnite
  };
}

export function renderRefOverrides(scope,container,refId,prefix='ref'){
  const ref=resolvedRef(container,refId); if(!ref)return '';
  const path=`refOverrides.${refId}`;
  const scoped=(label,key,value,trace)=>field(label,`${path}.${key}`,value,{scope,step:'0.001',trace,help:'Valeur Guillaume proposée, modifiable.'});
  return `<details class="accordion"><summary>⚙️ Ratios indicatifs modifiables — ${esc(ref.label)}</summary><div class="accordion-body">
    <div class="alert warn">${esc(STRUCTURE_WARNING)}</div>
    <div class="grid cols-4">
      ${scoped(`Béton / ${ref.unite}`, 'betonParUnite', ref.betonParUnite, 'refBeton')}
      ${scoped(`Acier / ${ref.unite}`, 'acierParUnite', ref.acierParUnite, 'refAcier')}
      ${scoped(`Coffrage / ${ref.unite}`, 'coffrageParUnite', ref.coffrageParUnite, 'refCoffrage')}
      ${scoped(`MO h-homme / ${ref.unite}`, 'moHParUnite', ref.moHParUnite, 'refHours')}
    </div>
  </div></details>`;
}

export function newElement(cardId){
  const c=MULTI_CARDS.find(x=>x.id===cardId); if(!c)return null;
  const d={refOverrides:{}, openings:[], beams:[], pignons:[]};
  if(c.type==='fondations') Object.assign(d,{foundationType:'vide_sanitaire',foundationConcreteClass:'',slabConcreteClass:'',longrineConcreteClass:'',blockHeight:.20,treillisType:'ST25C',longrinePrice:LONGRINE_PRICE_ML});
  if(c.type==='murs_porteurs') Object.assign(d,{method:'coule_sur_place',thickness:20,prefabType:'standard',prefabPriceM2:PREFAB_DEFAULT_PRICE_M2,concreteClass:''});
  if(c.type==='murs_elevations') Object.assign(d,{wallType:'murs_exterieurs',material:'parpaing',method:'colle',thickness:20,concreteClass:'',prefabType:'standard',prefabPriceM2:PREFAB_DEFAULT_PRICE_M2});
  if(c.type==='escalier') Object.assign(d,{stairType:'droit',stairRef:'escalier_ba',concreteClass:''});
  if(c.type==='dalle') Object.assign(d,{thickness:12,fibreType:'courante',treillisType:'ST25C',concreteClass:''});
  if(c.type==='cheminee') Object.assign(d,{conduit:'20x20',count:1,stack:'',stackCount:0,cap:'',capCount:0,foyer:'ouvert',chimneyOverrides:{}});
  if(c.type==='ouvrage_ba') Object.assign(d,{workRef:'beton_proprete',quantity:1,concreteClass:''});
  return {id:uid(),type:c.type,name:c.name,data:d};
}

export function iconFor(t){return ({fondations:'🏗️',murs_porteurs:'🧱',murs_elevations:'🏠',escalier:'⭐',dalle:'🟫',cheminee:'🔥',ouvrage_ba:'▧'})[t]||'•';}

export function renderMode(state){
  const g=state.globals;
  return `<div class="section-title"><h2>Mode de chiffrage</h2><p>Le module conserve les deux parcours SpeedArti : simple et multi-éléments.</p></div>
  <div class="grid cols-2">
    ${button(`<span class="icon">▣</span><span><strong>Mode simple</strong><small>Un seul ouvrage.</small></span>`,`class="choice-card mode-card ${state.mode==='simple'?'selected':''}" data-mode="simple"`,'mode')}
    ${button(`<span class="icon">▦</span><span><strong>Mode multi-éléments</strong><small>Plusieurs éléments cumulés.</small></span>`,`class="choice-card mode-card ${state.mode==='multiple'?'selected':''}" data-mode="multiple"`,'mode')}
  </div>
  <div class="separator"></div>
  <div class="section-title"><h2>Paramètres entreprise / chantier</h2><p>Ces valeurs alimentent le prix, la TVA et la durée. Aucun taux caché n’est injecté.</p></div>
  <div class="grid cols-3">
    ${field('Taux horaire Maçon HT (€ / h)','hourly',g.hourly??'',{scope:'global',step:'0.01',required:true,trace:'hourly'})}
    ${field('TVA chantier (%)','vat',g.vat??'',{scope:'global',step:'0.1',required:true,trace:'vat'})}
    ${field("Nombre d'ouvriers",'workers',g.workers??1,{scope:'global',step:'1',min:'1',required:true,trace:'workers'})}
  </div>
  <div class="info-box">Heures-homme = somme des postes. Durée chantier = heures-homme ÷ nombre d’ouvriers. Coût MO = heures-homme × taux horaire.</div>`;
}

export function renderWorks(state){
  if(state.mode==='simple'){
    return `<div class="section-title"><h2>Type d'ouvrage</h2><p>Choisissez l’ouvrage à chiffrer.</p></div>
      <div class="trade-grid">${SIMPLE_TYPES.map(t=>button(`<span class="icon">${t.icon}</span><strong>${t.label}</strong><small>${t.desc}</small>`,`class="choice-card ${state.simpleType===t.id?'selected':''}" data-simple-type="${t.id}"`,'simpleType')).join('')}</div>`;
  }
  return `<div class="section-title"><h2>Sélectionnez les éléments du chantier</h2><p>Vous pouvez ajouter plusieurs fois le même type.</p></div>
    <div class="trade-grid">${MULTI_CARDS.map(c=>button(`<span class="icon">${c.icon}</span><strong>${c.label}</strong><small>Cliquer pour ajouter</small>`,`class="choice-card" data-add-element="${c.id}"`,'addElement')).join('')}</div>
    ${state.elements.length?`<div class="added-list">${state.elements.map(e=>`<span class="pill">${iconFor(e.type)} ${esc(e.name)} ${button('×',`class="pill-remove" data-remove-element="${e.id}" title="Supprimer"`,'removeElement')}</span>`).join('')}</div>`:`<div class="info-box">Aucun élément ajouté pour le moment.</div>`}`;
}

function openingRowsSimple(d){
  const openings=d.openings||[];
  const refs=[...new Set(openings.map(o=>o.associated).filter(id=>WORK_BY_ID[id]))];
  return `<div class="element-card"><header><strong>Ouvertures réelles</strong>${button('+ Ajouter',`class="btn ghost small" data-add-simple-opening="1"`,'addOpening')}</header><div class="body">
    ${openings.length?openings.map((o,i)=>`<div class="grid cols-4 line-editor">
      ${field('Largeur (m)',`openings.${i}.width`,o.width??'',{step:'0.01',trace:'wallOpening'})}
      ${field('Hauteur (m)',`openings.${i}.height`,o.height??'',{step:'0.01',trace:'wallOpening'})}
      ${field('Ouvrage associé',`openings.${i}.associated`,o.associated??'',{trace:'wallOpening',options:[{value:'',label:'Aucun'},{value:'appui_fenetre_ba',label:'Appui fenêtre BA'},{value:'seuil_ba',label:'Seuil BA'},{value:'linteau_ba_courant',label:'Linteau BA courant'},{value:'linteau_ba_renforce',label:'Linteau BA renforcé'}]})}
      ${button('Supprimer',`class="btn danger small" data-remove-simple-opening="${i}"`,'removeOpening')}
    </div>`).join(''):'<p class="muted">Aucune ouverture.</p>'}
    ${refs.map(id=>renderRefOverrides('simple',d,id)).join('')}
  </div></div>`;
}

export function renderSimpleConfig(state){
  const d=state.simple;
  if(state.simpleType==='murs') return `<div class="section-title"><h2>Dimensions de l'ouvrage</h2><p>Murs / Cloisons — les ratios métier sont regroupés dans les réglages avancés.</p></div>
    <div class="grid cols-5">
      ${field('Nature de l’ouvrage','wallKind',d.wallKind??'mur',{trace:'wallKind',options:[{value:'mur',label:'Mur'},{value:'cloison_non_porteuse',label:'Cloison non porteuse'}]})}
      ${field('Longueur totale murs (m)','length',d.length??'',{required:true,step:'0.1',trace:'wallLength'})}
      ${field('Largeur bâtiment (m) — si 4 côtés','width',d.width??'',{step:'0.1',trace:'wallWidth',help:'Si renseignée, surface = 2 × (L + l) × H.'})}
      ${field('Hauteur (m)','height',d.height??'',{required:true,step:'0.1',trace:'wallHeight'})}
      ${field('Épaisseur (cm)','thickness',d.thickness??'',{required:true,step:'1',trace:'wallThickness'})}
    </div>
    <details class="accordion"><summary>⚙️ Réglages métier avancés</summary><div class="accordion-body"><div class="grid cols-3">
      ${field('Consommation blocs (u/m²)','blocksPerM2',d.blocksPerM2??'',{required:true,step:'0.1',trace:'wallBlocksPerM2'})}
      ${field('Mortier / colle (kg/m²)','mortarKgM2',d.mortarKgM2??'',{step:'0.1',trace:'wallMortarKgM2'})}
      ${field('Temps de pose (h-homme/m²)','wallHPerM2',d.wallHPerM2??'',{required:true,step:'0.01',trace:'wallHoursPerM2'})}
    </div><div class="info-box">Ces ratios restent nécessaires au calcul tant que le référentiel automatique correspondant n’est pas fourni au moteur.</div></div></details>${openingRowsSimple(d)}`;

  if(['dalle','terrasse'].includes(state.simpleType)){
    const refId=d.slabRef||'';
    return `<div class="section-title"><h2>Dimensions de l'ouvrage</h2><p>${state.simpleType==='terrasse'?'Terrasse':'Dallage / Dalle'} — référentiel Guillaume modifiable.</p></div>
      <div class="grid cols-4">
        ${field('Surface (m²)','surface',d.surface??'',{required:true,step:'0.1',trace:'slabSurface'})}
        ${field('Épaisseur réelle (cm)','thickness',d.thickness??'',{required:true,step:'1',trace:'slabThickness'})}
        ${field('Type de dalle de référence','slabRef',refId,{required:true,trace:'slabRef',options:[{value:'',label:'Choisir…'},...workOptions(['dallage_non_arme','dallage_arme','dalle_pleine_ba','dalle_pleine_fortement_armee','dalle_portee','plancher_poutrelles_hourdis','plancher_predalles'])]})}
        ${field('Classe béton','concreteClass',d.concreteClass??'',{required:true,trace:'concreteClass',options:[{value:'',label:'Choisir…'},...concreteClassOptions()]})}
      </div>${refId?renderRefOverrides('simple',d,refId):''}`;
  }

  if(state.simpleType==='fondations'){
    const refId=d.foundationRef||'semelle_filante';
    return `<div class="section-title"><h2>Semelle de fondation</h2><p>Longueur en m ; largeur et épaisseur béton en cm ; profondeur de fouille séparée.</p></div>
      <div class="grid cols-5">
        ${field('Type de semelle','foundationRef',refId,{trace:'foundationRef',options:workOptions(['semelle_filante','semelle_isolee','semelle_sous_mur'])})}
        ${field('Longueur (m)','length',d.length??'',{required:true,step:'0.1',trace:'footingLength'})}
        ${field('Largeur (cm)','widthCm',d.widthCm??'',{required:true,step:'1',trace:'footingWidth'})}
        ${field('Épaisseur / hauteur béton (cm)','heightCm',d.heightCm??'',{required:true,step:'1',trace:'footingHeight'})}
        ${field('Classe béton','concreteClass',d.concreteClass??'',{required:true,trace:'concreteClass',options:[{value:'',label:'Choisir…'},...concreteClassOptions()]})}
      </div><div class="grid cols-2" style="margin-top:14px">
        ${field('Profondeur de fouille (m)','excavationDepth',d.excavationDepth??'',{step:'0.05',trace:'excavationDepth'})}
      </div>${renderRefOverrides('simple',d,refId)}`;
  }

  if(state.simpleType==='escalier'){
    const refId=d.stairRef||'escalier_ba';
    return `<div class="section-title"><h2>Escalier BA</h2><p>Les anciens forfaits cachés sont supprimés.</p></div>
      <div class="grid cols-5">
        ${field("Type d'escalier",'stairType',d.stairType??'droit',{trace:'stairType',options:[{value:'droit',label:'Droit'},{value:'quart_tournant',label:'1/4 tournant'},{value:'demi_tournant',label:'2/4 tournant'}]})}
        ${field('Ouvrage de référence','stairRef',refId,{trace:'stairRef',options:workOptions(['escalier_ba','paillasse_escalier','palier_ba'])})}
        ${field('Surface réelle (m²)','surface',d.surface??'',{required:true,step:'0.1',trace:'stairSurface'})}
        ${field('Hauteur à franchir (m)','height',d.height??'',{step:'0.01',trace:'stairHeight'})}
        ${field('Classe béton','concreteClass',d.concreteClass??'',{required:true,trace:'concreteClass',options:[{value:'',label:'Choisir…'},...concreteClassOptions()]})}
      </div>
      <div class="grid cols-3" style="margin-top:14px">
        ${field('Prix manuel total HT (€) — facultatif','manualPrice',d.manualPrice??'',{step:'1',trace:'stairManualPrice',help:'S’il est saisi, il remplace les lignes de vente calculées.'})}
        ${check('Le prix manuel inclut la main-d’œuvre','manualIncludesLabor',!!d.manualIncludesLabor,'simple','stairManualIncludesLabor')}
        ${field('Heures-homme planning si prix manuel','manualHours',d.manualHours??'',{step:'0.1',trace:'stairManualHours'})}
      </div>${renderRefOverrides('simple',d,refId)}`;
  }

  if(state.simpleType==='cheminee') return renderChimneyConfig('simple',d);
  return '';
}

export function renderConfig(state){
  if(state.mode==='simple') return renderSimpleConfig(state);
  if(!state.elements.length) return `<div class="section-title"><h2>Configuration des éléments</h2></div><div class="alert danger">🚨 Aucun élément sélectionné.</div>`;
  return `<div class="section-title"><h2>Configuration des éléments</h2><p>Le module reprend les blocs originaux et leurs sous-ouvrages.</p></div>${state.elements.map(renderElementConfig).join('')}`;
}

function ef(e,label,key,value='',opts={}){
  return field(label,key,value,{...opts,scope:'element'}).replaceAll('data-field=',`data-el-id="${e.id}" data-field=`);
}
function ec(e,label,key,checked=false,trace){
  return check(label,key,checked,'element',trace).replace('data-field=',`data-el-id="${e.id}" data-field=`);
}
function eb(e,label,attrs,trace){ return button(label,`${attrs} data-el-id="${e.id}"`,trace); }

function renderElementConfig(e){
  let body='';
  if(e.type==='fondations') body=renderFoundationElement(e);
  if(e.type==='murs_porteurs') body=renderBearingWallElement(e);
  if(e.type==='murs_elevations') body=renderElevationElement(e);
  if(e.type==='escalier') body=renderStairElement(e);
  if(e.type==='dalle') body=renderSlabElement(e);
  if(e.type==='cheminee') body=renderChimneyConfig('element',e.data,e);
  if(e.type==='ouvrage_ba') body=renderGenericWorkElement(e);
  return `<div class="element-card"><header><div><strong>${iconFor(e.type)} ${esc(e.name)}</strong> <span class="badge">${esc(e.type.replaceAll('_',' '))}</span></div>${eb(e,'Supprimer',`class="btn danger small" data-remove-element="${e.id}"`,'removeElement')}</header><div class="body" data-element-root="${e.id}">${body}</div></div>`;
}

function renderAssociatedSlabControls(e,d,{surfaceKey,surfaceLabel,insulationKey=null,insulationLabel='Isolation'}){
  const refId=d.slabRef||'';
  const slabRefs=d.foundationType==='terre_plein'
    ? ['dallage_non_arme','dallage_arme']
    : ['dallage_non_arme','dallage_arme','dalle_pleine_ba','dalle_portee','plancher_poutrelles_hourdis','plancher_predalles'];
  const insulation=insulationKey
    ? ef(e,insulationLabel,insulationKey,d[insulationKey]??'sans_isolant',{trace:'associatedSlabInsulation',options:[{value:'sans_isolant',label:'Sans isolant'},{value:'avec_isolant',label:'Avec isolant'}]})
    : '';
  let h=`<div class="grid ${insulationKey?'cols-5':'cols-4'}" style="margin-top:14px">
    ${ef(e,surfaceLabel,surfaceKey,d[surfaceKey]??'',{step:'0.1',trace:'associatedSlabSurface'})}
    ${ef(e,'Épaisseur réelle dalle associée (cm)','thickness',d.thickness??'',{required:true,step:'1',trace:'associatedSlabThickness',help:'Obligatoire dès qu’une dalle associée est chiffrée.'})}
    ${ef(e,'Type dalle associée','slabRef',refId,{trace:'associatedSlabRef',options:[{value:'',label:'Aucune / choisir…'},...workOptions(slabRefs)]})}
    ${ef(e,'Classe béton dalle associée','slabConcreteClass',d.slabConcreteClass??'',{required:true,trace:'concreteClass',options:[{value:'',label:'Choisir…'},...concreteClassOptions()]})}
    ${insulation}
  </div>`;
  if(refId){
    h+=`<div class="grid cols-4" style="margin-top:14px">
      <div class="panel soft">${ec(e,'Treillis soudé','treillis',!!d.treillis,'slabTreillis')}<br>${ec(e,'Fibres','fibres',!!d.fibres,'slabFibres')}</div>
      ${d.treillis?ef(e,'Type de treillis','treillisType',d.treillisType??'ST25C',{trace:'treillisType',options:treillisOptions()}):''}
      ${d.fibres?ef(e,'Type de fibres','fibreType',d.fibreType??'courante',{trace:'fibreType',options:Object.entries(FIBRES).map(([id,r])=>({value:id,label:`${r.label} — ${r.min} à ${r.max} kg/m³`}))}):''}
      ${d.fibres?ef(e,'Dosage fibres (kg/m³)','fibreDose',d.fibreDose??'',{required:true,step:'0.1',trace:'fibreDose',help:'Le dosage reste une donnée de calcul explicite, même si un produit le préremplit.'}):''}
    </div>`;
  }
  return h;
}

function renderFoundationElement(e){
  const d=e.data;
  let sub=`<div class="grid cols-2">${ef(e,'Type de fondation','foundationType',d.foundationType??'vide_sanitaire',{trace:'foundationType',options:[
    {value:'micro_pieux',label:'Micro-pieux'},{value:'plot_isole',label:'Plot isolé'},{value:'vide_sanitaire',label:'Vide sanitaire'},{value:'terre_plein',label:'Terre plein'}
  ]})}</div>`;

  if(d.foundationType==='micro_pieux'){
    const suggested=micropileSuggestedPrice(d.microDepth);
    sub+=`<div class="grid cols-3" style="margin-top:14px">
      ${ef(e,'Nombre de micro-pieux','microCount',d.microCount??'',{required:true,step:'1',trace:'microCount'})}
      ${ef(e,'Profondeur par micro-pieu (m)','microDepth',d.microDepth??'',{required:true,step:'0.1',trace:'microDepth',help:'Utilisée uniquement pour proposer le prix métier Guillaume, jamais pour dimensionner le micropieu.'})}
      ${ef(e,'Prix HT / micro-pieu — fourniture + MO incluse','microPrice',d.microPrice??suggested,{required:true,step:'1',trace:'microPrice',help:suggested?`Proposition Guillaume selon profondeur : ${money(suggested)} / micro-pieu. Modifiable.`:'Saisir une profondeur ≥ 3 m pour obtenir la proposition Guillaume.'})}
    </div>
    ${renderAssociatedSlabControls(e,d,{surfaceKey:'microSlabSurface',surfaceLabel:'Surface dalle sur VS (m²)',insulationKey:'microSlabInsulation',insulationLabel:'Isolation dalle'})}
    <div class="grid cols-4" style="margin-top:14px">
      ${ef(e,'Type de longrine','longrineType',d.longrineType??'sans_becquet',{trace:'longrineType',options:[{value:'sans_becquet',label:'Sans becquet'},{value:'avec_becquet',label:'Avec becquet'}]})}
      ${ef(e,d.longrineType==='avec_becquet'?'Périmètre longrine (m)':'Longueur longrine (m)','beamLength',d.beamLength??'',{step:'0.1',trace:'longrineLength'})}
      ${ef(e,'Largeur section (cm)','beamWidthCm',d.beamWidthCm??'',{step:'1',trace:'longrineWidth'})}
      ${ef(e,'Hauteur section (cm)','beamHeightCm',d.beamHeightCm??'',{step:'1',trace:'longrineHeight'})}
      ${ef(e,'Classe béton longrine','longrineConcreteClass',d.longrineConcreteClass??'',{required:true,trace:'concreteClass',options:[{value:'',label:'Choisir…'},...concreteClassOptions()]})}
    </div><div class="grid cols-2" style="margin-top:10px">
      ${ef(e,'Prix longrine HT / ml','longrinePrice',d.longrinePrice??LONGRINE_PRICE_ML,{step:'1',trace:'longrinePrice',help:'Référence métier Guillaume, modifiable. Poste séparé des micro-pieux.'})}
    </div>`;
    if(d.slabRef) sub+=renderRefOverrides('element',d,d.slabRef).replaceAll('data-field=',`data-el-id="${e.id}" data-field=`);
    sub+=renderRefOverrides('element',d,'longrine_fondation').replaceAll('data-field=',`data-el-id="${e.id}" data-field=`);
  }

  if(d.foundationType==='plot_isole'){
    sub+=`<div class="grid cols-4" style="margin-top:14px">
      ${ef(e,'Quantité de plots','plotCount',d.plotCount??'',{required:true,step:'1',trace:'plotCount'})}
      ${ef(e,'Interprétation du volume','plotVolumeMode',d.plotVolumeMode??'',{required:true,trace:'plotVolumeMode',options:[{value:'',label:'Choisir…'},{value:'unitaire',label:'Volume par plot'},{value:'total',label:'Volume total'}]})}
      ${ef(e,d.plotVolumeMode==='unitaire'?'Volume par plot (m³)':'Volume total (m³)','plotVolume',d.plotVolume??'',{required:true,step:'0.01',trace:'plotVolume'})}
      ${ef(e,'Classe béton plot','foundationConcreteClass',d.foundationConcreteClass??'',{required:true,trace:'concreteClass',options:[{value:'',label:'Choisir…'},...concreteClassOptions()]})}
    </div>${renderRefOverrides('element',d,'semelle_isolee').replaceAll('data-field=',`data-el-id="${e.id}" data-field=`)}`;
  }

  if(['vide_sanitaire','terre_plein'].includes(d.foundationType)){
    sub+=`<div class="separator"></div><h3>Murs de soubassement</h3>
    <div class="grid cols-5">
      ${ef(e,'Périmètre (m)','perimeter',d.perimeter??'',{required:true,step:'0.1',trace:'basementPerimeter'})}
      ${ef(e,'Hauteur du bloc','blockHeight',d.blockHeight??.20,{trace:'basementBlockHeight',options:[{value:'0.20',label:'20 cm'},{value:'0.25',label:'25 cm'}]})}
      ${ef(e,'Nombre de rangs','rows',d.rows??'',{step:'1',trace:'basementRows'})}
      <div class="field"><label>Hauteur totale calculée</label><div class="info-box">${fmt(num(d.blockHeight||.20)*num(d.rows),2)} m</div></div>
      ${ef(e,'Raidisseurs (nb)','stiffeners',d.stiffeners??'',{step:'1',trace:'basementStiffeners'})}
    </div>
    <div class="grid cols-3" style="margin-top:14px">
      ${ef(e,'Largeur semelle (cm)','footingWidthCm',d.footingWidthCm??'',{required:true,step:'1',trace:'basementFootingWidth'})}
      ${ef(e,'Hauteur semelle (cm)','footingHeightCm',d.footingHeightCm??'',{required:true,step:'1',trace:'basementFootingHeight'})}
      ${ef(e,'Classe béton semelle','foundationConcreteClass',d.foundationConcreteClass??'',{required:true,trace:'concreteClass',options:[{value:'',label:'Choisir…'},...concreteClassOptions()]})}
    </div>
    <details class="accordion"><summary>⚙️ Réglages métier avancés — soubassement</summary><div class="accordion-body"><div class="grid cols-2">
      ${ef(e,'Consommation blocs (u/m²)','blocksPerM2',d.blocksPerM2??'',{step:'0.1',trace:'basementBlocksPerM2'})}
      ${ef(e,'Temps mur (h-homme/m²)','wallHPerM2',d.wallHPerM2??'',{step:'0.01',trace:'basementHoursPerM2'})}
    </div></div></details>
    <div class="separator"></div><h3>Mur de refend</h3>
    <div class="grid cols-3">
      ${ef(e,'Longueur refend (m)','refendLength',d.refendLength??'',{step:'0.1',trace:'refendLength'})}
      ${ef(e,'Hauteur refend (m)','refendHeight',d.refendHeight??'',{step:'0.1',trace:'refendHeight'})}
      ${ef(e,'Raidisseurs refend (nb)','refendStiffeners',d.refendStiffeners??'',{step:'1',trace:'refendStiffeners'})}
    </div>
    <details class="accordion"><summary>⚙️ Réglages métier avancés — refend</summary><div class="accordion-body"><div class="grid cols-2">
      ${ef(e,'Blocs refend (u/m²)','refendBlocksPerM2',d.refendBlocksPerM2??'',{step:'0.1',trace:'refendBlocksPerM2'})}
      ${ef(e,'Temps refend (h-homme/m²)','refendHoursPerM2',d.refendHoursPerM2??'',{step:'0.01',trace:'refendHoursPerM2'})}
    </div></div></details>
    ${renderAssociatedSlabControls(e,d,{surfaceKey:'slabSurface',surfaceLabel:'Surface dalle associée (m²)',insulationKey:d.foundationType==='vide_sanitaire'?'slabInsulation':null,insulationLabel:'Type de plancher VS'})}`;
    sub+=renderRefOverrides('element',d,'semelle_filante').replaceAll('data-field=',`data-el-id="${e.id}" data-field=`);
    sub+=renderRefOverrides('element',d,'potelet_raidisseur_vertical').replaceAll('data-field=',`data-el-id="${e.id}" data-field=`);
    if(d.slabRef) sub+=renderRefOverrides('element',d,d.slabRef).replaceAll('data-field=',`data-el-id="${e.id}" data-field=`);
  }
  return sub;
}

function renderBearingWallElement(e){
  const d=e.data;
  let h=`<div class="grid ${d.method==='prefabrique'?'cols-4':'cols-5'}">
    ${ef(e,'Longueur / périmètre (m)','length',d.length??'',{required:true,step:'0.1',trace:'bearingLength'})}
    ${ef(e,'Hauteur (m)','height',d.height??'',{required:true,step:'0.1',trace:'bearingHeight'})}
    ${ef(e,'Épaisseur (cm)','thickness',d.thickness??20,{required:true,step:'1',trace:'bearingThickness'})}
    ${ef(e,'Méthode','method',d.method??'coule_sur_place',{trace:'bearingMethod',options:[{value:'coule_sur_place',label:'Coulé sur place'},{value:'prefabrique',label:'Préfabriqué'}]})}
    ${d.method!=='prefabrique'?ef(e,'Classe béton','concreteClass',d.concreteClass??'',{required:true,trace:'concreteClass',options:[{value:'',label:'Choisir…'},...concreteClassOptions()]}):''}
  </div>`;
  if(d.method==='prefabrique'){
    h+=`<div class="grid cols-2" style="margin-top:14px">
      ${ef(e,'Type préfabriqué','prefabType',d.prefabType??'standard',{trace:'prefabType',options:[{value:'standard',label:'Standard — 1,55 h-homme/ml'},{value:'hauteur_importante',label:'Hauteur importante — 1,90 h-homme/ml'},{value:'lourd_complexe',label:'Lourd / complexe — 2,75 h-homme/ml'}]})}
      ${ef(e,'Prix total HT / m² — posé, livré, gruté','prefabPriceM2',d.prefabPriceM2??PREFAB_DEFAULT_PRICE_M2,{step:'1',trace:'prefabPriceM2',help:'Référence Guillaume 350 €/m² HT, modifiable. Hors terrassement, drainage, remblai et fondations éventuelles.'})}
    </div><div class="info-box">${esc(PREFAB_TEAM_ADVICE)} Les heures restent au planning mais ne sont pas refacturées si elles sont incluses dans le prix au m².</div>`;
  } else {
    h+=renderRefOverrides('element',d,'mur_banche_courant').replaceAll('data-field=',`data-el-id="${e.id}" data-field=`);
  }
  h+=`<div class="separator"></div><div class="grid cols-3">
    ${ef(e,'Chaînage horizontal total (ml)','chainHml',d.chainHml??'',{step:'0.1',trace:'bearingChainH'})}
    ${ef(e,'Chaînage vertical total (ml)','chainVml',d.chainVml??'',{step:'0.1',trace:'bearingChainV'})}
    ${ef(e,'Jambes de force (u)','braceQty',d.braceQty??'',{step:'1',trace:'braceQty'})}
  </div>`;
  if(num(d.braceQty)>0) h+=`<div class="grid cols-2" style="margin-top:14px">
    ${ef(e,'Prix HT / jambe de force','bracePrice',d.bracePrice??'',{required:true,step:'1',trace:'bracePrice'})}
    ${ef(e,'Temps MO / jambe (h-homme)','braceHours',d.braceHours??'',{required:true,step:'0.1',trace:'braceHours'})}
  </div>`;
  h+=renderRefOverrides('element',d,'chainage_horizontal').replaceAll('data-field=',`data-el-id="${e.id}" data-field=`);
  h+=renderRefOverrides('element',d,'chainage_vertical').replaceAll('data-field=',`data-el-id="${e.id}" data-field=`);
  return h;
}

function renderElevationElement(e){
  const d=e.data;
  let h=`<div class="grid cols-4">
    ${ef(e,'Type de mur','wallType',d.wallType??'murs_exterieurs',{trace:'elevationType',options:[{value:'murs_exterieurs',label:'Murs extérieurs'},{value:'murs_refends',label:'Murs de refends'}]})}
    ${ef(e,'Périmètre / longueur (m)','length',d.length??'',{required:true,step:'0.1',trace:'elevationLength'})}
    ${ef(e,'Hauteur (m)','height',d.height??'',{required:true,step:'0.1',trace:'elevationHeight'})}
    ${ef(e,'Épaisseur (cm)','thickness',d.thickness??20,{required:true,step:'1',trace:'elevationThickness'})}
  </div>
  <div class="grid ${d.material==='beton_banche'?'cols-5':'cols-2'}" style="margin-top:14px">
    ${ef(e,'Matériau','material',d.material??'parpaing',{trace:'elevationMaterial',options:[{value:'parpaing',label:'Parpaing'},{value:'brique',label:'Brique'},{value:'siporex',label:'Siporex'},{value:'beton_banche',label:'Béton banché'}]})}
    ${ef(e,d.material==='beton_banche'?'Méthode':'Méthode de pose','method',d.material==='beton_banche'?(d.method==='prefabrique'?'prefabrique':'coule_sur_place'):(['colle','tradi'].includes(d.method)?d.method:'colle'),{trace:'elevationMethod',options:d.material==='beton_banche'?[{value:'coule_sur_place',label:'Coulé sur place'},{value:'prefabrique',label:'Préfabriqué'}]:[{value:'colle',label:'Collé'},{value:'tradi',label:'Traditionnel'}]})}
    ${d.material==='beton_banche'&&d.method!=='prefabrique'?ef(e,'Classe béton','concreteClass',d.concreteClass??'',{required:true,trace:'concreteClass',options:[{value:'',label:'Choisir…'},...concreteClassOptions()]}):''}
    ${d.material==='beton_banche'&&d.method==='prefabrique'?ef(e,'Type préfabriqué','prefabType',d.prefabType??'standard',{trace:'prefabType',options:[{value:'standard',label:'Standard — 1,55 h-homme/ml'},{value:'hauteur_importante',label:'Hauteur importante — 1,90 h-homme/ml'},{value:'lourd_complexe',label:'Lourd / complexe — 2,75 h-homme/ml'}]}):''}
    ${d.material==='beton_banche'&&d.method==='prefabrique'?ef(e,'Prix total HT / m² — posé, livré, gruté','prefabPriceM2',d.prefabPriceM2??PREFAB_DEFAULT_PRICE_M2,{step:'1',trace:'prefabPriceM2'}):''}
  </div>`;
  if(d.material!=='beton_banche') h+=`<details class="accordion"><summary>⚙️ Réglages métier avancés — maçonnerie</summary><div class="accordion-body"><div class="grid cols-3">
    ${ef(e,'Consommation blocs (u/m²)','blocksPerM2',d.blocksPerM2??'',{required:true,step:'0.1',trace:'elevationBlocksPerM2'})}
    ${ef(e,'Mortier / colle (kg/m²)','mortarKgM2',d.mortarKgM2??'',{step:'0.1',trace:'elevationMortarKgM2'})}
    ${ef(e,'Temps pose (h-homme/m²)','wallHPerM2',d.wallHPerM2??'',{required:true,step:'0.01',trace:'elevationHoursPerM2'})}
  </div></div></details>`;
  else if(d.method==='prefabrique') h+=`<div class="info-box">Préfabriqué : prix Guillaume par m², modifiable. Pose incluse dans le prix commercial ; planning séparé.</div>`;
  else h+=renderRefOverrides('element',d,'mur_banche_courant').replaceAll('data-field=',`data-el-id="${e.id}" data-field=`);

  const chainBase=num(d.length);
  const chainVEstimate=estimatedVerticalChainage(chainBase,d.height);
  h+=`<div class="separator"></div><div class="grid cols-2">
    ${ef(e,'Chaînage horizontal total (ml)','chainHml',d.chainHml??chainBase,{step:'0.1',trace:'elevationChainH',help:'Prérempli avec le périmètre / linéaire connu. Modifiable.'})}
    ${ef(e,'Chaînage vertical total (ml)','chainVml',d.chainVml??chainVEstimate,{step:'0.1',trace:'elevationChainV',help:'Estimation réalisée à partir de ratios Guillaume : périmètre ÷ 3,50, arrondi supérieur, × hauteur. Modifiable ; ce n’est pas une règle DTU.'})}
  </div>`;

  const openings=d.openings||[];
  h+=`<div class="element-card"><header><strong>Ouvertures</strong>${eb(e,'+ Ajouter',`class="btn ghost small" data-add-opening="${e.id}"`,'addOpening')}</header><div class="body">
    ${openings.length?openings.map((o,i)=>`<div class="line-editor"><div class="grid cols-4">
      ${ef(e,'Type',`openings.${i}.type`,o.type??'seuil_ba',{trace:'openingType',options:[{value:'seuil_ba',label:'Seuil BA'},{value:'appui_fenetre_ba',label:'Appui fenêtre BA'},{value:'linteau_ba_courant',label:'Linteau BA courant'},{value:'linteau_ba_renforce',label:'Linteau BA renforcé'},{value:'talonnette_manuelle',label:'Talonnette — saisie manuelle'}]})}
      ${ef(e,'Largeur ouverture (m)',`openings.${i}.width`,o.width??'',{step:'0.01',trace:'openingWidth'})}
      ${ef(e,'Hauteur ouverture (m)',`openings.${i}.height`,o.height??'',{step:'0.01',trace:'openingHeight'})}
      ${eb(e,'Supprimer',`class="btn danger small" data-remove-opening="${e.id}:${i}"`,'removeOpening')}
    </div>
    ${String(o.type||'').startsWith('linteau')?`<div class="grid cols-2" style="margin-top:10px">${ef(e,'Longueur linteau (ml)',`openings.${i}.lintelLength`,o.lintelLength??o.width??'',{step:'0.01',trace:'openingLintelLength'})}${ef(e,'Référence linteau',`openings.${i}.type`,o.type??'linteau_ba_courant',{trace:'openingLintelRef',options:workOptions(['linteau_ba_courant','linteau_ba_renforce'])})}</div>`:''}
    ${o.type==='talonnette_manuelle'?`<div class="grid cols-2" style="margin-top:10px">${ef(e,'Prix HT talonnette',`openings.${i}.manualPrice`,o.manualPrice??'',{step:'1',trace:'openingManualPrice'})}${ef(e,'Temps MO (h-homme)',`openings.${i}.manualHours`,o.manualHours??'',{step:'0.1',trace:'openingManualHours'})}</div>`:''}
    </div>`).join(''):'<p class="muted">Aucune ouverture.</p>'}
  </div></div>`;
  const openingRefs=[...new Set(openings.map(o=>o.type).filter(id=>WORK_BY_ID[id]))];
  h+=openingRefs.map(id=>renderRefOverrides('element',d,id).replaceAll('data-field=',`data-el-id="${e.id}" data-field=`)).join('');

  const beams=d.beams||[];
  h+=`<div class="element-card"><header><strong>Poutres BA</strong>${eb(e,'+ Ajouter',`class="btn ghost small" data-add-beam="${e.id}"`,'addBeam')}</header><div class="body">
    ${beams.length?beams.map((b,i)=>`<div class="grid cols-5 line-editor">
      ${ef(e,'Longueur (m)',`beams.${i}.length`,b.length??'',{step:'0.01',trace:'beamLength'})}
      ${ef(e,'Largeur (cm)',`beams.${i}.widthCm`,b.widthCm??'',{step:'1',trace:'beamWidth'})}
      ${ef(e,'Hauteur (cm)',`beams.${i}.heightCm`,b.heightCm??'',{step:'1',trace:'beamHeight'})}
      ${ef(e,'Type',`beams.${i}.ref`,b.ref??'poutre_ba_courante',{trace:'beamRef',options:workOptions(['poutre_ba_courante','poutre_ba_fortement_chargee','poutre_rive','poutre_redressement'])})}
      ${eb(e,'Supprimer',`class="btn danger small" data-remove-beam="${e.id}:${i}"`,'removeBeam')}
    </div>`).join(''):'<p class="muted">Aucune poutre.</p>'}
  </div></div>`;
  const beamRefs=[...new Set(beams.map(b=>b.ref||'poutre_ba_courante').filter(id=>WORK_BY_ID[id]))];
  h+=beamRefs.map(id=>renderRefOverrides('element',d,id).replaceAll('data-field=',`data-el-id="${e.id}" data-field=`)).join('');

  const pignons=d.pignons||[];
  h+=`<div class="element-card"><header><strong>Pignons</strong>${eb(e,'+ Ajouter',`class="btn ghost small" data-add-pignon="${e.id}"`,'addPignon')}</header><div class="body">
    ${pignons.length?pignons.map((p,i)=>`<div class="grid cols-3 line-editor">
      ${ef(e,'Largeur (m)',`pignons.${i}.width`,p.width??'',{step:'0.01',trace:'pignonWidth'})}
      ${ef(e,'Pente (%)',`pignons.${i}.slope`,p.slope??'',{step:'0.1',trace:'pignonSlope'})}
      ${eb(e,'Supprimer',`class="btn danger small" data-remove-pignon="${e.id}:${i}"`,'removePignon')}
    </div>`).join(''):'<p class="muted">Aucun pignon.</p>'}
  </div></div>`;

  h+=`<div class="separator"></div><div class="grid cols-3">
    ${ef(e,'Étanchéité','waterproof',d.waterproof??'',{trace:'elevationWaterproof',options:[{value:'',label:'Aucune'},{value:'delta_ms',label:'Delta MS'},{value:'enduit_hydrofuge',label:'Enduit hydrofuge'}]})}
    ${ef(e,'Décoration extérieure','decoration',d.decoration??'',{trace:'elevationDecoration',options:[{value:'',label:'Aucune'},{value:'genoise_simple',label:'Génoise simple'},{value:'genoise_double',label:'Génoise double'},{value:'corniche_pierre',label:'Corniche pierre'}]})}
    ${ec(e,'Traitement anti-termite','antiTermite',!!d.antiTermite,'elevationAntiTermite')}
  </div>`;
  h+=renderRefOverrides('element',d,'chainage_horizontal').replaceAll('data-field=',`data-el-id="${e.id}" data-field=`);
  h+=renderRefOverrides('element',d,'chainage_vertical').replaceAll('data-field=',`data-el-id="${e.id}" data-field=`);
  return h;
}

function renderStairElement(e){
  const d=e.data, refId=d.stairRef||'escalier_ba';
  return `<div class="grid cols-5">
    ${ef(e,"Type d'escalier",'stairType',d.stairType??'droit',{trace:'stairType',options:[{value:'droit',label:'Droit'},{value:'quart_tournant',label:'1/4 tournant'},{value:'demi_tournant',label:'2/4 tournant'}]})}
    ${ef(e,'Ouvrage de référence','stairRef',refId,{trace:'stairRef',options:workOptions(['escalier_ba','paillasse_escalier','palier_ba'])})}
    ${ef(e,'Surface réelle (m²)','surface',d.surface??'',{required:true,step:'0.1',trace:'stairSurface'})}
    ${ef(e,'Hauteur (m)','height',d.height??'',{step:'0.01',trace:'stairHeight'})}
    ${ef(e,'Classe béton','concreteClass',d.concreteClass??'',{required:true,trace:'concreteClass',options:[{value:'',label:'Choisir…'},...concreteClassOptions()]})}
  </div><div class="grid cols-3" style="margin-top:14px">
    ${ef(e,'Prix manuel total HT (€) — facultatif','manualPrice',d.manualPrice??'',{step:'1',trace:'stairManualPrice'})}
    ${ec(e,'Prix manuel inclut la main-d’œuvre','manualIncludesLabor',!!d.manualIncludesLabor,'stairManualIncludesLabor')}
    ${ef(e,'Heures-homme planning si prix manuel','manualHours',d.manualHours??'',{step:'0.1',trace:'stairManualHours'})}
  </div>${renderRefOverrides('element',d,refId).replaceAll('data-field=',`data-el-id="${e.id}" data-field=`)}`;
}

function renderSlabElement(e){
  const d=e.data,refId=d.slabRef||'';
  return `<div class="grid cols-5">
    ${ef(e,'Longueur (m)','length',d.length??'',{required:true,step:'0.1',trace:'slabLength'})}
    ${ef(e,'Largeur (m)','width',d.width??'',{required:true,step:'0.1',trace:'slabWidth'})}
    ${ef(e,'Épaisseur réelle (cm)','thickness',d.thickness??12,{required:true,step:'1',trace:'slabThickness'})}
    ${ef(e,'Type de dalle','slabRef',refId,{required:true,trace:'slabRef',options:[{value:'',label:'Choisir…'},...workOptions(['dallage_non_arme','dallage_arme','dalle_pleine_ba','dalle_pleine_fortement_armee','dalle_portee','plancher_poutrelles_hourdis','plancher_predalles'])]})}
    ${ef(e,'Classe béton','concreteClass',d.concreteClass??'',{required:true,trace:'concreteClass',options:[{value:'',label:'Choisir…'},...concreteClassOptions()]})}
  </div><div class="grid cols-4" style="margin-top:14px">
    <div class="panel soft">${ec(e,'Treillis soudé','treillis',!!d.treillis,'slabTreillis')}<br>${ec(e,'Fibres','fibres',!!d.fibres,'slabFibres')}</div>
    ${d.treillis?ef(e,'Type de treillis','treillisType',d.treillisType??'ST25C',{trace:'treillisType',options:treillisOptions()}):''}
    ${d.fibres?ef(e,'Type de fibres','fibreType',d.fibreType??'courante',{trace:'fibreType',options:Object.entries(FIBRES).map(([id,r])=>({value:id,label:`${r.label} — ${r.min} à ${r.max} kg/m³`}))}):''}
    ${d.fibres?ef(e,'Dosage fibres (kg/m³)','fibreDose',d.fibreDose??'',{required:true,step:'0.1',trace:'fibreDose'}):''}
  </div>${refId?renderRefOverrides('element',d,refId).replaceAll('data-field=',`data-el-id="${e.id}" data-field=`):''}`;
}

function renderGenericWorkElement(e){
  const d=e.data,refId=d.workRef||'beton_proprete',ref=WORK_BY_ID[refId];
  return `<div class="grid cols-3">
    ${ef(e,'Ouvrage BA','workRef',refId,{trace:'genericWorkRef',options:workOptions()})}
    ${ef(e,`Quantité (${ref?.unite||'unité'})`,'quantity',d.quantity??'',{required:true,step:'0.001',trace:'genericWorkQty'})}
    ${ef(e,'Classe béton','concreteClass',d.concreteClass??'',{required:true,trace:'concreteClass',options:[{value:'',label:'Choisir…'},...concreteClassOptions()]})}
  </div>${renderRefOverrides('element',d,refId).replaceAll('data-field=',`data-el-id="${e.id}" data-field=`)}`;
}

function chimneyOverrideValue(d,kind,id,key,base){
  const v=d.chimneyOverrides?.[kind]?.[id]?.[key];
  return v!==undefined?v:base;
}

function chimneyOverrideFields(scope,d,kind,id,ref,e=null){
  if(!id||!ref)return '';
  const p=`chimneyOverrides.${kind}.${id}`;
  const F=(label,key,val,trace)=> scope==='element'
    ? ef(e,label,`${p}.${key}`,val,{step:'0.01',trace})
    : field(label,`${p}.${key}`,val,{step:'0.01',trace});
  return `<details class="accordion"><summary>⚙️ Valeurs modifiables — ${esc(ref.label)}</summary><div class="accordion-body"><div class="grid cols-3">
    ${F('Fourniture HT', 'supply', chimneyOverrideValue(d,kind,id,'supply',ref.supply), 'chimneySupplyOverride')}
    ${F('Temps MO', 'hours', chimneyOverrideValue(d,kind,id,'hours',ref.h), 'chimneyHoursOverride')}
    ${F('Total HT', 'total', chimneyOverrideValue(d,kind,id,'total',ref.total), 'chimneyTotalOverride')}
  </div></div></details>`;
}

function renderChimneyConfig(scope,d,e=null){
  const F=(label,key,val,opts)=> scope==='element'?ef(e,label,key,val,opts):field(label,key,val,opts);
  const cId=d.conduit||'20x20', c=CHIMNEY_CONDUITS[cId];
  const sId=d.stack||'', s=CHIMNEY_STACKS[sId];
  const capId=d.cap||'', cap=CHIMNEY_CAPS[capId];
  let h=`<div class="section-title"><h2>Cheminée</h2><p>Calcul automatique modifiable, remplaçable par un prix manuel.</p></div>
  <div class="grid cols-4">
    ${F('Hauteur conduit (ml)','height',d.height??'',{required:true,step:'0.1',trace:'chimneyHeight'})}
    ${F('Nombre de conduits','count',d.count??1,{required:true,step:'1',min:'1',trace:'chimneyCount'})}
    ${F('Type de conduit','conduit',cId,{trace:'chimneyConduit',options:Object.entries(CHIMNEY_CONDUITS).map(([id,r])=>({value:id,label:r.label}))})}
    ${F('Type de foyer','foyer',d.foyer??'ouvert',{trace:'chimneyFoyer',options:[{value:'ouvert',label:'Foyer ouvert'},{value:'insert',label:'Insert'},{value:'poele',label:'Poêle'},{value:'chaudiere',label:'Chaudière'}]})}
  </div>
  <div class="grid cols-4" style="margin-top:14px">
    ${F('Souche','stack',sId,{trace:'chimneyStack',options:[{value:'',label:'Aucune'},...Object.entries(CHIMNEY_STACKS).map(([id,r])=>({value:id,label:r.label}))]})}
    ${F('Nombre de souches','stackCount',d.stackCount??0,{step:'1',min:'0',trace:'chimneyStackCount'})}
    ${F('Chapeau','cap',capId,{trace:'chimneyCap',options:[{value:'',label:'Aucun'},...Object.entries(CHIMNEY_CAPS).map(([id,r])=>({value:id,label:r.label}))]})}
    ${F('Nombre de chapeaux','capCount',d.capCount??0,{step:'1',min:'0',trace:'chimneyCapCount'})}
  </div>
  <div class="grid cols-2" style="margin-top:14px">
    ${F('Prix manuel total HT (€) — facultatif','manualPrice',d.manualPrice??'',{step:'1',trace:'chimneyManualPrice',help:'Remplace le prix automatique ; les heures restent utilisées pour le planning.'})}
  </div>
  ${chimneyOverrideFields(scope,d,'conduit',cId,c,e)}
  ${s?chimneyOverrideFields(scope,d,'stack',sId,s,e):''}
  ${cap?chimneyOverrideFields(scope,d,'cap',capId,cap,e):''}`;
  return h;
}

const FOUNDATION_GLOBAL_OPTIONS = [
  ['resineAntiTermite','Résine anti-termite'],['implantation','Implantation'],['ouvertureFondations','Ouverture des fondations'],
  ['canalisationFourreau','Canalisation + fourreau'],['plateformeVs','Plateforme VS'],['enduitHydrofugeFondation','Enduit hydrofuge'],
  ['deltaMs','Delta MS'],['etudeSol','Étude de sol']
];

function renderPricedGlobalOption(g,key,label){
  const o=g.foundationOptions?.[key]||{};
  const path=`foundationOptions.${key}`;
  return `<div class="option-priced">${check(label,`${path}.enabled`,!!o.enabled,'global','foundationOption')}
    ${o.enabled?`<div class="grid cols-3" style="margin-top:8px">
      ${field('Quantité',`${path}.qty`,o.qty??1,{scope:'global',step:'0.01',trace:'foundationOptionQty'})}
      ${field('Unité',`${path}.unit`,o.unit??'forfait',{scope:'global',trace:'foundationOption',options:[{value:'forfait',label:'forfait'},{value:'m²',label:'m²'},{value:'ml',label:'ml'},{value:'m³',label:'m³'},{value:'jour',label:'jour'}]})}
      ${field('Prix U. HT',`${path}.price`,o.price??'',{scope:'global',step:'0.01',required:true,trace:'foundationOptionPrice'})}
    </div>`:''}
  </div>`;
}

export function renderOptions(state){
  const g=state.globals,d=state.simple;
  let specific='';
  if(state.mode==='simple'&&state.simpleType==='murs'){
    const simplePerimeter=num(d.width)>0?2*(num(d.length)+num(d.width)):num(d.length);
    const simpleVEstimate=estimatedVerticalChainage(simplePerimeter,d.height);
    const isBanche=d.material==='beton_banche';
    specific=`<details class="accordion" open><summary>🏗️ Matériaux de construction</summary><div class="accordion-body">
      <div class="grid ${isBanche?'cols-5':'cols-2'}">
        ${field('Type de bloc / matériau','material',d.material??'parpaing',{trace:'wallMaterial',options:[{value:'parpaing',label:'Parpaing creux'},{value:'brique',label:'Brique de terre cuite'},{value:'beton_cellulaire',label:'Béton cellulaire (Siporex)'},{value:'pierre',label:'Pierre naturelle'},{value:'beton_banche',label:'Béton banché'}]})}
        ${field(isBanche?'Méthode':'Méthode de pose','method',isBanche?(d.method==='prefabrique'?'prefabrique':'coule_sur_place'):(['tradi','colle'].includes(d.method)?d.method:'tradi'),{trace:'wallMethod',options:isBanche?[{value:'coule_sur_place',label:'Coulé sur place'},{value:'prefabrique',label:'Préfabriqué'}]:[{value:'tradi',label:'Traditionnelle (mortier)'},{value:'colle',label:'Collée (joint mince)'}]})}
        ${isBanche&&d.method!=='prefabrique'?field('Classe béton','concreteClass',d.concreteClass??'',{required:true,trace:'concreteClass',options:[{value:'',label:'Choisir…'},...concreteClassOptions()]}):''}
        ${isBanche&&d.method==='prefabrique'?field('Type préfabriqué','prefabType',d.prefabType??'standard',{trace:'prefabType',options:[{value:'standard',label:'Standard — 1,55 h-homme/ml'},{value:'hauteur_importante',label:'Hauteur importante — 1,90 h-homme/ml'},{value:'lourd_complexe',label:'Lourd / complexe — 2,75 h-homme/ml'}]}):''}
        ${isBanche&&d.method==='prefabrique'?field('Prix total HT / m² — posé, livré, gruté','prefabPriceM2',d.prefabPriceM2??PREFAB_DEFAULT_PRICE_M2,{step:'1',trace:'prefabPriceM2'}):''}
      </div><div class="separator"></div>
      ${check('Chaînage horizontal','chainH',!!d.chainH,'simple','wallChainH')}<br>${check('Chaînage vertical','chainV',!!d.chainV,'simple','wallChainV')}
      ${d.chainH||d.chainV?`<div class="grid cols-2" style="margin-top:10px">${d.chainH?field('Linéaire horizontal total (ml)','chainHml',d.chainHml??simplePerimeter,{step:'0.1',trace:'wallChainH',help:'Prérempli avec le périmètre connu. Modifiable.'}):''}${d.chainV?field('Linéaire vertical total (ml)','chainVml',d.chainVml??simpleVEstimate,{step:'0.1',trace:'wallChainV',help:'Estimation réalisée à partir de ratios Guillaume : périmètre ÷ 3,50, arrondi supérieur, × hauteur. Modifiable ; ce n’est pas une règle DTU.'}):''}</div>`:''}
      ${d.chainH?renderRefOverrides('simple',d,'chainage_horizontal'):''}${d.chainV?renderRefOverrides('simple',d,'chainage_vertical'):''}
      ${isBanche&&d.method!=='prefabrique'?renderRefOverrides('simple',d,'mur_banche_courant'):''}
    </div></details>`;
  }
  if(state.mode==='simple'&&['dalle','terrasse'].includes(state.simpleType)){
    specific=`<details class="accordion" open><summary>⬜ Options dalle</summary><div class="accordion-body">
      ${check('Treillis soudé','treillis',!!d.treillis,'simple','slabTreillis')}<br>${check('Fibres','fibres',!!d.fibres,'simple','slabFibres')}
      ${d.treillis?`<div class="grid cols-2" style="margin-top:10px">${field('Type de treillis','treillisType',d.treillisType??'ST25C',{trace:'treillisType',options:treillisOptions()})}<div class="info-box">ST25C est une proposition métier Guillaume sur les cas prévus, modifiable ; ce n’est pas un dimensionnement structurel automatique.</div></div>`:''}
      ${d.fibres?`<div class="grid cols-2" style="margin-top:10px">${field('Type de fibres','fibreType',d.fibreType??'courante',{trace:'fibreType',options:Object.entries(FIBRES).map(([id,r])=>({value:id,label:`${r.label} — ${r.min} à ${r.max} kg/m³`}))})}${field('Dosage fibres (kg/m³)','fibreDose',d.fibreDose??'',{required:true,step:'0.1',trace:'fibreDose',help:'Le dosage reste la donnée exacte utilisée pour la quantité.'})}</div><div class="alert warn">${esc(FIBRE_WARNING)}</div>`:''}
      ${state.simpleType==='terrasse'?`<div class="separator"></div>${check('Étanchéité terrasse','terraceWaterproof',!!d.terraceWaterproof,'simple','terraceWaterproof')}${d.terraceWaterproof?field('Prix HT / m² étanchéité','terraceWaterproofPrice',d.terraceWaterproofPrice??'',{step:'0.01',required:true,trace:'terraceWaterproofPrice'}):''}<br>${check('Isolation thermique sous dalle','terraceInsulation',!!d.terraceInsulation,'simple','terraceInsulation')}${d.terraceInsulation?field('Prix HT / m² isolation','terraceInsulationPrice',d.terraceInsulationPrice??'',{step:'0.01',required:true,trace:'terraceInsulationPrice'}):''}`:''}
    </div></details>`;
  }

  const hasFoundation = state.mode==='simple'?state.simpleType==='fondations':state.elements.some(e=>e.type==='fondations');
  const foundationOptions = hasFoundation?`<details class="accordion"><summary>⛏️ Options fondations</summary><div class="accordion-body">${FOUNDATION_GLOBAL_OPTIONS.map(([k,l])=>renderPricedGlobalOption(g,k,l)).join('')}</div></details>`:'';

  return `<div class="section-title"><h2>Options chantier</h2><p>Chaque option visible possède un effet calculé, un prix explicite, des heures ou un contrôle de rapport.</p></div>
  ${specific}${foundationOptions}
  <details class="accordion" open><summary>🚚 Transport béton / location</summary><div class="accordion-body">
    <div class="grid cols-2"><div>${check('Camion-benne 8×4','truck',!!g.truck,'global','truck')}${g.truck?`<div class="grid cols-2" style="margin-top:10px">${field('Prix HT / jour','truckPrice',g.truckPrice??TRUCK_8X4_DEFAULT,{scope:'global',step:'1',trace:'truckPrice'})}${field('Nombre de jours','truckDays',g.truckDays??1,{scope:'global',step:'1',min:'1',trace:'truckDays'})}</div>${check('Enregistrer ce prix pour les prochains chiffrages','saveTruckPrice',!!g.saveTruckPrice,'global','saveTruckPrice')}`:''}</div>
    <div>${check('Camion pompe','pump',!!g.pump,'global','pump')}${g.pump?field('Prix HT camion pompe','pumpPrice',g.pumpPrice??PUMP_DEFAULT_PRICE,{scope:'global',step:'1',required:true,trace:'pumpPrice',help:'Référence Guillaume 950 € HT, modifiable.'}):''}<br>${check('Toupie béton','toupie',!!g.toupie,'global','toupie')}${g.toupie?`<div class="grid cols-2" style="margin-top:10px">${field('Mode toupie','toupieMode',g.toupieMode??'auto_volume',{scope:'global',trace:'toupieMode',options:[{value:'auto_volume',label:'Automatique selon volume béton'},{value:'manuel',label:'Nombre de toupies manuel'}]})}${field('Prix HT / m³','toupiePrice',g.toupiePrice??TOUPIE_PRICE_M3,{scope:'global',step:'1',required:true,trace:'toupiePrice',help:'Référence Guillaume 190 €/m³, minimum facturé 6 m³.'})}${g.toupieMode==='manuel'?field('Nombre de toupies','toupies',g.toupies??1,{scope:'global',step:'1',min:'1',trace:'toupies',help:`Capacité métier retenue : ${TOUPIE_CAPACITY_M3} m³ max par toupie.`}):''}</div><div class="info-box">Toupie : ${money(TOUPIE_PRICE_M3)}/m³, minimum ${TOUPIE_MIN_BILLABLE_M3} m³ = ${money(TOUPIE_PRICE_M3*TOUPIE_MIN_BILLABLE_M3)}. Capacité retenue avec Guillaume : ${TOUPIE_CAPACITY_M3} m³ maximum par toupie.</div>`:''}</div></div>
    <div class="separator"></div>${field('Contrôle productivité béton','concreteControlMode',g.concreteControlMode??'aucun',{scope:'global',trace:'concreteControlMode',options:[{value:'aucun',label:'Aucun contrôle complémentaire'},{value:'betonniere',label:'Bétonnière — 4 h-homme/m³'},{value:'toupie',label:'Toupie — 1 h-homme/m³'}],help:'Affiché comme contrôle de planning séparé ; non additionné automatiquement aux temps ouvrage pour éviter un double comptage.'})}
  </div></details>
  <details class="accordion"><summary>⛏️ Préparation et accès</summary><div class="accordion-body">
    ${check('Terrassement','earthworks',!!g.earthworks,'global','earthworks')}${g.earthworks?`<div class="grid cols-3">${field('Quantité','earthworksQty',g.earthworksQty??'',{scope:'global',step:'0.01',required:true,trace:'earthworksQty'})}${field('Unité','earthworksUnit',g.earthworksUnit??'m³',{scope:'global',trace:'earthworksUnit',options:[{value:'m³',label:'m³'},{value:'m²',label:'m²'},{value:'ml',label:'ml'},{value:'forfait',label:'forfait'}]})}${field('Prix U. HT','earthworksPrice',g.earthworksPrice??'',{scope:'global',step:'0.01',required:true,trace:'earthworksPrice'})}</div>`:''}<br>
    ${check('Remblaiement','backfill',!!g.backfill,'global','backfill')}${g.backfill?`<div class="grid cols-3">${field('Quantité','backfillQty',g.backfillQty??'',{scope:'global',step:'0.01',required:true,trace:'backfillQty'})}${field('Unité','backfillUnit',g.backfillUnit??'m³',{scope:'global',trace:'backfillUnit',options:[{value:'m³',label:'m³'},{value:'m²',label:'m²'},{value:'ml',label:'ml'},{value:'forfait',label:'forfait'}]})}${field('Prix U. HT','backfillPrice',g.backfillPrice??'',{scope:'global',step:'0.01',required:true,trace:'backfillPrice'})}</div>`:''}<br>
    ${check('Échafaudage','scaffold',!!g.scaffold,'global','scaffold')}${g.scaffold?`<div class="grid cols-3">${field('Quantité','scaffoldQty',g.scaffoldQty??'',{scope:'global',step:'0.01',required:true,trace:'scaffoldQty'})}${field('Unité','scaffoldUnit',g.scaffoldUnit??'jour',{scope:'global',trace:'scaffoldUnit',options:[{value:'jour',label:'jour'},{value:'m²',label:'m²'},{value:'forfait',label:'forfait'}]})}${field('Prix U. HT','scaffoldPrice',g.scaffoldPrice??'',{scope:'global',step:'0.01',required:true,trace:'scaffoldPrice'})}</div>`:''}<br>
    ${check('Accès difficile — plus-value en heures explicites','difficultAccess',!!g.difficultAccess,'global','difficultAccess')}${g.difficultAccess?field('Heures-homme supplémentaires','difficultAccessHours',g.difficultAccessHours??'',{scope:'global',step:'0.1',required:true,trace:'difficultAccessHours'}):''}
  </div></details>
  <details class="accordion"><summary>🎨 Finitions</summary><div class="accordion-body">
    ${check('Enduit de finition','finishCoat',!!g.finishCoat,'global','finishCoat')}${g.finishCoat?`<div class="grid cols-3">${field('Quantité','finishCoatQty',g.finishCoatQty??'',{scope:'global',step:'0.01',required:true,trace:'finishCoatQty'})}${field('Unité','finishCoatUnit',g.finishCoatUnit??'m²',{scope:'global',trace:'finishCoatUnit',options:[{value:'m²',label:'m²'},{value:'forfait',label:'forfait'}]})}${field('Prix U. HT','finishCoatPrice',g.finishCoatPrice??'',{scope:'global',step:'0.01',required:true,trace:'finishCoatPrice'})}</div>`:''}<br>
    ${check('Enduit hydrofuge','waterproofCoat',!!g.waterproofCoat,'global','waterproofCoat')}${g.waterproofCoat?`<div class="grid cols-3">${field('Quantité','waterproofCoatQty',g.waterproofCoatQty??'',{scope:'global',step:'0.01',required:true,trace:'waterproofCoatQty'})}${field('Unité','waterproofCoatUnit',g.waterproofCoatUnit??'m²',{scope:'global',trace:'waterproofCoatUnit',options:[{value:'m²',label:'m²'},{value:'forfait',label:'forfait'}]})}${field('Prix U. HT','waterproofCoatPrice',g.waterproofCoatPrice??'',{scope:'global',step:'0.01',required:true,trace:'waterproofCoatPrice'})}</div>`:''}
  </div></details>`;
}

function line(id,name,category,qty,unit,price=0,priceMode='required',meta={}){
  return {id,name,category,qty:Math.max(0,num(qty)),unit,price:Math.max(0,num(price)),priceMode,...meta};
}
function labor(name,hours,meta={}){ return {name,hours:Math.max(0,num(hours)),...meta}; }

function addRefLines(lines,ref,quantity,prefix,concreteClass='C25/30'){
  const q=num(quantity); if(!(q>0&&ref))return 0;
  if(ref.betonParUnite>0){
    lines.push(line(
      `${prefix}-beton`,
      `Béton ${concreteClass} — ${ref.label}`,
      'Béton',q*ref.betonParUnite,'m³',0,'required',
      {catalogRole:'concrete'}
    ));
  }
  if(ref.acierParUnite>0){
    const meta={};
    // Le prix du poste reste calculé sur les kg Guillaume, mais le catalogue peut
    // utiliser le linéaire/surface physique de l'ouvrage pour commander des barres/panneaux.
    if(['ml','m²'].includes(ref.unite)){
      meta.catalogNeedQty=q;
      meta.catalogNeedUnit=ref.unite;
    }
    lines.push(line(
      `${prefix}-acier`,
      `Acier indicatif — ${ref.label}`,
      'Ferraillage',q*ref.acierParUnite,'kg',0,'required',meta
    ));
  }
  if(ref.coffrageParUnite>0){
    lines.push(line(
      `${prefix}-coffrage`,
      `Coffrage — ${ref.label}`,
      'Coffrage',q*ref.coffrageParUnite,'m²',0,'required',
      {catalogRole:'coffrage_surface'}
    ));
  }
  return q*ref.moHParUnite;
}

function addRefLinesIncluded(lines,ref,quantity,prefix,concreteClass='C25/30'){
  const q=num(quantity); if(!(q>0&&ref))return 0;
  if(ref.betonParUnite>0) lines.push(line(`${prefix}-beton`,`Béton ${concreteClass} — ${ref.label}`,'Béton',q*ref.betonParUnite,'m³',0,'included',{includedInPackage:true}));
  if(ref.acierParUnite>0) lines.push(line(`${prefix}-acier`,`Acier indicatif — ${ref.label}`,'Ferraillage',q*ref.acierParUnite,'kg',0,'included',{includedInPackage:true}));
  if(ref.coffrageParUnite>0) lines.push(line(`${prefix}-coffrage`,`Coffrage — ${ref.label}`,'Coffrage',q*ref.coffrageParUnite,'m²',0,'included',{includedInPackage:true}));
  return q*ref.moHParUnite;
}

function addDirectPricedLine(lines,id,name,category,qty,unit,price){
  if(num(qty)>0) lines.push(line(id,name,category,qty,unit,price,'explicit'));
}

// Le catalogue est une source de prix automatique : l'artisan n'a pas à sélectionner
// un article pour obtenir un chiffrage. Une sélection utilisateur compatible reste prioritaire,
// puis SpeedArti prend le meilleur article compatible et tarifé proposé par le moteur catalogue.
function resolveAutomaticCataloguePrice(line,preferredRef=''){
  if(preferredRef){
    const preferred=resolveCatalogueProduct(line,preferredRef);
    if(preferred?.compatible)return {referenceCatalogue:preferredRef,resolved:preferred,automatic:false};
  }
  const candidates=catalogueCandidatesForLine(line,20);
  for(const product of candidates){
    const resolved=resolveCatalogueProduct(line,product.referenceCatalogue);
    if(resolved?.compatible)return {referenceCatalogue:product.referenceCatalogue,resolved,automatic:true};
  }
  return {referenceCatalogue:'',resolved:null,automatic:false};
}

function chimneyResolved(d,kind,id,base){
  const ov=d.chimneyOverrides?.[kind]?.[id]||{};
  return {supply:ov.supply!==undefined?num(ov.supply):base.supply,h:ov.hours!==undefined?num(ov.hours):base.h,total:ov.total!==undefined?num(ov.total):base.total,label:base.label};
}

function calcChimney(d,prefix='chimney'){
  const lines=[], lab=[], alerts=[], reco=[];
  const height=num(d.height),count=Math.max(0,num(d.count));
  if(!(height>0)) alerts.push('🚨 Hauteur de conduit obligatoire.');
  if(!(count>0)) alerts.push('🚨 Nombre de conduits obligatoire.');
  let validatedLaborValue=0;
  if(height>0&&count>0){
    const base=CHIMNEY_CONDUITS[d.conduit||'20x20']; const r=chimneyResolved(d,'conduit',d.conduit||'20x20',base);
    lines.push(line(`${prefix}-conduit`,r.label,'Cheminée',height*count,'ml',r.supply,'validated'));
    lab.push(labor(`${r.label} — planning`,height*count*r.h,{annexPrice:(r.total-r.supply)*height*count}));
    validatedLaborValue+=(r.total-r.supply)*height*count;
  }
  const stackCount=num(d.stackCount);
  if(d.stack&&stackCount>0){
    const base=CHIMNEY_STACKS[d.stack],r=chimneyResolved(d,'stack',d.stack,base);
    lines.push(line(`${prefix}-stack`,r.label,'Cheminée',stackCount,'unité',r.supply,'validated'));
    lab.push(labor(`${r.label} — planning`,stackCount*r.h,{annexPrice:(r.total-r.supply)*stackCount}));
    validatedLaborValue+=(r.total-r.supply)*stackCount;
  }
  const capCount=num(d.capCount);
  if(d.cap&&capCount>0){
    const base=CHIMNEY_CAPS[d.cap],r=chimneyResolved(d,'cap',d.cap,base);
    lines.push(line(`${prefix}-cap`,r.label,'Cheminée',capCount,'unité',r.supply,'validated'));
    lab.push(labor(`${r.label} — planning`,capCount*r.h,{annexPrice:(r.total-r.supply)*capCount}));
    validatedLaborValue+=(r.total-r.supply)*capCount;
  }
  reco.push(`Type de foyer : ${d.foyer||'non renseigné'} (information chantier).`);
  reco.push('Cheminée : temps et montants de référence modifiables ; prix manuel possible.');
  if(num(d.manualPrice)>0){
    return {lines:[line(`${prefix}-manual`,'Cheminée — prix manuel total','Cheminée',1,'forfait',num(d.manualPrice),'explicit')],labor:lab.map(x=>({...x,includedInManual:true,annexPrice:undefined})),alerts,reco,laborPriceOverride:0,manualTotal:true};
  }
  return {lines,labor:lab,alerts,reco,laborPriceOverride:validatedLaborValue,manualTotal:false};
}

function addOpeningAssociated(lines,lab,o,prefix,container,concreteClass,alerts){
  const w=num(o.width),h=num(o.height), area=w*h;
  const assoc=o.type||o.associated||'';
  if(assoc==='talonnette_manuelle'){
    if(num(o.manualPrice)>0) lines.push(line(`${prefix}-talonnette`,'Talonnette — prix manuel','Maçonnerie',1,'unité',num(o.manualPrice),'explicit'));
    else alerts.push('🚨 Talonnette : prix manuel obligatoire.');
    if(num(o.manualHours)>0) lab.push(labor('Talonnette',num(o.manualHours)));
    return area;
  }
  const refId=assoc;
  if(['appui_fenetre_ba','seuil_ba'].includes(refId)){
    const ref=resolvedRef(container,refId), q=w;
    lab.push(labor(ref.label,addRefLines(lines,ref,q,`${prefix}-${refId}`,concreteClass)));
  }
  if(['linteau_ba_courant','linteau_ba_renforce'].includes(refId)){
    const q=num(o.lintelLength)||w;
    const ref=resolvedRef(container,refId);
    lab.push(labor(ref.label,addRefLines(lines,ref,q,`${prefix}-${refId}`,concreteClass)));
  }
  return area;
}

function calcWallSimple(state,lines,lab,alerts,reco){
  const d=state.simple,g=state.globals,cc=concreteClassFor(d,g);
  const L=num(d.length),W=num(d.width),H=num(d.height),T=num(d.thickness);
  const perimeter=W>0?2*(L+W):L;
  const gross=perimeter*H;
  const openingsArea=(d.openings||[]).reduce((s,o)=>s+num(o.width)*num(o.height),0);
  const net=Math.max(0,gross-openingsArea);
  if(!(L>0&&H>0&&T>0))alerts.push('🚨 Dimensions du mur incomplètes.');
  if(openingsArea>gross)alerts.push('🚨 Surface des ouvertures supérieure à la surface du mur.');
  if(d.material==='beton_banche'){
    if(d.method==='prefabrique'){
      const price=num(d.prefabPriceM2)||PREFAB_DEFAULT_PRICE_M2;
      lines.push(line('simple-wall-prefab','Mur préfabriqué béton — posé, livré, gruté','Structure préfabriquée',net,'m²',price,'explicit'));
      const hh=PREFAB_H_PER_ML[d.prefabType||'standard'];
      if(hh>0)lab.push(labor('Mur préfabriqué — planning pose',perimeter*hh,{includedInManual:true}));
      reco.push('Mur préfabriqué : prix commercial au m² incluant pose, livraison et grutage ; heures conservées uniquement pour le planning.');
    }else{
      const ref=resolvedRef(d,'mur_banche_courant');
      lab.push(labor('Mur banché',addRefLines(lines,ref,net,'simple-wall-banche',cc)));
    }
  }else{
    if(!(num(d.blocksPerM2)>0))alerts.push('🚨 Consommation blocs/m² obligatoire dans les réglages métier avancés.');
    if(!(num(d.wallHPerM2)>0))alerts.push('🚨 Temps de pose h-homme/m² obligatoire dans les réglages métier avancés.');
    if(net>0&&num(d.blocksPerM2)>0)lines.push(line(`simple-wall-block-${d.material||'parpaing'}-${T}`,`${d.material||'parpaing'} ${T} cm`,'Maçonnerie',net*num(d.blocksPerM2),'unité'));
    if(net>0&&num(d.mortarKgM2)>0)lines.push(line(`simple-wall-mortar-${d.method||'tradi'}`,d.method==='colle'?'Colle / mortier-colle':'Mortier traditionnel','Liants',net*num(d.mortarKgM2),'kg'));
    if(num(d.wallHPerM2)>0)lab.push(labor('Maçonnerie murs',net*num(d.wallHPerM2)));
  }
  for(let i=0;i<(d.openings||[]).length;i++) addOpeningAssociated(lines,lab,d.openings[i],`simple-open-${i}`,d,cc,alerts);
  if(d.chainH){
    const q=num(d.chainHml)>0?num(d.chainHml):perimeter;
    if(!(q>0))alerts.push('🚨 Linéaire chaînage horizontal obligatoire.');
    else{const ref=resolvedRef(d,'chainage_horizontal');lab.push(labor('Chaînage horizontal',addRefLines(lines,ref,q,'simple-chain-h',cc)));}
  }
  if(d.chainV){
    const q=num(d.chainVml)>0?num(d.chainVml):estimatedVerticalChainage(perimeter,H);
    if(!(q>0))alerts.push('🚨 Linéaire chaînage vertical obligatoire.');
    else{const ref=resolvedRef(d,'chainage_vertical');lab.push(labor('Chaînage vertical',addRefLines(lines,ref,q,'simple-chain-v',cc)));reco.push('Chaînage vertical : valeur automatique éventuelle = estimation réalisée à partir de ratios Guillaume, modifiable, distincte d’un contrôle DTU.');}
  }
  reco.push(`Nature : ${d.wallKind==='cloison_non_porteuse'?'cloison non porteuse':'mur'} ; surface brute ${fmt(gross,2)} m² ; ouvertures ${fmt(openingsArea,2)} m² ; nette ${fmt(net,2)} m².`);
}

function calcSlab(state,d,prefix,surface,lines,lab,alerts,reco,concreteClassOverride=''){
  const g=state.globals,cc=concreteClassOverride||concreteClassFor(d,g),ep=num(d.thickness),ref=resolvedRef(d,d.slabRef);
  if(!(surface>0&&ep>0))alerts.push(`🚨 ${prefix} : surface et épaisseur obligatoires.`);
  if(!ref)alerts.push(`🚨 ${prefix} : type de dalle de référence obligatoire.`);
  if(surface>0&&ep>0) lines.push(line(`${prefix}-concrete`,`Béton ${cc} — dalle réelle`,'Béton',surface*(ep/100),'m³'));
  if(d.treillis){
    const t=TREILLIS_GUILLAUME[d.treillisType||'ST25C'];
    if(!t) alerts.push(`🚨 ${prefix} : type de treillis obligatoire.`);
    else if(surface>0){
      lines.push(line(`${prefix}-steel`,`Treillis ${t.label} — ${t.maille}`,'Ferraillage',surface,'m²',t.priceM2,'validated',{catalogNeedQty:surface,catalogNeedUnit:'m²',catalogRole:'treillis',treillisType:d.treillisType||'ST25C'}));
      lab.push(labor(`Pose treillis ${t.label}`,surface*t.hPerM2));
      reco.push(`${prefix} : treillis ${t.label} = référentiel métier Guillaume, modifiable ; ce choix ne constitue pas un dimensionnement structurel.`);
    }
  }
  if(d.fibres){
    const f=FIBRES[d.fibreType||'courante'],dose=num(d.fibreDose);
    if(!(dose>0))alerts.push(`🚨 ${prefix} : dosage fibres obligatoire.`);
    if(dose>0&&surface>0&&ep>0){
      lines.push(line(`${prefix}-fibres`,`Fibres — ${f.label}`,'Ferraillage',surface*(ep/100)*dose,'kg'));
      if(dose<f.min||dose>f.max)alerts.push(`⚠️ ${prefix} : dosage fibres hors plage indicative ${f.min}–${f.max} kg/m³.`);
    }
    alerts.push(FIBRE_WARNING);
  }
  if(ref){
    if(ref.coffrageParUnite>0)lines.push(line(`${prefix}-coffrage`,`Coffrage — ${ref.label}`,'Coffrage',surface*ref.coffrageParUnite,'m²'));
    lab.push(labor(ref.label,surface*ref.moHParUnite));
  }
  alerts.push(STRUCTURE_WARNING);
  reco.push(`${prefix} : volume béton réel = ${fmt(surface*(ep/100),3)} m³ ; classe ${cc} ; contrôle annexe béton = ${ref?fmt(surface*ref.betonParUnite,3):'—'} m³.`);
}

function calcFoundationSimple(state,lines,lab,alerts,reco){
  const d=state.simple,g=state.globals,cc=concreteClassFor(d,g),refId=d.foundationRef||'semelle_filante',ref=resolvedRef(d,refId);
  const L=num(d.length),W=num(d.widthCm),H=num(d.heightCm),vol=L*(W/100)*(H/100);
  if(!(vol>0))alerts.push('🚨 Longueur, largeur et épaisseur de semelle obligatoires.');
  if(vol>0&&ref)lab.push(labor(ref.label,addRefLines(lines,ref,vol,'simple-foundation',cc)));
  reco.push(`Profondeur de fouille séparée : ${fmt(num(d.excavationDepth),2)} m ; classe béton ${cc}.`);
  alerts.push(STRUCTURE_WARNING);
}

function calcStair(state,d,prefix,lines,lab,alerts,reco){
  const ref=resolvedRef(d,d.stairRef||'escalier_ba'),s=num(d.surface),cc=concreteClassFor(d,state.globals);
  reco.push(`Type d'escalier : ${d.stairType||'non renseigné'} ; hauteur : ${fmt(num(d.height),2)} m ; classe béton ${cc}.`);
  if(num(d.manualPrice)>0){
    lines.push(line(`${prefix}-manual`,'Escalier — prix manuel total','Escalier',1,'forfait',num(d.manualPrice),'explicit'));
    if(!(num(d.manualHours)>0))alerts.push('⚠️ Escalier au prix manuel : heures de planning non renseignées.');
    else lab.push(labor('Escalier — planning manuel',num(d.manualHours),{includedInManual:!!d.manualIncludesLabor}));
    return {manualTotal:true,manualIncludesLabor:!!d.manualIncludesLabor};
  }
  if(!(s>0))alerts.push('🚨 Surface réelle escalier obligatoire.');
  if(s>0&&ref)lab.push(labor(ref.label,addRefLines(lines,ref,s,prefix,cc)));
  alerts.push(STRUCTURE_WARNING);
  return {manualTotal:false,manualIncludesLabor:false};
}

function calcFoundationElement(state,e,lines,lab,alerts,reco){
  const d=e.data,g=state.globals,p=e.id;
  if(d.foundationType==='micro_pieux'){
    const n=num(d.microCount),depth=num(d.microDepth),suggested=micropileSuggestedPrice(depth),pr=num(d.microPrice)||suggested;
    if(!(n>0))alerts.push(`🚨 ${e.name} : nombre de micro-pieux obligatoire.`);
    if(!(depth>=3))alerts.push(`🚨 ${e.name} : profondeur des micro-pieux obligatoire (minimum 3 m pour le référentiel Guillaume).`);
    if(n>0){
      if(!(pr>0))alerts.push(`🚨 ${e.name} : prix micro-pieu obligatoire.`);
      else lines.push(line(`${p}-micro`,'Micro-pieux — fourniture + main-d’œuvre incluse','Fondations',n,'unité',pr,'explicit'));
    }
    if(suggested>0)reco.push(`${e.name} : prix micro-pieu proposé selon profondeur ${fmt(depth,1)} m = ${money(suggested)} / unité, modifiable. La profondeur sert au chiffrage uniquement.`);
    if(num(d.microSlabSurface)>0){
      if(!d.slabRef) alerts.push(`🚨 ${e.name} : type de dalle associée obligatoire.`);
      else calcSlab(state,d,`${e.name} dalle VS`,num(d.microSlabSurface),lines,lab,alerts,reco,d.slabConcreteClass||g.concreteClass);
      if(d.microSlabInsulation==='avec_isolant') lines.push(line(`${p}-slab-insulation`,'Isolation dalle sur VS','Isolation',num(d.microSlabSurface),'m²'));
    }
    const L=num(d.beamLength),W=num(d.beamWidthCm),H=num(d.beamHeightCm);
    if(L||W||H){
      if(!(L>0&&W>0&&H>0))alerts.push(`🚨 ${e.name} : dimensions de longrine incomplètes.`);
      else {
        const v=L*(W/100)*(H/100),ref=resolvedRef(d,'longrine_fondation'),price=num(d.longrinePrice)||LONGRINE_PRICE_ML,cc=d.longrineConcreteClass||g.concreteClass||'';
        lines.push(line(`${p}-longrine-package`,'Longrine — prix métier Guillaume','Fondations',L,'ml',price,'explicit'));
        const planning=addRefLinesIncluded(lines,ref,v,`${p}-longrine-included`,cc);
        if(planning>0)lab.push(labor(`${e.name} — longrine planning`,planning,{includedInManual:true}));
        reco.push(`${e.name} : longrine ${fmt(L,2)} ml, volume géométrique ${fmt(v,3)} m³ ; prix ${money(price)}/ml séparé des micro-pieux.`);
      }
    }
    reco.push(`${e.name} : dimensionnement des micro-pieux hors moteur SpeedArti ; étude géotechnique/structure requise.`);
  }

  if(d.foundationType==='plot_isole'){
    const n=num(d.plotCount),v=num(d.plotVolume);
    if(!(n>0))alerts.push(`🚨 ${e.name} : quantité de plots obligatoire.`);
    if(!(v>0))alerts.push(`🚨 ${e.name} : volume de plot obligatoire.`);
    if(!d.plotVolumeMode)alerts.push(`🚨 ${e.name} : préciser si le volume est unitaire ou total.`);
    const total=d.plotVolumeMode==='unitaire'?n*v:d.plotVolumeMode==='total'?v:0;
    if(total>0){const ref=resolvedRef(d,'semelle_isolee'),cc=d.foundationConcreteClass||g.concreteClass||'';lab.push(labor(e.name,addRefLines(lines,ref,total,`${p}-plots`,cc)));}
    if(d.plotVolumeMode==='total')reco.push(`${e.name} : la quantité de plots reste une donnée de rapport ; le volume béton total est saisi séparément.`);
  }

  if(['vide_sanitaire','terre_plein'].includes(d.foundationType)){
    const per=num(d.perimeter),bh=num(d.blockHeight||.20),rows=num(d.rows),surface=per*bh*rows;
    const fw=num(d.footingWidthCm),fh=num(d.footingHeightCm),vol=per*(fw/100)*(fh/100);
    if(!(per>0&&fw>0&&fh>0))alerts.push(`🚨 ${e.name} : semelle soubassement incomplète.`);
    if(vol>0){const ref=resolvedRef(d,'semelle_filante'),cc=d.foundationConcreteClass||g.concreteClass||'';lab.push(labor(`${e.name} — semelle`,addRefLines(lines,ref,vol,`${p}-foot`,cc)));}
    if(surface>0){
      if(!(num(d.blocksPerM2)>0))alerts.push(`🚨 ${e.name} : consommation blocs/m² soubassement obligatoire dans les réglages métier avancés.`); else lines.push(line(`${p}-basement-blocks`,'Blocs de soubassement','Maçonnerie',surface*num(d.blocksPerM2),'unité'));
      if(!(num(d.wallHPerM2)>0))alerts.push(`🚨 ${e.name} : temps mur soubassement obligatoire dans les réglages métier avancés.`); else lab.push(labor(`${e.name} — murs soubassement`,surface*num(d.wallHPerM2)));
    }
    const mlStiff=num(d.stiffeners)*bh*rows;
    if(mlStiff>0){const ref=resolvedRef(d,'potelet_raidisseur_vertical');lab.push(labor(`${e.name} — raidisseurs`,addRefLines(lines,ref,mlStiff,`${p}-stiff`,d.foundationConcreteClass||g.concreteClass||'')));}

    const rs=num(d.refendLength)*num(d.refendHeight);
    if(num(d.refendLength)>0||num(d.refendHeight)>0){
      if(!(rs>0))alerts.push(`🚨 ${e.name} : longueur et hauteur du refend doivent être renseignées ensemble.`);
      if(rs>0){
        if(!(num(d.refendBlocksPerM2)>0))alerts.push(`🚨 ${e.name} : consommation blocs/m² refend obligatoire dans les réglages métier avancés.`); else lines.push(line(`${p}-refend-blocks`,'Blocs mur de refend','Maçonnerie',rs*num(d.refendBlocksPerM2),'unité'));
        if(!(num(d.refendHoursPerM2)>0))alerts.push(`🚨 ${e.name} : temps refend h/m² obligatoire dans les réglages métier avancés.`); else lab.push(labor(`${e.name} — mur refend`,rs*num(d.refendHoursPerM2)));
        const rml=num(d.refendStiffeners)*num(d.refendHeight);
        if(rml>0){const ref=resolvedRef(d,'potelet_raidisseur_vertical');lab.push(labor(`${e.name} — raidisseurs refend`,addRefLines(lines,ref,rml,`${p}-refend-stiff`,d.foundationConcreteClass||g.concreteClass||'')));}
      }
    }
    if(num(d.slabSurface)>0){
      if(!d.slabRef)alerts.push(`🚨 ${e.name} : type de dalle associée obligatoire.`);
      else calcSlab(state,d,`${e.name} dalle associée`,num(d.slabSurface),lines,lab,alerts,reco,d.slabConcreteClass||g.concreteClass);
      if(d.foundationType==='vide_sanitaire'&&d.slabInsulation==='avec_isolant') lines.push(line(`${p}-vs-insulation`,'Isolation plancher VS','Isolation',num(d.slabSurface),'m²'));
    }