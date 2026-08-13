import { useState } from "react";
import { Menu, ScanSearch, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const nav = ["Dashboard", "Resume Screening", "Candidates", "Results", "Settings"];

export function SiteHeader() {
  const [active, setActive] = useState("Resume Screening");
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <a href="/" className="flex min-w-0 items-center gap-3 focus-ring rounded-md">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
            <ScanSearch className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="truncate font-display text-base font-semibold sm:text-lg">
            AI Resume Screening System
          </span>
        </a>

        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {nav.map((item) => (
            <button
              key={item}
              onClick={() => setActive(item)}
              aria-current={active === item ? "page" : undefined}
              className={`focus-ring rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                active === item
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:bg-secondary/70 hover:text-foreground"
              }`}
            >
              {item}
            </button>
          ))}
        </nav>

        <Button
          variant="outline"
          size="icon"
          className="lg:hidden"
          aria-expanded={open}
          aria-label={open ? "Close navigation" : "Open navigation"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {open && (
        <nav aria-label="Mobile" className="border-t border-border px-4 py-2 lg:hidden">
          {nav.map((item) => (
            <button
              key={item}
              onClick={() => {
                setActive(item);
                setOpen(false);
              }}
              className={`focus-ring block w-full rounded-lg px-3 py-2 text-left text-sm font-medium ${
                active === item ? "bg-secondary text-foreground" : "text-muted-foreground"
              }`}
            >
              {item}
            </button>
          ))}
        </nav>
      )}
    </header>
  );
}
