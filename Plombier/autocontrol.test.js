const fs=require('fs'),vm=require('vm'),path=require('path');
global.window=global;
const root=__dirname;
for(const f of ['catalogue-data.js','catalogue-service.js','engine-current.js'])vm.runInThisContext(fs.readFileSync(path.join(root,f),'utf8'),{filename:f});
const CAT=global.SpeedArtiCatalogueService,API=global.SpeedArtiPlombierCurrent,DB=global.SpeedArtiCataloguePlombier;
let ok=0;function assert(cond,msg){if(!cond)throw new Error(`ASSERT ${ok+1}: ${msg}`);ok++}
function approx(a,b,t=.011){return Math.abs(Number(a)-Number(b))<=t}
function base(){return{metier:'plombier',nom_calcul:'AUTOCONTROLE v0.3.1',options:{type_projet:'installation_complete',gamme:'premium',complexite:'moyen',taux_horaire:52,nb_ouvriers:1,taux_tva:20,type_tuyau:'per',forfaits:{},chauffe_eau:{enabled:false,type:'cumulus',capacity:200},adoucisseur:{enabled:false,price_ht:1000},articles_libres:[]},installation:{surface_maison_m2:100,equipments:[],network:{distance_ce_sdb:5,distance_ce_cuisine:8,ef_only:0,ec_only:0,ef_ec:0,evac_points:0,platines_ef:0,platines_ec:0,platines_ef_ec:0,platines_evac:0,evac_price_ml:6,time_h:4},annexe1:{}},petits_travaux:{prestations:[]},settings:{annexe1:{},forfaits:{}}}}
function selectFirst(ctx,pred=()=>true){const a=CAT.search({context:ctx,limit:100}).find(x=>x.prix>0&&x.code&&pred(x));assert(!!a,`Référence exploitable contexte ${ctx}`);return CAT.selection(a)}
function netRefs(d){const ctx=d.options.type_tuyau==='cuivre'?'raccord_cuivre':d.options.type_tuyau==='multicouche'?'raccord_multicouche':'raccord_per';d.installation.network.fitting_catalogue=selectFirst(ctx);d.installation.network.stop_valve_catalogue=selectFirst('robinet_arret');}

// 1. Intégrité catalogue
assert(CAT.count===7456,'Catalogue = 7456 références');
assert(DB.articles.length===7456,'Table réelle = 7456 lignes');
assert(CAT.priceCount===7451,'7451 prix exploitables');
assert(DB.articles.filter(a=>a.prix==null).length===5,'5 prix Téréva absents');
assert(DB.articles.filter(a=>!a.produit).length===551,'551 titres exacts non extraits');
assert(DB.articles.filter(a=>a.marque==='À identifier').length===2139,'2139 marques à identifier');
const known=CAT.search({q:'1306629',limit:5});
assert(known.length>0,'Code 1306629 retrouvé');
assert(known[0].code==='1306629','Code exact prioritaire');
assert(approx(known[0].prix,117.19),'Prix -20 % = 117,19');
assert(CAT.search({q:'grohe chromé',limit:10}).length>0,'Recherche Grohe chromé');
assert(CAT.search({q:'grohe chromé',limit:10}).every(x=>String(x.marque).toLowerCase().includes('grohe')),'Recherche multi-critères respecte la marque');
assert(CAT.search({context:'platine',limit:100}).length===11,'Contexte platine dédié = 11 articles détectés');
assert(CAT.search({context:'raccord_per',limit:100}).length>0,'Contexte raccord PER');
assert(CAT.search({context:'raccord_multicouche',limit:100}).length>0,'Contexte raccord multicouche');
assert(CAT.search({context:'raccord_cuivre',limit:100}).length>0,'Contexte raccord cuivre');
assert(CAT.search({context:'raccord_per',limit:100}).every(a=>/\bper\b/i.test(`${a.produit} ${a.variante} ${a.famille}`)),'Filtre PER cohérent');
assert(CAT.search({context:'raccord_multicouche',limit:100}).every(a=>/multicouche/i.test(`${a.produit} ${a.variante} ${a.famille}`)&&!/\bper\b/i.test(`${a.produit} ${a.variante}`)),'Filtre multicouche exclut PER explicite');
assert(CAT.search({context:'raccord_cuivre',limit:100}).every(a=>/cuivre|laiton|bic[oô]ne/i.test(`${a.produit} ${a.variante} ${a.famille}`)),'Filtre cuivre/laiton cohérent');
assert(CAT.filters('wc_poser').brands.length>0,'Filtres marques WC');
assert(CAT.filters('douche').types.length>0,'Filtres types douche');
assert(CAT.filters('all').brands.length>20,'Filtres catalogue global');
let allSelectionOK=true;for(let i=0;i<DB.articles.length;i++){const a=CAT.byIndex(i),s=CAT.selection(a);if(!s||s.code!==a.code||s.index!==i||s.catalogue!=='Téréva 2026 -20%'){allSelectionOK=false;break}}
assert(allSelectionOK,'Les 7456 références se sélectionnent sans perte code/index/version');

