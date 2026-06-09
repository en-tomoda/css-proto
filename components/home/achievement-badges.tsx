const badges = [
  { icon: "🔥", label: "127日継続",       earned: true,  hint: ""                },
  { icon: "💬", label: "対話47回",         earned: true,  hint: ""                },
  { icon: "🌟", label: "プロフィール完成", earned: true,  hint: ""                },
  { icon: "🧠", label: "洞察家",           earned: false, hint: "気づきあと5件"    },
  { icon: "🏆", label: "成長記録者",       earned: false, hint: "連続180日で解放" },
];

export function AchievementBadges() {
  return (
    <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm">
      <h2 className="text-sm font-semibold">獲得バッジ</h2>
      <div className="mt-3 flex flex-wrap gap-2">
        {badges.map((b) => (
          <div
            key={b.label}
            title={b.hint || b.label}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs transition ${
              b.earned
                ? "bg-muted text-foreground"
                : "border border-dashed border-border/50 text-muted-foreground/50"
            }`}
          >
            <span>{b.icon}</span>
            <span>{b.label}</span>
            {!b.earned && b.hint && (
              <span className="text-[10px]">({b.hint})</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
