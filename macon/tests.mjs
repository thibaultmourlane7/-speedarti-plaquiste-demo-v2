import assert from 'node:assert/strict';
import fs from 'node:fs';
import {
  CATALOGUE_MACON, catalogueCandidatesForLine, resolveCatalogueProduct
} from './catalogue-macon.js';
import {
  defaultState, newElement, renderMode, renderWorks, renderConfig, renderOptions, renderPrices,
  calculate, validateStep, assertBalisage,
  WORKS, WORK_BY_ID, FIBRES, PREFAB_H_PER_ML, TRUCK_8X4_DEFAULT
} from './core.js';

const pass=[];
function test(name,fn){try{fn();pass.push(name)}catch(e){console.error(`FAIL — ${name}`);throw e}}
function base(){const s=defaultState();s.globals.hourly=50;s.globals.vat=20;s.globals.workers=2;return s;}
function fillRequiredPrices(s){const r=calculate(s);for(const l of r.missingPrices)s.manualPrices[l.id]=10;return calculate(s)}
function qty(r,id){const l=r.lines.find(x=>x.id===id);return l?.qty??null}

test('référentiel Guillaume: 40 ouvrages',()=>assert.equal(WORKS.length,40));
test('camion-benne 8x4 = 800 € HT/j',()=>assert.equal(TRUCK_8X4_DEFAULT,800));
test('préfabriqué 1,55 / 1,90 / 2,75 h-homme/ml',()=>assert.deepEqual(PREFAB_H_PER_ML,{standard:1.55,hauteur_importante:1.9,lourd_complexe:2.75}));
test('fibres: plages validées',()=>{
  assert.deepEqual([FIBRES.courante.min,FIBRES.courante.max],[3,4]);
  assert.deepEqual([FIBRES.renforcee.min,FIBRES.renforcee.max],[5,6]);
  assert.deepEqual([FIBRES.fortement_sollicitee.min,FIBRES.fortement_sollicitee.max],[7,9]);
  assert.deepEqual([FIBRES.metallique_structurelle.min,FIBRES.metallique_structurelle.max],[20,40]);
});

test('select dalle persiste après rerender',()=>{
  const s=base();s.simpleType='dalle';s.simple.slabRef='dalle_pleine_ba';s.simple.surface=10;s.simple.thickness=20;
  const html=renderConfig(s);assert.match(html,/<option value="dalle_pleine_ba" selected>/);
});
test('select matériau mur persiste après rerender',()=>{
  const s=base();s.simpleType='murs';s.simple.material='brique';
  const html=renderOptions(s);assert.match(html,/<option value="brique" selected>/);
});
test('select préfabriqué persiste après rerender',()=>{
  const s=base();s.mode='multiple';const e=newElement('murs_porteurs');e.data.method='prefabrique';e.data.prefabType='lourd_complexe';e.data.length=10;e.data.height=3;e.data.thickness=20;s.elements=[e];
  const html=renderConfig(s);assert.match(html,/<option value="lourd_complexe" selected>/);
});
test('select plot volume total persiste après rerender',()=>{
  const s=base();s.mode='multiple';const e=newElement('fondations');e.data.foundationType='plot_isole';e.data.plotVolumeMode='total';s.elements=[e];
  assert.match(renderConfig(s),/<option value="total" selected>/);
});

test('les 40 ouvrages sont réellement accessibles dans UI Annexe 1',()=>{
  const s=base();s.mode='multiple';const e=newElement('ouvrage_ba');s.elements=[e];const html=renderConfig(s);
  for(const w of WORKS)assert.ok(html.includes(`value="${w.id}"`),`ouvrage inaccessible: ${w.id}`);
});

