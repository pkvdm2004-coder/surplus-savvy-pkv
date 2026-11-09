import { createFileRoute, Link, useRouter } from '@tanstack/react-router';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { ArrowUpRight, Database, LockKeyhole, RefreshCw, Loader2, AlertCircle } from 'lucide-react';
import { Navbar } from '@/components/shared/navbar';
import { Footer } from '@/components/shared/footer';
import { Button } from '@/components/ui/button';
import { getDashboard } from '@/lib/dashboard.functions';
import { dashboardSources } from '@/lib/dashboard';

const dashboardQuery = queryOptions({ queryKey: ['external-dashboard'], queryFn: () => getDashboard(), staleTime: 30_000 });

export const Route = createFileRoute('/dashboard')({
  loader: async ({ context }) => { await context.queryClient.ensureQueryData(dashboardQuery); },
  pendingMs: 0,
  pendingComponent: DashboardLoading,
  errorComponent: DashboardError,
  notFoundComponent: () => <div className="min-h-screen bg-background"><Navbar /><main className="mx-auto max-w-7xl px-4 py-16"><h1 className="text-3xl">Dashboard unavailable</h1></main><Footer /></div>,
  head: () => ({ meta: [
    { title: 'Dashboard — Stored Restaurant Data | AURA Company' },
    { name: 'description', content: 'Review authentic, accessible AURA inventory, saved scenarios, marketing, research, and chat records.' },
    { property: 'og:title', content: 'Dashboard — Stored Restaurant Data | AURA Company' },
    { property: 'og:description', content: 'A read-only overview of accessible stored AURA data, with transparent access limitations.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ] }),
  component: Dashboard,
});

function DashboardLoading() {
  return <div className="min-h-screen bg-background"><Navbar /><main className="mx-auto max-w-7xl px-4 py-16"><h1 className="text-4xl text-primary">Dashboard</h1><p role="status" className="mt-8 flex items-center gap-3 text-muted-foreground"><Loader2 className="h-5 w-5 animate-spin motion-reduce:animate-none" />Loading stored data…</p></main><Footer /></div>;
}

function DashboardError() {
  const router = useRouter();
  return <div className="min-h-screen bg-background"><Navbar /><main className="mx-auto max-w-7xl px-4 py-16"><h1 className="text-4xl text-primary">Dashboard</h1><p role="alert" className="my-6 text-destructive">Could not load the dashboard. Please try again.</p><Button onClick={() => void router.invalidate()}><RefreshCw className="h-4 w-4" />Retry</Button></main><Footer /></div>;
}

function displayValue(value: unknown) {
  return typeof value === 'string' || typeof value === 'number' ? String(value) : '—';
}

function Dashboard() {
  const { data, refetch, isFetching, isRefetchError } = useSuspenseQuery(dashboardQuery);
  return <div className="min-h-screen bg-background"><Navbar />
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-start justify-between gap-5 border-b border-border pb-8">
        <div><p className="mb-3 text-sm font-semibold text-primary">AURA / Operations</p><h1 className="text-4xl text-primary">Dashboard</h1><p className="mt-4 max-w-2xl text-muted-foreground">Stored records from your connected AURA project.</p></div>
        <Button variant="outline" onClick={() => void refetch()} disabled={isFetching}><RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin motion-reduce:animate-none' : ''}`} />{isFetching ? 'Refreshing…' : 'Refresh data'}</Button>
      </div>
      {isRefetchError && <p role="alert" className="mt-5 text-destructive">Refresh failed. Previously loaded records are still shown.</p>}
      <p className="mt-6 text-sm text-muted-foreground">Counts include only records visible under current read permissions. Each preview shows up to five records; hidden records are not counted.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {dashboardSources.map(source => {
          const result = data.find(item => item.table === source.table);
          return <Link key={source.table} to="/dashboard" hash={source.table} className="rounded-lg border border-border p-5 transition-colors hover:bg-muted/40">
            <p className="text-sm text-muted-foreground">{source.title}</p><p className="mt-3 font-display text-2xl text-primary">{result?.state === 'available' ? (result.count ?? 'Available') : result?.state === 'empty' ? 'No visible data' : result?.state === 'unavailable' ? 'Unavailable' : 'Read error'}</p>
            <p className="mt-2 text-xs text-muted-foreground">{result?.state === 'available' && result.count !== null ? 'Visible records' : 'Read access status'}</p>
          </Link>;
        })}
      </div>
      <div className="mt-12">
        {dashboardSources.map(source => {
          const result = data.find(item => item.table === source.table);
          return <section id={source.table} key={source.table} className="scroll-mt-24 border-t border-border py-8">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-4"><h2 className="text-xl text-primary">{source.title}</h2><Button asChild variant="ghost" size="sm"><Link to={source.to}>Open {source.to.slice(1)}<ArrowUpRight className="h-4 w-4" /></Link></Button></div>
            {source.table === 'predictions' && <p className="mb-4 text-sm text-muted-foreground">Stored prediction records only. Inventory-based surplus estimates remain on the Predictions page.</p>}
            {source.table === 'pricing_scenarios' && <p className="mb-4 text-sm text-muted-foreground">Saved simulations, not actual business revenue.</p>}
            {result?.state === 'available' ? <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-muted/40"><tr>{source.labels.map(label => <th key={label} className="px-4 py-3 font-semibold whitespace-nowrap">{label}</th>)}</tr></thead><tbody>{result.rows.map((row, index) => <tr key={index} className="border-b border-border/50">{source.fields.map(field => <td key={field} className="max-w-80 px-4 py-4 break-words">{displayValue(row[field])}</td>)}</tr>)}</tbody></table></div> : <div role={result?.state === 'error' ? 'alert' : 'status'} className="flex items-start gap-3 bg-muted/30 px-4 py-5 text-sm text-muted-foreground">
              {result?.state === 'unavailable' ? <LockKeyhole className="h-5 w-5 shrink-0" /> : result?.state === 'empty' ? <Database className="h-5 w-5 shrink-0" /> : <AlertCircle className="h-5 w-5 shrink-0" />}
              <div><p className="font-semibold text-foreground">{result?.state === 'unavailable' ? 'Read access unavailable' : result?.state === 'empty' ? 'No visible records' : 'Could not read this source'}</p><p className="mt-1">{result?.state === 'unavailable' ? 'Current database permissions do not allow this read. No records or totals are shown.' : result?.state === 'empty' ? 'This source may be empty, or row-level security may hide its records. Stored totals cannot be confirmed.' : 'The connection or source could not be read. Use Refresh data to retry; no totals are shown.'}</p></div>
            </div>}
          </section>;
        })}
      </div>
    </main><Footer /></div>;
}