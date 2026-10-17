/* Progressive enhancement: no content is hidden while waiting for JavaScript. */
class FamiliMotion {
 constructor(app){
  this.app=app;
  this.seen=new WeakSet();
  this.effects=new Set();
  this.reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  this.finePointer=window.matchMedia('(hover: hover) and (pointer: fine)');
  this.frame=0;this.pointerFrame=0;this.photoFrame=0;this.hero=null;this.heroVisible=false;this.photo=null;
  this.onScroll=()=>this.queueProgress();
  this.onVisibility=()=>this.refreshPreference();
  this.onPreference=()=>{this.app.setState({systemReduceMotion:this.reduced.matches},()=>this.app.preferences());this.refreshPreference()};
  this.onPointer=e=>this.pointer(e);
  this.onPointerLeave=()=>this.resetPointer();
  this.onFocus=e=>{this.finishInside(e.target);this.resetPhoto()};
  this.onPhotoPointer=e=>this.photoPointer(e);
  this.onDocumentLeave=()=>this.resetPhoto();
  this.onResize=()=>{this.resetPointer();this.resetPhoto();this.queueProgress()};
 }
 start(){
  window.addEventListener('scroll',this.onScroll,{passive:true});
  window.addEventListener('resize',this.onResize,{passive:true});
  document.addEventListener('visibilitychange',this.onVisibility);
  document.addEventListener('focusin',this.onFocus);
  document.addEventListener('pointermove',this.onPhotoPointer,{passive:true});
  document.documentElement.addEventListener('pointerleave',this.onDocumentLeave);
  if(this.reduced.addEventListener)this.reduced.addEventListener('change',this.onPreference);
  else this.reduced.addListener(this.onPreference);
  try{
   if('IntersectionObserver' in window){
    this.revealObserver=new IntersectionObserver(entries=>{
     let delay=0;
     entries.forEach(entry=>{
      if(!entry.isIntersecting)return;
      this.revealObserver.unobserve(entry.target);
      if(this.allowed()&&!entry.target.contains(document.activeElement)){
       this.reveal(entry.target,Math.min(delay++*75,300));
      }
     });
    },{threshold:.06,rootMargin:'0px 0px -18px 0px'});
    this.heroObserver=new IntersectionObserver(entries=>{
     entries.forEach(entry=>{if(entry.target===this.hero){this.heroVisible=entry.isIntersecting;this.hero.classList.toggle('motion-in-view',entry.isIntersecting);if(!entry.isIntersecting){this.resetPointer();this.effects.forEach(effect=>{if(this.hero.contains(effect.effect?.target))effect.cancel()})}}});
    },{threshold:0});
   }
  }catch(error){this.revealObserver=null;this.heroObserver=null}
  this.refreshPreference();
  this.update(true);
 }
 allowed(){return !this.app.state.reduceMotion&&!this.reduced.matches&&!document.hidden}
 animate(element,keyframes,duration,delay=0){
  if(!this.allowed()||!element||typeof element.animate!=='function')return;
  try{
   const effect=element.animate(keyframes,{duration,delay,easing:'cubic-bezier(.2,.7,.2,1)',fill:'backwards'});
   this.effects.add(effect);
   effect.onfinish=effect.oncancel=()=>this.effects.delete(effect);
  }catch(error){/* Enhancement failure must never obscure content. */}
 }
 update(routeChanged=false){
  const content=document.getElementById('content');
  if(routeChanged){
   this.effects.forEach(effect=>effect.cancel());this.effects.clear();
   this.revealObserver?.disconnect();
   this.resetPhoto();
   this.bindHero(content?.querySelector('.hero')||null);
   /* Keep the whole route readable while its individual composition arrives. */
   this.animate(content?.firstElementChild,[{transform:'translateY(10px)'},{transform:'none'}],420);
  }
  if(content&&this.revealObserver){
   const targets=content.querySelectorAll('.perspective,.card,.case-card,.concept-card,.library-item,.quote,.proof-band,.home-session,.experience-card,.experience-panel,.editorial-card,.story-card,.insight-ribbon,.cinematic-proof,.brand-strip,.brand-feature-photo,.brand-experience,[data-reveal]');
   targets.forEach(target=>{
    if(this.seen.has(target))return;
    this.seen.add(target);
    if(!this.allowed())return;
    /* Parent and child reveals must not multiply opacity or delay focus. */
    if(target.parentElement?.closest('[data-reveal],.experience-panel,.proof-band,.home-session,.brand-experience'))return;
    this.revealObserver.observe(target);
   });
  }
  this.refreshPreference();this.queueProgress();
 }
 bindHero(next){
  if(this.hero===next)return;
  if(this.hero){this.hero.removeEventListener('pointermove',this.onPointer);this.hero.removeEventListener('pointerleave',this.onPointerLeave);this.heroObserver?.unobserve(this.hero);this.resetPointer()}
  this.hero=next;this.heroVisible=!!next;
  if(next){
   next.addEventListener('pointermove',this.onPointer,{passive:true});next.addEventListener('pointerleave',this.onPointerLeave);this.heroObserver?.observe(next);
   this.animate(next.querySelector('.hero-media>img'),[{scale:'1.105'},{scale:'1.035'}],3800);
   next.querySelectorAll('.brand-hero-word').forEach((word,i)=>this.animate(word,[{opacity:.15,translate:'0 28px',clipPath:'inset(0 0 80% 0)'},{opacity:1,translate:'0 0',clipPath:'inset(0 0 0 0)'}],1000,140+i*135));
   next.querySelectorAll('.hero-eyebrow,.hero-copy>p,.hero-copy>.actions,.hero-discovery').forEach((item,i)=>this.animate(item,[{opacity:.1,translate:'0 20px'},{opacity:1,translate:'0 0'}],800,300+i*110));
   next.querySelectorAll('.brand-orbit').forEach((orbit,i)=>this.animate(orbit,[{rotate:'-45deg',scale:'.75',opacity:.1},{rotate:'0deg',scale:'1',opacity:1}],1700,120+i*90));
   next.querySelectorAll('.brand-trace').forEach(trace=>this.animate(trace,[{clipPath:'inset(0 100% 0 0)'},{clipPath:'inset(0 0 0 0)'}],1450,450));
  }
 }
 reveal(target,delay){
  if(target.matches('.brand-strip')){
   this.animate(target,[{opacity:.25,translate:'32px 0'},{opacity:1,translate:'0 0'}],900,delay);
  }else if(target.matches('.brand-feature-photo,.brand-experience')){
   this.animate(target,[{opacity:.4,translate:'0 35px',clipPath:'inset(10% 0 0 0)'},{opacity:1,translate:'0 0',clipPath:'inset(0 0 0 0)'}],1000,delay);
   const photo=target.querySelector('img');
   this.animate(photo,[{scale:'1.12'},{scale:'1'}],1600,delay);
  }else{
   this.animate(target,[{opacity:0,transform:'translateY(24px) scale(.985)'},{opacity:1,transform:'none'}],700,delay);
  }
 }
 photoPointer(event){
  if(!this.allowed()||!this.finePointer.matches||event.pointerType==='touch'){this.resetPhoto();return}
  const next=event.target.closest?.('.brand-feature-photo');
  if(this.photo!==next){this.resetPhoto();this.photo=next}
  if(!next)return;
  const bounds=next.getBoundingClientRect();
  if(!bounds.width||!bounds.height)return;
  this.photoPosition={x:Math.max(-1,Math.min(1,((event.clientX-bounds.left)/bounds.width-.5)*2)),y:Math.max(-1,Math.min(1,((event.clientY-bounds.top)/bounds.height-.5)*2))};
  if(this.photoFrame)return;
  this.photoFrame=requestAnimationFrame(()=>{
   this.photoFrame=0;if(!this.photo||!this.allowed())return;
   this.photo.style.setProperty('--photo-pointer-x',(this.photoPosition.x*8).toFixed(2)+'px');
   this.photo.style.setProperty('--photo-pointer-y',(this.photoPosition.y*6).toFixed(2)+'px');
  });
 }
 resetPhoto(){
  if(this.photoFrame)cancelAnimationFrame(this.photoFrame);this.photoFrame=0;
  if(this.photo){this.photo.style.removeProperty('--photo-pointer-x');this.photo.style.removeProperty('--photo-pointer-y');this.photo=null}
 }
 pointer(event){
  if(!this.allowed()||!this.finePointer.matches||!this.heroVisible||event.pointerType==='touch')return;
  const bounds=this.hero.getBoundingClientRect();
  const x=Math.max(-1,Math.min(1,((event.clientX-bounds.left)/bounds.width-.5)*2));
  const y=Math.max(-1,Math.min(1,((event.clientY-bounds.top)/bounds.height-.5)*2));
  this.pointerPosition={x,y};
  if(this.pointerFrame)return;
  this.pointerFrame=requestAnimationFrame(()=>{
   this.pointerFrame=0;if(!this.hero||!this.allowed())return;
   this.hero.style.setProperty('--hero-pointer-x',(this.pointerPosition.x*7).toFixed(2)+'px');
   this.hero.style.setProperty('--hero-pointer-y',(this.pointerPosition.y*5).toFixed(2)+'px');
  });
 }
 resetPointer(){
  if(this.pointerFrame)cancelAnimationFrame(this.pointerFrame);this.pointerFrame=0;
  if(this.hero){this.hero.style.setProperty('--hero-pointer-x','0px');this.hero.style.setProperty('--hero-pointer-y','0px')}
 }
 finishInside(target){
  this.effects.forEach(effect=>{let element=effect.effect?.target;if(element&&(element===target||element.contains(target))){try{effect.finish()}catch{effect.cancel()}this.effects.delete(effect)}});
 }
 refreshPreference(){
  const paused=!this.allowed();
  document.documentElement.classList.toggle('motion-paused',paused);
  if(paused){this.effects.forEach(effect=>effect.cancel());this.effects.clear();this.resetPointer();this.resetPhoto()}
 }
 queueProgress(){
  if(this.frame||document.hidden)return;
  this.frame=requestAnimationFrame(()=>{
   this.frame=0;const doc=document.documentElement;
   const length=Math.max(0,doc.scrollHeight-window.innerHeight);
   const progress=length?Math.min(1,Math.max(0,window.scrollY/length)):0;
   doc.style.setProperty('--reading-progress',String(progress));
  });
 }
 destroy(){
  window.removeEventListener('scroll',this.onScroll);window.removeEventListener('resize',this.onResize);
  document.removeEventListener('visibilitychange',this.onVisibility);document.removeEventListener('focusin',this.onFocus);
  document.removeEventListener('pointermove',this.onPhotoPointer);document.documentElement.removeEventListener('pointerleave',this.onDocumentLeave);this.resetPhoto();
  if(this.reduced.removeEventListener)this.reduced.removeEventListener('change',this.onPreference);else this.reduced.removeListener(this.onPreference);
  this.revealObserver?.disconnect();this.heroObserver?.disconnect();this.bindHero(null);
  this.effects.forEach(effect=>effect.cancel());this.effects.clear();
  cancelAnimationFrame(this.frame);cancelAnimationFrame(this.pointerFrame);
 }
}
function MotionToggle({a}){
 const system=a.state.systemReduceMotion,paused=a.state.reduceMotion||system;
 const label=system?'کاهش حرکت طبق تنظیمات دستگاه':paused?'فعال‌کردن انیمیشن‌ها':'توقف انیمیشن‌ها';
 return <button className={cx('motion-toggle',paused&&'is-paused')} aria-label={label} title={label} aria-pressed={!paused} aria-disabled={system||undefined} onClick={()=>system?a.toast('کاهش حرکت در تنظیمات دستگاه فعال است.'):a.set({reduceMotion:!a.state.reduceMotion},true)}><svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paused?<path d="m8 5 11 7-11 7V5Z"/>:<g><path d="M8 5v14M16 5v14"/><path className="motion-orbit" d="M3 8a10 10 0 0 1 18 0M21 16a10 10 0 0 1-18 0"/></g>}</svg><span>{paused?'حرکت خاموش':'حرکت روشن'}</span></button>
}
