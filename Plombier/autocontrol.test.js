const fs=require('fs'),vm=require('vm'),path=require('path');
global.window=global;
const root=__dirname;
for(const f of ['catalogue-data.js','catalogue-service.js','engine-current.js'])vm.runInThisContext(fs.readFileSync(path.join(root,f),'utf8'),{filename:f});
const CAT=global.SpeedArtiCatalogueService,API=global.SpeedArtiPlombierCurrent,DB=global.SpeedArtiCataloguePlombier;
let ok=0;function assert(cond,msg){if(!cond)throw new Error(`ASSERT ${ok+1}: ${msg}`);ok++}
function approx(a,b,t=.011){return Math.abs(Number(a)-Number(b))<=t}
function base(){return{metier:'plombier',nom_calcul:'AUTOCONTROLE v0.6.1',options:{type_projet:'installation_complete',gamme:'premium',complexite:'moyen',taux_horaire:52,nb_ouvriers:1,taux_tva:20,type_tuyau:'per',forfaits:{},chauffe_eau:{enabled:false,type:'cumulus',capacity:200},adoucisseur:{enabled:false,price_ht:1000},articles_libres:[]},installation:{surface_maison_m2:100,equipments:[],network:{distance_ce_sdb:5,distance_ce_cuisine:8,ef_only:0,ec_only:0,ef_ec:0,evac_points:0,platines_ef:0,platines_ec:0,platines_ef_ec:0,platines_evac:0,evac_price_ml:6,time_h:4},annexe1:{}},petits_travaux:{prestations:[]},settings:{annexe1:{},forfaits:{},services:{}}}}
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
assert(r1.controle_balises.version==='BALISES-ABSOLUES-v1.6','Version balises v1.6');
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

// 13. Débouchage : tarif entreprise automatique, tout compris, un seul déplacement
const pd0=base();pd0.options.type_projet='petits_travaux';pd0.petits_travaux.prestations=[{id:'d1',type:'debouchage'}];const rd0=API.calculate(pd0);assert(rd0.finalisation_bloquee===true,'Débouchage sans montant bloque');assert(rd0.blocages.some(x=>/tarif entreprise SpeedArti du débouchage/i.test(x)),'Blocage tarif entreprise débouchage explicite');
const pd=base();pd.options.type_projet='petits_travaux';pd.options.forfaits.deplacement=true;pd.settings.services.debouchage=240;pd.petits_travaux.prestations=[{id:'d1',type:'debouchage'}];const rd=API.calculate(pd);const dl=rd.materiaux.find(x=>x.article_id==='debouchage_d1');
assert(dl.prix_unitaire_ht===240,'Débouchage utilise automatiquement le tarif entreprise');assert(dl.includes_labor===true&&dl.includes_travel===true,'Débouchage balisé MO + déplacement inclus');assert(rd.main_oeuvre.cout_total===0,'Pas de seconde MO débouchage');assert(!rd.materiaux.some(x=>x.article_id==='forfait_deplacement'),'Pas de second déplacement débouchage');assert(rd.finalisation_bloquee===false,'Débouchage renseigné finalisable');

// 14. Réparation chauffe-eau : forfait entreprise automatique
const pc0=base();pc0.options.type_projet='petits_travaux';pc0.petits_travaux.prestations=[{id:'c1',type:'chauffe_eau',ce_type:'reparation'}];const rc0=API.calculate(pc0);assert(rc0.finalisation_bloquee===true,'Réparation CE sans montant bloque');
const pc=base();pc.options.type_projet='petits_travaux';pc.settings.services.chauffe_eau_reparation=175;pc.petits_travaux.prestations=[{id:'c1',type:'chauffe_eau',ce_type:'reparation',duration_h:8}];const rcp=API.calculate(pc);assert(rcp.materiaux.find(x=>x.article_id==='ce_c1').prix_unitaire_ht===175,'Réparation CE utilise le tarif entreprise');assert(rcp.main_oeuvre.cout_total===0,'Réparation CE forfait complet sans seconde MO même si ancienne durée existe');assert(rcp.finalisation_bloquee===false,'Réparation CE finalisable');

