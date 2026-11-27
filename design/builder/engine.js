/* Dither engine for the portfolio builder.
   A compact port of the Dither Cabinet's second pass: a tone source (an element
   image, a canvas of type, or a procedural field) is turned into dots, lines or
   glyphs in screen space. One shared WebGL2 context draws every view on the page
   and blits it into that view's 2D canvas, so any number of views can coexist. */
(function(){
'use strict';
const GLYPHS=' .:-=+*#%@';
const MODES={dither:0,pixel:1,stipple:2,halftone:3,engrave:4,hatch:5,contour:6,glyph:7};
const PTR={still:0,lens:1,lamp:2,pull:3,disperse:4};
const SRC={image:0,field:1,horizon:2};

const VS=`#version 300 es
in vec2 a;void main(){gl_Position=vec4(a,0.,1.);}`;

const FS=`#version 300 es
precision highp float;precision highp int;
uniform sampler2D u_tex,u_blue,u_glyph;
uniform vec2 u_res;uniform vec4 u_rect;uniform vec4 u_mouse;uniform vec3 u_inkA,u_inkB,u_bg;
uniform float u_lodBase,u_cell,u_time,u_dpr,u_glyphs,u_reveal,u_exposure,u_under,u_bloom,u_duo,u_split,u_positive,u_wind,u_drift,u_lamp,u_gain,u_clear;
uniform int u_mode,u_src,u_ptr;
out vec4 o;
const float B4[16]=float[16](0.,8.,2.,10.,12.,4.,14.,6.,3.,11.,1.,9.,15.,7.,13.,5.);
float bayer4(vec2 c){ivec2 i=ivec2(mod(c,4.));return (B4[i.y*4+i.x]+.5)/16.;}
float bayer8(vec2 c){ivec2 i=ivec2(mod(c,8.));int n=0;for(int b=0;b<3;b++){int x=(i.x>>b)&1,y=(i.y>>b)&1;n|=((x^y)*2+y)<<(4-b*2);}return (float(n)+.5)/64.;}
float blue(vec2 c){return texelFetch(u_blue,ivec2(mod(c,64.)),0).r;}
float cellLod(float c){return max(0.,log2(c)-1.);}
vec2 rot(vec2 v,float a){float c=cos(a),s=sin(a);return vec2(c*v.x-s*v.y,s*v.x+c*v.y);}
float stripes(vec2 px,float ang,float period,float width,float offset){
 float f=dot(px,vec2(cos(ang),sin(ang)))/period+offset;float d=abs(fract(f)-.5)*period;
 return clamp(min(width,width*.5-d+.5),0.,1.);}
float hash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
float vnoise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
 return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float a=.5,s=0.;for(int i=0;i<4;i++){s+=a*vnoise(p);p=p*2.03+vec2(17.,9.);a*=.5;}return s;}
vec2 warp(vec2 p){
 vec2 r=(p-u_rect.xy)/u_rect.zw;
 if(u_wind>0.){float w=pow(clamp(.62-r.y*.5,0.,1.),1.5);
  p.x+=(sin(p.y*.011/u_dpr+u_time*1.6)+.5*sin(p.y*.027/u_dpr-u_time*2.3+r.x*2.))*u_rect.z*.04*w*u_wind;
  p.y+=sin(p.x*.013/u_dpr+u_time*1.1)*u_rect.w*.012*w*u_wind;}
 if(u_drift>0.){p-=vec2(sin(u_time*.31),cos(u_time*.23))*u_rect.z*.04*u_drift;
  float a=sin(u_time*.17)*.06*u_drift;p=u_rect.xy+rot(p-u_rect.xy,a);}
 if(u_ptr==3&&u_mouse.w>0.){vec2 d=p-u_mouse.xy;float R=u_mouse.z*1.7,f=clamp(1.-length(d)/R,0.,1.);p-=d*f*f*.6*u_mouse.w;}
 return p;}
float raw(vec2 p,float slod){
 if(u_src==1){vec2 q=p/u_res.y;float n=fbm(q*1.6+vec2(u_time*.025,-u_time*.018)+fbm(q*1.1-u_time*.012)*1.5);
  return smoothstep(.3,.9,n);}
 if(u_src==2){vec2 q=p/u_res;float n=fbm(vec2(q.x*3.,u_time*.03))*.22;
  return smoothstep(.25,1.,q.y+n-.1)*.9;}
 vec2 uv=(p-u_rect.xy)/(2.*u_rect.zw)+.5;
 if(uv.x<0.||uv.y<0.||uv.x>1.||uv.y>1.)return 0.;
 vec3 c=textureLod(u_tex,uv,max(0.,slod+u_lodBase)).rgb;return dot(c,vec3(.299,.587,.114));}
vec2 at(vec2 px,float slod){
 if(u_ptr==4&&u_mouse.w>0.){float R=u_mouse.z*1.5,f=clamp(1.-length(px-u_mouse.xy)/R,0.,1.);
  vec2 c=floor(px/max(2.,u_cell));px+=(vec2(blue(c),blue(c+vec2(31.,17.)))-.5)*R*1.3*f*f*u_mouse.w;}
 vec2 p=warp(px);float t=raw(p,slod);
 if(u_src==0&&u_lamp>0.){float e=max(2.,u_cell)*1.4,l=slod+1.5;
  float gx=raw(p+vec2(e,0.),l)-raw(p-vec2(e,0.),l),gy=raw(p+vec2(0.,e),l)-raw(p-vec2(0.,e),l);
  vec3 n=normalize(vec3(-gx*7.,-gy*7.,1.));
  vec3 L=normalize(vec3(u_mouse.xy-px,u_rect.z*.55));
  float fall=clamp(1.2-length(u_mouse.xy-px)/(u_rect.z*2.4),.15,1.2);
  t*=mix(1.,(.25+1.25*max(dot(n,L),0.))*fall,u_lamp);}
 float cov=step(.02,t);
 t=clamp(t*u_exposure*u_gain,0.,1.);
 if(u_positive>.5)t=max(0.,cov-t)*.92;
 return vec2(t,cov);}
void main(){
 vec2 px=vec2(gl_FragCoord.x,u_res.y-gl_FragCoord.y);
 float cell=max(1.,u_cell),ink=0.,tone=0.,cov=0.,order=bayer8(floor(px/max(2.,cell)));
 if(u_mode==0){
  vec2 c=floor(px/cell);vec2 s=at((c+.5)*cell,cellLod(cell));tone=s.x;cov=s.y;order=bayer8(c);
  ink=(cov>.02&&tone>.018&&tone>order)?1.:0.;
 }else if(u_mode==1){
  vec2 c=floor(px/cell),k=floor(px-c*cell);vec2 s=at((c+.5)*cell,cellLod(cell));tone=s.x;cov=s.y;order=bayer4(c);
  float dot=max(1.,floor(cell*.75+.25));
  ink=(cov>.02&&tone>order*.88+.035&&max(k.x,k.y)<dot)?.45+tone*.55:0.;
 }else if(u_mode==2){
  vec2 c=floor(px/cell);order=blue(c);
  vec2 jit=(vec2(blue(c+vec2(17.,5.)),blue(c+vec2(3.,29.)))-.5)*.4;
  vec2 s=at((c+.5)*cell,cellLod(cell));tone=s.x;cov=s.y;
  float r=(.55+tone*.55)*.45*cell,d=length(px-(c+.5+jit)*cell);
  ink=(cov>.02&&tone>order*.88+.035)?clamp(min(r*2.,r-d+.5),0.,1.)*(.5+tone*.5):0.;
 }else if(u_mode==3){
  float hc=cell*1.5;vec2 q=rot(px,.7853982),c=floor(q/hc),cq=(c+.5)*hc;
  vec2 s=at(rot(cq,-.7853982),cellLod(hc)+.5);tone=s.x;cov=s.y;order=bayer8(c);
  float r=sqrt(clamp(tone,0.,1.))*hc*.72;
  ink=tone>.03?clamp(min(r*2.,r-length(q-cq)+.5),0.,1.)*(.6+tone*.4):0.;
 }else if(u_mode==4){
  float ec=cell*1.6;vec2 s=at(px,0.);tone=s.x;cov=s.y;float broad=at(px,4.).x;
  float w=clamp(tone*1.2,0.,1.)*ec*.9;
  ink=cov>.02?stripes(px,.52,ec,w,broad*1.4):0.;
 }else if(u_mode==5){
  vec2 s=at(px,.5);tone=s.x;cov=s.y;
  float t=tone+(blue(px)-.5)*.1,p=cell*2.;
  if(t>.1)ink=max(ink,stripes(px,.785,p,p*.2,0.));
  if(t>.3)ink=max(ink,stripes(px,-.785,p,p*.2,0.));
  if(t>.52)ink=max(ink,stripes(px,0.,p,p*.18,.5));
  if(t>.76)ink=max(ink,stripes(px,1.5708,p*.5,p*.12,.25));
  ink*=cov>.02?.55+tone*.45:0.;
 }else if(u_mode==6){
  vec2 s=at(px,1.5);tone=s.x;cov=at(px,1.).y;order=bayer8(floor(px/2.));
  float f=tone*(4.+cell*1.5),fw=max(fwidth(f),1e-4),d=abs(fract(f-.5)-.5)/fw;
  ink=cov>.5?clamp(1.15-d,0.,1.)*(.5+tone*.5):0.;
 }else{
  float gc=cell*2.2;vec2 g=vec2(gc,floor(gc*1.6)),c=floor(px/g),f=fract(px/g);
  vec2 s=at((c+.5)*g,cellLod(gc)+.5);tone=s.x;cov=s.y;order=bayer4(c);
  float idx=clamp(floor(pow(clamp(tone*1.15,0.,.999),.75)*u_glyphs+(order-.5)*.9),0.,u_glyphs-1.);
  float lod=max(0.,log2(48./g.y)-.5);
  ink=(cov>.02&&idx>0.)?min(1.,textureLod(u_glyph,vec2((idx+f.x)/u_glyphs,f.y),lod).r*1.35)*(.7+tone*.3):0.;
 }
 ink*=step(order,u_reveal*1.0001);
 float glow=(at(px,1.).x*u_under+at(px,5.).x*u_bloom)*u_reveal;
 float split=step(u_split+(order-.5)*.3,tone);
 vec3 inkc=u_duo>.5?mix(u_inkA,u_inkB,split):u_inkA;
 float v=clamp(ink+glow*(1.-ink),0.,1.);
 vec3 col=mix(u_bg,inkc,v);float alpha=u_clear>.5?v:1.;
 if(u_ptr==1&&u_mouse.w>0.){
  vec2 d=px-u_mouse.xy;float lr=length(d),feather=max(3.*u_dpr,u_mouse.z*.14);
  float lm=u_mouse.w*clamp((u_mouse.z-lr)/feather,0.,1.);
  float inl=step(bayer8(floor(px/max(1.,floor(u_dpr+.5)))),lm);col=mix(col,mix(inkc,u_bg,v),inl);alpha=max(alpha,inl);
  float rim=1.-clamp(abs(lr-u_mouse.z-4.*u_dpr)/(.8*u_dpr),0.,1.);
  float dash=step(.5,fract(atan(d.y,d.x)*(u_mouse.z+4.*u_dpr)/(6.*u_dpr)));
  float rm=rim*dash*u_mouse.w*.85;col=mix(col,u_inkA,rm);alpha=max(alpha,rm);
 }
 o=u_clear>.5?vec4((alpha>v?col:inkc)*alpha,alpha):vec4(col,1.);
}`;

// Void-and-cluster blue noise (from the cabinet): evenly spread thresholds for stipple.
function blueNoise(N){
 const total=N*N,sigma=1.9,R=6,ker=[];
 for(let dy=-R;dy<=R;dy++)for(let dx=-R;dx<=R;dx++)ker.push(dx,dy,Math.exp(-(dx*dx+dy*dy)/(2*sigma*sigma)));
 const energy=new Float32Array(total),bits=new Uint8Array(total),rank=new Float32Array(total);
 const apply=(i,sign)=>{const x=i%N,y=(i/N)|0;for(let k=0;k<ker.length;k+=3){energy[((y+ker[k+1]+N)%N)*N+(x+ker[k]+N)%N]+=sign*ker[k+2]}};
 const find=(bit,max)=>{let idx=-1,v=max?-Infinity:Infinity;for(let i=0;i<total;i++)if(bits[i]===bit){const e=energy[i];if(max?e>v:e<v){v=e;idx=i}}return idx};
 let seed=12345;const rand=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296);
 const ones=Math.round(total*.1);
 for(let n=0;n<ones;){const i=(rand()*total)|0;if(!bits[i]){bits[i]=1;apply(i,1);n++}}
 for(let it=0;it<total;it++){const c=find(1,true);bits[c]=0;apply(c,-1);const v=find(0,false);if(v===c){bits[c]=1;apply(c,1);break}bits[v]=1;apply(v,1)}
 const proto=bits.slice(),protoEnergy=energy.slice();
 for(let r=ones-1;r>=0;r--){const c=find(1,true);bits[c]=0;apply(c,-1);rank[c]=r}
 bits.set(proto);energy.set(protoEnergy);
 for(let r=ones;r<total;r++){const v=find(0,false);bits[v]=1;apply(v,1);rank[v]=r}
 const out=new Uint8Array(total);for(let i=0;i<total;i++)out[i]=Math.round((rank[i]+.5)/total*255);
 return out;
}

const hex=h=>{h=h.replace('#','');if(h.length===3)h=[...h].map(c=>c+c).join('');const n=parseInt(h,16);return[(n>>16&255)/255,(n>>8&255)/255,(n&255)/255]};

let gl=null,glc=null,prog=null,U={},blueTex=null,glyphTex=null,blank=null,ok=false;
const cache=new Map(),views=new Set();
const look={mode:'dither',cell:3,inkA:'#ede9df',inkB:'#ede9df',bg:'#090909',duo:false,split:.52,positive:false,bloom:.045,under:.05,pointer:'lens',air:'calm',exposure:1,lens:120};
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
let t0=performance.now(),raf=0,frozenTime=null;

function tex(filter,wrap){const t=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,t);
 gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,filter);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,filter===gl.NEAREST?gl.NEAREST:gl.LINEAR);
 gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,wrap);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,wrap);return t}

