import { defineMcp } from "@lovable.dev/mcp-js";
import listDocumentsTool from "./tools/list-documents";
import getDocumentDownloadUrlTool from "./tools/get-document-download-url";

export default defineMcp({
  name: "surplus-savvy",
  title: "Surplus Savvy",
  version: "0.1.0",
  instructions:
    "Surplus Savvy (AURA Company) helps restaurants estimate food surplus and reduce waste. " +
    "Use `list_documents` to see the shared documents uploaded to the app, and " +
    "`get_document_download_url` to get a temporary download link for one of them.",
  tools: [listDocumentsTool, getDocumentDownloadUrlTool],
});
