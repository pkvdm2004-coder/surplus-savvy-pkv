import { useCallback, useEffect, useState } from 'react';
import { RotateCcw, Check, Vote, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { comparisonDefaults } from '@/lib/marketing/content';
import { ContentActions } from './content-actions';
import { submitAbVote, getAbVoteResults, type VoteResults, type TestType } from '@/lib/ab-votes.functions';

const VOTE_KEY = (kind: TestType) => `aura-ab-vote-${kind}`;

function readVoted(kind: TestType): boolean {
  try { return localStorage.getItem(VOTE_KEY(kind)) === '1'; } catch { return false; }
}
function markVoted(kind: TestType) {
  try { localStorage.setItem(VOTE_KEY(kind), '1'); } catch { /* storage unavailable: voting still works */ }
}

function ResultsPanel({ kind }: { kind: TestType }) {
  const [results, setResults] = useState<VoteResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAbVoteResults({ data: { test_type: kind } });
      if (res.error) setError(res.error);
      else setResults(res.results);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Network error');
    } finally { setLoading(false); }
  }, [kind]);

  useEffect(() => { load(); }, [load]);

  // Expose a refresh hook for the parent via custom event.
  useEffect(() => {
    const handler = () => load();
    window.addEventListener(`aura-ab-refresh-${kind}`, handler);
    return () => window.removeEventListener(`aura-ab-refresh-${kind}`, handler);
  }, [kind, load]);

  return (
    <div className="mt-5 rounded-lg border border-border bg-secondary/20 p-4">
      <div className="flex items-center justify-between gap-2">
        <h4 className="text-sm font-semibold">Vote results</h4>
        <Button variant="ghost" size="icon" aria-label="Refresh results" title="Refresh results" onClick={load} disabled={loading}>
          <RefreshCw className={loading ? 'animate-spin' : ''} />
        </Button>
      </div>
      {loading && <p className="mt-3 text-sm text-muted-foreground">Loading results…</p>}
      {!loading && error && (
        <p role="alert" className="mt-3 text-sm text-destructive">Could not load results: {error}</p>
      )}
      {!loading && !error && results && results.total === 0 && (
        <p className="mt-3 text-sm text-muted-foreground">No votes yet for this comparison.</p>
      )}
      {!loading && !error && results && results.total > 0 && (
        <div className="mt-3 space-y-3">
          <p className="text-sm text-muted-foreground">Total votes: <strong className="text-foreground">{results.total}</strong></p>
          {(['A', 'B'] as const).map(v => {
            const count = v === 'A' ? results.a : results.b;
            const pct = v === 'A' ? results.pctA : results.pctB;
            return (
              <div key={v}>
                <div className="flex justify-between text-sm"><span>Variant {v}</span><span>{count} votes · {pct}%</span></div>
                <div className="mt-1 h-2 rounded-full bg-secondary/60">
                  <div className="h-2 rounded-full bg-primary" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function Comparison({ kind }: { kind: 'headline' | 'cta' }) {
  const defaults = comparisonDefaults[kind];
  const [variants, setVariants] = useState<string[]>([...defaults]);
  const [preferred, setPreferred] = useState<number | null>(null);
  const [observations, setObservations] = useState('');
  const [alreadyVoted, setAlreadyVoted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [voteMessage, setVoteMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const title = kind === 'headline' ? 'Headline comparison' : 'CTA comparison';
  const report = `${title}\nVariant A: ${variants[0]}\nVariant B: ${variants[1]}\nUser preference: ${preferred === null ? 'Not selected' : `${preferred === 0 ? 'A' : 'B'} — ${variants[preferred]}`}\nObservations: ${observations || 'None'}\nNo traffic or experiment data. This is a user preference, not a measured result.`;

  useEffect(() => { setAlreadyVoted(readVoted(kind)); }, [kind]);

  async function submitVote() {
    if (preferred === null || alreadyVoted) return;
    setSubmitting(true);
    setVoteMessage(null);
    try {
      const res = await submitAbVote({ data: { test_type: kind, variant: preferred === 0 ? 'A' : 'B' } });
      if (res.ok) {
        markVoted(kind);
        setAlreadyVoted(true);
        setVoteMessage({ ok: true, text: 'Your vote was recorded.' });
        window.dispatchEvent(new Event(`aura-ab-refresh-${kind}`));
      } else {
        setVoteMessage({ ok: false, text: `Could not record your vote: ${res.error}` });
      }
    } catch (e) {
      setVoteMessage({ ok: false, text: `Could not record your vote: ${e instanceof Error ? e.message : 'network error'}` });
    } finally { setSubmitting(false); }
  }

  return <article className="min-w-0 rounded-lg border border-border bg-card p-5">
    <div className="flex items-center justify-between gap-2"><h3 className="text-lg">{title}</h3><Button variant="ghost" size="icon" aria-label={`Reset ${title.toLowerCase()}`} title="Reset comparison" onClick={() => { setVariants([...defaults]); setPreferred(null); setObservations(''); setVoteMessage(null); }}><RotateCcw /></Button></div>
    <div className="mt-5 grid gap-4 sm:grid-cols-2">{variants.map((value, index) => <div key={index} className="min-w-0">
      <Label htmlFor={`${kind}-${index}`}>Variant {index === 0 ? 'A' : 'B'}</Label>
      <Textarea id={`${kind}-${index}`} className="mt-2 min-h-28 resize-y" value={value} onChange={e => { setVariants(variants.map((v, i) => i === index ? e.target.value : v)); setPreferred(null); }} />
      <Button className="mt-3 w-full" variant={preferred === index ? 'default' : 'outline'} disabled={!value.trim() || alreadyVoted} aria-pressed={preferred === index} onClick={() => setPreferred(index)}>{preferred === index && <Check />}Prefer {index === 0 ? 'A' : 'B'}</Button>
    </div>)}</div>
    <p role="status" className="my-4 text-sm text-primary">{preferred === null ? 'No preference selected.' : `Your preference: Variant ${preferred === 0 ? 'A' : 'B'}. Not a measured winner.`}</p>
    <div className="flex flex-wrap items-center gap-3">
      <Button onClick={submitVote} disabled={preferred === null || submitting || alreadyVoted}>
        <Vote />{submitting ? 'Submitting…' : alreadyVoted ? 'Vote submitted' : 'Submit Vote'}
      </Button>
      {alreadyVoted && <span className="text-sm text-muted-foreground">You already voted on this comparison from this browser.</span>}
    </div>
    {voteMessage && <p role="status" className={`mt-3 text-sm ${voteMessage.ok ? 'text-primary' : 'text-destructive'}`}>{voteMessage.text}</p>}
    <p className="mt-3 text-xs text-muted-foreground">Duplicate-vote prevention uses this browser's local storage only — it is not secure identity verification and can be bypassed.</p>
    <ResultsPanel kind={kind} />
    <Label htmlFor={`${kind}-observations`}>Observations</Label><Textarea id={`${kind}-observations`} className="mt-2" value={observations} onChange={e => setObservations(e.target.value)} placeholder="Record your reasoning…" />
    <div className="mt-4"><ContentActions text={report} filename={`aura-${kind}-comparison.txt`} /></div>
  </article>;
}
