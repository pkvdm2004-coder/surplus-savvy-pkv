import { Link } from '@tanstack/react-router';
import { BookOpen, ExternalLink, GitBranch, Layers, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { architecture, buildLogs, lessons, moduleTimeline } from '@/lib/documentation';
import prompts from '@/lib/documentation/prompts.json';

const sections = [
  ['overview', 'Project Overview'], ['timeline', 'Module Development Timeline'],
  ['prompts', 'Prompt Library'], ['architecture', 'Architecture'],
  ['build-logs', 'Build Logs'], ['decisions', 'Human Decisions & Lessons Learned'],
  ['status', 'Current Status'], ['uploads', 'Document Uploads'],
] as const;

function SectionHeading({ label, title }: { label: string; title: string }) {
  return <div className="mb-6"><p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">{label}</p><h2 className="text-2xl text-primary">{title}</h2></div>;
}

export function ProjectDocumentation() {
  return <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <nav aria-label="Documentation sections" className="flex flex-wrap gap-2 border-y border-border py-5">
      {sections.map(([id, label]) => <Button asChild key={id} variant="ghost" size="sm" className="h-auto whitespace-normal text-left"><Link to="/docs" hash={id}>{label}</Link></Button>)}
    </nav>
    <section id="overview" className="scroll-mt-24 py-12">
      <SectionHeading label="01 / Purpose" title="Project Overview" />
      <div className="grid gap-8 md:grid-cols-[2fr_1fr]">
        <div><p className="max-w-3xl text-lg leading-relaxed">AURA / Surplus Savvy helps restaurants reduce food waste through inventory management, surplus predictions, research, business tools, and guided recommendations.</p><p className="mt-4 leading-relaxed text-muted-foreground">The project evolved through focused development modules. Working features are separated from proposed capabilities, and recorded technical checks are not presented as proof of financial or environmental impact.</p></div>
        <div className="border-l-2 border-primary pl-5"><p className="font-semibold text-primary">Project repository</p><Button asChild variant="outline" className="mt-4"><a href="https://github.com/pkvdm2004-coder/surplus-savvy-pkv" target="_blank" rel="noopener noreferrer"><GitBranch className="h-4 w-4" />View on GitHub<ExternalLink className="h-4 w-4" /></a></Button><p className="mt-3 break-all text-sm text-muted-foreground">pkvdm2004-coder / surplus-savvy-pkv</p></div>
      </div>
    </section>
    <section id="timeline" className="scroll-mt-24 border-t border-border py-12">
      <SectionHeading label="02 / Development" title="Module Development Timeline" />
      <ol className="grid gap-4 md:grid-cols-2">{moduleTimeline.map(module => <li key={module.number} className="rounded-lg border border-border p-6"><div className="flex flex-wrap items-center justify-between gap-3"><span className="text-sm font-semibold text-primary">Module {module.number}</span><span className="text-xs text-muted-foreground">{module.status}</span></div><h3 className="mt-4 text-lg">{module.title}</h3><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{module.detail}</p></li>)}</ol>
    </section>
    <section id="prompts" className="scroll-mt-24 border-t border-border py-12">
      <SectionHeading label="03 / Original sources" title="Prompt Library" />
      <p className="mb-5 max-w-3xl leading-relaxed text-muted-foreground">Original wording from available user messages and uploaded briefs. These are historical requests, not guarantees that every requested feature was built. The library is selected, not exhaustive.</p>
      <div className="mb-8 flex items-start gap-3 border-l-2 border-primary bg-muted/30 p-5"><BookOpen className="mt-1 h-5 w-5 shrink-0 text-primary" /><p className="text-sm leading-relaxed">Source limitations: the initial Module 4 brief ends at the Section D heading; the separately supplied continuation is included. Formal Module 1 and Module 2 master briefs were not supplied in the available record, so their actual individual requests are shown instead. No original prompt for a Vercel deployment or the future full Demo is available. Nothing has been reconstructed as an exact prompt.</p></div>
      <div className="space-y-8">{moduleTimeline.map(module => <div key={module.number}><h3 className="mb-4 text-lg text-primary">Module {module.number} — {module.title}</h3><div className="divide-y divide-border border-y border-border">{prompts.filter(prompt => prompt.module === module.number).map(prompt => <details key={prompt.id} className="group py-4"><summary className="cursor-pointer text-sm font-semibold text-foreground"><span className="ml-2">{prompt.title}</span><span className="ml-3 text-xs font-normal text-muted-foreground">{prompt.availability}</span></summary><div className="mt-4 pl-4"><p className="mb-4 break-words text-xs text-muted-foreground">{prompt.source}</p><pre className="max-h-[32rem] overflow-y-auto whitespace-pre-wrap break-words rounded-lg bg-muted/30 p-4 font-body text-sm leading-relaxed">{prompt.text}</pre></div></details>)}</div></div>)}</div>
    </section>
    <section id="architecture" className="scroll-mt-24 border-t border-border py-12">
      <SectionHeading label="04 / System" title="Architecture" />
      <div className="grid gap-5 md:grid-cols-2">{architecture.map(item => <article key={item.title} className="rounded-lg border border-border p-6"><Layers className="mb-4 h-5 w-5 text-primary" /><h3 className="text-lg">{item.title}</h3><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.detail}</p></article>)}</div>
    </section>
    <section id="build-logs" className="scroll-mt-24 border-t border-border py-12">
      <SectionHeading label="05 / Evidence" title="Build Logs" />
      <p className="mb-8 max-w-3xl text-sm leading-relaxed text-muted-foreground">Milestone summaries based on original prompts, source code, README, local history, and recorded development reports. Historical tests are labeled as such; no deployment, commit, or business result is invented.</p>
      <div className="divide-y divide-border">{buildLogs.map(log => <article key={log.title} className="grid gap-4 py-6 md:grid-cols-[1fr_2fr]"><div><h3 className="text-lg">{log.title}</h3><p className="mt-2 text-xs font-semibold text-primary">{log.status}</p></div><div><p className="text-sm leading-relaxed text-muted-foreground">{log.detail}</p><p className="mt-3 text-xs leading-relaxed text-muted-foreground">Source: {log.source}</p></div></article>)}</div>
    </section>
    <section id="decisions" className="scroll-mt-24 border-t border-border py-12">
      <SectionHeading label="06 / Human judgment" title="Human Decisions & Lessons Learned" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{lessons.map(lesson => <article key={lesson.title} className="rounded-lg border border-border p-6"><ShieldCheck className="mb-4 h-5 w-5 text-primary" /><h3 className="text-lg">{lesson.title}</h3><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{lesson.detail}</p></article>)}</div>
    </section>
    <section id="status" className="scroll-mt-24 border-t border-border py-12">
      <SectionHeading label="07 / Boundaries" title="Current Status" />
      <div className="grid gap-8 md:grid-cols-3">
        <div><h3 className="text-lg text-primary">Completed scope</h3><p className="mt-3 text-sm leading-relaxed text-muted-foreground">Inventory entry, surplus estimates, research filters, product/pricing tools, marketing content and persistence, guided chat, integrated navigation, and the real-data dashboard.</p></div>
        <div><h3 className="text-lg text-primary">Ongoing work</h3><p className="mt-3 text-sm leading-relaxed text-muted-foreground">Module 6 integration, documentation, and validation. Some external records are not visible under current read permissions. Publication of new changes requires a separate update.</p></div>
        <div><h3 className="text-lg text-primary">Future plans</h3><p className="mt-3 text-sm leading-relaxed text-muted-foreground">Full Demo, validated venture impact and viability evidence, Benchmark Cards, and Risk Map. No paid AI, checkout, automatic social publishing, or autonomous inventory actions are claimed.</p></div>
      </div>
    </section>
  </div>;
}