import { getMarketFeedback } from "@/lib/marketFeedback";
import { MarketFeedbackDashboard } from "@/components/MarketFeedbackDashboard";
export default function FeedbackPage() {
  const data = getMarketFeedback();

  if (!data) {
    return (
      <div className="max-w-2xl">
        <h1 className="text-headline-lg font-bold text-on-surface mb-2">Market feedback</h1>
        <p className="text-on-surface-variant">
          Missing <code className="text-primary">analysis/market_feedback.md</code>. Run Phase 6 setup.
        </p>
      </div>
    );
  }

  return <MarketFeedbackDashboard data={data} />;
}
