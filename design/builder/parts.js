/* Page parts. Each function returns the markup for one variant of one slot.
   <canvas class="dv"> placeholders are turned into dither views by app.js. */
(function(){
'use strict';
const {me,projects,elements}=window.CAT;
const dv=(src,o)=>{o=o||{};const a=Object.entries(o).map(([k,v])=>` data-${k}="${v}"`).join('');return `<canvas class="dv${o.cls?' '+o.cls:''}" data-src="${src}"${a} aria-hidden="true"></canvas>`};
const caption=cfg=>cfg.extras.caption?`<div class="capline"><span class="tiny-cross">+</span><span data-bind="surface-name"></span><span class="rule"></span><span data-bind="spec-name"></span><span class="rec">Live</span></div>`:'';
const head=(title,sub)=>`<header class="sec-head"><h2 class="display">${title}</h2><p>${sub}</p></header>`;
const address=`<span class="addr">antonilin107<wbr>@gmail.com</span>`;

const nav={
 bar:cfg=>`<header class="part n-bar" data-slot="nav"><button class="brand" data-go="home" aria-label="Anton Ilin, home">A<span class="brand-dot">·</span>I</button>${cfg.extras.edition?`<span class="edition">Anton Ilin, portfolio<br><small>2026 edition, drawn in dots</small></span>`:''}<nav>${links(cfg)}</nav></header>`,
 corners:cfg=>`<div class="part n-corners" data-slot="nav"><button class="nc tl" data-go="home">Anton Ilin</button>${corner(cfg,'work','tr','Work')}${corner(cfg,'about','bl','About')}${corner(cfg,'contact','br','Contact')}</div>`,
 dock:cfg=>`<nav class="part n-dock" data-slot="nav"><button data-go="home" data-nav="home">Home</button>${links(cfg)}</nav>`,
 rail:cfg=>`<nav class="part n-rail" data-slot="nav"><button class="brand" data-go="home" aria-label="Anton Ilin, home">A<span class="brand-dot">·</span>I</button><div class="rail-links">${links(cfg)}</div><span class="rail-foot">2026</span></nav>`,
 index:cfg=>`<div class="part n-index" data-slot="nav"><button class="ni-name" data-go="home">Anton Ilin</button><button class="ni-open" data-menu aria-expanded="false">Index</button>
  <div class="ni-menu" hidden><ol>${['home','work','about','contact'].filter(s=>s==='home'||!cfg.off[s]).map((s,i)=>`<li><button class="display" data-go="${s}" data-menu-el="${['specimen','coral','bust','hand'][i]}">${s[0].toUpperCase()+s.slice(1)}</button></li>`).join('')}</ol>${dv('specimen',{cls:'ni-art',scale:.86,reveal:0})}</div></div>`
};
function links(cfg){return ['work','about','contact'].filter(s=>!cfg.off[s]).map(s=>`<button data-go="${s}" data-nav="${s}">${s[0].toUpperCase()+s.slice(1)}${s==='work'?` <span>${projects.length}</span>`:''}</button>`).join('')}
function corner(cfg,s,pos,label){return cfg.off[s]?'':`<button class="nc ${pos}" data-go="${s}" data-nav="${s}">${label}</button>`}

const hero={
 cabinet:cfg=>`<section class="part p-hero h-cabinet" data-slot="hero">${dv('specimen',{cls:'fill',scale:.8,ox:.14,int:1,main:1})}
  <div class="hc-copy"><p class="eyebrow"><span data-bind="spec-serial"></span><span class="slash">/</span><span data-bind="spec-cat"></span></p>
  <h1 class="display">Anton Ilin,<br><em>in dots.</em></h1><p class="lede">${me.intro}</p>
  <div class="hc-actions"><button class="round" data-spec="-1" aria-label="Previous element">←</button><button class="round" data-spec="1" aria-label="Next element">→</button><button class="pill" data-go="work">See the work</button><button class="pill" data-air-toggle aria-pressed="false">Wind ≋</button></div></div>${caption(cfg)}</section>`,
 monolith:cfg=>`<section class="part p-hero h-monolith" data-slot="hero">${dv('specimen',{cls:'fill',scale:1.1,int:1,main:1})}
  <h1 class="display mono-name"><span>Anton</span><span>Ilin</span></h1>
  <p class="mono-l">${me.role},<br>${me.school}, ${me.place}</p><p class="mono-r">${me.line}</p>
  <button class="pill mono-cta" data-go="work">See the work</button>${caption(cfg)}</section>`,
 plate:cfg=>`<section class="part p-hero h-plate" data-slot="hero"><figure class="plate"><i class="x tl">+</i><i class="x tr">+</i><i class="x bl">+</i><i class="x br">+</i><div class="art">${dv('specimen',{scale:.84,int:1,main:1})}</div>
  <figcaption><span>Plate <b data-bind="spec-serial"></b></span><span data-bind="spec-name"></span><span data-bind="surface-name"></span></figcaption></figure>
  <div class="plate-copy"><p class="small">${me.name}, ${me.role}</p><h1 class="display">${me.line}</h1><p class="lede">${me.intro}</p>
  <ul class="plate-links">${projects.map(p=>`<li><button data-open="${p.id}"><span>${p.title}</span><span>${p.kind}</span></button></li>`).join('')}</ul></div></section>`,
 dots:cfg=>`<section class="part p-hero h-dots" data-slot="hero"><h1 class="sr">Anton Ilin</h1>${dv('name',{cls:'dots-name',int:1,main:1,lens:1.2})}
  <div class="dots-row"><p>${me.role}<br>${me.school}, ${me.place}</p><p>${me.line}</p><p><button class="link" data-go="work">See the work</button><br><button class="link" data-go="contact">Get in touch</button></p></div></section>`,
 catalogue:cfg=>`<section class="part p-hero h-catalogue" data-slot="hero"><header class="cat-head"><h1 class="display">Anton Ilin</h1><p>${me.role} in ${me.place}. ${me.line}</p></header>
  <div class="cat-grid">${projects.map((p,i)=>`<button class="cat-tile" data-open="${p.id}"><span class="art">${dv(p.el,{scale:.96,int:1,lens:.55})}</span><span class="cat-n">Fig. ${i+1}</span><b class="display">${p.title}</b><span class="cat-k">${p.kind}</span></button>`).join('')}</div></section>`,
 scrub:cfg=>`<section class="part p-hero h-scrub" data-slot="hero" data-scrub><div class="scrub-stick">${dv('specimen',{cls:'fill',scale:.9,ox:-.16,int:1,main:1,scrub:1,reveal:0})}<div class="scrub-meter" aria-hidden="true"><i></i><span>grain</span></div>${caption(cfg)}</div>
  <div class="scrub-steps"><div><p class="display">From far away, a few dots.</p></div><div><p class="display">Closer, a shape.</p></div>
  <div><h1 class="display">Anton Ilin. Software, resolved.</h1><p class="lede">${me.intro}</p><button class="pill" data-go="work">See the work</button></div></div></section>`,
 split:cfg=>`<section class="part p-hero h-split" data-slot="hero"><div class="split-l"><p class="small">${me.role}, ${me.place}</p><h1 class="display">Anton<br>Ilin</h1><p class="lede">${me.line}</p><button class="pill" data-go="work">See the work</button></div>
  <div class="split-r">${dv('specimen',{cls:'fill',scale:.84,int:1,main:1})}${caption(cfg)}</div></section>`
};

const work={
 plates:cfg=>`<section class="part p-work w-plates" data-slot="work" data-screen="work">${head('Selected work','Four things I designed, built and tested.')}
  <div class="plates">${projects.map(p=>`<button class="wplate" data-open="${p.id}">${dv(p.el,{scale:.8,int:1,lens:.6})}<span class="wp-meta"><b class="display">${p.title}</b><span>${p.one}</span></span><span class="wp-kind">${p.kind}</span></button>`).join('')}</div></section>`,
 ledger:cfg=>`<section class="part p-work w-ledger" data-slot="work" data-screen="work">${head('Selected work','Move across a row to see its specimen.')}
  <ol class="ledger">${projects.map(p=>`<li><button data-open="${p.id}" data-hover-el="${p.el}"><span class="lg-title display">${p.title}</span><span class="lg-one">${p.one}</span><span class="lg-kind">${p.kind}</span></button></li>`).join('')}</ol>
  ${dv(projects[0].el,{cls:'ledger-float',scale:.9,reveal:0,opaque:1})}</section>`,
 filmstrip:cfg=>`<section class="part p-work w-film" data-slot="work" data-screen="work">${head('Selected work','Drag the strip sideways.')}
  <div class="film" tabindex="0" aria-label="Projects">${projects.map((p,i)=>`<button class="frame" data-open="${p.id}"><span class="fr-n">${String(i+1).padStart(2,'0')}</span>${dv(p.el,{scale:.84,int:1,lens:.6})}<b class="display">${p.title}</b><span class="fr-one">${p.one}</span></button>`).join('')}</div></section>`,
 panels:cfg=>`<section class="part p-work w-panels" data-slot="work" data-screen="work">${projects.map((p,i)=>`<article class="panel${i%2?' flip':''}"><div class="pn-copy"><span class="small">${p.kind}</span><h3 class="display">${p.title}</h3><p>${p.one}</p><button class="pill" data-open="${p.id}">Open project</button></div>${dv(p.el,{scale:.84,int:1})}</article>`).join('')}</section>`,
 drawers:cfg=>`<section class="part p-work w-drawers" data-slot="work" data-screen="work">${head('Selected work','Open a drawer.')}
  ${projects.map((p,i)=>`<details class="drawer" name="work-drawers"${i===0?' open':''}><summary><span class="display">${p.title}</span><span class="dr-kind">${p.kind}</span><i aria-hidden="true"></i></summary><div class="dr-body">${dv(p.el,{scale:.86,int:1,lens:.6})}<div><p>${p.long}</p><ul class="tags">${p.tags.map(t=>`<li>${t}</li>`).join('')}</ul><button class="pill" data-open="${p.id}">Open project</button></div></div></details>`).join('')}</section>`
};

function project(variant,id){
 const i=Math.max(0,projects.findIndex(p=>p.id===id)),p=projects[i],next=projects[(i+1)%projects.length];
 return `<div class="part pv pv-${variant}" data-slot="project" role="dialog" aria-modal="true" aria-label="${p.title}"><div class="pv-scrim" data-close></div><div class="pv-box">
  <button class="pv-close" data-close>${variant==='page'?'← Back':'Close ×'}</button>
  <div class="pv-art">${dv(p.el,{scale:.86,int:1})}</div>
  <div class="pv-copy"><p class="small">${p.kind}</p><h2 class="display">${p.title}</h2><p class="lede">${p.long}</p>
  <dl>${p.facts.map(f=>`<div><dt>${f[0]}</dt><dd>${f[1]}</dd></div>`).join('')}</dl>
  <ul class="tags">${p.tags.map(t=>`<li>${t}</li>`).join('')}</ul>
  <button class="pill" data-open="${next.id}">Next: ${next.title}</button></div></div></div>`;
}

const about={
 statement:cfg=>`<section class="part p-about a-statement" data-slot="about" data-screen="about"><p class="display big">${me.belief}</p>
  <div class="a-cols"><p>${me.intro} ${me.about}</p><dl>${me.facts.slice(0,3).map(f=>`<div><dt>${f[0]}</dt><dd>${f[1]}</dd></div>`).join('')}</dl></div></section>`,
 spec:cfg=>`<section class="part p-about a-spec" data-slot="about" data-screen="about"><div class="a-fig">${dv('specimen',{scale:.84,int:1})}</div>
  <div class="a-sheet"><p class="eyebrow">${elements.length+1}<span class="slash">/</span>Developer</p><h2 class="display">Anton Ilin</h2><p class="lede">The cabinet holds ${elements.length} elements. This is the one that made them.</p>
  <dl>${me.facts.map(f=>`<div><dt>${f[0]}</dt><dd>${f[1]}</dd></div>`).join('')}</dl></div></section>`,
 colophon:cfg=>`<section class="part p-about a-colophon" data-slot="about" data-screen="about"><h2 class="display">About</h2>
  <div class="cols2"><p>${me.intro} ${me.about}</p><p>${me.belief}</p></div>
  <p class="colo">This site is drawn in your browser. Every image is an element from the Dither Cabinet, set as <span data-bind="surface-name-lc"></span> in <span data-bind="ink-name-lc"></span> ink.</p></section>`
};

const flat=me.stack.flatMap(g=>g[1]);
const stack={
 marquee:cfg=>`<section class="part p-stack s-marquee" data-slot="stack" data-screen="about"><h2 class="sr">Tools I work with</h2><div class="mq"><div class="mq-in display">${[0,1].map(()=>flat.map(s=>`<span>${s}</span><i>/</i>`).join('')).join('')}</div></div></section>`,
 groups:cfg=>`<section class="part p-stack s-groups" data-slot="stack" data-screen="about"><h2 class="display">Tools</h2><div class="groups">${me.stack.map(g=>`<div><h3>${g[0]}</h3><ul>${g[1].map(s=>`<li>${s}</li>`).join('')}</ul></div>`).join('')}</div></section>`,
 dotted:cfg=>`<section class="part p-stack s-dotted" data-slot="stack" data-screen="about"><h2 class="sr">Tools I work with</h2><ul class="sr">${flat.map(s=>`<li>${s}</li>`).join('')}</ul>${dv('stack',{int:1,lens:.8})}</section>`
};

const contact={
 email:cfg=>`<section class="part p-contact c-email" data-slot="contact" data-screen="contact"><div class="ce-copy"><p class="small">${me.status}</p><p class="display mail">${address}</p>
  <p class="lede">Write to me about a role, a project, or the cabinet.</p><button class="pill" data-copy>Copy address</button></div>${dv('hand',{scale:.9,int:1})}</section>`,
 slip:cfg=>`<section class="part p-contact c-slip" data-slot="contact" data-screen="contact"><form class="slip" data-form novalidate><h2 class="display">Leave a message</h2><p class="small">${me.status}</p>
  <label for="f-name">Your name</label><input id="f-name" name="name" autocomplete="name">
  <label for="f-mail">Your email</label><input id="f-mail" name="email" type="email" autocomplete="email">
  <label for="f-msg">Message</label><textarea id="f-msg" name="message" rows="3"></textarea>
  <div class="slip-foot"><button class="pill" type="submit">Send message</button><span>or write to ${address}</span></div></form></section>`,
 strip:cfg=>`<section class="part p-contact c-strip" data-slot="contact" data-screen="contact"><p class="display">${me.status}.</p><p class="cs-addr">${address}</p><button class="pill" data-copy>Copy address</button></section>`
};

const footer={
 line:cfg=>`<footer class="part p-footer f-line" data-slot="footer" data-screen="contact"><span>© 2026 Anton Ilin</span><nav>${['work','about','contact'].filter(s=>!cfg.off[s]).map(s=>`<button class="link" data-go="${s}">${s[0].toUpperCase()+s.slice(1)}</button>`).join('')}</nav></footer>`,
 colophon:cfg=>`<footer class="part p-footer f-colophon" data-slot="footer" data-screen="contact"><div class="strip" data-strip aria-label="Change the specimen"></div>
  <div class="fc-row"><p>Pick an element above to change the one this site is drawn with.<br>Nothing here is tracked. It is all rendered in your browser, as dots.</p><span>© 2026 Anton Ilin</span></div></footer>`
};

window.PARTS={nav,hero,work,about,stack,contact,footer,project};
})();