test('balisage: aucun contrôle orphelin sur parcours représentatifs',()=>{
  const states=[];
  let s=base();states.push([renderMode,s]);states.push([renderWorks,s]);
  s=base();s.simpleType='murs';s.simple={...s.simple,length:10,height:2.5,thickness:20,blocksPerM2:10,wallHPerM2:0.8,openings:[{width:1,height:2,associated:'linteau_ba_courant'}],material:'brique',method:'tradi',chainH:true,chainHml:10};states.push([renderConfig,s]);states.push([renderOptions,s]);
  s=base();s.simpleType='dalle';s.simple={...s.simple,surface:10,thickness:12,slabRef:'dallage_arme',treillis:true,fibres:true,fibreType:'renforcee',fibreDose:5.5};states.push([renderConfig,s]);states.push([renderOptions,s]);
  s=base();s.mode='multiple';
  const f=newElement('fondations');f.data.foundationType='vide_sanitaire';f.data.perimeter=20;f.data.blockHeight=.2;f.data.rows=3;f.data.blocksPerM2=10;f.data.wallHPerM2=.8;f.data.footingWidthCm=50;f.data.footingHeightCm=30;f.data.refendLength=5;f.data.refendHeight=.6;f.data.refendBlocksPerM2=10;f.data.refendHoursPerM2=.8;
  const w=newElement('murs_elevations');Object.assign(w.data,{length:10,height:2.5,thickness:20,material:'parpaing',method:'tradi',blocksPerM2:10,mortarKgM2:20,wallHPerM2:.8,openings:[{type:'linteau_ba_courant',width:1,height:2,lintelLength:1.2}],beams:[{length:3,widthCm:20,heightCm:30,ref:'poutre_ba_courante'}],pignons:[{width:5,slope:30}],waterproof:'delta_ms',decoration:'genoise_simple',antiTermite:true});
  const p=newElement('murs_porteurs');Object.assign(p.data,{length:10,height:3,thickness:20,method:'prefabrique',prefabType:'standard',baseSupplyPrice:100,braceQty:1,bracePrice:50,braceHours:.5});
  const d=newElement('dalle');Object.assign(d.data,{length:5,width:2,thickness:12,slabRef:'dallage_arme',treillis:true,fibres:true,fibreType:'courante',fibreDose:3.5});
  const c=newElement('cheminee');Object.assign(c.data,{height:5,count:1,conduit:'20x30',stack:'simple',stackCount:1,cap:'standard',capCount:1});
  const b=newElement('ouvrage_ba');Object.assign(b.data,{workRef:'radier_general',quantity:2});
  s.elements=[f,w,p,d,c,b];states.push([renderConfig,s]);states.push([renderOptions,s]);
  for(const [renderer,st] of states)assert.equal(assertBalisage(renderer(st)),true);
});

test('semelle m × cm × cm = 1,8 m³',()=>{
  const s=base();s.simpleType='fondations';Object.assign(s.simple,{foundationRef:'semelle_filante',length:10,widthCm:60,heightCm:30});
  const r=calculate(s);assert.ok(Math.abs(qty(r,'simple-foundation-beton')-1.8)<1e-9);
});

test('dalle simple et multi: parité physique',()=>{
  const a=base();a.simpleType='dalle';Object.assign(a.simple,{surface:10,thickness:12,slabRef:'dallage_arme',treillis:true});const ra=calculate(a);
  const b=base();b.mode='multiple';const e=newElement('dalle');Object.assign(e.data,{length:5,width:2,thickness:12,slabRef:'dallage_arme',treillis:true});b.elements=[e];const rb=calculate(b);
  const ac=ra.lines.find(x=>x.name.includes('Béton')&&x.category==='Béton').qty;
  const bc=rb.lines.find(x=>x.name.includes('Béton')&&x.category==='Béton').qty;
  const as=ra.lines.find(x=>x.category==='Ferraillage').qty;
  const bs=rb.lines.find(x=>x.category==='Ferraillage').qty;
  assert.equal(ac,bc);assert.equal(as,bs);assert.equal(ra.hours,rb.hours);
});

