import { test, expect } from 'bun:test';
import { demoSteps, moveDemo } from './demo';
import { navigationLinks } from './navigation';
import { tiers } from './plans';

test('Starter subscription remains $99 per month', () => {
  expect(tiers.find(tier => tier.name === 'Starter')?.monthly).toBe(99);
});
test('Professional subscription remains $249 per month', () => {
  expect(tiers.find(tier => tier.name === 'Professional')?.monthly).toBe(249);
});
test('Enterprise subscription remains $599 per month', () => {
  expect(tiers.find(tier => tier.name === 'Enterprise')?.monthly).toBe(599);
});

test('walkthrough includes the nine requested modules in order with existing destinations', () => {
  expect(demoSteps.map(step => step.to)).toEqual(['/inventory', '/predictions', '/research', '/product', '/pricing', '/marketing', '/chat', '/dashboard', '/docs']);
  for (const step of demoSteps) expect(navigationLinks.some(link => link.to === step.to)).toBe(true);
});
test('Next visits every module then the final summary without advancing beyond it', () => {
  let position = 0;
  const visited = [position];
  for (let i = 0; i < 9; i++) { position = moveDemo(position, 1); visited.push(position); }
  expect(visited).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  expect(moveDemo(position, 1)).toBe(9);
});
test('Previous returns from summary through all nine steps and stops at the beginning', () => {
  let position = 9;
  const visited = [position];
  for (let i = 0; i < 9; i++) { position = moveDemo(position, -1); visited.push(position); }
  expect(visited).toEqual([9, 8, 7, 6, 5, 4, 3, 2, 1, 0]);
  expect(moveDemo(position, -1)).toBe(0);
});