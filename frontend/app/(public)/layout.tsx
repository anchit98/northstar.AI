import Link from "next/link";
import { PublicHeader } from "@/components/PublicHeader";
import { PublicMobileNav } from "@/components/mobile/PublicMobileNav";
import { PublicNavRail } from "@/components/PublicNavRail";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface-default text-on-surface overflow-x-hidden">
      <PublicHeader />
      <PublicNavRail />
      <PublicMobileNav />
      <main className="pt-14 sm:pt-16 ml-0 md:ml-rail-width min-h-screen">
        <div className="px-4 py-6 sm:p-margin-mobile md:p-margin-desktop max-w-[1400px] mx-auto pb-24 md:pb-20">
          {children}
        </div>
      </main>
      <footer className="ml-0 md:ml-rail-width border-t border-outline-variant py-6 sm:py-8 px-4 text-center pb-24 md:pb-8">
        <p className="font-mono text-label-sm text-on-surface-variant">
          © 2026 Anchit Boruah ·{" "}
          <Link href="/workbench" className="text-primary hover:underline">
            Private workbench available on request
          </Link>
        </p>
      </footer>
    </div>
  );
}