// 15. Recherche de fuite : tout compris sans MO doublée
const pf=base();pf.options.type_projet='petits_travaux';pf.settings.services.fuite_camera=180;pf.petits_travaux.prestations=[{id:'f1',type:'fuite',method:'camera',duration_h:9}];const rf=API.calculate(pf);assert(rf.materiaux.some(x=>x.article_id==='diag_f1'&&x.total_ht===150),'Diagnostic fuite = 150');assert(rf.materiaux.some(x=>x.article_id==='fuite_f1'&&x.total_ht===180),'Méthode fuite = tarif entreprise automatique');assert(rf.main_oeuvre.cout_total===0,'Recherche fuite tout compris sans seconde MO');assert(rf.finalisation_bloquee===false,'Recherche fuite renseignée finalisable');

// 16. Plusieurs prestations : déplacement unique
const pm=base();pm.options.type_projet='petits_travaux';pm.options.forfaits.deplacement=true;pm.settings.services.fuite_camera=100;pm.settings.services.debouchage=200;pm.petits_travaux.prestations=[{id:'f1',type:'fuite',method:'camera'},{id:'d1',type:'debouchage'}];const rmult=API.calculate(pm);assert(rmult.materiaux.filter(x=>x.article_id==='forfait_deplacement').length===0,'Débouchage inclus empêche déplacement supplémentaire');assert(rmult.materiaux.filter(x=>x.includes_travel).length===1,'Un seul poste inclut déplacement');

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
assert(/v0\.6\.1/.test(html),'HTML annonce v0.6.1');

// 22. Contrôles statiques UI / absence de règles cachées
const appSrc=fs.readFileSync(path.join(root,'app.js'),'utf8'),engSrc=fs.readFileSync(path.join(root,'engine-current.js'),'utf8'),catSrc=fs.readFileSync(path.join(root,'catalogue-service.js'),'utf8');
assert(appSrc.includes('installation.network.time_h'),'Champ temps réseau présent dans UI');
assert(appSrc.includes('manual_platine_ef_qty'),'Quantité platine EF automatique/modifiable présente');
assert(!appSrc.includes('Forfait débouchage HT'),'Aucun champ prix débouchage dans le parcours artisan');
assert(!appSrc.includes('Forfait débouchage 180 €'),'Ancien prix débouchage caché absent UI');
assert(!/reparation:\{[^}]*price:120/.test(engSrc),'Ancien 120 € réparation caché absent moteur');
assert(!/(?:\*\s*\.15|\*\s*0\.15)/.test(engSrc),'Ancien rendement réseau 0,15 h/ml absent');
assert(catSrc.includes("raccord_per")&&catSrc.includes("raccord_multicouche")&&catSrc.includes("raccord_cuivre"),'Trois contextes raccord matériau présents');
assert(appSrc.includes("smallWorkOptions()"),'Options petits travaux dédiées sans saisie de prix');


// 23. Composition interne des équipements et articles complémentaires explicites
assert(Array.isArray(API.annexe2For('lavabo'))&&API.annexe2For('lavabo').length===15,'Annexe 2 lavabo = 15 postes de référence');
assert(API.annexe2For('meuble_vasque').length===API.annexe2For('lavabo').length,'Meuble vasque réutilise la composition lavabo/vasque');
assert(API.annexe2For('douche').some(x=>x.label==='Bonde de douche'),'Annexe 2 douche contient la bonde');
assert(API.annexe2For('baignoire').some(x=>x.label==='Vidage baignoire'),'Annexe 2 baignoire contient le vidage');
assert(API.annexe2For('evier').some(x=>x.label==='Raccordement lave-vaisselle si prévu'),'Annexe 2 évier conserve le raccordement LV conditionnel');
assert(API.annexe2For('wc','poser').length===16&&API.annexe2For('wc','poser').some(x=>x.label==='Mécanisme de chasse'),'Annexe 2 WC à poser = 16 postes et contient le mécanisme');
assert(API.annexe2For('wc','suspendu').length===15&&API.annexe2For('wc','suspendu').some(x=>x.label==='Plaque de commande'),'Annexe 2 WC suspendu = 15 postes et contient la plaque de commande');
assert(API.annexe2For('wc','urinoir').length===0,'Aucune composition Annexe 2 inventée pour urinoir');
const a2Defs=[['lavabo',''],['meuble_vasque',''],['douche',''],['baignoire',''],['evier',''],['wc','poser'],['wc','suspendu'],['lave_main',''],['lave_linge',''],['lave_vaisselle','']];
for(const [kind,sub] of a2Defs){const defs=API.annexe2For(kind,sub),keys=defs.map(x=>x.key);assert(new Set(keys).size===keys.length,`Clés Annexe 2 uniques — ${kind} ${sub}`);for(const def of defs.filter(x=>x.role==='selectable'))assert(CAT.search({context:def.context||'all',q:def.q||'',limit:1}).length>0,`Recherche préremplie exploitable — ${kind}/${def.key}`)}
assert(API.annexe2For('lave_linge').some(x=>x.label==='Robinet machine à laver'),'Annexe 2 lave-linge contient le robinet machine');
assert(API.annexe2For('lave_vaisselle').some(x=>x.label.includes('siphon')),'Annexe 2 lave-vaisselle contient le raccordement siphon');

