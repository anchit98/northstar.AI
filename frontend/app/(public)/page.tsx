import Link from "next/link";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { PROJECTS } from "@/lib/constants";

const METRICS = [
  { label: "Value Created", value: "₹1.5 Cr+", sub: "Verified Impact", icon: "trending_up", accent: "text-success-green" },
  { label: "User Adoption", value: "80%", sub: "Enterprise Wide", icon: "group", accent: "text-on-surface-variant" },
  { label: "Speed to Market", value: "1-Day", sub: "MVP Delivery", icon: "rocket_launch", accent: "text-on-surface-variant" },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col gap-12">
      <section className="flex flex-col gap-8 pt-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <MaterialIcon name="lock" className="text-on-surface-variant text-[16px]" />
            <span className="font-mono text-label-sm sm:text-label-md text-on-surface-variant uppercase tracking-wide sm:tracking-widest">
              Private workbench available on request
            </span>
          </div>
          <h1 className="type-metric-responsive text-on-surface break-words">
            Anchit Boruah<span className="text-primary">.</span>
          </h1>
          <h2 className="text-headline-lg text-on-surface-variant">AI-Native Product Manager</h2>
        </div>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/resume"
            className="inline-flex items-center gap-2 rounded-full bg-primary-container text-on-primary-container px-6 py-3 font-mono text-label-md hover:opacity-90"
          >
            View Resumes
            <MaterialIcon name="arrow_forward" className="text-[18px]" />
          </Link>
          <Link
            href="/projects"
            className="rounded-full border border-border-subtle bg-surface-variant px-6 py-3 font-mono text-label-md hover:bg-surface-container-high"
          >
            Case Studies
          </Link>
          <Link
            href="/branding"
            className="rounded-full border border-outline-variant text-primary px-6 py-3 font-mono text-label-md hover:bg-surface-container"
          >
            Personal Branding
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {METRICS.map((m) => (
          <div
            key={m.label}
            className="bg-surface-raised border border-border-subtle rounded-xl p-gutter min-h-[160px] flex flex-col justify-between"
          >
            <div>
              <span className="font-mono text-label-md text-on-surface-variant uppercase tracking-wider block mb-2">
                {m.label}
              </span>
              <p className="type-metric-responsive text-metrics-gold">{m.value}</p>
            </div>
            <p className={`flex items-center gap-2 mt-4 font-mono text-label-sm ${m.accent}`}>
              <MaterialIcon name={m.icon} className="text-[16px]" />
              {m.sub}
            </p>
          </div>
        ))}
      </section>

      <section className="flex flex-col gap-6">
        <div className="flex items-center justify-between border-b border-outline-variant pb-4">
          <h3 className="text-headline-md font-semibold">Featured Projects</h3>
          <Link href="/projects" className="text-primary font-mono text-label-md hover:underline flex items-center gap-1">
            View All <MaterialIcon name="chevron_right" className="text-[16px]" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROJECTS.map((p) => (
            <Link
              key={p.id}
              href="/projects"
              className="bg-surface-raised border border-border-subtle rounded-xl overflow-hidden flex flex-col hover:border-outline-variant transition-colors group"
            >
              <div className="h-40 bg-surface-container-high relative">
                <div className="absolute inset-0 bg-gradient-to-t from-surface-raised to-transparent" />
                <div className="absolute bottom-4 left-4 flex gap-2">
                  {p.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="bg-surface-default/80 border border-border-subtle font-mono text-label-sm px-2 py-1 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="p-gutter flex flex-col gap-2">
                <h4 className="text-lg font-semibold group-hover:text-primary transition-colors">{p.title}</h4>
                <p className="text-on-surface-variant line-clamp-2 text-sm">{p.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
