export const intakeQuestions = [
  { id: 'restaurant', text: 'What type of restaurant do you manage?', options: ['Full-service restaurant', 'Quick-service restaurant', 'Café or bakery', 'Buffet or catering', 'Other'] },
  { id: 'challenge', text: 'What is your biggest inventory or food-waste challenge?', options: ['Ingredients expire before use', 'Preparing more food than we sell', 'Stock levels are hard to track', 'Purchasing and prep are inconsistent', 'Other'] },
  { id: 'priority', text: 'What would you like to improve first?', options: ['Inventory management', 'Food-waste reduction', 'Operational efficiency', 'Other'] },
] as const;

export type IntakeAnswers = [string, string, string];

// A basic screening rule, not a comprehensive safety classifier.
export function guardrailFor(text: string): string | null {
  if (/\b(medic\w*|diagnos\w*|allerg\w*|treat\w*|poison\w*|legal|lawyer|lawsuit|tax\w*|financial|invest\w*|loan\w*|profit forecast|unsafe|illegal|fraud|harm|weapon\w*)\b/i.test(text)) {
    return 'I can offer general restaurant inventory, food-waste, and operations guidance, but not medical, legal, or financial advice or unsafe instructions. Please consult an appropriate qualified professional.';
  }
  if (/\b(automatic\w*|place\w*\s+(an?\s+)?orders?|order\s+(food|ingredients|supplies)|change\s+(my\s+)?inventory|delete\s+(my\s+)?inventory)\b/i.test(text)) {
    return 'I cannot change inventory or place orders. Your manager or operations team must review and carry out any decisions manually.';
  }
  if (/\b(weather|politics|sports|homework|write\s+(code|an?\s+essay)|ignore\s+(the\s+)?(rules|instructions))\b/i.test(text)) {
    return 'That request is outside this guided assistant. Please choose an option or describe your restaurant type, inventory challenge, or operational priority.';
  }
  return null;
}

export function recommend([restaurant, challenge, priority]: IntakeAnswers) {
  const focus = priority === 'Inventory management' ? 'Inventory management'
    : priority === 'Food-waste reduction' ? 'Food-waste reduction'
    : priority === 'Operational efficiency' ? 'Operational efficiency'
    : /stock|track/i.test(challenge) ? 'Inventory management'
    : /expire|preparing|waste/i.test(challenge) ? 'Food-waste reduction'
    : 'Operational efficiency';
  const actions = focus === 'Inventory management'
    ? ['Review on-hand quantities, units, and expiration dates with your team.', 'Compare recorded stock against a manual count and flag discrepancies for review.']
    : focus === 'Food-waste reduction'
    ? ['Compare recent daily sales with preparation quantities before planning the next service.', 'Record unused food and the reason it was left over to identify recurring patterns.']
    : ['Agree on a shared stock-check and prep-review routine for each shift.', 'Review discrepancies and handover notes with your operations team before changing the workflow.'];
  const challengeAction = /expire/i.test(challenge)
    ? 'Flag ingredients approaching expiration and review first-expiring-first-out rotation without overriding food-safety rules.'
    : /preparing/i.test(challenge)
    ? 'Review smaller preparation batches with your kitchen lead, using actual sales and service demand.'
    : /stock|track/i.test(challenge)
    ? 'Choose a consistent time for manual stock counts and record corrections for team review.'
    : 'Compare purchasing and prep notes against actual ingredient use before proposing adjustments.';
  const restaurantAction = restaurant === 'Café or bakery'
    ? 'For your café or bakery, review production and unsold items by product and time of day.'
    : restaurant === 'Buffet or catering'
    ? 'For your buffet or catering operation, compare planned guest counts with leftovers from each service or event.'
    : restaurant === 'Quick-service restaurant'
    ? 'For your quick-service restaurant, compare prep needs across peak and quieter service periods.'
    : restaurant === 'Full-service restaurant'
    ? 'For your full-service restaurant, review ingredient use by menu item and service period.'
    : 'For your restaurant format, review one service period with your team before proposing broader changes.';
  return { focus, actions: [...actions, challengeAction, restaurantAction] };
}