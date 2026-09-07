(function(){
  const ANNEXE1_DEFAULTS={
    attente_rdc:{label:'Alimentation EC/EF en attente + encastrement — RDC',unit:'unité',price:143,mode:'unitaire'},
    attente_r1:{label:'Alimentation EC/EF en attente + encastrement — R+1',unit:'unité',price:143,mode:'unitaire'},
    robinet_mll:{label:'Robinet MLL + siphon',unit:'unité',price:83.60,mode:'unitaire'},
    robinet_mlv:{label:'Robinet MLV + siphon',unit:'unité',price:83.60,mode:'unitaire'},
    robinet_exterieur:{label:'Robinet extérieur',unit:'unité',price:83.60,mode:'unitaire'},
    arret_general:{label:"Alimentation + robinet d'arrêt général",unit:'forfait',price:121,mode:'forfait'},
    raccordement_exterieur:{label:'Raccordement extérieur eau',unit:'forfait',price:72,mode:'forfait'},
    limiteur_pression:{label:'Limiteur de pression',unit:'unité',price:86.50,mode:'unitaire'},
    ventilation_wc:{label:'Ventilation haute WC',unit:'forfait',price:107,mode:'forfait'},
    ventilation_fosse:{label:'Ventilation fosse + extracteur statique',unit:'forfait',price:186,mode:'forfait'},
    forfait_etage:{label:'Forfait étage canalisation + alimentation',unit:'forfait',price:428,mode:'forfait'},
    aleas:{label:'Aléas',unit:'%',price:4,mode:'pourcentage'}
  };
  const FORFAITS_DEFAULTS={
    deplacement:{label:'Déplacement',price:45},
    demolition:{label:'Démolition',price:350},
    platrerie:{label:'Petits travaux plâtrerie',price:200},
    raccordement:{label:'Raccordement sur existant',price:150},
    traversee:{label:'Traversée plancher / mur',price:180},
    renovation:{label:'Rénovation',price:400},
    acces_difficile:{label:'Accès difficile',price:300},
    boucle_ecs:{label:'Boucle ECS',price:400},
    pompe_relevage:{label:'Pompe de relevage',price:650}
  };
  const PIPE_FALLBACK={per:.8,multicouche:1.12,cuivre:8};
  const GAMME={eco:.7,standard:1,premium:1.6};
  const COMPLEXITE={simple:.8,moyen:1,complexe:1.4};
  const HOT_KINDS=new Set(['lavabo','meuble_vasque','douche','baignoire','evier']);
  const EF_KINDS=new Set(['lavabo','meuble_vasque','douche','baignoire','evier','wc','lave_main','lave_linge','lave_vaisselle']);
  const EVAC_KINDS=new Set(['lavabo','meuble_vasque','douche','baignoire','evier','wc','lave_main','lave_linge','lave_vaisselle']);
  // Annexe 2 Guillaume : nomenclature de référence par appareil.
  // Aucun composant complémentaire n'est ajouté/prixé automatiquement : l'artisan choisit explicitement une référence exacte.
  const ANNEXE2_COMPONENTS={
    lavabo:[
      {key:'ef',label:'Alimentation eau froide',role:'network'},{key:'ec',label:'Alimentation eau chaude',role:'network'},
      {key:'mitigeur',label:'Robinet mitigeur',role:'selectable',context:'lavabo',q:'mitigeur lavabo'},
      {key:'flexibles',label:'Flexibles de raccordement',role:'selectable',context:'all',q:'flexible'},
      {key:'robinets_arret',label:"Robinets d’arrêt",role:'network'},{key:'appareil',label:'Vasque / lavabo',role:'main'},
      {key:'bonde',label:'Bonde de lavabo',role:'selectable',context:'evacuation',q:'bonde'},
      {key:'trop_plein',label:'Trop-plein si intégré',role:'selectable',optional:true,context:'all',q:'trop plein'},
      {key:'siphon',label:'Siphon',role:'selectable',context:'evacuation',q:'siphon'},
      {key:'tube_pvc',label:"Tube PVC d’évacuation",role:'network'},{key:'raccords_pvc',label:'Raccords PVC',role:'network'},
      {key:'colliers',label:'Colliers de fixation',role:'selectable',context:'all',q:'collier'},
      {key:'joints',label:'Joints et petites fournitures',role:'selectable',optional:true,context:'all',q:'joint'},
      {key:'fixations',label:'Fixations murales / consoles selon modèle',role:'selectable',optional:true,context:'all',q:'fixation'},
      {key:'meuble',label:'Meuble sous vasque si prévu',role:'selectable',optional:true,context:'meuble_vasque',q:'meuble'}
    ],
    meuble_vasque:'lavabo',
    douche:[
      {key:'ef',label:'Alimentation eau froide',role:'network'},{key:'ec',label:'Alimentation eau chaude',role:'network'},{key:'robinets_arret',label:"Robinets d’arrêt",role:'network'},
      {key:'mitigeur',label:'Mitigeur de douche',role:'dedicated',dedicated:'mitigeur'},
      {key:'flexible',label:'Flexible de douche',role:'selectable',context:'all',q:'flexible douche'},
      {key:'douchette',label:'Douchette / pommeau',role:'selectable',context:'colonne_douche',q:'douchette'},
      {key:'support',label:'Support de douche',role:'selectable',context:'colonne_douche',q:'support douche'},
      {key:'appareil',label:'Receveur',role:'main'},
      {key:'bonde',label:'Bonde de douche',role:'selectable',context:'evacuation',q:'bonde douche'},
      {key:'siphon',label:'Siphon de douche',role:'selectable',context:'evacuation',q:'siphon douche'},
      {key:'tube_pvc',label:"Tube PVC d’évacuation",role:'network'},{key:'raccords_pvc',label:'Raccords PVC',role:'network'},
      {key:'etancheite',label:'Étanchéité sous carrelage / SPEC ou système adapté',role:'dedicated',dedicated:'spec'},
      {key:'joints',label:"Joints d’étanchéité",role:'selectable',optional:true,context:'all',q:'joint douche'},
      {key:'paroi',label:'Paroi de douche',role:'dedicated',dedicated:'paroi'},
      {key:'profiles',label:'Profilés de finition',role:'selectable',optional:true,context:'paroi_douche',q:'profil'},
      {key:'fixations',label:'Fixations',role:'selectable',optional:true,context:'all',q:'fixation douche'}
    ],
    baignoire:[
      {key:'ef',label:'Alimentation eau froide',role:'network'},{key:'ec',label:'Alimentation eau chaude',role:'network'},{key:'robinets_arret',label:"Robinets d’arrêt",role:'network'},
      {key:'mitigeur',label:'Robinetterie / mitigeur',role:'selectable',context:'all',q:'mitigeur'},
      {key:'flexibles',label:'Flexibles',role:'selectable',context:'all',q:'flexible'},
      {key:'appareil',label:'Baignoire',role:'main'},
      {key:'vidage',label:'Vidage baignoire',role:'selectable',context:'all',q:'vidage'},
      {key:'bonde',label:'Bonde',role:'selectable',context:'all',q:'bonde'},
      {key:'trop_plein',label:'Trop-plein',role:'selectable',optional:true,context:'all',q:'trop plein'},
      {key:'siphon',label:'Siphon',role:'selectable',context:'all',q:'siphon'},
      {key:'tube_pvc',label:"Tube PVC d’évacuation",role:'network'},{key:'raccords_pvc',label:'Raccords PVC',role:'network'},
      {key:'supports',label:'Pieds / support de baignoire',role:'selectable',optional:true,context:'all',q:'support'},
      {key:'tablier',label:'Tablier',role:'selectable',optional:true,context:'baignoire',q:'tablier baignoire'},
      {key:'trappe',label:'Trappe de visite',role:'selectable',optional:true,context:'all',q:'trappe visite'},
      {key:'silicone',label:'Joints silicone',role:'selectable',optional:true,context:'all',q:'silicone'},
      {key:'fixations',label:'Fixations',role:'selectable',optional:true,context:'all',q:'fixation baignoire'}
    ],
    evier:[
      {key:'ef',label:'Alimentation eau froide',role:'network'},{key:'ec',label:'Alimentation eau chaude',role:'network'},{key:'robinets_arret',label:"Robinets d’arrêt",role:'network'},
      {key:'mitigeur',label:"Mitigeur d’évier",role:'selectable',context:'all',q:'mitigeur evier'},
      {key:'flexibles',label:'Flexibles',role:'selectable',context:'all',q:'flexible'},
      {key:'appareil',label:'Évier 1 ou 2 bacs',role:'main'},
      {key:'bonde',label:'Bonde',role:'selectable',context:'all',q:'bonde'},
      {key:'trop_plein',label:'Trop-plein',role:'selectable',optional:true,context:'all',q:'trop plein evier'},
      {key:'siphon',label:'Siphon',role:'selectable',context:'all',q:'siphon'},
      {key:'raccord_lave_vaisselle',label:'Raccordement lave-vaisselle si prévu',role:'selectable',optional:true,context:'all',q:'vaisselle'},
      {key:'raccord_lave_linge',label:'Raccordement lave-linge si prévu',role:'selectable',optional:true,context:'all',q:'lave linge'},
      {key:'tube_pvc',label:"Tube PVC d’évacuation",role:'network'},{key:'raccords_pvc',label:'Raccords PVC',role:'network'},
      {key:'colliers',label:'Colliers',role:'selectable',optional:true,context:'all',q:'collier'},
      {key:'joints',label:'Joints',role:'selectable',optional:true,context:'all',q:'joint'},
      {key:'fixations',label:'Fixations',role:'selectable',optional:true,context:'all',q:'fixation evier'}
    ],
    wc_poser:[
      {key:'ef',label:'Alimentation eau froide',role:'network'},{key:'robinet_arret',label:"Robinet d’arrêt",role:'network'},
      {key:'flexible',label:"Flexible d’alimentation",role:'selectable',context:'all',q:'flexible'},
      {key:'appareil',label:'WC',role:'main'},
      {key:'reservoir',label:'Réservoir',role:'selectable',optional:true,context:'wc_poser',q:'reservoir wc'},
      {key:'mecanisme',label:'Mécanisme de chasse',role:'selectable',optional:true,context:'wc',q:'mecanisme'},
      {key:'flotteur',label:'Robinet flotteur',role:'selectable',optional:true,context:'wc',q:'robinet flotteur'},
      {key:'abattant',label:'Abattant',role:'selectable',optional:true,context:'wc',q:'abattant'},
      {key:'joint_sortie',label:'Joint de sortie',role:'selectable',optional:true,context:'all',q:'joint wc'},
      {key:'pipe_wc',label:'Pipe WC',role:'selectable',optional:true,context:'wc',q:'pipe wc'},
      {key:'raccord_evac100',label:"Raccordement à l’évacuation Ø100",role:'network'},
      {key:'tube_pvc100',label:'Tube PVC Ø100 si nécessaire',role:'network',optional:true},
      {key:'raccords',label:'Coudes / raccords',role:'network'},
      {key:'colliers',label:'Colliers',role:'selectable',optional:true,context:'all',q:'collier'},
      {key:'fixations_sol',label:'Fixations au sol',role:'selectable',optional:true,context:'all',q:'fixation wc'},
      {key:'silicone',label:'Silicone',role:'selectable',optional:true,context:'all',q:'silicone'}
    ],
    wc_suspendu:[
      {key:'ef',label:'Alimentation eau froide',role:'network'},{key:'robinet_arret',label:"Robinet d’arrêt",role:'network'},
      {key:'bati_support',label:'Bâti-support',role:'selectable',optional:true,context:'wc_suspendu_bati',q:'bati support'},
      {key:'reservoir_integre',label:'Réservoir intégré',role:'selectable',optional:true,context:'wc_suspendu',q:'reservoir'},
      {key:'mecanisme',label:'Mécanisme de chasse',role:'selectable',optional:true,context:'wc',q:'mecanisme'},
      {key:'plaque_commande',label:'Plaque de commande',role:'selectable',optional:true,context:'wc_suspendu',q:'plaque commande'},
      {key:'appareil',label:'Cuvette suspendue',role:'main'},
      {key:'abattant',label:'Abattant',role:'selectable',optional:true,context:'wc',q:'abattant'},
      {key:'manchon_evacuation',label:"Manchon d’évacuation",role:'selectable',optional:true,context:'all',q:'manchon'},
      {key:'manchon_alimentation',label:"Manchon d’alimentation",role:'selectable',optional:true,context:'all',q:'manchon'},
      {key:'raccord_pvc100',label:'Raccordement PVC Ø100',role:'network'},
      {key:'habillage',label:'Habillage du bâti',role:'selectable',optional:true,context:'wc_suspendu',q:'habillage bati'},
      {key:'plaques_finition',label:'Plaques de finition',role:'selectable',optional:true,context:'wc_suspendu',q:'plaque'},
      {key:'fixations',label:'Fixations',role:'selectable',optional:true,context:'all',q:'fixation wc'},
      {key:'silicone',label:'Silicone / joints',role:'selectable',optional:true,context:'all',q:'silicone'}
    ],
    lave_main:[
      {key:'ef',label:'Alimentation eau froide',role:'network'},{key:'ec',label:'Alimentation eau chaude si prévue',role:'network',optional:true},
      {key:'robinet',label:'Robinet',role:'selectable',context:'lavabo',q:'robinet'},
      {key:'flexibles',label:'Flexibles',role:'selectable',context:'all',q:'flexible'},
      {key:'robinet_arret',label:"Robinet d’arrêt",role:'network'},{key:'appareil',label:'Petit lavabo / lave-mains',role:'main'},
      {key:'bonde',label:'Bonde',role:'selectable',context:'evacuation',q:'bonde lavabo'},
      {key:'siphon',label:'Siphon',role:'selectable',context:'evacuation',q:'siphon lavabo'},
      {key:'tube_pvc',label:'Évacuation PVC',role:'network'},{key:'raccords',label:'Raccords',role:'network'},
      {key:'fixations',label:'Fixations',role:'selectable',optional:true,context:'all',q:'fixation lavabo'},
      {key:'joints',label:'Joints',role:'selectable',optional:true,context:'all',q:'joint'}
    ],
    lave_linge:[
      {key:'ef',label:'Alimentation eau froide',role:'network'},{key:'robinet',label:'Robinet machine à laver',role:'service'},
      {key:'flexible',label:"Flexible d’alimentation",role:'selectable',optional:true,context:'all',q:'flexible'},
      {key:'evac',label:'Évacuation',role:'network'},{key:'siphon',label:'Siphon machine à laver / raccordement sur évacuation',role:'service'},
      {key:'tube_pvc',label:'Tube PVC',role:'network'},{key:'raccords',label:'Raccords',role:'network'},
      {key:'colliers',label:'Colliers',role:'selectable',optional:true,context:'all',q:'collier'},
      {key:'joints',label:'Joints',role:'selectable',optional:true,context:'all',q:'joint'}
    ],
    lave_vaisselle:[
      {key:'ef',label:'Alimentation eau froide',role:'network'},{key:'robinet',label:"Robinet d’arrêt / robinet machine",role:'service'},
      {key:'flexible',label:"Flexible d’alimentation",role:'selectable',optional:true,context:'all',q:'flexible'},
      {key:'evac',label:'Évacuation',role:'network'},{key:'siphon',label:"Raccordement sur siphon d’évier ou évacuation dédiée",role:'service'},
      {key:'tube_pvc',label:'Tube PVC',role:'network'},{key:'raccords',label:'Raccords',role:'network'},
      {key:'colliers',label:'Colliers',role:'selectable',optional:true,context:'all',q:'collier'},
      {key:'joints',label:'Joints',role:'selectable',optional:true,context:'all',q:'joint'}
    ]
  };
  function annexe2For(kind,subtype=''){let key=kind;if(kind==='wc'){if(subtype==='suspendu')key='wc_suspendu';else if(subtype==='poser'||!subtype)key='wc_poser';else return []}const x=ANNEXE2_COMPONENTS[key];return typeof x==='string'?ANNEXE2_COMPONENTS[x]||[]:x||[]}

  function r2(n){return Math.round((Number(n)||0)*100)/100}
  function n(v,d=0){const x=Number(v);return Number.isFinite(x)?x:d}
  function line(id,nom,price,qty=1,unit='unité',category='Prestation',extra={}){
    const p=r2(price),q=r2(qty);const source=extra.source||'règle métier SpeedArti';
    const stockable=!!extra.stockable;
    // Démo métier : aucune donnée de stock réelle n'est connectée. Ne jamais transformer l'absence de prix en faux état de stock.
    return {article_id:id,nom,categorie:category,quantite_theorique:q,quantite_avec_perte:q,quantite_finale:q,unite:unit,prix_unitaire_ht:p,total_ht:r2(p*q),stockable,stock_status:stockable?'non_connecte':'non_applicable',stock_disponible:null,quantite_besoin:stockable?q:0,quantite_a_commander:null,a_commander:null,coef_perte_applique:1,source,balise_ui:extra.balise_ui||`moteur:${id}`,balise_quantite:`${q} ${unit}`,balise_prix:extra.balise_prix||'règle_métier',balise_calcul:`${q} × ${p}`,...extra};
  }
  function defaults(d,key,fallback){return n(d.settings?.[key],fallback)}
  function annexPrice(d,key){return n(d.settings?.annexe1?.[key],ANNEXE1_DEFAULTS[key]?.price||0)}
  function forfaitPrice(d,key){return n(d.settings?.forfaits?.[key],FORFAITS_DEFAULTS[key]?.price||0)}
  function gammeCoef(d){return GAMME[d.options?.gamme]||1}
  function complexiteCoef(d){return COMPLEXITE[d.options?.complexite]||1}
  function hasCatalogue(sel){return !!(sel&&sel.catalogue&&sel.code)}
  function cataloguePrice(sel,fallback){return hasCatalogue(sel)&&n(sel.prix,0)>0?n(sel.prix):fallback}
  function catalogueSource(sel,manual=false){
    if(!hasCatalogue(sel))return manual?'saisie artisan':'catalogue / saisie';
    return manual?`Prix manuel sur référence Téréva ${sel.code}`:`Catalogue Téréva 2026 -20% — code ${sel.code}`;
  }
  function catalogueExtra(sel,uiPath,manual=false){
    if(!hasCatalogue(sel))return {source:manual?'saisie artisan':'catalogue / saisie',balise_ui:uiPath||'',balise_prix:manual?'manuel':'non_catalogue'};
    return {source:catalogueSource(sel,manual),catalogue_code:sel.code,catalogue_ref_fabricant:sel.ref_fab||'',catalogue_marque:sel.marque||'',catalogue_famille:sel.famille||'',catalogue_type:sel.type||'',catalogue_produit:sel.produit||'',catalogue_variante:sel.variante||'',catalogue_finition:sel.finition||'',catalogue_source_page:sel.source||'',catalogue_version:sel.catalogue||'Téréva 2026 -20%',balise_ui:uiPath||'',balise_prix:manual?'manuel_sur_reference':'reference_exacte'};
  }
  function checkCatalogueSelection(sel,currentPrice,label,alerts){
    if(!hasCatalogue(sel))return;
    const manualResolved=n(currentPrice,0)>0&&(!!sel.price_overridden||n(sel.prix,0)<=0);
    if(n(sel.prix,0)<=0&&!manualResolved)alerts.push(`BALISE PRIX : la référence catalogue « ${label} » (${sel.code}) n’a pas de prix exploitable. Saisir explicitement un prix manuel.`);
    if(!sel.marque||!sel.produit)alerts.push(`Information catalogue : la référence ${sel.code} ne possède pas toutes les informations marque/désignation extraites. Le code Téréva et la page source restent tracés.`);
    if(!sel.price_overridden&&n(currentPrice,0)>0&&n(sel.prix,0)>0&&Math.abs(n(currentPrice)-n(sel.prix))>.011)alerts.push(`BALISE PRIX : le prix affiché de « ${label} » ne correspond plus au prix de la référence Téréva ${sel.code}.`);
  }
  function normText(v){return String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()}
  function fittingCompatible(sel,pipe){
    if(!hasCatalogue(sel))return true;
    const txt=normText([sel.famille,sel.type,sel.produit,sel.variante,sel.catalogue_type,sel.catalogue_produit].filter(Boolean).join(' '));
    if(pipe==='per')return /(^|[^a-z])per([^a-z]|$)/.test(txt);
    if(pipe==='multicouche')return txt.includes('multicouche')&&!/(^|[^a-z])per([^a-z]|$)/.test(txt);
    if(pipe==='cuivre')return txt.includes('cuivre')||txt.includes('laiton')||txt.includes('bicone');
    return true;
  }
  function heaterMeta(sel){
    if(!hasCatalogue(sel))return {capacity:null,type:null};
    const txt=normText([sel.produit,sel.variante,sel.type].filter(Boolean).join(' '));
    const caps=[100,150,200,240,250,270,300,350,500];let capacity=null;
    for(const c of caps){if(new RegExp(`(^|[^0-9])${c}\\s*l(?:[^a-z]|$)`,'i').test(txt)){capacity=c;break}}
    let type=null;if(txt.includes('thermodynamique'))type='ballon_thermo';else if(txt.includes('chauffe eau')&&(txt.includes('electrique')||txt.includes('aci')||txt.includes('steatite')))type='cumulus';
    return {capacity,type};
  }
  function pricedSelection(sel,manualPrice){
    if(hasCatalogue(sel)){if(n(manualPrice,0)>0&&(sel.price_overridden||n(sel.prix,0)<=0))return {price:n(manualPrice),manual:true};return {price:n(sel.prix,0),manual:false}}
    return {price:n(manualPrice,0),manual:n(manualPrice,0)>0};
  }
  function addNetworkUnit(lines,alerts,{id,label,qty,sel,manualPrice,uiBase}){
    if(qty<=0)return;const pr=pricedSelection(sel,manualPrice);checkCatalogueSelection(sel,manualPrice,label,alerts);
    if(pr.price>0){const extra=hasCatalogue(sel)?catalogueExtra(sel,`${uiBase}_catalogue`,pr.manual):{source:'saisie artisan',balise_ui:`${uiBase}_price_ht`,balise_prix:'manuel'};lines.push(line(id,hasCatalogue(sel)?(sel.produit||label):label,pr.price,qty,'unité','Réseau',{stockable:true,...extra}))}
    else {lines.push(line(id,label,0,qty,'unité','Réseau',{stockable:true,source:'saisie requise',balise_ui:`${uiBase}_price_ht`,balise_prix:'manquant'}));alerts.push(`BALISE PRIX : prix catalogue ou manuel manquant pour « ${label} » (${qty} unité(s)).`)}
  }

  function equipmentDefaults(eq){
    const subtype=eq.subtype||'';
    if(eq.kind==='wc'){
      if(subtype==='suspendu')return {price:700,time:5,label:'WC suspendu avec bâti-support'};
      if(subtype==='urinoir')return {price:300,time:2,label:'Urinoir suspendu'};
      if(subtype==='urinoir_bati')return {price:600,time:5,label:'Urinoir suspendu avec bâti-support'};
      return {price:300,time:2,label:'WC à poser'};
    }
    if(eq.kind==='lave_linge')return {price:83.60,time:0,label:'Raccordement lave-linge'};
    if(eq.kind==='lave_vaisselle')return {price:83.60,time:0,label:'Raccordement lave-vaisselle'};
    return {price:0,time:0,label:labelFor(eq)};
  }
  function labelFor(eq){
    const labels={lavabo:'Lavabo / vasque',meuble_vasque:'Meuble vasque',douche:'Douche',baignoire:'Baignoire',evier:'Évier',wc:'WC',lave_main:'Lave-main',lave_linge:'Lave-linge',lave_vaisselle:'Lave-vaisselle',element_specifique:'Élément spécifique'};
    return eq.label||labels[eq.kind]||'Équipement';
  }
  function connectionProfile(eq){
    if(eq.kind==='element_specifique')return {ef:!!eq.ef,ec:!!eq.ec,evac:!!eq.evac};
    return {ef:EF_KINDS.has(eq.kind),ec:HOT_KINDS.has(eq.kind)||(eq.kind==='lave_main'&&!!eq.ec),evac:EVAC_KINDS.has(eq.kind)};
  }

  function addAnnexe2SelectedItems(eq,uiPath,alerts){
    const out=[];const items=eq.annexe2_items||{};const allowed=new Map(annexe2For(eq.kind,eq.subtype).filter(x=>x.role==='selectable').map(x=>[x.key,x]));
    Object.entries(items).forEach(([key,item])=>{
      const def=allowed.get(key);if(!def)return;
      const sel=item?.catalogue;const qty=n(item?.quantite,0);const manual=n(item?.price_ht,0);
      if(!hasCatalogue(sel)){if(qty>0||manual>0)alerts.push(`BALISE ANNEXE 2 : « ${def.label} » est renseigné sans référence catalogue.`);return}
      checkCatalogueSelection(sel,manual,def.label,alerts);
      if(qty<=0){alerts.push(`BALISE QUANTITÉ ANNEXE 2 : quantité manquante pour « ${def.label} ».`);return}
      const pr=pricedSelection(sel,manual);
      if(pr.price<=0){alerts.push(`BALISE PRIX ANNEXE 2 : prix manquant pour « ${def.label} » (${sel.code}).`);return}
      out.push(line(`annexe2_${eq.id}_${key}`,sel.produit||def.label,pr.price,qty,'unité','Fourniture Annexe 2',{stockable:true,parent_equipment_id:eq.id,annexe2_slot:key,annexe2_label:def.label,annexe2_source:'Annexe 2 Guillaume',...catalogueExtra(sel,`${uiPath}.annexe2_items.${key}.catalogue`,pr.manual)}));
    });
    return out;
  }
  function annexe2Nomenclature(eq){
    const items=eq.annexe2_items||{};
    return annexe2For(eq.kind,eq.subtype).map(def=>{
      let status='à vérifier',selected=null;
      if(def.role==='network')status='géré par réseau';
      else if(def.role==='main')status=hasCatalogue(eq.catalogue)?'article principal sélectionné':'article principal à vérifier';
      else if(def.role==='service')status='compris dans prestation unitaire';
      else if(def.role==='dedicated'){
        if(def.dedicated==='mitigeur')status=eq.mitigeur?(hasCatalogue(eq.mitigeur_catalogue)?'option catalogue sélectionnée':'option activée à renseigner'):'non activé';
        else if(def.dedicated==='paroi')status=eq.paroi?(hasCatalogue(eq.paroi_catalogue)?'option catalogue sélectionnée':'option activée à renseigner'):'non activé';
        else if(def.dedicated==='spec')status=eq.spec_mode?'prestation étanchéité sélectionnée':'non activé';
      }else if(def.role==='selectable'){
        selected=items[def.key]?.catalogue||null;status=hasCatalogue(selected)?'référence associée':(def.optional?'conditionnel / non renseigné':'non renseigné');
      }
      return {key:def.key,label:def.label,role:def.role,optional:!!def.optional,status,catalogue_code:selected?.code||'',catalogue_marque:selected?.marque||''};
    });
  }

  function buildEquipment(eq,d,alerts,reco,uiPath='equipment'){
    const out=[]; const def=equipmentDefaults(eq); const coef=gammeCoef(d);
    const isUnitForfait=eq.kind==='lave_linge'||eq.kind==='lave_vaisselle';
    checkCatalogueSelection(eq.catalogue,eq.price_ht,def.label||labelFor(eq),alerts);
    const catalogueSelected=hasCatalogue(eq.catalogue);
    const manualOverride=catalogueSelected&&!!eq.catalogue.price_overridden;
    const serviceDefault=eq.kind==='lave_linge'?annexPrice(d,'robinet_mll'):eq.kind==='lave_vaisselle'?annexPrice(d,'robinet_mlv'):def.price;
    const fallback=isUnitForfait?serviceDefault:n(eq.price_ht,def.price);
    let basePrice=catalogueSelected&&!manualOverride?cataloguePrice(eq.catalogue,fallback):fallback;
    let price=basePrice;
    // Une référence catalogue exacte garde son prix exact. La gamme sert à filtrer/proposer, pas à remultiplier le prix choisi.
    if(!isUnitForfait&&!catalogueSelected&&basePrice>0)price=basePrice*coef;
    const baseTime=n(eq.time_h,def.time);
    let time=baseTime;
    if(eq.kind==='douche'&&eq.subtype==='italienne')time*=1.4;
    const label=def.label||labelFor(eq);
    if(price<=0){alerts.push(`Prix catalogue manquant pour « ${label} ». La finalisation doit demander un prix manuel.`)}
    if(time<=0 && !isUnitForfait){alerts.push(`Temps de pose manquant pour « ${label} ». Le traceur doit remonter cette donnée.`)}
    if(price>0){
      const extra=catalogueSelected?catalogueExtra(eq.catalogue,`${uiPath}.catalogue`,manualOverride):isUnitForfait?{source:'Paramètres entreprise — Annexe 1 Guillaume',balise_ui:eq.kind==='lave_linge'?'settings.annexe1.robinet_mll':'settings.annexe1.robinet_mlv',balise_prix:'parametre_entreprise'}:{source:basePrice===def.price?'défaut SpeedArti / Guillaume':'saisie artisan',balise_ui:`${uiPath}.price_ht`,balise_prix:basePrice===def.price?'defaut_guillaume':'manuel'};
      out.push(line(`equip_${eq.id}`,catalogueSelected?(eq.catalogue.produit||label):label,price,1,'unité',isUnitForfait?'Prestation unitaire':'Sanitaire',{...extra,stockable:!isUnitForfait}));
    }
    if(eq.kind==='douche'){
      [['mitigeur','Mitigeur de douche'],['colonne','Colonne de douche'],['paroi','Paroi de douche']].forEach(([key,name])=>{
        if(eq[key]){
          const sel=eq[`${key}_catalogue`];const pth=`${uiPath}.${key}`;checkCatalogueSelection(sel,eq[`${key}_price_ht`],name,alerts);
          const overridden=hasCatalogue(sel)&&!!sel.price_overridden;
          const op=hasCatalogue(sel)&&!overridden?cataloguePrice(sel,0):n(eq[`${key}_price_ht`],0),ot=n(eq[`${key}_time_h`],0);
          if(op>0)out.push(line(`douche_${eq.id}_${key}`,hasCatalogue(sel)?(sel.produit||name):name,op,1,'unité','Option sanitaire',{...(hasCatalogue(sel)?catalogueExtra(sel,`${pth}_catalogue`,overridden):{source:'catalogue / saisie',balise_ui:`${pth}_price_ht`,balise_prix:'manuel'}),stockable:true})); else alerts.push(`Prix catalogue manquant pour « ${name} ».`);
          if(ot>0)time+=ot; else alerts.push(`Temps de pose manquant pour « ${name} ».`);
        }
      });
    }
    if(eq.kind==='baignoire'&&eq.colonne){
      const sel=eq.colonne_catalogue;checkCatalogueSelection(sel,eq.colonne_price_ht,'Colonne / ensemble douche baignoire',alerts);
      const overridden=hasCatalogue(sel)&&!!sel.price_overridden;
      const op=hasCatalogue(sel)&&!overridden?cataloguePrice(sel,0):n(eq.colonne_price_ht,0),ot=n(eq.colonne_time_h,0);
      if(op>0)out.push(line(`baignoire_${eq.id}_colonne`,hasCatalogue(sel)?(sel.produit||'Colonne / ensemble douche baignoire'):'Colonne / ensemble douche baignoire',op,1,'unité','Option sanitaire',{...(hasCatalogue(sel)?catalogueExtra(sel,`${uiPath}.colonne_catalogue`,overridden):{source:'catalogue / saisie',balise_ui:`${uiPath}.colonne_price_ht`,balise_prix:'manuel'}),stockable:true})); else alerts.push('Prix catalogue manquant pour la colonne de baignoire.');
      if(ot>0)time+=ot; else alerts.push('Temps de pose manquant pour la colonne de baignoire.');
    }
    if(eq.pmr_wc&&eq.kind==='wc')out.push(line(`pmr_wc_${eq.id}`,'Forfait PMR WC',300,1,'forfait','Forfait complet',{source:'Guillaume',balise_ui:`${uiPath}.pmr_wc`,balise_prix:'forfait_guillaume'}));
    if(eq.pmr_douche&&eq.kind==='douche')out.push(line(`pmr_douche_${eq.id}`,'Forfait PMR douche',300,1,'forfait','Forfait complet',{source:'Guillaume',balise_ui:`${uiPath}.pmr_douche`,balise_prix:'forfait_guillaume'}));
    if(eq.kind==='douche'&&eq.subtype==='italienne'&&eq.spec_mode){
      const surface=n(eq.spec_surface_m2,0);
      const rates={spec:16,natte:43,chape:54};
      const names={spec:'SPEC sous carrelage',natte:'SPEC + natte d’étanchéité',chape:'Chape de forme douche'};
      const rate=rates[eq.spec_mode]||0;
      if(surface>0&&rate>0)out.push(line(`douche_${eq.id}_${eq.spec_mode}`,names[eq.spec_mode],rate,surface,'m²','Prestation fourniture + MO',{includes_labor:true,source:'Guillaume',balise_ui:`${uiPath}.spec_mode`,balise_prix:'forfait_guillaume'}));
      else alerts.push(`BALISE SURFACE : surface manquante pour la prestation ${names[eq.spec_mode]||'douche italienne'}.`);
    }
    out.push(...addAnnexe2SelectedItems(eq,uiPath,alerts));
    return {lines:out,time,profile:connectionProfile(eq),nomenclature:annexe2Nomenclature(eq)};
  }

  function stopValveCount(eq){
    if(['lave_linge','lave_vaisselle'].includes(eq.kind))return 0;
    if(['lavabo','meuble_vasque','douche','baignoire','evier'].includes(eq.kind))return 2;
    if(eq.kind==='wc'||eq.kind==='lave_main')return 1;
    if(eq.kind==='element_specifique')return Math.max(0,n(eq.stop_valves,0));
    return connectionProfile(eq).ef?1:0;
  }

  function computeNetwork(d,equipments){
    const net=d.installation?.network||{};
    const zones=d.installation?.zones;
    const hasZoneModel=!!zones;
    const noSanitaryZones=hasZoneModel?((zones.rdc_sans?1:0)+(zones.r1_sans?1:0)):0;
    let efPoints=0,ecPoints=0,evacPoints=0;
    equipments.forEach(eq=>{const p=connectionProfile(eq);if(p.ef)efPoints++;if(p.ec)ecPoints++;if(p.evac)evacPoints++});
    const ann=d.installation?.annexe1||{};
    const waitRdc=n(ann.attente_rdc,0),waitR1=n(ann.attente_r1,0);
    if(hasZoneModel){
      efPoints+=noSanitaryZones+n(net.ef_only,0)+n(net.ef_ec,0);
      ecPoints+=noSanitaryZones+n(net.ec_only,0)+n(net.ef_ec,0);
      evacPoints+=noSanitaryZones+n(net.evac_points,0);
    }else{
      // Compatibilité avec les brouillons antérieurs à la v0.6.
      efPoints+=waitRdc+waitR1+n(net.ef_only,0)+n(net.ef_ec,0)+n(net.platines_ef,0)+n(net.platines_ef_ec,0);
      ecPoints+=waitRdc+waitR1+n(net.ec_only,0)+n(net.ef_ec,0)+n(net.platines_ec,0)+n(net.platines_ef_ec,0);
      evacPoints+=n(net.evac_points,0)+n(net.platines_evac,0);
    }
    const hasHotBathroom=equipments.some(eq=>['lavabo','meuble_vasque','douche','baignoire','lave_main'].includes(eq.kind)&&connectionProfile(eq).ec);
    const hasHotKitchen=equipments.some(eq=>eq.kind==='evier'&&connectionProfile(eq).ec);
    const waterEquipments=equipments.filter(eq=>{const p=connectionProfile(eq);return p.ef||p.ec}).length;
    const standaloneWaterPoints=hasZoneModel
      ? noSanitaryZones+n(net.ef_only,0)+n(net.ec_only,0)+n(net.ef_ec,0)
      : waitRdc+waitR1+n(net.ef_only,0)+n(net.ec_only,0)+n(net.ef_ec,0)+n(net.platines_ef,0)+n(net.platines_ec,0)+n(net.platines_ef_ec,0);
    const fittingUnits=waterEquipments+standaloneWaterPoints;
    const autoEF=efPoints*8;
    const autoEC=ecPoints*8+(hasHotBathroom?n(net.distance_ce_sdb,5):0)+(hasHotKitchen?n(net.distance_ce_cuisine,8):0);
    const autoEvac=evacPoints*1;
    const ef=net.manual_ef_ml!==undefined&&net.manual_ef_ml!==null&&net.manual_ef_ml!==''?n(net.manual_ef_ml):autoEF;
    const ec=net.manual_ec_ml!==undefined&&net.manual_ec_ml!==null&&net.manual_ec_ml!==''?n(net.manual_ec_ml):autoEC;
    const evac=net.manual_evac_ml!==undefined&&net.manual_evac_ml!==null&&net.manual_evac_ml!==''?n(net.manual_evac_ml):autoEvac;

    // Accessoires proposés automatiquement à partir des appareils et des zones réseau seul.
    let autoPlatineEf=0,autoPlatineEc=0,autoPlatineEfEc=0,autoPlatineEvac=0;
    if(hasZoneModel){
      equipments.forEach(eq=>{const p=connectionProfile(eq);if(p.ef&&p.ec)autoPlatineEfEc++;else if(p.ef)autoPlatineEf++;else if(p.ec)autoPlatineEc++;if(p.evac)autoPlatineEvac++});
      autoPlatineEfEc+=noSanitaryZones;autoPlatineEvac+=noSanitaryZones;
    }else{
      autoPlatineEf+=n(net.platines_ef,0);autoPlatineEc+=n(net.platines_ec,0);autoPlatineEfEc+=n(net.platines_ef_ec,0);autoPlatineEvac+=n(net.platines_evac,0);
    }
    const useOverride=(k,auto)=>net[k]!==undefined&&net[k]!==null&&net[k]!==''?Math.max(0,n(net[k])):auto;
    const platineEf=useOverride('manual_platine_ef_qty',autoPlatineEf);
    const platineEc=useOverride('manual_platine_ec_qty',autoPlatineEc);
    const platineEfEc=useOverride('manual_platine_ef_ec_qty',autoPlatineEfEc);
    const platineEvac=useOverride('manual_platine_evac_qty',autoPlatineEvac);
    const autoFittings=Math.ceil(fittingUnits*6*1.1);
    const fittings=useOverride('manual_fitting_qty',autoFittings);
    const autoStopValves=equipments.reduce((sum,eq)=>sum+stopValveCount(eq),0);
    const stopValves=useOverride('manual_stop_valve_qty',autoStopValves);

    return {efPoints,ecPoints,evacPoints,fittingUnits,autoEF,autoEC,autoEvac,ef,ec,evac,hasHotBathroom,hasHotKitchen,
      noSanitaryZones,autoPlatineEf,autoPlatineEc,autoPlatineEfEc,autoPlatineEvac,platineEf,platineEc,platineEfEc,platineEvac,
      autoFittings,fittings,autoStopValves,stopValves};
  }

  function applyAnnexe1(d,lines,alerts){
    const a=d.installation?.annexe1||{};
    const qKeys=['attente_rdc','attente_r1','robinet_exterieur','limiteur_pression'];
    qKeys.forEach(key=>{const qty=n(a[key],0);if(qty>0){const cfg=ANNEXE1_DEFAULTS[key];lines.push(line(`ann1_${key}`,cfg.label,annexPrice(d,key),qty,cfg.unit,cfg.mode==='unitaire'?'Prestation unitaire':'Forfait complet',{source:'Annexe 1 Guillaume',balise_ui:`installation.annexe1.${key}`,balise_prix:'forfait_guillaume'}))}});
    const toggleKeys=['arret_general','raccordement_exterieur','ventilation_wc','ventilation_fosse','forfait_etage'];
    toggleKeys.forEach(key=>{if(a[key]){const cfg=ANNEXE1_DEFAULTS[key];lines.push(line(`ann1_${key}`,cfg.label,annexPrice(d,key),1,cfg.unit,'Forfait complet',{source:'Annexe 1 Guillaume',balise_ui:`installation.annexe1.${key}`,balise_prix:'forfait_guillaume'}))}});
    // MLL / MLV are created by equipment instances to avoid double counting.
    return !!a.aleas;
  }

  function addGeneralForfaits(d,lines){
    const f=d.options?.forfaits||{};
    ['demolition','platrerie','raccordement','traversee','renovation','acces_difficile','boucle_ecs','pompe_relevage'].forEach(key=>{if(f[key])lines.push(line(`forfait_${key}`,FORFAITS_DEFAULTS[key].label,forfaitPrice(d,key),1,'forfait','Forfait complet',{source:'Paramètres entreprise',balise_ui:`options.forfaits.${key}`,balise_prix:'parametre_entreprise'}))});
    if(n(f.pose_manual,0)>0)lines.push(line('forfait_pose','Forfait pose — montant artisan',n(f.pose_manual),1,'forfait','Forfait complet',{source:'saisie artisan',balise_ui:'options.forfaits.pose_manual',balise_prix:'manuel'}));
    if(n(f.depose_manual,0)>0)lines.push(line('forfait_depose','Forfait dépose — montant artisan',n(f.depose_manual),1,'forfait','Forfait complet',{source:'saisie artisan',balise_ui:'options.forfaits.depose_manual',balise_prix:'manuel'}));
  }
  function addFreeCatalogueArticles(d,lines,alerts){
    const arr=d.options?.articles_libres||[];
    arr.forEach((item,i)=>{
      const sel=item?.catalogue||item;if(!hasCatalogue(sel)){alerts.push(`BALISE CATALOGUE : article libre ${i+1} sans référence catalogue valide.`);return}
      const qty=Math.max(0,n(item.quantite,1));const price=n(item.price_ht,sel.prix);
      checkCatalogueSelection(sel,price,sel.produit||`Article libre ${i+1}`,alerts);
      if(qty<=0){alerts.push(`BALISE QUANTITÉ : article libre « ${sel.produit||sel.code} » avec quantité nulle.`);return}
      if(price<=0){alerts.push(`Prix catalogue manquant pour « ${sel.produit||sel.code} ».`);return}
      const overridden=!!sel.price_overridden;
      lines.push(line(`libre_${sel.code}_${i}`,sel.produit||`Article Téréva ${sel.code}`,price,qty,'unité','Article libre',{...catalogueExtra(sel,`options.articles_libres.${i}.catalogue`,overridden),stockable:true}));
    });
  }

  function complete(d){
    const lines=[],alerts=[],reco=[]; const equipments=d.installation?.equipments||[];
    let laborHours=0;const nomenclature=[];
    equipments.forEach((eq,i)=>{const b=buildEquipment(eq,d,alerts,reco,`installation.equipments.${i}`);lines.push(...b.lines);laborHours+=b.time;nomenclature.push({equipment_id:eq.id,equipment:labelFor(eq),components:b.nomenclature||[]})});

    const network=computeNetwork(d,equipments);
    const net=d.installation?.network||{};
    const pipe=(d.options?.type_tuyau||'per').toLowerCase();
    const pipePrice=PIPE_FALLBACK[pipe]||PIPE_FALLBACK.per;
    const totalPipe=network.ef+network.ec;
    if(totalPipe>0)lines.push(line(`tuyau_${pipe}`,`Tuyau ${pipe==='per'?'PER':pipe} — prix de secours`,pipePrice,totalPipe,'ml','Réseau',{stockable:true,source:'fallback Guillaume',balise_ui:'options.type_tuyau',balise_prix:'fallback_guillaume'}));
    if(network.evac>0){const ep=n(net.evac_price_ml,0);lines.push(line('evac_local','Évacuation locale estimée',ep,network.evac,'ml','Réseau',{source:ep>0?'saisie artisan HT/ml':'composition appareil / réseau',stockable:true,balise_ui:'installation.network.evac_price_ml',balise_prix:ep>0?'manuel':'manquant'}));if(ep<=0)alerts.push(`Prix catalogue manquant pour l'évacuation PVC : ${network.evac} ml. Renseigner exceptionnellement un prix HT/ml tant que le conditionnement catalogue n'est pas normalisé.`)}

    addNetworkUnit(lines,alerts,{id:'platine_ef',label:'Platine sanitaire EF',qty:network.platineEf,sel:net.platine_ef_catalogue,manualPrice:net.platine_ef_price_ht,uiBase:'installation.network.platine_ef'});
    addNetworkUnit(lines,alerts,{id:'platine_ec',label:'Platine sanitaire EC',qty:network.platineEc,sel:net.platine_ec_catalogue,manualPrice:net.platine_ec_price_ht,uiBase:'installation.network.platine_ec'});
    addNetworkUnit(lines,alerts,{id:'platine_ef_ec',label:'Platine sanitaire EF + EC',qty:network.platineEfEc,sel:net.platine_ef_ec_catalogue,manualPrice:net.platine_ef_ec_price_ht,uiBase:'installation.network.platine_ef_ec'});
    addNetworkUnit(lines,alerts,{id:'platine_evac',label:'Platine / raccordement évacuation',qty:network.platineEvac,sel:net.platine_evac_catalogue,manualPrice:net.platine_evac_price_ht,uiBase:'installation.network.platine_evac'});

    const fittingQty=network.fittings;
    if(fittingQty>0){
      const sel=net.fitting_catalogue;const pr=pricedSelection(sel,net.fitting_price_ht);checkCatalogueSelection(sel,net.fitting_price_ht,`Raccords ${pipe}`,alerts);
      if(hasCatalogue(sel)&&!fittingCompatible(sel,pipe))alerts.push(`BALISE COMPATIBILITÉ : la référence raccord Téréva ${sel.code} n’est pas compatible avec le réseau ${pipe.toUpperCase()}.`);
      if(pr.price>0)lines.push(line(`raccords_${pipe}`,hasCatalogue(sel)?(sel.produit||`Raccords ${pipe}`):`Raccords ${pipe}`,pr.price,fittingQty,'unité','Réseau',{stockable:true,...(hasCatalogue(sel)?catalogueExtra(sel,'installation.network.fitting_catalogue',pr.manual):{source:'saisie artisan',balise_ui:'installation.network.fitting_price_ht',balise_prix:'manuel'})}));
      else {lines.push(line(`raccords_${pipe}`,`Raccords ${pipe} — quantité estimée`,0,fittingQty,'unité','Réseau',{stockable:true,source:'composition réseau',balise_ui:'installation.network.fitting_price_ht',balise_prix:'manquant'}));alerts.push(`Prix catalogue manquant pour les raccords ${pipe} : ${fittingQty} unité(s) estimée(s).`)}
    }
    const stopValves=network.stopValves;
    if(stopValves>0){
      const sel=net.stop_valve_catalogue;const pr=pricedSelection(sel,net.stop_valve_price_ht);checkCatalogueSelection(sel,net.stop_valve_price_ht,'Robinets d’arrêt',alerts);
      if(pr.price>0)lines.push(line('robinets_arret',hasCatalogue(sel)?(sel.produit||'Robinets d’arrêt'):'Robinets d’arrêt',pr.price,stopValves,'unité','Réseau',{stockable:true,...(hasCatalogue(sel)?catalogueExtra(sel,'installation.network.stop_valve_catalogue',pr.manual):{source:'saisie artisan',balise_ui:'installation.network.stop_valve_price_ht',balise_prix:'manuel'})}));
      else {lines.push(line('robinets_arret','Robinets d’arrêt — selon composition appareils',0,stopValves,'unité','Réseau',{stockable:true,source:'composition appareils',balise_ui:'installation.network.stop_valve_price_ht',balise_prix:'manquant'}));alerts.push(`Prix catalogue manquant pour les robinets d’arrêt : ${stopValves} unité(s).`)}
    }

    const networkLength=network.ef+network.ec+network.evac;
    if(networkLength>0){const nt=n(net.time_h,0);if(nt>0)laborHours+=nt;else alerts.push(`BALISE TEMPS : temps de pose réseau manquant pour ${r2(networkLength)} ml. Renseigner le temps artisan ; aucun rendement h/ml n’est inventé.`)}

    // ECS equipment and recommendation
    const hotCount=equipments.filter(eq=>eq.kind==='douche'||eq.kind==='baignoire').length;
    if(hotCount===1)reco.push('Chauffe-eau 150 L recommandé (simple recommandation).');
    if(hotCount>=2)reco.push('Chauffe-eau 300 L recommandé (simple recommandation).');
    if(d.options?.chauffe_eau?.enabled){
      const ce=d.options.chauffe_eau;checkCatalogueSelection(ce.catalogue,ce.price_ht,'Chauffe-eau',alerts);
      const hm=heaterMeta(ce.catalogue);if(hm.capacity&&n(ce.capacity,0)>0&&hm.capacity!==n(ce.capacity))alerts.push(`BALISE COMPATIBILITÉ : la référence chauffe-eau ${ce.catalogue.code} semble être ${hm.capacity} L alors que ${ce.capacity} L est sélectionné.`);if(hm.type&&ce.type&&hm.type!==ce.type)alerts.push(`BALISE COMPATIBILITÉ : le type de la référence chauffe-eau ${ce.catalogue.code} ne correspond pas au type sélectionné.`);
      const selected=hasCatalogue(ce.catalogue),overridden=selected&&!!ce.catalogue.price_overridden;
      const base=selected&&!overridden?cataloguePrice(ce.catalogue,0):n(ce.price_ht,0); const c=gammeCoef(d);const price=selected?base:base*c;
      if(price>0)lines.push(line('chauffe_eau',selected?(ce.catalogue.produit||`Chauffe-eau ${ce.type||''} ${ce.capacity||''} L`):`Chauffe-eau ${ce.type||''} ${ce.capacity||''} L`,price,1,'unité','Équipement',{...(selected?catalogueExtra(ce.catalogue,'options.chauffe_eau.catalogue',overridden):{source:'catalogue / saisie',balise_ui:'options.chauffe_eau.price_ht',balise_prix:'manuel'}),stockable:true}));
      else alerts.push('Prix catalogue du chauffe-eau manquant.');
      const t=n(ce.time_h,0); laborHours+=t;if(t<=0)alerts.push('Temps de pose du chauffe-eau manquant.');
    }
    if(d.options?.adoucisseur?.enabled){
      const ad=d.options.adoucisseur;checkCatalogueSelection(ad.catalogue,ad.price_ht,"Adoucisseur d'eau",alerts);
      const selected=hasCatalogue(ad.catalogue),overridden=selected&&!!ad.catalogue.price_overridden;
      let base=selected&&!overridden?cataloguePrice(ad.catalogue,0):n(ad.price_ht,1000);if(!selected)base=Math.max(base,1000);
      const price=selected?base:base*gammeCoef(d);
      if(price>0)lines.push(line('adoucisseur',selected?(ad.catalogue.produit||"Adoucisseur d'eau"):"Adoucisseur d'eau",price,1,'unité','Équipement',{...(selected?catalogueExtra(ad.catalogue,'options.adoucisseur.catalogue',overridden):{source:'base Guillaume / catalogue',balise_ui:'options.adoucisseur.price_ht',balise_prix:'defaut_ou_manuel'}),stockable:true})); else alerts.push("Prix catalogue de l'adoucisseur manquant.");
      const t=n(ad.time_h,0);laborHours+=t;if(t<=0)alerts.push("Temps de pose de l'adoucisseur manquant.");
    }

    const aleas=applyAnnexe1(d,lines,alerts);
    addGeneralForfaits(d,lines);
    addFreeCatalogueArticles(d,lines,alerts);

    const laborCoef=complexiteCoef(d);
    const laborBase=laborHours*n(d.options?.taux_horaire,52);
    const laborTotal=laborBase*laborCoef;
    const aleasHt=aleas?laborTotal*.04:0;
    let materials=lines.reduce((s,l)=>s+l.total_ht,0);
    const ht=materials+laborTotal+aleasHt;
    const tvaRate=n(d.options?.taux_tva,20);
    const tva=ht*tvaRate/100;
    const workers=Math.max(1,n(d.options?.nb_ouvriers,1));
    const surface=n(d.installation?.surface_maison_m2,0);
    if(surface>0)reco.push(`Surface maison renseignée : ${surface} m². Le code original Plombier ne contient pas encore de coefficient surface explicite ; aucune formule de surface n’a été inventée.`);
    if(!equipments.length&&(network.efPoints+network.ecPoints+network.evacPoints)===0)alerts.push('Installation complète sans sanitaire autorisée, mais aucun point réseau n’est encore renseigné.');

    return finish({d,lines,alerts,reco,laborHours,laborTotal,aleasHt,ht,tva,tvaRate,workers,network,nomenclature,mode:'Installation complète'});
  }

  function smallWorkLine(p,d,alerts,reco){
    const lines=[]; let labor=0; const type=p.type;
    if(type==='fuite'){
      lines.push(line(`diag_${p.id}`,'Diagnostic / visite recherche de fuite',150,1,'forfait','Forfait complet',{includes_labor:true,source:'Guillaume',balise_ui:'petits_travaux.prestations.fuite.diagnostic',balise_prix:'forfait_guillaume'}));
      const methodLabels={camera:'Caméra endoscopique',colorant:'Test au colorant',demolition:'Démolition + recherche',fumee:'Test à la fumée',exterieure:'Recherche extérieure',circuits:'Mise en évidence circuits'};
      if(!p.method)alerts.push('Choisir une méthode de recherche de fuite.');
      else if(n(p.method_price_ht,0)>0)lines.push(line(`fuite_${p.id}`,methodLabels[p.method]||'Méthode recherche de fuite',n(p.method_price_ht),1,'forfait','Forfait complet',{source:'catalogue / saisie'}));
      else alerts.push(`Prix catalogue manquant pour la méthode « ${methodLabels[p.method]||p.method} ».`);
      labor=0;
    } else if(type==='debouchage'){
      const price=n(p.price_ht,0);lines.push(line(`debouchage_${p.id}`,'Débouchage — tout compris déplacement inclus',price,1,'forfait','Forfait complet',{includes_labor:true,includes_travel:true,source:price>0?'saisie artisan — nature forfait validée Guillaume':'saisie requise',balise_ui:'petits_travaux.prestations.debouchage.price_ht',balise_prix:price>0?'manuel':'manquant'}));if(price<=0)alerts.push('BALISE PRIX : montant du forfait débouchage manquant. Guillaume a validé la nature tout compris, pas un montant unique.');labor=0;
    } else if(type==='chauffe_eau'){
      const map={reparation:{label:'Réparation / nettoyage chauffe-eau',price:0,allin:true},changement_200l_elec:{label:'Changement chauffe-eau 200 L électrique',price:300},changement_300l_elec:{label:'Changement chauffe-eau 300 L électrique',price:550},ballon_thermo_air_ext:{label:'Ballon thermodynamique air extérieur',price:1550},ballon_thermo_groupe_ext:{label:'Thermodynamique groupe extérieur / sortie toit',price:2000}};
      const c=map[p.ce_type]||map.reparation;
      if(c.allin){const price=n(p.price_ht,0);lines.push(line(`ce_${p.id}`,c.label,price,1,'forfait','Forfait complet',{includes_labor:true,source:price>0?'saisie artisan — nature forfait validée Guillaume':'saisie requise',balise_ui:'petits_travaux.prestations.chauffe_eau.price_ht',balise_prix:price>0?'manuel':'manquant'}));if(price<=0)alerts.push('BALISE PRIX : montant du forfait réparation / nettoyage chauffe-eau manquant.');labor=0}
      else {
        checkCatalogueSelection(p.catalogue,p.price_ht,c.label,alerts);const selected=hasCatalogue(p.catalogue),overridden=selected&&!!p.catalogue.price_overridden;
        const price=selected&&!overridden?cataloguePrice(p.catalogue,c.price):n(p.price_ht,c.price);
        lines.push(line(`ce_${p.id}`,selected?(p.catalogue.produit||c.label):c.label,price,1,'unité','Fourniture',{...(selected?catalogueExtra(p.catalogue,'petits_travaux.prestations.chauffe_eau.catalogue',overridden):{source:'Guillaume / saisie',balise_ui:'petits_travaux.prestations.chauffe_eau.price_ht',balise_prix:'defaut_guillaume'}),stockable:true}));
        labor=n(p.duration_h,0);if(labor<=0)alerts.push(`BALISE TEMPS : durée de pose manquante pour « ${c.label} ». Aucun temps automatique non validé n’est inventé.`);
      }
    } else if(type==='remplacement'){
      if(!p.equipment){alerts.push('Sélectionner un élément sanitaire à remplacer.');return {lines,labor}}
      const pIndex=(d.petits_travaux?.prestations||[]).findIndex(x=>x.id===p.id);const b=buildEquipment(p.equipment,d,alerts,reco,`petits_travaux.prestations.${pIndex}.equipment`);lines.push(...b.lines);labor=b.time;return {lines,labor,nomenclature:{equipment_id:p.equipment.id,equipment:labelFor(p.equipment),components:b.nomenclature||[]}};
    } else alerts.push('Choisir le type de prestation.');
    if(type==='chauffe_eau'&&p.ce_type!=='reparation'&&p.duration_h!==undefined&&p.duration_h!==null&&p.duration_h!=='')labor=n(p.duration_h,labor);
    return {lines,labor};
  }

  function petits(d){
    const lines=[],alerts=[],reco=[]; const prestations=d.petits_travaux?.prestations||[]; let laborHours=0; let includesTravel=false;const nomenclature=[];
    if(!prestations.length)alerts.push('BALISE PRESTATION : ajouter au moins une prestation.');
    prestations.forEach(p=>{const r=smallWorkLine(p,d,alerts,reco);lines.push(...r.lines);laborHours+=r.labor;if(r.nomenclature)nomenclature.push(r.nomenclature);if(r.lines.some(x=>x.includes_travel))includesTravel=true});
    const f=d.options?.forfaits||{};
    if(f.deplacement&&!includesTravel)lines.push(line('forfait_deplacement','Déplacement',forfaitPrice(d,'deplacement'),1,'forfait','Forfait complet',{source:'Paramètres entreprise',balise_ui:'options.forfaits.deplacement',balise_prix:'parametre_entreprise'}));
    addGeneralForfaits(d,lines);
    addFreeCatalogueArticles(d,lines,alerts);
    const laborTotal=laborHours*n(d.options?.taux_horaire,52)*complexiteCoef(d);
    const materials=lines.reduce((s,l)=>s+l.total_ht,0); const ht=materials+laborTotal; const rate=n(d.options?.taux_tva,20);const tva=ht*rate/100;const workers=Math.max(1,n(d.options?.nb_ouvriers,1));
    return finish({d,lines,alerts,reco,laborHours,laborTotal,aleasHt:0,ht,tva,tvaRate:rate,workers,network:null,nomenclature,mode:'Petits travaux'});
  }

  function autoControlBalises(d,lines,laborHours,laborTotal,aleasHt,ht,tva,tvaRate){
    const issues=[];let catalogueLines=0;
    lines.forEach((l,i)=>{
      const tag=`ligne ${i+1} « ${l.nom||l.article_id||'?'} »`;
      if(!l.article_id)issues.push(`BALISE ID absente — ${tag}`);
      if(!l.nom)issues.push(`BALISE DÉSIGNATION absente — ${tag}`);
      if(!l.categorie)issues.push(`BALISE CATÉGORIE absente — ${tag}`);
      if(!l.unite)issues.push(`BALISE UNITÉ absente — ${tag}`);
      if(!l.source)issues.push(`BALISE SOURCE absente — ${tag}`);
      if(!l.balise_ui)issues.push(`BALISE UI absente — ${tag}`);
      if(!Number.isFinite(Number(l.quantite_finale))||Number(l.quantite_finale)<0)issues.push(`BALISE QUANTITÉ invalide — ${tag}`);
      if(!Number.isFinite(Number(l.prix_unitaire_ht))||Number(l.prix_unitaire_ht)<0)issues.push(`BALISE PRIX invalide — ${tag}`);
      const expected=r2(n(l.quantite_finale)*n(l.prix_unitaire_ht));
      if(Math.abs(expected-n(l.total_ht))>.011)issues.push(`BALISE CALCUL incohérente — ${tag} : ${l.quantite_finale} × ${l.prix_unitaire_ht} ≠ ${l.total_ht}`);
      if(l.catalogue_code){
        catalogueLines++;
        if(!l.catalogue_version)issues.push(`BALISE CATALOGUE version absente — ${tag}`);
        if(!l.catalogue_source_page)issues.push(`BALISE CATALOGUE page source absente — ${tag}`);
      }
      if(l.annexe2_slot){if(!l.parent_equipment_id)issues.push(`BALISE ANNEXE 2 parent absent — ${tag}`);if(l.annexe2_source!=='Annexe 2 Guillaume')issues.push(`BALISE ANNEXE 2 source absente — ${tag}`)}
      if(l.stockable){
        if(l.stock_status!=='non_connecte')issues.push(`BALISE STOCK invalide — ${tag} : la démo ne possède pas de stock réel connecté.`);
        if(l.stock_disponible!==null)issues.push(`BALISE STOCK disponible inventé — ${tag}`);
        if(l.quantite_a_commander!==null||l.a_commander!==null)issues.push(`BALISE COMMANDE inventée — ${tag} : stock réel requis avant calcul à commander.`);
        if(!Number.isFinite(Number(l.quantite_besoin))||Number(l.quantite_besoin)<0)issues.push(`BALISE BESOIN invalide — ${tag}`);
      }
    });
    const materials=r2(lines.reduce((sum,l)=>sum+n(l.total_ht),0));
    const laborExpected=r2(n(laborHours)*n(d.options?.taux_horaire,52)*complexiteCoef(d));
    if(Math.abs(laborExpected-r2(laborTotal))>.011)issues.push(`BALISE MAIN-D’ŒUVRE incohérente : heures × taux × complexité = ${laborExpected}, moteur = ${r2(laborTotal)}.`);
    const aleasExpected=d.installation?.annexe1?.aleas?r2(n(laborTotal)*.04):0;
    if(Math.abs(aleasExpected-r2(aleasHt))>.011)issues.push(`BALISE ALÉAS incohérente : 4 % de la main-d’œuvre HT = ${aleasExpected}, moteur = ${r2(aleasHt)}.`);
    const htExpected=r2(materials+n(laborTotal)+n(aleasHt));
    if(Math.abs(htExpected-r2(ht))>.011)issues.push(`BALISE TOTAL HT incohérente : matériaux + main-d’œuvre + aléas = ${htExpected}, moteur = ${r2(ht)}.`);
    const tvaExpected=r2(n(ht)*n(tvaRate)/100);
    if(Math.abs(tvaExpected-r2(tva))>.011)issues.push(`BALISE TVA incohérente : ${tvaExpected} attendu, moteur = ${r2(tva)}.`);
    return {ok:issues.length===0,issues,lignes_controlees:lines.length,lignes_catalogue:catalogueLines,materiaux_ht_controles:materials,main_oeuvre_ht_avant_aleas_controlee:laborExpected,aleas_ht_controle:aleasExpected,main_oeuvre_ht_controlee:r2(laborExpected+aleasExpected),total_ht_controle:htExpected,tva_controlee:tvaExpected,version:'BALISES-ABSOLUES-v1.6'};
  }

  function buildApprovisionnement(lines){
    const items=lines.filter(l=>l.stockable).map(l=>({
      article_id:l.article_id,designation:l.nom,categorie:l.categorie,quantite_besoin:r2(l.quantite_finale),unite:l.unite,
      prix_unitaire_ht:r2(l.prix_unitaire_ht),total_ht:r2(l.total_ht),source_prix:l.source||'',
      catalogue_code:l.catalogue_code||'',catalogue_marque:l.catalogue_marque||'',catalogue_ref_fabricant:l.catalogue_ref_fabricant||'',
      catalogue_version:l.catalogue_version||'',catalogue_source_page:l.catalogue_source_page||'',
      stock_status:'non_connecte',stock_disponible:null,quantite_a_commander:null,
      statut_prix:r2(l.prix_unitaire_ht)>0?'prix_renseigne':'prix_manquant',
      action:'verifier_stock_et_fournisseur'
    }));
    const catalogue=items.filter(x=>x.catalogue_code);
    const horsCatalogue=items.filter(x=>!x.catalogue_code);
    const prixManquants=items.filter(x=>x.statut_prix==='prix_manquant');
    return {
      stock_connecte:false,statut_stock:'non_connecte',
      message_stock:'Aucune donnée de stock réelle n’est connectée dans la démo. Les quantités ci-dessous sont des besoins chantier, pas des quantités à commander.',
      items,articles_catalogue:catalogue,articles_hors_catalogue:horsCatalogue,prix_manquants:prixManquants,
      nombre_lignes:items.length,total_besoins_ht:r2(items.reduce((s,x)=>s+n(x.total_ht),0)),
      payload_fournisseur:{version:'PLB-APPRO-V1',metier:'plombier',items:items.map(x=>({code_tereva:x.catalogue_code,reference_fabricant:x.catalogue_ref_fabricant,marque:x.catalogue_marque,designation:x.designation,quantite:x.quantite_besoin,unite:x.unite,prix_unitaire_ht:x.prix_unitaire_ht,source_prix:x.source_prix,source_page:x.catalogue_source_page}))}
    };
  }

  function finish({d,lines,alerts,reco,laborHours,laborTotal,aleasHt=0,ht,tva,tvaRate,workers,network,nomenclature=[],mode}){
    const controle=autoControlBalises(d,lines,laborHours,laborTotal,aleasHt,ht,tva,tvaRate);
    if(!controle.ok)alerts.push(...controle.issues);
    const blocking=alerts.filter(a=>/Prix catalogue manquant|Temps de pose.*manquant|Choisir|Sélectionner|aucun point réseau|BALISE/i.test(a));
    const approvisionnement=buildApprovisionnement(lines);
    return {
      mode,
      surfaces:{totale:n(d.installation?.surface_maison_m2,0),nette:0,avec_pertes:0,detail_par_face:network?{EF_ml:r2(network.ef),EC_ml:r2(network.ec),evac_ml:r2(network.evac),points_EF:network.efPoints,points_EC:network.ecPoints,points_evac:network.evacPoints,platines_EF:network.platineEf,platines_EC:network.platineEc,platines_EF_EC:network.platineEfEc,platines_evac:network.platineEvac,raccords:network.fittings,robinets_arret:network.stopValves}:{}},
      materiaux:lines,
      main_oeuvre:{temps_estime_heures:r2(laborHours/workers),heures_homme:r2(laborHours),decomposition:[{poste:'Main-d’œuvre calculée',temps_heures:r2(laborHours),montant_ht:r2(laborTotal)},...(aleasHt>0?[{poste:'Aléas — 4 % de la main-d’œuvre HT',taux:4,montant_ht:r2(aleasHt)}]:[])],taux_horaire:n(d.options?.taux_horaire,52),nombre_ouvriers:workers,coefficient_complexite:complexiteCoef(d),cout_avant_aleas:r2(laborTotal),aleas_taux:aleasHt>0?4:0,aleas_ht:r2(aleasHt),cout_total:r2(laborTotal+aleasHt),balises:{heures_homme:r2(laborHours),taux_horaire:n(d.options?.taux_horaire,52),complexite:complexiteCoef(d),aleas_taux:aleasHt>0?4:0,aleas_ht:r2(aleasHt),formule:`${r2(laborHours)} × ${n(d.options?.taux_horaire,52)} × ${complexiteCoef(d)}${aleasHt>0?' + 4 % aléas MO':''}`}},
      totaux:{materiaux_ht:r2(lines.reduce((s,l)=>s+l.total_ht,0)),main_oeuvre_ht_avant_aleas:r2(laborTotal),aleas_ht:r2(aleasHt),main_oeuvre_ht:r2(laborTotal+aleasHt),total_ht:r2(ht),taux_tva:tvaRate,tva:r2(tva),total_ttc:r2(ht+tva)},
      stock_status:{connecte:false,disponible:null,statut:'non_connecte',message:approvisionnement.message_stock},
      approvisionnement,
      recommandations:reco,
      nomenclature_annexe2:nomenclature,
      alertes:alerts,
      finalisation_bloquee:blocking.length>0,
      blocages:blocking,
      controle_balises:controle
    };
  }

  function calculate(d){
    if(!d||d.metier!=='plombier')throw new Error('Le métier Plombier est requis');
    if(!d.nom_calcul)throw new Error('Le nom du calcul est requis');
    return d.options?.type_projet==='petits_travaux'?petits(d):complete(d);
  }
  window.SpeedArtiPlombierCurrent={calculate,previewNetwork:(d)=>computeNetwork(d,d?.installation?.equipments||[]),ANNEXE1_DEFAULTS,FORFAITS_DEFAULTS,PIPE_FALLBACK,ANNEXE2_COMPONENTS,annexe2For};
})();
