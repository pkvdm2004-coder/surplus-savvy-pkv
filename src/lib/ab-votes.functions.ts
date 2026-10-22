import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

// A/B copy-comparison votes stored in the user's EXTERNAL Supabase project,
// table public.marketing_ab_votes (id, test_type, variant, created_at).
// We never create or alter that table here.

export const TEST_TYPES = ["headline", "cta"] as const;
export type TestType = (typeof TEST_TYPES)[number];
export type Variant = "A" | "B";

export type VoteResults = {
  total: number;
  a: number;
  b: number;
  pctA: number;
  pctB: number;
};

export const submitAbVote = createServerFn({ method: "POST" })
  .inputValidator((data) =>
    z.object({
      test_type: z.enum(TEST_TYPES),
      variant: z.enum(["A", "B"]),
    }).parse(data),
  )
  .handler(async ({ data }): Promise<{ ok: boolean; error: string | null }> => {
    try {
      const { externalSupabase } = await import("./external-supabase.server");
      const { error } = await externalSupabase()
        .from("marketing_ab_votes")
        .insert({ test_type: data.test_type, variant: data.variant });
      return error ? { ok: false, error: error.message } : { ok: true, error: null };
    } catch (e) {
      return { ok: false, error: e instanceof Error ? e.message : "Unknown error" };
    }
  });

// Counting happens here from real rows; no mock or invented votes.
export const getAbVoteResults = createServerFn({ method: "GET" })
  .inputValidator((data) => z.object({ test_type: z.enum(TEST_TYPES) }).parse(data))
  .handler(async ({ data }): Promise<{ results: VoteResults | null; error: string | null }> => {
    try {
      const { externalSupabase } = await import("./external-supabase.server");
      const { data: rows, error } = await externalSupabase()
        .from("marketing_ab_votes")
        .select("variant")
        .eq("test_type", data.test_type);
      if (error) return { results: null, error: error.message };
      const votes = (rows ?? []) as { variant: string }[];
      const a = votes.filter((v) => v.variant === "A").length;
      const b = votes.filter((v) => v.variant === "B").length;
      const total = a + b;
      return {
        results: {
          total,
          a,
          b,
          pctA: total ? Math.round((a / total) * 100) : 0,
          pctB: total ? Math.round((b / total) * 100) : 0,
        },
        error: null,
      };
    } catch (e) {
      return { results: null, error: e instanceof Error ? e.message : "Unknown error" };
    }
  });
