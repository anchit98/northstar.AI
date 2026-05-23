"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { PUBLIC_NAV_ITEMS } from "@/lib/publicNav";
import { cn } from "@/lib/utils";

export function PublicMobileNav() {
  const pathname = usePathname();

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-outline-variant bg-surface-raised/95 backdrop-blur safe-area-pb"
      aria-label="Mobile navigation"
    >
      <ul className="flex items-stretch justify-around min-h-[3.5rem] px-1">
        {PUBLIC_NAV_ITEMS.filter((item) => !item.external).map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <li key={item.href} className="flex-1 max-w-[5.5rem]">
              <Link
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 h-full py-2 px-1 text-[10px] font-mono uppercase tracking-wide transition-colors",
                  active ? "text-primary" : "text-on-surface-variant"
                )}
              >
                <MaterialIcon name={item.icon} className="text-[22px]" filled={active} />
                <span className="truncate w-full text-center">{item.label}</span>
              </Link>
            </li>
          );
        })}
        <li className="flex-1 max-w-[5.5rem]">
          <Link
            href="/workbench"
            className="flex flex-col items-center justify-center gap-0.5 h-full py-2 px-1 text-[10px] font-mono uppercase tracking-wide text-private-workbench"
          >
            <MaterialIcon name="lock" className="text-[22px]" />
            <span className="truncate w-full text-center">Workbench</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
