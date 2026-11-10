<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep marketing content in typed, browser-safe data objects shared by the homepage, library and export formatters; this prevents copy and exported materials from drifting apart.
- Marketing interactions remain client-only and do not access existing database integrations; persistence will be explicitly integrated in a separate task.
- Keep guided chat rules and recommendation formatting browser-safe, with external chat storage behind server functions using the existing external client; this separates testable guidance from persistence and keeps credentials server-only.
- Share typed navigation links between the header and footer so all existing and reserved pages remain reachable without menu drift.
- Load dashboard previews for Inventory and Research through safe external read projections; use the existing get_dashboard_counts RPC for all other dashboard totals without reading their individual records, and never invent counts on failures or empty filtered reads.
- Keep documentation history and verbatim prompts in browser-safe source data with explicit provenance and completion status; documentation is static and preserves the existing document-upload integration.
