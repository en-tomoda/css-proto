import { ReviewHeader }    from "@/components/review/review-header";
import { ReflectionsList } from "@/components/review/reflections-list";
import { GrowthDiffChart } from "@/components/review/growth-diff-chart";

export default function ReviewPage() {
  return (
    <div className="min-h-full bg-muted/40 py-8 px-4">
      <div className="mx-auto max-w-4xl space-y-5">
        <ReviewHeader />
        <ReflectionsList />
        <GrowthDiffChart />
      </div>
    </div>
  );
}
