import { Bookmark } from 'lucide-react';
import type { SavedMarketingAsset } from '@/lib/marketing/content';
export function SavedAssets({ assets = [] }: { assets?: SavedMarketingAsset[] }) {
  return <div className="border-t border-border pt-6">
    <p className="mb-5 text-sm text-muted-foreground">Save buttons on posts, scripts, landing copy, and campaign days store assets in AURA's database. Saved assets can't be listed here yet because reading them back is not permitted.</p>
    {assets.length === 0 ? <div className="flex items-start gap-4 py-6"><Bookmark className="h-6 w-6 shrink-0 text-primary" /><div><h3 className="text-lg">Saved assets are not shown here</h3><p className="mt-2 text-sm text-muted-foreground">You can copy or export your materials now.</p></div></div> : <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr>{['Title', 'Type', 'Platform', 'Saved on'].map(h => <th key={h} className="p-3">{h}</th>)}</tr></thead><tbody>{assets.map(asset => <tr key={asset.id} className="border-t border-border"><td className="p-3">{asset.title}</td><td className="p-3">{asset.type}</td><td className="p-3">{asset.platform}</td><td className="p-3">{asset.savedAt}</td></tr>)}</tbody></table></div>}
  </div>;
}
