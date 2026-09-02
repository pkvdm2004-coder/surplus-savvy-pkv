import { Link, useLocation } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/how-it-works", label: "How it works" },
  { to: "/pricing", label: "Pricing" },
  { to: "/marketing", label: "Marketing" },
  { to: "/docs", label: "Docs" },
  { to: "/inventory", label: "Inventory" },
  { to: "/predictions", label: "Predictions" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const isActive = (to: string) =>
    to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-display text-2xl font-bold tracking-tight text-aura-deep">
            AURA
          </span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                className={`text-sm font-medium transition-colors hover:text-aura-deep ${
                  isActive(link.to) ? "text-aura-deep" : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden md:block">
          <Button asChild size="sm">
            <Link to="/pricing">Get started</Link>
          </Button>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="inline-flex items-center justify-center md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-border bg-background px-4 py-4 md:hidden">
          <ul className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className={`block text-sm font-medium transition-colors hover:text-aura-deep ${
                    isActive(link.to) ? "text-aura-deep" : "text-muted-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Button asChild size="sm" className="w-full">
                <Link to="/pricing" onClick={() => setOpen(false)}>
                  Get started
                </Link>
              </Button>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
