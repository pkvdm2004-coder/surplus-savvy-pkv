import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import { TrendingDown, Utensils, Leaf, BarChart3, ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-kitchen.jpg";
import dashboardImage from "@/assets/aura-dashboard.jpg";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "AURA Company — Reduce Restaurant Food Waste" },
      { name: "description", content: "AURA helps restaurants estimate food surplus and cut waste with clear, data-driven recommendations." },
      { property: "og:title", content: "AURA Company — Reduce Restaurant Food Waste" },
      { property: "og:description", content: "AURA helps restaurants estimate food surplus and cut waste with clear, data-driven recommendations." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const features = [
  {
    icon: BarChart3,
    title: "Surplus estimation",
    description: "Turn daily sales, prep plans, and weather into a clear forecast of what will go unsold.",
  },
  {
    icon: Utensils,
    title: "Actionable recommendations",
    description: "Get menu-specific suggestions: adjust portion sizes, repurpose ingredients, or run a special.",
  },
  {
    icon: TrendingDown,
    title: "Margin protection",
    description: "Track waste cost, lost revenue, and improvement over time so every decision shows on the bottom line.",
  },
  {
    icon: Leaf,
    title: "Sustainability reporting",
    description: "Share measurable waste reduction with guests, investors, and sustainability teams.",
  },
];

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-aura-cream">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-28">
            <div className="max-w-2xl">
              <span className="inline-block rounded-full bg-aura-sage/40 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-aura-deep">
                Food waste intelligence
              </span>
              <h1 className="mt-6 text-4xl font-bold leading-tight text-aura-ink sm:text-5xl lg:text-6xl">
                Stop guessing. Start reducing food waste.
              </h1>
              <p className="mt-6 text-lg text-muted-foreground">
                Restaurants throw away up to 10% of the food they purchase. AURA estimates your surplus before service ends and gives you recommendations to protect your margins and your kitchen's craft.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button asChild size="lg">
                  <Link to="/pricing">
                    Get started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/how-it-works">See how it works</Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <img
                src={heroImage}
                alt="A chef in a warm kitchen preparing fresh seasonal ingredients"
                width={1344}
                height={896}
                className="rounded-2xl object-cover shadow-xl"
              />
              <div className="absolute -bottom-6 -left-6 hidden rounded-xl bg-background p-4 shadow-lg md:block">
                <p className="font-display text-3xl font-bold text-aura-deep">30%</p>
                <p className="text-sm text-muted-foreground">average waste reduction</p>
              </div>
            </div>
          </div>
        </section>

        {/* Problem statement */}
        <section className="bg-aura-deep py-20 text-primary-foreground">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold sm:text-4xl">
              The cost of over-preparation is steep
            </h2>
            <p className="mt-6 text-lg text-aura-sage">
              Every unsold dish represents wasted ingredients, labor, and energy. Most kitchens react after service ends. AURA helps you act before the waste happens.
            </p>
            <div className="mt-12 grid gap-8 sm:grid-cols-3">
              <div>
                <p className="font-display text-4xl font-bold">10%</p>
                <p className="mt-2 text-sm text-aura-sage">of purchased food is typically wasted</p>
              </div>
              <div>
                <p className="font-display text-4xl font-bold">$2B</p>
                <p className="mt-2 text-sm text-aura-sage">annual industry surplus value lost</p>
              </div>
              <div>
                <p className="font-display text-4xl font-bold">40%</p>
                <p className="mt-2 text-sm text-aura-sage">of food waste happens in service businesses</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features grid */}
        <section className="py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold sm:text-4xl">
                A clear plan for every shift
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                AURA combines your data with kitchen-specific intelligence to estimate surplus and recommend the next best action.
              </p>
            </div>
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <Card key={feature.title} className="border-border bg-card/60">
                  <CardHeader>
                    <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-aura-sage/40">
                      <feature.icon className="h-5 w-5 text-aura-deep" />
                    </div>
                    <CardTitle className="font-display text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Solution preview */}
        <section className="overflow-hidden bg-aura-sage/20 py-24">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
            <div className="order-2 lg:order-1">
              <img
                src={dashboardImage}
                alt="AURA dashboard showing food waste analytics on a tablet in a kitchen"
                width={1344}
                height={896}
                loading="lazy"
                className="rounded-2xl object-cover shadow-xl"
              />
            </div>
            <div className="order-1 max-w-xl lg:order-2">
              <h2 className="text-3xl font-bold sm:text-4xl">
                Built for the pace of a restaurant
              </h2>
              <p className="mt-6 text-lg text-muted-foreground">
                AURA's dashboard is designed to be checked in seconds during a busy pre-service window. Forecasts, recommendations, and one-tap actions keep your team focused on guests, not spreadsheets.
              </p>
              <ul className="mt-8 space-y-4">
                {[
                  "Daily surplus forecast by menu item",
                  "One-tap recommendation cards",
                  "Waste cost tracking by category",
                  "Weekly trend reports for leadership",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-1.5 inline-block h-2 w-2 rounded-full bg-aura-moss" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Button asChild variant="outline" size="lg">
                  <Link to="/how-it-works">Explore the workflow</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold sm:text-4xl">
              Ready to waste less and serve more?
            </h2>
            <p className="mt-6 text-lg text-muted-foreground">
              Join the restaurants using AURA to turn surplus data into smarter prep, better margins, and a lighter environmental footprint.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Button asChild size="lg">
                <Link to="/pricing">View pricing</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/marketing">See marketing resources</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
