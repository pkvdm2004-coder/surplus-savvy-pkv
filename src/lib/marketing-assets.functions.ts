import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const ASSET_TYPES = ["social_post", "video_script", "landing_copy", "campaign_content"] as const;
export const ASSET_STATUSES = ["draft", "planned", "ready"] as const;
export type MarketingAssetInput = {
  asset_type: (typeof ASSET_TYPES)[number];
  title: string;
  content: string;
  platform?: string | null;
  status: (typeof ASSET_STATUSES)[number];
};

// Insert-only: RLS on marketing_assets allows INSERT but not SELECT.
export const saveMarketingAsset = createServerFn({ method: "POST" })
  .inputValidator((data: MarketingAssetInput) =>
    z.object({
      asset_type: z.enum(ASSET_TYPES),
      title: z.string().trim().min(1).max(300),
      content: z.string().trim().min(1).max(20000),
      platform: z.string().trim().max(100).nullable().optional(),
      status: z.enum(ASSET_STATUSES),
    }).parse(data),
  )
  .handler(async ({ data }): Promise<{ ok: boolean; error: string | null }> => {
    try {
      const { externalSupabase } = await import("./external-supabase.server");
      const { error } = await externalSupabase().from("marketing_assets").insert({ ...data, platform: data.platform ?? null });
      return error ? { ok: false, error: error.message } : { ok: true, error: null };
    } catch (e) {
      return { ok: false, error: e instanceof Error ? e.message : "Unknown error" };
    }
  });