const dA2Base=base();netRefs(dA2Base);dA2Base.installation.equipments.push({id:'lava2base',kind:'lavabo',catalogue:lavSel,price_ht:lavSel.prix,time_h:2});
const rA2Base=API.calculate(dA2Base);
assert(!rA2Base.materiaux.some(x=>x.annexe2_slot),'Aucun composant Annexe 2 n’est facturé sans sélection explicite');
assert(rA2Base.nomenclature_annexe2.length===1,'Nomenclature Annexe 2 produite par appareil');
assert(rA2Base.nomenclature_annexe2[0].components.find(x=>x.key==='ef').status==='géré par réseau','Alimentation EF balisée réseau sans doublon');
assert(rA2Base.nomenclature_annexe2[0].components.find(x=>x.key==='appareil').status==='article principal sélectionné','Article principal balisé dans nomenclature');

const bondeRaw=CAT.search({context:'evacuation',q:'bonde',limit:100}).find(a=>a.prix>0&&a.code);assert(!!bondeRaw,'Référence bonde exploitable trouvée');const bondeSel=CAT.selection(bondeRaw);
const dA2=base();netRefs(dA2);dA2.installation.equipments.push({id:'lava2',kind:'lavabo',catalogue:lavSel,price_ht:lavSel.prix,time_h:2,annexe2_items:{bonde:{catalogue:bondeSel,price_ht:bondeSel.prix,quantite:2,note:'Non comprise dans le lavabo'}}});
const rA2=API.calculate(dA2),a2Line=rA2.materiaux.find(x=>x.annexe2_slot==='bonde');
assert(!!a2Line,'Composant Annexe 2 sélectionné devient une ligne réelle');
assert(a2Line.categorie==='Fourniture Annexe 2','Catégorie dédiée Annexe 2');
assert(a2Line.parent_equipment_id==='lava2','Balise parent équipement conservée');
assert(a2Line.annexe2_source==='Annexe 2 Guillaume','Source Annexe 2 balisée');
assert(a2Line.catalogue_code===bondeSel.code,'Code Téréva composant conservé');
assert(a2Line.quantite_finale===2,'Quantité composant visible appliquée');
assert(approx(a2Line.total_ht,bondeSel.prix*2),'Quantité × prix exact composant cohérent');
assert(rA2.nomenclature_annexe2[0].components.find(x=>x.key==='bonde').status==='référence associée','Nomenclature reflète la référence associée');
assert(rA2.controle_balises.ok===true,'Balises v1.2 valides avec composant Annexe 2');
assert(rA2.finalisation_bloquee===false,'Scénario Annexe 2 complet finalisable');

const dA2Qty=base();netRefs(dA2Qty);dA2Qty.installation.equipments.push({id:'a2q',kind:'lavabo',catalogue:lavSel,price_ht:lavSel.prix,time_h:2,annexe2_items:{bonde:{catalogue:bondeSel,price_ht:bondeSel.prix,quantite:0}}});
const rA2Qty=API.calculate(dA2Qty);assert(rA2Qty.finalisation_bloquee===true,'Composant Annexe 2 sélectionné avec quantité nulle bloque');assert(rA2Qty.blocages.some(x=>/QUANTITÉ ANNEXE 2/.test(x)),'Blocage quantité Annexe 2 explicite');

