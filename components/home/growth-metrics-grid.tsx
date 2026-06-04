const metrics = [
  { label: "挑戦意欲",   change: "+20%", period: "先月比" },
  { label: "自己効力感", change: "+15%", period: "先月比" },
  { label: "他者貢献",   change: "+10%", period: "先月比" },
];

export function GrowthMetricsGrid() {
  return (
    <div className="grid grid-cols-3 gap-3">
      {metrics.map((m) => (
        <div key={m.label} className="rounded-2xl border border-border/70 bg-card p-4 shadow-sm text-center">
          <p className="text-xs text-muted-foreground">{m.label}</p>
          <p className="mt-2 text-xl font-bold">{m.change}</p>
          <p className="mt-0.5 text-xs font-medium text-emerald-600">↗ {m.period}</p>
        </div>
      ))}
    </div>
  );
}
