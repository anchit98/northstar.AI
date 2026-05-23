import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";

export default function AuthGatePage({
  searchParams,
}: {
  searchParams: { error?: string; callbackUrl?: string };
}) {
  const hasError = searchParams.error === "1";

  return (
    <div className="max-w-md w-full p-8 rounded-2xl bg-surface-raised border border-border-subtle shadow-2xl">
      <BrandLogo href="/" size="md" className="mb-6" />
      <h1 className="text-2xl font-bold text-on-surface mb-2">Private Workbench</h1>
      <p className="text-on-surface-variant text-sm mb-8">
        Outreach templates, interview prep, positioning strategy, and version history are protected.
      </p>

      {hasError && (
        <p className="mb-4 text-sm text-error bg-error-container/10 border border-error/30 rounded-lg px-4 py-2">
          Incorrect passcode. Please try again.
        </p>
      )}

      <form className="space-y-4" action="/api/auth" method="POST">
        {searchParams.callbackUrl && (
          <input type="hidden" name="callbackUrl" value={searchParams.callbackUrl} />
        )}
        <div>
          <label htmlFor="passcode" className="sr-only">
            Passcode
          </label>
          <input
            type="password"
            id="passcode"
            name="passcode"
            placeholder="Enter passcode"
            className="w-full bg-surface-default border border-outline-variant rounded-lg px-4 py-3 text-on-surface focus:outline-none focus:border-private-workbench focus:ring-1 focus:ring-private-workbench/30"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-private-workbench hover:opacity-90 text-black font-medium py-3 rounded-full transition-opacity font-mono text-label-md"
        >
          Unlock Workbench
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-outline-variant text-center">
        <Link href="/" className="text-sm text-on-surface-variant hover:text-on-surface transition-colors">
          ← Back to public site
        </Link>
        <p className="mt-4">
          <a
            href="mailto:jobsforanchit.boruah@gmail.com?subject=NorthStar%20AI%20Workbench%20Access"
            className="text-sm text-on-surface-variant hover:text-primary transition-colors"
          >
            Request access
          </a>
        </p>
      </div>
    </div>
  );
}
