"use client";

import { useState } from "react";
import { JP_HOLIDAYS_2026, type Reflection } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { ReflectionSummaryDialog } from "@/components/reflection-list";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const DAY_LABELS = ["日", "月", "火", "水", "木", "金", "土"];

const toYmd = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;

const parseYmd = (s: string) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};

export function ReflectionCalendar({ reflections }: { reflections: Reflection[] }) {
  const [selected, setSelected] = useState<Reflection | null>(null);

  // 初期表示は最新の振り返りがある月
  const latest = [...reflections].sort((a, b) =>
    b.weekStart.localeCompare(a.weekStart),
  )[0];
  const [month, setMonth] = useState(() => {
    const base = latest ? parseYmd(latest.weekStart) : new Date();
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });

  // 日付 → その日を含む週の振り返り
  const findReflection = (date: Date): Reflection | undefined =>
    reflections.find((r) => {
      const start = parseYmd(r.weekStart);
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      return date >= start && date <= end;
    });

  // カレンダーグリッド（日曜はじまり）
  const firstOfMonth = new Date(month.getFullYear(), month.getMonth(), 1);
  const gridStart = new Date(firstOfMonth);
  gridStart.setDate(firstOfMonth.getDate() - firstOfMonth.getDay());
  const weeks: Date[][] = [];
  const cursor = new Date(gridStart);
  while (cursor <= new Date(month.getFullYear(), month.getMonth() + 1, 0)) {
    weeks.push(
      Array.from({ length: 7 }, (_, i) => {
        const d = new Date(cursor);
        d.setDate(cursor.getDate() + i);
        return d;
      }),
    );
    cursor.setDate(cursor.getDate() + 7);
  }

  return (
    <div className="space-y-3">
      {/* 月ナビゲーション */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">
          {month.getFullYear()}年{month.getMonth() + 1}月
        </p>
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="icon"
            className="size-7"
            onClick={() =>
              setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))
            }
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-7"
            onClick={() =>
              setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))
            }
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>

      {/* カレンダー本体 */}
      <div className="overflow-hidden rounded-lg border">
        <div className="grid grid-cols-7 border-b bg-muted/40">
          {DAY_LABELS.map((d, i) => (
            <div
              key={d}
              className={cn(
                "py-1.5 text-center text-xs font-medium",
                i === 0 && "text-red-600",
                i === 6 && "text-blue-600",
                i > 0 && i < 6 && "text-muted-foreground",
              )}
            >
              {d}
            </div>
          ))}
        </div>
        {weeks.map((week, wi) => {
          return (
            <div key={wi} className="grid grid-cols-7 border-b last:border-b-0">
              {week.map((date, di) => {
                const ymd = toYmd(date);
                const inMonth = date.getMonth() === month.getMonth();
                const r = findReflection(date);
                const isRecorded = r && ymd === r.recordedAt;
                const holiday = JP_HOLIDAYS_2026[ymd];
                const isSun = di === 0;
                const isSat = di === 6;
                const dayColor =
                  holiday || isSun
                    ? "text-red-600"
                    : isSat
                      ? "text-blue-600"
                      : undefined;
                return (
                  <button
                    key={ymd}
                    type="button"
                    disabled={!r}
                    onClick={() => r && setSelected(r)}
                    title={
                      holiday
                        ? r
                          ? `${holiday}・${r.period}の振り返りを見る`
                          : holiday
                        : r
                          ? `${r.period}の振り返りを見る`
                          : undefined
                    }
                    className={cn(
                      "relative flex h-14 flex-col items-center gap-0.5 pt-1.5 text-sm transition-colors",
                      (holiday || isSat || isSun) && "bg-muted/30",
                      !inMonth && "opacity-40",
                      r && "cursor-pointer bg-primary/10 hover:bg-primary/20",
                      !r && "cursor-default",
                    )}
                  >
                    <span className={dayColor}>{date.getDate()}</span>
                    {holiday && (
                      <span className="max-w-full truncate rounded bg-red-100 px-1 text-[9px] leading-tight text-red-700">
                        {holiday}
                      </span>
                    )}
                    {isRecorded && (
                      <span
                        className={cn(
                          "absolute bottom-1 size-1.5 rounded-full",
                          r.achieved === r.total ? "bg-primary" : "bg-chart-4",
                        )}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* 凡例 */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="inline-block size-3 rounded-[4px] bg-primary/10 ring-1 ring-border" />
          振り返りを記録した週
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block size-1.5 rounded-full bg-primary" />
          全アクション達成
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block size-1.5 rounded-full bg-chart-4" />
          一部達成
        </span>
        <span className="text-muted-foreground/80">
          ドットの日付が振り返りを行った日です
        </span>
      </div>

      <ReflectionSummaryDialog reflection={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
