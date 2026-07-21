"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { useApp } from "@/lib/store";
import { DISCLOSURE_LABELS, type DisclosureKey } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Bell,
  BellRing,
  LockKeyhole,
  Lock,
  MessageSquare,
  Gift,
  CircleCheck,
  X,
} from "lucide-react";

/**
 * ヘッダー右上のお知らせベル。全画面共通で、ロールに応じた通知を表示する。
 * - メンバー: 目標変更後のロック確認 / 停滞アクションの深掘り誘導 / 定型のお知らせ
 * - 上司: メンバーが情報を非公開に戻した通知
 */
export function HeaderNotices() {
  const {
    role,
    currentUser,
    managerNotices,
    dismissManagerNotice,
    goalChangePrompt,
    resolveGoalChangePrompt,
  } = useApp();
  const [open, setOpen] = useState(false);

  // 管理者は通知対象がないためベルを出さない
  if (role !== "member" && role !== "manager") return null;

  const stuck = currentUser.currentActions.filter(
    (a) => !a.done && a.carriedWeeks >= 4,
  );
  const approvedKeys = (
    Object.keys(currentUser.disclosure) as DisclosureKey[]
  ).filter((k) => currentUser.disclosure[k] === "approved");

  const count =
    role === "member"
      ? (goalChangePrompt ? 1 : 0) + stuck.length
      : managerNotices.length;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative size-8 text-muted-foreground"
          title="お知らせ"
          aria-label={count > 0 ? `お知らせ ${count}件` : "お知らせ"}
        >
          <Bell className="size-4" />
          {count > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold leading-none text-white">
              {count > 9 ? "9+" : count}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[min(92vw,22rem)] p-0">
        <div className="flex items-center gap-2 border-b px-4 py-3">
          <Bell className="size-4 text-primary" />
          <span className="text-sm font-semibold">お知らせ</span>
          {count > 0 && <Badge className="rounded-full px-2">{count}</Badge>}
        </div>
        <div className="max-h-[70vh] space-y-2 overflow-y-auto p-3">
          {role === "member" ? (
            <>
              {goalChangePrompt && (
                <div className="flex flex-col gap-2 rounded-xl border border-chart-4/60 bg-chart-4/5 p-3">
                  <div className="flex items-start gap-2.5 text-sm">
                    <LockKeyhole className="mt-0.5 size-4 shrink-0" />
                    {approvedKeys.length > 0 ? (
                      <p className="leading-relaxed">
                        目標を更新しました。いま上司に公開している情報（
                        {approvedKeys.map((k) => DISCLOSURE_LABELS[k]).join("・")}
                        ）をいったん非公開にしますか？
                      </p>
                    ) : (
                      <p className="leading-relaxed">
                        目標を更新しました。目標が変わると上司に見せたい情報も変わることがあります。公開状況を確認しておきましょう。
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 pl-6">
                    {approvedKeys.length > 0 ? (
                      <>
                        <Button
                          size="sm"
                          className="rounded-full"
                          onClick={() => {
                            resolveGoalChangePrompt(true);
                            toast.success("公開中の情報を非公開にしました");
                          }}
                        >
                          非公開にする
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-full"
                          onClick={() => resolveGoalChangePrompt(false)}
                        >
                          そのままにする
                        </Button>
                      </>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-full"
                        onClick={() => resolveGoalChangePrompt(false)}
                      >
                        確認しました
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {stuck.map((a) => (
                <div
                  key={a.id}
                  className="flex flex-col gap-2 rounded-xl border border-destructive/30 bg-destructive/5 p-3"
                >
                  <div className="flex items-start gap-2.5 text-sm">
                    <BellRing className="mt-0.5 size-4 shrink-0 text-destructive" />
                    <p className="leading-relaxed">
                      「{a.title}」が{a.carriedWeeks}
                      週間つづいています。進めにくい要因を、AIと一緒に整理してみませんか？
                    </p>
                  </div>
                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="ml-6 self-start rounded-full"
                    onClick={() => setOpen(false)}
                  >
                    <Link href="/chat">
                      <MessageSquare className="size-4" />
                      AIに相談する
                    </Link>
                  </Button>
                </div>
              ))}

              <div className="flex items-center gap-2.5 rounded-xl p-3 text-sm text-muted-foreground">
                <Gift className="size-4 shrink-0" />
                <p className="flex-1">今週のアクションが届きました</p>
                <span className="text-xs">月曜 9:00</span>
              </div>
              <div className="flex items-center gap-2.5 rounded-xl p-3 text-sm text-muted-foreground">
                <CircleCheck className="size-4 shrink-0" />
                <p className="flex-1">先週の振り返りを記録しました</p>
                <span className="text-xs">先週金曜</span>
              </div>
            </>
          ) : managerNotices.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              新しいお知らせはありません
            </p>
          ) : (
            managerNotices.map((n) => (
              <div
                key={n.id}
                className="flex items-start gap-2.5 rounded-lg border p-3"
              >
                <Lock className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <div className="min-w-0 flex-1 text-sm">
                  <p className="leading-relaxed">
                    <span className="font-semibold">{n.memberName}さん</span>
                    が「{DISCLOSURE_LABELS[n.key]}」を非公開に戻しました
                  </p>
                  {n.reason && (
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      理由：{n.reason}
                    </p>
                  )}
                  <p className="mt-0.5 text-xs text-muted-foreground">{n.at}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-6 shrink-0 text-muted-foreground"
                  title="既読にする"
                  onClick={() => dismissManagerNotice(n.id)}
                >
                  <X className="size-3.5" />
                </Button>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