const noPriceRaw=DB.articles.find(a=>a.prix==null&&a.code);assert(!!noPriceRaw,'Référence Téréva sans prix disponible pour test');const noPriceSel=CAT.selection({...noPriceRaw,__index:DB.articles.indexOf(noPriceRaw)});
const dA2NoPrice=base();netRefs(dA2NoPrice);dA2NoPrice.installation.equipments.push({id:'a2np',kind:'lavabo',catalogue:lavSel,price_ht:lavSel.prix,time_h:2,annexe2_items:{bonde:{catalogue:noPriceSel,quantite:1}}});
const rA2NoPrice=API.calculate(dA2NoPrice);assert(rA2NoPrice.finalisation_bloquee===true,'Composant Annexe 2 Téréva sans prix bloque');assert(rA2NoPrice.blocages.some(x=>/PRIX ANNEXE 2|référence catalogue/.test(x)),'Blocage prix composant Annexe 2 explicite');

const manualA2={...bondeSel,price_overridden:true,manual_price_ht:bondeSel.prix+12};const dA2Man=base();netRefs(dA2Man);dA2Man.installation.equipments.push({id:'a2m',kind:'lavabo',catalogue:lavSel,price_ht:lavSel.prix,time_h:2,annexe2_items:{bonde:{catalogue:manualA2,price_ht:manualA2.manual_price_ht,quantite:1}}});const rA2Man=API.calculate(dA2Man),a2m=rA2Man.materiaux.find(x=>x.annexe2_slot==='bonde');
assert(approx(a2m.prix_unitaire_ht,bondeSel.prix+12),'Override manuel composant Annexe 2 utilisé');assert(String(a2m.source).includes('Prix manuel sur référence Téréva'),'Override composant Annexe 2 tracé');

// 24. Annexe 2 également sur remplacement petits travaux
const ptA2=base();ptA2.options.type_projet='petits_travaux';ptA2.petits_travaux.prestations=[{id:'rep1',type:'remplacement',equipment:{id:'repLav',kind:'lavabo',catalogue:lavSel,price_ht:lavSel.prix,time_h:2,annexe2_items:{bonde:{catalogue:bondeSel,price_ht:bondeSel.prix,quantite:1}}}}];const rptA2=API.calculate(ptA2);
assert(rptA2.nomenclature_annexe2.length===1,'Remplacement réutilise nomenclature Annexe 2');assert(rptA2.materiaux.some(x=>x.annexe2_slot==='bonde'),'Remplacement réutilise article complémentaire Annexe 2');assert(rptA2.controle_balises.ok===true,'Balises remplacement + Annexe 2 OK');

// 25. Contrôles statiques composition / catalogue
assert(!appSrc.includes('Composition Annexe 2'),'UI artisan ne montre plus le libellé Annexe 2');
assert(appSrc.includes('data-catalogue-q'),'Recherche composant peut préremplir la barre catalogue');
assert(appSrc.includes('nomenclature_annexe2'),'Résultat UI affiche la nomenclature Annexe 2');
assert(engSrc.includes("annexe2_source:'Annexe 2 Guillaume'"),'Moteur balise explicitement la source Annexe 2');
assert(engSrc.includes('parent_equipment_id'),'Moteur conserve le parent équipement des composants');
assert(appSrc.includes('eq.annexe2_items={}'),'Changement de sous-type WC nettoie la nomenclature associée devenue obsolète');
assert(engSrc.includes("version:'BALISES-ABSOLUES-v1.6'"),'Moteur balises v1.6');


// 26. Stock réel : aucune disponibilité ni quantité à commander ne doit être inventée
assert(r1.stock_status.connecte===false,'Stock réel non connecté explicitement');
assert(r1.stock_status.disponible===null,'Disponibilité stock inconnue = null, pas faux booléen');
const stockLines=r1.materiaux.filter(x=>x.stockable);
assert(stockLines.length>0,'Scénario WC contient des lignes stockables');
for(const l of stockLines){
  assert(l.stock_status==='non_connecte',`Stock non connecté balisé — ${l.article_id}`);
  assert(l.stock_disponible===null,`Aucun stock disponible inventé — ${l.article_id}`);
  assert(l.quantite_a_commander===null&&l.a_commander===null,`Aucune quantité à commander inventée — ${l.article_id}`);
  assert(approx(l.quantite_besoin,l.quantite_finale),`Besoin chantier = quantité calculée — ${l.article_id}`);
}
assert(!engSrc.includes('stock_disponible:0'),'Ancien stock disponible = 0 supprimé du moteur');
assert(!engSrc.includes('a_commander:extra.stockable?q:0'),'Ancienne commande automatique supprimée');

