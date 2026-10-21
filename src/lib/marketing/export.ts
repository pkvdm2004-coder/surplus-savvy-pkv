import { brand, landingCopy, socialPosts, videoScripts, campaignDays, type SocialPost, type VideoScript } from './content';
export function formatPost(post: SocialPost) {
  return `${post.title}\nPlatform: ${post.platform}\n\n${post.caption}\n\n${post.hashtags.join(' ')}\n\nSuggested visual: ${post.visual}`;
}
export function formatScript(script: VideoScript) {
  return `${script.title}\nPlatform: ${script.platform}\nDuration: ${script.duration}\nOpening hook: ${script.hook}\n\n${script.scenes.map((s, i) => `Scene ${i + 1} (${s.time})\nVisual direction: ${s.visual}\nVoiceover: ${s.voiceover}`).join('\n\n')}\n\nClosing CTA: ${script.cta}`;
}
export function marketingText() {
  return `AURA MARKETING MATERIALS — DRAFT CONTENT\n\nBRAND SYSTEM\n${brand.name}\n${brand.positioning}\nMission: ${brand.mission}\nTone: ${brand.tone.join(', ')}\n\nILLUSTRATIVE PERSONA (NOT RESEARCH-VALIDATED)\nAlex — Restaurant Operations Manager\nChallenges: excess inventory, food waste, unpredictable demand, high operational costs, limited performance visibility.\nGoals: reduce unnecessary expenses, improve inventory decisions, minimize food waste, improve operational efficiency, make data-driven decisions.\n\nLANDING PAGE COPY\n${Object.entries(landingCopy).map(([key, value]) => `${key}: ${value}`).join('\n')}\nPrimary destination: /product\nSecondary destination: /pricing\n\nSOCIAL POSTS\n\n${socialPosts.map(formatPost).join('\n\n---\n\n')}\n\nVIDEO SCRIPTS\n\n${videoScripts.map(formatScript).join('\n\n---\n\n')}\n\nCAMPAIGN CALENDAR\n${campaignDays.map(d => `Day ${d.day} | ${d.platform} | ${d.type} | ${d.objective} | ${d.plannedContent} | ${d.assetId} | ${d.status}`).join('\n')}\n\nAll content is a draft. Calendar statuses are planned, not published. Asset saving is not configured.`;
}
export function csvCell(value: unknown) {
  const text = String(value ?? '');
  // Spreadsheet-safe: neutralize formula-like user or content input.
  return `"${(/^[=+@\-\t\r]/.test(text) ? "'" : '') + text.replaceAll('"', '""')}"`;
}
export function calendarCSV() {
  const rows = [['Day', 'Platform', 'Content type', 'Objective', 'Planned content', 'Asset ID', 'Status'], ...campaignDays.map(d => [d.day, d.platform, d.type, d.objective, d.plannedContent, d.assetId, d.status])];
  return '\uFEFF' + rows.map(row => row.map(csvCell).join(',')).join('\r\n');
}
export function downloadText(filename: string, text: string, mime = 'text/plain;charset=utf-8') {
  const url = URL.createObjectURL(new Blob([text], { type: mime }));
  const anchor = document.createElement('a'); anchor.href = url; anchor.download = filename;
  document.body.appendChild(anchor); anchor.click(); anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
