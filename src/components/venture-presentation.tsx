import { Link } from '@tanstack/react-router';
import { ArrowDown, ArrowRight, ArrowUpRight, Boxes, Calculator, Database, Leaf, Megaphone, MessageSquare, Search, ShieldCheck, TrendingDown, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { tiers, usd } from '@/lib/plans';

const mapGroups = [
  { title: 'Inputs', relationship: 'Inventory → Predictions · Restaurant answers → Smart Assistant · Research → commercial planning', nodes: [
    { title: 'Inventory', icon: Boxes, text: 'Products, quantities, sales and expiration dates supply the surplus calculation.' },
    { title: 'Research', icon: Search, text: 'Stored competitor entries and sources inform the market proposition; they do not automatically generate decisions.' },
    { title: 'Restaurant team', icon: MessageSquare, text: 'Three guided answers describe restaurant type, inventory challenge and improvement goal.' },
  ] },
  { title: 'Processing', relationship: 'Calculations & rules → estimates, recommendations and commercial materials', nodes: [
    { title: 'Predictions', icon: TrendingDown, text: 'Implemented inventory-based surplus formula and risk labels. Historical forecasting and advanced AI are future proposals, not current logic.' },
    { title: 'Smart Assistant', icon: MessageSquare, text: 'Rule-based recommendations from three questions, with safety boundaries and a required human-review acknowledgment before feedback.' },
    { title: 'Pricing', icon: Calculator, text: 'Plan price × restaurant count models monthly revenue; annual revenue is monthly × 12. These are hypothetical scenarios.' },
    { title: 'Marketing', icon: Megaphone, text: 'Organizes campaign materials and records headline/CTA preference votes. Votes are not proven conversion results.' },
  ] },
  { title: 'Outputs', relationship: 'Accessible stored evidence → Dashboard · Guidance & scenarios → manager review', nodes: [
    { title: 'Dashboard', icon: BarChart3, text: 'Displays accessible Inventory and Research previews and database aggregate counts. Restricted individual records remain private.' },
    { title: 'Reviewable materials', icon: Leaf, text: 'Surplus estimates, recommendations, pricing scenarios and campaign content remain separate tools—not autonomous restaurant actions.' },
  ] },
];
const impactAreas = [
  { title: 'Operational value', text: 'Better inventory visibility and earlier identification of potential surplus may support more informed purchasing, preparation and stock decisions.' },
  { title: 'Economic value', text: 'Avoiding unnecessary preparation or purchasing could reduce avoidable costs. Customer savings, profitability and actual subscription earnings have not been measured here.' },
  { title: 'Environmental value', text: 'Using ingredients more intentionally could reduce avoidable food waste. No waste-reduction percentages or carbon-emission reductions have been established.' },
];
const horizons = [
  { title: 'Short Term', subtitle: 'Strengthen the foundation', items: ['Improve data completeness and dashboard reporting.', 'Strengthen security, validation and testing.', 'Improve onboarding and user experience.'] },
  { title: 'Medium Term', subtitle: 'Build evidence from real operations', items: ['Expand predictions using real historical data.', 'Improve restaurant-specific recommendations.', 'Introduce stronger reporting and impact measurement.'] },
  { title: 'Long Term', subtitle: 'Explore scale and richer intelligence', items: ['Explore more advanced AI-assisted forecasting.', 'Support additional restaurant locations.', 'Expand integrations and scalable operational analytics.'] },
];

export function VenturePresentation() {
  return <>
    <section aria-labelledby="agent-map-title" className="border-y border-border bg-secondary/15">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="text-sm font-semibold text-primary">01 / System relationships</p><h2 id="agent-map-title" className="mt-3 text-3xl text-primary">Agent Map</h2>
        <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">A map of connected tools, not autonomous agents. Current processing uses calculations and rules—not generative AI across every component. Arrows describe data use and human handoffs, not a fully automated pipeline.</p>
        <div className="mt-8 grid gap-6 lg:grid-cols-3">{mapGroups.map((group, index) => <div key={group.title} className="min-w-0">
          <div className="mb-4 flex items-center justify-between border-b border-border pb-3"><h3 className="text-lg text-primary">{index + 1}. {group.title}</h3>{index < 2 && <><ArrowRight className="hidden h-5 w-5 text-primary lg:block" aria-hidden="true" /><ArrowDown className="h-5 w-5 text-primary lg:hidden" aria-hidden="true" /></>}</div>
          <div className="space-y-3">{group.nodes.map(node => <article key={node.title} className="rounded-lg border border-border bg-background p-5"><div className="flex items-center gap-3"><node.icon className="h-5 w-5 shrink-0 text-primary" /><h4 className="font-body font-semibold">{node.title}</h4></div><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{node.text}</p></article>)}</div>
          <p className="mt-4 text-sm leading-relaxed text-primary">{group.relationship}</p>
        </div>)}</div>
        <div className="mt-8 grid gap-6 border-t border-border pt-7 md:grid-cols-2">
          <div><h3 className="flex items-center gap-3 text-lg text-primary"><Database className="h-5 w-5" />Existing database storage</h3><p className="mt-3 text-sm leading-relaxed text-muted-foreground">Inventory, Research and supported saved scenarios, marketing assets, votes, conversations and feedback use the existing application storage connections. Database totals feed the Dashboard; private records are not exposed by this map. Predictions are calculated from inventory, not automatically stored as prediction records.</p></div>
          <div><h3 className="flex items-center gap-3 text-lg text-primary"><ShieldCheck className="h-5 w-5" />Human Review</h3><p className="mt-3 text-sm leading-relaxed text-muted-foreground">Estimates and recommendations → restaurant manager or operations team → any operational decision. Managers remain responsible for food safety, purchasing and preparation. AURA does not place orders, change inventory autonomously or override expiration dates and regulations.</p></div>
        </div>
      </div>
    </section>
    <section aria-labelledby="impact-title" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="text-sm font-semibold text-primary">02 / Potential value, not measured outcomes</p><h2 id="impact-title" className="mt-3 text-3xl text-primary">Practical Impact Check</h2>
      <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">Working inventory tools and calculations demonstrate functionality, not restaurant impact. The benefits below are expected opportunities; they are not verified customer results.</p>
      <div className="mt-8 grid gap-6 md:grid-cols-3">{impactAreas.map(area => <article key={area.title} className="rounded-lg border border-border p-6"><p className="text-xs font-semibold text-primary">Potential benefit · Unmeasured</p><h3 className="mt-3 text-xl">{area.title}</h3><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{area.text}</p></article>)}</div>
      <div className="mt-8 border-t border-border pt-7"><h3 className="text-xl text-primary">How future impact could be measured</h3><ol className="mt-5 grid gap-6 md:grid-cols-3">
        <li><p className="font-semibold text-primary">1. Establish a baseline</p><p className="mt-2 text-sm leading-relaxed text-muted-foreground">Collect consistent waste logs, discarded quantities, reasons and ingredient costs. Align units, dates, inventory records and sales volumes before comparing periods.</p></li>
        <li><p className="font-semibold text-primary">2. Record reviewed changes</p><p className="mt-2 text-sm leading-relaxed text-muted-foreground">Document which suggestions managers approve, what purchasing or preparation changes occur, and the measurement period. Keep food safety and human oversight non-negotiable.</p></li>
        <li><p className="font-semibold text-primary">3. Compare follow-up measurements</p><p className="mt-2 text-sm leading-relaxed text-muted-foreground">Compare waste quantity and cost per meal or sales volume against baseline, accounting for seasonality and menu changes. Any emissions estimate would need a documented method and valid conversion factors.</p></li>
      </ol><p className="mt-5 text-sm text-muted-foreground">Measurement is a proposed future process; this page does not read waste logs or claim a completed impact study.</p></div>
    </section>
    <section aria-labelledby="viability-title" className="border-y border-border bg-secondary/15"><div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="text-sm font-semibold text-primary">03 / Subscription model</p><h2 id="viability-title" className="mt-3 text-3xl text-primary">Business Viability</h2>
      <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">AURA’s proposed model charges restaurants a recurring monthly subscription. Target customers range from small independent restaurants to teams seeking richer insights and restaurant groups. These are intended customer segments, not confirmed customers.</p>
      <div className="mt-8 grid gap-5 md:grid-cols-3">{tiers.map(tier => <article key={tier.name} aria-label={`${tier.name} subscription`} className="rounded-lg border border-border bg-background p-6"><h3 className="text-xl text-primary">{tier.name}</h3><p className="mt-4"><span className="font-display text-3xl font-bold text-primary">{usd(tier.monthly)}</span><span className="ml-2 text-sm text-muted-foreground">/month</span></p><p className="mt-4 text-sm leading-relaxed text-muted-foreground">{tier.target}</p><p className="mt-3 text-xs text-muted-foreground">Proposed offering · Feature availability varies</p></article>)}</div>
      <div className="mt-8 grid gap-6 border-t border-border pt-7 md:grid-cols-2"><div><h3 className="text-xl text-primary">Revenue assumptions</h3><p className="mt-3 text-sm leading-relaxed text-muted-foreground">The existing simulator models monthly revenue as subscription price × restaurant count, and annual revenue as monthly × 12. Simulated revenue is hypothetical—not actual company earnings, signed subscriptions or a profitability forecast. Costs, acquisition, retention and willingness to pay still require validation.</p></div><div><h3 className="text-xl text-primary">Potential growth opportunities</h3><p className="mt-3 text-sm leading-relaxed text-muted-foreground">Future growth could come from validated restaurant onboarding, retained subscriptions, broader reporting and support for restaurant groups. Multi-location expansion and richer integrations remain proposals, not demonstrated capabilities or guaranteed demand.</p></div></div>
      <Button asChild className="mt-7"><Link to="/pricing">Explore the revenue simulator<ArrowUpRight /></Link></Button>
    </div></section>
    <section aria-labelledby="roadmap-title" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"><p className="text-sm font-semibold text-primary">04 / Future proposals · Not implemented</p><h2 id="roadmap-title" className="mt-3 text-3xl text-primary">Version 2 Roadmap</h2><p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">Every item below is proposed future development, not a completed feature or a delivery commitment. Progress depends on real data, security review, testing and restaurant validation.</p>
      <ol className="mt-8 grid gap-6 md:grid-cols-3">{horizons.map((horizon, index) => <li key={horizon.title} className="border-t-2 border-primary pt-5"><p className="text-xs font-semibold text-muted-foreground">Horizon {index + 1} · Future proposal</p><h3 className="mt-3 text-xl text-primary">{horizon.title}</h3><p className="mt-2 text-sm font-medium">{horizon.subtitle}</p><ul className="mt-5 list-disc space-y-3 pl-5 text-sm leading-relaxed text-muted-foreground">{horizon.items.map(item => <li key={item}>{item}</li>)}</ul></li>)}</ol>
    </section>
  </>;
}