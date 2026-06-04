const stats = [
  { label: "対話回数", value: "47回"      },
  { label: "連続記録", value: "127日"     },
  { label: "初回対話", value: "2024年4月" },
  { label: "最終更新", value: "今日"      },
];

export function ProfileHeader() {
  return (
    <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-sm">
      <div className="flex items-center gap-5">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
          友
        </div>
        <div>
          <h1 className="text-xl font-semibold">友田 一哉</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">メンバー → チームリーダー（準備中）</p>
          <div className="mt-2 flex items-center gap-1.5">
            <span className="rounded-full bg-muted px-2.5 py-0.5 text-[11px] text-muted-foreground">
              AIが自動生成
            </span>
            <span className="text-[10px] text-muted-foreground">対話から随時更新</span>
          </div>
        </div>
      </div>
      <div className="mt-5 grid grid-cols-4 gap-3 border-t border-border/70 pt-4">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className="mt-1 text-sm font-semibold">{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
