"use client";

import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { useApp } from "@/lib/store";
import { type DisclosureKey, type Member } from "@/lib/data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ChevronRight, Lock } from "lucide-react";

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
  const published = member.disclosure[dkey] === "approved";

  return (
    <div className="flex items-start justify-between gap-2 rounded-xl border bg-background p-2.5">
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        {published ? (
          <div className="mt-0.5 text-sm">{value}</div>
        ) : (
          <p className="mt-0.5 flex items-center gap-1 text-sm text-muted-foreground">
            <Lock className="size-3.5" />
            非公開
          </p>
        )}
      </div>
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
            メンバーが公開した目標やアクションを確認できます。公開範囲は各メンバーが設定します。
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {members.map((m) => {
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
                  <DisclosureRow
                    member={m}
                    dkey="reflections"
                    label="振り返りの要約"
                    value={
                      <p>
                        {m.reflections.length}件の記録 ・ 直近「{m.reflections[0]?.period}」
                      </p>
                    }
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
