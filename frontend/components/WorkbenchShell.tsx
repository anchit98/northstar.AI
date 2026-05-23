"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/BrandLogo";
import { WorkbenchMobileNav } from "@/components/mobile/WorkbenchMobileNav";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { WORKBENCH_NAV } from "@/lib/workbenchNav";
import { cn } from "@/lib/utils";

function WorkbenchNavLinks({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <>
      {WORKBENCH_NAV.map((item) => {
        const active =
          "exact" in item && item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
              active
                ? "bg-private-workbench/15 text-private-workbench border border-private-workbench/30"
                : "text-on-surface-variant hover:bg-surface-container-high"
            )}
          >
            <MaterialIcon name={item.icon} className="text-[20px]" filled={active} />
            {item.label}
          </Link>
        );
      })}
    </>
  );
}

export function WorkbenchShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  return (
    <div className="min-h-screen bg-surface-default text-on-surface flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 border-r border-outline-variant bg-surface-raised flex-col shrink-0">
        <div className="p-6 border-b border-outline-variant">
          <BrandLogo
            href="/workbench"
            size="sm"
            className="[&_span]:text-on-surface [&_span_span]:text-private-workbench"
          />
          <p className="mt-2 text-xs font-mono text-private-workbench/80 uppercase tracking-wider">
            Private workbench
          </p>
        </div>
        <nav className="flex-1 p-4 flex flex-col gap-1 overflow-y-auto">
          <WorkbenchNavLinks pathname={pathname} />
        </nav>
        <div className="p-4 border-t border-outline-variant">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <MaterialIcon name="logout" className="text-[18px]" />
            Exit to public site
          </Link>
        </div>
      </aside>

      {/* Mobile drawer */}
      {menuOpen && (
        <>
          <button
            type="button"
            className="md:hidden fixed inset-0 z-50 bg-black/60"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          />
          <aside className="md:hidden fixed inset-y-0 left-0 z-50 w-[min(100vw-3rem,18rem)] bg-surface-raised border-r border-outline-variant flex flex-col shadow-2xl">
            <div className="p-4 border-b border-outline-variant flex items-center justify-between gap-2">
              <BrandLogo
                href="/workbench"
                size="sm"
                className="[&_span]:text-on-surface [&_span_span]:text-private-workbench min-w-0"
              />
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high"
                aria-label="Close menu"
              >
                <MaterialIcon name="close" />
              </button>
            </div>
            <nav className="flex-1 p-3 flex flex-col gap-1 overflow-y-auto">
              <WorkbenchNavLinks pathname={pathname} onNavigate={() => setMenuOpen(false)} />
            </nav>
            <div className="p-4 border-t border-outline-variant safe-area-pb">
              <Link
                href="/"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 text-sm text-on-surface-variant hover:text-on-surface"
              >
                <MaterialIcon name="logout" className="text-[18px]" />
                Exit to public site
              </Link>
            </div>
          </aside>
        </>
      )}

      <main className="flex-1 flex flex-col min-h-screen min-w-0 overflow-hidden">
        <header className="h-14 sm:h-16 border-b border-outline-variant bg-surface-default/80 backdrop-blur flex items-center justify-between gap-2 px-4 sm:px-6 md:px-8 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <button
              type="button"
              className="md:hidden p-2 -ml-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              <MaterialIcon name="menu" />
            </button>
            <BrandLogo href={null} size="sm" showWordmark={false} className="shrink-0" />
            <span className="text-xs sm:text-sm text-on-surface-variant truncate hidden sm:inline">
              <span className="hidden md:inline">NorthStar AI / </span>Workbench
            </span>
          </div>
          <span className="px-2 sm:px-3 py-1 rounded-full bg-private-workbench/10 text-private-workbench text-[10px] sm:text-xs font-mono border border-private-workbench/25 shrink-0">
            Private
          </span>
        </header>
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 md:p-8 pb-24 md:pb-8">
          {children}
        </div>
      </main>

      <WorkbenchMobileNav onOpenMenu={() => setMenuOpen(true)} />
    </div>
  );
}
