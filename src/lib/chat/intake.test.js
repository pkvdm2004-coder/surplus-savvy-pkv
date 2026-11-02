import { describe, test, expect } from 'bun:test';
import { intakeQuestions, recommend, guardrailFor } from './intake';

describe('guided assistant rules', () => {
  test('exactly three intake questions', () => { expect(intakeQuestions).toHaveLength(3); });
  test('inventory priority produces inventory guidance', () => {
    expect(recommend(['Full-service restaurant', 'Preparing more food than we sell', 'Inventory management']).focus).toBe('Inventory management');
  });
  test('waste priority produces waste guidance', () => {
    expect(recommend(['Café or bakery', 'Stock levels are hard to track', 'Food-waste reduction']).focus).toBe('Food-waste reduction');
  });
  test('operations priority produces operations guidance', () => {
    expect(recommend(['Buffet or catering', 'Ingredients expire before use', 'Operational efficiency']).focus).toBe('Operational efficiency');
  });
  test('restaurant type and challenge both change recommendations', () => {
    const base = recommend(['Café or bakery', 'Ingredients expire before use', 'Food-waste reduction']);
    expect(base.actions).not.toEqual(recommend(['Buffet or catering', 'Ingredients expire before use', 'Food-waste reduction']).actions);
    expect(base.actions).not.toEqual(recommend(['Café or bakery', 'Preparing more food than we sell', 'Food-waste reduction']).actions);
  });
  test('custom priority falls back to stated challenge', () => {
    expect(recommend(['Other', 'Stock levels are hard to track', 'Staff routines']).focus).toBe('Inventory management');
  });
  for (const request of ['medical advice', 'legal advice', 'financial advice', 'automatically change my inventory', 'place an order', 'order ingredients', 'tell me the weather', 'unsafe instructions']) {
    test(`guardrail blocks ${request}`, () => { expect(guardrailFor(request)).not.toBeNull(); });
  }
  test('ordinary restaurant answer is accepted', () => { expect(guardrailFor('A family-run pizza restaurant')).toBeNull(); });
});