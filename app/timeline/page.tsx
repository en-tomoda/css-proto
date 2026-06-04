import { TimelineHeader }     from "@/components/timeline/timeline-header";
import { CommitList }         from "@/components/timeline/commit-list";
import { GrowthMetricsChart } from "@/components/timeline/growth-metrics-chart";
import { TimelineCta }        from "@/components/timeline/timeline-cta";

export default function TimelinePage() {
  return (
    <div className="min-h-full bg-muted/40 py-8 px-4">
      <div className="mx-auto max-w-4xl space-y-6">
        <TimelineHeader />
        <CommitList />
        <GrowthMetricsChart />
        <TimelineCta />
      </div>
    </div>
  );
}
