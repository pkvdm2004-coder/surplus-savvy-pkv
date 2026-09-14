import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { listExternalRows } from "@/lib/external-data.functions";
import { Loader2, AlertCircle, BookOpen, FlaskConical, ExternalLink, Search } from "lucide-react";

export const Route = createFileRoute("/research")({
  component: Research,
  head: () => ({
    meta: [
      { title: "Research — Market & Competitor Insights | AURA Company" },
      { name: "description", content: "AURA's research base: market and competitor findings that inform our food-waste forecasting for restaurants." },
      { property: "og:title", content: "Research — Market & Competitor Insights | AURA Company" },
      { property: "og:description", content: "AURA's research base: market and competitor findings that inform our food-waste forecasting for restaurants." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

type ResearchProject = {
  id: number | string;
  topic: string;
  target_user: string;
  market: string;
  research_question: string;
  created_at: string;
};

type ResearchEntry = {
  id: number | string;
  name: string;
  type: string;
  market: string;
  country: string;
  problem: string;
  strength: string;
  limitation: string;
  relevance_to_aura: string;
  source_url: string | null;
  created_at: string;
};

const TYPE_FILTERS = ["All", "Direct Competitor", "Indirect Competitor", "Substitute"] as const;
const MARKET_FILTERS = ["All", "Global", "Mexico"] as const;

function Research() {
  const [projects, setProjects] = useState<ResearchProject[]>([]);
  const [entries, setEntries] = useState<ResearchEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("All");
  const [marketFilter, setMarketFilter] = useState<string>("All");

  const filteredEntries = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return entries.filter((entry) => {
      const matchesSearch =
        !query ||
        entry.name.toLowerCase().includes(query) ||
        entry.problem.toLowerCase().includes(query) ||
        entry.strength.toLowerCase().includes(query) ||
        entry.limitation.toLowerCase().includes(query);
      const matchesType = typeFilter === "All" || entry.type === typeFilter;
      const matchesMarket = marketFilter === "All" || entry.market === marketFilter;
      return matchesSearch && matchesType && matchesMarket;
    });
  }, [entries, searchQuery, typeFilter, marketFilter]);

  const load = useCallback(async () => {
    setLoading(true);
    const [projectsResult, entriesResult] = await Promise.all([
      listExternalRows({ data: { table: "research_projects", limit: 100 } }),
      listExternalRows({ data: { table: "research_entries", limit: 100 } }),
    ]);

    const firstError = projectsResult.error ?? entriesResult.error;
    if (firstError) {
      setError(firstError);
    } else {
      setError(null);
      setProjects((projectsResult.rows as unknown as ResearchProject[]) ?? []);
      setEntries((entriesResult.rows as unknown as ResearchEntry[]) ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main>
        <section className="bg-aura-cream py-24">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold leading-tight text-aura-ink sm:text-5xl">
              Research
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              The market and competitor findings behind AURA — what restaurants struggle with
              today and how existing solutions fall short.
            </p>
          </div>
        </section>

        {loading ? (
          <section className="py-16">
            <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 text-muted-foreground sm:px-6 lg:px-8">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Loading research…</span>
            </div>
          </section>
        ) : error ? (
          <section className="py-16">
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
              <div className="flex items-start gap-3 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                <p>
                  <span className="font-semibold">Could not load research.</span> {error}
                </p>
              </div>
            </div>
          </section>
        ) : (
          <>
            <section className="py-16">
              <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-3">
                  <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-aura-sage/40">
                    <FlaskConical className="h-5 w-5 text-aura-deep" />
                  </div>
                  <h2 className="font-display text-2xl font-bold">Research projects</h2>
                </div>

                {projects.length === 0 ? (
                  <p className="mt-6 text-sm text-muted-foreground">No research projects yet.</p>
                ) : (
                  <div className="mt-8 grid gap-6 sm:grid-cols-2">
                    {projects.map((project) => (
                      <div
                        key={String(project.id)}
                        className="rounded-xl border border-border bg-card/40 p-6"
                      >
                        <h3 className="font-display text-lg font-bold text-aura-ink">
                          {project.topic}
                        </h3>
                        <p className="mt-2 text-sm italic text-muted-foreground">
                          {project.research_question}
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {project.target_user && (
                            <span className="inline-flex rounded-full border border-aura-moss/40 bg-aura-sage/40 px-2.5 py-0.5 text-xs font-medium text-aura-deep">
                              {project.target_user}
                            </span>
                          )}
                          {project.market && (
                            <span className="inline-flex rounded-full border border-border bg-muted/60 px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                              {project.market}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

            <section className="bg-aura-cream/50 py-16">
              <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-3">
                  <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-aura-sage/40">
                    <BookOpen className="h-5 w-5 text-aura-deep" />
                  </div>
                  <h2 className="font-display text-2xl font-bold">Research entries</h2>
                </div>

                {entries.length === 0 ? (
                  <div className="mt-8 rounded-lg border border-dashed border-border bg-background/50 p-8 text-center">
                    <BookOpen className="mx-auto h-8 w-8 text-muted-foreground" />
                    <p className="mt-4 font-medium text-aura-ink">No research entries yet</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Findings will appear here once they are added to the research base.
                    </p>
                  </div>
                ) : (
                  <div className="mt-8 grid gap-6">
                    {entries.map((entry) => (
                      <article
                        key={String(entry.id)}
                        className="rounded-xl border border-border bg-card/40 p-6"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <h3 className="font-display text-lg font-bold text-aura-ink">
                              {entry.name}
                            </h3>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {entry.type && (
                                <span className="inline-flex rounded-full border border-aura-moss/40 bg-aura-sage/40 px-2.5 py-0.5 text-xs font-medium text-aura-deep">
                                  {entry.type}
                                </span>
                              )}
                              {entry.market && (
                                <span className="inline-flex rounded-full border border-border bg-muted/60 px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                                  {entry.market}
                                </span>
                              )}
                              {entry.country && (
                                <span className="inline-flex rounded-full border border-border bg-muted/60 px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                                  {entry.country}
                                </span>
                              )}
                            </div>
                          </div>
                          {entry.source_url && (
                            <a
                              href={entry.source_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-sm font-medium text-aura-deep hover:underline"
                            >
                              Source
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          )}
                        </div>

                        <dl className="mt-5 grid gap-4 sm:grid-cols-2">
                          {entry.problem && (
                            <div>
                              <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                Problem
                              </dt>
                              <dd className="mt-1 text-sm text-aura-ink">{entry.problem}</dd>
                            </div>
                          )}
                          {entry.strength && (
                            <div>
                              <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                Strength
                              </dt>
                              <dd className="mt-1 text-sm text-aura-ink">{entry.strength}</dd>
                            </div>
                          )}
                          {entry.limitation && (
                            <div>
                              <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                Limitation
                              </dt>
                              <dd className="mt-1 text-sm text-aura-ink">{entry.limitation}</dd>
                            </div>
                          )}
                          {entry.relevance_to_aura && (
                            <div>
                              <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                Relevance to AURA
                              </dt>
                              <dd className="mt-1 text-sm text-aura-ink">
                                {entry.relevance_to_aura}
                              </dd>
                            </div>
                          )}
                        </dl>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