// 2. WC exact + balises + gamme non remultipliée
const wcSel=selectFirst('wc_poser');
const d1=base();netRefs(d1);d1.installation.equipments.push({id:'wc1',kind:'wc',subtype:'poser',catalogue:wcSel,price_ht:wcSel.prix,time_h:2});
const r1=API.calculate(d1);const wcLine=r1.materiaux.find(x=>x.catalogue_code===wcSel.code);
assert(!!wcLine,'Ligne WC catalogue présente');
assert(approx(wcLine.prix_unitaire_ht,wcSel.prix),'Prix exact WC non remultiplié Premium');
assert(wcLine.catalogue_version==='Téréva 2026 -20%','Version catalogue balisée');
assert(!!wcLine.catalogue_source_page,'Page source catalogue balisée');
assert(String(wcLine.source).includes('Catalogue Téréva 2026 -20%'),'Source catalogue visible');
assert(r1.controle_balises.ok===true,'Balises scénario WC OK');
assert(r1.controle_balises.version==='BALISES-ABSOLUES-v1.1','Version balises v1.1');
assert(r1.finalisation_bloquee===false,'WC complet finalisable');
assert(r1.surfaces.detail_par_face.EF_ml===8,'WC = 8 ml EF');
assert(r1.surfaces.detail_par_face.EC_ml===0,'WC = 0 ml EC');
assert(r1.surfaces.detail_par_face.evac_ml===1,'WC = 1 ml évacuation');
const fittingsWC=r1.materiaux.find(x=>x.article_id==='raccords_per');
assert(fittingsWC.quantite_finale===7,'6 raccords/appareil +10 % => 7 pour 1 WC');
const stopsWC=r1.materiaux.find(x=>x.article_id==='robinets_arret');
assert(stopsWC.quantite_finale===1,'Annexe 2 WC = 1 robinet d’arrêt');

// 3. Lavabo Annexe 2 : 1 appareil, 2 alimentations, 2 robinets, pas 12 raccords
const lavSel=selectFirst('lavabo');
const dLav=base();netRefs(dLav);dLav.installation.equipments.push({id:'lav1',kind:'lavabo',catalogue:lavSel,price_ht:lavSel.prix,time_h:2});
const rLav=API.calculate(dLav);
assert(rLav.surfaces.detail_par_face.EF_ml===8,'Lavabo = 8 ml EF');
assert(rLav.surfaces.detail_par_face.EC_ml===13,'Lavabo SDB = 8 ml EC + distance SDB 5 m');
assert(rLav.materiaux.find(x=>x.article_id==='raccords_per').quantite_finale===7,'Lavabo = 6 raccords/appareil +10 %, pas 12');
assert(rLav.materiaux.find(x=>x.article_id==='robinets_arret').quantite_finale===2,'Annexe 2 lavabo : robinets d’arrêt pluriels = 2 alimentations');
assert(rLav.finalisation_bloquee===false,'Lavabo complet finalisable');

