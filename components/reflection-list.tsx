"use client";

import { useState } from "react";
import type { Reflection } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChevronRight, MessageSquare, Lightbulb, Footprints, Bot } from "lucide-react";

function SummarySection({
  icon: Icon,
  title,
  items,
}: {
  icon: typeof MessageSquare;
  title: string;
  items: string[];
}) {
  return (
    <div>
      <p className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold">
        <Icon className="size-4 text-primary" />
        {title}
      </p>
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item} className="flex gap-2 text-sm leading-relaxed text-foreground/80">
            <span className="mt-2 size-1 shrink-0 rounded-full bg-muted-foreground/60" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ReflectionList({ reflections }: { reflections: Reflection[] }) {
  const [selected, setSelected] = useState<Reflection | null>(null);

  return (
    <>
      <div className="space-y-3">
        {reflections.map((r) => (
          <button
            key={r.period}
            type="button"
            onClick={() => setSelected(r)}
            className="w-full rounded-lg border p-3 text-left transition-colors hover:bg-muted/50"
          >
            <div className="mb-1 flex items-center justify-between gap-2">
              <span className="text-sm font-semibold">{r.period}</span>
              <span className="flex shrink-0 items-center gap-1.5">
                <Badge
                  variant={r.achieved === r.total ? "default" : "secondary"}
                  className="rounded-full"
                >
                  {r.achieved}/{r.total} 達成
                </Badge>
                <ChevronRight className="size-4 text-muted-foreground" />
              </span>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">{r.note}</p>
          </button>
        ))}
      </div>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bot className="size-4 text-primary" />
              {selected?.period} の振り返り
            </DialogTitle>
            <DialogDescription>
              AIチャットで行った振り返りの要約です（アクション {selected?.achieved}/
              {selected?.total} 達成）
            </DialogDescription>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <SummarySection
                icon={MessageSquare}
                title="話したこと"
                items={selected.chatSummary.talked}
              />
              <SummarySection
                icon={Lightbulb}
                title="気づいたこと"
                items={selected.chatSummary.insights}
              />
              <SummarySection
                icon={Footprints}
                title="次の一歩"
                items={selected.chatSummary.nextSteps}
              />
              <div className="rounded-lg border bg-muted/40 p-3">
                <p className="mb-1 text-xs font-semibold text-muted-foreground">
                  ひとことメモ
                </p>
                <p className="text-sm leading-relaxed">{selected.note}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
