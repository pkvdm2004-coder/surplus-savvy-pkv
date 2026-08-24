import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { z } from "zod";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { listExternalRows, insertExternalRow } from "@/lib/external-data.functions";
import { toast } from "sonner";
import { Package, Loader2, CheckCircle2, AlertCircle, CalendarDays } from "lucide-react";

export const Route = createFileRoute("/inventory")({
  component: Inventory,
  head: () => ({
    meta: [
      { title: "Inventory — Track Food Stock | AURA Company" },
      { name: "description", content: "Add and track your restaurant's food inventory. AURA uses quantities, daily sales, and expiration dates to estimate surplus and cut waste." },
      { property: "og:title", content: "Inventory — Track Food Stock | AURA Company" },
      { property: "og:description", content: "Add and track your restaurant's food inventory. AURA uses quantities, daily sales, and expiration dates to estimate surplus and cut waste." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

// Column names match the existing external `inventory` table exactly.
const UNITS = ["kg", "g", "L", "ml", "units", "packs", "boxes", "trays"] as const;
const CATEGORIES = [
  "Produce",
  "Dairy",
  "Meat & Poultry",
  "Seafood",
  "Bakery",
  "Dry Goods",
  "Frozen",
  "Beverages",
  "Prepared",
  "Other",
] as const;

const inventorySchema = z.object({
  product_name: z
    .string()
    .trim()
    .min(1, "Product name is required")
    .max(120, "Product name must be under 120 characters"),
  quantity: z
    .string()
    .min(1, "Quantity is required")
    .refine((v) => !Number.isNaN(Number(v)) && Number(v) > 0, "Quantity must be a number greater than 0"),
  unit: z.string().min(1, "Unit is required"),
  daily_sales: z
    .string()
    .min(1, "Daily sales is required")
    .refine((v) => !Number.isNaN(Number(v)) && Number(v) >= 0, "Daily sales must be 0 or greater"),
  expiration_date: z
    .string()
    .min(1, "Expiration date is required")
    .refine((v) => !Number.isNaN(Date.parse(v)), "Enter a valid date"),
  category: z.string().min(1, "Category is required"),
});

type FormValues = z.infer<typeof inventorySchema>;
type FormErrors = Partial<Record<keyof FormValues, string>>;

type InventoryRow = {
  id: number | string;
  product_name: string;
  quantity: number;
  unit: string;
  daily_sales: number;
  expiration_date: string;
  category: string;
};

const emptyForm: FormValues = {
  product_name: "",
  quantity: "",
  unit: "",
  daily_sales: "",
  expiration_date: "",
  category: "",
};

function formatDate(value: string) {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? value : d.toLocaleDateString();
}

function Inventory() {
  const [form, setForm] = useState<FormValues>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const [rows, setRows] = useState<InventoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { rows: data, error } = await listExternalRows({
      data: { table: "inventory", limit: 100 },
    });
    if (error) {
      setListError(error);
    } else {
      setListError(null);
      const items = (data as unknown as InventoryRow[]).slice();
      items.sort((a, b) => Number(b.id) - Number(a.id));
      setRows(items);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const setField = (field: keyof FormValues, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(null);

    const parsed = inventorySchema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: FormErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof FormValues;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setSubmitting(true);

    const { error } = await insertExternalRow({
      data: {
        table: "inventory",
        row: {
          product_name: parsed.data.product_name,
          quantity: Number(parsed.data.quantity),
          unit: parsed.data.unit,
          daily_sales: Number(parsed.data.daily_sales),
          expiration_date: parsed.data.expiration_date,
          category: parsed.data.category,
        },
      },
    });

    setSubmitting(false);

    if (error) {
      setSubmitError(error);
      toast.error("Could not save inventory item");
      return;
    }

    setSubmitSuccess(`"${parsed.data.product_name}" was saved to your inventory.`);
    toast.success("Inventory item saved");
    setForm(emptyForm);
    await load();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main>
        <section className="bg-aura-cream py-24">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold leading-tight text-aura-ink sm:text-5xl">Inventory</h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Log what is in your kitchen — quantities, daily sales, and expiration dates — so AURA
              can estimate surplus before it becomes waste.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            {/* Add item form */}
            <div className="rounded-xl border border-border bg-card/40 p-6 sm:p-8">
              <h2 className="font-display text-2xl font-bold">Add inventory item</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                All fields are required. The item is saved straight to your connected database.
              </p>

              {submitSuccess && (
                <div className="mt-6 flex items-start gap-3 rounded-lg border border-aura-moss/50 bg-aura-sage/20 p-4 text-sm text-aura-deep">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
                  <p>{submitSuccess}</p>
                </div>
              )}
              {submitError && (
                <div className="mt-6 flex items-start gap-3 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                  <p>
                    <span className="font-semibold">Save failed.</span> {submitError}
                  </p>
                </div>
              )}

              <form onSubmit={(e) => void onSubmit(e)} className="mt-6 grid gap-6 sm:grid-cols-2" noValidate>
                <div className="sm:col-span-2">
                  <Label htmlFor="product_name">Product name</Label>
                  <Input
                    id="product_name"
                    value={form.product_name}
                    onChange={(e) => setField("product_name", e.target.value)}
                    placeholder="e.g. Roma tomatoes"
                    maxLength={120}
                    className="mt-2"
                  />
                  {errors.product_name && (
                    <p className="mt-1 text-sm text-destructive">{errors.product_name}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="0"
                    step="any"
                    value={form.quantity}
                    onChange={(e) => setField("quantity", e.target.value)}
                    placeholder="e.g. 12"
                    className="mt-2"
                  />
                  {errors.quantity && (
                    <p className="mt-1 text-sm text-destructive">{errors.quantity}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="unit">Unit</Label>
                  <Select value={form.unit} onValueChange={(v) => setField("unit", v)}>
                    <SelectTrigger id="unit" className="mt-2 w-full">
                      <SelectValue placeholder="Select a unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {UNITS.map((u) => (
                        <SelectItem key={u} value={u}>
                          {u}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.unit && <p className="mt-1 text-sm text-destructive">{errors.unit}</p>}
                </div>

                <div>
                  <Label htmlFor="daily_sales">Daily sales</Label>
                  <Input
                    id="daily_sales"
                    type="number"
                    min="0"
                    step="any"
                    value={form.daily_sales}
                    onChange={(e) => setField("daily_sales", e.target.value)}
                    placeholder="e.g. 4"
                    className="mt-2"
                  />
                  {errors.daily_sales && (
                    <p className="mt-1 text-sm text-destructive">{errors.daily_sales}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="expiration_date">Expiration date</Label>
                  <Input
                    id="expiration_date"
                    type="date"
                    value={form.expiration_date}
                    onChange={(e) => setField("expiration_date", e.target.value)}
                    className="mt-2"
                  />
                  {errors.expiration_date && (
                    <p className="mt-1 text-sm text-destructive">{errors.expiration_date}</p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={form.category} onValueChange={(v) => setField("category", v)}>
                    <SelectTrigger id="category" className="mt-2 w-full">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className="mt-1 text-sm text-destructive">{errors.category}</p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <Button type="submit" disabled={submitting} className="w-full sm:w-auto">
                    {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {submitting ? "Saving…" : "Save to inventory"}
                  </Button>
                </div>
              </form>
            </div>

            {/* Inventory list */}
            <div className="mt-12">
              <h2 className="font-display text-2xl font-bold">Current inventory</h2>
              {loading ? (
                <p className="mt-4 text-muted-foreground">Loading…</p>
              ) : listError ? (
                <div className="mt-4 flex items-start gap-3 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                  <p>
                    <span className="font-semibold">Could not load inventory.</span> {listError}
                  </p>
                </div>
              ) : rows.length === 0 ? (
                <p className="mt-4 text-muted-foreground">
                  No inventory items yet. Add your first product above.
                </p>
              ) : (
                <ul className="mt-6 divide-y divide-border rounded-xl border border-border bg-card/40">
                  {rows.map((row) => (
                    <li key={String(row.id)} className="flex items-center gap-4 p-4">
                      <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-aura-sage/40">
                        <Package className="h-5 w-5 text-aura-deep" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium">{row.product_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {row.quantity} {row.unit} on hand · {row.daily_sales} {row.unit}/day sold
                          · {row.category}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-1.5 text-sm text-muted-foreground">
                        <CalendarDays className="h-4 w-4" />
                        <span>Expires {formatDate(row.expiration_date)}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
