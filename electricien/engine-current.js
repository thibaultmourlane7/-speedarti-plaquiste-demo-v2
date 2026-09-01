/**
 * SpeedArti — Démo Électricien
 * Base: module Electricien existant SpeedArti.
 * Corrections: réponses Guillaume + annexes du questionnaire.
 * Aucune règle/prix manquant n'est inventé : les éléments non validés sont signalés/bloqués.
 */
(function(){
  const ROOM_PROFILES = {
    garage:      {label:"Garage", sockets:2, simple:0, vv:1, three:0, tv:0, rj45:0, special20:0, special32:0},
    escalier:    {label:"Cage escalier", sockets:1, simple:0, vv:1, three:0, extraLight:1, tv:0, rj45:0, special20:0, special32:0},
    palier:      {label:"Palier", sockets:1, simple:0, vv:1, three:0, tv:0, rj45:0, special20:0, special32:0},
    sas:         {label:"Sas", sockets:1, simple:0, vv:1, three:0, tv:0, rj45:0, special20:0, special32:0},
    tone:        {label:"T-One", sockets:0, simple:1, vv:0, three:0, tv:0, rj45:0, special20:0, special32:0},
    cave:        {label:"Cave", sockets:0, simple:1, vv:0, three:0, tv:0, rj45:0, special20:0, special32:0},
    hall:        {label:"Hall", sockets:1, simple:1, vv:0, three:0, tv:0, rj45:0, special20:0, special32:0},
    vestibule:   {label:"Vestibule", sockets:0, simple:0, vv:0, three:0, tv:0, rj45:0, special20:0, special32:0},
    wc:          {label:"WC", sockets:0, simple:1, vv:0, three:0, tv:0, rj45:0, special20:0, special32:0},
    wcHand:      {label:"WC PMR", sockets:1, simple:1, vv:0, three:0, tv:0, rj45:0, special20:0, special32:0},
    buanderie:   {label:"Buanderie", sockets:1, simple:1, vv:0, three:0, tv:0, rj45:0, special20:1, special32:0},
    cellier:     {label:"Cellier", sockets:1, simple:1, vv:0, three:0, tv:0, rj45:0, special20:1, special32:0},
    cuisine:     {label:"Cuisine", sockets:6, simple:1, vv:0, three:0, tv:1, rj45:0, special20:2, special32:1},
    sejour:      {label:"Espace de vie", sockets:7, simple:0, vv:1, three:1, tv:1, rj45:1, special20:0, special32:0},
    suite:       {label:"Suite parentale", sockets:3, simple:0, vv:1, three:0, tv:1, rj45:1, special20:0, special32:0},
    dressing:    {label:"Dressing", sockets:1, simple:1, vv:0, three:0, tv:0, rj45:0, special20:0, special32:0},
    sde:         {label:"Salle d'eau", sockets:1, simple:2, vv:0, three:0, tv:0, rj45:0, special20:0, special32:0},
    degagement:  {label:"Dégagement", sockets:1, simple:0, vv:1, three:0, tv:0, rj45:0, special20:0, special32:0},
    chambre:     {label:"Chambre", sockets:3, simple:1, vv:0, three:0, tv:1, rj45:1, special20:0, special32:0},
    bureau:      {label:"Bureau", sockets:3, simple:1, vv:0, three:0, tv:1, rj45:1, special20:0, special32:0},
    sdb:         {label:"Salle de bains", sockets:1, simple:2, vv:0, three:0, tv:0, rj45:0, special20:0, special32:0}
  };

  const HEATING = [
    {max:2250, section:1.5, breaker:10},
    {max:4500, section:2.5, breaker:20},
    {max:5750, section:4, breaker:25},
    {max:7250, section:6, breaker:32}
  ];

  const SOMFY = {
    tahoma: {label:"TaHoma Switch", material:150, hours:.5},
    izymo: {label:"Micro-module Izymo io", material:70, hours:.75},
    izymoProg: {label:"Izymo io + programmation TaHoma", material:70, hours:1},
    alarm: {label:"Home Alarm Essential", material:450, hours:2},
    outdoorCam: {label:"Somfy Outdoor Camera", material:200, hours:1.5},
    indoorCam: {label:"Somfy Indoor Camera", material:130, hours:1},
    visioSomfy: {label:"Visiophone V350/V500 Connect", material:400, hours:2.5},
    connectedLight: {label:"Récepteur/commande éclairage Somfy", material:90, hours:1},
    zigbee: {label:"Prise Zigbee Somfy", material:42, hours:.25},
    ioPlug: {label:"Prise ON/OFF io", material:62, hours:.25},
    programming: {label:"Programmation TaHoma", material:0, hours:1}
  };

  const FIXED = {
    bell: {carillon:170, visio:500, visioGate:750},
    vmc: {auto:600, hygro:800, double:3500, extraMouth:115, roof:90}
  };

  function n(v){ const x=Number(v); return Number.isFinite(x)?x:0; }
  function ceilDiv(a,b){ return b>0 ? Math.ceil(a/b) : 0; }
  function pushMany(arr, count, factory){ for(let i=0;i<count;i++) arr.push(factory(i)); }

  function computeAutoPoints(state){
    const rooms=state.rooms||{};
    let generalSockets=0, kitchenSockets=0, simple=0, vv=0, three=0, extraLight=0;
    let tv=0, rjFromProfiles=0, autoSpecial20=0, autoSpecial32=0;
    Object.entries(ROOM_PROFILES).forEach(([key,p])=>{
      const count=n(rooms[key]);
      if(!count) return;
      let sockets=p.sockets||0;
      if(key==="sejour"){
        const surf=n(rooms.sejourSurface);
        sockets = surf>0 && surf<28 ? 5 : 7; // annexe 2
      }
      if(key==="cuisine"){
        const surf=n(rooms.cuisineSurface);
        sockets = surf>0 && surf<4 ? 3 : 6; // annexe 2
        kitchenSockets += sockets*count;
      } else {
        generalSockets += sockets*count;
      }
      simple += (p.simple||0)*count;
      vv += (p.vv||0)*count;
      three += (p.three||0)*count;
      extraLight += (p.extraLight||0)*count;
      tv += (p.tv||0)*count;
      rjFromProfiles += (p.rj45||0)*count;
      autoSpecial20 += (p.special20||0)*count;
      autoSpecial32 += (p.special32||0)*count;
    });

    // Annexe 2 : +2 prises près des prises de communication, en priorité dans le séjour.
    const multimediaSockets = n(rooms.sejour)>0 ? 2 : 0;
    generalSockets += multimediaSockets;

    // Annexe 2 RJ45 : T1=2, T2=3, T3+=4. 2 juxtaposées dans le séjour.
    const principalRooms = Math.max(1, n(rooms.sejour)+n(rooms.suite)+n(rooms.chambre)+n(rooms.bureau));
    const rjNorm = principalRooms<=1 ? 2 : principalRooms===2 ? 3 : 4;
    const rj45 = Math.max(rjFromProfiles, rjNorm);

    const lightPoints = simple + vv + three + extraLight;
    const switches = simple + (vv*2) + (three*3);

    return {
      generalSockets, kitchenSockets, multimediaSockets,
      lightPoints, switches, simple, vv, three, extraLight,
      rj45, tv, autoSpecial20, autoSpecial32,
      communicationCabinet: (rj45+tv)>0 ? 1 : 0,
      principalRooms
    };
  }

  function effectivePoints(state){
    const a=computeAutoPoints(state), o=state.pointOverrides||{};
    const val=(key,auto)=> o[key]===null || o[key]===undefined || o[key]==="" ? auto : n(o[key]);
    return {
      ...a,
      generalSockets:val("generalSockets",a.generalSockets),
      kitchenSockets:val("kitchenSockets",a.kitchenSockets),
      lightPoints:val("lightPoints",a.lightPoints),
      switches:val("switches",a.switches),
      rj45:val("rj45",a.rj45),
      tv:val("tv",a.tv)
    };
  }

  function buildCircuits(state, points, alerts, blockers){
    const circuits=[];
    const phase=state.installation.phase||"monophase";
    const socketMode=state.circuits.socketMode||"2.5_20";
    const socketCfg = socketMode==="1.5_16"
      ? {section:1.5, breaker:16, max:8}
      : {section:2.5, breaker:20, max:12};

    pushMany(circuits, ceilDiv(points.generalSockets,socketCfg.max), i=>({
      name:`Prises générales ${i+1}`, type:"prises", section:socketCfg.section, breaker:socketCfg.breaker,
      diff:"AC/A", supply:"mono", points:Math.min(socketCfg.max,Math.max(0,points.generalSockets-i*socketCfg.max))
    }));
    pushMany(circuits, ceilDiv(points.kitchenSockets,6), i=>({
      name:`Prises cuisine ${i+1}`, type:"cuisine", section:2.5, breaker:20, diff:"AC/A",
      supply:"mono", points:Math.min(6,Math.max(0,points.kitchenSockets-i*6))
    }));
    pushMany(circuits, ceilDiv(points.lightPoints,8), i=>({
      name:`Éclairage ${i+1}`, type:"eclairage", section:1.5, breaker:16, diff:"AC/A",
      supply:"mono", points:Math.min(8,Math.max(0,points.lightPoints-i*8))
    }));

    // Besoins spécialisés issus de l'annexe 1, sans inventer l'équipement exact.
    pushMany(circuits, points.autoSpecial20, i=>({
      name:`Circuit spécialisé 20A annexe pièce ${i+1}`, type:"special", section:2.5, breaker:20,
      diff:"AC/A", supply:"mono", points:1
    }));
    pushMany(circuits, points.autoSpecial32, i=>({
      name:`Circuit spécialisé 32A annexe pièce ${i+1}`, type:"special", section:6, breaker:32,
      diff:"A", supply:"mono", points:1
    }));

    const c=state.circuits||{};
    const dedicated = [
      ["four","Four",2.5,20,"AC/A"],
      ["laveLinge","Lave-linge",2.5,20,"A"],
      ["laveVaisselle","Lave-vaisselle",2.5,20,"AC/A"],
      ["secheLinge","Sèche-linge",2.5,20,"AC/A"],
      ["chauffeEau","Chauffe-eau",2.5,20,"AC/A"],
      ["congelateur","Congélateur",2.5,20,"AC/A/F recommandé"],
      ["priseGTL","Prise GTL",2.5,20,"AC/A"]
    ];
    dedicated.forEach(([key,label,section,breaker,diff])=>{
      if(c[key]) circuits.push({name:label,type:"special",section,breaker,diff,supply:"mono",points:1});
    });

    if(c.volets>0){
      circuits.push({name:"Volets roulants",type:"special",section:1.5,breaker:16,diff:"AC/A",supply:"mono",points:n(c.volets)});
    }
    if(c.vmcType && c.vmcType!=="none"){
      circuits.push({name:"VMC",type:"vmc",section:1.5,breaker:2,diff:"AC/A",supply:"mono",points:1});
    }

    const heatingPower=n(c.heatingPower);
    if(heatingPower>0){
      const cfg=HEATING.find(x=>heatingPower<=x.max);
      if(cfg){
        circuits.push({name:`Chauffage ${heatingPower} W`,type:"chauffage",section:cfg.section,breaker:cfg.breaker,diff:"AC/A",supply:"mono",points:1});
      } else {
        blockers.push("Chauffage > 7 250 W : étude adaptée requise (10 mm² / 40-50 A selon installation).");
      }
    }

    function manualCircuit(flag,key,label,diffDefault){
      if(!flag) return;
      const m=c[key]||{};
      if(!n(m.section)||!n(m.breaker)){
        blockers.push(`${label} : section et protection à saisir selon fabricant.`);
        return;
      }
      circuits.push({
        name:label,type:"manual",section:n(m.section),breaker:n(m.breaker),
        diff:m.diff||diffDefault||"Selon fabricant", supply:m.supply||"mono", points:1, manual:true
      });
    }
    manualCircuit(c.pac,"pacManual","PAC","F selon configuration");
    manualCircuit(c.clim,"climManual","Climatisation","F selon configuration");
    manualCircuit(c.gainable,"gainableManual","Gainable","Selon fabricant");
    manualCircuit(c.tone,"toneManual","T.One","Selon fabricant");
    manualCircuit(c.irve,"irveManual","IRVE","Selon borne");
    manualCircuit(c.pv,"pvManual","Raccordement photovoltaïque","Selon étude");

    if(n(c.exteriorLights)>0 || n(c.exteriorSockets)>0){
      alerts.push("Éclairage / prises extérieurs : quantités prises en compte, mais règle de protection extérieure non fournie dans les annexes — validation requise avant commande.");
    }

    if(phase==="triphase"){
      let leg=0;
      circuits.forEach(ci=>{
        if(ci.supply==="3P") ci.phase="L1/L2/L3";
        else { ci.phase=["L1","L2","L3"][leg%3]; leg++; }
      });
      alerts.push("Triphasé : circuits monophasés répartis sur L1/L2/L3. La majoration exacte de temps/prix du tableau n'est pas validée et n'est pas inventée.");
    } else {
      circuits.forEach(ci=>ci.phase="L1");
    }
    return circuits;
  }

  function computeMaterials(state, points, circuits, alerts, blockers){
    const materials=[];
    const distance=n(state.installation.distanceMean);
    if(!distance){
      blockers.push("Longueur de fils/gaines : coefficient surface → distance moyenne non fourni. Saisir une distance moyenne manuelle pour calculer les métrés.");
    }
    const sectionMeters={};
    let gaine=0;
    if(distance){
      circuits.forEach(ci=>{
        // H07VU: phase + neutre + terre = 3 longueurs pour circuits 1,5/2,5.
        if(ci.section===1.5 || ci.section===2.5){
          sectionMeters[ci.section]=(sectionMeters[ci.section]||0)+(distance*3);
          gaine += distance;
        } else {
          materials.push({
            category:"Câblage",
            name:`Câble circuit ${ci.name} — ${ci.section} mm²`,
            qty:distance, unit:"ml", price:null,
            note: ci.supply==="3P" ? "Nombre de conducteurs à confirmer selon appareil" : "Parcours estimé"
          });
          gaine += distance;
        }
      });
      Object.entries(sectionMeters).forEach(([section,qty])=>{
        materials.push({
          category:"Câblage", name:`Conducteurs H07VU ${section} mm²`,
          qty:Math.ceil(qty), unit:"ml", price:null,
          note:"Base phase + neutre + terre. Conducteurs de commande supplémentaires non automatisés faute de règle."
        });
      });
      materials.push({category:"Gaines",name:"Gaine ICTA — parcours estimatif",qty:Math.ceil(gaine),unit:"ml",price:null,note:"Aucune marge supplémentaire appliquée (réponse Guillaume)."});
      alerts.push("Métré H07VU : base de 3 conducteurs comptée. Les conducteurs supplémentaires de commande (va-et-vient / 3 points) restent à vérifier manuellement.");
    }

    if(points.generalSockets>0) materials.push({category:"Appareillage",name:"Prises 16A 2P+T — générales",qty:points.generalSockets,unit:"u",price:null});
    if(points.kitchenSockets>0) materials.push({category:"Appareillage",name:"Prises cuisine",qty:points.kitchenSockets,unit:"u",price:null});
    if(points.switches>0) materials.push({category:"Appareillage",name:"Commandes / interrupteurs",qty:points.switches,unit:"u",price:null});
    if(points.rj45>0) materials.push({category:"Communication",name:"Prises RJ45",qty:points.rj45,unit:"u",price:null});
    if(points.tv>0) materials.push({category:"Communication",name:"Prises TV / antenne",qty:points.tv,unit:"u",price:null});
    if(points.communicationCabinet) materials.push({category:"Communication",name:"Coffret de communication",qty:1,unit:"u",price:null});

    circuits.forEach(ci=>{
      materials.push({category:"Protection",name:`Disjoncteur ${ci.breaker}A — ${ci.name}`,qty:1,unit:"u",price:null,note:`Différentiel ${ci.diff}`});
    });

    if(state.tableau.ground){
      materials.push({category:"Mise à la terre",name:"Câblette cuivre",qty:20,unit:"ml",price:null});
      materials.push({category:"Mise à la terre",name:"Piquet de terre",qty:1,unit:"u",price:null});
    }
    if(state.tableau.parafoudre) materials.push({category:"Protection",name:"Parafoudre Type 2",qty:1,unit:"u",price:null});
    return materials;
  }

  function computeTableau(state,circuits){
    const aCount=circuits.filter(c=>String(c.diff).startsWith("A") || c.diff==="A").length;
    const others=Math.max(0,circuits.length-aCount);
    // Conservé de la logique actuelle : groupes de 8 circuits.
    const diffA=aCount ? Math.max(1,ceilDiv(aCount,8)) : 0;
    const diffAC=others ? Math.max(1,ceilDiv(others,8)) : 0;
    const autoRows=Math.max(1,ceilDiv(circuits.length,13)); // continuité de la logique actuelle 13 modules/rangée
    const rows=n(state.tableau.rows)||autoRows;
    return {circuits:circuits.length,diffA,diffAC,rows,brand:state.tableau.brand||"indifferent"};
  }

  function computeLabor(state,points,circuits,alerts,blockers){
    const rate=n(state.pricing.hourlyRate)||55; // valeur existante du module, modifiable
    let hours=0;
    const detail=[];
    const add=(label,h)=>{ if(h>0){ hours+=h; detail.push({label,hours:h}); } };
    const installType=state.installation.type||"neuf";

    if(installType==="neuf"){
      add("Création prises",points.generalSockets*.5 + points.kitchenSockets*.5);
      add("Création commandes / interrupteurs",points.switches*.5);
      add("Création points lumineux",points.lightPoints*.5);
      add("Création RJ45",points.rj45*.5);
      add("Création TV",points.tv*.5);
    } else {
      const r=state.renovation||{};
      ["prises","interrupteurs","luminaires","rj45","tv"].forEach(key=>{
        const x=r[key]||{};
        const create=n(x.create), replace=n(x.replace), move=n(x.move), remove=n(x.remove);
        // Remplacement/déplacement = dépose 15 min + création 30 min.
        add(`${key} — créations`,create*.5);
        add(`${key} — remplacements`,replace*(.25+.5));
        add(`${key} — déplacements`,move*(.25+.5));
        add(`${key} — déposes seules`,remove*.25);
      });
      if(state.tableau.replaceExisting){
        add("Dépose tableau existant",3);
      }
      if(n(r.gaineManualHours)>0) add("Dépose / repassage gaines — temps artisan",n(r.gaineManualHours));
    }

    // Les forfaits VMC/sonnette intègrent déjà la main-d'œuvre : pas de double comptage.
    const fixedTypes=new Set(["vmc"]);
    const specialized=circuits.filter(c=>!["prises","cuisine","eclairage","vmc"].includes(c.type)).length;
    add("Raccordement circuits spécialisés",specialized*1);

    add("Pose / raccordement tableau",6);
    if(state.tableau.ground) add("Mise à la terre",2);
    add("Tests / mise en service",1.5);

    if(state.options.complexity && state.options.complexity!=="moyenne"){
      alerts.push(`Complexité "${state.options.complexity}" conservée, mais aucun coefficient exact n'a été validé : aucune majoration automatique appliquée.`);
    }
    if(state.options.support && state.options.support!=="placo_neuf"){
      alerts.push("Type de support pris en compte comme information chantier, mais les multiplicateurs exacts ne sont pas validés : aucune majoration inventée.");
    }
    if(state.installation.phase==="triphase"){
      blockers.push("Tableau triphasé : temps supplémentaire d'équilibrage reconnu par Guillaume, mais coefficient exact non fourni. Total de main-d'œuvre affiché hors majoration triphasée.");
    }

    return {hours,rate,total:hours*rate,detail};
  }

  function computeFixedServices(state){
    const rows=[]; let total=0;
    const c=state.circuits||{};
    if(c.bellType && c.bellType!=="none"){
      const price=FIXED.bell[c.bellType];
      const labels={carillon:"Carillon simple",visio:"Visiophone sans ouverture",visioGate:"Visiophone avec commande portail/portillon"};
      rows.push({label:labels[c.bellType],price}); total+=price;
    }
    if(c.vmcType && c.vmcType!=="none"){
      const price=FIXED.vmc[c.vmcType];
      const labels={auto:"VMC simple flux autoréglable",hygro:"VMC simple flux hygroréglable",double:"VMC double flux"};
      rows.push({label:labels[c.vmcType],price}); total+=price;
      const extra=n(c.vmcExtraMouths);
      if(extra){ const p=extra*FIXED.vmc.extraMouth; rows.push({label:`${extra} bouche(s) VMC supplémentaire(s)`,price:p}); total+=p; }
      if(c.vmcRoof){ rows.push({label:"Sortie toiture VMC",price:FIXED.vmc.roof}); total+=FIXED.vmc.roof; }
    }

    const d=state.domotique||{};
    Object.entries(SOMFY).forEach(([key,item])=>{
      const qty=n(d[key]);
      if(!qty) return;
      const price=(item.material + item.hours*(n(state.pricing.hourlyRate)||55))*qty;
      rows.push({label:`${item.label} × ${qty}`,price,indicative:true}); total+=price;
    });
    return {rows,total};
  }

  function normAlerts(state,points,alerts){
    if(state.installation.type!=="renovation") return;
    const r=state.renovation||{};
    function kept(key){ const x=r[key]||{}; return n(x.keep)+n(x.replace)+n(x.move)+n(x.create); }
    const currentSockets=kept("prises");
    if(currentSockets && currentSockets<points.generalSockets+points.kitchenSockets){
      alerts.push(`Rénovation : prises finales (${currentSockets}) sous le besoin AUTO (${points.generalSockets+points.kitchenSockets}).`);
    }
    const currentRj=kept("rj45");
    if(currentRj && currentRj<points.rj45) alerts.push(`Rénovation : RJ45 finales (${currentRj}) sous le besoin AUTO (${points.rj45}).`);
    const currentTv=kept("tv");
    if(currentTv && currentTv<points.tv) alerts.push(`Rénovation : prises TV finales (${currentTv}) sous le besoin AUTO (${points.tv}).`);
  }

  function calculate(state){
    const alerts=[], blockers=[];
    const points=effectivePoints(state);
    const circuits=buildCircuits(state,points,alerts,blockers);
    const tableau=computeTableau(state,circuits);
    const materials=computeMaterials(state,points,circuits,alerts,blockers);
    const labor=computeLabor(state,points,circuits,alerts,blockers);
    const fixed=computeFixedServices(state);
    normAlerts(state,points,alerts);

    if(state.tableau.consuel) blockers.push("Consuel sélectionné : forfait HT non fourni par Guillaume, non chiffré.");
    if(state.tableau.diagnostic) blockers.push("Diagnostic électrique sélectionné : forfait HT non fourni par Guillaume, non chiffré.");
    if(materials.some(m=>m.price===null)) alerts.push("Prix matériaux généraux : liaison au catalogue SpeedArti requise. Aucun prix n'est inventé dans la démo.");

    return {
      points,circuits,tableau,materials,labor,fixed,
      knownTotal: labor.total+fixed.total,
      alerts:[...new Set(alerts)],
      blockers:[...new Set(blockers)],
      pricingComplete: blockers.length===0 && !materials.some(m=>m.price===null)
    };
  }

  window.ElectricienEngine={
    ROOM_PROFILES,HEATING,SOMFY,FIXED,computeAutoPoints,effectivePoints,calculate
  };
})();