export type Tier = {
  name: "Starter" | "Professional" | "Enterprise";
  price: string;
  monthly: number;
  target: string;
  features: string[];
  popular: boolean;
};

export const tiers: Tier[] = [
  {
    name: "Starter",
    price: "$99",
    monthly: 99,
    target: "Small restaurants getting started with food waste management.",
    features: ["Inventory management", "Food waste tracking", "Basic dashboard", "Basic reporting", "Up to 1 location", "Email support"],
    popular: false,
  },
  {
    name: "Professional",
    price: "$249",
    monthly: 249,
    target: "Restaurants that want advanced insights and predictive analytics.",
    features: ["Everything in Starter", "Predictions and forecasting", "Research & benchmarking", "Advanced analytics", "Risk and opportunity insights", "Up to 5 locations", "Priority support"],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "$599",
    monthly: 599,
    target: "Restaurant groups and multi-location businesses.",
    features: ["Everything in Professional", "Multi-location management", "Advanced forecasting", "Custom analytics and reporting", "Higher usage limits", "Dedicated account manager", "Custom integrations"],
    popular: false,
  },
];

export const MIN_CUSTOMERS = 1;
export const MAX_CUSTOMERS = 500;

export function clampCustomers(value: number): number {
  if (!Number.isFinite(value)) return MIN_CUSTOMERS;
  return Math.min(MAX_CUSTOMERS, Math.max(MIN_CUSTOMERS, Math.floor(value)));
}

export function calcRevenue(monthly: number, customers: number) {
  const mrr = clampCustomers(customers) * monthly;
  return { mrr, arr: mrr * 12 };
}

export const usd = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
