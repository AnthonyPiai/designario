import test from 'node:test';
import assert from 'node:assert/strict';
import { timelineState } from '../app/motion-math.ts';

test('timeline stays bounded before entry and after the final step', () => {
  assert.deepEqual(timelineState([600, 930, 1260, 1590], 450), {
    progress: 0,
    active: 0,
  });
  assert.deepEqual(timelineState([-1200, -870, -540, -210], 450), {
    progress: 1,
    active: 3,
  });
});
test('step highlight changes at the marker, without jumping ahead of the line', () => {
  assert.equal(timelineState([0, 330, 660, 990], 329).active, 0);
  assert.equal(timelineState([0, 330, 660, 990], 330).active, 1);
  assert.equal(timelineState([0, 330, 660, 990], 659).active, 1);
  assert.equal(timelineState([0, 330, 660, 990], 660).active, 2);
});
test('reverse scrolling restores earlier steps and progress', () => {
  const forward = timelineState([-700, -370, -40, 290], 450);
  const reverse = timelineState([100, 430, 760, 1090], 450);
  assert.equal(forward.active, 3);
  assert.equal(reverse.active, 1);
  assert.ok(reverse.progress < forward.progress);
});
test('uneven mobile and enlarged-text layouts use measured positions', () => {
  const state = timelineState([120, 430, 890, 1440], 600);
  assert.equal(state.active, 1);
  assert.equal(state.progress, 480 / 1320);
  // Same layout translated during scroll gives the same answer at a translated focus.
  assert.deepEqual(timelineState([-80, 230, 690, 1240], 400), state);
});
test('empty, single-step and collapsed geometry never divide by zero', () => {
  assert.deepEqual(timelineState([], 300), { progress: 0, active: 0 });
  assert.deepEqual(timelineState([400], 300), { progress: 0, active: 0 });
  assert.deepEqual(timelineState([400], 500), { progress: 1, active: 0 });
  assert.deepEqual(timelineState([400, 400], 500), { progress: 1, active: 1 });
});

test('pointer easing stays between its current position and target', async () => {
  const { easeValue } = await import('../app/motion-math.ts');
  for (const delta of [0, 8, 16, 33, 64, 500]) {
    const next = easeValue(-0.8, 0.75, delta);
    assert.ok(next >= -0.8 && next <= 0.75);
  }
});
test('pointer easing is consistent across frame rates', async () => {
  const { easeValue } = await import('../app/motion-math.ts');
  const oneFrame = easeValue(0, 1, 32);
  const twoFrames = easeValue(easeValue(0, 1, 16), 1, 16);
  assert.ok(Math.abs(oneFrame - twoFrames) < 1e-12);
});
test('pointer easing returns to rest and terminates its animation loop', async () => {
  const { easeValue } = await import('../app/motion-math.ts');
  let value = 0.9;
  for (let frame = 0; frame < 100; frame++) value = easeValue(value, 0, 16);
  assert.equal(value, 0);
  assert.equal(easeValue(0, 0, 16), 0);
});
