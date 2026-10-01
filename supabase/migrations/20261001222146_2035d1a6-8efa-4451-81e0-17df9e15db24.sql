CREATE TABLE public.pricing_scenarios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan text NOT NULL CHECK (plan IN ('Starter','Professional','Enterprise')),
  monthly_price numeric NOT NULL CHECK (monthly_price >= 0),
  restaurant_count integer NOT NULL CHECK (restaurant_count BETWEEN 1 AND 500),
  monthly_revenue numeric NOT NULL CHECK (monthly_revenue >= 0),
  annual_revenue numeric NOT NULL CHECK (annual_revenue >= 0),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.pricing_scenarios TO anon, authenticated;
GRANT ALL ON public.pricing_scenarios TO service_role;
ALTER TABLE public.pricing_scenarios ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can save pricing scenarios" ON public.pricing_scenarios
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    restaurant_count BETWEEN 1 AND 500
    AND monthly_revenue = monthly_price * restaurant_count
    AND annual_revenue = monthly_revenue * 12
  );