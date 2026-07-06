"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { TaSection } from "@/components/ta-section";
import { useApp } from "@/lib/store";
import {
  DISCLOSURE_LABELS,
  RELATIONSHIP_LEVELS,
  type DisclosureKey,
  type Member,
} from "@/lib/data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ArrowLeft,
  Bot,
  CalendarDays,
  CircleCheck,
  Eye,
  Heart,
  Hourglass,
  MessageSquare,
  Target,
  Trophy,
} from "lucide-react";

function approvedCount(m: Member) {
  return Object.values(m.disclosure).filter((s) => s === "approved").length;
}

const HEATMAP_COLORS = [
  "bg-muted",
  "bg-primary/25",
  "bg-primary/55",
  "bg-primary",
];

/** メンバーIDと利用量から決定的に生成する疑似ログイン履歴（直近12週 × 7日） */
function usageLevel(m: Member, week: number, day: number): number {
  const seed = m.id.charCodeAt(1) * 31 + week * 7 + day * 13;
  const noise = Math.abs(Math.sin(seed * 12.9898) * 43758.5453) % 1;
  const activity = Math.min(1, m.usage.loginDays / 55);
  const weekendPenalty = day >= 5 ? 0.45 : 0;
  const v = noise * (0.4 + activity * 0.75) - weekendPenalty;
  return v > 0.72 ? 3 : v > 0.5 ? 2 : v > 0.28 ? 1 : 0;
}

const DAY_LABELS = ["月", "火", "水", "木", "金", "土", "日"];

/** セルの目安サイズ+gap（px）。カード幅から表示できる週数を算出する */
const CELL_UNIT = 20;
const GUTTER_PX = 28;

function UsageHeatmap({ member }: { member: Member }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [weeks, setWeeks] = useState(12);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => {
      const available = el.clientWidth - GUTTER_PX;
      setWeeks(Math.min(52, Math.max(4, Math.floor(available / CELL_UNIT))));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // 今週の月曜を基準に、表示できる週数ぶんの週開始日を古い順に並べる
  const now = new Date();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  const weekStarts = Array.from({ length: weeks }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() - (weeks - 1 - i) * 7);
    return d;
  });
  let prevMonth = -1;
  const monthLabels = weekStarts.map((ws) => {
    const month = ws.getMonth();
    const showLabel = month !== prevMonth;
    prevMonth = month;
    if (!showLabel) return "";
    // 年の表記は1月のみ（例: 2027年1月）
    return month === 0 ? `${ws.getFullYear()}年1月` : `${month + 1}月`;
  });

  return (
    <div ref={containerRef} className="space-y-2">
      <div
        className="grid gap-1"
        style={{
          gridTemplateColumns: `1.75rem repeat(${weeks}, minmax(0, 1fr))`,
        }}
      >
        {/* 上段: 月ラベル（月が変わる週に表示） */}
        <div />
        {monthLabels.map((label, w) => (
          <div
            key={w}
            className="overflow-visible whitespace-nowrap pb-0.5 text-xs text-muted-foreground"
          >
            {label}
          </div>
        ))}
        {/* 各行: 曜日ラベル + 12週分のセル */}
        {DAY_LABELS.map((day, d) => (
          <Fragment key={day}>
            <div className="flex items-center text-xs text-muted-foreground">{day}</div>
            {weekStarts.map((_, w) => (
              <div
                key={w}
                className={`aspect-square w-full rounded-[4px] ${HEATMAP_COLORS[usageLevel(member, w, d)]}`}
              />
            ))}
          </Fragment>
        ))}
      </div>
      <div className="flex items-center justify-end gap-1.5 text-xs text-muted-foreground">
        <span>少ない</span>
        {HEATMAP_COLORS.map((c) => (
          <div key={c} className={`size-3 rounded-[4px] ${c}`} />
        ))}
        <span>多い</span>
      </div>
    </div>
  );
}

function buildAiSummary(m: Member) {
  const parts: string[] = [];
  parts.push(
    `${m.name}さんは${m.department}のメンバーです。TAでは「${m.ta.strengths[0]}」という強みが見られます。`,
  );
  if (m.disclosure.goal === "approved") {
    parts.push(`目標は「${m.goal}」。${m.careerPath}を志向しています。`);
  } else {
    parts.push("目標は未開示のため、TAと活用状況をもとに分析しています。");
  }
  if (m.disclosure.currentActions === "approved") {
    const stuck = m.currentActions.filter((a) => !a.done && a.carriedWeeks >= 4);
    if (stuck.length > 0) {
      parts.push(
        `「${stuck[0].title}」が${stuck[0].carriedWeeks}週間停滞しています。1on1でのフォローが有効かもしれません。`,
      );
    } else {
      parts.push("今週のアクションは順調に進んでいます。");
    }
  }
  if (m.usage.chatPerWeek < 1) {
    parts.push("AIチャットの利用頻度は低めです。アプリの活用について声をかけてみてください。");
  }
  return parts.join(" ");
}