function init(){
 if(gl)return ok;
 glc=document.createElement('canvas');glc.width=glc.height=64;
 try{gl=glc.getContext('webgl2',{alpha:true,premultipliedAlpha:true,antialias:false,depth:false,stencil:false,preserveDrawingBuffer:true,powerPreference:'high-performance'})}catch(e){gl=null}
 if(!gl){ok=false;return false}
 const sh=(type,src)=>{const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);
  if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)){console.error(gl.getShaderInfoLog(s));return null}return s};
 const v=sh(gl.VERTEX_SHADER,VS),f=sh(gl.FRAGMENT_SHADER,FS);
 if(!v||!f){gl=null;ok=false;return false}
 prog=gl.createProgram();gl.attachShader(prog,v);gl.attachShader(prog,f);gl.bindAttribLocation(prog,0,'a');gl.linkProgram(prog);
 if(!gl.getProgramParameter(prog,gl.LINK_STATUS)){console.error(gl.getProgramInfoLog(prog));gl=null;ok=false;return false}
 gl.useProgram(prog);
 const n=gl.getProgramParameter(prog,gl.ACTIVE_UNIFORMS);
 for(let i=0;i<n;i++){const info=gl.getActiveUniform(prog,i);U[info.name]=gl.getUniformLocation(prog,info.name)}
 const vao=gl.createVertexArray();gl.bindVertexArray(vao);const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);
 gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,2,gl.FLOAT,false,0,0);
 gl.pixelStorei(gl.UNPACK_ALIGNMENT,1);
 blueTex=tex(gl.NEAREST,gl.REPEAT);gl.texImage2D(gl.TEXTURE_2D,0,gl.R8,64,64,0,gl.RED,gl.UNSIGNED_BYTE,blueNoise(64));
 glyphTex=tex(gl.LINEAR_MIPMAP_LINEAR,gl.CLAMP_TO_EDGE);buildGlyphs();
 blank=tex(gl.NEAREST,gl.CLAMP_TO_EDGE);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA8,1,1,0,gl.RGBA,gl.UNSIGNED_BYTE,new Uint8Array([0,0,0,255]));
 gl.enable(gl.SCISSOR_TEST);
 glc.addEventListener('webglcontextlost',e=>{e.preventDefault();ok=false});
 glc.addEventListener('webglcontextrestored',()=>{gl=null;U={};cache.clear();init();views.forEach(v=>{v._own=null;v.setSrc(v.opts.src,true)})});
 ok=true;return true;
}
function buildGlyphs(){
 const gw=32,gh=48,c=document.createElement('canvas');c.width=gw*GLYPHS.length;c.height=gh;
 const x=c.getContext('2d');x.fillStyle='#000';x.fillRect(0,0,c.width,c.height);x.fillStyle='#fff';
 x.font='700 40px "Space Mono", ui-monospace, monospace';x.textAlign='center';x.textBaseline='middle';
 [...GLYPHS].forEach((g,i)=>x.fillText(g,i*gw+gw/2,gh/2+2));
 gl.bindTexture(gl.TEXTURE_2D,glyphTex);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA8,gl.RGBA,gl.UNSIGNED_BYTE,c);gl.generateMipmap(gl.TEXTURE_2D);
}
function upload(source){const t=tex(gl.LINEAR_MIPMAP_LINEAR,gl.CLAMP_TO_EDGE);
 gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA8,gl.RGBA,gl.UNSIGNED_BYTE,source);gl.generateMipmap(gl.TEXTURE_2D);return t}
