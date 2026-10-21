import { useState } from 'react';
import { Copy, Check, Bookmark, Download } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { downloadText } from '@/lib/marketing/export';
export function ContentActions({ text, filename, save = false }: { text: string; filename?: string; save?: boolean }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try { await navigator.clipboard.writeText(text); setCopied(true); toast.success('Copied to clipboard'); setTimeout(() => setCopied(false), 2000); }
    catch { toast.error('Could not copy. Clipboard access is unavailable. You can export the content instead.'); }
  }
  return <div className="flex flex-wrap items-center gap-2">
    <Button variant="outline" size="sm" onClick={copy} aria-label="Copy content">{copied ? <Check /> : <Copy />}{copied ? 'Copied' : 'Copy'}</Button>
    {filename && <Button variant="ghost" size="sm" onClick={() => downloadText(filename, text)} aria-label="Export content"><Download />Export TXT</Button>}
    {save && <Button variant="ghost" size="sm" onClick={() => toast.info('Saving is not configured. External persistence will be connected separately. No asset was saved.')}><Bookmark />Save</Button>}
  </div>;
}
