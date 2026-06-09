import Link from "next/link";

const insights = [
  "問いを立てることが自分の得意なアプローチだと気づいた",
  "人の成長を支援することに大きな喜びを感じる",
  "独立に向けた具体的な一歩を踏み出したい",
];

export function RecentInsightsCard() {
  return (
    <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">最近の気づき</h2>
        <Link href="/profile" className="text-[11px] text-muted-foreground hover:underline">
          プロフィールへ →
        </Link>
      </div>
      <ul className="mt-3 space-y-2.5">
        {insights.map((insight) => (
          <li key={insight} className="flex items-start gap-2.5 text-sm">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
            <span className="text-muted-foreground leading-relaxed">{insight}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
