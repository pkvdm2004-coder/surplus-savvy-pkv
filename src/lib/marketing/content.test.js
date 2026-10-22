import { describe, test, expect } from 'bun:test';
import { socialPosts, videoScripts, campaignDays, comparisonDefaults } from './content';
import { formatPost, formatScript, marketingText, calendarCSV, csvCell } from './export';
describe('marketing content requirements', () => {
  test('exactly 10 posts across Instagram and LinkedIn', () => {
    expect(socialPosts).toHaveLength(10);
    expect(new Set(socialPosts.map(p => p.platform))).toEqual(new Set(['Instagram', 'LinkedIn']));
    expect(new Set(socialPosts.map(p => p.id)).size).toBe(10);
  });
  test('exactly 3 complete video scripts', () => {
    expect(videoScripts).toHaveLength(3);
    for (const script of videoScripts) { expect(script.scenes.length).toBeGreaterThan(1); expect(script.scenes.every(s => s.visual.length > 0 && s.voiceover.length > 0)).toBe(true); }
  });
  test('all 14 days link to existing assets', () => {
    expect(campaignDays.map(d => d.day)).toEqual(Array.from({ length: 14 }, (_, i) => i + 1));
    const ids = new Set([...socialPosts, ...videoScripts].map(a => a.id));
    expect(campaignDays.every(d => ids.has(d.assetId) && d.status === 'Planned')).toBe(true);
  });
  test('campaign follows requested four stages', () => {
    expect(campaignDays.slice(0, 4).every(d => d.objective === 'Brand Awareness')).toBe(true);
    expect(campaignDays.slice(4, 9).every(d => d.objective === 'Product Education')).toBe(true);
    expect(campaignDays.slice(9, 12).every(d => d.objective === 'Value Proposition')).toBe(true);
    expect(campaignDays.slice(12).every(d => d.objective === 'Conversion and Calls to Action')).toBe(true);
  });
  test('TXT export preserves complete posts and scripts', () => {
    const text = marketingText();
    for (const post of socialPosts) expect(text).toContain(formatPost(post));
    for (const script of videoScripts) expect(text).toContain(formatScript(script));
  });
  test('CSV exports all days and escapes quotes and formulas', () => {
    expect(calendarCSV().split('\r\n')).toHaveLength(15);
    expect(csvCell('A "quote", comma')).toBe('"A ""quote"", comma"');
    expect(csvCell('=2+2')).toBe('"\'=2+2"');
  });
});