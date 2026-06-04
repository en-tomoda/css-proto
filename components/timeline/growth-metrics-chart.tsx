const metrics = [
  { label: "学習意欲",     value: 85 },
  { label: "挑戦意欲",     value: 82 },
  { label: "キャリア意識", value: 79 },
  { label: "自己効力感",   value: 75 },
  { label: "他者貢献",     value: 68 },
];

export function GrowthMetricsChart() {
  return (
    <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm">
      <h2 className="text-sm font-semibold">成長指標の現在地</h2>
      <p className="mt-0.5 text-xs text-muted-foreground">47回の対話から分析</p>
      <div className="mt-4 space-y-3">
        {metrics.map((m) => (
          <div key={m.label}>
            <div className="flex items-center justify-between text-xs">
              <span>{m.label}</span>
              <span className="font-medium">{m.value}</span>
            </div>
            <div className="mt-1.5 h-2 rounded-full bg-muted">
              <div
                className="h-2 rounded-full bg-primary transition-all"
                style={{ width: `${m.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
