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

  function r2(n){return Math.round((Number(n)||0)*100)/100}
  function n(v,d=0){const x=Number(v);return Number.isFinite(x)?x:d}
  function line(id,nom,price,qty=1,unit='unité',category='Prestation',extra={}){
    return {article_id:id,nom,categorie:category,quantite_theorique:qty,quantite_avec_perte:qty,quantite_finale:qty,unite:unit,prix_unitaire_ht:r2(price),total_ht:r2(price*qty),stock_disponible:0,a_commander:extra.stockable?qty:0,coef_perte_applique:1,...extra};
  }
  function defaults(d,key,fallback){return n(d.settings?.[key],fallback)}
  function annexPrice(d,key){return n(d.settings?.annexe1?.[key],ANNEXE1_DEFAULTS[key]?.price||0)}
  function forfaitPrice(d,key){return n(d.settings?.forfaits?.[key],FORFAITS_DEFAULTS[key]?.price||0)}
  function gammeCoef(d){return GAMME[d.options?.gamme]||1}
  function complexiteCoef(d){return COMPLEXITE[d.options?.complexite]||1}

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

  function buildEquipment(eq,d,alerts,reco){
    const out=[]; const def=equipmentDefaults(eq); const coef=gammeCoef(d);
    const isUnitForfait=eq.kind==='lave_linge'||eq.kind==='lave_vaisselle';
    const basePrice=n(eq.price_ht,def.price);
    let price=basePrice;
    if(!isUnitForfait && basePrice>0)price=basePrice*coef;
    const baseTime=n(eq.time_h,def.time);
    let time=baseTime;
    if(eq.kind==='douche'&&eq.subtype==='italienne')time*=1.4;
    const label=def.label||labelFor(eq);
    if(price<=0){alerts.push(`Prix catalogue manquant pour « ${label} ». La finalisation doit demander un prix manuel.`)}
    if(time<=0 && !isUnitForfait){alerts.push(`Temps de pose manquant pour « ${label} ». Le traceur doit remonter cette donnée.`)}
    if(price>0)out.push(line(`equip_${eq.id}`,label,price,1,'unité',isUnitForfait?'Prestation unitaire':'Sanitaire',{source:basePrice===def.price?'défaut SpeedArti / Guillaume':'saisie artisan'}));
    if(eq.kind==='douche'){
      [['mitigeur','Mitigeur de douche'],['colonne','Colonne de douche'],['paroi','Paroi de douche']].forEach(([key,name])=>{
        if(eq[key]){
          const op=n(eq[`${key}_price_ht`],0),ot=n(eq[`${key}_time_h`],0);
          if(op>0)out.push(line(`douche_${eq.id}_${key}`,name,op,1,'unité','Option sanitaire',{source:'catalogue / saisie'})); else alerts.push(`Prix catalogue manquant pour « ${name} ».`);
          if(ot>0)time+=ot; else alerts.push(`Temps de pose manquant pour « ${name} ».`);
        }
      });
    }
    if(eq.kind==='baignoire'&&eq.colonne){
      const op=n(eq.colonne_price_ht,0),ot=n(eq.colonne_time_h,0);
      if(op>0)out.push(line(`baignoire_${eq.id}_colonne`,'Colonne / ensemble douche baignoire',op,1,'unité','Option sanitaire',{source:'catalogue / saisie'})); else alerts.push('Prix catalogue manquant pour la colonne de baignoire.');
      if(ot>0)time+=ot; else alerts.push('Temps de pose manquant pour la colonne de baignoire.');
    }
    if(eq.pmr_wc&&eq.kind==='wc')out.push(line(`pmr_wc_${eq.id}`,'Forfait PMR WC',300,1,'forfait','Forfait complet'));
    if(eq.pmr_douche&&eq.kind==='douche')out.push(line(`pmr_douche_${eq.id}`,'Forfait PMR douche',300,1,'forfait','Forfait complet'));
    if(eq.kind==='douche'&&eq.subtype==='italienne'&&eq.spec_mode){
      const surface=n(eq.spec_surface_m2,0);
      const rates={spec:16,natte:43,chape:54};
      const names={spec:'SPEC sous carrelage',natte:'SPEC + natte d’étanchéité',chape:'Chape de forme douche'};
      const rate=rates[eq.spec_mode]||0;
      if(surface>0&&rate>0)out.push(line(`douche_${eq.id}_${eq.spec_mode}`,names[eq.spec_mode],rate,surface,'m²','Prestation fourniture + MO',{includes_labor:true}));
      else alerts.push(`Surface manquante pour la prestation ${names[eq.spec_mode]||'douche italienne'}.`);
    }
    return {lines:out,time,profile:connectionProfile(eq)};
  }

  function computeNetwork(d,equipments){
    const net=d.installation?.network||{};
    let efPoints=0,ecPoints=0,evacPoints=0;
    equipments.forEach(eq=>{const p=connectionProfile(eq);if(p.ef)efPoints++;if(p.ec)ecPoints++;if(p.evac)evacPoints++});
    const ann=d.installation?.annexe1||{};
    const waitRdc=n(ann.attente_rdc,0),waitR1=n(ann.attente_r1,0);
    efPoints+=waitRdc+waitR1+n(net.ef_only,0)+n(net.ef_ec,0)+n(net.platines_ef,0)+n(net.platines_ef_ec,0);
    ecPoints+=waitRdc+waitR1+n(net.ec_only,0)+n(net.ef_ec,0)+n(net.platines_ec,0)+n(net.platines_ef_ec,0);
    evacPoints+=n(net.evac_points,0)+n(net.platines_evac,0);
    const autoEF=efPoints*8;
    const autoEC=ecPoints*8+n(net.distance_ce_sdb,5)+n(net.distance_ce_cuisine,8);
    const autoEvac=evacPoints*1;
    const ef=net.manual_ef_ml!==undefined&&net.manual_ef_ml!==null&&net.manual_ef_ml!==''?n(net.manual_ef_ml):autoEF;
    const ec=net.manual_ec_ml!==undefined&&net.manual_ec_ml!==null&&net.manual_ec_ml!==''?n(net.manual_ec_ml):autoEC;
    const evac=net.manual_evac_ml!==undefined&&net.manual_evac_ml!==null&&net.manual_evac_ml!==''?n(net.manual_evac_ml):autoEvac;
    return {efPoints,ecPoints,evacPoints,autoEF,autoEC,autoEvac,ef,ec,evac};
  }

  function applyAnnexe1(d,lines,alerts){
    const a=d.installation?.annexe1||{};
    const qKeys=['attente_rdc','attente_r1','robinet_exterieur','limiteur_pression'];
    qKeys.forEach(key=>{const qty=n(a[key],0);if(qty>0){const cfg=ANNEXE1_DEFAULTS[key];lines.push(line(`ann1_${key}`,cfg.label,annexPrice(d,key),qty,cfg.unit,cfg.mode==='unitaire'?'Prestation unitaire':'Forfait complet',{source:'Annexe 1 Guillaume'}))}});
    const toggleKeys=['arret_general','raccordement_exterieur','ventilation_wc','ventilation_fosse','forfait_etage'];
    toggleKeys.forEach(key=>{if(a[key]){const cfg=ANNEXE1_DEFAULTS[key];lines.push(line(`ann1_${key}`,cfg.label,annexPrice(d,key),1,cfg.unit,'Forfait complet',{source:'Annexe 1 Guillaume'}))}});
    // MLL / MLV are created by equipment instances to avoid double counting.
    return !!a.aleas;
  }

  function addGeneralForfaits(d,lines){
    const f=d.options?.forfaits||{};
    ['demolition','platrerie','raccordement','traversee','renovation','acces_difficile','boucle_ecs','pompe_relevage'].forEach(key=>{if(f[key])lines.push(line(`forfait_${key}`,FORFAITS_DEFAULTS[key].label,forfaitPrice(d,key),1,'forfait','Forfait complet',{source:'Paramètres entreprise'}))});
    if(n(f.pose_manual,0)>0)lines.push(line('forfait_pose','Forfait pose — montant artisan',n(f.pose_manual),1,'forfait','Forfait complet',{source:'saisie artisan'}));
    if(n(f.depose_manual,0)>0)lines.push(line('forfait_depose','Forfait dépose — montant artisan',n(f.depose_manual),1,'forfait','Forfait complet',{source:'saisie artisan'}));
  }

  function complete(d){
    const lines=[],alerts=[],reco=[]; const equipments=d.installation?.equipments||[];
    let laborHours=0;
    equipments.forEach(eq=>{const b=buildEquipment(eq,d,alerts,reco);lines.push(...b.lines);laborHours+=b.time});

    const network=computeNetwork(d,equipments);
    const net=d.installation?.network||{};
    const platines=n(net.platines_ef,0)+n(net.platines_ec,0)+n(net.platines_ef_ec,0)+n(net.platines_evac,0);
    if(platines>0)alerts.push(`Prix de raccordement / platine sanitaire non défini dans les réponses métier : ${platines} point(s) pris en compte pour le réseau, mais la finalisation doit demander un article catalogue ou un prix manuel.`);
    const pipe=(d.options?.type_tuyau||'per').toLowerCase();
    const pipePrice=PIPE_FALLBACK[pipe]||PIPE_FALLBACK.per;
    const totalPipe=network.ef+network.ec;
    if(totalPipe>0)lines.push(line(`tuyau_${pipe}`,`Tuyau ${pipe==='per'?'PER':pipe} — prix de secours`,pipePrice,totalPipe,'ml','Réseau',{stockable:true,source:'fallback Guillaume'}));
    if(network.evac>0)lines.push(line('evac_local','Évacuation locale estimée',0,network.evac,'ml','Réseau',{source:'composition appareil / réseau',stockable:true}));
    const fittingQty=Math.ceil((network.efPoints+network.ecPoints)*6*1.1);
    if(fittingQty>0){lines.push(line(`raccords_${pipe}`,`Raccords ${pipe} — quantité estimée`,0,fittingQty,'unité','Réseau',{stockable:true}));alerts.push(`Prix catalogue manquant pour les raccords ${pipe} : ${fittingQty} unité(s) estimée(s).`)}
    const stopValves=equipments.reduce((s,eq)=>{
      if(eq.kind==='wc'||eq.kind==='lave_linge'||eq.kind==='lave_vaisselle'||eq.kind==='lave_main')return s+1;
      if(['lavabo','meuble_vasque','douche','baignoire','evier'].includes(eq.kind))return s+2;
      return s;
    },0);
    if(stopValves>0){lines.push(line('robinets_arret','Robinets d’arrêt — selon composition appareils',0,stopValves,'unité','Réseau',{stockable:true}));alerts.push(`Prix catalogue manquant pour les robinets d’arrêt : ${stopValves} unité(s).`)}

    // Current SpeedArti reference retained until a new métier time table replaces it.
    const pipeLabor=(network.ef+network.ec+network.evac)*.15;
    laborHours+=pipeLabor;

    // ECS equipment and recommendation
    const hotCount=equipments.filter(eq=>eq.kind==='douche'||eq.kind==='baignoire').length;
    if(hotCount===1)reco.push('Chauffe-eau 150 L recommandé (simple recommandation).');
    if(hotCount>=2)reco.push('Chauffe-eau 300 L recommandé (simple recommandation).');
    if(d.options?.chauffe_eau?.enabled){
      const ce=d.options.chauffe_eau; const base=n(ce.price_ht,0); const c=gammeCoef(d);
      if(base>0)lines.push(line('chauffe_eau',`Chauffe-eau ${ce.type||''} ${ce.capacity||''} L`,base*c,1,'unité','Équipement',{source:'catalogue / saisie'}));
      else alerts.push('Prix catalogue du chauffe-eau manquant.');
      const t=n(ce.time_h,0); laborHours+=t;if(t<=0)alerts.push('Temps de pose du chauffe-eau manquant.');
    }
    if(d.options?.adoucisseur?.enabled){
      const base=Math.max(n(d.options.adoucisseur.price_ht,1000),1000); lines.push(line('adoucisseur',"Adoucisseur d'eau",base*gammeCoef(d),1,'unité','Équipement',{source:'base Guillaume / catalogue'}));
      const t=n(d.options.adoucisseur.time_h,0);laborHours+=t;if(t<=0)alerts.push("Temps de pose de l'adoucisseur manquant.");
    }

    const aleas=applyAnnexe1(d,lines,alerts);
    addGeneralForfaits(d,lines);

    const laborCoef=complexiteCoef(d);
    const laborBase=laborHours*n(d.options?.taux_horaire,52);
    const laborTotal=laborBase*laborCoef;
    let materials=lines.reduce((s,l)=>s+l.total_ht,0);
    if(aleas){const value=materials+laborTotal;lines.push(line('ann1_aleas','Aléas 4 %',value*.04,1,'forfait','Forfait complet',{source:'Annexe 1 Guillaume'}));materials=lines.reduce((s,l)=>s+l.total_ht,0)}
    const ht=materials+laborTotal;
    const tvaRate=n(d.options?.taux_tva,20);
    const tva=ht*tvaRate/100;
    const workers=Math.max(1,n(d.options?.nb_ouvriers,1));
    const surface=n(d.installation?.surface_maison_m2,0);
    if(surface>0)reco.push(`Surface maison renseignée : ${surface} m². Le code original Plombier ne contient pas encore de coefficient surface explicite ; aucune formule de surface n’a été inventée.`);
    if(!equipments.length&&(network.efPoints+network.ecPoints+network.evacPoints)===0)alerts.push('Installation complète sans sanitaire autorisée, mais aucun point réseau n’est encore renseigné.');

    return finish({d,lines,alerts,reco,laborHours,laborTotal,ht,tva,tvaRate,workers,network,mode:'Installation complète'});
  }

  function smallWorkLine(p,d,alerts,reco){
    const lines=[]; let labor=0; const type=p.type;
    if(type==='fuite'){
      lines.push(line(`diag_${p.id}`,'Diagnostic / visite recherche de fuite',150,1,'forfait','Forfait complet',{includes_labor:true}));
      const methodLabels={camera:'Caméra endoscopique',colorant:'Test au colorant',demolition:'Démolition + recherche',fumee:'Test à la fumée',exterieure:'Recherche extérieure',circuits:'Mise en évidence circuits'};
      if(!p.method)alerts.push('Choisir une méthode de recherche de fuite.');
      else if(n(p.method_price_ht,0)>0)lines.push(line(`fuite_${p.id}`,methodLabels[p.method]||'Méthode recherche de fuite',n(p.method_price_ht),1,'forfait','Forfait complet',{source:'catalogue / saisie'}));
      else alerts.push(`Prix catalogue manquant pour la méthode « ${methodLabels[p.method]||p.method} ».`);
      labor=n(p.duration_h,2);
    } else if(type==='debouchage'){
      lines.push(line(`debouchage_${p.id}`,'Débouchage — tout compris déplacement inclus',180,1,'forfait','Forfait complet',{includes_labor:true,includes_travel:true}));labor=0;
    } else if(type==='chauffe_eau'){
      const map={reparation:{label:'Réparation / nettoyage chauffe-eau',price:120,allin:true},changement_200l_elec:{label:'Changement chauffe-eau 200 L électrique',price:300},changement_300l_elec:{label:'Changement chauffe-eau 300 L électrique',price:550},ballon_thermo_air_ext:{label:'Ballon thermodynamique air extérieur',price:1550},ballon_thermo_groupe_ext:{label:'Thermodynamique groupe extérieur / sortie toit',price:2000}};
      const c=map[p.ce_type]||map.reparation; const price=n(p.price_ht,c.price);
      lines.push(line(`ce_${p.id}`,c.label,price,1,c.allin?'forfait':'unité',c.allin?'Forfait complet':'Fourniture',{includes_labor:!!c.allin,source:'Guillaume / catalogue'}));
      labor=c.allin?0:n(p.duration_h,3);
    } else if(type==='remplacement'){
      if(!p.equipment){alerts.push('Sélectionner un élément sanitaire à remplacer.');return {lines,labor}}
      const b=buildEquipment(p.equipment,d,alerts,reco);lines.push(...b.lines);labor=b.time;
    } else alerts.push('Choisir le type de prestation.');
    if(type!=='debouchage'&&type!=='remplacement'&&p.duration_h!==undefined&&p.duration_h!==null&&p.duration_h!=='')labor=n(p.duration_h,labor);
    return {lines,labor};
  }

  function petits(d){
    const lines=[],alerts=[],reco=[]; const prestations=d.petits_travaux?.prestations||[]; let laborHours=0; let includesTravel=false;
    if(!prestations.length)alerts.push('Ajouter au moins une prestation.');
    prestations.forEach(p=>{const r=smallWorkLine(p,d,alerts,reco);lines.push(...r.lines);laborHours+=r.labor;if(r.lines.some(x=>x.includes_travel))includesTravel=true});
    const f=d.options?.forfaits||{};
    if(f.deplacement&&!includesTravel)lines.push(line('forfait_deplacement','Déplacement',forfaitPrice(d,'deplacement'),1,'forfait','Forfait complet',{source:'Paramètres entreprise'}));
    addGeneralForfaits(d,lines);
    const laborTotal=laborHours*n(d.options?.taux_horaire,52)*complexiteCoef(d);
    const materials=lines.reduce((s,l)=>s+l.total_ht,0); const ht=materials+laborTotal; const rate=n(d.options?.taux_tva,20);const tva=ht*rate/100;const workers=Math.max(1,n(d.options?.nb_ouvriers,1));
    return finish({d,lines,alerts,reco,laborHours,laborTotal,ht,tva,tvaRate:rate,workers,network:null,mode:'Petits travaux'});
  }

  function finish({d,lines,alerts,reco,laborHours,laborTotal,ht,tva,tvaRate,workers,network,mode}){
    const blocking=alerts.filter(a=>/Prix catalogue manquant|Temps de pose.*manquant|Choisir|Sélectionner|aucun point réseau/i.test(a));
    return {
      mode,
      surfaces:{totale:n(d.installation?.surface_maison_m2,0),nette:0,avec_pertes:0,detail_par_face:network?{EF_ml:r2(network.ef),EC_ml:r2(network.ec),evac_ml:r2(network.evac),points_EF:network.efPoints,points_EC:network.ecPoints,points_evac:network.evacPoints}:{}},
      materiaux:lines,
      main_oeuvre:{temps_estime_heures:r2(laborHours/workers),heures_homme:r2(laborHours),decomposition:[{poste:'Main-d’œuvre calculée',temps_heures:r2(laborHours)}],taux_horaire:n(d.options?.taux_horaire,52),nombre_ouvriers:workers,coefficient_complexite:complexiteCoef(d),cout_total:r2(laborTotal)},
      totaux:{materiaux_ht:r2(lines.reduce((s,l)=>s+l.total_ht,0)),main_oeuvre_ht:r2(laborTotal),total_ht:r2(ht),taux_tva:tvaRate,tva:r2(tva),total_ttc:r2(ht+tva)},
      stock_status:{disponible:!lines.some(l=>l.stockable&&l.prix_unitaire_ht<=0),articles_manquants:lines.filter(l=>l.stockable&&l.prix_unitaire_ht<=0)},
      recommandations:reco,
      alertes:alerts,
      finalisation_bloquee:blocking.length>0,
      blocages:blocking
    };
  }

  function calculate(d){
    if(!d||d.metier!=='plombier')throw new Error('Le métier Plombier est requis');
    if(!d.nom_calcul)throw new Error('Le nom du calcul est requis');
    return d.options?.type_projet==='petits_travaux'?petits(d):complete(d);
  }
  window.SpeedArtiPlombierCurrent={calculate,ANNEXE1_DEFAULTS,FORFAITS_DEFAULTS,PIPE_FALLBACK};
})();