// 27. Approvisionnement fournisseur : payload structuré sans prétendre commander
const appro=rA2.approvisionnement;
assert(!!appro&&appro.stock_connecte===false,'Approvisionnement déclare stock non connecté');
assert(appro.statut_stock==='non_connecte','Statut approvisionnement non connecté');
assert(appro.nombre_lignes===rA2.materiaux.filter(x=>x.stockable).length,'Liste besoins = lignes stockables');
assert(approx(appro.total_besoins_ht,appro.items.reduce((s,x)=>s+x.total_ht,0)),'Total besoins fournisseur cohérent');
assert(appro.payload_fournisseur.version==='PLB-APPRO-V1','Version payload fournisseur stable');
assert(appro.payload_fournisseur.metier==='plombier','Payload fournisseur métier plombier');
assert(appro.payload_fournisseur.items.length===appro.items.length,'Payload fournisseur reprend tous les besoins');
assert(appro.items.some(x=>x.article_id==='equip_lava2'),'Appareil sanitaire principal présent dans les besoins fournisseur');
assert(!appro.items.some(x=>/Forfait complet|Prestation fourniture \+ MO/.test(x.categorie)),'Forfaits et prestations mixtes exclus du stock fournisseur');
assert(rA2.materiaux.find(x=>x.article_id==='equip_lava2').stockable===true,'Appareil sanitaire physique classé stockable');
assert(rA2.materiaux.filter(x=>x.includes_labor).every(x=>!x.stockable),'Prestations incluant la MO non classées stockables');
const payloadBonde=appro.payload_fournisseur.items.find(x=>x.code_tereva===bondeSel.code);
assert(!!payloadBonde,'Composant Annexe 2 présent dans payload fournisseur');
assert(payloadBonde.quantite===2,'Quantité besoin composant conservée dans payload');
assert(payloadBonde.source_page,'Page source Téréva conservée dans payload');
assert(!JSON.stringify(appro).includes('commande_créée'),'Aucune commande fournisseur fictive produite');

// 28. UI approvisionnement / export
assert(appSrc.includes('Besoins matériaux / fournisseur'),'Résultat affiche le bloc besoins fournisseur');
assert(appSrc.includes('data-export-appro-csv'),'Export CSV besoins présent');
assert(appSrc.includes('data-export-appro-json'),'Export JSON fournisseur présent');
assert(appSrc.includes('data-copy-appro-json'),'Copie payload fournisseur présente');
assert(appSrc.includes('Stock : non connecté'),'UI ne prétend pas connaître le stock');
assert(appSrc.includes('ne prétend pas connaître le stock ni créer une commande'),'Garde-fou commande explicite dans UI');
assert(engSrc.includes("version:'BALISES-ABSOLUES-v1.6'"),'Moteur balises v1.6');