// 4. Réseau seul, pas +13 m fantômes, temps réseau obligatoire
const d2=base();d2.installation.network.ef_ec=4;d2.installation.network.fitting_catalogue=selectFirst('raccord_per');
const r2=API.calculate(d2);
assert(r2.surfaces.detail_par_face.EF_ml===32,'Réseau seul 4 points = 32 ml EF');
assert(r2.surfaces.detail_par_face.EC_ml===32,'Réseau seul 4 points = 32 ml EC sans +13');
assert(r2.materiaux.find(x=>x.article_id==='raccords_per').quantite_finale===27,'4 points réseau => ceil(4×6×1,1)=27 raccords');
assert(r2.main_oeuvre.heures_homme===4,'Temps réseau saisi = heures-homme réseau');
assert(r2.finalisation_bloquee===false,'Réseau seul renseigné finalisable');
const d2b=base();d2b.installation.network.ef_ec=1;d2b.installation.network.time_h=undefined;d2b.installation.network.fitting_catalogue=selectFirst('raccord_per');
const r2b=API.calculate(d2b);
assert(r2b.finalisation_bloquee===true,'Temps réseau absent bloque');
assert(r2b.blocages.some(x=>/BALISE TEMPS/.test(x)),'Blocage temps réseau explicite');
assert(r2b.main_oeuvre.heures_homme===0,'Aucun 0,15 h/ml caché');
const d2c=base();d2c.installation.network.ef_ec=2;d2c.installation.network.manual_ef_ml=12;d2c.installation.network.manual_ec_ml=15;d2c.installation.network.fitting_catalogue=selectFirst('raccord_per');
const r2c=API.calculate(d2c);
assert(r2c.surfaces.detail_par_face.EF_ml===12,'Override longueur EF appliqué');
assert(r2c.surfaces.detail_par_face.EC_ml===15,'Override longueur EC appliqué');

// 5. Raccords par matériau + incompatibilité
for(const [pipe,ctx] of [['per','raccord_per'],['multicouche','raccord_multicouche'],['cuivre','raccord_cuivre']]){
  const dd=base();dd.options.type_tuyau=pipe;dd.installation.network.ef_only=1;dd.installation.network.fitting_catalogue=selectFirst(ctx);const rr=API.calculate(dd);
  assert(!rr.blocages.some(x=>/COMPATIBILITÉ.*raccord/.test(x)),`Raccord ${pipe} compatible accepté`);
  assert(rr.materiaux.some(x=>x.article_id===`raccords_${pipe}`),`Ligne raccord ${pipe} créée`);
}
const bad=base();bad.options.type_tuyau='per';bad.installation.network.ef_only=1;bad.installation.network.fitting_catalogue=selectFirst('raccord_cuivre');const badR=API.calculate(bad);
assert(badR.finalisation_bloquee===true,'Raccord cuivre sur réseau PER bloque');
assert(badR.blocages.some(x=>/COMPATIBILITÉ/.test(x)),'Balise compatibilité raccord explicite');

// 6. Platines catalogue et manuel
const platSel=selectFirst('platine');
const dp=base();dp.installation.network.platines_ef=2;dp.installation.network.platine_ef_catalogue=platSel;dp.installation.network.fitting_catalogue=selectFirst('raccord_per');const rp=API.calculate(dp);
const pl=rp.materiaux.find(x=>x.article_id==='platine_ef');
assert(!!pl,'Ligne platine EF créée');
assert(pl.quantite_finale===2,'Quantité platine conservée');
assert(approx(pl.prix_unitaire_ht,platSel.prix),'Prix exact platine catalogue');
assert(rp.finalisation_bloquee===false,'Platine catalogue finalisable');
const dpm=base();dpm.installation.network.platines_ec=1;dpm.installation.network.platine_ec_price_ht=42;dpm.installation.network.fitting_catalogue=selectFirst('raccord_per');const rpm=API.calculate(dpm);
assert(rpm.materiaux.find(x=>x.article_id==='platine_ec').prix_unitaire_ht===42,'Platine prix manuel accepté');
assert(rpm.materiaux.find(x=>x.article_id==='platine_ec').source==='saisie artisan','Platine manuelle tracée');
assert(rpm.finalisation_bloquee===false,'Platine manuelle finalisable');
const dp0=base();dp0.installation.network.platines_ef_ec=1;dp0.installation.network.fitting_catalogue=selectFirst('raccord_per');const rp0=API.calculate(dp0);
assert(rp0.finalisation_bloquee===true,'Platine sans prix bloque');
assert(rp0.blocages.some(x=>/Platine sanitaire EF \+ EC/.test(x)),'Blocage platine nomme l’élément');

