import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { ArrowUp, Check, Leaf, RotateCcw, ShieldCheck, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Navbar } from '@/components/shared/navbar';
import { Footer } from '@/components/shared/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { guardrailFor, intakeQuestions, recommend } from '@/lib/chat/intake';

export const Route = createFileRoute('/chat')({
  component: Chat,
  head: () => ({ meta: [
    { title: 'AURA Smart Assistant — Guided Restaurant Recommendations' },
    { name: 'description', content: 'Explore practical, rule-based inventory, food-waste, and operations guidance with the AURA Smart Assistant.' },
    { property: 'og:title', content: 'AURA Smart Assistant — Guided Restaurant Recommendations' },
    { property: 'og:description', content: 'Three guided questions to help your restaurant team choose a practical starting point.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ] }),
});

function AssistantMessage({ children }: { children: ReactNode }) {
  return <div className="flex items-start gap-3"><div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground"><Leaf className="h-4 w-4" /></div><div className="min-w-0 flex-1 rounded-lg border border-border/60 bg-muted/40 p-4 text-sm leading-relaxed sm:p-5">{children}</div></div>;
}

function Chat() {
  const [answers, setAnswers] = useState<string[]>([]);
  const [other, setOther] = useState(false);
  const [draft, setDraft] = useState('');
  const [guardrail, setGuardrail] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);
  const latest = useRef<HTMLDivElement>(null);
  const started = useRef(false);
  const question = intakeQuestions[answers.length];
  const result = answers.length === 3 && answers[0] !== undefined && answers[1] !== undefined && answers[2] !== undefined
    ? recommend([answers[0], answers[1], answers[2]]) : null;

  useEffect(() => {
    if (started.current) latest.current?.scrollIntoView({ block: 'nearest', behavior: 'instant' });
  }, [answers.length, guardrail]);

  function answer(value: string) {
    const clean = value.trim();
    if (!clean || !question) return;
    started.current = true;
    const blocked = guardrailFor(clean);
    if (blocked) { setGuardrail(blocked); return; }
    setAnswers(previous => [...previous, clean]);
    setOther(false); setDraft(''); setGuardrail(null);
  }

  function reset() {
    started.current = false;
    setAnswers([]); setOther(false); setDraft(''); setGuardrail(null); setFeedback(null);
  }

  function submit(event: FormEvent) { event.preventDefault(); answer(draft); }

  return <div className="min-h-screen bg-background"><Navbar /><main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
    <header className="mb-8 flex flex-wrap items-start justify-between gap-4 border-b border-border pb-6">
      <div><p className="mb-2 flex items-center gap-2 text-sm font-medium text-primary"><Leaf className="h-4 w-4" />AURA · GUIDED SUPPORT</p><h1 className="text-2xl leading-snug sm:text-3xl">AURA Smart Assistant</h1><p className="mt-2 text-sm text-muted-foreground">Inventory. Less waste. Better operations.</p></div>
      <Button variant="outline" onClick={reset}><RotateCcw />Start New Conversation</Button>
    </header>
    <div role="log" aria-label="Guided conversation" aria-live="polite" className="space-y-5">
      <AssistantMessage><p className="font-semibold text-primary">Welcome to AURA Smart Assistant.</p><p className="mt-2">I’m a guided assistant for restaurant owners and managers. Tell me about your restaurant in three questions, and I’ll suggest a practical starting point for your team.</p><p className="mt-2 text-muted-foreground">Rule-based guidance, not a live AI chat. Conversations are not saved.</p></AssistantMessage>
      {answers.map((selection, index) => <div key={index} className="space-y-4"><AssistantMessage><p>{intakeQuestions[index]?.text}</p></AssistantMessage><div className="ml-12 flex justify-end"><p className="max-w-full break-words rounded-lg bg-primary px-4 py-3 text-sm text-primary-foreground">{selection}</p></div></div>)}
      <div ref={latest} className="space-y-4">
        {question && <AssistantMessage><p className="mb-2 text-xs font-medium text-muted-foreground">Question {answers.length + 1} of 3</p><p className="font-semibold">{question.text}</p><div className="mt-4 grid gap-2 sm:grid-cols-2">{question.options.map(option => <Button key={option} variant="outline" className="h-auto min-h-11 justify-start whitespace-normal py-3 text-left" onClick={() => { if (option === 'Other') { setOther(true); setGuardrail(null); } else answer(option); }} aria-pressed={option === 'Other' && other}>{option}</Button>)}</div>
          {other && <form onSubmit={submit} className="mt-4"><label htmlFor="other-answer" className="mb-2 block text-sm">Your answer</label><div className="flex gap-2"><Input id="other-answer" value={draft} maxLength={240} onChange={e => setDraft(e.target.value)} autoFocus placeholder="Describe your restaurant or priority" /><Button type="submit" size="icon" disabled={!draft.trim()} aria-label="Send answer" title="Send answer"><ArrowUp /></Button></div></form>}
        </AssistantMessage>}
        {guardrail && <div role="alert"><AssistantMessage><div className="flex gap-2"><ShieldCheck className="mt-1 h-4 w-4 shrink-0 text-primary" /><p>{guardrail}</p></div></AssistantMessage></div>}
        {result && <AssistantMessage><p className="text-xs font-medium uppercase text-primary">Your starting point</p><h2 className="mt-2 text-xl">{result.focus}</h2><p className="mt-3">Based on your restaurant type, challenge, and first priority, consider these steps:</p><ol className="mt-4 space-y-3">{result.actions.map((action, index) => <li key={action} className="flex gap-3"><span className="font-semibold text-primary">{index + 1}.</span><span>{action}</span></li>)}</ol>
          <div className="mt-6 border-t border-border pt-4"><p className="flex items-start gap-2 font-medium text-primary"><ShieldCheck className="mt-1 h-5 w-5 shrink-0" />Please review these recommendations with your manager or operations team before making changes.</p><p className="mt-3 text-muted-foreground">General guidance only—not medical, legal, or financial advice. AURA will not change inventory or place orders.</p></div>
          <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-border pt-4"><span className="text-sm">Was this helpful?</span><Button variant={feedback === 'up' ? 'secondary' : 'ghost'} size="icon" onClick={() => setFeedback(feedback === 'up' ? null : 'up')} aria-label="Helpful" aria-pressed={feedback === 'up'} title="Helpful"><ThumbsUp /></Button><Button variant={feedback === 'down' ? 'secondary' : 'ghost'} size="icon" onClick={() => setFeedback(feedback === 'down' ? null : 'down')} aria-label="Not helpful" aria-pressed={feedback === 'down'} title="Not helpful"><ThumbsDown /></Button><span className="flex items-center gap-1 text-xs text-muted-foreground">{feedback && <Check className="h-3 w-3" />}Feedback preview only · not saved</span></div>
        </AssistantMessage>}
      </div>
    </div>
  </main><Footer /></div>;
}