// 29. Correctifs v0.5.2 issus du contrôle humain
assert(appSrc.includes("const storeKey='speedarti-plombier-demo-v061'"),'Clé de sauvegarde propre v0.6.1');
assert(appSrc.includes("legacyStoreKeys=['speedarti-plombier-demo-v060','speedarti-plombier-demo-v052','speedarti-plombier-demo-v051','speedarti-plombier-demo-v040','speedarti-plombier-demo-v031']"),'Migration des anciens brouillons prévue');
assert(appSrc.includes('function migrateLegacyDraft'),'Fonction de migration brouillon présente');
assert(appSrc.includes("delete p.duration_h"),'Migration supprime les anciennes durées CE non validées');
assert(appSrc.includes("catalogueRenderTimer=setTimeout"),'Recherche catalogue saisie rapide temporisée');
assert(catSrc.includes("wc_suspendu_main"),'Contexte cuvette WC suspendue séparé du bâti-support');
assert(catSrc.includes("wc_suspendu_bati"),'Contexte bâti-support WC suspendu séparé');
assert(CAT.search({context:'wc_suspendu_main',limit:100}).length>0,'Contexte WC suspendu principal retourne des références');
assert(CAT.search({context:'wc_suspendu_main',limit:100}).every(a=>a.type!=='Bâti-support'),'WC suspendu principal exclut les bâtis-supports');
assert(CAT.search({context:'wc_suspendu_bati',limit:100}).every(a=>a.type==='Bâti-support'),'Contexte bâti-support ne retourne que des bâtis-supports');
assert(appSrc.includes("eq.annexe2_items={}"),'Changement de sous-type WC nettoie les anciens composants Annexe 2');
assert(appSrc.includes("poser:[300,2],suspendu:[700,5],urinoir:[300,2],urinoir_bati:[600,5]"),'Changement sous-type WC remet prix/temps validés');
assert(appSrc.includes("'installation.annexe1.aleas','Aléas 4 %','Appliqués uniquement à la main-d’œuvre HT'"),'UI aléas annonce la règle métier validée');
const da=base();da.installation.annexe1.aleas=true;da.installation.network.ef_only=1;da.installation.network.fitting_catalogue=selectFirst('raccord_per');const ra=API.calculate(da);
assert(ra.finalisation_bloquee===false,'Aléas 4 % ne bloque plus après validation métier');
const expectedAleas=Math.round(ra.totaux.main_oeuvre_ht_avant_aleas*.04*100)/100;
assert(Math.abs(ra.totaux.aleas_ht-expectedAleas)<.011,'Aléas = exactement 4 % de la main-d’œuvre HT');
assert(Math.abs(ra.totaux.main_oeuvre_ht-(ra.totaux.main_oeuvre_ht_avant_aleas+ra.totaux.aleas_ht))<.011,'Main-d’œuvre HT totale inclut les aléas');
assert(Math.abs(ra.totaux.total_ht-(ra.totaux.materiaux_ht+ra.totaux.main_oeuvre_ht))<.011,'Total HT inclut matériaux + MO totale avec aléas');
assert(Math.abs(ra.totaux.tva-(ra.totaux.total_ht*ra.totaux.taux_tva/100))<.011,'TVA calculée après ajout des aléas');
assert(!ra.materiaux.some(x=>x.article_id==='ann1_aleas'),'Aléas ne sont pas classés comme matériau/fourniture');
assert(ra.controle_balises.aleas_ht_controle===ra.totaux.aleas_ht,'Balise contrôle vérifie le montant des aléas');
const daMat=base();daMat.installation.annexe1.aleas=true;daMat.installation.annexe1.arret_general=true;daMat.installation.network.ef_only=1;daMat.installation.network.fitting_catalogue=selectFirst('raccord_per');const raMat=API.calculate(daMat);
assert(raMat.totaux.materiaux_ht>ra.totaux.materiaux_ht,'Ajout d’un forfait matière/prestation augmente le hors MO');
assert(Math.abs(raMat.totaux.aleas_ht-ra.totaux.aleas_ht)<.011,'Aléas 4 % ne varient pas avec les matériaux/forfaits');
const daComplex=base();daComplex.options.complexite='complexe';daComplex.installation.annexe1.aleas=true;daComplex.installation.network.ef_only=1;daComplex.installation.network.fitting_catalogue=selectFirst('raccord_per');const raComplex=API.calculate(daComplex);
assert(Math.abs(raComplex.totaux.aleas_ht-(raComplex.totaux.main_oeuvre_ht_avant_aleas*.04))<.011,'Aléas suivent la MO après coefficient de complexité');
const da10=base();da10.options.taux_tva=10;da10.installation.annexe1.aleas=true;da10.installation.network.ef_only=1;da10.installation.network.fitting_catalogue=selectFirst('raccord_per');const ra10=API.calculate(da10);
assert(Math.abs(ra10.totaux.aleas_ht-ra.totaux.aleas_ht)<.011,'Taux de TVA ne modifie pas le montant HT des aléas');
assert(Math.abs(ra10.totaux.tva-(ra10.totaux.total_ht*.10))<.011,'TVA 10 % est appliquée après ajout des aléas');
const des=base();netRefs(des);des.installation.equipments.push({id:'es1',kind:'element_specifique',ef:true,ec:true,evac:false,stop_valves:3,price_ht:50,time_h:1});const res=API.calculate(des);
assert(res.materiaux.find(x=>x.article_id==='robinets_arret').quantite_finale===3,'Élément spécifique utilise son nombre réel de robinets d’arrêt');
assert(appSrc.includes("stop_valves"),'Champ robinets d’arrêt élément spécifique exposé dans UI');
assert(!/changement_200l_elec[^\n]{0,180}duration_h\s*[:=]\s*[0-9]/.test(appSrc+engSrc),'Aucune durée CE cachée codée pour changement 200 L');
assert(!/changement_300l_elec[^\n]{0,180}duration_h\s*[:=]\s*[0-9]/.test(appSrc+engSrc),'Aucune durée CE cachée codée pour changement 300 L');
assert(r1.controle_balises.version==='BALISES-ABSOLUES-v1.6','Version finale balises v1.6');



