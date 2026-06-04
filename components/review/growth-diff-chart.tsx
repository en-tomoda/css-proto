const metrics = [
  { label: "自己効力感",   before: 45, after: 75, change: "+30" },
  { label: "挑戦意欲",     before: 55, after: 82, change: "+27" },
  { label: "他者貢献",     before: 60, after: 68, change: "+8"  },
  { label: "キャリア意識", before: 50, after: 79, change: "+29" },
];

export function GrowthDiffChart() {
  return (
    <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm">
      <h2 className="text-sm font-semibold">1年間の変化</h2>
      <p className="mt-0.5 text-xs text-muted-foreground">2025年6月 → 2026年6月</p>
      <div className="mt-4 space-y-4">
        {metrics.map((m) => (
          <div key={m.label}>
            <div className="flex items-center justify-between text-xs">
              <span>{m.label}</span>
              <span className="font-semibold text-emerald-600">↗ {m.change}pt</span>
            </div>
            <div className="relative mt-1.5 h-2 rounded-full bg-muted">
              <div className="absolute h-2 rounded-full bg-border" style={{ width: `${m.before}%` }} />
              <div className="absolute h-2 rounded-full bg-primary/70" style={{ width: `${m.after}%` }} />
            </div>
            <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
              <span>1年前: {m.before}</span>
              <span>現在: {m.after}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
