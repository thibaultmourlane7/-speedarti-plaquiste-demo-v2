(function(){
  const DB=window.SpeedArtiCataloguePlombier;
  if(!DB||!Array.isArray(DB.articles)) throw new Error('Catalogue Plombier Téréva non chargé');
  const ARTICLES=DB.articles;
  const norm=s=>String(s??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
  const CONTEXT_TYPES={
    all:null,
    wc:['WC / pack WC','Cuvette WC','Bâti-support','Urinoir','Abattant WC','Coin toilettes'],
    wc_poser:['WC / pack WC','Cuvette WC','Coin toilettes'],
    wc_suspendu:['WC / pack WC','Cuvette WC','Bâti-support','Coin toilettes'],
    urinoir:['Urinoir','Coin toilettes'],
    douche:['Douche','Receveur de douche','Hydrothérapie'],
    receveur:['Receveur de douche','Douche'],
    mitigeur_douche:['Mitigeur','Robinetterie de salle de bains','Douche'],
    colonne_douche:['Colonne de douche','Hydrothérapie','Pomme / douchette'],
    paroi_douche:['Paroi de douche','Douche'],
    baignoire:['Baignoire','Bain'],
    lavabo:['Lavabo','Vasque','Lavabo - Vasque - Bidet - Evacuation sanitaire'],
    meuble_vasque:['Meuble salle de bains','Meuble de salles de bains','Vasque'],
    lave_main:['Lavabo','Vasque','Collectivité'],
    evier:['Évier','Cuisine et robinetterie','Plonge'],
    chauffe_eau:['Chauffe-eau','Eau chaude sanitaire'],
    adoucisseur:['Adoucisseur / traitement eau','Qualité de l’eau - Piscine'],
    raccord:['Raccord','Coude','Té / dérivation','Manchon','Collecteur'],
    raccord_per:['Raccord','Coude','Té / dérivation','Manchon','Collecteur'],
    raccord_multicouche:['Raccord','Coude','Té / dérivation','Manchon','Collecteur'],
    raccord_cuivre:['Raccord','Coude','Té / dérivation','Manchon','Collecteur'],
    platine:null,
    robinet_arret:['Vanne','Robinet','Vanne, robinet et protection'],
    evacuation:['PVC','Fonte évacuation','Siphon','Bonde / vidage'],
    element_specifique:null
  };
  const contextTypes=ctx=>CONTEXT_TYPES[ctx]||null;
  function inContext(a,ctx){
    const searchable=norm([a.famille,a.type,a.produit,a.variante,a.finition].filter(Boolean).join(' '));
    if(ctx==='platine')return searchable.includes('platine');
    if(ctx==='raccord_per'||ctx==='raccord_multicouche'||ctx==='raccord_cuivre'){
      const types=CONTEXT_TYPES.raccord;if(!types.includes(a.type))return false;
      if(ctx==='raccord_per')return /(^| )per( |$)/.test(searchable);
      if(ctx==='raccord_multicouche')return searchable.includes('multicouche')&&!/(^| )per( |$)/.test(searchable);
      return searchable.includes('cuivre')||searchable.includes('laiton')||searchable.includes('bicone');
    }
    const types=contextTypes(ctx);if(!types)return true;
    return types.includes(a.type);
  }
  function search(opts={}){
    const q=norm(opts.q||''),brand=norm(opts.brand||''),type=norm(opts.type||''),finish=norm(opts.finish||'');
    const tokens=q?q.split(/\s+/).filter(Boolean):[];const ctx=opts.context||'all';const limit=Math.max(1,Math.min(100,Number(opts.limit)||30));
    const scored=[];
    for(let i=0;i<ARTICLES.length;i++){
      const a=ARTICLES[i];if(!inContext(a,ctx))continue;
      if(brand&&norm(a.marque)!==brand)continue;if(type&&norm(a.type)!==type)continue;if(finish&&norm(a.finition)!==finish)continue;
      const code=norm(a.code),ref=norm(a.ref_fab),marque=norm(a.marque),typ=norm(a.type),prod=norm(a.produit),vari=norm(a.variante),fin=norm(a.finition),fam=norm(a.famille);
      const hay=`${code} ${ref} ${marque} ${typ} ${prod} ${vari} ${fin} ${fam}`;
      if(tokens.length&&!tokens.every(t=>hay.includes(t)))continue;
      let score=0;
      if(q){if(code===q)score+=1000;if(ref===q)score+=900;if(prod===q)score+=600;if(prod.startsWith(q))score+=250;if(marque.startsWith(q))score+=120;for(const t of tokens){if(code.includes(t))score+=80;if(ref.includes(t))score+=70;if(prod.includes(t))score+=30;if(typ.includes(t))score+=20;if(marque.includes(t))score+=15;if(vari.includes(t)||fin.includes(t))score+=10;}}
      if(a.prix!=null)score+=3;if(a.marque&&a.marque!=='À identifier')score+=1;
      scored.push({a,i,score});
    }
    scored.sort((x,y)=>y.score-x.score||String(x.a.marque).localeCompare(String(y.a.marque),'fr')||String(x.a.produit).localeCompare(String(y.a.produit),'fr'));
    return scored.slice(0,limit).map(x=>({...x.a,__index:x.i}));
  }
  function filters(ctx='all'){
    const brands=new Set(),types=new Set(),finishes=new Set();
    for(const a of ARTICLES){if(!inContext(a,ctx))continue;if(a.marque)brands.add(a.marque);if(a.type)types.add(a.type);if(a.finition)finishes.add(a.finition)}
    const sort=x=>[...x].sort((a,b)=>a.localeCompare(b,'fr',{sensitivity:'base'}));
    return {brands:sort(brands),types:sort(types),finishes:sort(finishes)};
  }
  function byIndex(i){const a=ARTICLES[Number(i)];return a?{...a,__index:Number(i)}:null}
  function selection(a){if(!a)return null;return {catalogue:'Téréva 2026 -20%',index:a.__index,code:a.code||'',ref_fab:a.ref_fab||'',cr:a.cr||'',marque:a.marque||'',famille:a.famille||'',type:a.type||'',produit:a.produit||'',variante:a.variante||'',finition:a.finition||'',prix:a.prix==null?null:Number(a.prix),source:a.source||'',price_overridden:false,selected_at:new Date().toISOString()}}
  function label(s){if(!s)return'';return [s.marque,s.produit,s.variante,s.finition].filter(Boolean).join(' — ')}
  window.SpeedArtiCatalogueService={version:DB.version,count:DB.count,priceCount:DB.priceCount,search,filters,byIndex,selection,label,contextTypes};
})();
