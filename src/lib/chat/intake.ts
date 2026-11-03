export const intakeQuestions = [
  { id: 'restaurant', text: 'What type of restaurant do you manage?', options: ['Full-service restaurant', 'Quick-service restaurant', 'Café or bakery', 'Buffet or catering', 'Other'] },
  { id: 'challenge', text: 'What is your biggest inventory or food-waste challenge?', options: ['Ingredients expire before use', 'Preparing more food than we sell', 'Stock levels are hard to track', 'Purchasing and prep are inconsistent', 'Other'] },
  { id: 'priority', text: 'What would you like to improve first?', options: ['Inventory management', 'Food-waste reduction', 'Operational efficiency', 'Other'] },
] as const;

export type IntakeAnswers = [string, string, string];

// A basic screening rule, not a comprehensive safety classifier.
export function guardrailFor(text: string): string | null {
  const clean = text.normalize('NFKC').replace(/[’‘]/g, "'").replace(/[-_]/g, ' ').replace(/\s+/g, ' ').trim();
  if (/\b(food\s*safety|safe\s+to\s+(eat|serve|use)|is\s+.{0,40}\s+safe|temperature|undercook\w*|raw\s+(chicken|meat|fish|poultry)|contaminat\w*|spoiled|rotten|mold\w*|expired\s+(food|chicken|meat|fish|milk|ingredients?)|salmonella|e\.?\s*coli|botulis\w*)\b/i.test(clean)
    || /\b(serve|eat|use|sell|cook|reheat)\b.{0,70}\b(expired|spoiled|rotten|past\s+(its\s+|the\s+)?(expiration|expiry|use\s+by)|left\s+out|overnight)\b/i.test(clean)
    || /\b(ignore|bypass|disregard|override|extend|change|hide)\b.{0,60}\b(expir\w*|use\s+by|safety|regulations?|inspection\w*)\b/i.test(clean)) {
    return 'I only provide general restaurant-management guidance, not food-safety judgments. Never serve unsafe food, ignore expiration dates, or bypass food-safety regulations. Please consult a qualified food-safety professional before deciding whether food is safe to use or serve.';
  }
  if (/\b(medic\w*|diagnos\w*|allerg\w*|treat\w*|poison\w*|legal|lawyer|lawsuit|tax\w*|financial|invest\w*|loan\w*|profit forecast|accounting|liability|contract|health advice)\b/i.test(clean)) {
    return 'I only provide general restaurant-management guidance for inventory, food-waste reduction, and operational efficiency, not medical, legal, or financial judgments. Please consult a qualified professional for those questions.';
  }
  if (/\b(unsafe|illegal|fraud|harm|weapon\w*)\b/i.test(clean)) {
    return 'I cannot help with unsafe or harmful instructions. I can offer general restaurant-management guidance for inventory, food-waste reduction, and operational efficiency.';
  }
  if (/\b(automatic\w*|place\w*\s+(an?\s+)?orders?|order\s+(food|ingredients|supplies)|change\s+(my\s+)?inventory|delete\s+(my\s+)?inventory)\b/i.test(clean)) {
    return 'I cannot change inventory or place orders. Your manager or operations team must review and carry out any decisions manually.';
  }
  if (/\b(weather|politics|sports|homework|write\s+(code|an?\s+essay)|ignore\s+(the\s+)?(rules|instructions))\b/i.test(clean)
    || (/\?|^(who|what|where|when|why|how|can|could|should|tell|explain)\b/i.test(clean) && !/\b(restaurant|café|cafe|bakery|catering|buffet|inventory|stock|ingredients?|food|waste|prep\w*|purchas\w*|operations?|efficien\w*|staff|shift|menu|sales|service|expir\w*)\b/i.test(clean))) {
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