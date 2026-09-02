import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { listExternalRows } from "@/lib/external-data.functions";
import { Loader2, AlertCircle, Package, CalendarDays, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/predictions")({
  component: Predictions,
  head: () => ({
    meta: [
      { title: "Predictions — Surplus Forecast | AURA Company" },
      { name: "description", content: "AURA estimates potential food surplus and waste risk from your inventory so you can act before food expires." },
      { property: "og:title", content: "Predictions — Surplus Forecast | AURA Company" },
      { property: "og:description", content: "AURA estimates potential food surplus and waste risk from your inventory so you can act before food expires." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

type InventoryRow = {
  id: number | string;
  product_name: string;
  quantity: number;
  unit: string;
  daily_sales: number;
  expiration_date: string;
  category: string;
};

type Prediction = {
  id: number | string;
  product_name: string;
  quantity: number;
  unit: string;
  daily_sales: number;
  expiration_date: string;
  days_until_expiration: number;
  potential_surplus: number;
  risk_level: "Low" | "Medium" | "High";
};

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function calculatePredictions(rows: InventoryRow[]): Prediction[] {
  const today = startOfDay(new Date());

  return rows
    .map((row) => {
      const expiration = startOfDay(new Date(row.expiration_date));
      const diffMs = expiration.getTime() - today.getTime();
      const days_until_expiration = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));

      const rawSurplus = Number(row.quantity) - Number(row.daily_sales) * days_until_expiration;
      const potential_surplus = Math.min(Number(row.quantity), Math.max(0, rawSurplus));

      let risk_level: Prediction["risk_level"] = "Low";
      if (potential_surplus > 0) {
        const threshold = Number(row.quantity) * 0.5;
        risk_level = potential_surplus >= threshold ? "High" : "Medium";
      }

      return {
        id: row.id,
        product_name: row.product_name,
        quantity: Number(row.quantity),
        unit: row.unit,
        daily_sales: Number(row.daily_sales),
        expiration_date: row.expiration_date,
        days_until_expiration,
        potential_surplus,
        risk_level,
      };
    })
    .sort((a, b) => b.potential_surplus - a.potential_surplus);
}

function riskBadgeClasses(risk: Prediction["risk_level"]) {
  switch (risk) {
    case "High":
      return "bg-destructive/15 text-destructive border-destructive/30";
    case "Medium":
      return "bg-aura-sage/40 text-aura-deep border-aura-moss/40";
    case "Low":
    default:
      return "bg-muted/60 text-muted-foreground border-border";
  }
}

function formatDate(value: string) {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? value : d.toLocaleDateString();
}

function Predictions() {
  const [rows, setRows] = useState<InventoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { rows: data, error: listError } = await listExternalRows({
      data: { table: "inventory", limit: 100 },
    });
    if (listError) {
      setError(listError);
    } else {
      setError(null);
      setRows((data as unknown as InventoryRow[]) ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const predictions = useMemo(() => calculatePredictions(rows), [rows]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main>
        <section className="bg-aura-cream py-24">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold leading-tight text-aura-ink sm:text-5xl">
              Surplus predictions
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              AURA looks at what you have in stock, how fast it sells, and when it expires — then
              flags what is likely to become surplus before it goes to waste.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-xl border border-border bg-card/40 p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-aura-sage/40">
                  <TrendingUp className="h-5 w-5 text-aura-deep" />
                </div>
                <div>
                  <h2 className="font-display text-2xl font-bold">Forecasted surplus</h2>
                  <p className="text-sm text-muted-foreground">
                    Potential surplus = quantity − (daily sales × days until expiration)
                  </p>
                </div>
              </div>

              {loading ? (
                <div className="mt-8 flex items-center gap-3 text-muted-foreground">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Loading inventory…</span>
                </div>
              ) : error ? (
                <div className="mt-6 flex items-start gap-3 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                  <p>
                    <span className="font-semibold">Could not load predictions.</span> {error}
                  </p>
                </div>
              ) : predictions.length === 0 ? (
                <div className="mt-8 rounded-lg border border-dashed border-border bg-background/50 p-8 text-center">
                  <Package className="mx-auto h-8 w-8 text-muted-foreground" />
                  <p className="mt-4 font-medium text-aura-ink">No inventory items yet</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Add items on the Inventory page to see surplus predictions here.
                  </p>
                </div>
              ) : (
                <div className="mt-8 overflow-hidden rounded-lg border border-border">
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="px-4 py-3 font-semibold text-aura-ink">Product</th>
                          <th className="px-4 py-3 font-semibold text-aura-ink">Quantity</th>
                          <th className="px-4 py-3 font-semibold text-aura-ink">Daily sales</th>
                          <th className="px-4 py-3 font-semibold text-aura-ink">Days left</th>
                          <th className="px-4 py-3 font-semibold text-aura-ink">Potential surplus</th>
                          <th className="px-4 py-3 font-semibold text-aura-ink">Risk</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {predictions.map((p) => (
                          <tr key={String(p.id)}>
                            <td className="px-4 py-3 font-medium text-aura-ink">
                              {p.product_name}
                            </td>
                            <td className="px-4 py-3 text-muted-foreground">
                              {p.quantity} {p.unit}
                            </td>
                            <td className="px-4 py-3 text-muted-foreground">
                              {p.daily_sales} {p.unit}/day
                            </td>
                            <td className="px-4 py-3 text-muted-foreground">
                              <span className="inline-flex items-center gap-1.5">
                                <CalendarDays className="h-4 w-4" />
                                {p.days_until_expiration}
                              </span>
                            </td>
                            <td className="px-4 py-3 font-medium text-aura-ink">
                              {p.potential_surplus.toFixed(1)} {p.unit}
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${riskBadgeClasses(
                                  p.risk_level,
                                )}`}
                              >
                                {p.risk_level}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {!loading && !error && predictions.length > 0 && (
                <p className="mt-4 text-xs text-muted-foreground">
                  Based on inventory records as of {formatDate(new Date().toISOString())}. Risk levels
                  are estimates to help prioritise action.
                </p>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
