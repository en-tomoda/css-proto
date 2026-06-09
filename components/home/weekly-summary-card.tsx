const weekDays = ["月", "火", "水", "木", "金", "土", "日"];
const activity = [true, true, false, true, true, true, false]; // 今週の対話済み日

const stats = [
  { label: "今週の対話",   value: "5",    unit: "回"  },
  { label: "獲得XP",       value: "320",  unit: "XP"  },
  { label: "気づき",       value: "3",    unit: "件"  },
];

export function WeeklySummaryCard() {
  return (
    <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm">
      <p className="text-xs font-semibold text-muted-foreground">今週のサマリー</p>

      {/* 曜日ドット */}
      <div className="mt-3 flex justify-between gap-1">
        {weekDays.map((day, i) => (
          <div key={day} className="flex flex-1 flex-col items-center gap-1">
            <div className={`h-7 w-7 rounded-full flex items-center justify-center text-[10px] font-medium transition ${
              activity[i]
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}>
              {day}
            </div>
          </div>
        ))}
      </div>

      {/* 統計 */}
      <div className="mt-4 grid grid-cols-3 divide-x divide-border/70">
        {stats.map((s) => (
          <div key={s.label} className="px-2 text-center first:pl-0 last:pr-0">
            <p className="text-[10px] text-muted-foreground">{s.label}</p>
            <p className="mt-0.5 text-lg font-bold leading-none">{s.value}</p>
            <p className="text-[10px] text-muted-foreground">{s.unit}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
