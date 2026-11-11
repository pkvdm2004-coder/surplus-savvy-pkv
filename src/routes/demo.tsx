import { useState } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { Navbar } from '@/components/shared/navbar';
import { Footer } from '@/components/shared/footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Leaf, RotateCcw } from 'lucide-react';
import kitchenImage from '@/assets/hero-kitchen.jpg';
import { demoSteps, moveDemo } from '@/lib/demo';

export const Route = createFileRoute('/demo')({
  head: () => ({ meta: [
    { title: 'Demo — Integrated Venture Walkthrough | AURA Company' },
    { name: 'description', content: 'Explore nine connected AURA modules, from restaurant inventory and surplus estimates to pricing, marketing, guided recommendations and documented evidence.' },
    { property: 'og:title', content: 'AURA Demo — One Connected Restaurant Venture' },
    { property: 'og:description', content: 'A guided walkthrough of AURA’s working modules, real-data dashboard and development history, with clear limits and planned capabilities.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ] }),
  component: Demo,
});

function Demo() {
  const [position, setPosition] = useState(0);
  const step = demoSteps[position];
  const complete = position === demoSteps.length;
  return <div className="min-h-screen bg-background"><Navbar /><main>
    <section className="relative isolate overflow-hidden">
      <img src={kitchenImage} width={1344} height={896} alt="Chef preparing fresh ingredients in a restaurant kitchen" className="absolute inset-0 -z-20 h-full w-full object-cover object-right" />
      <div className="home-image-wash absolute inset-0 -z-10" />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div className="max-w-xl"><p className="flex items-center gap-2 text-sm font-semibold text-primary"><Leaf className="h-5 w-5" />AURA · Integrated venture</p>
          <h1 className="mt-4 text-3xl leading-tight text-primary sm:text-4xl">AURA Demo</h1>
          <p className="mt-5 text-lg leading-relaxed">Restaurants can prepare more food than they sell, losing ingredients and money. AURA brings inventory, surplus estimates and human-reviewed guidance together to support more informed decisions.</p>
          <p className="mt-4 text-sm text-muted-foreground">Nine connected modules · Working tools, transparent limits · Impact not yet validated</p>
        </div>
      </div>
    </section>
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8" aria-label="Guided walkthrough">
      <div className="mb-7 flex flex-wrap items-center justify-between gap-3"><h2 className="text-xl text-primary">From kitchen data to venture evidence</h2><p role="status" className="text-sm font-semibold text-primary">{complete ? 'Walkthrough complete · 9 of 9 modules' : `Step ${position + 1} of 9`}</p></div>
      <div role="progressbar" aria-label="Walkthrough progress" aria-valuemin={0} aria-valuemax={9} aria-valuenow={complete ? 9 : position + 1} className="mb-8 grid grid-cols-9 gap-1.5">
        {demoSteps.map((item, index) => <span key={item.to} className={`h-1.5 rounded-sm ${index <= position ? 'bg-primary' : 'bg-secondary/40'}`} />)}
      </div>
      <div className="grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-12">
        <nav aria-label="Walkthrough steps"><ol className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-1">{demoSteps.map((item, index) => <li key={item.to}>
          <Button variant={index === position ? 'secondary' : 'ghost'} onClick={() => setPosition(index)} aria-current={index === position ? 'step' : undefined} aria-label={`Step ${index + 1}: ${item.title}`} className="h-auto min-h-11 w-full justify-start whitespace-normal px-2 py-3 text-left sm:px-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border text-xs">{index < position ? <Check aria-hidden="true" className="h-3 w-3" /> : index + 1}</span><span className="min-w-0 break-words">{item.title}</span>
          </Button>
        </li>)}</ol></nav>
        <div className="min-w-0">
          <div aria-live="polite" aria-atomic="true" className="min-h-[380px]">
            {step ? <>
              <p className="text-sm font-semibold text-primary">{String(position + 1).padStart(2, '0')} / {step.title}</p><h2 className="mt-3 text-2xl leading-snug sm:text-3xl">{step.purpose}</h2>
              <div className="mt-7 border-t border-border pt-5"><p className="flex items-center gap-2 text-sm font-semibold text-primary"><Check className="h-4 w-4" />Working now</p><p className="mt-3 leading-relaxed">{step.working}</p></div>
              <div className="mt-6 border-l-2 border-border pl-4"><h3 className="font-body text-sm font-semibold text-muted-foreground">Limits & planned capabilities</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.boundary}</p></div>
              <p className="mt-6 text-sm leading-relaxed"><strong className="text-primary">Connection: </strong>{step.connection}</p>
              <Button asChild className="mt-6"><Link to={step.to} target="_blank" rel="noopener noreferrer">Open {step.title}<ArrowUpRight /><span className="sr-only"> (new tab)</span></Link></Button>
            </> : <>
              <p className="flex items-center gap-2 text-sm font-semibold text-primary"><Check className="h-4 w-4" />Nine modules, one venture</p><h2 className="mt-3 text-2xl leading-snug sm:text-3xl">An integrated foundation. Not a proven outcome.</h2>
              <p className="mt-6 leading-relaxed">Inventory and Predictions establish the operational starting point. Research informs the proposition; Product and Pricing frame the offering and revenue assumptions. Marketing communicates it, while Chat supports human-reviewed decisions. Dashboard brings stored evidence together, and Docs preserves the development trail.</p>
              <p className="mt-5 leading-relaxed text-muted-foreground">The modules are connected through navigation, shared inputs and existing storage—not an autonomous end-to-end restaurant workflow. No customer outcomes, financial performance or food-waste reductions have been validated by this demonstration.</p>
              <div className="mt-6 border-l-2 border-border pl-4"><h3 className="font-body text-sm font-semibold text-primary">Still ahead</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">Advanced forecasting and broader analytics remain proposed capabilities. Detailed agent mapping, impact assessment, viability analysis and the Version 2 roadmap are reserved for the next development step.</p></div>
              <div className="mt-6 flex flex-wrap gap-3"><Button asChild><Link to="/dashboard">Open Dashboard<ArrowUpRight /></Link></Button><Button asChild variant="outline"><Link to="/docs">View development evidence<ArrowRight /></Link></Button></div>
            </>}
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5">
            <Button variant="outline" disabled={position === 0} onClick={() => setPosition(current => moveDemo(current, -1))}><ArrowLeft />Previous</Button>
            {complete ? <Button variant="secondary" onClick={() => setPosition(0)}><RotateCcw />Restart</Button> : <Button onClick={() => setPosition(current => moveDemo(current, 1))}>{position === 8 ? 'Finish walkthrough' : 'Next'}<ArrowRight /></Button>}
          </div>
        </div>
      </div>
    </section>
  </main><Footer /></div>;
}