// 7. Prix Téréva absent => manuel résout sans inventer
const missingA=DB.articles.find(a=>a.prix==null&&a.code);assert(!!missingA,'Référence sans prix trouvée');
const missSel=CAT.selection({...missingA,__index:DB.articles.indexOf(missingA)});
const dm=base();dm.installation.network.ef_only=1;dm.installation.network.fitting_catalogue=selectFirst('raccord_per');dm.options.articles_libres=[{catalogue:missSel,price_ht:undefined,quantite:1}];const rm=API.calculate(dm);
assert(rm.finalisation_bloquee===true,'Référence sans prix bloque');
assert(rm.blocages.some(x=>/BALISE PRIX|Prix catalogue manquant/.test(x)),'Blocage prix balisé');
const dm2=base();dm2.installation.network.ef_only=1;dm2.installation.network.fitting_catalogue=selectFirst('raccord_per');const missManual={...missSel,price_overridden:true,manual_price_ht:99};dm2.options.articles_libres=[{catalogue:missManual,price_ht:99,quantite:2}];const rm2=API.calculate(dm2);const ml=rm2.materiaux.find(x=>x.categorie==='Article libre');
assert(rm2.finalisation_bloquee===false,'Prix manuel résout prix Téréva absent');
assert(ml.prix_unitaire_ht===99,'Prix manuel utilisé');
assert(ml.total_ht===198,'Prix manuel × quantité correct');
assert(String(ml.source).includes('Prix manuel sur référence Téréva'),'Source override manuel tracée');
assert(ml.catalogue_code===missSel.code,'Code Téréva conservé après override');

// 8. Titre exact absent = informatif, non bloquant
const noTitle=DB.articles.find(a=>!a.produit&&a.prix>0&&a.code);assert(!!noTitle,'Référence sans titre trouvée');
const ntSel=CAT.selection({...noTitle,__index:DB.articles.indexOf(noTitle)});const dnt=base();dnt.installation.network.ef_only=1;dnt.installation.network.fitting_catalogue=selectFirst('raccord_per');dnt.options.articles_libres=[{catalogue:ntSel,price_ht:ntSel.prix,quantite:1}];const rnt=API.calculate(dnt);
assert(rnt.alertes.some(x=>/Information catalogue/.test(x)),'Titre manquant signalé en information');
assert(!rnt.blocages.some(x=>/Information catalogue/.test(x)),'Titre manquant non bloquant');
assert(rnt.finalisation_bloquee===false,'Titre manquant ne bloque pas si code/prix/source présents');

// 9. Douche italienne : temps +40 % seulement douche, SPEC
const recSel=selectFirst('receveur');
const di=base();netRefs(di);di.installation.equipments.push({id:'sh1',kind:'douche',subtype:'italienne',catalogue:recSel,price_ht:recSel.prix,time_h:10,spec_mode:'spec',spec_surface_m2:5});const ri=API.calculate(di);
assert(ri.main_oeuvre.heures_homme===18,'Douche italienne 10×1,4 + réseau 4 h = 18 h');
assert(ri.materiaux.some(x=>x.article_id==='douche_sh1_spec'&&x.total_ht===80),'SPEC 5 m² ×16 = 80 €');
assert(ri.finalisation_bloquee===false,'Douche italienne complète finalisable');
const di0=base();netRefs(di0);di0.installation.equipments.push({id:'sh0',kind:'douche',subtype:'italienne',catalogue:recSel,price_ht:recSel.prix,time_h:2,spec_mode:'natte',spec_surface_m2:0});const ri0=API.calculate(di0);
assert(ri0.finalisation_bloquee===true,'SPEC/natte sans surface bloque');
assert(ri0.blocages.some(x=>/BALISE SURFACE/.test(x)),'Balise surface explicite');

