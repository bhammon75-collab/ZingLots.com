import { getUrgency } from './urgency';

test('urgency thresholds', () => {
  const now = Date.now();
  expect(getUrgency(new Date(now + 50*60*1000).toISOString())).toBe('crit');
  expect(getUrgency(new Date(now + 5*60*60*1000).toISOString())).toBe('warn');
  expect(getUrgency(new Date(now + 60*60*60*1000).toISOString())).toBe('base');
});