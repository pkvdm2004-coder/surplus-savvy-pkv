import { createFileRoute } from '@tanstack/react-router';
import { Navbar } from '@/components/shared/navbar';
import { Footer } from '@/components/shared/footer';

export const Route = createFileRoute('/demo')({
  head: () => ({ meta: [
    { title: 'Demo — Coming Soon | AURA Company' },
    { name: 'description', content: 'The AURA demo is reserved for a future development step.' },
    { property: 'og:title', content: 'Demo — Coming Soon | AURA Company' },
    { property: 'og:description', content: 'The AURA demo is reserved for a future development step.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ] }),
  component: Demo,
});

function Demo() {
  return <div className="min-h-screen bg-background"><Navbar /><main className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8"><h1 className="text-4xl text-primary">Demo</h1><p className="mt-5 text-muted-foreground">Coming soon.</p></main><Footer /></div>;
}