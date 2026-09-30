import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Check, Minus } from "lucide-react";
import { tiers, calcRevenue, clampCustomers, usd, MIN_CUSTOMERS, MAX_CUSTOMERS, type Tier } from "@/lib/plans";

export const Route = createFileRoute("/pricing")({
  component: Pricing,
  head: () => ({
    meta: [
      { title: "Pricing & Revenue Simulator — AURA Company" },
      { name: "description", content: "AURA plans from $99/month plus an interactive simulator to estimate monthly and annual recurring revenue." },
      { property: "og:title", content: "Pricing & Revenue Simulator — AURA Company" },
      { property: "og:description", content: "AURA plans from $99/month plus an interactive simulator to estimate monthly and annual recurring revenue." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const comparison: { feature: string; plans: [string | boolean, string | boolean, string | boolean] }[] = [
  { feature: "Locations", plans: ["1", "Up to 5", "Multi-location"] },
  { feature: "Inventory management", plans: [true, true, true] },
  { feature: "Food waste tracking", plans: [true, true, true] },
  { feature: "Dashboard & reporting", plans: ["Basic", "Advanced", "Custom"] },
  { feature: "Predictions and forecasting", plans: [false, true, "Advanced"] },
  { feature: "Research & benchmarking", plans: [false, true, true] },
  { feature: "Risk and opportunity insights", plans: [false, true, true] },
  { feature: "Custom integrations", plans: [false, false, true] },
  { feature: "Support", plans: ["Email", "Priority", "Dedicated manager"] },
];

function Cell({ v }: { v: string | boolean }) {
  if (v === true) return <Check className="mx-auto h-5 w-5 text-aura-moss" aria-label="Included" />;
  if (v === false) return <Minus className="mx-auto h-5 w-5 text-muted-foreground/50" aria-label="Not included" />;
  return <span>{v}</span>;
}

function Pricing() {
  const [plan, setPlan] = useState<Tier["name"]>("Professional");
  const [input, setInput] = useState("25");
  const selected = (tiers.find((t) => t.name === plan) ?? tiers[1]) as Tier;
  const customers = clampCustomers(Number(input));
  const { mrr, arr } = calcRevenue(selected.monthly, customers);

  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      <Navbar />
      <main>
        <section className="bg-aura-cream py-20 sm:py-24">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight text-aura-ink sm:text-5xl">Simple pricing that grows with you</h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Choose the plan that fits your restaurant, then use the simulator to see the recurring revenue behind each tier.
            </p>
          </div>
        </section>

        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-3">
              {tiers.map((t) => (
                <Card
                  key={t.name}
                  className={`relative flex flex-col ${t.popular ? "border-2 border-aura-moss bg-aura-deep text-primary-foreground shadow-xl" : "border-border bg-card/60"}`}
                >
                  {t.popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-aura-sage px-3 py-1 text-xs font-semibold uppercase tracking-wider text-aura-deep">
                      Most Popular
                    </span>
                  )}
                  <CardHeader>
                    <span className={`text-sm font-semibold uppercase tracking-wider ${t.popular ? "text-aura-sage" : "text-aura-moss"}`}>{t.name}</span>
                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="font-display text-4xl font-bold">{t.price}</span>
                      <span className={t.popular ? "text-aura-sage" : "text-muted-foreground"}>/month</span>
                    </div>
                    <p className={t.popular ? "text-aura-sage" : "text-muted-foreground"}>{t.target}</p>
                  </CardHeader>
                  <CardContent className="flex flex-1 flex-col">
                    <ul className="flex-1 space-y-3">
                      {t.features.map((f) => (
                        <li key={f} className="flex items-start gap-3">
                          <Check className={`mt-0.5 h-5 w-5 shrink-0 ${t.popular ? "text-aura-sage" : "text-aura-moss"}`} />
                          <span className={t.popular ? "text-primary-foreground" : "text-muted-foreground"}>{f}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      className="mt-8 w-full"
                      variant={t.popular ? "secondary" : "outline"}
                      size="lg"
                      onClick={() => {
                        setPlan(t.name);
                        document.getElementById("simulator")?.scrollIntoView({ behavior: "smooth" });
                      }}
                    >
                      Simulate {t.name}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="simulator" className="bg-aura-sage/20 py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-center text-3xl font-bold sm:text-4xl">Revenue simulator</h2>
            <p className="mt-4 text-center text-muted-foreground">Monthly revenue = customers × plan price. Annual revenue = monthly revenue × 12.</p>

            <div className="mt-10 grid gap-6 rounded-2xl bg-background p-6 shadow-sm sm:p-8 md:grid-cols-2">
              <div className="space-y-6">
                <div>
                  <span className="text-sm font-semibold">Selected plan</span>
                  <div className="mt-2 grid grid-cols-3 gap-2" role="radiogroup" aria-label="Plan">
                    {tiers.map((t) => (
                      <button
                        key={t.name}
                        role="radio"
                        aria-checked={plan === t.name}
                        onClick={() => setPlan(t.name)}
                        className={`rounded-lg border px-2 py-2 text-sm font-medium transition-colors ${plan === t.name ? "border-aura-deep bg-aura-deep text-primary-foreground" : "border-border hover:border-aura-moss"}`}
                      >
                        {t.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="customers" className="text-sm font-semibold">Number of customers / restaurants</label>
                  <input
                    id="customers"
                    type="number"
                    inputMode="numeric"
                    min={MIN_CUSTOMERS}
                    max={MAX_CUSTOMERS}
                    value={input}
                    onChange={(e) => setInput(e.target.value.replace(/[^0-9]/g, "").slice(0, 3))}
                    onBlur={() => setInput(String(customers))}
                    className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-lg"
                  />
                  <input
                    type="range"
                    aria-label="Customers slider"
                    min={MIN_CUSTOMERS}
                    max={MAX_CUSTOMERS}
                    value={customers}
                    onChange={(e) => setInput(e.target.value)}
                    className="mt-3 w-full accent-[var(--color-aura-moss)]"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">Between {MIN_CUSTOMERS} and {MAX_CUSTOMERS}.</p>
                </div>

                <div className="flex items-center justify-between rounded-lg border border-border p-4">
                  <span className="text-sm text-muted-foreground">Monthly plan price</span>
                  <span className="font-display text-xl font-bold">{usd(selected.monthly)}</span>
                </div>
              </div>

              <div className="flex flex-col justify-center gap-4">
                <div className="rounded-xl bg-aura-cream p-6">
                  <span className="text-sm font-semibold uppercase tracking-wider text-aura-moss">Monthly revenue (MRR)</span>
                  <p data-testid="mrr" className="mt-2 break-words font-display text-4xl font-bold text-aura-ink">{usd(mrr)}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{customers} × {usd(selected.monthly)}</p>
                </div>
                <div className="rounded-xl bg-aura-deep p-6 text-primary-foreground">
                  <span className="text-sm font-semibold uppercase tracking-wider text-aura-sage">Annual revenue (ARR)</span>
                  <p data-testid="arr" className="mt-2 break-words font-display text-4xl font-bold">{usd(arr)}</p>
                  <p className="mt-1 text-sm text-aura-sage">{usd(mrr)} × 12</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-center text-3xl font-bold sm:text-4xl">Compare plans</h2>
            <div className="mt-10 overflow-x-auto rounded-xl border border-border">
              <table className="w-full min-w-[560px] text-sm">
                <thead className="bg-aura-cream">
                  <tr>
                    <th className="p-4 text-left font-semibold">Feature</th>
                    {tiers.map((t) => (
                      <th key={t.name} className={`p-4 text-center font-semibold ${t.popular ? "text-aura-moss" : ""}`}>{t.name}<div className="text-xs font-normal text-muted-foreground">{t.price}/mo</div></th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparison.map((row) => (
                    <tr key={row.feature} className="border-t border-border">
                      <td className="p-4">{row.feature}</td>
                      {row.plans.map((v, i) => (
                        <td key={i} className="p-4 text-center text-muted-foreground"><Cell v={v} /></td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-10 text-center">
              <Button asChild size="lg"><Link to="/product">Explore the product</Link></Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
