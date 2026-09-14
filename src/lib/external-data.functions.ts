import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

// Generic CRUD against the user's external Supabase tables
// (inventory, predictions, waste_logs). Rows are passed through as plain
// records so the existing column layout is used exactly as-is — the app
// never creates, alters, or deletes tables there.
//
// Access is governed entirely by the Row Level Security policies on those
// tables: these functions call the API with the project's public anon key,
// so whatever anon can do in your Supabase project is what callers can do.
export type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };
export type ExternalRow = Record<string, JsonValue>;

const TABLES = ["inventory", "predictions", "waste_logs", "research_projects", "research_entries"] as const;
export type ExternalTable = (typeof TABLES)[number];

export const listExternalRows = createServerFn({ method: "GET" })
  .inputValidator((data) =>
    z
      .object({
        table: z.enum(TABLES),
        limit: z.number().int().min(1).max(500).default(100),
      })
      .parse(data),
  )
  .handler(async ({ data }): Promise<{ rows: ExternalRow[]; error: string | null }> => {
    const { externalSupabase } = await import("./external-supabase.server");
    const supabase = externalSupabase();
    const { data: rows, error } = await supabase
      .from(data.table)
      .select("*")
      .limit(data.limit);
    if (error) return { rows: [], error: error.message };
    return { rows: (rows ?? []) as ExternalRow[], error: null };
  });

export const insertExternalRow = createServerFn({ method: "POST" })
  .inputValidator((data) =>
    z
      .object({
        table: z.enum(TABLES),
        row: z.record(z.string(), z.unknown()),
      })
      .parse(data),
  )
  .handler(async ({ data }): Promise<{ row: ExternalRow | null; error: string | null }> => {
    const { externalSupabase } = await import("./external-supabase.server");
    const supabase = externalSupabase();
    const { error } = await supabase.from(data.table).insert(data.row);
    if (error) return { row: null, error: error.message };
    return { row: null, error: null };
  });

export const updateExternalRow = createServerFn({ method: "POST" })
  .inputValidator((data) =>
    z
      .object({
        table: z.enum(TABLES),
        idColumn: z.string().min(1).default("id"),
        id: z.union([z.string(), z.number()]),
        row: z.record(z.string(), z.unknown()),
      })
      .parse(data),
  )
  .handler(async ({ data }): Promise<{ row: ExternalRow | null; error: string | null }> => {
    const { externalSupabase } = await import("./external-supabase.server");
    const supabase = externalSupabase();
    const { data: updated, error } = await supabase
      .from(data.table)
      .update(data.row)
      .eq(data.idColumn, data.id)
      .select();
    if (error) return { row: null, error: error.message };
    return { row: ((updated?.[0] ?? null) as ExternalRow | null), error: null };
  });

export const deleteExternalRow = createServerFn({ method: "POST" })
  .inputValidator((data) =>
    z
      .object({
        table: z.enum(TABLES),
        idColumn: z.string().min(1).default("id"),
        id: z.union([z.string(), z.number()]),
      })
      .parse(data),
  )
  .handler(async ({ data }): Promise<{ error: string | null }> => {
    const { externalSupabase } = await import("./external-supabase.server");
    const supabase = externalSupabase();
    const { error } = await supabase
      .from(data.table)
      .delete()
      .eq(data.idColumn, data.id);
    return { error: error ? error.message : null };
  });
