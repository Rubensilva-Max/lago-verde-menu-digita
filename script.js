const video=document.getElementById('fishVideo');
const hero=document.querySelector('.hero');
let metadataReady=false, scrollTick=false;
video.addEventListener('loadedmetadata',()=>{metadataReady=true;syncVideoToScroll();});
function syncVideoToScroll(){
  if(!metadataReady||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const rect=hero.getBoundingClientRect();
  const scrollable=Math.max(1,hero.offsetHeight-window.innerHeight);
  const progress=Math.min(1,Math.max(0,-rect.top/scrollable));
  const target=progress*Math.max(0,video.duration-0.08);
  if(Number.isFinite(target)&&Math.abs(video.currentTime-target)>.035){
    try{video.currentTime=target;}catch(e){}
  }
}
window.addEventListener('scroll',()=>{if(!scrollTick){requestAnimationFrame(()=>{syncVideoToScroll();scrollTick=false;});scrollTick=true;}},{passive:true});
window.addEventListener('resize',syncVideoToScroll);
video.addEventListener('loadeddata',syncVideoToScroll);
const toggle=document.querySelector('.menu-toggle'),nav=document.querySelector('.nav');
toggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');}));
const cart=[];
const count=document.getElementById('cartCount'),float=document.getElementById('cartFloat'),toast=document.getElementById('toast');
let toastTimer;
document.querySelectorAll('.add-item').forEach(btn=>btn.addEventListener('click',()=>{
  cart.push(btn.dataset.item);count.textContent=cart.length;float.classList.add('visible');
  toast.textContent=btn.dataset.item+' adicionado';toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),1500);
}));
document.getElementById('sendOrder').addEventListener('click',()=>{
  if(!cart.length)return;
  const grouped={};cart.forEach(item=>grouped[item]=(grouped[item]||0)+1);
  const lines=Object.entries(grouped).map(([name,qty])=>`${qty}x ${name}`).join('\n');
  const message=`Olá! Gostaria de consultar valores e disponibilidade para:\n${lines}\n\nPodem me ajudar?`;
  window.open('https://wa.me/5585982218119?text='+encodeURIComponent(message),'_blank','noopener');
});
document.querySelectorAll('.tab').forEach(tab=>tab.addEventListener('click',()=>{
  document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));tab.classList.add('active');
  const filter=tab.dataset.filter;
  document.querySelectorAll('.menu-group').forEach(group=>{group.hidden=filter!=='todos'&&group.dataset.category!==filter;});
}));
document.getElementById('year').textContent=new Date().getFullYear();
