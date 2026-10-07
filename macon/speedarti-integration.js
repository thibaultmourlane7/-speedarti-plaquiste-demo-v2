// Contrat de raccordement du module Maçon à SpeedArti.
// Démo uniquement : aucune connexion Supabase/API, aucun accès production.
// Les chemins ci-dessous ont été vérifiés en lecture seule dans GSTAI-Sp/speedarti-v2.

export const SPEEDARTI_MACON_INTEGRATION_VERSION='MACON-INTEGRATION-v1';

export const SPEEDARTI_MACON_CONNECTORS=Object.freeze({
  parametres:{
    status:'prepared',
    source:'parametres_utilisateur',
    code:'src/services/parametres/parametresBaseService.ts',
    fields:['taux_horaire','taux_par_metier','nb_ouvriers_defaut','statut_juridique']
  },
  catalogue:{
    status:'prepared',
    code:'src/services/chiffrage/integration/catalogueIntegration.ts',
    priority:['catalogue personnel','catalogue fournisseur','catalogue standard','prix à confirmer']
  },
  stocks:{
    status:'prepared',
    code:'src/services/chiffrage/integration/stockIntegration.ts',
    purpose:'Disponibilité et quantités après calcul, sans modifier le moteur métier.'
  },
  client:{
    status:'prepared',
    table:'clients',
    purpose:'Rattacher le chiffrage à un client existant ou futur.'
  },
  chantier:{
    status:'prepared',
    table:'chantiers',
    purpose:'Rattacher ou créer le chantier depuis le chiffrage.'
  },
  satellite:{
    status:'prepared',
    code:'src/components/chiffrage/ChiffrageWizard.tsx',
    input:'location.state.fromSatellite + mesures surface/perimetre/distance'
  },
  calepinage:{
    status:'prepared',
    code:'src/components/chiffrage/ChiffrageWizard.tsx',
    input:'location.state.fromCalepinage + calepinage'
  },
  historique:{
    status:'prepared',
    table:'calculs_chantier',
    code:'src/services/chiffrage/chiffrageService.ts'
  },
  devis:{
    status:'prepared',
    code:'src/services/chiffrage/integration/devisIntegration.ts',
    tables:['devis','devis_lignes']
  },
  tva:{
    status:'prepared',
    code:'src/services/chiffrage/tva/tvaService.ts',
    note:'Le contexte chantier doit rester distinct du statut fiscal de l’entreprise.'
  },
  angel:{
    status:'prepared',
    code:['src/services/angel/angelChatService.ts','src/services/angel/toolExecutor.ts'],
    purpose:'Fournir le contexte courant du chiffrage et les sources de prix/règles.'
  }
});

function cloneLine(line){
  return {
    id:line.id,
    description:line.name,
    categorie:line.category,
    quantite:Number(line.qty||0),
    unite:line.unit,
    prix_unitaire_ht:Number(line.price||0),
    mode_prix:line.priceMode,
    source_prix:line.source||'',
    reference_catalogue:line.catalogueSelection||line.catalogueResolution?.product?.referenceCatalogue||null,
    a_confirmer:line.priceMode==='required'&&!(Number(line.price)>0)
  };
}

export function buildSpeedArtiMaconPayload(state,result){
  const r=result||{};
  return {
    schema:SPEEDARTI_MACON_INTEGRATION_VERSION,
    metier:'maçon',
    source:'speedarti-macon-demo',
    integration_status:'prepared-not-connected',
    chantier_context:{
      mode:state?.mode||'simple',
      type_ouvrage:state?.simpleType||null,
      simple:state?.simple||{},
      elements:state?.elements||[]
    },
    parametres_artisan:{
      taux_horaire:Number(r.hourly||0),
      nb_ouvriers:Number(r.workers||1),
      future_source:'parametres_utilisateur / taux_par_metier'
    },
    tva:{
      context:state?.taxContext||{},
      taux:Number(r.vat||0),
      future_service:'tvaService.detecterTauxTVA'
    },
    angel_context:{
      step:Number(state?.step||0),
      mode:state?.mode||'simple',
      type_ouvrage:state?.simpleType||null,
      prix_a_confirmer:(r.missingPrices||[]).map(x=>x.id)
    },
    lignes:(r.lines||[]).map(cloneLine),
    main_oeuvre:{
      heures_homme:Number(r.hours||0),
      duree_estimee_heures:Number(r.duration||0),
      cout_ht:Number(r.laborCost||0),
      decomposition:(r.labor||[]).map(x=>({poste:x.name,heures_homme:Number(x.hours||0),incluse_prix_manuel:!!x.includedInManual}))
    },
    totaux:{
      materiaux_ht:Number(r.materials||0),
      main_oeuvre_ht:Number(r.laborCost||0),
      total_ht:Number(r.totalHT||0),
      tva:Number(r.tax||0),
      total_ttc:Number(r.ttc||0)
    },
    raccordements:{
      client_id:null,
      chantier_id:null,
      calcul_id:null,
      devis_id:null,
      satellite:null,
      calepinage:null
    }
  };
}

export function getIntegrationReadiness(){
  return Object.entries(SPEEDARTI_MACON_CONNECTORS).map(([id,c])=>({id,status:c.status}));
}

export const SpeedArtiMaconIntegration=Object.freeze({
  version:SPEEDARTI_MACON_INTEGRATION_VERSION,
  connectors:SPEEDARTI_MACON_CONNECTORS,
  buildPayload:buildSpeedArtiMaconPayload,
  readiness:getIntegrationReadiness
});

if(typeof globalThis!=='undefined')globalThis.SpeedArtiMaconIntegration=SpeedArtiMaconIntegration;
