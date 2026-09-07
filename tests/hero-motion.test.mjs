import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

function harness({reduced=false}={}) {
  let effect, observer, loads=0, plays=0, pauses=0;
  const video={source:'',getAttribute(){return this.source},set src(value){this.source=value;loads++},play(){plays++;return Promise.resolve()},pause(){pauses++}};
  const media=Object.assign(new EventTarget(),{matches:reduced});
  const win=Object.assign(new EventTarget(),{matchMedia:()=>media});
  const doc=Object.assign(new EventTarget(),{hidden:false,documentElement:{dataset:{}}});
  const source=readFileSync(new URL('../app/experience.tsx',import.meta.url),'utf8');
  const start=source.indexOf('export function HeroMotion()');
  const end=source.indexOf('\n  return (\n    <div',start);
  const hook=source.slice(start,end)+'}';
  const context={exports:{},useRef:()=>({current:video}),useSyncExternalStore:()=>false,useMedia:()=>false,subscribePause(){},readPaused(){},useEffect:fn=>effect=fn,window:win,document:doc,
    IntersectionObserver:class{constructor(cb){observer=cb}observe(){}disconnect(){observer=()=>{}}}};
  vm.runInNewContext(ts.transpileModule(hook,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS}}).outputText,context);
  context.exports.HeroMotion();const cleanup=effect();
  return {video,win,doc,media,cleanup,visible:value=>observer([{isIntersecting:value}]),get counts(){return {loads,plays,pauses}}};
}
test('hero defers media download, pauses offscreen, and reuses the loaded source',()=>{
 const h=harness();assert.equal(h.counts.loads,0);h.visible(true);assert.equal(h.counts.loads,1);assert.equal(h.counts.plays,1);
 h.visible(false);assert.equal(h.counts.pauses,1);h.visible(true);assert.equal(h.counts.loads,1);assert.equal(h.counts.plays,2);h.cleanup();
});
test('reduced motion prevents loading and responds to changes while mounted',()=>{
 const h=harness({reduced:true});h.visible(true);assert.equal(h.counts.loads,0);assert.equal(h.counts.plays,0);
 h.media.matches=false;h.media.dispatchEvent(new Event('change'));assert.equal(h.counts.plays,1);
 h.media.matches=true;h.media.dispatchEvent(new Event('change'));assert.equal(h.counts.pauses,2);h.cleanup();
});
test('manual pause and hidden documents stop playback; cleanup removes listeners',()=>{
 const h=harness();h.visible(true);h.doc.documentElement.dataset.motion='paused';h.win.dispatchEvent(new Event('designario:motion'));assert.equal(h.counts.pauses,1);
 h.doc.documentElement.dataset.motion='playing';h.win.dispatchEvent(new Event('designario:motion'));assert.equal(h.counts.plays,2);
 h.doc.hidden=true;h.doc.dispatchEvent(new Event('visibilitychange'));assert.equal(h.counts.pauses,2);
 h.cleanup();const before=h.counts;h.doc.hidden=false;h.doc.dispatchEvent(new Event('visibilitychange'));h.win.dispatchEvent(new Event('designario:motion'));assert.deepEqual(h.counts,before);
});
