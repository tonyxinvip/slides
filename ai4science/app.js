(function(){
  'use strict';
  const slides=Array.isArray(window.AI4SCIENCE_SLIDES)?window.AI4SCIENCE_SLIDES:[];
  const deck=document.getElementById('deck');
  const count=document.getElementById('count');
  const progress=document.getElementById('progress');
  const esc=(s)=>String(s??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
  if(!deck||!count||!progress||!slides.length){
    document.body.innerHTML='<p class="fatal">演讲数据未能载入，请刷新页面。</p>';
    return;
  }
  const meta='辛海洋 · 深圳技术大学 · 2026.8.21';
  deck.innerHTML=slides.map((s,idx)=>{
    const cls=s.type==='cover'?'cover':(s.type==='section'?'section':'regular');
    const bullets=Array.isArray(s.bul)&&s.bul.length?'<ul>'+s.bul.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul>':'';
    const sub=s.sub?'<p class="sub">'+esc(s.sub)+'</p>':'';
    const flow=Array.isArray(s.flow)&&s.flow.length?'<div class="flow">'+s.flow.map((x,i)=>'<span>'+esc(x)+'</span>'+(i<s.flow.length-1?'<b>→</b>':'')).join('')+'</div>':'';
    return '<section class="slide '+cls+'" data-index="'+idx+'"><div class="meta">'+meta+'</div><div class="num">'+String(idx+1).padStart(2,'0')+'</div><h1>'+esc(s.title)+'</h1>'+sub+flow+bullets+'<div class="tag">'+esc(s.sec||'')+'</div></section>';
  }).join('');
  let current=Math.max(0,(parseInt(location.hash.slice(1),10)||1)-1);
  const clamp=(n)=>Math.max(0,Math.min(slides.length-1,n));
  function show(n){
    current=clamp(n);
    deck.style.transform='translate3d('+(-current*100)+'vw,0,0)';
    count.textContent=(current+1)+' / '+slides.length;
    progress.style.width=((current+1)/slides.length*100)+'%';
    document.title=(current+1)+'/'+slides.length+' · '+slides[current].title;
    try{history.replaceState(null,'','#'+(current+1));}catch(_e){}
  }
  document.getElementById('prev').addEventListener('click',()=>show(current-1));
  document.getElementById('next').addEventListener('click',()=>show(current+1));
  let startX=null,startY=null;
  addEventListener('touchstart',e=>{const t=e.touches[0];startX=t.clientX;startY=t.clientY;},{passive:true});
  addEventListener('touchend',e=>{
    if(startX===null)return;
    const t=e.changedTouches[0],dx=t.clientX-startX,dy=t.clientY-startY;
    if(Math.abs(dx)>48&&Math.abs(dx)>Math.abs(dy)*1.15)show(current+(dx<0?1:-1));
    startX=startY=null;
  },{passive:true});
  addEventListener('keydown',e=>{
    if(['ArrowRight','PageDown',' ','Enter'].includes(e.key)){e.preventDefault();show(current+1);}
    if(['ArrowLeft','PageUp','Backspace'].includes(e.key)){e.preventDefault();show(current-1);}
    if(e.key==='Home')show(0);
    if(e.key==='End')show(slides.length-1);
  });
  deck.addEventListener('click',e=>{
    if(e.target.closest('button'))return;
    const x=e.clientX/window.innerWidth;
    if(x>.72)show(current+1);else if(x<.28)show(current-1);
  });
  addEventListener('hashchange',()=>show((parseInt(location.hash.slice(1),10)||1)-1));
  show(current);
})();
