"use client";

import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { Member, TaScale } from "@/lib/data";
import { Sparkles, TriangleAlert, Trophy, MessageCircle, Compass } from "lucide-react";
import { TaLogo } from "@/components/en-logo";



function ScaleBars({ items }: { items: TaScale[] }) {
  return (
    <div className="space-y-3">
      {items.map((s) => (
        <div key={s.label}>
          <div className="mb-1 flex items-center justify-between text-sm">
            <span>{s.label}</span>
            <span className="font-semibold">{s.value}</span>
          </div>
          <Progress value={s.value} className="h-2" />
        </div>
      ))}
    </div>
  );
}

function CognitionScale({
  leftLabel,
  rightLabel,
  leftDesc,
  rightDesc,
  value,
}: {
  leftLabel: string;
  rightLabel: string;
  leftDesc: string;
  rightDesc: string;
  value: number; // 0=左寄り 100=右寄り
}) {
  const rightLeaning = value >= 50;
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-sm font-medium">
        <span className={rightLeaning ? "text-muted-foreground" : "text-foreground"}>
          {leftLabel}
        </span>
        <span className={rightLeaning ? "text-foreground" : "text-muted-foreground"}>
          {rightLabel}
        </span>
      </div>
      <div className="relative h-2.5 rounded-full bg-muted">
        <div className="absolute left-1/2 top-0 h-full w-px bg-border" />
        <div
          className="absolute top-1/2 size-4 -translate-y-1/2 rounded-full border-2 border-background bg-primary shadow"
          style={{ left: `calc(${value}% - 8px)` }}
        />
      </div>
      <div className="mt-1.5 flex justify-between gap-4 text-xs text-muted-foreground">
        <span>{leftDesc}</span>
        <span className="text-right">{rightDesc}</span>
      </div>
    </div>
  );
}

export function TaSection({ member, showHint = false }: { member: Member; showHint?: boolean }) {
  const { ta } = member;
  const topCareers = [...ta.careerTypes].sort((a, b) => b.value - a.value).slice(0, 3);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <CardTitle>自己理解レポート</CardTitle>
          <TaLogo className="h-3 w-auto" />
        </div>
        <CardDescription>
          適性検査の結果をもとに、{showHint ? `${member.name.split(" ")[0]}さんの` : ""}
          特性を可視化しています
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* タイプ（大きく表示） */}
        <div className="rounded-2xl bg-gradient-to-br from-primary/15 via-secondary to-accent/60 p-5 text-center sm:p-6">
          <p className="flex items-center justify-center gap-1.5 text-xs font-medium tracking-wide text-muted-foreground">
            <Compass className="size-3.5" />
            タイプ
          </p>
          <p className="mt-1.5 text-xl font-bold tracking-tight text-primary sm:text-2xl">
            {ta.type}
          </p>
          <p className="mx-auto mt-2.5 max-w-xl text-sm leading-relaxed text-foreground/80">
            {ta.typeDescription}
          </p>
        </div>

        {/* 性格特性レーダー + キャリアタイプ指向性 */}
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <p className="mb-2 text-sm font-semibold">性格特性</p>
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={ta.personality} outerRadius="75%">
                  <PolarGrid />
                  <PolarAngleAxis dataKey="label" tick={{ fontSize: 12 }} />
                  <PolarRadiusAxis domain={[20, 80]} tick={false} axisLine={false} />
                  <Radar
                    dataKey="value"
                    stroke="var(--color-primary)"
                    fill="var(--color-primary)"
                    fillOpacity={0.3}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div>
            <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold">
              <Trophy className="size-4 text-chart-4" />
              キャリアタイプ指向性 TOP3
            </p>
            <div className="space-y-3">
              {topCareers.map((c, i) => (
                <div key={c.label} className="rounded-xl border bg-background p-3">
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 font-medium">
                      <span className="flex size-5 items-center justify-center rounded-full bg-secondary text-[11px] font-bold text-secondary-foreground">
                        {i + 1}
                      </span>
                      {c.label}
                    </span>
                    <span className="font-semibold text-muted-foreground">{c.value}</span>
                  </div>
                  <Progress value={c.value} className="h-2" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* コミュニケーション力 + 創造的思考性・認知特性 */}
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <p className="mb-3 flex items-center gap-1.5 text-sm font-semibold">
              <MessageCircle className="size-4 text-chart-2" />
              コミュニケーション力
            </p>
            <ScaleBars items={ta.communication} />
          </div>
          <div className="space-y-5">
            <div>
              <p className="mb-3 text-sm font-semibold">思考スタイル（創造的思考性）</p>
              <ScaleBars items={ta.creativity} />
            </div>
            <div className="space-y-4 rounded-xl border bg-muted/30 p-4">
              <p className="text-sm font-semibold">認知特性（捉え方・判断）</p>
              <CognitionScale
                leftLabel="事実"
                rightLabel="直観"
                leftDesc="データで捉える"
                rightDesc="ひらめきで捉える"
                value={ta.cognition.perception}
              />
              <CognitionScale
                leftLabel="論理"
                rightLabel="感覚"
                leftDesc="筋道で判断する"
                rightDesc="気持ちで判断する"
                value={ta.cognition.judgement}
              />
            </div>
          </div>
        </div>

        {/* 総合特徴 */}
        <div className="rounded-xl border bg-secondary/40 p-4">
          <p className="mb-1.5 text-sm font-semibold">総合コメント</p>
          <p className="text-sm leading-relaxed text-foreground/80">{ta.summary}</p>
        </div>

        {/* 持ち味とクセ */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold">
              <Sparkles className="size-4 text-chart-2" />
              強み
            </p>
            <div className="flex flex-wrap gap-1.5">
              {ta.strengths.map((s) => (
                <Badge key={s} variant="secondary">
                  {s}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold">
              <TriangleAlert className="size-4 text-chart-1" />
              注意したい傾向
            </p>
            <div className="flex flex-wrap gap-1.5">
              {ta.cautions.map((s) => (
                <Badge key={s} variant="outline">
                  {s}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {showHint && (
          <div className="rounded-xl border bg-background p-4 text-sm">
            <p className="mb-1 font-semibold">接し方のヒント</p>
            <p className="leading-relaxed text-muted-foreground">{ta.communicationHint}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