function load(url){
 let e=cache.get(url);if(e)return e;
 e={url,ready:false,failed:false,img:new Image(),tex:null,w:1,h:1,waiters:[]};cache.set(url,e);
 e.img.decoding='async';
 e.img.onload=()=>{e.w=e.img.naturalWidth;e.h=e.img.naturalHeight;if(ok)e.tex=upload(e.img);e.ready=true;e.waiters.splice(0).forEach(f=>f())};
 e.img.onerror=()=>{e.failed=true};
 e.img.src=url;return e;
}

class View{
 constructor(canvas,opts){
  this.canvas=canvas;this.ctx=canvas.getContext('2d');this.opts=Object.assign({src:null,kind:'image',fit:'contain',scale:1,ox:0,oy:0,interactive:false,reveal:true,gain:1},opts||{});
  this.entry=null;this._own=null;this.dirty=true;this.visible=true;this.w=0;this.h=0;this.dpr=1;
  this.mouse={x:-9999,y:-9999,k:0,target:0,moved:0};this.rv=this.opts.reveal&&!reduced?0:1;this.rvStart=0;
  this.io=new IntersectionObserver(es=>{es.forEach(en=>{this.visible=en.isIntersecting;if(this.visible){this.dirty=true;if(this.rv===0&&!this.rvStart)this.rvStart=performance.now()}})},{rootMargin:'120px'});
  this.io.observe(canvas);
  this.ro=new ResizeObserver(()=>{this.dirty=true});this.ro.observe(canvas);
  if(this.opts.interactive){
   this.host=this.opts.host||canvas;
   this._move=e=>{const r=canvas.getBoundingClientRect();this.mouse.x=(e.clientX-r.left);this.mouse.y=(e.clientY-r.top);
    const inside=e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom;this.mouse.target=inside?1:0;this.mouse.moved=performance.now();this.dirty=true};
   this._leave=()=>{this.mouse.target=0;this.mouse.moved=performance.now()};
   window.addEventListener('pointermove',this._move,{passive:true});this.host.addEventListener('pointerleave',this._leave);
  }
  views.add(this);this.setSrc(this.opts.src);start();
 }
 setSrc(src,force){
  if(!force&&src===this.opts.src&&(this.entry||this._own))return;
  this.opts.src=src;
  if(this.opts.kind!=='image'){this.dirty=true;return}
  if(src&&typeof src==='object'&&src.getContext){this.srcCanvas=src;this.refresh();return}
  if(!src)return;
  const e=load(src);
  const use=()=>{if(this.opts.src===src){this.entry=e;this.dirty=true}};
  e.ready?use():e.waiters.push(use);
 }
 refresh(){ // re-upload a canvas source (type)
  if(!this.srcCanvas)return;
  if(ok){if(this._own)gl.deleteTexture(this._own.tex);this._own={tex:upload(this.srcCanvas),w:this.srcCanvas.width,h:this.srcCanvas.height,img:this.srcCanvas,ready:true}}
  else this._own={tex:null,w:this.srcCanvas.width,h:this.srcCanvas.height,img:this.srcCanvas,ready:true};
  this.entry=this._own;this.dirty=true;
 }
 set(patch){Object.assign(this.opts,patch);this.dirty=true}
 replay(){if(reduced)return;this.rv=0;this.rvStart=performance.now();this.dirty=true}
 destroy(){views.delete(this);this.io.disconnect();this.ro.disconnect();
  if(this._move){window.removeEventListener('pointermove',this._move);this.host.removeEventListener('pointerleave',this._leave)}
  if(this._own&&ok&&this._own.tex)gl.deleteTexture(this._own.tex);}
 get animated(){
  const o=this.opts,air=o.air||look.air;
  if(reduced)return false;
  if(this.rv<1)return !!this.rvStart;
  if(o.kind!=='image')return o.still?false:true;
  if(air!=='calm')return true;
  if(Math.abs(this.mouse.k-this.mouse.target)>.004)return true;
  return false;
 }
 rect(){ // where the square image sits, in device px: centre and half size
  const o=this.opts,e=this.entry,W=this.w,H=this.h;
  const ar=e?e.w/e.h:1;
  let hw,hh;
  if(o.fit==='cover'){const s=Math.max(W/ar,H);hh=s/2;hw=hh*ar}
  else if(o.fit==='width'){hw=W/2;hh=hw/ar}
  else{const s=Math.min(W/ar,H);hh=s/2;hw=hh*ar}
  hw*=o.scale;hh*=o.scale;
  return[W/2+o.ox*W,H/2+o.oy*H,hw,hh];
 }
 size(){
  const c=this.canvas,cw=c.clientWidth,ch=c.clientHeight;if(!cw||!ch)return false;
  const cap=this.opts.maxDpr||(cw*ch>900000?1.5:2);this.dpr=Math.min(window.devicePixelRatio||1,cap);
  const w=Math.min(4096,Math.max(2,Math.round(cw*this.dpr))),h=Math.min(4096,Math.max(2,Math.round(ch*this.dpr)));
  if(w!==c.width||h!==c.height){c.width=w;c.height=h}
  this.w=w;this.h=h;return true;
 }
 draw(now){
  if(!this.size())return;
  const o=this.opts,m=this.mouse;
  if(this.rv<1&&this.rvStart){this.rv=Math.min(1,(now-this.rvStart)/(o.revealMs||900));}
  m.k+=(m.target-m.k)*.16;if(Math.abs(m.k-m.target)<.004)m.k=m.target;
  if(!ok){drawCPU(this);return}
  if(glc.width<this.w||glc.height<this.h){glc.width=Math.max(glc.width,this.w);glc.height=Math.max(glc.height,this.h)}
  const kind=o.kind||'image';
  if(kind==='image'&&!(this.entry&&this.entry.tex)){if(o.clear??look.clear)this.ctx.clearRect(0,0,this.w,this.h);else{this.ctx.fillStyle=o.bg||look.bg;this.ctx.fillRect(0,0,this.w,this.h)}return}
  gl.viewport(0,0,this.w,this.h);gl.scissor(0,0,this.w,this.h);
  const mode=MODES[o.mode||look.mode]??0,cell=Math.max(1,Math.round((o.cell||look.cell)*this.dpr));
  const r=this.rect();
  gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,kind==='image'?this.entry.tex:blank);gl.uniform1i(U.u_tex,0);
  gl.activeTexture(gl.TEXTURE1);gl.bindTexture(gl.TEXTURE_2D,blueTex);gl.uniform1i(U.u_blue,1);
  gl.activeTexture(gl.TEXTURE2);gl.bindTexture(gl.TEXTURE_2D,glyphTex);gl.uniform1i(U.u_glyph,2);
  gl.uniform2f(U.u_res,this.w,this.h);gl.uniform4f(U.u_rect,r[0],r[1],r[2],r[3]);
  gl.uniform1f(U.u_lodBase,kind==='image'?Math.log2(Math.max(1e-3,this.entry.w/(2*r[2]))):0);
  gl.uniform1f(U.u_cell,cell);gl.uniform1f(U.u_dpr,this.dpr);gl.uniform1f(U.u_glyphs,GLYPHS.length);
  gl.uniform1f(U.u_time,frozenTime??((now-t0)/1000));
  gl.uniform1f(U.u_reveal,this.rv);gl.uniform1f(U.u_exposure,o.exposure??look.exposure);gl.uniform1f(U.u_gain,o.gain??1);
  const A=hex(o.inkA||look.inkA),B=hex(o.inkB||look.inkB),G=hex(o.bg||look.bg);
  gl.uniform3f(U.u_inkA,A[0],A[1],A[2]);gl.uniform3f(U.u_inkB,B[0],B[1],B[2]);gl.uniform3f(U.u_bg,G[0],G[1],G[2]);
  gl.uniform1f(U.u_duo,(o.duo??look.duo)?1:0);gl.uniform1f(U.u_split,look.split);gl.uniform1f(U.u_positive,(o.positive??look.positive)?1:0);
  const pos=(o.positive??look.positive);gl.uniform1f(U.u_under,pos?0:look.under);gl.uniform1f(U.u_bloom,(kind==="image"&&!pos)?look.bloom:0);
  const air=reduced?'calm':(o.air||look.air);
  gl.uniform1f(U.u_wind,air==='wind'?1:0);gl.uniform1f(U.u_drift,air==='drift'?1:0);
  const ptr=o.interactive?(o.pointer||look.pointer):'still';
  gl.uniform1i(U.u_ptr,PTR[ptr]??0);gl.uniform1f(U.u_lamp,ptr==='lamp'?m.k:0);
  gl.uniform4f(U.u_mouse,m.x*this.dpr,m.y*this.dpr,(o.lens||look.lens)*this.dpr*(o.lensScale||1),m.k);
  const clear=!!(o.clear??look.clear);gl.uniform1f(U.u_clear,clear?1:0);
  gl.uniform1i(U.u_mode,mode);gl.uniform1i(U.u_src,SRC[kind]??0);
  gl.drawArrays(gl.TRIANGLES,0,3);
  if(clear)this.ctx.clearRect(0,0,this.w,this.h);
  this.ctx.drawImage(glc,0,glc.height-this.h,this.w,this.h,0,0,this.w,this.h);
 }
}

