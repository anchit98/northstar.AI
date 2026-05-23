"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { BrandLogo } from "@/components/BrandLogo";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { PUBLIC_NAV_ITEMS } from "@/lib/publicNav";
import { cn } from "@/lib/utils";

export function PublicHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

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
    <>
      <header className="fixed top-0 z-50 flex h-14 sm:h-16 w-full items-center justify-between gap-2 border-b border-outline-variant bg-surface-raised px-4 md:px-margin-desktop">
        <BrandLogo size="sm" className="min-w-0 shrink" />

        <div className="flex items-center gap-2 sm:gap-4">
          <nav className="hidden lg:flex items-center gap-6 font-mono text-label-md text-on-surface-variant">
            {PUBLIC_NAV_ITEMS.filter((item) => !item.external).slice(1).map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-primary transition-colors">
                {item.label === "Resume" ? "Resumes" : item.label}
              </Link>
            ))}
          </nav>

          <Link
            href="/workbench"
            className="hidden sm:inline-flex items-center gap-2 rounded-full bg-private-workbench px-3 sm:px-4 py-1.5 font-mono text-label-md text-black hover:opacity-90 transition-opacity shrink-0"
          >
            <MaterialIcon name="lock" className="text-[18px]" />
            <span className="hidden md:inline">Private Workbench</span>
            <span className="md:hidden">Workbench</span>
          </Link>

          <button
            type="button"
            className="lg:hidden p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <MaterialIcon name="menu" />
          </button>
        </div>
      </header>

      {menuOpen && (
        <>
          <button
            type="button"
            className="lg:hidden fixed inset-0 z-[60] bg-black/60 top-14 sm:top-16"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          />
          <nav
            className="lg:hidden fixed top-14 sm:top-16 left-0 right-0 z-[61] border-b border-outline-variant bg-surface-raised shadow-xl max-h-[70vh] overflow-y-auto"
            aria-label="Mobile menu"
          >
            <ul className="flex flex-col p-2">
              {PUBLIC_NAV_ITEMS.map((item) => {
                const className = cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg font-mono text-label-md transition-colors",
                  "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
                );
                if (item.external) {
                  return (
                    <li key={item.href}>
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noreferrer"
                        className={className}
                        onClick={() => setMenuOpen(false)}
                      >
                        <MaterialIcon name={item.icon} className="text-[22px]" />
                        {item.label}
                        <MaterialIcon name="open_in_new" className="text-[16px] ml-auto opacity-60" />
                      </a>
                    </li>
                  );
                }
                return (
                  <li key={item.href}>
                    <Link href={item.href} className={className} onClick={() => setMenuOpen(false)}>
                      <MaterialIcon name={item.icon} className="text-[22px]" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
              <li className="border-t border-outline-variant mt-2 pt-2">
                <Link
                  href="/workbench"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg font-mono text-label-md text-private-workbench bg-private-workbench/10"
                  onClick={() => setMenuOpen(false)}
                >
                  <MaterialIcon name="lock" className="text-[22px]" />
                  Private Workbench
                </Link>
              </li>
            </ul>
          </nav>
        </>
      )}
    </>
  );
}
