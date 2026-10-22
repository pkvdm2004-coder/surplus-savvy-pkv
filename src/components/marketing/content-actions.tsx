import { useState } from 'react';
import { Copy, Check, Bookmark, Download } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { downloadText } from '@/lib/marketing/export';
import { saveMarketingAsset, type MarketingAssetInput } from '@/lib/marketing-assets.functions';
export function ContentActions({ text, filename, asset }: { text: string; filename?: string; asset?: Omit<MarketingAssetInput, 'content'> }) {
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  async function save() {
    if (!asset) return;
    setSaving(true);
    try {
      const res = await saveMarketingAsset({ data: { ...asset, content: text } });
      if (res.ok) toast.success(`Saved "${asset.title}" to marketing assets`);
      else toast.error(`Could not save asset: ${res.error}`);
    } catch (e) { toast.error(`Could not save asset: ${e instanceof Error ? e.message : 'network error'}`); }
    finally { setSaving(false); }
  }
  async function copy() {
    try { await navigator.clipboard.writeText(text); setCopied(true); toast.success('Copied to clipboard'); setTimeout(() => setCopied(false), 2000); }
    catch { toast.error('Could not copy. Clipboard access is unavailable. You can export the content instead.'); }
  }
  return <div className="flex flex-wrap items-center gap-2">
    <Button variant="outline" size="sm" onClick={copy} aria-label="Copy content">{copied ? <Check /> : <Copy />}{copied ? 'Copied' : 'Copy'}</Button>
    {filename && <Button variant="ghost" size="sm" onClick={() => downloadText(filename, text)} aria-label="Export content"><Download />Export TXT</Button>}
    {asset && <Button variant="ghost" size="sm" onClick={save} disabled={saving}><Bookmark />{saving ? 'Saving…' : 'Save'}</Button>}
  </div>;
}
