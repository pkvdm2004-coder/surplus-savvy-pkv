import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { Upload, BrainCircuit, ChefHat, LineChart, Bell, Recycle } from "lucide-react";

export const Route = createFileRoute("/how-it-works")({
  component: HowItWorks,
  head: () => ({
    meta: [
      { title: "How AURA Works — Restaurant Food Waste Intelligence" },
      { name: "description", content: "Learn how AURA estimates restaurant food surplus and turns data into actionable waste-reduction recommendations." },
      { property: "og:title", content: "How AURA Works — Restaurant Food Waste Intelligence" },
      { property: "og:description", content: "Learn how AURA estimates restaurant food surplus and turns data into actionable waste-reduction recommendations." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const steps = [
  {
    number: "01",
    icon: Upload,
    title: "Connect your data",
    description: "AURA ingests POS sales, prep sheets, reservation counts, weather, and local events. Setup takes under an hour and works with the tools you already use.",
  },
  {
    number: "02",
    icon: BrainCircuit,
    title: "Estimate surplus",
    description: "Our model learns the patterns behind every unsold item. It predicts surplus by dish, ingredient, and time window so you know where to focus before service begins.",
  },
  {
    number: "03",
    icon: ChefHat,
    title: "Receive recommendations",
    description: "AURA suggests the most effective actions: reduce a batch size, run a chef's special, repurpose an ingredient, or adjust the par level for tomorrow.",
  },
  {
    number: "04",
    icon: LineChart,
    title: "Track impact",
    description: "Waste cost, avoided loss, and environmental metrics are tracked automatically. Share weekly reports with leadership and sustainability teams.",
  },
];

const features = [
  {
    icon: Bell,
    title: "Pre-service alerts",
    description: "Morning briefings flag high-risk items so the kitchen can act before the rush.",
  },
  {
    icon: Recycle,
    title: "Repurpose engine",
    description: "Turn predicted surplus into daily specials, staff meals, or donation-ready portions.",
  },
];

function HowItWorks() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main>
        {/* Hero */}
        <section className="bg-aura-cream py-24">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold leading-tight text-aura-ink sm:text-5xl">
              How AURA reduces waste
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              AURA turns the data your kitchen already produces into a daily plan for less waste and better margins.
            </p>
          </div>
        </section>

        {/* Steps */}
        <section className="py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 hidden w-px bg-border lg:block" />
              <div className="space-y-16">
                {steps.map((step) => (
                  <div key={step.number} className="relative lg:pl-24">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-aura-deep text-primary-foreground lg:absolute lg:left-0 lg:top-0">
                      <step.icon className="h-7 w-7" />
                    </div>
                    <div>
                      <span className="text-sm font-semibold uppercase tracking-wider text-aura-moss">
                        Step {step.number}
                      </span>
                      <h2 className="mt-2 font-display text-2xl font-bold text-aura-ink">
                        {step.title}
                      </h2>
                      <p className="mt-3 max-w-2xl text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Additional features */}
        <section className="bg-aura-sage/20 py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold sm:text-4xl">
                Intelligence that fits your workflow
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                AURA is designed to be useful during the busiest shifts, not just in Monday morning reports.
              </p>
            </div>
            <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-2">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-xl border border-border bg-background p-8"
                >
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-aura-sage/40">
                    <feature.icon className="h-6 w-6 text-aura-deep" />
                  </div>
                  <h3 className="font-display text-xl font-bold">{feature.title}</h3>
                  <p className="mt-3 text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold sm:text-4xl">
              See AURA in your kitchen
            </h2>
            <p className="mt-6 text-lg text-muted-foreground">
              Our team will map your current workflow and show how AURA can reduce waste within the first month.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Button asChild size="lg">
                <Link to="/pricing">View pricing</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/">Back to home</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
