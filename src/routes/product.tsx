import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { tiers } from "@/lib/plans";
import { BarChart3, Boxes, Check, Leaf, LineChart, Search } from "lucide-react";

export const Route = createFileRoute("/product")({
  component: Product,
  head: () => ({
    meta: [
      { title: "Product — AURA Food Waste Platform" },
      { name: "description", content: "Explore AURA's product tiers and modules: inventory, predictions, research and analytics to reduce restaurant food waste." },
      { property: "og:title", content: "Product — AURA Food Waste Platform" },
      { property: "og:description", content: "Explore AURA's product tiers and modules: inventory, predictions, research and analytics to reduce restaurant food waste." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const modules = [
  { icon: Boxes, title: "Inventory", text: "Track and manage your ingredients to minimize waste.", to: "/inventory" as const },
  { icon: LineChart, title: "Predictions", text: "Use AI to predict demand and prevent overproduction.", to: "/predictions" as const },
  { icon: Search, title: "Research", text: "Benchmark with industry insights and competitor data.", to: "/research" as const },
  { icon: BarChart3, title: "Analytics", text: "Turn data into action with clear, visual reports.", to: null },
];

function Product() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      <Navbar />
      <main>
        <section className="bg-aura-cream py-20 sm:py-24">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight text-aura-ink sm:text-5xl">
              Everything you need to reduce food waste intelligently.
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              AURA helps restaurants manage inventory, predict waste, benchmark with industry insights, and make data-driven decisions — all in one powerful platform.
            </p>
          </div>
        </section>

        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-center text-3xl font-bold sm:text-4xl">Product tiers</h2>
            <div className="mt-12 grid gap-8 lg:grid-cols-3">
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
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-aura-sage/20 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-center text-3xl font-bold sm:text-4xl">Product modules</h2>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {modules.map((m) => {
                const inner = (
                  <div className="h-full rounded-xl bg-background p-6 transition-shadow hover:shadow-md">
                    <m.icon className="h-8 w-8 text-aura-moss" />
                    <h3 className="mt-4 font-display text-xl font-bold">{m.title}</h3>
                    <p className="mt-2 text-muted-foreground">{m.text}</p>
                  </div>
                );
                return m.to ? (
                  <Link key={m.title} to={m.to}>{inner}</Link>
                ) : (
                  <div key={m.title}>{inner}</div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <Leaf className="mx-auto h-10 w-10 text-aura-moss" />
            <h2 className="mt-4 text-3xl font-bold sm:text-4xl">Less waste. Better margins. Smarter kitchens.</h2>
            <p className="mt-6 text-lg text-muted-foreground">
              AURA helps restaurants reduce food waste, improve profitability, and make better operational decisions — turning everyday kitchen data into a more sustainable business.
            </p>
            <Button asChild size="lg" className="mt-8">
              <Link to="/inventory">Start with your inventory</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
