import {
  STEPS, defaultState, renderStep, validateStep, newElement, setPath, getPath, num
} from './core.js';

const STORAGE_KEY='speedarti-macon-demo-v2';
const TRUCK_PREF_KEY='speedarti-macon-truck-default';
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];

function cloneDefault(){ return structuredClone(defaultState()); }
function loadState(){
  const base=cloneDefault();
  try{
    const saved=JSON.parse(localStorage.getItem(STORAGE_KEY)||'null');
    const truck=Number(localStorage.getItem(TRUCK_PREF_KEY));
    const state=saved?{...base,...saved,globals:{...base.globals,...saved.globals},simple:{...base.simple,...saved.simple}}:base;
    if(Number.isFinite(truck)&&truck>0)state.globals.truckPrice=truck;
    return state;
  }catch{return base;}
}
function saveState(){
  localStorage.setItem(STORAGE_KEY,JSON.stringify({...state,result:null}));
  if(state.globals.saveTruckPrice&&num(state.globals.truckPrice)>0)localStorage.setItem(TRUCK_PREF_KEY,String(num(state.globals.truckPrice)));
}

let state=loadState();

function renderSteps(){
  $('#stepsNav').innerHTML=STEPS.map((s,i)=>`<div class="step-chip ${i===state.step?'active':i<state.step?'done':''}"><span class="num">${i<state.step?'✓':i+1}</span>${s}</div>`).join('');
}
function render(){
  renderSteps();
  $('#stepHost').innerHTML=renderStep(state);
  $('#prevBtn').disabled=state.step===0;
  $('#prevBtn').style.opacity=state.step===0?.45:1;
  $('#nextBtn').textContent=state.step===STEPS.length-1?'Recalculer':state.step===STEPS.length-2?'Voir le résultat':'Suivant →';
  $('#footerNote').textContent=state.mode==='simple'?'Mode simple — un ouvrage':'Mode multiple — plusieurs éléments cumulés';
  bindEvents();
}

function normalizeValue(el){
  if(el.type==='checkbox')return el.checked;
  if(el.type==='number')return el.value;
  return el.value;
}
function bindDataField(el,obj,path,rerender=false){
  el.addEventListener('change',()=>{
    setPath(obj,path,normalizeValue(el));
    saveState();
    if(rerender||el.type==='checkbox'||el.tagName==='SELECT')render();
  });
}
function resetSimple(){
  state.simple={openings:[],refOverrides:{},chimneyOverrides:{}};
}
function findElement(id){return state.elements.find(e=>e.id===id);}
function splitPair(v){const [id,idx]=String(v).split(':');return [id,Number(idx)];}

function bindEvents(){
  $$('[data-mode]').forEach(b=>b.onclick=()=>{
    state.mode=b.dataset.mode;
    if(state.mode==='simple')state.elements=[]; else resetSimple();
    saveState();render();
  });
  $$('[data-simple-type]').forEach(b=>b.onclick=()=>{
    state.simpleType=b.dataset.simpleType;
    resetSimple();saveState();render();
  });
  $$('[data-add-element]').forEach(b=>b.onclick=()=>{
    const el=newElement(b.dataset.addElement); if(el)state.elements.push(el);
    saveState();render();
  });
  $$('[data-remove-element]').forEach(b=>b.onclick=()=>{
    state.elements=state.elements.filter(e=>e.id!==b.dataset.removeElement);
    saveState();render();
  });

  $$('[data-simple]').forEach(el=>bindDataField(el,state.simple,el.dataset.simple,true));
  $$('[data-global]').forEach(el=>bindDataField(el,state.globals,el.dataset.global,true));
  $$('[data-root-field]').forEach(el=>bindDataField(el,state,el.dataset.rootField,true));
  $$('[data-el-id][data-field]').forEach(el=>{
    const e=findElement(el.dataset.elId); if(e)bindDataField(el,e.data,el.dataset.field,true);
  });

  $$('[data-add-simple-opening]').forEach(b=>b.onclick=()=>{
    state.simple.openings=state.simple.openings||[];
    state.simple.openings.push({width:'',height:'',associated:''});saveState();render();
  });
  $$('[data-remove-simple-opening]').forEach(b=>b.onclick=()=>{
    state.simple.openings.splice(Number(b.dataset.removeSimpleOpening),1);saveState();render();
  });

  $$('[data-add-opening]').forEach(b=>b.onclick=()=>{
    const e=findElement(b.dataset.addOpening); if(!e)return;
    e.data.openings=e.data.openings||[];e.data.openings.push({type:'seuil_ba',width:'',height:''});saveState();render();
  });
  $$('[data-remove-opening]').forEach(b=>b.onclick=()=>{
    const [id,idx]=splitPair(b.dataset.removeOpening),e=findElement(id);if(!e)return;
    e.data.openings.splice(idx,1);saveState();render();
  });
  $$('[data-add-beam]').forEach(b=>b.onclick=()=>{
    const e=findElement(b.dataset.addBeam);if(!e)return;
    e.data.beams=e.data.beams||[];e.data.beams.push({length:'',widthCm:'',heightCm:'',ref:'poutre_ba_courante'});saveState();render();
  });
  $$('[data-remove-beam]').forEach(b=>b.onclick=()=>{
    const [id,idx]=splitPair(b.dataset.removeBeam),e=findElement(id);if(!e)return;
    e.data.beams.splice(idx,1);saveState();render();
  });
  $$('[data-add-pignon]').forEach(b=>b.onclick=()=>{
    const e=findElement(b.dataset.addPignon);if(!e)return;
    e.data.pignons=e.data.pignons||[];e.data.pignons.push({width:'',slope:''});saveState();render();
  });
  $$('[data-remove-pignon]').forEach(b=>b.onclick=()=>{
    const [id,idx]=splitPair(b.dataset.removePignon),e=findElement(id);if(!e)return;
    e.data.pignons.splice(idx,1);saveState();render();
  });
}

$('#prevBtn').onclick=()=>{if(state.step>0){state.step--;saveState();render();}};
$('#nextBtn').onclick=()=>{
  if(state.step===STEPS.length-1){render();return;}
  const err=validateStep(state,state.step);
  if(err){alert(err);return;}
  state.step++;
  saveState();render();
};

render();
