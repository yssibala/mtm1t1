(function(){
  var overlay,input,results,indexData=null;

  function buildOverlay(){
    var o=document.createElement('div');
    o.id='muse-search-overlay';
    o.style.cssText='display:none;position:fixed;inset:0;z-index:9999;background:rgba(10,11,12,.55);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);align-items:flex-start;justify-content:center;padding-top:14vh;';
    o.innerHTML=
      '<div style="width:min(640px,90vw);background:#FDFCFA;border:1px solid #E7DAC4;box-shadow:0 32px 80px -24px rgba(10,11,12,.45);border-radius:4px;overflow:hidden;">'
      +'<div style="display:flex;align-items:center;padding:16px 20px;border-bottom:1px solid #E7DAC4;gap:12px;">'
      +'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0A0B0C" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" style="flex:none;opacity:.5;"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>'
      +'<input id="muse-search-input" type="text" placeholder="Search MUSE…" autocomplete="off" style="flex:1;border:none;outline:none;background:transparent;font-family:inherit;font-size:14px;letter-spacing:.06em;color:#0A0B0C;">'
      +'<button onclick="closeMuseSearch()" style="background:none;border:none;cursor:pointer;padding:2px;display:flex;align-items:center;opacity:.45;" aria-label="Close search">'
      +'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0A0B0C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>'
      +'</button>'
      +'</div>'
      +'<div id="muse-search-results" style="max-height:55vh;overflow-y:auto;"></div>'
      +'</div>';
    document.body.appendChild(o);
    overlay=o;
    input=document.getElementById('muse-search-input');
    results=document.getElementById('muse-search-results');
    o.addEventListener('click',function(e){if(e.target===o)closeMuseSearch();});
    input.addEventListener('keydown',function(e){
      if(e.key==='Escape'){closeMuseSearch();}
      else if(e.key==='Enter'){
        var q=input.value.trim();
        if(q)window.location.href='search.html?q='+encodeURIComponent(q);
      }
    });
    input.addEventListener('input',function(){renderInline(input.value.trim());});
  }

  function loadIndex(cb){
    if(indexData){cb(indexData);return;}
    var base=document.querySelector('base');
    var root=base?base.href:'';
    fetch(root+'search-index.json')
      .then(function(r){return r.json();})
      .then(function(d){indexData=d;cb(d);})
      .catch(function(){indexData=[];cb([]);});
  }

  function score(item,terms){
    var text=(item.title+' '+item.description+' '+item.content).toLowerCase();
    var s=0;
    terms.forEach(function(t){
      if(item.title.toLowerCase().indexOf(t)!==-1)s+=3;
      else if(item.description.toLowerCase().indexOf(t)!==-1)s+=2;
      else if(text.indexOf(t)!==-1)s+=1;
    });
    return s;
  }

  function search(q,data){
    if(!q)return[];
    var terms=q.toLowerCase().split(/\s+/).filter(Boolean);
    return data.map(function(item){return{item:item,s:score(item,terms)};})
      .filter(function(x){return x.s>0;})
      .sort(function(a,b){return b.s-a.s;})
      .map(function(x){return x.item;});
  }

  function renderInline(q){
    if(!q){results.innerHTML='';return;}
    loadIndex(function(data){
      var hits=search(q,data).slice(0,6);
      if(!hits.length){
        results.innerHTML='<div style="padding:22px 20px;font-size:12px;letter-spacing:.1em;color:#8A7A62;text-align:center;">No results for "'+escHtml(q)+'"</div>';
        return;
      }
      results.innerHTML=hits.map(function(h){
        return '<a href="'+h.url+'" style="display:block;padding:14px 20px;text-decoration:none;color:#0A0B0C;border-bottom:1px solid rgba(231,218,196,.5);">'
          +'<div style="font-size:11px;letter-spacing:.18em;font-weight:600;margin-bottom:3px;">'+escHtml(h.title)+'</div>'
          +'<div style="font-size:11px;letter-spacing:.06em;color:#8A7A62;">'+escHtml(h.description)+'</div>'
          +'</a>';
      }).join('')
      +'<a href="search.html?q='+encodeURIComponent(q)+'" style="display:block;padding:13px 20px;text-decoration:none;color:#C9851A;font-size:10px;letter-spacing:.2em;font-weight:600;text-align:center;">SEE ALL RESULTS FOR "'+escHtml(q.toUpperCase())+'" →</a>';
    });
  }

  function escHtml(s){
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  window.openMuseSearch=function(){
    if(!overlay)buildOverlay();
    overlay.style.display='flex';
    setTimeout(function(){if(input)input.focus();},60);
    renderInline(input?input.value.trim():'');
  };

  window.closeMuseSearch=function(){
    if(overlay)overlay.style.display='none';
  };

  document.addEventListener('keydown',function(e){
    if(e.key==='Escape'&&overlay&&overlay.style.display==='flex')closeMuseSearch();
  });
})();