test('prix manquant: case visible et résultat bloqué',()=>{
  const s=base();s.simpleType='murs';Object.assign(s.simple,{length:10,height:2.5,thickness:20,blocksPerM2:10,wallHPerM2:.8,material:'parpaing'});
  const r=calculate(s);assert.ok(r.missingPrices.length>0);assert.equal(r.canFinalize,false);
  const html=renderPrices(s);assert.match(html,/Prix U\. HT/);assert.match(html,/data-root-field="manualPrices\./);
  assert.notEqual(validateStep(s,4),'');
  const rr=fillRequiredPrices(s);assert.equal(rr.missingPrices.length,0);assert.equal(rr.canFinalize,true);assert.equal(validateStep(s,4),'');
});

test('options visibles ont une case prix immédiate',()=>{
  const s=base();s.globals.earthworks=true;s.globals.backfill=true;s.globals.scaffold=true;s.globals.finishCoat=true;s.globals.waterproofCoat=true;s.globals.pump=true;s.globals.toupie=true;
  const h=renderOptions(s);
  for(const key of ['earthworksPrice','backfillPrice','scaffoldPrice','finishCoatPrice','waterproofCoatPrice','pumpPrice','toupiePrice'])assert.ok(h.includes(`data-global="${key}"`),`champ prix absent ${key}`);
});

test('camion-benne modifiable et mémorisable dans UI',()=>{
  const s=base();s.globals.truck=true;const h=renderOptions(s);assert.ok(h.includes('data-global="truckPrice"'));assert.ok(h.includes('data-global="saveTruckPrice"'));
});

test('préfabriqué: +30% fourniture seule, prix réel remplace',()=>{
  const s=base();s.mode='multiple';const e=newElement('murs_porteurs');Object.assign(e.data,{length:10,height:3,thickness:20,method:'prefabrique',prefabType:'standard',baseSupplyPrice:100});s.elements=[e];
  let r=calculate(s),l=r.lines.find(x=>x.id===`${e.id}-prefab`);assert.equal(l.price,130);assert.equal(r.hours,15.5);
  e.data.realSupplyPrice=120;r=calculate(s);l=r.lines.find(x=>x.id===`${e.id}-prefab`);assert.equal(l.price,120);
});

test('cheminée: conduit/souche/chapeau ont quantités indépendantes',()=>{
  const s=base();s.simpleType='cheminee';Object.assign(s.simple,{height:5,count:2,conduit:'20x20',stack:'simple',stackCount:2,cap:'standard',capCount:2,foyer:'insert'});
  const r=calculate(s);assert.equal(qty(r,'simple-chimney-conduit'),10);assert.equal(qty(r,'simple-chimney-stack'),2);assert.equal(qty(r,'simple-chimney-cap'),2);
  assert.equal(r.hours,10*.75+2*3.5+2*1);
});

test('cheminée: temps validé modifiable',()=>{
  const s=base();s.simpleType='cheminee';Object.assign(s.simple,{height:5,count:1,conduit:'20x20',stack:'',stackCount:0,cap:'',capCount:0,chimneyOverrides:{conduit:{'20x20':{hours:.8}}}});
  assert.equal(calculate(s).hours,4);
});

test('ouvrage BA: ratios Guillaume modifiables',()=>{
  const s=base();s.mode='multiple';const e=newElement('ouvrage_ba');Object.assign(e.data,{workRef:'radier_general',quantity:2,refOverrides:{radier_general:{acierParUnite:70}}});s.elements=[e];
  const r=calculate(s);const steel=r.lines.find(x=>x.id===`${e.id}-generic-acier`);assert.equal(steel.qty,140);
});

test('ouverture déduite + linteau traité séparément',()=>{
  const s=base();s.simpleType='murs';Object.assign(s.simple,{length:10,height:3,thickness:20,blocksPerM2:10,wallHPerM2:1,material:'parpaing',openings:[{width:1,height:2,associated:'linteau_ba_courant'}]});
  const r=calculate(s);const blocks=r.lines.find(x=>x.id.startsWith('simple-wall-block'));assert.equal(blocks.qty,280);assert.ok(r.lines.some(x=>x.id.includes('linteau_ba_courant-beton')));
});

test('prix manuel escalier inclus MO: pas de double facturation',()=>{
  const s=base();s.simpleType='escalier';Object.assign(s.simple,{stairType:'droit',stairRef:'escalier_ba',surface:5,manualPrice:2000,manualIncludesLabor:true,manualHours:8});
  const r=calculate(s);assert.equal(r.hours,8);assert.equal(r.laborCost,0);assert.equal(r.materials,2000);
});


test('les 40 ouvrages Annexe 1 sont calculables, pas seulement affichés',()=>{
  for(const w of WORKS){
    const s=base();s.mode='multiple';const e=newElement('ouvrage_ba');Object.assign(e.data,{workRef:w.id,quantity:1});s.elements=[e];
    const r=calculate(s);assert.equal(r.hours,w.moHParUnite,`MO ${w.id}`);
    if(w.betonParUnite>0)assert.equal(r.lines.find(x=>x.id===`${e.id}-generic-beton`).qty,w.betonParUnite,`béton ${w.id}`);
    if(w.acierParUnite>0)assert.equal(r.lines.find(x=>x.id===`${e.id}-generic-acier`).qty,w.acierParUnite,`acier ${w.id}`);
    if(w.coffrageParUnite>0)assert.equal(r.lines.find(x=>x.id===`${e.id}-generic-coffrage`).qty,w.coffrageParUnite,`coffrage ${w.id}`);
  }
});

test('balisage couvre aussi l’étape Prix / catalogue',()=>{
  const s=base();s.simpleType='murs';Object.assign(s.simple,{length:10,height:2.5,thickness:20,blocksPerM2:10,wallHPerM2:.8,material:'parpaing'});
  assert.equal(assertBalisage(renderPrices(s)),true);
});

test('cheminée prix manuel: heures conservées au planning, pas de double facturation',()=>{
  const s=base();s.simpleType='cheminee';Object.assign(s.simple,{height:5,count:1,conduit:'20x20',stack:'simple',stackCount:1,cap:'standard',capCount:1,manualPrice:1500});
  const r=calculate(s);assert.ok(r.hours>0);assert.equal(r.laborCost,0);assert.equal(r.materials,1500);
});

test('contrôle productivité béton reste informatif et ne double pas les heures',()=>{
  const s=base();s.simpleType='dalle';Object.assign(s.simple,{surface:10,thickness:12,slabRef:'dallage_arme'});s.globals.concreteControlMode='betonniere';
  const r=calculate(s);assert.equal(r.hours,7.5);assert.ok(r.reco.some(x=>x.includes('Contrôle productivité bétonnière')));
});

test('option fondation sélectionnée produit une ligne au prix explicite',()=>{
  const s=base();s.simpleType='fondations';Object.assign(s.simple,{foundationRef:'semelle_filante',length:10,widthCm:60,heightCm:30});s.globals.foundationOptions.etudeSol={enabled:true,qty:1,unit:'forfait',price:500};
  const r=calculate(s);const l=r.lines.find(x=>x.id==='foundation-option-etudeSol');assert.equal(l.price,500);assert.equal(l.qty,1);
});

test('pignon ajoute sa surface sans coefficient silencieux',()=>{
  const s=base();s.mode='multiple';const e=newElement('murs_elevations');Object.assign(e.data,{length:10,height:2.5,thickness:20,material:'parpaing',method:'tradi',blocksPerM2:10,wallHPerM2:1,pignons:[{width:5,slope:40}]});s.elements=[e];
  const r=calculate(s);const blocks=r.lines.find(x=>x.id.startsWith(`${e.id}-blocks`));
  // mur 25 m² + pignon 5²×0,40/2 = 5 m² => 30 m² × 10 blocs
  assert.equal(blocks.qty,300);assert.equal(r.hours,30);
});

test('poutre BA détaillée utilise longueur × section et référentiel',()=>{
  const s=base();s.mode='multiple';const e=newElement('murs_elevations');Object.assign(e.data,{length:1,height:1,thickness:20,material:'parpaing',method:'tradi',blocksPerM2:1,wallHPerM2:1,beams:[{length:3,widthCm:20,heightCm:30,ref:'poutre_ba_courante'}]});s.elements=[e];
  const r=calculate(s);const concrete=r.lines.find(x=>x.id===`${e.id}-beam-0-beton`);assert.ok(Math.abs(concrete.qty-.18)<1e-9);
});

test('aucun ancien taux horaire / coefficient silencieux réintroduit',()=>{
  const src=fs.readFileSync(new URL('./core.js',import.meta.url),'utf8');
  for(const bad of ['tauxHoraire ?? 48','52 €/h','coefComplexite','×1.20','prixParUnit: Record'])assert.ok(!src.includes(bad),`ancienne valeur/règle détectée: ${bad}`);
});


test('catalogue Maçon neutre: 227 articles et aucune enseigne source exposée',()=>{
  assert.equal(CATALOGUE_MACON.length,227);
  const txt=JSON.stringify(CATALOGUE_MACON).toLowerCase();
  assert.ok(!/point\s*\.?\s*p/i.test(txt));
});

test('catalogue: parpaing 20 cm propose des articles de 20 cm',()=>{
  const line={id:'simple-wall-block-parpaing-20',name:'parpaing 20 cm',category:'Maçonnerie',qty:280,unit:'unité'};
  const c=catalogueCandidatesForLine(line,8);
  assert.ok(c.length>0);
  assert.ok(c.some(x=>/500x200x200/i.test(x.produit)));
});

test('catalogue: tarif au cent converti en prix unitaire sans multiplication erronée',()=>{
  const line={id:'x',name:'parpaing 20 cm',category:'Maçonnerie',qty:280,unit:'unité'};
  const r=resolveCatalogueProduct(line,'6271640');
  assert.equal(r.compatible,true);
  assert.ok(Math.abs(r.lineUnitPrice-0.9642)<1e-9);
  assert.ok(Math.abs(r.total-269.976)<1e-6);
});

test('catalogue: mortier 112 kg arrondi au conditionnement de 25 kg',()=>{
  const line={id:'x',name:'Mortier traditionnel',category:'Liants',qty:112,unit:'kg'};
  const r=resolveCatalogueProduct(line,'4117438');
  assert.equal(r.compatible,true);
  assert.equal(r.orderQty,5);
  assert.equal(r.packContent,25);
  assert.ok(Math.abs(r.total-41.6)<1e-9);
});

test('catalogue: Delta protection au m² converti directement',()=>{
  const line={id:'x',name:'Delta MS',category:'Étanchéité',qty:30,unit:'m²'};
  const r=resolveCatalogueProduct(line,'1191154');
  assert.equal(r.compatible,true);
  assert.equal(r.lineUnitPrice,6.25);
  assert.equal(r.total,187.5);
});

test('catalogue: sélection article alimente le prix du chiffrage',()=>{
  const s=base();s.simpleType='murs';
  Object.assign(s.simple,{length:10,height:2.5,thickness:20,blocksPerM2:10,wallHPerM2:.8,material:'parpaing'});
  let r=calculate(s);
  const blocks=r.lines.find(x=>x.id.startsWith('simple-wall-block'));
  s.catalogSelections[blocks.id]='6271640';
  r=calculate(s);
  const priced=r.lines.find(x=>x.id===blocks.id);
  assert.equal(priced.source,'Catalogue Maçon SpeedArti');
  assert.ok(priced.price>0);
});

test('catalogue: prix personnel reste prioritaire sur article sélectionné',()=>{
  const s=base();s.simpleType='murs';
  Object.assign(s.simple,{length:10,height:2.5,thickness:20,blocksPerM2:10,wallHPerM2:.8,material:'parpaing'});
  let r=calculate(s);
  const blocks=r.lines.find(x=>x.id.startsWith('simple-wall-block'));
  s.catalogSelections[blocks.id]='6271640';
  s.manualPrices[blocks.id]=1.25;
  r=calculate(s);
  const priced=r.lines.find(x=>x.id===blocks.id);
  assert.equal(priced.source,'prix personnel');
  assert.equal(priced.price,1.25);
});

test('catalogue: conversion incompatible ne crée jamais un prix silencieux',()=>{
  const line={id:'x',name:'Béton C25/30',category:'Béton',qty:1.2,unit:'m³'};
  const r=resolveCatalogueProduct(line,'3608102');
  assert.equal(r.compatible,false);
});

test('interface Prix/catalogue contient le sélecteur article et reste balisée',()=>{
  const s=base();s.simpleType='murs';
  Object.assign(s.simple,{length:10,height:2.5,thickness:20,blocksPerM2:10,wallHPerM2:.8,material:'parpaing'});
  const html=renderPrices(s);
  assert.match(html,/Catalogue Maçon SpeedArti/);
  assert.match(html,/catalogSelections\./);
  assert.equal(assertBalisage(html),true);
});

test('aucune mention enseigne source dans les fichiers Git Maçon',()=>{
  const files=['core.js','app.js','catalogue-macon.js','README.md','tests.mjs','index.html'];
  for(const f of files){
    const src=fs.readFileSync(new URL(`./${f}`,import.meta.url),'utf8');
    assert.ok(!/point\s*\.?\s*p/i.test(src),`mention interdite dans ${f}`);
  }
});

console.log(`OK — V2 Maçon: ${pass.length} contrôles fonctionnels passés`);
for(const x of pass)console.log(`✓ ${x}`);
