import { createFileRoute } from '@tanstack/react-router';
import { useServerFn } from '@tanstack/react-start';
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { ArrowUp, Check, Leaf, RotateCcw, ShieldCheck, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Navbar } from '@/components/shared/navbar';
import { Footer } from '@/components/shared/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { guardrailFor, intakeQuestions, recommend } from '@/lib/chat/intake';
import { adviceBoundary, humanCheckpoint, recommendationIntro, formatRecommendation } from '@/lib/chat/recommendation';
import { saveChatSession, saveChatFeedback } from '@/lib/chat-storage.functions';

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
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [savingSession, setSavingSession] = useState(false);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const [savingFeedback, setSavingFeedback] = useState(false);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);
  const conversation = useRef(0);
  const sessionRequested = useRef(false);
  const feedbackRequested = useRef(false);
  const persistSession = useServerFn(saveChatSession);
  const persistFeedback = useServerFn(saveChatFeedback);
  const latest = useRef<HTMLDivElement>(null);
  const started = useRef(false);
  const question = intakeQuestions[answers.length];
  const result = answers.length === 3 && answers[0] !== undefined && answers[1] !== undefined && answers[2] !== undefined
    ? recommend([answers[0], answers[1], answers[2]]) : null;

  useEffect(() => {
    if (started.current) latest.current?.scrollIntoView({ block: 'nearest', behavior: 'instant' });
  }, [answers.length, guardrail]);

  function saveSession(next: string[]) {
    if (next[0] === undefined || next[1] === undefined || next[2] === undefined) return;
    sessionRequested.current = true;
    const generation = conversation.current;
    const recommendation = formatRecommendation(recommend([next[0], next[1], next[2]]));
    setSavingSession(true); setSessionError(null);
    void persistSession({ data: { restaurant_type: next[0], inventory_challenge: next[1], improvement_goal: next[2], recommendation } })
      .then(saved => {
        if (conversation.current !== generation) return;
        setSessionId(saved.sessionId); setSessionError(saved.error);
        if (!saved.sessionId) sessionRequested.current = false;
      })
      .catch(() => {
        if (conversation.current !== generation) return;
        sessionRequested.current = false;
        setSessionError('Could not confirm the conversation save. Your recommendation is still available.');
      })
      .finally(() => { if (conversation.current === generation) setSavingSession(false); });
  }

  function answer(value: string) {
    const clean = value.trim();
    if (!clean || !question) return;
    started.current = true;
    const blocked = guardrailFor(clean);
    if (blocked) { setGuardrail(blocked); return; }
    const next = [...answers, clean];
    setAnswers(next);
    if (next.length === 3 && !sessionRequested.current) saveSession(next);
    setOther(false); setDraft(''); setGuardrail(null);
  }

  function reset() {
    conversation.current += 1;
    sessionRequested.current = false; feedbackRequested.current = false;
    started.current = false;
    setAnswers([]); setOther(false); setDraft(''); setGuardrail(null); setFeedback(null);
    setSessionId(null); setSessionError(null); setSavingSession(false); setFeedbackError(null); setSavingFeedback(false);
  }

  async function submitFeedback(rating: 'up' | 'down') {
    if (!sessionId || feedbackRequested.current || feedback) return;
    feedbackRequested.current = true;
    const generation = conversation.current;
    setSavingFeedback(true); setFeedbackError(null);
    try {
      const saved = await persistFeedback({ data: { session_id: sessionId, rating } });
      if (conversation.current !== generation) return;
      if (saved.ok) setFeedback(rating);
      else { feedbackRequested.current = false; setFeedbackError(saved.error); }
    } catch {
      if (conversation.current === generation) { feedbackRequested.current = false; setFeedbackError('Could not confirm your feedback save.'); }
    } finally {
      if (conversation.current === generation) setSavingFeedback(false);
    }
  }


  function submit(event: FormEvent) { event.preventDefault(); answer(draft); }

  return <div className="min-h-screen bg-background"><Navbar /><main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
    <header className="mb-8 flex flex-wrap items-start justify-between gap-4 border-b border-border pb-6">
      <div><p className="mb-2 flex items-center gap-2 text-sm font-medium text-primary"><Leaf className="h-4 w-4" />AURA · GUIDED SUPPORT</p><h1 className="text-2xl leading-snug sm:text-3xl">AURA Smart Assistant</h1><p className="mt-2 text-sm text-muted-foreground">Inventory. Less waste. Better operations.</p></div>
      <Button variant="outline" onClick={reset}><RotateCcw />Start New Conversation</Button>
    </header>
    <div role="log" aria-label="Guided conversation" aria-live="polite" className="space-y-5">
      <AssistantMessage><p className="font-semibold text-primary">Welcome to AURA Smart Assistant.</p><p className="mt-2">I’m a guided assistant for restaurant owners and managers. Tell me about your restaurant in three questions, and I’ll suggest a practical starting point for your team.</p><p className="mt-2 text-muted-foreground">Rule-based guidance, not a live AI chat. Completed answers and recommendations are sent to AURA’s conversation storage.</p></AssistantMessage>
      {answers.map((selection, index) => <div key={index} className="space-y-4"><AssistantMessage><p>{intakeQuestions[index]?.text}</p></AssistantMessage><div className="ml-12 flex justify-end"><p className="max-w-full break-words rounded-lg bg-primary px-4 py-3 text-sm text-primary-foreground">{selection}</p></div></div>)}
      <div ref={latest} className="space-y-4">
        {question && <AssistantMessage><p className="mb-2 text-xs font-medium text-muted-foreground">Question {answers.length + 1} of 3</p><p className="font-semibold">{question.text}</p><div className="mt-4 grid gap-2 sm:grid-cols-2">{question.options.map(option => <Button key={option} variant="outline" className="h-auto min-h-11 justify-start whitespace-normal py-3 text-left" onClick={() => { if (option === 'Other') { setOther(true); setGuardrail(null); } else answer(option); }} aria-pressed={option === 'Other' && other}>{option}</Button>)}</div>
          {other && <form onSubmit={submit} className="mt-4"><label htmlFor="other-answer" className="mb-2 block text-sm">Your answer</label><div className="flex gap-2"><Input id="other-answer" value={draft} maxLength={240} onChange={e => setDraft(e.target.value)} autoFocus placeholder="Describe your restaurant or priority" /><Button type="submit" size="icon" disabled={!draft.trim()} aria-label="Send answer" title="Send answer"><ArrowUp /></Button></div></form>}
        </AssistantMessage>}
        {guardrail && <div role="alert"><AssistantMessage><div className="flex gap-2"><ShieldCheck className="mt-1 h-4 w-4 shrink-0 text-primary" /><p>{guardrail}</p></div></AssistantMessage></div>}
        {result && <AssistantMessage><p className="text-xs font-medium uppercase text-primary">Your starting point</p><h2 className="mt-2 text-xl">{result.focus}</h2><p className="mt-3">{recommendationIntro}</p><ol className="mt-4 space-y-3">{result.actions.map((action, index) => <li key={action} className="flex gap-3"><span className="font-semibold text-primary">{index + 1}.</span><span>{action}</span></li>)}</ol>
          <div className="mt-6 border-t border-border pt-4"><p className="flex items-start gap-2 font-medium text-primary"><ShieldCheck className="mt-1 h-5 w-5 shrink-0" />{humanCheckpoint}</p><p className="mt-3 text-muted-foreground">{adviceBoundary}</p></div>
          <div className="mt-5 border-t border-border pt-4">
            <div role="status" className="text-sm text-muted-foreground">{savingSession ? 'Saving conversation…' : sessionId ? <span className="flex items-center gap-2 text-primary"><Check className="h-4 w-4" />Conversation saved.</span> : null}</div>
            {sessionError && <div role="alert" className="mt-2 flex flex-wrap items-center gap-3 text-sm text-destructive"><p>{sessionError}</p>{!sessionId && !savingSession && <Button variant="outline" size="sm" onClick={() => saveSession(answers)}>Retry save</Button>}</div>}
            <div className="mt-3 flex flex-wrap items-center gap-3"><span className="text-sm">Was this helpful?</span><Button variant={feedback === 'up' ? 'secondary' : 'ghost'} size="icon" disabled={!sessionId || savingFeedback || !!feedback} onClick={() => void submitFeedback('up')} aria-label="Helpful" aria-pressed={feedback === 'up'} title="Helpful"><ThumbsUp /></Button><Button variant={feedback === 'down' ? 'secondary' : 'ghost'} size="icon" disabled={!sessionId || savingFeedback || !!feedback} onClick={() => void submitFeedback('down')} aria-label="Not helpful" aria-pressed={feedback === 'down'} title="Not helpful"><ThumbsDown /></Button><span role="status" className="flex items-center gap-1 text-xs text-muted-foreground">{savingFeedback ? 'Saving feedback…' : feedback ? <><Check className="h-3 w-3" />Feedback saved. Thank you.</> : !sessionId ? 'Feedback requires a confirmed conversation.' : 'One feedback submission per conversation.'}</span></div>
            {feedbackError && <p role="alert" className="mt-2 text-sm text-destructive">{feedbackError} You can try again.</p>}
          </div>
        </AssistantMessage>}
      </div>
    </div>
  </main><Footer /></div>;
}