"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { PUBLIC_NAV_ITEMS } from "@/lib/publicNav";
import { cn } from "@/lib/utils";

export function PublicNavRail() {
  const pathname = usePathname();

  return (
    <nav className="hidden md:flex flex-col items-center fixed left-0 top-16 h-[calc(100vh-4rem)] w-rail-width border-r border-outline-variant bg-surface-default py-6 z-40">
      <div className="flex flex-col gap-4 w-full px-2">
        {PUBLIC_NAV_ITEMS.map((item) => {
          const active =
            !item.external &&
            (item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href));

          const className = cn(
            "flex flex-col items-center justify-center p-2 rounded-lg transition-all w-full",
            active
              ? "text-primary opacity-100"
              : "text-on-surface opacity-40 hover:bg-surface-variant hover:opacity-100"
          );

          const icon = (
            <MaterialIcon
              name={item.icon}
              className="text-[24px]"
              filled={active}
            />
          );

          if (item.external) {
            return (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className={className}
                title={item.label}
              >
                {icon}
              </a>
            );
          }

          return (
            <Link key={item.href} href={item.href} className={className} title={item.label}>
              {icon}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
