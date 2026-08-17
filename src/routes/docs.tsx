import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UploadCloud, FileText, Trash2, Download, Loader2 } from "lucide-react";

export const Route = createFileRoute("/docs")({
  component: Docs,
  head: () => ({
    meta: [
      { title: "Docs — Upload Restaurant Documents | AURA Company" },
      { name: "description", content: "Upload and manage your restaurant's menus, invoices, and prep sheets so AURA can turn them into surplus insights." },
      { property: "og:title", content: "Docs — Upload Restaurant Documents | AURA Company" },
      { property: "og:description", content: "Upload and manage your restaurant's menus, invoices, and prep sheets so AURA can turn them into surplus insights." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

type Doc = {
  id: string;
  name: string;
  storage_path: string;
  size_bytes: number;
  mime_type: string | null;
  created_at: string;
};

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function Docs() {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error("Could not load documents");
    else setDocs((data ?? []) as Doc[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const upload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    for (const file of Array.from(files)) {
      const path = `${crypto.randomUUID()}-${file.name.replace(/[^\w.\-]/g, "_")}`;
      const { error: uploadError } = await supabase.storage
        .from("documents")
        .upload(path, file, { contentType: file.type || undefined });
      if (uploadError) {
        toast.error(`Upload failed: ${file.name}`);
        continue;
      }
      const { error: insertError } = await supabase.from("documents").insert({
        name: file.name,
        storage_path: path,
        size_bytes: file.size,
        mime_type: file.type || null,
      });
      if (insertError) toast.error(`Could not save: ${file.name}`);
      else toast.success(`Uploaded ${file.name}`);
    }
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
    void load();
  };

  const download = async (doc: Doc) => {
    const { data, error } = await supabase.storage
      .from("documents")
      .createSignedUrl(doc.storage_path, 60);
    if (error || !data) {
      toast.error("Could not open document");
      return;
    }
    window.open(data.signedUrl, "_blank", "noopener,noreferrer");
  };

  const remove = async (doc: Doc) => {
    await supabase.storage.from("documents").remove([doc.storage_path]);
    const { error } = await supabase.from("documents").delete().eq("id", doc.id);
    if (error) toast.error("Could not delete document");
    else {
      toast.success("Document deleted");
      setDocs((prev) => prev.filter((d) => d.id !== doc.id));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main>
        <section className="bg-aura-cream py-24">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold leading-tight text-aura-ink sm:text-5xl">Docs</h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Upload menus, invoices, prep sheets, and waste logs. Everything you share here feeds
              the surplus estimates AURA builds for your kitchen.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                void upload(e.dataTransfer.files);
              }}
              className={`rounded-xl border-2 border-dashed p-12 text-center transition-colors ${
                dragging ? "border-aura-deep bg-aura-sage/20" : "border-border bg-card/40"
              }`}
            >
              <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-aura-sage/40">
                {uploading ? (
                  <Loader2 className="h-6 w-6 animate-spin text-aura-deep" />
                ) : (
                  <UploadCloud className="h-6 w-6 text-aura-deep" />
                )}
              </div>
              <h2 className="font-display text-xl font-bold">Drop files here</h2>
              <p className="mt-2 text-muted-foreground">
                PDFs, spreadsheets, images, or documents — up to 50&nbsp;MB each.
              </p>
              <input
                ref={inputRef}
                type="file"
                multiple
                className="hidden"
                onChange={(e) => void upload(e.target.files)}
              />
              <Button
                className="mt-6"
                disabled={uploading}
                onClick={() => inputRef.current?.click()}
              >
                {uploading ? "Uploading…" : "Choose files"}
              </Button>
            </div>

            <div className="mt-12">
              <h2 className="font-display text-2xl font-bold">Your documents</h2>
              {loading ? (
                <p className="mt-4 text-muted-foreground">Loading…</p>
              ) : docs.length === 0 ? (
                <p className="mt-4 text-muted-foreground">
                  No documents yet. Upload your first file above.
                </p>
              ) : (
                <ul className="mt-6 divide-y divide-border rounded-xl border border-border bg-card/40">
                  {docs.map((doc) => (
                    <li key={doc.id} className="flex items-center gap-4 p-4">
                      <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-aura-sage/40">
                        <FileText className="h-5 w-5 text-aura-deep" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium">{doc.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatSize(doc.size_bytes)} ·{" "}
                          {new Date(doc.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Button variant="ghost" size="icon" aria-label={`Download ${doc.name}`} onClick={() => void download(doc)}>
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" aria-label={`Delete ${doc.name}`} onClick={() => void remove(doc)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
