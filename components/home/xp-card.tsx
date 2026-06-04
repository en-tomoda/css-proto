const LEVEL      = 12;
const TITLE      = "内省者";
const CURRENT_XP = 2840;
const NEXT_XP    = 3000;
const PROGRESS   = (CURRENT_XP / NEXT_XP) * 100;

export function XpCard() {
  return (
    <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground">
          {LEVEL}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold">Lv.{LEVEL} · {TITLE}</p>
          <p className="text-xs text-muted-foreground">
            {CURRENT_XP.toLocaleString()} / {NEXT_XP.toLocaleString()} XP
          </p>
        </div>
      </div>
      <div className="mt-4">
        <div className="h-2 overflow-hidden rounded-full bg-muted">
          <div
            className="h-2 rounded-full bg-primary transition-all duration-700"
            style={{ width: `${PROGRESS}%` }}
          />
        </div>
        <p className="mt-1.5 text-right text-xs text-muted-foreground">
          あと {NEXT_XP - CURRENT_XP} XP でレベルアップ
        </p>
      </div>
    </div>
  );
}
