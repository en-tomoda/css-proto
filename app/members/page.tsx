"use client";

import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { useApp } from "@/lib/store";
import { RELATIONSHIP_LEVELS, type DisclosureKey, type Member } from "@/lib/data";
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
import { Eye, Hourglass, ChevronRight, Heart } from "lucide-react";
import { toast } from "sonner";

function approvedCount(m: Member) {
  return Object.values(m.disclosure).filter((s) => s === "approved").length;
}

function DisclosureRow({
  member,
  dkey,
  label,
  value,
}: {
  member: Member;
  dkey: DisclosureKey;
  label: string;
  value: React.ReactNode;
}) {
  const { requestDisclosure } = useApp();
  const state = member.disclosure[dkey];

  return (
    <div className="flex items-start justify-between gap-2 rounded-xl border bg-background p-2.5">
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        {state === "approved" ? (
          <div className="mt-0.5 text-sm">{value}</div>
        ) : (
          <p className="mt-0.5 text-sm text-muted-foreground">
            未開示
          </p>
        )}
      </div>
      {state === "locked" && (
        <Button
          size="sm"
          variant="secondary"
          className="shrink-0 rounded-full"
          onClick={(e) => {
            e.preventDefault();
            requestDisclosure(member.id, dkey);
            toast.success(`${member.name}さんに「みたい」を送りました`);
          }}
        >
          <Eye className="size-3.5" />
          みたい
        </Button>
      )}
      {state === "requested" && (
        <Badge variant="secondary" className="shrink-0">
          <Hourglass className="size-3" />
          承認待ち
        </Badge>
      )}
    </div>
  );
}

export default function MembersPage() {
  const { members } = useApp();

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-bold">メンバー</h1>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            目標やアクションは本人の開示承認制です。気になるメンバーには「みたい」を送ってリクエストしましょう。
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {members.map((m) => {
            const unlocked = approvedCount(m);
            const percent = Math.round((unlocked / 3) * 100);
            const rel = RELATIONSHIP_LEVELS[unlocked];
            const currentAction = m.currentActions.find((a) => !a.done);
            return (
              <Card key={m.id} className="transition-shadow hover:shadow-md">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{m.name.slice(0, 1)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <CardTitle className="text-base">{m.name}</CardTitle>
                        <Badge variant="secondary" className="shrink-0">
                          {m.ta.type}
                        </Badge>
                      </div>
                      <CardDescription className="truncate">
                        {m.department} ・ {m.title}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1 font-medium text-muted-foreground">
                        <Heart className="size-3.5 text-chart-1" />
                        関係値：{rel.label}
                      </span>
                      <span className="font-semibold text-foreground">{percent}%</span>
                    </div>
                    <Progress value={percent} className="h-2" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <DisclosureRow
                    member={m}
                    dkey="goal"
                    label="目標"
                    value={<p className="font-medium">{m.goal}</p>}
                  />
                  <DisclosureRow
                    member={m}
                    dkey="pastActions"
                    label="達成したアクション（過去の実績）"
                    value={<p>{m.pastActions.length}件達成 ・ 直近「{m.pastActions[0]?.title}」</p>}
                  />
                  <DisclosureRow
                    member={m}
                    dkey="currentActions"
                    label="現在チャレンジ中のアクション"
                    value={<p>{currentAction ? currentAction.title : "今週分はすべて完了"}</p>}
                  />
                  <Button asChild variant="ghost" size="sm" className="w-full justify-between rounded-full">
                    <Link href={`/members/${m.id}`}>
                      詳細を見る
                      <ChevronRight className="size-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
