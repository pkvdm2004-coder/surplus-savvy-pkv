import { Link } from "@tanstack/react-router";

const footerLinks = [
  { to: "/", label: "Home" },
  { to: "/how-it-works", label: "How it works" },
  { to: "/pricing", label: "Pricing" },
  { to: "/marketing", label: "Marketing" },
  { to: "/docs", label: "Docs" },
  { to: "/inventory", label: "Inventory" },
  { to: "/predictions", label: "Predictions" },
  { to: "/research", label: "Research" },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div className="max-w-sm">
            <Link to="/" className="font-display text-2xl font-bold text-aura-deep">
              AURA
            </Link>
            <p className="mt-2 text-sm text-muted-foreground">
              Helping restaurants cut waste, protect margins, and serve what they prepare.
            </p>
          </div>

          <ul className="flex flex-wrap gap-6">
            {footerLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="text-sm text-muted-foreground transition-colors hover:text-aura-deep"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-12 border-t border-border pt-8 text-sm text-muted-foreground">
          © {new Date().getFullYear()} AURA Company. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
