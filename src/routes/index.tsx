import { createFileRoute, Link } from '@tanstack/react-router';
import { Navbar } from '@/components/shared/navbar';
import { Footer } from '@/components/shared/footer';
import { Button } from '@/components/ui/button';
import { ArrowRight, Leaf, BarChart3, Package, TrendingDown, Search, Calculator, CircleDollarSign } from 'lucide-react';
import heroImage from '@/assets/hero-kitchen.jpg';
import { landingCopy } from '@/lib/marketing/content';
export const Route = createFileRoute('/')({
  component: Index,
  head: () => ({ meta: [
    { title: 'AURA — Smarter Restaurant Operations & Less Food Waste' },
    { name: 'description', content: landingCopy.subheadline },
    { property: 'og:title', content: 'AURA — Reduce Food Waste. Protect Your Profits.' },
    { property: 'og:description', content: landingCopy.subheadline },
    { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' },
  ] }),
});
const benefits = [
  { icon: Leaf, title: 'Less Food Waste', description: 'Use ingredients smarter and reduce unnecessary waste.' },
  { icon: CircleDollarSign, title: 'Higher Profitability', description: 'Improve operational efficiency and control costs.' },
  { icon: BarChart3, title: 'Data-Driven Decisions', description: 'Make better decisions using inventory and prediction insights.' },
];
const features = [
  { icon: Package, title: 'Inventory Management', description: 'Keep products, stock levels, daily sales, and expiration dates in view.', to: '/inventory' },
  { icon: TrendingDown, title: 'Waste Predictions', description: 'Estimate potential surplus and identify ingredients that need attention.', to: '/predictions' },
  { icon: Search, title: 'Competitor Research', description: 'Explore research entries and compare approaches in your market.', to: '/research' },
  { icon: Calculator, title: 'Pricing Simulations', description: 'Compare AURA plans and model subscription revenue scenarios.', to: '/pricing' },
] as const;
function Index() {
  return <div className="min-h-screen bg-background"><Navbar /><main>
    <section className="relative isolate overflow-hidden">
      <img src={heroImage} width={1344} height={896} alt="Chef preparing fresh ingredients in a restaurant kitchen" className="absolute inset-0 -z-20 h-full w-full object-cover object-right" />
      <div className="home-image-wash absolute inset-0 -z-10" />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="max-w-xl"><p className="mb-5 flex items-center gap-2 text-sm font-semibold text-primary"><Leaf className="h-5 w-5" />AURA · RESTAURANT INTELLIGENCE</p>
          <h1 className="text-4xl leading-tight sm:text-5xl">Reduce Food Waste.<br /><span className="text-primary">Protect Your Profits.</span></h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">{landingCopy.subheadline}</p>
          <div className="mt-8 flex flex-wrap gap-3"><Button asChild size="lg"><Link to="/product">Explore AURA<ArrowRight /></Link></Button><Button asChild variant="outline" size="lg"><Link to="/pricing">View Pricing</Link></Button></div>
        </div>
      </div>
    </section>
    <section className="border-b border-border bg-card"><div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 md:grid-cols-3 lg:px-8">{benefits.map(b => <div key={b.title} className="flex items-start gap-4"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-secondary/50"><b.icon className="h-5 w-5 text-primary" /></div><div><h2 className="text-base">{b.title}</h2><p className="mt-1 text-sm text-muted-foreground">{b.description}</p></div></div>)}</div></section>
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8"><div className="mx-auto max-w-3xl text-center"><p className="text-sm font-semibold uppercase text-primary">The AURA toolkit</p><h2 className="mt-3 text-2xl leading-snug sm:text-3xl">A complete platform for smarter restaurant operations</h2><p className="mt-4 text-muted-foreground">From inventory to planning, bring a clearer view to your next operational decision.</p></div>
      <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{features.map(f => <article key={f.title} className="flex flex-col rounded-lg border border-border bg-card p-6"><f.icon className="mb-5 h-7 w-7 text-primary" /><h3 className="text-lg">{f.title}</h3><p className="mb-5 mt-3 text-sm leading-relaxed text-muted-foreground">{f.description}</p><Button asChild variant="link" className="mt-auto justify-start p-0"><Link to={f.to}>Explore<ArrowRight /></Link></Button></article>)}</div>
    </section>
    <section className="relative isolate overflow-hidden bg-primary text-primary-foreground"><img src={heroImage} alt="Fresh ingredients prepared with care" width={1344} height={896} loading="lazy" className="absolute inset-0 -z-20 h-full w-full object-cover object-right" /><div className="sustainability-wash absolute inset-0 -z-10" /><div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8"><div className="max-w-xl"><Leaf className="mb-4 h-7 w-7" /><h2 className="text-2xl leading-snug sm:text-3xl">A more profitable and sustainable future for your restaurant.</h2><p className="mt-5 leading-relaxed">AURA aims to reduce avoidable food waste by helping teams understand their stock, review potential surplus, and make more intentional purchasing and prep decisions.</p><Button asChild variant="secondary" className="mt-7"><Link to="/product">Explore AURA<ArrowRight /></Link></Button></div></div></section>
  </main><Footer /></div>;
}
