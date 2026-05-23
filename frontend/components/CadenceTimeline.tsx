import { MaterialIcon } from "@/components/ui/MaterialIcon";

const TOUCHES = [
  {
    day: "Day 1",
    title: "Initial pitch",
    description:
      "Send the primary template with a personalized hook. Lead with your strongest metric for the company type.",
    icon: "send",
  },
  {
    day: "Day 5–7",
    title: "Value-add follow-up",
    description:
      "Share a relevant article, product observation, or congrats on a launch. Never say “just bubbling this up.”",
    icon: "lightbulb",
  },
  {
    day: "Day 10–14",
    title: "Gentle close",
    description:
      "Assume timing isn’t right; offer to stay connected. Max 3 touches unless they engage (EC-5.3).",
    icon: "handshake",
  },
];

export function CadenceTimeline() {
  return (
    <section className="bg-surface-raised border border-border-subtle rounded-xl p-6 md:p-8">
      <h3 className="text-headline-md font-semibold text-on-surface mb-2">3-touch cadence</h3>
      <p className="text-body-md text-on-surface-variant mb-8 max-w-2xl">
        Never send more than 3 touches unless the recipient engages. Spread outreach across email and LinkedIn.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TOUCHES.map((touch) => (
          <div key={touch.day} className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary-container/20 border border-primary-container flex items-center justify-center text-primary">
                <MaterialIcon name={touch.icon} />
              </div>
              <span className="font-mono text-label-sm text-metrics-gold uppercase tracking-wider">
                {touch.day}
              </span>
            </div>
            <h4 className="font-semibold text-on-surface">{touch.title}</h4>
            <p className="text-sm text-on-surface-variant leading-relaxed">{touch.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