// 10. Complexité uniquement MO, ouvriers uniquement durée
const dc=base();dc.options.complexite='complexe';dc.options.nb_ouvriers=2;dc.installation.network.ef_only=1;dc.installation.network.fitting_catalogue=selectFirst('raccord_per');dc.installation.network.time_h=10;const rc=API.calculate(dc);
assert(rc.main_oeuvre.heures_homme===10,'Heures-homme inchangées par nb ouvriers');
assert(rc.main_oeuvre.temps_estime_heures===5,'2 ouvriers divisent durée chantier');
assert(approx(rc.main_oeuvre.cout_total,10*52*1.4),'Complexité ×1,4 sur MO');
const matExpected=rc.materiaux.reduce((s,x)=>s+x.total_ht,0);assert(approx(rc.totaux.materiaux_ht,matExpected),'Complexité ne remultiplie pas matériaux');

// 11. TVA 10 / 20
const tv10=base();tv10.options.taux_tva=10;tv10.installation.network.ef_only=1;tv10.installation.network.fitting_catalogue=selectFirst('raccord_per');const rt10=API.calculate(tv10);assert(approx(rt10.totaux.tva,rt10.totaux.total_ht*.10),'TVA 10 réelle');
const tv20=base();tv20.options.taux_tva=20;tv20.installation.network.ef_only=1;tv20.installation.network.fitting_catalogue=selectFirst('raccord_per');const rt20=API.calculate(tv20);assert(approx(rt20.totaux.tva,rt20.totaux.total_ht*.20),'TVA 20 réelle');

// 12. Petit travaux : aucun => blocage
const p0=base();p0.options.type_projet='petits_travaux';const pr0=API.calculate(p0);assert(pr0.finalisation_bloquee===true,'Petits travaux vide bloque');assert(pr0.blocages.some(x=>/BALISE PRESTATION/.test(x)),'Balise prestation vide explicite');

// 13. Débouchage prix explicite, tout compris, un seul déplacement
const pd0=base();pd0.options.type_projet='petits_travaux';pd0.petits_travaux.prestations=[{id:'d1',type:'debouchage'}];const rd0=API.calculate(pd0);assert(rd0.finalisation_bloquee===true,'Débouchage sans montant bloque');assert(rd0.blocages.some(x=>/forfait débouchage/.test(x)),'Blocage montant débouchage explicite');
const pd=base();pd.options.type_projet='petits_travaux';pd.options.forfaits.deplacement=true;pd.petits_travaux.prestations=[{id:'d1',type:'debouchage',price_ht:240}];const rd=API.calculate(pd);const dl=rd.materiaux.find(x=>x.article_id==='debouchage_d1');
assert(dl.prix_unitaire_ht===240,'Débouchage utilise montant saisi');assert(dl.includes_labor===true&&dl.includes_travel===true,'Débouchage balisé MO + déplacement inclus');assert(rd.main_oeuvre.cout_total===0,'Pas de seconde MO débouchage');assert(!rd.materiaux.some(x=>x.article_id==='forfait_deplacement'),'Pas de second déplacement débouchage');assert(rd.finalisation_bloquee===false,'Débouchage renseigné finalisable');

