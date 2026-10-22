import { useState } from 'react';
import { RotateCcw, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { comparisonDefaults } from '@/lib/marketing/content';
import { ContentActions } from './content-actions';
export function Comparison({ kind }: { kind: 'headline' | 'cta' }) {
  const defaults = comparisonDefaults[kind];
  const [variants, setVariants] = useState<string[]>([...defaults]);
  const [preferred, setPreferred] = useState<number | null>(null);
  const [observations, setObservations] = useState('');
  const title = kind === 'headline' ? 'Headline comparison' : 'CTA comparison';
  const report = `${title}\nVariant A: ${variants[0]}\nVariant B: ${variants[1]}\nUser preference: ${preferred === null ? 'Not selected' : `${preferred === 0 ? 'A' : 'B'} — ${variants[preferred]}`}\nObservations: ${observations || 'None'}\nNo traffic or experiment data. This is a user preference, not a measured result.`;
  return <article className="min-w-0 rounded-lg border border-border bg-card p-5">
    <div className="flex items-center justify-between gap-2"><h3 className="text-lg">{title}</h3><Button variant="ghost" size="icon" aria-label={`Reset ${title.toLowerCase()}`} title="Reset comparison" onClick={() => { setVariants([...defaults]); setPreferred(null); setObservations(''); }}><RotateCcw /></Button></div>
    <div className="mt-5 grid gap-4 sm:grid-cols-2">{variants.map((value, index) => <div key={index} className="min-w-0">
      <Label htmlFor={`${kind}-${index}`}>Variant {index === 0 ? 'A' : 'B'}</Label>
      <Textarea id={`${kind}-${index}`} className="mt-2 min-h-28 resize-y" value={value} onChange={e => { setVariants(variants.map((v, i) => i === index ? e.target.value : v)); setPreferred(null); }} />
      <Button className="mt-3 w-full" variant={preferred === index ? 'default' : 'outline'} disabled={!value.trim()} aria-pressed={preferred === index} onClick={() => setPreferred(index)}>{preferred === index && <Check />}Prefer {index === 0 ? 'A' : 'B'}</Button>
    </div>)}</div>
    <p role="status" className="my-4 text-sm text-primary">{preferred === null ? 'No preference selected.' : `Your preference: Variant ${preferred === 0 ? 'A' : 'B'}. Not a measured winner.`}</p>
    <Label htmlFor={`${kind}-observations`}>Observations</Label><Textarea id={`${kind}-observations`} className="mt-2" value={observations} onChange={e => setObservations(e.target.value)} placeholder="Record your reasoning…" />
    <div className="mt-4"><ContentActions text={report} filename={`aura-${kind}-comparison.txt`} /></div>
  </article>;
}
