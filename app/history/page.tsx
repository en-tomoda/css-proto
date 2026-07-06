"use client";

import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { useApp } from "@/lib/store";
import { ReflectionList } from "@/components/reflection-list";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  CircleCheck,
  CircleX,
  Flag,
  NotebookPen,
  History,
} from "lucide-react";

type ActionEntry = {
  date: string;
  title: string;
  type: "done" | "cancelled";
  reason?: string;
  note?: string;
};

export default function HistoryPage() {
  const { currentUser } = useApp();

  // 達成とキャンセルをまとめて新しい順に
  const actionEntries: ActionEntry[] = [
    ...currentUser.pastActions.map((a) => ({
      date: a.completedAt,
      title: a.title,
      type: "done" as const,
    })),
    ...currentUser.cancelledActions.map((a) => ({
      date: a.cancelledAt,
      title: a.title,
      type: "cancelled" as const,
      reason: a.reason,
      note: a.note,
    })),
  ].sort((a, b) => b.date.localeCompare(a.date));

  const goals = [...currentUser.goalHistory].reverse(); // 新しい順

  return (
    <AppShell>
      <div className="space-y-6">
        <Button asChild variant="ghost" size="sm" className="rounded-full">
          <Link href="/mypage">
            <ArrowLeft className="size-4" />
            マイページへ戻る
          </Link>
        </Button>

        <div>
          <h1 className="flex items-center gap-2 text-xl font-bold">
            <History className="size-5 text-primary" />
            これまでの軌跡
          </h1>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            目標の変遷、取り組んだアクション、振り返りの記録をまとめて確認できます。
          </p>
        </div>

        {/* 目標の変遷 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Flag className="size-4 text-primary" />
              目標の変遷
            </CardTitle>
            <CardDescription>設定・更新した目標の履歴です</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-0">
              {goals.map((g, i) => (
                <div key={g.setAt + g.goal} className="relative flex gap-4 pb-6 last:pb-0">
                  {/* タイムラインの線と点 */}
                  <div className="flex flex-col items-center">
                    <span
                      className={
                        i === 0
                          ? "mt-1 size-3 shrink-0 rounded-full bg-primary"
                          : "mt-1 size-3 shrink-0 rounded-full border-2 border-muted-foreground/40 bg-background"
                      }
                    />
                    {i < goals.length - 1 && (
                      <span className="mt-1 w-px flex-1 bg-border" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1 pb-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs text-muted-foreground">{g.setAt}</span>
                      {i === 0 && <Badge className="px-2 py-0 text-[10px]">現在</Badge>}
                    </div>
                    <p className="mt-1 text-sm font-semibold leading-relaxed">{g.goal}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      目指すキャリア：{g.careerPath}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* アクションの履歴 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CircleCheck className="size-4 text-chart-2" />
              アクションの履歴
            </CardTitle>
            <CardDescription>
              達成したアクションと、キャンセルしたアクション（理由付き）の記録です
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {actionEntries.length === 0 && (
              <p className="text-sm text-muted-foreground">まだ履歴がありません。</p>
            )}
            {actionEntries.map((a) => (
              <div
                key={a.date + a.title}
                className="flex items-start gap-2.5 rounded-lg border p-3"
              >
                {a.type === "done" ? (
                  <CircleCheck className="mt-0.5 size-4 shrink-0 text-chart-2" />
                ) : (
                  <CircleX className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-medium">{a.title}</p>
                    {a.type === "done" ? (
                      <Badge variant="secondary" className="px-2 py-0 text-[10px]">
                        達成
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="px-2 py-0 text-[10px]">
                        キャンセル
                      </Badge>
                    )}
                  </div>
                  {a.type === "cancelled" && (
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      理由：{a.reason}
                      {a.note && <>（{a.note}）</>}
                    </p>
                  )}
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">{a.date}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* 振り返りの履歴 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <NotebookPen className="size-4 text-chart-4" />
              振り返りの履歴
            </CardTitle>
            <CardDescription>クリックすると、AIとのチャット内容の要約が見られます</CardDescription>
          </CardHeader>
          <CardContent>
            <ReflectionList reflections={currentUser.reflections} />
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
