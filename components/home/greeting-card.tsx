"use client";

import { useState } from "react";

const moods = [
  { emoji: "😔", label: "辛い"   },
  { emoji: "😕", label: "微妙"   },
  { emoji: "😐", label: "普通"   },
  { emoji: "😊", label: "良い"   },
  { emoji: "😄", label: "最高！" },
];

export function GreetingCard() {
  const [selected, setSelected] = useState(3);

  return (
    <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-sm">
      <p className="text-xs text-muted-foreground">2026年6月3日（火）</p>
      <h1 className="mt-1 text-2xl font-semibold">Kazuyaさん、こんにちは</h1>

      <div className="mt-4">
        <p className="mb-2 text-xs text-muted-foreground">今日の気分は？</p>
        <div className="flex gap-2">
          {moods.map((mood, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`flex flex-1 flex-col items-center rounded-xl py-2.5 transition-all duration-150 ${
                selected === i
                  ? "bg-primary text-primary-foreground scale-105 shadow-sm"
                  : "bg-muted/60 hover:bg-muted"
              }`}
            >
              <span className="text-xl">{mood.emoji}</span>
              <span className="mt-0.5 text-[10px]">{mood.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 flex items-center gap-6 border-t border-border/70 pt-4">
        <div>
          <p className="text-xs text-muted-foreground">連続記録</p>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-lg">🔥</span>
            <p className="text-3xl font-bold tracking-tight">127</p>
            <p className="text-[10px] text-muted-foreground">日</p>
          </div>
        </div>
        <div className="h-10 w-px bg-border" />
        <div>
          <p className="text-xs text-muted-foreground">対話回数</p>
          <div className="mt-1 flex items-baseline gap-1">
            <p className="text-3xl font-bold tracking-tight">47</p>
            <p className="text-[10px] text-muted-foreground">回</p>
          </div>
        </div>
        <div className="h-10 w-px bg-border" />
        <div>
          <p className="text-xs text-muted-foreground">本日の獲得XP</p>
          <div className="mt-1 flex items-baseline gap-1">
            <p className="text-3xl font-bold tracking-tight">20</p>
            <p className="text-[10px] text-muted-foreground">XP</p>
          </div>
        </div>
      </div>
    </div>
  );
}
