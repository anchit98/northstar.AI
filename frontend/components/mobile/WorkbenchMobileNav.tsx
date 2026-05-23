"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { WORKBENCH_MOBILE_PRIMARY } from "@/lib/workbenchNav";
import { cn } from "@/lib/utils";

type WorkbenchMobileNavProps = {
  onOpenMenu: () => void;
};

export function WorkbenchMobileNav({ onOpenMenu }: WorkbenchMobileNavProps) {
  const pathname = usePathname();

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-outline-variant bg-surface-raised/95 backdrop-blur safe-area-pb"
      aria-label="Workbench navigation"
    >
      <ul className="flex items-stretch justify-around min-h-[3.5rem]">
        {WORKBENCH_MOBILE_PRIMARY.map((item) => {
          const active =
            "exact" in item && item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);

          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 h-full py-2 px-1 text-[10px] font-mono transition-colors",
                  active ? "text-private-workbench" : "text-on-surface-variant"
                )}
              >
                <MaterialIcon name={item.icon} className="text-[22px]" filled={active} />
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
        <li className="flex-1">
          <button
            type="button"
            onClick={onOpenMenu}
            className="flex flex-col items-center justify-center gap-0.5 h-full w-full py-2 px-1 text-[10px] font-mono text-on-surface-variant"
            aria-label="Open workbench menu"
          >
            <MaterialIcon name="menu" className="text-[22px]" />
            <span>More</span>
          </button>
        </li>
      </ul>
    </nav>
  );
}
