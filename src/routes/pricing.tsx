import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import { Check } from "lucide-react";

export const Route = createFileRoute("/pricing")({
  component: Pricing,
  head: () => ({
    meta: [
      { title: "Pricing — AURA Company" },
      { name: "description", content: "Flexible pricing for independent restaurants and multi-location groups ready to reduce food waste with AURA." },
      { property: "og:title", content: "Pricing — AURA Company" },
      { property: "og:description", content: "Flexible pricing for independent restaurants and multi-location groups ready to reduce food waste with AURA." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const plans = [
  {
    name: "Starter",
    price: "$99",
    period: "/location /month",
    description: "For independent restaurants ready to stop guessing about surplus.",
    features: [
      "Daily surplus forecast",
      "Up to 3 locations",
      "Email pre-service briefings",
      "Weekly waste summary",
      "Email support",
    ],
    cta: "Start with Starter",
    highlighted: false,
  },
  {
    name: "Professional",
    price: "$249",
    period: "/location /month",
    description: "For growing groups that want deeper insights and more control.",
    features: [
      "Everything in Starter",
      "Up to 15 locations",
      "Menu-item level recommendations",
      "Repurpose engine for specials",
      "Sustainability reporting",
      "Priority chat support",
    ],
    cta: "Choose Professional",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For multi-brand operators and chains with complex supply chains.",
    features: [
      "Everything in Professional",
      "Unlimited locations",
      "API access and integrations",
      "Dedicated success manager",
      "Custom forecasting models",
      "Procurement and waste forecasting",
      "SSO and advanced security",
    ],
    cta: "Contact sales",
    highlighted: false,
  },
];

function Pricing() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main>
        {/* Hero */}
        <section className="bg-aura-cream py-24">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold leading-tight text-aura-ink sm:text-5xl">
              Pricing that pays for itself
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Most AURA customers recover the full cost of their subscription within the first month by reducing waste and protecting margins.
            </p>
          </div>
        </section>

        {/* Pricing cards */}
        <section className="py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-3">
              {plans.map((plan) => (
                <Card
                  key={plan.name}
                  className={`flex flex-col ${
                    plan.highlighted
                      ? "border-2 border-aura-moss bg-aura-deep text-primary-foreground shadow-xl"
                      : "border-border bg-card/60"
                  }`}
                >
                  <CardHeader>
                    <span
                      className={`text-sm font-semibold uppercase tracking-wider ${
                        plan.highlighted ? "text-aura-sage" : "text-aura-moss"
                      }`}
                    >
                      {plan.name}
                    </span>
                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="font-display text-4xl font-bold">{plan.price}</span>
                      <span className={plan.highlighted ? "text-aura-sage" : "text-muted-foreground"}>
                        {plan.period}
                      </span>
                    </div>
                    <p className={plan.highlighted ? "text-aura-sage" : "text-muted-foreground"}>
                      {plan.description}
                    </p>
                  </CardHeader>
                  <CardContent className="flex flex-1 flex-col">
                    <ul className="flex-1 space-y-3">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3">
                          <Check
                            className={`mt-0.5 h-5 w-5 shrink-0 ${
                              plan.highlighted ? "text-aura-sage" : "text-aura-moss"
                            }`}
                          />
                          <span className={plan.highlighted ? "text-primary-foreground" : "text-muted-foreground"}>
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      asChild
                      className="mt-8 w-full"
                      variant={plan.highlighted ? "default" : "outline"}
                      size="lg"
                    >
                      <Link to="/">{plan.cta}</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ / value prop */}
        <section className="bg-aura-sage/20 py-24">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-center text-3xl font-bold sm:text-4xl">
              Why AURA is a safe investment
            </h2>
            <div className="mt-12 grid gap-8 sm:grid-cols-2">
              <div className="rounded-xl bg-background p-6">
                <h3 className="font-display text-xl font-bold">Quick setup</h3>
                <p className="mt-2 text-muted-foreground">
                  Connect your existing POS and spreadsheets in under an hour. No hardware required.
                </p>
              </div>
              <div className="rounded-xl bg-background p-6">
                <h3 className="font-display text-xl font-bold">Fast ROI</h3>
                <p className="mt-2 text-muted-foreground">
                  Reducing waste by even a small percentage typically covers the subscription cost.
                </p>
              </div>
              <div className="rounded-xl bg-background p-6">
                <h3 className="font-display text-xl font-bold">Kitchen-first design</h3>
                <p className="mt-2 text-muted-foreground">
                  Recommendations are written for chefs and managers, not data analysts.
                </p>
              </div>
              <div className="rounded-xl bg-background p-6">
                <h3 className="font-display text-xl font-bold">Cancel anytime</h3>
                <p className="mt-2 text-muted-foreground">
                  No long-term contracts. Keep the value you create or walk away with what you learned.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