function LockedCard({ member, dkey }: { member: Member; dkey: DisclosureKey }) {
  const { requestDisclosure } = useApp();
  const state = member.disclosure[dkey];
  return (
    <Card className="border-dashed bg-muted/30">
      <CardContent className="flex flex-col items-center gap-3 py-8 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-secondary">
          <Eye className="size-5 text-secondary-foreground" />
        </div>
        <div>
          <p className="font-medium">{DISCLOSURE_LABELS[dkey]}は未開示です</p>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            本人が開示を承認すると、ここに表示されます
          </p>
        </div>
        {state === "locked" ? (
          <Button
            size="sm"
            className="rounded-full"
            onClick={() => {
              requestDisclosure(member.id, dkey);
              toast.success(`${member.name}さんに「みたい」を送りました`);
            }}
          >
            <Eye className="size-4" />
            みたい を送る
          </Button>
        ) : (
          <Badge variant="secondary">
            <Hourglass className="size-3" />
            承認待ち
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}

export default function MemberDetailPage() {
  const params = useParams<{ id: string }>();
  const { members } = useApp();
  const member = members.find((m) => m.id === params.id);

  if (!member) {
    return (
      <AppShell>
        <p className="text-muted-foreground">メンバーが見つかりませんでした。</p>
      </AppShell>
    );
  }

  const unlocked = approvedCount(member);
  const percent = Math.round((unlocked / 3) * 100);
  const rel = RELATIONSHIP_LEVELS[unlocked];

  return (
    <AppShell>
      <div className="space-y-6">
        <Button asChild variant="ghost" size="sm" className="rounded-full">
          <Link href="/members">
            <ArrowLeft className="size-4" />
            メンバー一覧へ
          </Link>
        </Button>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="size-14">
              <AvatarFallback className="text-lg">{member.name.slice(0, 1)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-bold">{member.name}</h1>
                <Badge variant="secondary">{member.ta.type}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {member.kana} ・ {member.department} ・ {member.title}
              </p>
            </div>
          </div>
          <Card className="w-full py-0 sm:w-72">
            <CardContent className="p-4">
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="flex items-center gap-1 font-semibold">
                  <Heart className="size-4 text-chart-1" />
                  関係値：{rel.label}
                </span>
                <span className="font-bold">{percent}%</span>
              </div>
              <Progress value={percent} className="h-2.5" />
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{rel.note}</p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-primary/30 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Bot className="size-5" />
              AIサマリー
            </CardTitle>
            <CardDescription>
              開示されている情報のみをもとに生成しています
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-relaxed">
            <p>{buildAiSummary(member)}</p>
            <div className="rounded-xl border bg-background p-3">
              <p className="mb-1 font-semibold">接し方のヒント</p>
              <p className="text-muted-foreground">{member.ta.communicationHint}</p>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card className="py-0">
            <CardContent className="p-4">
              <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <CalendarDays className="size-4" />
                ログイン日数
              </p>
              <p className="mt-1 text-2xl font-bold">
                {member.usage.loginDays}
                <span className="ml-1 text-sm font-normal text-muted-foreground">日</span>
              </p>
            </CardContent>
          </Card>
          <Card className="py-0">
            <CardContent className="p-4">
              <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <MessageSquare className="size-4" />
                AIチャット利用
              </p>
              <p className="mt-1 text-2xl font-bold">
                {member.usage.chatCount}
                <span className="ml-1 text-sm font-normal text-muted-foreground">
                  回（週{member.usage.chatPerWeek}回）
                </span>
              </p>
            </CardContent>
          </Card>
          <Card className="py-0">
            <CardContent className="p-4">
              <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Trophy className="size-4" />
                アクション達成数
              </p>
              <p className="mt-1 text-2xl font-bold">
                {member.usage.achievedActions}
                <span className="ml-1 text-sm font-normal text-muted-foreground">件</span>
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">アプリの利用状況</CardTitle>
            <CardDescription>直近のログイン・活動状況（1マス＝1日）</CardDescription>
          </CardHeader>
          <CardContent>
            <UsageHeatmap member={member} />
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          {member.disclosure.goal === "approved" ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="size-5 text-primary" />
                  目標
                </CardTitle>
                <CardDescription>目指すキャリア：{member.careerPath}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="font-semibold leading-relaxed">{member.goal}</p>
              </CardContent>
            </Card>
          ) : (
            <LockedCard member={member} dkey="goal" />
          )}

          {member.disclosure.currentActions === "approved" ? (
            <Card>
              <CardHeader>
                <CardTitle>現在チャレンジ中のアクション</CardTitle>
                <CardDescription>今週のアクションの進捗</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {member.currentActions.map((a) => (
                  <div key={a.id} className="flex items-start gap-2.5 rounded-xl border p-2.5">
                    <Checkbox checked={a.done} disabled className="mt-0.5" />
                    <div>
                      <p className="text-sm">{a.title}</p>
                      {a.carriedWeeks >= 4 && !a.done && (
                        <Badge variant="outline" className="mt-1 text-xs">
                          {a.carriedWeeks}週間継続中
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ) : (
            <LockedCard member={member} dkey="currentActions" />
          )}
        </div>

        {member.disclosure.pastActions === "approved" ? (
          <Card>
            <CardHeader>
              <CardTitle>達成したアクション（過去の実績）</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {member.pastActions.map((a) => (
                <div key={a.title} className="flex items-center gap-2.5 rounded-xl border p-2.5">
                  <CircleCheck className="size-4 shrink-0 text-chart-2" />
                  <p className="flex-1 text-sm">{a.title}</p>
                  <span className="text-xs text-muted-foreground">{a.completedAt}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        ) : (
          <LockedCard member={member} dkey="pastActions" />
        )}

        <TaSection member={member} showHint />
      </div>
    </AppShell>
  );
}