// 14. Réparation chauffe-eau forfait complet explicite
const pc0=base();pc0.options.type_projet='petits_travaux';pc0.petits_travaux.prestations=[{id:'c1',type:'chauffe_eau',ce_type:'reparation'}];const rc0=API.calculate(pc0);assert(rc0.finalisation_bloquee===true,'Réparation CE sans montant bloque');
const pc=base();pc.options.type_projet='petits_travaux';pc.petits_travaux.prestations=[{id:'c1',type:'chauffe_eau',ce_type:'reparation',price_ht:175,duration_h:8}];const rcp=API.calculate(pc);assert(rcp.materiaux.find(x=>x.article_id==='ce_c1').prix_unitaire_ht===175,'Réparation CE montant saisi');assert(rcp.main_oeuvre.cout_total===0,'Réparation CE forfait complet sans seconde MO même si ancienne durée existe');assert(rcp.finalisation_bloquee===false,'Réparation CE finalisable');

// 15. Recherche de fuite : tout compris sans MO doublée
const pf=base();pf.options.type_projet='petits_travaux';pf.petits_travaux.prestations=[{id:'f1',type:'fuite',method:'camera',method_price_ht:180,duration_h:9}];const rf=API.calculate(pf);assert(rf.materiaux.some(x=>x.article_id==='diag_f1'&&x.total_ht===150),'Diagnostic fuite = 150');assert(rf.materiaux.some(x=>x.article_id==='fuite_f1'&&x.total_ht===180),'Méthode fuite = prix saisi/catalogue');assert(rf.main_oeuvre.cout_total===0,'Recherche fuite tout compris sans seconde MO');assert(rf.finalisation_bloquee===false,'Recherche fuite renseignée finalisable');

// 16. Plusieurs prestations : déplacement unique
const pm=base();pm.options.type_projet='petits_travaux';pm.options.forfaits.deplacement=true;pm.petits_travaux.prestations=[{id:'f1',type:'fuite',method:'camera',method_price_ht:100},{id:'d1',type:'debouchage',price_ht:200}];const rmult=API.calculate(pm);assert(rmult.materiaux.filter(x=>x.article_id==='forfait_deplacement').length===0,'Débouchage inclus empêche déplacement supplémentaire');assert(rmult.materiaux.filter(x=>x.includes_travel).length===1,'Un seul poste inclut déplacement');

// 17. Chauffe-eau fourniture : catalogue prioritaire et capacité contrôlée
const ce200raw=CAT.search({context:'chauffe_eau',q:'200',limit:100}).find(a=>a.prix>0&&/200\s*l/i.test(`${a.produit} ${a.variante}`));assert(!!ce200raw,'Référence CE 200 L détectée');const ce200=CAT.selection(ce200raw);
const ce=base();ce.options.chauffe_eau={enabled:true,type:/thermodynamique/i.test(`${ce200.produit}`)?'ballon_thermo':'cumulus',capacity:200,catalogue:ce200,price_ht:ce200.prix,time_h:3};const rce=API.calculate(ce);assert(rce.materiaux.some(x=>x.catalogue_code===ce200.code&&approx(x.prix_unitaire_ht,ce200.prix)),'CE exact prix catalogue');assert(!rce.blocages.some(x=>/capacité|COMPATIBILITÉ.*chauffe-eau/.test(x)),'CE 200 L compatible ne bloque');
const cem=base();cem.options.chauffe_eau={enabled:true,type:/thermodynamique/i.test(`${ce200.produit}`)?'ballon_thermo':'cumulus',capacity:300,catalogue:ce200,price_ht:ce200.prix,time_h:3};const rcem=API.calculate(cem);assert(rcem.finalisation_bloquee===true,'Capacité CE incompatible bloque');assert(rcem.blocages.some(x=>/COMPATIBILITÉ.*200 L.*300 L/.test(x)),'Balise capacité CE explicite');

// 18. MLL / MLV suivent paramètres entreprise, sans double robinet générique
const mllv=base();mllv.settings.annexe1.robinet_mll=91;mllv.settings.annexe1.robinet_mlv=97;netRefs(mllv);mllv.installation.equipments.push({id:'ll',kind:'lave_linge'},{id:'lv',kind:'lave_vaisselle'});const rml=API.calculate(mllv);assert(rml.materiaux.find(x=>x.article_id==='equip_ll').prix_unitaire_ht===91,'MLL prend paramètre entreprise');assert(rml.materiaux.find(x=>x.article_id==='equip_lv').prix_unitaire_ht===97,'MLV prend paramètre entreprise');assert(!rml.materiaux.some(x=>x.article_id==='robinets_arret'),'MLL/MLV n’ajoutent pas un robinet générique en double');assert(rml.finalisation_bloquee===false,'MLL/MLV avec réseau finalisables');

