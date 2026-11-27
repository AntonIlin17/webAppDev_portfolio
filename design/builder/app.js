/* Dither Portfolio Builder: state, page rendering, the parts bin, hover previews,
   labels, flow between screens, and saving. */
(function(){
'use strict';
const C=window.CAT,P=window.PARTS,D=window.Dither;
const $=(s,r)=>(r||document).querySelector(s),$$=(s,r)=>[...(r||document).querySelectorAll(s)];
const app=$('#app'),stage=$('#stage'),page=$('#page'),navHost=$('#nav-host'),pvHost=$('#pv-host'),binBody=$('#bin-body');
const clone=o=>JSON.parse(JSON.stringify(o));
const pad=n=>String(n).padStart(2,'0');
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const PART_SLOTS=['nav','hero','work','project','about','stack','contact','footer','flow'];
const LOOK_SLOTS=['specimen','surface','ink','pointer','air','backdrop','type','cursor','transition','intro'];
const SECTIONS=['hero','work','about','stack','contact','footer'];
const SCREEN_OF={hero:'home',work:'work',about:'about',stack:'about',contact:'contact',footer:'contact'};

const S={cfg:clone(C.presets[0].cfg),version:0,kept:{},locked:{},notes:'',builds:[],labels:true,tab:'versions',filter:'All'};
let live=S.cfg,screen='home',openProject=null,tempProject=false,history=[],narrow=false;

/* ───────── persistence ───────── */
const LS='dither-portfolio-builder:v1';
function normalize(cfg){
 const n=Object.assign(clone(C.base),cfg||{});
 n.extras=Object.assign(clone(C.base.extras),(cfg&&cfg.extras)||{});n.off=Object.assign({},(cfg&&cfg.off)||{});n.custom=Object.assign(clone(C.base.custom),(cfg&&cfg.custom)||{});
 C.slots.forEach(s=>{if(!s.variants.some(v=>v.id===n[s.id]))n[s.id]=C.base[s.id]});
 n.grain=Math.max(2,Math.min(8,+n.grain||3));return n;
}
function loadLocal(){try{const r=JSON.parse(localStorage.getItem(LS));if(!r||!r.cfg)return false;
 S.cfg=normalize(r.cfg);S.version=r.version|0;S.kept=r.kept||{};S.locked=r.locked||{};S.notes=r.notes||'';S.builds=Array.isArray(r.builds)?r.builds:[];S.labels=r.labels!==false;return true}catch(e){return false}}
function saveLocal(){try{localStorage.setItem(LS,JSON.stringify({cfg:S.cfg,version:S.version,kept:S.kept,locked:S.locked,notes:S.notes,builds:S.builds,labels:S.labels}))}catch(e){}}
let db=null,dbTimer=0,syncMsg='Your build is saved in this browser.';
function setSync(t){syncMsg=t;const el=$('#sync');if(el)el.textContent=t}
async function initDb(hadLocal){
 if(!(window.claude&&window.claude.use))return;
 try{db=await window.claude.use('db')}catch(e){db=null}
 if(!db)return;
 try{
  if(!hadLocal){const snap=await db.doc('state/current').get();if(snap.exists){const d=clone(snap.data());if(d.cfg){S.cfg=normalize(d.cfg);S.version=d.version|0;S.notes=d.notes||'';(d.kept||[]).forEach(k=>S.kept[k]=true);apply(S.cfg,live);renderBin()}}}
  const q=await db.collection('builds').get();
  q.docs.forEach(doc=>{const d=clone(doc.data());if(d&&d.cfg&&!S.builds.some(b=>b.id===doc.id))S.builds.push({id:doc.id,name:String(d.name||'Build'),cfg:normalize(d.cfg)})});
  setSync('Saved on this page too, so Claude can read your build and notes.');if(S.tab==='build')renderBin();
 }catch(e){setSync('Your build is saved in this browser.')}
}
function persist(){saveLocal();if(!db)return;clearTimeout(dbTimer);
 dbTimer=setTimeout(()=>{db.doc('state/current').set({cfg:S.cfg,version:S.version,kept:Object.keys(S.kept),notes:S.notes,sheet:sheetText(),updatedAt:new Date().toISOString()}).catch(()=>{})},1200)}

/* ───────── look ───────── */
const luma=h=>{h=h.replace('#','');const n=parseInt(h.length===3?[...h].map(c=>c+c).join(''):h,16);return((n>>16&255)*.299+(n>>8&255)*.587+(n&255)*.114)/255};
function inkOf(cfg){
 if(cfg.ink!=='custom')return C.inks[cfg.ink];
 const c=cfg.custom,positive=luma(c.bg)>.5;
 return{name:'Your own',bg:c.bg,a:c.a,b:c.duo?c.b:null,fg:positive?'#161616':'#f1f0ec',accent:c.duo?c.b:c.a,positive};
}
function applyLook(cfg){
 const k=inkOf(cfg);
 stage.style.setProperty('--bg',k.bg);stage.style.setProperty('--fg',k.fg);stage.style.setProperty('--accent',k.accent);
 stage.classList.toggle('positive',!!k.positive);
 D.setLook({clear:cfg.backdrop!=='none',mode:cfg.surface,cell:cfg.grain,inkA:k.a,inkB:k.b||k.a,duo:!!k.b,bg:k.bg,positive:!!k.positive,bloom:k.bloom==null?.045:k.bloom,pointer:cfg.pointer,air:cfg.air});
 $('#grain').hidden=!cfg.extras.grain;
}
function applyType(cfg){
 const t=C.types[cfg.type],st=stage.style;
 st.setProperty('--f-display',t.display);st.setProperty('--f-body',t.body);st.setProperty('--f-mono',t.mono);
 st.setProperty('--d-style',t.style);st.setProperty('--d-weight',t.weight);st.setProperty('--d-track',t.track);st.setProperty('--d-lh',t.lh);st.setProperty('--d-up',t.up);st.setProperty('--ds',t.scale);
 if(document.fonts&&document.fonts.load)document.fonts.load(`${t.style} ${t.weight} 48px ${t.display}`).then(refreshText).catch(()=>{});
}
function setCursor(cfg){stage.classList.toggle('cur-cross',cfg.cursor==='cross');stage.classList.toggle('cur-ring',cfg.cursor==='ring')}
let backView=null;
function setBackdrop(cfg){
 const c=$('#backdrop');
 if(cfg.backdrop==='none'){c.hidden=true;if(backView){backView.destroy();backView=null}return}
 c.hidden=false;
 if(!backView)backView=new D.View(c,{kind:cfg.backdrop,reveal:false,gain:.28,maxDpr:1,fps:20,clear:false});
 backView.set({kind:cfg.backdrop,cell:Math.max(3,cfg.grain+1),mode:cfg.surface==='glyph'?'glyph':(cfg.surface==='pixel'?'pixel':'dither')});
}

/* ───────── dither views ───────── */
function typeFont(size){const t=C.types[live.type];return `${t.style} ${t.weight} ${Math.round(size)}px ${t.display}`}
function textCanvas(c,kind){
 const cw=c.clientWidth||800,ch=c.clientHeight||400,W=Math.min(2400,Math.round(cw*2)),H=Math.max(64,Math.round(W*ch/cw));
 const t=c._tc||(c._tc=document.createElement('canvas'));t.width=W;t.height=H;
 const x=t.getContext('2d'),ty=C.types[live.type];x.fillStyle='#000';x.fillRect(0,0,W,H);
 const track=size=>{const em=(parseFloat(ty.track)||0)*.45;return (em*size).toFixed(1)+'px'};
 if(kind==='name'){
  const text=ty.up==='uppercase'?'ANTON ILIN':'Anton Ilin',maxW=W*.95;
  const L=document.createElement('canvas');L.width=W;L.height=H;const lx=L.getContext('2d');
  const fit=(lines,start)=>{let size=start;lx.font=typeFont(size);try{lx.letterSpacing=track(size)}catch(e){}
   const w=Math.max(...lines.map(l=>lx.measureText(l).width));if(w>maxW)size*=maxW/w;return size};
  let lines=[text],size=fit(lines,H*.86);
  if(size<H*.4){lines=text.split(' ');size=fit(lines,H*.47)}
  lx.font=typeFont(size);try{lx.letterSpacing=track(size)}catch(e){}
  lx.textAlign='center';lx.textBaseline='middle';lx.fillStyle='#fff';
  lines.forEach((l,i)=>lx.fillText(l,W/2,H/2+(i-(lines.length-1)/2)*size*Math.max(.86,ty.lh)+size*.03));
  x.globalAlpha=.36;x.drawImage(L,0,0);x.globalAlpha=1;
  const e=D.preload(C.img(live.specimen)),stamp=c._stamp=(c._stamp||0)+1;
  const paint=()=>{if(c._stamp!==stamp)return;lx.globalCompositeOperation='source-in';const s=Math.max(W,H)*1.04;lx.drawImage(e.img,(W-s)/2,(H-s)/2,s,s);
   x.globalCompositeOperation='lighter';x.drawImage(L,0,0);x.globalCompositeOperation='source-over';if(c._v)c._v.refresh()};
  if(e.ready)paint();else e.waiters.push(paint);
 }else{
  const words=C.me.stack.flatMap(g=>g[1]),tones=[1,.5,.8,.38,.92,.62];
  let size=H*.3,rows;
  for(let n=0;n<24;n++){x.font=typeFont(size);try{x.letterSpacing=track(size)}catch(e){}
   const gap=size*.32;rows=[[]];let w=0;
   words.forEach(wd=>{const m=x.measureText(wd).width;if(w+m>W*.96&&rows[rows.length-1].length){rows.push([]);w=0}rows[rows.length-1].push([wd,m]);w+=m+gap});
   if(rows.length*size*1.04<=H*.94)break;size*=.92}
  x.textBaseline='middle';x.textAlign='left';let k=0;const lh=size*1.04,top=(H-rows.length*lh)/2+lh/2;
  rows.forEach((r,ri)=>{let px=W*.02;r.forEach(([wd,m])=>{const g=Math.round(tones[k++%tones.length]*255);x.fillStyle=`rgb(${g},${g},${g})`;x.fillText(wd,px,top+ri*lh);px+=m+size*.32})});
 }
 return t;
}
function makeView(c){
 const d=c.dataset,o={interactive:d.int==='1',scale:+d.scale||1,ox:+d.ox||0,oy:+d.oy||0,reveal:d.reveal!=='0',lensScale:+d.lens||1,fit:d.fit||'contain'};
 if(narrow&&d.main==='1'&&o.ox){o.oy=o.ox>0?0:-.1;o.scale*=o.ox>0?1.1:.84;o.ox=0}
 if(d.cell)o.cell=+d.cell;if(d.mode)o.mode=d.mode;if(d.opaque||d.bg)o.clear=false;
 ['inka','inkb','bg'].forEach(k=>{if(d[k])o[{inka:'inkA',inkb:'inkB',bg:'bg'}[k]]=d[k]});
 if(d.duo)o.duo=d.duo==='1';if(d.positive)o.positive=d.positive==='1';
 const s=d.src;
 o.src=(s==='name'||s==='stack')?textCanvas(c,s):C.img(s==='specimen'?live.specimen:s);
 return new D.View(c,o);
}
function mount(root){$$('canvas.dv',root).forEach(c=>{if(!c._v)c._v=makeView(c)})}
function unmount(root){$$('canvas.dv',root).forEach(c=>{if(c._v){c._v.destroy();c._v=null}})}
let textT=0;
function refreshText(){clearTimeout(textT);textT=setTimeout(()=>{$$('canvas.dv[data-src="name"],canvas.dv[data-src="stack"]',stage).forEach(c=>{if(c._v&&c.clientWidth){c._v.srcCanvas=textCanvas(c,c.dataset.src);c._v.refresh()}})},60)}
function setSpecimen(cfg){
 $$('canvas.dv[data-src="specimen"]').forEach(c=>{if(c._v)c._v.setSrc(C.img(cfg.specimen))});
 refreshText();
 $$('[data-strip-el]',page).forEach(b=>b.classList.toggle('on',b.dataset.stripEl===cfg.specimen));
}
function mainView(){const c=$('canvas.dv[data-main]',page);return c&&c._v}

/* ───────── page ───────── */
function buildPage(cfg){
 unmount(page);unmount(navHost);
 page.innerHTML=SECTIONS.filter(s=>!cfg.off[s]).map(s=>P[s][cfg[s]](cfg)).join('');
 navHost.innerHTML=cfg.off.nav?'':P.nav[cfg.nav](cfg);
 afterRender(cfg);
}
function renderPart(slot,cfg){
 if(slot==='nav'){unmount(navHost);navHost.innerHTML=cfg.off.nav?'':P.nav[cfg.nav](cfg)}
 else{const old=$(`.part[data-slot="${slot}"]`,page);if(!old||cfg.off[slot]){buildPage(cfg);return}unmount(old);old.outerHTML=P[slot][cfg[slot]](cfg)}
 afterRender(cfg);
}
function afterRender(cfg){
 $$('.part',page).forEach(p=>{if(!p.dataset.screen)p.dataset.screen='home'});
 const nav=cfg.off.nav?'none':cfg.nav;
 stage.style.setProperty('--navh',({bar:narrow?64:84,corners:56,index:64}[nav]||0)+'px');
 stage.style.setProperty('--railw',nav==='rail'?'64px':'0px');stage.style.setProperty('--dockh',nav==='dock'?'62px':(nav==='corners'?'34px':'0px'));
 stage.dataset.hero=cfg.hero;page.classList.toggle('flow-screens',cfg.flow==='screens');page.dataset.at=screen;
 mount(page);mount(navHost);
 fillStrip(cfg);updateBinds(cfg);tagAll(cfg);
 const w=$('[data-air-toggle]',page);if(w)w.setAttribute('aria-pressed',String(cfg.air==='wind'));
 onScroll();
}
function fillStrip(cfg){
 const s=$('[data-strip]',page);if(!s||s.childElementCount)return;
 s.innerHTML=C.elements.map(e=>`<button data-strip-el="${e.id}" aria-label="${e.name}" title="${e.name}"${e.id===cfg.specimen?' class="on"':''}><img src="${C.thumb(e.id)}" alt="" loading="lazy" width="60" height="60"></button>`).join('');
 const on=$('.on',s);if(on)s.scrollLeft=on.offsetLeft-s.clientWidth/2+38;
}
function updateBinds(cfg){
 const e=C.element(cfg.specimen),i=C.elements.indexOf(e),sur=C.variant('surface',cfg.surface).name,ink=inkOf(cfg).name;
 const v={'spec-name':e.name,'spec-cat':e.cat,'spec-serial':pad(i+1),'spec-note':e.note,'surface-name':sur,'ink-name':ink,'surface-name-lc':sur.toLowerCase(),'ink-name-lc':ink.toLowerCase().split(',')[0]};
 $$('[data-bind]',stage).forEach(n=>{n.textContent=v[n.dataset.bind]||''});
}
function tagAll(cfg){
 $$('.tag,.looktags',stage).forEach(t=>t.remove());
 const mk=slot=>{const v=C.variant(slot,cfg[slot]),t=document.createElement('button');t.type='button';t.className='tag';t.dataset.tag=slot;t.title='Change this part';
  t.innerHTML=`<b>${C.slotById[slot].name}</b><span></span><code>${v.code}</code>`;t.children[1].textContent=slot==='ink'?inkOf(cfg).name:v.name;return t};
 $$('.part',stage).forEach(p=>p.appendChild(mk(p.dataset.slot)));
 const m=$('canvas.dv[data-main]',page);
 if(m){const box=document.createElement('div');box.className='looktags';['specimen','surface','ink','pointer'].concat(cfg.air!=='calm'?['air']:[]).forEach(s=>box.appendChild(mk(s)));m.closest('.part').appendChild(box)}
}
function markNav(){
 let at=screen;
 if(live.flow!=='screens'){at='home';const mid=page.scrollTop+page.clientHeight*.4;$$('.part',page).forEach(p=>{if(p.offsetTop<=mid)at=SCREEN_OF[p.dataset.slot]||at})}
 $$('[data-nav]',navHost).forEach(b=>b.classList.toggle('on',b.dataset.nav===at));
}
function onScroll(){
 const max=page.scrollHeight-page.clientHeight;
 stage.classList.toggle('scrolled',page.scrollTop>24);
 $('#progress').style.width=(live.extras.progress&&max>4)?(page.scrollTop/max*100)+'%':'0';
 const sc=$('[data-scrub]',page);
 if(sc&&sc.offsetHeight){const span=Math.max(1,sc.offsetHeight-page.clientHeight),p=Math.max(0,Math.min(1,(page.scrollTop-sc.offsetTop)/span)),e=1-Math.pow(1-p,2.4);
  const c=$('canvas[data-scrub]',sc);if(c&&c._v)c._v.set({cell:Math.round((18+(live.grain-18)*e)*4)/4,gain:.7+.3*e});
  const mt=$('.scrub-meter i',sc);if(mt)mt.style.width=(e*100)+'%'}
 markNav();
}
page.addEventListener('scroll',onScroll,{passive:true});

/* ───────── flow ───────── */
const B8=(()=>{const m=new Float32Array(64);for(let y=0;y<8;y++)for(let x=0;x<8;x++){let n=0;for(let b=0;b<3;b++){const X=(x>>b)&1,Y=(y>>b)&1;n|=((X^Y)*2+Y)<<(4-b*2)}m[y*8+x]=(n+.5)/64}return m})();
const rgb=h=>{h=h.replace('#','');if(h.length===3)h=[...h].map(c=>c+c).join('');const n=parseInt(h,16);return[n>>16&255,n>>8&255,n&255]};
function wipe(dir,ms,done){
 const c=$('#wipe'),w=Math.max(8,Math.ceil(stage.clientWidth/8)),h=Math.max(8,Math.ceil(stage.clientHeight/8));c.width=w;c.height=h;c.style.display='block';
 const x=c.getContext('2d'),img=x.createImageData(w,h),col=rgb(inkOf(live).bg),t0=performance.now();
 for(let i=0;i<w*h;i++){img.data[i*4]=col[0];img.data[i*4+1]=col[1];img.data[i*4+2]=col[2]}
 const step=now=>{const p=Math.min(1,(now-t0)/ms),q=dir>0?p:1-p;
  for(let y=0;y<h;y++)for(let X=0;X<w;X++){const th=B8[(y&7)*8+(X&7)]*.7+(y/h)*.3;img.data[(y*w+X)*4+3]=th<q*1.01?255:0}
  x.putImageData(img,0,0);
  if(p<1)requestAnimationFrame(step);else{if(dir<0)c.style.display='none';if(done)done()}};
 if(!ms){const q=dir>0?1:0;for(let i=0;i<w*h;i++)img.data[i*4+3]=q?255:0;x.putImageData(img,0,0);if(dir<0)c.style.display='none';if(done)done();return}
 requestAnimationFrame(step);
}
let busy=false;
function transition(fn){
 const kind=reduced?'cut':live.transition;
 if(kind==='cut'||busy){fn();return}
 busy=true;const end=()=>{busy=false};
 if(kind==='wipe')wipe(1,300,()=>{fn();wipe(-1,420,end)});
 else if(kind==='scan'){const s=$('#scan');s.style.display='block';
  s.animate([{transform:'translateY(-100%)'},{transform:'translateY(0)'}],{duration:320,easing:'cubic-bezier(.4,0,.2,1)'}).finished.then(()=>{fn();
   return s.animate([{transform:'translateY(0)'},{transform:'translateY(100%)'}],{duration:420,easing:'cubic-bezier(.4,0,.2,1)'}).finished}).then(()=>{s.style.display='none';end()})}
 else{const d=document.createElement('div');d.style.cssText='position:absolute;inset:0;background:var(--bg);z-index:8';$('#overlay').appendChild(d);
  d.animate([{opacity:0},{opacity:1}],{duration:170}).finished.then(()=>{fn();return d.animate([{opacity:1},{opacity:0}],{duration:260}).finished}).then(()=>{d.remove();end()})}
}
function closeMenu(){const m=$('.ni-menu',navHost);if(m&&!m.hidden){m.hidden=true;$('.ni-open',navHost).setAttribute('aria-expanded','false');$('.ni-open',navHost).textContent='Index'}}
function go(t){
 closeMenu();if(openProject)closeProj(true);
 if(live.flow==='screens'){
  if(t===screen){page.scrollTo({top:0,behavior:reduced?'auto':'smooth'});return}
  transition(()=>{screen=t;page.dataset.at=t;page.scrollTop=0;markNav();refreshText();D.invalidate();replayVisible()});
 }else{
  const el=t==='home'?page.firstElementChild:$(`.part[data-slot="${t}"]`,page);
  if(el)page.scrollTo({top:el.offsetTop,behavior:reduced?'auto':'smooth'});
 }
}
function replayVisible(){$$('canvas.dv',page).forEach(c=>{if(c._v&&c.clientWidth&&c.dataset.reveal!=='0')c._v.replay()})}
function openProj(id,temp){
 const run=()=>{unmount(pvHost);pvHost.innerHTML=P.project(live.project,id);openProject=id;tempProject=!!temp;mount(pvHost);tagAll(live);if(!temp){const b=$('.pv-close',pvHost);if(b)b.focus({preventScroll:true})}};
 if(live.project==='page'&&!openProject&&!temp)transition(run);else run();
}
function closeProj(silent){
 if(!openProject)return;
 const run=()=>{unmount(pvHost);pvHost.innerHTML='';openProject=null;tempProject=false};
 if(live.project==='page'&&!silent)transition(run);else run();
}
function playIntro(){
 const kind=reduced?'none':live.intro,el=$('#intro'),tx=$('#intro-text'),mv=mainView();
 if(kind==='none'){if(mv)mv.replay();return}
 wipe(1,0);el.hidden=false;el.className=kind;
 const open=ms=>{el.hidden=true;wipe(-1,700);const v=mainView();if(v){v.opts.revealMs=ms;v.replay()}};
 if(kind==='develop'){tx.textContent='Preparing the light…';setTimeout(()=>open(1500),700)}
 else{let n=1;const total=C.elements.length;tx.textContent=pad(n);
  const id=setInterval(()=>{n+=Math.max(1,Math.ceil((total-n)/7));tx.textContent=pad(Math.min(n,total));if(n>=total){clearInterval(id);setTimeout(()=>open(1200),280)}},75)}
}

/* ───────── stage interactions ───────── */
let toastT=0;
function toast(t){const el=$('#toast');el.textContent=t;el.classList.add('on');clearTimeout(toastT);toastT=setTimeout(()=>el.classList.remove('on'),2200)}
function copyText(text,okMsg){
 const done=()=>toast(okMsg),fail=()=>toast('Could not copy. Select the text and copy it by hand.');
 try{navigator.clipboard.writeText(text).then(done,fail)}catch(e){fail()}
}
let dragged=false;
stage.addEventListener('click',e=>{
 const t=e.target,q=s=>t.closest(s);let n;
 if((n=q('.tag'))){e.preventDefault();e.stopPropagation();focusSlot(n.dataset.tag);return}
 if(dragged){dragged=false;e.preventDefault();return}
 if((n=q('[data-menu]'))){const m=$('.ni-menu',navHost),open=m.hidden;m.hidden=!open;n.setAttribute('aria-expanded',String(open));n.textContent=open?'Close':'Index';if(open){mount(m);D.invalidate()}return}
 if((n=q('[data-close]'))){closeProj();return}
 if((n=q('[data-open]'))){openProj(n.dataset.open);return}
 if((n=q('[data-go]'))){go(n.dataset.go);return}
 if((n=q('[data-spec]'))){const i=C.elements.findIndex(x=>x.id===S.cfg.specimen),L=C.elements.length;commit({specimen:C.elements[(i+(+n.dataset.spec)+L)%L].id});return}
 if((n=q('[data-strip-el]'))){commit({specimen:n.dataset.stripEl});return}
 if(q('[data-air-toggle]')){commit({air:S.cfg.air==='wind'?'calm':'wind'});return}
 if(q('[data-copy]')){copyText(C.me.email,'Address copied');return}
});
stage.addEventListener('submit',e=>{if(e.target.closest('[data-form]')){e.preventDefault();toast('This is a mock-up, so nothing was sent.')}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(openProject)closeProj();else closeMenu()}});
stage.addEventListener('pointerover',e=>{
 const r=e.target.closest('[data-hover-el]');
 if(r){const f=$('.ledger-float',page);if(f&&f._v)f._v.setSrc(C.img(r.dataset.hoverEl))}
 const m=e.target.closest('[data-menu-el]');
 if(m){const a=$('.ni-art',navHost);if(a&&a._v)a._v.setSrc(C.img(m.dataset.menuEl==='specimen'?live.specimen:m.dataset.menuEl))}
});
const cur=$('#cursor');
stage.addEventListener('pointermove',e=>{
 const r=stage.getBoundingClientRect();
 cur.style.transform=`translate(${e.clientX-r.left}px,${e.clientY-r.top}px)`;cur.style.opacity=1;
 cur.classList.toggle('link',!!e.target.closest('button,a,summary,input,textarea'));
 const f=$('.ledger-float',page);
 if(f){const led=e.target.closest('.ledger'),sec=f.parentElement.getBoundingClientRect();f.classList.toggle('on',!!led);
  if(led){const w=f.offsetWidth;f.style.transform=`translate(${Math.min(sec.width-w-8,e.clientX-sec.left+28)}px,${e.clientY-sec.top-w/2}px)`}}
},{passive:true});
stage.addEventListener('pointerleave',()=>{cur.style.opacity=0;const f=$('.ledger-float',page);if(f)f.classList.remove('on')});
// drag the filmstrip sideways with a mouse
let film=null,fx=0,fs=0;
page.addEventListener('pointerdown',e=>{const f=e.target.closest('.film');if(f&&e.pointerType==='mouse'){film=f;fx=e.clientX;fs=f.scrollLeft;dragged=false}});
window.addEventListener('pointermove',e=>{if(film){const dx=e.clientX-fx;if(Math.abs(dx)>6)dragged=true;film.scrollLeft=fs-dx}},{passive:true});
window.addEventListener('pointerup',()=>{film=null;setTimeout(()=>{dragged=false},0)});

/* ───────── applying a configuration ───────── */
function apply(next,prev,why){
 const ch=k=>JSON.stringify(next[k])!==JSON.stringify(prev[k]);
 const any=ks=>ks.some(ch);
 const structural=SECTIONS.filter(ch),full=ch('off')||ch('flow')||ch('extras')||structural.length>1||(structural.length&&ch('nav'));
 const flags={look:any(['surface','ink','grain','pointer','air','custom','extras','backdrop']),type:ch('type'),cursor:ch('cursor'),back:any(['backdrop','ink','grain','surface','custom']),nav:ch('nav'),project:ch('project'),spec:ch('specimen'),flow:ch('flow')};
 live=next;
 if(flags.look)applyLook(next);
 if(flags.type)applyType(next);
 if(flags.cursor)setCursor(next);
 if(flags.back)setBackdrop(next);
 if(flags.flow)screen='home';
 if(full)buildPage(next);
 else{if(structural.length)renderPart(structural[0],next);if(flags.nav)renderPart('nav',next)}
 if(flags.project&&openProject){const id=openProject;unmount(pvHost);pvHost.innerHTML=P.project(next.project,id);mount(pvHost)}
 if(flags.spec)setSpecimen(next);
 if(flags.type)refreshText();
 updateBinds(next);tagAll(next);
 const w=$('[data-air-toggle]',page);if(w)w.setAttribute('aria-pressed',String(next.air==='wind'));
 if(flags.spec)$$('canvas[data-sthumb]',binBody).forEach(c=>{if(c._v)c._v.setSrc(C.img(next.specimen))});
 onScroll();
}
function commit(patch,o){
 clearTimeout(pvT);clearTimeout(rvT);saved=null;stopDemo();hideBadge();
 if(tempProject)closeProj(true);
 history.push({cfg:clone(S.cfg),version:S.version});if(history.length>80)history.shift();
 S.cfg=normalize(Object.assign(clone(S.cfg),patch));if(o&&o.version!=null)S.version=o.version;
 apply(S.cfg,live);persist();syncBin();
}
function undo(){const h=history.pop();if(!h)return;S.cfg=h.cfg;S.version=h.version;apply(S.cfg,live);persist();syncBin()}

/* ───────── hover previews ───────── */
let pvT=0,rvT=0,saved=null,hoverEl=null,demoRaf=0;
function showBadge(html){const b=$('#preview-badge');b.innerHTML=html;b.hidden=false}
function hideBadge(){$('#preview-badge').hidden=true}
function reveal(slot){
 const target=SCREEN_OF[slot];if(!target)return;
 saved=saved||{};
 if(live.flow==='screens'){if(screen!==target){if(saved.screen==null)saved.screen=screen;screen=target;page.dataset.at=target;page.scrollTop=0;markNav();refreshText();D.invalidate()}return}
 const el=$(`.part[data-slot="${slot}"]`,page);if(!el)return;
 const top=el.offsetTop,bottom=top+el.offsetHeight,vt=page.scrollTop,vb=vt+page.clientHeight;
 if(top<vt-4||top>vb-page.clientHeight*.45||bottom<vt+80){if(saved.scroll==null)saved.scroll=page.scrollTop;page.scrollTo({top:Math.max(0,top),behavior:'auto'})}
}
function demoPointer(){ // move a pretend cursor over the element so pointer effects can be judged from the bin
 stopDemo();if(reduced)return;const t0=performance.now();
 const tick=now=>{const v=mainView();if(v){const c=v.canvas,t=(now-t0)/1000,o=v.opts;
   const cx=c.clientWidth*(.5+o.ox),cy=c.clientHeight*(.5+o.oy),r=Math.min(c.clientWidth,c.clientHeight)*.2;
   v.mouse.x=cx+Math.cos(t*1.3)*r*1.2;v.mouse.y=cy+Math.sin(t*1.7)*r;v.mouse.target=1;v.dirty=true;D.invalidate()}
  demoRaf=requestAnimationFrame(tick)};
 demoRaf=requestAnimationFrame(tick);
}
function stopDemo(){if(demoRaf){cancelAnimationFrame(demoRaf);demoRaf=0;const v=mainView();if(v){v.mouse.target=0;v.dirty=true}}}
function startPreview(el){
 clearTimeout(pvT);clearTimeout(rvT);
 pvT=setTimeout(()=>{
  let next,label,slot=el.dataset.slot;
  if(el.dataset.version!=null){const i=+el.dataset.version,p=C.presets[i];next=normalize(p.cfg);label=`Trying version <b>${pad(i+1)} ${p.name}</b>`;slot='hero'}
  else if(el.dataset.build!=null){const b=S.builds.find(x=>x.id===el.dataset.build);if(!b)return;next=normalize(b.cfg);label=`Trying saved build <b></b>`;slot='hero'}
  else{const v=C.variant(slot,el.dataset.id);next=clone(S.cfg);next[slot]=v.id;if(next.off[slot])delete next.off[slot];
   label=`Trying <b>${C.slotById[slot].name}: ${v.name}</b> ${v.code}. Click to keep it.`}
  apply(next,live);showBadge(label);
  if(el.dataset.build!=null)$('#preview-badge b').textContent=S.builds.find(x=>x.id===el.dataset.build).name;
  if(slot==='project'){if(!openProject)openProj(C.projects[0].id,true)}
  else if(SCREEN_OF[slot])reveal(slot);
  else if(LOOK_SLOTS.includes(slot)&&slot!=='cursor'&&slot!=='transition'&&slot!=='intro')reveal('hero');
  if(slot==='pointer')demoPointer();else stopDemo();
  if(slot==='transition')transition(()=>{});
 },70);
}
function endPreview(){
 clearTimeout(pvT);stopDemo();hideBadge();
 if(tempProject)closeProj(true);
 if(live!==S.cfg)apply(S.cfg,live);
 if(saved){if(saved.screen!=null){screen=saved.screen;page.dataset.at=screen;markNav();refreshText();D.invalidate()}if(saved.scroll!=null)page.scrollTo({top:saved.scroll,behavior:'auto'});saved=null}
}
binBody.addEventListener('pointerover',e=>{if(e.pointerType==='touch')return;const c=e.target.closest('[data-pv]');if(!c||c===hoverEl)return;hoverEl=c;startPreview(c)});
binBody.addEventListener('pointerout',e=>{const c=e.target.closest('[data-pv]');if(!c||c.contains(e.relatedTarget))return;if(hoverEl===c)hoverEl=null;clearTimeout(pvT);rvT=setTimeout(endPreview,90)});
binBody.addEventListener('focusin',e=>{const c=e.target.closest('[data-pv]');if(c&&c.matches(':focus-visible')){hoverEl=c;startPreview(c)}});
binBody.addEventListener('focusout',e=>{const c=e.target.closest('[data-pv]');if(c&&hoverEl===c){hoverEl=null;rvT=setTimeout(endPreview,90)}});

/* ───────── the parts bin ───────── */
function wf(str){
 return `<svg viewBox="0 0 60 40" aria-hidden="true">`+str.split(';').map(t=>{const k=t[0],n=t.slice(1).split(',').map(Number);
  if(k==='r')return `<rect x="${n[0]}" y="${n[1]}" width="${n[2]}" height="${n[3]}" fill="currentColor" opacity="${n[4]==null?1:n[4]}"/>`;
  if(k==='o')return `<rect x="${n[0]}" y="${n[1]}" width="${n[2]}" height="${n[3]}" fill="none" stroke="currentColor" stroke-width=".6" opacity=".65"/>`;
  if(k==='c')return `<circle cx="${n[0]}" cy="${n[1]}" r="${n[2]}" fill="url(#wfdots)"/>`;
  return `<rect x="${n[0]}" y="${n[1]}" width="${n[2]}" height="${n[3]}" fill="url(#wfdots)"/>`}).join('')+`</svg>`;
}
const keepBtn=(slot,v)=>`<button class="keep${S.kept[slot+':'+v.id]?' kept':''}" data-keep="${slot}:${v.id}" aria-pressed="${!!S.kept[slot+':'+v.id]}" aria-label="Keep ${v.name}" title="Keep this part">${S.kept[slot+':'+v.id]?'♥':'♡'}</button>`;
function card(slot,v){
 const on=S.cfg[slot]===v.id&&!S.cfg.off[slot];let thumb='';
 if(v.wf)thumb=wf(v.wf);
 else if(slot==='specimen')thumb=`<img src="${C.thumb(v.id)}" alt="" loading="lazy" width="90" height="90">`;
 else if(slot==='surface')thumb=`<canvas class="dv" data-sthumb data-src="specimen" data-mode="${v.id}" data-cell="2" data-reveal="0" data-scale="1.5"></canvas>`;
 else if(slot==='ink'){const k=v.id==='custom'?inkOf(Object.assign({},S.cfg,{ink:'custom'})):C.inks[v.id];
  thumb=`<span class="sw"><i style="background:${k.bg}"></i><i style="background:radial-gradient(${k.a} 1.2px,transparent 1.5px) 0 0/5px 5px;clip-path:circle(34% at ${k.b?42:50}% 50%)"></i>${k.b?`<i style="background:radial-gradient(${k.b} 1.2px,transparent 1.5px) 2px 2px/5px 5px;clip-path:circle(24% at 64% 46%)"></i>`:''}</span>`}
 else if(slot==='type'){const t=C.types[v.id];thumb=`<span class="aa" style="font-family:${t.display.replace(/"/g,"'")};font-style:${t.style};font-weight:${t.weight};text-transform:${t.up}">Aa</span>`}
 const txt=!thumb;
 return `<div class="vcard${on?' on':''}" data-card="${slot}:${v.id}"><button class="vpick${txt?' txt':''}" data-pv data-slot="${slot}" data-id="${v.id}" title="${(v.hint||'').replace(/"/g,'&quot;')}" aria-pressed="${on}">${thumb}<span class="vn">${v.name}</span><span class="vc">${v.code}</span></button>${keepBtn(slot,v)}</div>`;
}
function slotBlock(id,cols){
 const s=C.slotById[id],cur=C.variant(id,S.cfg[id]),off=!!S.cfg.off[id];
 let list=s.variants,extra='';
 if(id==='specimen'){const cats=['All',...new Set(C.elements.map(e=>e.cat))];
  extra=`<div class="filters">${cats.map(c=>`<button data-filter="${c}" class="${S.filter===c?'on':''}">${c}</button>`).join('')}</div>`;
  if(S.filter!=='All')list=list.filter(v=>v.cat===S.filter)}
 return `<section class="slot${off?' is-off':''}" data-slotbox="${id}"><div class="slot-head"><h3>${s.name}<span data-cur="${id}">${off?'Removed':(id==='ink'?inkOf(S.cfg).name:cur.name)}</span></h3>
  ${s.removable?`<button class="s-act" data-off="${id}">${off?'Add back':'Remove'}</button>`:''}<button class="s-act" data-lock="${id}" aria-pressed="${!!S.locked[id]}" title="Shuffle skips locked parts">${S.locked[id]?'Locked':'Lock'}</button></div>
  ${extra}<div class="vgrid ${cols||''}">${list.map(v=>card(id,v)).join('')}</div>${id==='ink'&&S.cfg.ink==='custom'?customPanel():''}</section>`;
}
function customPanel(){const c=S.cfg.custom;
 return `<div class="custom"><label>Ink<input type="color" data-custom="a" value="${c.a}"></label><label>Second ink<input type="color" data-custom="b" value="${c.b}"></label><label>Ground<input type="color" data-custom="bg" value="${c.bg}"></label></div>
 <div class="toggles" style="margin-top:8px"><label><input type="checkbox" data-custom-duo ${c.duo?'checked':''}> Use two inks</label></div>`}
function sheetText(){
 const c=S.cfg,line=(id)=>{const s=C.slotById[id],v=C.variant(id,c[id]);return c.off[id]?`(removed)  ${s.name}`:`${v.code.padEnd(7)} ${s.name}: ${id==='ink'?inkOf(c).name:v.name}`};
 const kept=Object.keys(S.kept).map(k=>{const[s,i]=k.split(':'),v=C.variant(s,i);return `${v.code} ${v.name}`});
 return ['Dither Portfolio Builder, build sheet',`Started from version ${pad(S.version+1)}, ${C.presets[S.version].name}`,'','PARTS',...PART_SLOTS.map(line),'','LOOK',...LOOK_SLOTS.map(line),
  `GRAIN   ${c.grain}`,...(c.ink==='custom'?[`CUSTOM  ink ${c.custom.a}${c.custom.duo?', second ink '+c.custom.b:''}, ground ${c.custom.bg}`]:[]),
  `EXTRAS  ${C.extras.map(x=>x.name.toLowerCase()+' '+(c.extras[x.id]?'on':'off')).join(', ')}`,
  ...(kept.length?['','KEPT',kept.join(', ')]:[]),...(S.notes.trim()?['','NOTES',S.notes.trim()]:[])].join('\n');
}
function renderBin(){
 unmount(binBody);
 $$('.bin-tabs [data-tab]').forEach(b=>b.setAttribute('aria-selected',String(b.dataset.tab===S.tab)));
 let h='';
 if(S.tab==='versions'){
  h=`<p class="hint">Ten complete versions. Move over one to try it on the page, click to start from it. Every part can be swapped afterwards.</p>`+
   C.presets.map((p,i)=>{const k=C.inks[p.cfg.ink];return `<button class="ver${S.version===i?' on':''}" data-pv data-version="${i}"><canvas class="dv" data-src="${p.cfg.specimen}" data-mode="${p.cfg.surface}" data-cell="2" data-reveal="0" data-scale="1.08" data-inka="${k.a}" data-inkb="${k.b||k.a}" data-bg="${k.bg}" data-duo="${k.b?1:0}" data-positive="${k.positive?1:0}"></canvas><span><b>${p.name}<i>${pad(i+1)}</i></b><span>${p.blurb}</span></span></button>`}).join('');
 }else if(S.tab==='parts'){
  h=`<p class="hint">Move over a part to preview it on the page. Click to use it, tap the heart to keep it for later, or remove a section entirely.</p>`+
   PART_SLOTS.map(s=>slotBlock(s,C.slotById[s].variants.length===2?'two':'')).join('');
 }else if(S.tab==='look'){
  h=`<p class="hint">How everything is drawn. These apply to the whole page at once.</p>`+slotBlock('specimen','five')+slotBlock('surface','four')+slotBlock('ink','four')+
   `<section class="slot" data-slotbox="grain"><div class="slot-head"><h3>Grain<span>dot size</span></h3><button class="s-act" data-lock="grain" aria-pressed="${!!S.locked.grain}">${S.locked.grain?'Locked':'Lock'}</button></div><div class="range"><input type="range" id="grain-range" min="2" max="8" step="1" value="${S.cfg.grain}" aria-label="Grain"><output id="grain-out">${S.cfg.grain} px</output></div></section>`+
   ['pointer','air','backdrop'].map(s=>slotBlock(s)).join('')+slotBlock('type')+['cursor','transition','intro'].map(s=>slotBlock(s)).join('')+
   `<section class="slot" data-slotbox="extras"><div class="slot-head"><h3>Cabinet details<span>small touches</span></h3></div><div class="toggles">${C.extras.map(x=>`<label title="${x.hint}"><input type="checkbox" data-extra="${x.id}" ${S.cfg.extras[x.id]?'checked':''}> ${x.name}</label>`).join('')}</div></section>`;
 }else{
  const kept=Object.keys(S.kept);
  h=`<p class="hint">Everything on the page right now, by label. Copy it into the chat and it can be built exactly.</p><pre class="sheet" id="sheet" tabindex="0"></pre>
   <div class="build-row"><button class="b-btn hot" id="copy-sheet">Copy build sheet</button><button class="b-btn" id="replay">Replay opening</button><button class="b-btn" id="reset">Start over</button></div>
   <h4>Kept parts</h4>${kept.length?`<div class="kept-list">${kept.map(k=>{const[s,i]=k.split(':'),v=C.variant(s,i);return `<button data-pv data-slot="${s}" data-id="${i}"><code>${v.code}</code>${v.name}</button>`}).join('')}</div>`:`<p class="hint">Tap the heart on any part to collect it here. Kept parts stay while you move between versions.</p>`}
   <h4>Notes</h4><textarea id="notes" rows="4" placeholder="What to keep, change or combine" aria-label="Notes"></textarea>
   <h4>Saved builds</h4><div class="build-row"><input type="text" id="build-name" placeholder="Name this build" maxlength="40" aria-label="Build name"></div><div class="build-row"><button class="b-btn" id="save-build">Save this build</button></div>
   <div id="builds">${S.builds.map(b=>`<div class="saved"><span></span><button class="b-btn" data-pv data-build="${b.id}">Load</button><button class="b-btn" data-del="${b.id}">Delete</button></div>`).join('')}</div>
   <p class="sync" id="sync"></p>`;
 }
 binBody.innerHTML=h;
 if(S.tab==='build'){$('#sheet').textContent=sheetText();$('#notes').value=S.notes;$('#sync').textContent=syncMsg;$$('#builds .saved span').forEach((n,i)=>{n.textContent=S.builds[i].name})}
 mount(binBody);
 $('#bin-sub').textContent=`Version ${pad(S.version+1)}, ${C.presets[S.version].name}`;
 $('#undo').disabled=!history.length;
}
function syncBin(){ // cheap update after a change, without rebuilding the tab
 $$('.vcard',binBody).forEach(c=>{const[s,i]=c.dataset.card.split(':'),on=S.cfg[s]===i&&!S.cfg.off[s];c.classList.toggle('on',on);c.firstElementChild.setAttribute('aria-pressed',String(on))});
 $$('[data-cur]',binBody).forEach(n=>{const id=n.dataset.cur;n.textContent=S.cfg.off[id]?'Removed':(id==='ink'?inkOf(S.cfg).name:C.variant(id,S.cfg[id]).name)});
 $$('.ver',binBody).forEach(v=>v.classList.toggle('on',+v.dataset.version===S.version));
 const sh=$('#sheet');if(sh)sh.textContent=sheetText();
 const g=$('#grain-range');if(g){g.value=S.cfg.grain;$('#grain-out').textContent=S.cfg.grain+' px'}
 $$('[data-extra]',binBody).forEach(i=>{i.checked=!!S.cfg.extras[i.dataset.extra]});
 const needCustom=S.cfg.ink==='custom',has=!!$('.custom',binBody);
 if(S.tab==='look'&&needCustom!==has){const y=binBody.scrollTop;renderBin();binBody.scrollTop=y}
 $('#bin-sub').textContent=`Version ${pad(S.version+1)}, ${C.presets[S.version].name}`;
 $('#undo').disabled=!history.length;
}
function focusSlot(slot){
 app.classList.remove('bin-off');$('#bin-show').hidden=true;
 const tab=PART_SLOTS.includes(slot)?'parts':'look';
 if(S.tab!==tab){S.tab=tab;renderBin()}
 const box=$(`[data-slotbox="${slot}"]`,binBody);
 if(box){binBody.scrollTo({top:box.offsetTop-binBody.offsetTop-6,behavior:reduced?'auto':'smooth'});box.classList.remove('flash');void box.offsetWidth;box.classList.add('flash')}
}
binBody.addEventListener('click',e=>{
 const t=e.target;let n;
 if((n=t.closest('[data-keep]'))){const k=n.dataset.keep;if(S.kept[k])delete S.kept[k];else S.kept[k]=true;n.classList.toggle('kept',!!S.kept[k]);n.textContent=S.kept[k]?'♥':'♡';n.setAttribute('aria-pressed',String(!!S.kept[k]));persist();return}
 if((n=t.closest('[data-version]'))){const i=+n.dataset.version;commit(clone(C.presets[i].cfg),{version:i});screen='home';page.dataset.at='home';page.scrollTop=0;playIntro();return}
 if((n=t.closest('[data-build]'))){const b=S.builds.find(x=>x.id===n.dataset.build);if(b){commit(clone(b.cfg));toast('Build loaded')}return}
 if((n=t.closest('[data-del]'))){const id=n.dataset.del;S.builds=S.builds.filter(b=>b.id!==id);if(db)db.doc('builds/'+id).delete().catch(()=>{});persist();renderBin();return}
 if((n=t.closest('.vpick,[data-pv][data-slot]'))){const s=n.dataset.slot,patch={[s]:n.dataset.id};if(S.cfg.off[s]){patch.off=Object.assign({},S.cfg.off);delete patch.off[s]}commit(patch);if(s==='intro')playIntro();return}
 if((n=t.closest('[data-off]'))){const s=n.dataset.off,off=Object.assign({},S.cfg.off);if(off[s])delete off[s];else off[s]=true;commit({off});const y=binBody.scrollTop;renderBin();binBody.scrollTop=y;return}
 if((n=t.closest('[data-lock]'))){const s=n.dataset.lock;if(S.locked[s])delete S.locked[s];else S.locked[s]=true;n.setAttribute('aria-pressed',String(!!S.locked[s]));n.textContent=S.locked[s]?'Locked':'Lock';saveLocal();return}
 if((n=t.closest('[data-filter]'))){S.filter=n.dataset.filter;const y=binBody.scrollTop;renderBin();binBody.scrollTop=y;return}
 if(t.id==='copy-sheet'){copyText(sheetText(),'Build sheet copied');return}
 if(t.id==='replay'){page.scrollTop=0;playIntro();return}
 if(t.id==='reset'){commit(clone(C.presets[0].cfg),{version:0});toast('Back to version 01. Undo brings your build back.');renderBin();return}
 if(t.id==='save-build'){const name=($('#build-name').value||'').trim()||`Build ${S.builds.length+1}`,id='b'+Date.now().toString(36);
  S.builds.push({id,name,cfg:clone(S.cfg)});if(db)db.doc('builds/'+id).set({name,cfg:clone(S.cfg),sheet:sheetText(),createdAt:new Date().toISOString()}).catch(()=>{});persist();renderBin();toast('Build saved');return}
});
binBody.addEventListener('input',e=>{
 const t=e.target;
 if(t.id==='grain-range'){$('#grain-out').textContent=t.value+' px';const next=clone(S.cfg);next.grain=+t.value;apply(next,live);return}
 if(t.id==='notes'){S.notes=t.value;persist();return}
 if(t.dataset.custom){const next=clone(live);next.custom[t.dataset.custom]=t.value;apply(next,live);return}
});
binBody.addEventListener('change',e=>{
 const t=e.target;
 if(t.id==='grain-range'){commit({grain:+t.value});return}
 if(t.dataset.custom){const custom=Object.assign({},S.cfg.custom,{[t.dataset.custom]:t.value});commit({custom});return}
 if(t.matches('[data-custom-duo]')){commit({custom:Object.assign({},S.cfg.custom,{duo:t.checked})});return}
 if(t.dataset.extra){commit({extras:Object.assign({},S.cfg.extras,{[t.dataset.extra]:t.checked})});return}
});
$$('.bin-tabs [data-tab]').forEach(b=>b.addEventListener('click',()=>{endPreview();S.tab=b.dataset.tab;renderBin();binBody.scrollTop=0}));
$('#shuffle').addEventListener('click',()=>{
 const patch={},pick=a=>a[Math.floor(Math.random()*a.length)];
 PART_SLOTS.concat(LOOK_SLOTS).forEach(s=>{if(S.locked[s])return;let vs=C.slotById[s].variants;if(s==='ink')vs=vs.filter(v=>v.id!=='custom');if(s==='intro')return;patch[s]=pick(vs).id});
 if(!S.locked.grain)patch.grain=2+Math.floor(Math.random()*4);
 commit(patch);screen='home';page.dataset.at='home';page.scrollTop=0;replayVisible();
});
$('#undo').addEventListener('click',undo);
$('#labels').addEventListener('change',e=>{S.labels=e.target.checked;app.classList.toggle('labels-on',S.labels);saveLocal()});
$('#bin-hide').addEventListener('click',()=>{endPreview();app.classList.add('bin-off');$('#bin-show').hidden=false});
$('#bin-show').addEventListener('click',()=>{app.classList.remove('bin-off');$('#bin-show').hidden=true});

/* ───────── start ───────── */
const defs=document.createElement('div');defs.innerHTML='<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs><pattern id="wfdots" width="2" height="2" patternUnits="userSpaceOnUse"><rect width="1" height="1" fill="#ecebe5"/><rect x="1" y="1" width="1" height="1" fill="#ecebe5" opacity=".5"/></pattern></defs></svg>';document.body.appendChild(defs.firstChild);
const hadLocal=loadLocal();
live=S.cfg;narrow=stage.clientWidth<760;
app.classList.toggle('labels-on',S.labels);$('#labels').checked=S.labels;
D.init();
applyType(S.cfg);applyLook(S.cfg);setCursor(S.cfg);setBackdrop(S.cfg);
buildPage(S.cfg);renderBin();playIntro();
let rsT=0;
new ResizeObserver(()=>{clearTimeout(rsT);rsT=setTimeout(()=>{const n=stage.clientWidth<760;if(n!==narrow){narrow=n;buildPage(live)}else{refreshText();D.invalidate();onScroll()}},120)}).observe(stage);
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(refreshText);
initDb(hadLocal);
window.__builder={S,commit,apply,go,openProj,sheetText,get live(){return live}};
})();
