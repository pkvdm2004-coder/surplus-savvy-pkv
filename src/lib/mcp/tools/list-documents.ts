import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseAnon } from "../supabase";

export default defineTool({
  name: "list_documents",
  title: "List documents",
  description:
    "List the shared documents uploaded to Surplus Savvy (name, size, type, upload date).",
  inputSchema: {
    limit: z.number().int().min(1).max(100).default(50).describe("Maximum number of documents to return."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ limit }) => {
    const supabase = supabaseAnon();
    const { data, error } = await supabase
      .from("documents")
      .select("id, name, size_bytes, mime_type, created_at")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    const documents = data ?? [];
    return {
      content: [{ type: "text", text: JSON.stringify(documents, null, 2) }],
      structuredContent: { documents },
    };
  },
});