// Canvas fallback: plain ordered dither, used only when WebGL2 is unavailable.
const B8=(()=>{const m=new Float32Array(64);for(let y=0;y<8;y++)for(let x=0;x<8;x++){let n=0;for(let b=0;b<3;b++){const X=(x>>b)&1,Y=(y>>b)&1;n|=((X^Y)*2+Y)<<(4-b*2)}m[y*8+x]=(n+.5)/64}return m})();
let scratch=null;
function drawCPU(v){
 const o=v.opts,ctx=v.ctx,cell=Math.max(2,Math.round((o.cell||look.cell)*v.dpr));
 ctx.fillStyle=o.bg||look.bg;ctx.fillRect(0,0,v.w,v.h);
 if((o.kind||'image')!=='image'||!v.entry||!v.entry.img)return;
 const cw=Math.ceil(v.w/cell),ch=Math.ceil(v.h/cell);
 scratch=scratch||document.createElement('canvas');scratch.width=cw;scratch.height=ch;
 const s=scratch.getContext('2d',{willReadFrequently:true});s.fillStyle='#000';s.fillRect(0,0,cw,ch);
 const r=v.rect();s.drawImage(v.entry.img,(r[0]-r[2])/cell,(r[1]-r[3])/cell,2*r[2]/cell,2*r[3]/cell);
 const d=s.getImageData(0,0,cw,ch).data,pos=o.positive??look.positive;
 ctx.fillStyle=o.inkA||look.inkA;
 for(let y=0;y<ch;y++)for(let x=0;x<cw;x++){const i=(y*cw+x)*4;let t=(d[i]*.299+d[i+1]*.587+d[i+2]*.114)/255;
  if(t<.02)continue;if(pos)t=1-t;if(t>B8[(y&7)*8+(x&7)]&&B8[(y&7)*8+(x&7)]<=v.rv)ctx.fillRect(x*cell,y*cell,cell,cell)}
}

function frame(now){
 raf=0;let again=false;
 views.forEach(v=>{
  if(!v.visible||!v.canvas.isConnected)return;
  const anim=v.animated;
  if(anim&&!v.dirty&&v.opts.fps&&now-(v._last||0)<1000/v.opts.fps){again=true;return}
  if(v.dirty||anim){v.dirty=false;v._last=now;v.draw(now)}
  if(anim||v.animated)again=true;
 });
 if(again||dirtyAny())start();
}
function dirtyAny(){for(const v of views)if(v.dirty&&v.visible)return true;return false}
function start(){if(!raf)raf=requestAnimationFrame(frame)}
function invalidate(){views.forEach(v=>v.dirty=true);start()}
function setLook(patch){Object.assign(look,patch);invalidate()}
// keep idle views honest: a dirty flag set outside the loop needs a kick
setInterval(()=>{if(dirtyAny())start()},250);

window.Dither={init,View,look,setLook,invalidate,preload:load,get gpu(){return ok},freeze(t){frozenTime=t;invalidate()},views,MODES};
})();
