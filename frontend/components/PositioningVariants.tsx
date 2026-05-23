const VARIANTS = [
  {
    id: "A",
    title: "AI-Native Builder PM",
    default: true,
    bestFor: "AI startups, Series A–B, founder-led hiring, technical PM roles",
    lead: "Mutual fund RAG (200+ users), Groww Review Analyzer agent, LLM intake pipeline, agentic AI, MCP, prompt engineering",
    headline: "Product Manager | AI-Native Products & Automation | PM Fellow @NextLeap",
    tone: "Builder-executor, speed to value, ships with Cursor/LLMs",
  },
  {
    id: "B",
    title: "Product Operations & Scale PM",
    default: false,
    bestFor: "Series B/C, platform/product ops roles, internal tooling at scale",
    lead: "200+ discovery cycles, intake pipeline automation, 50% cycle-time reduction, 80% intake acceptance",
    headline: "Product Operations Manager | Automation Platforms | Cross-Functional Delivery",
    tone: "Operational excellence, predictability, stakeholder alignment",
  },
  {
    id: "C",
    title: "Growth & Analytics PM",
    default: false,
    bestFor: "Growth PM, product analytics, PLG startups",
    lead: "Adoption/retention/churn/CSAT ownership, funnel optimization, cohort/LTV case studies",
    headline: "Growth Product Manager | Data-Driven Execution | Retention & Adoption",
    tone: "Metrics-first, experimentation, user segmentation",
  },
];

const MATRIX = [
  { type: "Early-stage (pre-Series A)", variant: "A + Floor comp", emphasize: "MVP speed, wearing hats, builder mindset" },
  { type: "AI-first startup", variant: "A + Stretch comp", emphasize: "LLM products, prompt engineering, shipped AI app" },
  { type: "Product-led Series B/C", variant: "B or C", emphasize: "Metrics, cross-functional scale, roadmap" },
  { type: "Founder-led", variant: "A", emphasize: "Direct impact, ₹1.5 Cr+ story, scrappy shipping" },
  { type: "Product Operations", variant: "B", emphasize: "Intake pipeline, Wrike, 200+ requests" },
];

export function PositioningVariants() {
  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="text-headline-lg font-bold text-on-surface mb-2">Positioning strategy</h1>
        <p className="text-body-lg text-on-surface-variant max-w-2xl">
          Three narrative variants (EC-X.2) — swap without a full pipeline re-run. Default: Variant A.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {VARIANTS.map((v) => (
          <article
            key={v.id}
            className={`bg-surface-raised border rounded-xl p-6 flex flex-col gap-4 ${
              v.default ? "border-private-workbench" : "border-border-subtle"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-label-sm text-metrics-gold uppercase tracking-wider">
                Variant {v.id}
              </span>
              {v.default && (
                <span className="px-2 py-0.5 rounded-full bg-private-workbench/20 text-private-workbench font-mono text-label-sm border border-private-workbench/30">
                  Active
                </span>
              )}
            </div>
            <h2 className="text-headline-md font-semibold text-on-surface">{v.title}</h2>
            <p className="text-sm text-on-surface-variant">
              <span className="text-on-surface font-medium">Best for:</span> {v.bestFor}
            </p>
            <p className="text-sm text-on-surface-variant">
              <span className="text-on-surface font-medium">Lead with:</span> {v.lead}
            </p>
            <p className="text-sm font-mono text-primary border-t border-border-subtle pt-4">
              {v.headline}
            </p>
            <p className="text-sm text-on-surface-variant italic">{v.tone}</p>
          </article>
        ))}
      </div>

      <section>
        <h2 className="text-headline-md font-semibold text-on-surface mb-4 border-b border-outline-variant pb-3">
          Company-type matrix
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-outline-variant">
                <th className="text-left py-3 px-2 font-mono text-label-sm uppercase text-on-surface-variant">
                  Company type
                </th>
                <th className="text-left py-3 px-2 font-mono text-label-sm uppercase text-on-surface-variant">
                  Variant
                </th>
                <th className="text-left py-3 px-2 font-mono text-label-sm uppercase text-on-surface-variant">
                  Emphasize
                </th>
              </tr>
            </thead>
            <tbody>
              {MATRIX.map((row) => (
                <tr key={row.type} className="border-b border-border-subtle">
                  <td className="py-3 px-2 text-on-surface font-medium">{row.type}</td>
                  <td className="py-3 px-2 text-primary font-mono">{row.variant}</td>
                  <td className="py-3 px-2 text-on-surface-variant">{row.emphasize}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
