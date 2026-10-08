(function(){
  "use strict";
  function visible(el){
    if(!el||el.disabled||el.type==="hidden")return false;
    const s=window.getComputedStyle?window.getComputedStyle(el):null;
    return !s||!(s.display==="none"||s.visibility==="hidden");
  }
  function controls(){
    return Array.from(document.querySelectorAll('input:not([type="hidden"]),select,textarea')).filter(visible);
  }
  document.addEventListener("keydown",function(e){
    if(e.key!=="Tab"||e.altKey||e.ctrlKey||e.metaKey)return;
    const before=controls(), current=e.target, index=before.indexOf(current);
    if(index<0||before.length<2)return;
    e.preventDefault();
    const direction=e.shiftKey?-1:1;
    const targetIndex=(index+direction+before.length)%before.length;
    if(typeof current.blur==="function")current.blur();
    setTimeout(function(){
      const after=controls();
      if(!after.length)return;
      const target=after[Math.min(targetIndex,after.length-1)];
      if(target&&typeof target.focus==="function"){
        target.focus({preventScroll:true});
        if((target.tagName==="INPUT"||target.tagName==="TEXTAREA")&&typeof target.select==="function"){
          try{target.select();}catch(_){}
        }
      }
    },0);
  },true);
})();
