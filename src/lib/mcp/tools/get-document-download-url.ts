import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseAnon } from "../supabase";

export default defineTool({
  name: "get_document_download_url",
  title: "Get document download link",
  description:
    "Create a temporary (5 minute) download link for a shared document by its id, as returned by list_documents.",
  inputSchema: {
    id: z.string().uuid().describe("The document id from list_documents."),
  },
  annotations: { readOnlyHint: true, idempotentHint: false, openWorldHint: false },
  handler: async ({ id }) => {
    const supabase = supabaseAnon();
    const { data: doc, error } = await supabase
      .from("documents")
      .select("id, name, storage_path")
      .eq("id", id)
      .maybeSingle();
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    if (!doc) return { content: [{ type: "text", text: `No document found with id ${id}.` }], isError: true };

    const { data: signed, error: signError } = await supabase.storage
      .from("documents")
      .createSignedUrl(doc.storage_path, 300);
    if (signError || !signed?.signedUrl) {
      return { content: [{ type: "text", text: signError?.message ?? "Could not create a download link." }], isError: true };
    }
    return {
      content: [{ type: "text", text: `${doc.name}: ${signed.signedUrl} (valid for 5 minutes)` }],
      structuredContent: { id: doc.id, name: doc.name, url: signed.signedUrl, expiresInSeconds: 300 },
    };
  },
});
