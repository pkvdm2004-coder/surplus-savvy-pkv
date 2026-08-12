import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Quote, Download, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/marketing")({
  component: Marketing,
  head: () => ({
    meta: [
      { title: "Marketing Resources — AURA Company" },
      { name: "description", content: "Case studies, marketing assets, and resources for restaurants and partners promoting food waste reduction with AURA." },
      { property: "og:title", content: "Marketing Resources — AURA Company" },
      { property: "og:description", content: "Case studies, marketing assets, and resources for restaurants and partners promoting food waste reduction with AURA." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const caseStudies = [
  {
    name: "Bistro Lumière",
    location: "Portland, OR",
    metric: "28%",
    metricLabel: "waste reduction",
    quote: "AURA showed us where our prep was consistently outrunning our sales. Within a month we had cut nightly waste by more than a quarter without running out of anything.",
  },
  {
    name: "Harbor Group",
    location: "Miami, FL",
    metric: "$47k",
    metricLabel: "annual savings",
    quote: "Across six locations, AURA unified how we forecast surplus. The recommendation cards became part of our daily manager briefing.",
  },
  {
    name: "Green Leaf Kitchen",
    location: "Austin, TX",
    metric: "12 tons",
    metricLabel: "food diverted",
    quote: "We already cared about sustainability. AURA gave us the data to prove our impact to guests and investors with real numbers.",
  },
];

const resources = [
  {
    title: "The Restaurant Waste Audit Template",
    description: "A practical workbook to identify where waste is hiding in your kitchen.",
    cta: "Download PDF",
  },
  {
    title: "AURA Partner Press Kit",
    description: "Logos, brand guidelines, and partner-ready copy for media and integrations.",
    cta: "View assets",
  },
  {
    title: "ROI Calculator",
    description: "Estimate your potential savings based on location size and average daily covers.",
    cta: "Calculate savings",
  },
];

function Marketing() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main>
        {/* Hero */}
        <section className="bg-aura-cream py-24">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold leading-tight text-aura-ink sm:text-5xl">
              Marketing that matters
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Turn waste reduction into a story guests, staff, and investors want to share. Explore case studies, partner assets, and practical tools.
            </p>
          </div>
        </section>

        {/* Case studies */}
        <section className="py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-center text-3xl font-bold sm:text-4xl">
              How restaurants win with AURA
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-muted-foreground">
              Real results from kitchens that stopped guessing and started forecasting.
            </p>
            <div className="mt-14 grid gap-8 lg:grid-cols-3">
              {caseStudies.map((study) => (
                <Card key={study.name} className="border-border bg-card/60">
                  <CardHeader>
                    <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-aura-sage/40">
                      <Quote className="h-5 w-5 text-aura-deep" />
                    </div>
                    <CardTitle className="font-display text-xl">{study.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{study.location}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{study.quote}</p>
                    <div className="mt-6 flex items-baseline gap-2 border-t border-border pt-4">
                      <span className="font-display text-3xl font-bold text-aura-deep">
                        {study.metric}
                      </span>
                      <span className="text-sm text-muted-foreground">{study.metricLabel}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Resources */}
        <section className="bg-aura-sage/20 py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-center text-3xl font-bold sm:text-4xl">
              Tools and resources
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-muted-foreground">
              Downloadable guides and partner assets to help you spread the word about waste reduction.
            </p>
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {resources.map((resource) => (
                <div
                  key={resource.title}
                  className="rounded-xl border border-border bg-background p-6"
                >
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-aura-sage/40">
                    <Download className="h-5 w-5 text-aura-deep" />
                  </div>
                  <h3 className="font-display text-xl font-bold">{resource.title}</h3>
                  <p className="mt-2 text-muted-foreground">{resource.description}</p>
                  <Button asChild variant="link" className="mt-4 p-0">
                    <Link to="/">
                      {resource.cta}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold sm:text-4xl">
              Want to partner with AURA?
            </h2>
            <p className="mt-6 text-lg text-muted-foreground">
              We work with restaurant groups, sustainability consultants, and technology platforms to bring waste intelligence to more kitchens.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Button asChild size="lg">
                <Link to="/pricing">Become a partner</Link>
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
