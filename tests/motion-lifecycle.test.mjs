import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import { timelineState, easeValue } from '../app/motion-math.ts';

// Exercise the actual effect with a controlled DOM contract, without a browser.
function harness() {
  let effect, reads = 0, tick = 0, serial = 0;
  const frames = new Map();
  const win = Object.assign(new EventTarget(), { scrollY: 0, innerHeight: 900 });
  const media = new Map();
  win.matchMedia = query => {
    if (!media.has(query)) media.set(query, Object.assign(new EventTarget(), { matches: query.includes('pointer: fine') }));
    return media.get(query);
  };
  function element(top, height = 330) {
    const props = new Map();
    return Object.assign(new EventTarget(), {
      dataset: {}, offsetTop: 36, offsetHeight: height,
      style: { setProperty: (name, value) => props.set(name, value) }, props,
      classList: { add() {}, remove() {} },
      setAttribute(name, value) { this[name] = value; },
      removeAttribute(name) { delete this[name]; },
      getBoundingClientRect() { reads++; return { top: top - win.scrollY, left: 0, width: 1280, height }; },
    });
  }
  const hero = element(86, 780), about = element(3000, 500), process = element(1000, 1320), rail = element(1000);
  const markers = [1000,1330,1660,1990].map(top => element(top,39));
  const stages = markers.map(() => element(0));
  const chapters = markers.map(() => element(0));
  const readout = element(0);
  const root = { dataset: {}, scrollHeight: 5000, style: { setProperty() {} } };
  const single = { '.hero': hero, '.about-art': about, '.process': process, '.process-rail': rail, '.process-current': readout };
  const multi = { '.stage-marker': markers, '.process-stage': stages, '.process-step-link': chapters, '[data-reveal]': [] };
  const doc = Object.assign(new EventTarget(), { documentElement: root, body: {}, hidden: false, fonts: { ready: Promise.resolve() }, querySelector: s => single[s], querySelectorAll: s => multi[s] ?? [] });
  const context = { exports: {}, useEffect: fn => { effect = fn; }, timelineState, easeValue, window: win, document: doc,
    IntersectionObserver: class { observe() {} unobserve() {} disconnect() {} },
    ResizeObserver: class { observe() {} disconnect() {} },
    requestAnimationFrame: fn => { const id = ++serial; frames.set(id,fn); return id; },
    cancelAnimationFrame: id => frames.delete(id),
  };
  const source = readFileSync(new URL('../app/motion.tsx', import.meta.url),'utf8');
  const hook = source.slice(source.indexOf('export function usePageMotion()'));
  vm.runInNewContext(ts.transpileModule(hook, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS } }).outputText, context);
  context.exports.usePageMotion();
  const cleanup = effect();
  function pump() {
    let count = 0;
    while (frames.size && count++ < 150) {
      const current = [...frames.values()]; frames.clear(); tick += 16;
      current.forEach(fn => fn(tick));
    }
    assert.equal(frames.size, 0, 'animation must settle instead of running forever');
  }
  function point(x,y) { const event = new Event('pointermove'); Object.assign(event,{clientX:x,clientY:y}); hero.dispatchEvent(event); pump(); }
  return { win, media, hero, process, root, cleanup, frames, pump, point, get reads() { return reads; } };
}

test('scroll uses cached geometry, and cleanup removes active listeners', async () => {
  const h = harness(); await Promise.resolve(); h.pump();
  const initialReads = h.reads;
  h.win.scrollY = 800; h.win.dispatchEvent(new Event('scroll')); h.pump();
  assert.equal(h.reads, initialReads);
  assert.ok(Number(h.process.props.get('--process-progress')) > 0);
  h.cleanup();
  h.win.dispatchEvent(new Event('scroll'));
  assert.equal(h.frames.size, 0);
});
test('manual pause fills the timeline and hero pointer movement schedules no work', async () => {
  const h = harness(); await Promise.resolve(); h.pump();
  const initialReads = h.reads;
  h.point(1200,400);
  assert.equal(h.hero.props.size, 0, 'hero must not receive photograph parallax transforms');
  assert.equal(h.reads, initialReads);
  h.root.dataset.motion = 'paused'; h.win.dispatchEvent(new Event('designario:motion')); h.pump();
  assert.equal(h.process.props.get('--process-progress'), '1');
  h.cleanup();
});
test('system reduced motion updates while the page is already open', async () => {
  const h = harness(); await Promise.resolve(); h.pump();
  h.point(1100,500);
  const media = h.win.matchMedia('(prefers-reduced-motion: reduce)');
  media.matches = true; media.dispatchEvent(new Event('change')); h.pump();
  assert.equal(h.hero.props.size, 0);
  assert.equal(h.process.props.get('--process-progress'), '1');
  h.cleanup();
});