// 30. Parcours v0.6 — zones chantier et réseau/accessoires automatiques modifiables
const z0=base();z0.installation.zones={rdc_sans:true,r1_sans:false,rdc_avec:false,r1_avec:false};z0.installation.annexe1.attente_rdc=1;z0.installation.network.fitting_catalogue=selectFirst('raccord_per');
const pz0=API.previewNetwork(z0);
assert(pz0.autoEF===8&&pz0.autoEC===8&&pz0.autoEvac===1,'RDC sans sanitaire propose 8 ml EF + 8 ml EC + 1 ml évacuation');
assert(pz0.autoPlatineEfEc===1&&pz0.autoPlatineEvac===1,'RDC sans sanitaire propose une platine EF+EC et une évacuation');
assert(pz0.autoFittings===7,'RDC sans sanitaire propose 7 raccords avec +10 %');
const rz0=API.calculate(z0);assert(rz0.surfaces.detail_par_face.EF_ml===8&&rz0.surfaces.detail_par_face.EC_ml===8,'Moteur utilise les longueurs de la zone sans sanitaire');

const z1=base();z1.installation.zones={rdc_sans:false,r1_sans:false,rdc_avec:true,r1_avec:false};netRefs(z1);z1.installation.equipments.push({id:'wca',kind:'wc',subtype:'poser',catalogue:wcSel,price_ht:wcSel.prix,time_h:2},{id:'wcb',kind:'wc',subtype:'poser',catalogue:wcSel,price_ht:wcSel.prix,time_h:2},{id:'sha',kind:'douche',subtype:'bac',catalogue:selectFirst('douche'),price_ht:selectFirst('douche').prix,time_h:2});
const pz1=API.previewNetwork(z1);
assert(pz1.autoEF===24,'Deux WC + une douche = 24 ml EF');
assert(pz1.autoEC===13,'Une douche SDB = 8 ml EC + distance SDB 5 m');
assert(pz1.autoEvac===3,'Trois sanitaires = 3 ml évacuation locale');
assert(pz1.autoPlatineEf===2&&pz1.autoPlatineEfEc===1&&pz1.autoPlatineEvac===3,'Platines automatiques suivent les trois sanitaires indépendants');
assert(pz1.autoStopValves===4,'Deux WC + une douche = 4 robinets d’arrêt');
assert(pz1.autoFittings===20,'Trois appareils eau = ceil(3×6×1,1)=20 raccords');

const z2=base();z2.installation.zones={rdc_sans:false,r1_sans:false,rdc_avec:true,r1_avec:false};netRefs(z2);z2.installation.equipments.push({id:'wcov',kind:'wc',subtype:'poser',catalogue:wcSel,price_ht:wcSel.prix,time_h:2});z2.installation.network.manual_ef_ml=19;z2.installation.network.manual_platine_ef_qty=3;z2.installation.network.manual_fitting_qty=15;z2.installation.network.manual_stop_valve_qty=2;
const pz2=API.previewNetwork(z2);assert(pz2.ef===19,'Override longueur EF artisan devient valeur de calcul');assert(pz2.platineEf===3,'Override platines artisan devient quantité de calcul');assert(pz2.fittings===15,'Override raccords artisan devient quantité de calcul');assert(pz2.stopValves===2,'Override vannes artisan devient quantité de calcul');
const rz2=API.calculate(z2);assert(rz2.surfaces.detail_par_face.EF_ml===19,'Résultat final reprend longueur EF modifiée');assert(rz2.surfaces.detail_par_face.platines_EF===3,'Résultat final reprend platines modifiées');assert(rz2.materiaux.find(x=>x.article_id==='raccords_per').quantite_finale===15,'Résultat final reprend raccords modifiés');assert(rz2.materiaux.find(x=>x.article_id==='robinets_arret').quantite_finale===2,'Résultat final reprend robinets modifiés');