// 19. Prix catalogue exact override manuel
const ov=base();netRefs(ov);const ovSel={...wcSel,price_overridden:true,manual_price_ht:wcSel.prix+50};ov.installation.equipments.push({id:'wc2',kind:'wc',subtype:'poser',catalogue:ovSel,price_ht:ovSel.manual_price_ht,time_h:2});const rov=API.calculate(ov);const ovl=rov.materiaux.find(x=>x.catalogue_code===wcSel.code);assert(approx(ovl.prix_unitaire_ht,wcSel.prix+50),'Override manuel exact utilisé');assert(String(ovl.source).includes('Prix manuel sur référence Téréva'),'Override exact source tracée');assert(rov.controle_balises.ok===true,'Balises après override exact');

// 20. Auto-contrôle totaux
assert(approx(r1.controle_balises.materiaux_ht_controles,r1.totaux.materiaux_ht),'Contrôle matériaux = total matériaux');
assert(approx(r1.controle_balises.main_oeuvre_ht_controlee,r1.totaux.main_oeuvre_ht),'Contrôle MO = total MO');
assert(approx(r1.controle_balises.total_ht_controle,r1.totaux.total_ht),'Contrôle HT = total HT');
assert(approx(r1.controle_balises.tva_controlee,r1.totaux.tva),'Contrôle TVA = TVA');

// 21. Ordre scripts HTML
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const posData=html.indexOf('catalogue-data.js'),posService=html.indexOf('catalogue-service.js'),posEngine=html.indexOf('engine-current.js'),posApp=html.indexOf('app.js');
assert(posData>0&&posData<posService&&posService<posEngine&&posEngine<posApp,'Ordre de chargement catalogue -> service -> moteur -> app');
assert(/v0\.3\.1/.test(html),'HTML annonce v0.3.1');

// 22. Contrôles statiques UI / absence de règles cachées
const appSrc=fs.readFileSync(path.join(root,'app.js'),'utf8'),engSrc=fs.readFileSync(path.join(root,'engine-current.js'),'utf8'),catSrc=fs.readFileSync(path.join(root,'catalogue-service.js'),'utf8');
assert(appSrc.includes('installation.network.time_h'),'Champ temps réseau présent dans UI');
assert(appSrc.includes("platinePicker('Platine EF','platine_ef'"),'Sélection catalogue platine EF présente');
assert(appSrc.includes('Forfait débouchage HT'),'Montant débouchage explicite présent');
assert(!appSrc.includes('Forfait débouchage 180 €'),'Ancien prix débouchage caché absent UI');
assert(!/reparation:\{[^}]*price:120/.test(engSrc),'Ancien 120 € réparation caché absent moteur');
assert(!/(?:\*\s*\.15|\*\s*0\.15)/.test(engSrc),'Ancien rendement réseau 0,15 h/ml absent');
assert(catSrc.includes("raccord_per")&&catSrc.includes("raccord_multicouche")&&catSrc.includes("raccord_cuivre"),'Trois contextes raccord matériau présents');
assert(appSrc.includes("d.options.type_projet==='petits_travaux'?") ,'Affichage déplacement conditionné au mode petits travaux');

console.log(JSON.stringify({status:'OK',assertions:ok,catalogueCount:CAT.count,priceCount:CAT.priceCount,knownPrice117_19:known[0].prix,balisesVersion:r1.controle_balises.version,networkOnly:{ef:r2.surfaces.detail_par_face.EF_ml,ec:r2.surfaces.detail_par_face.EC_ml},fittingsOneFixture:fittingsWC.quantite_finale},null,2));
