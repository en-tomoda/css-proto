"use client";

import { useState } from "react";
import Link from "next/link";

const INITIAL_MISSIONS = [
  { id: 1, label: "今日の問いに答える",    xp: 50, done: false, href: "/chat"    },
  { id: 2, label: "プロフィールを確認する", xp: 20, done: true,  href: "/profile" },
  { id: 3, label: "振り返りを1件読む",     xp: 30, done: false, href: "/review"  },
];

export function DailyMissionsCard() {
  const [missions, setMissions] = useState(INITIAL_MISSIONS);

  const toggle = (id: number) =>
    setMissions((prev) =>
      prev.map((m) => (m.id === id ? { ...m, done: !m.done } : m))
    );

  const earnedXp = missions.filter((m) => m.done).reduce((s, m) => s + m.xp, 0);
  const totalXp  = missions.reduce((s, m) => s + m.xp, 0);
  const completed = missions.filter((m) => m.done).length;

  return (
    <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">今日のミッション</h2>
        <span className="text-xs text-muted-foreground">
          {completed}/{missions.length} 完了 · +{earnedXp} XP
        </span>
      </div>

      <ul className="mt-3 space-y-2">
        {missions.map((m) => (
          <li
            key={m.id}
            className="flex cursor-pointer items-center gap-3 rounded-xl border border-border/70 px-3 py-2.5 transition hover:bg-muted/50"
            onClick={() => toggle(m.id)}
          >
            <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded text-[11px] transition ${
              m.done
                ? "bg-primary text-primary-foreground"
                : "border border-border"
            }`}>
              {m.done ? "✓" : ""}
            </span>
            <span className={`flex-1 text-sm transition ${m.done ? "text-muted-foreground line-through" : ""}`}>
              {m.label}
            </span>
            <span className="text-[11px] font-medium text-muted-foreground">+{m.xp} XP</span>
            {!m.done && (
              <Link
                href={m.href}
                onClick={(e) => e.stopPropagation()}
                className="shrink-0 rounded-md bg-muted px-2 py-0.5 text-[11px] transition hover:bg-primary hover:text-primary-foreground"
              >
                →
              </Link>
            )}
          </li>
        ))}
      </ul>

      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className="h-1.5 rounded-full bg-primary transition-all duration-500"
          style={{ width: `${(earnedXp / totalXp) * 100}%` }}
        />
      </div>
    </div>
  );
}