// 31. Nettoyage interface artisan / structure 4 pages corrigée
assert(appSrc.includes("['Base chantier','Dimensionnement & distances']")&&appSrc.includes("['Équipements & réseau','Sanitaires & quantités']")&&appSrc.includes("['Configuration & options','Réglages facultatifs']")&&appSrc.includes("['Résultats','Contrôle avant devis']"),'Parcours principal séparé en quatre pages métier');
assert(appSrc.includes('RDC — Sans sanitaire')&&appSrc.includes('R+1 — Sans sanitaire')&&appSrc.includes('RDC — Avec sanitaires')&&appSrc.includes('R+1 — Avec sanitaires'),'Quatre cases chantier présentes');
assert(appSrc.includes('Deux clics sur WC créent WC 1 et WC 2'),'UI explique les sanitaires indépendants');
assert(appSrc.includes('data-configure-equipment')&&appSrc.includes('configurable?'),'Configurer est piloté par la présence de sanitaires');
assert(appSrc.includes('selectedCart(eqs,false)'),'Page Équipements & réseau affiche le panier sans bouton Configurer');
assert(appSrc.includes('configurable?selectedCart(eqs,true)'), 'Page Configuration & options affiche Configurer seulement si une zone avec sanitaires contient des éléments');
assert(appSrc.includes('Distances depuis le chauffe-eau'),'Distances chauffe-eau visibles sur la Base chantier');
assert(appSrc.includes('Chauffe-eau → salle de bains (m)')&&appSrc.includes('Chauffe-eau → cuisine (m)'),'Deux distances chauffe-eau conservées et modifiables');
assert(appSrc.includes('Quantités réseau proposées'),'Réseau automatique visible sur la page Équipements & réseau');
assert(appSrc.includes('function equipmentIcon(kind)')&&appSrc.includes('<svg ${common}>'),'Icônes sanitaires SVG intégrées');
assert(appSrc.includes("if(el.dataset.configureEquipment){activeEquipmentId=el.dataset.configureEquipment;step=2"),'Configurer ouvre bien la page 3');
assert(appSrc.includes('[renderBase,renderEquipmentNetwork,renderConfiguration,renderResults][step]()'),'Routage des quatre pages actif');
assert(!/head\('Étape 1','Métier/.test(appSrc),'Ancienne première page Métier supprimée du parcours');
assert(!/Annexe 1 — grille|Composition Annexe 2/.test(appSrc),'Aucun libellé Annexe 1/2 n’est exposé dans le parcours artisan actif');
assert(appSrc.includes('function artisanMessage')&&appSrc.includes('Référentiel SpeedArti'),'Messages techniques internes nettoyés avant affichage');
assert(appSrc.includes("eqs.length?selectedCart(eqs,false):''"),'Panier étape 2 apparaît seulement après sélection d’un sanitaire');
assert(appSrc.includes("configurable?selectedCart(eqs,true):''"),'Panier étape 3 conserve les sanitaires et les boutons Configurer');
assert(appSrc.includes("equipmentPalette('rdc')")&&appSrc.includes("equipmentPalette('r1')"),'Ajout sanitaire rattaché à la zone RDC/R+1 quand les deux zones existent');
assert(appSrc.includes("data-zone=\"${zone}\""),'Chaque nouvel équipement transporte sa zone chantier');
assert(!/Prix méthode HT|Forfait débouchage HT|Forfait complet HT|Prix fourniture HT utilisé|Prix HT utilisé|Forfait pose — montant artisan|Forfait dépose — montant artisan/.test(appSrc),'Le parcours artisan ne demande plus de prix pendant le chiffrage');
assert(appSrc.includes("head('Étape 4','Résultats et contrôle'")&&appSrc.includes("step!==3")&&appSrc.includes("step===3"),'Résultats réellement routés sur la page 4');
const psTarif=base();psTarif.options.type_projet='petits_travaux';psTarif.settings.services.debouchage=215;psTarif.petits_travaux.prestations=[{id:'ds',type:'debouchage'}];const rsTarif=API.calculate(psTarif);assert(rsTarif.materiaux.find(x=>x.article_id==='debouchage_ds').prix_unitaire_ht===215,'Tarif service entreprise alimente le moteur sans saisie chantier');
console.log(JSON.stringify({status:'OK',assertions:ok,catalogueCount:CAT.count,priceCount:CAT.priceCount,knownPrice117_19:known[0].prix,balisesVersion:r1.controle_balises.version,networkOnly:{ef:r2.surfaces.detail_par_face.EF_ml,ec:r2.surfaces.detail_par_face.EC_ml},fittingsOneFixture:fittingsWC.quantite_finale},null,2));
