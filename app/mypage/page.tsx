"use client";

import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { DigitalTwinHero } from "@/components/digital-twin-hero";
import { TaSection } from "@/components/ta-section";
import { ReflectionCalendar } from "@/components/reflection-calendar";
import { CsaTag } from "@/components/csa-tag";
import { useApp } from "@/lib/store";
import {
  CANCEL_REASONS,
  CAREER_PATHS,
  DISCLOSURE_LABELS,
  LOCK_REASONS,
  MANAGER_NAME,
  type DisclosureKey,
  type WeeklyAction,
} from "@/lib/data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Target,
  LockOpen,
  Lock,
  MessageSquare,
  NotebookPen,
  Pencil,
  X,
  History,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function MyPage() {
  const {
    currentUser,
    toggleAction,
    updateGoal,
    cancelAction,
    respondDisclosure,
    relockDisclosure,
    goalChangePrompt,
  } = useApp();

  const [goalDialogOpen, setGoalDialogOpen] = useState(false);
  const [goalDraft, setGoalDraft] = useState("");
  const [pathDraft, setPathDraft] = useState("");
  const [cancelTarget, setCancelTarget] = useState<WeeklyAction | null>(null);
  const [cancelReason, setCancelReason] = useState(CANCEL_REASONS[0]);
  const [cancelNote, setCancelNote] = useState("");
  // 開示/ロックの確認モーダル
  const [approveKey, setApproveKey] = useState<DisclosureKey | null>(null);
  const [lockKey, setLockKey] = useState<DisclosureKey | null>(null);
  const [lockReason, setLockReason] = useState(LOCK_REASONS[0]);

  const actions = currentUser.currentActions;
  const doneCount = actions.filter((a) => a.done).length;
  const stuckActions = actions.filter((a) => !a.done && a.carriedWeeks >= 4);

  const noticeCount = (goalChangePrompt ? 1 : 0) + stuckActions.length;

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-bold">マイキャリア</h1>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            今週の目標とアクションを確認しましょう。
          </p>
        </div>

        {/* 主役: AIから見たあなた（デジタルツイン） */}
        <DigitalTwinHero member={currentUser} noticeCount={noticeCount} />

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="flex flex-col">
            <CardHeader>
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="flex items-center gap-2">
                  <Target className="size-5 text-primary" />
                  いまの目標
                </CardTitle>
                <div className="flex shrink-0 gap-1">
                  <Button asChild variant="ghost" size="sm" className="text-muted-foreground">
                    <Link href="/history">
                      <History className="size-3.5" />
                      変遷
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setGoalDraft(currentUser.goal);
                      setPathDraft(currentUser.careerPath);
                      setGoalDialogOpen(true);
                    }}
                  >
                    <Pencil className="size-3.5" />
                    編集
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-4">
              <div className="flex flex-1 items-center rounded-xl border border-primary/20 bg-primary/5 p-5">
                <p className="text-lg font-bold leading-relaxed text-foreground">
                  {currentUser.goal}
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">目指すキャリア</span>
                <Badge variant="secondary" className="font-normal">
                  {currentUser.careerPath}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                今週のアクション
                <span className="text-sm font-normal text-muted-foreground">
                  {doneCount} / {actions.length} 完了
                </span>
              </CardTitle>
              <CardDescription>
                3件すべて完了すると、来週新しいアクションが提示されます。
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Progress value={(doneCount / actions.length) * 100} />
              {actions.map((a) => (
                <label
                  key={a.id}
                  className={cn(
                    "flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50",
                    a.done && "bg-muted/50",
                  )}
                >
                  <Checkbox
                    checked={a.done}
                    onCheckedChange={() => toggleAction(currentUser.id, a.id)}
                    className="mt-0.5"
                  />
                  <div className="flex-1">
                    <p className={cn("text-sm font-medium", a.done && "text-muted-foreground line-through")}>
                      {a.title}
                    </p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                      {a.carriedWeeks > 1 && !a.done && (
                        <Badge variant="outline" className="text-xs">
                          {a.carriedWeeks}週目・継続中
                        </Badge>
                      )}
                      {a.csaKeys.map((k) => (
                        <CsaTag key={k} name={k} variant="focus" />
                      ))}
                    </div>
                  </div>
                  {!a.done && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7 shrink-0 text-muted-foreground hover:text-destructive"
                      title="このアクションをキャンセル"
                      onClick={(e) => {
                        e.preventDefault();
                        setCancelTarget(a);
                        setCancelReason(CANCEL_REASONS[0]);
                        setCancelNote("");
                      }}
                    >
                      <X className="size-4" />
                    </Button>
                  )}
                </label>
              ))}
              <Button asChild variant="ghost" size="sm" className="w-full rounded-full text-muted-foreground">
                <Link href="/history">
                  <History className="size-4" />
                  アクション履歴を見る
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* 振り返りの記録 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <NotebookPen className="size-4 text-chart-2" />
                振り返りの記録
              </CardTitle>
              <CardDescription>
                記録のある週をクリックすると、AIトークの内容の要約が見られます
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <ReflectionCalendar reflections={currentUser.reflections} />
              <Button asChild variant="ghost" size="sm" className="w-full rounded-full">
                <Link href="/chat">
                  <MessageSquare className="size-4" />
                  今週の振り返りをする
                </Link>
              </Button>
              <Button asChild variant="ghost" size="sm" className="w-full rounded-full">
                <Link href="/history">
                  <History className="size-4" />
                  これまでの軌跡を見る
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* 上司に見せている情報（開示の管理） */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <LockOpen className="size-4 text-chart-4" />
                上司への公開設定
              </CardTitle>
              <CardDescription>
                項目ごとに公開/非公開を切り替えられます。上司には公開した情報だけが見えます。
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {(Object.keys(DISCLOSURE_LABELS) as DisclosureKey[]).map((key) => {
                const published = currentUser.disclosure[key] === "approved";
                return (
                  <div
                    key={key}
                    className="flex items-center justify-between gap-2 rounded-xl border p-3"
                  >
                    <div className="flex min-w-0 items-center gap-2.5">
                      {published ? (
                        <LockOpen className="size-4 shrink-0 text-primary" />
                      ) : (
                        <Lock className="size-4 shrink-0 text-muted-foreground" />
                      )}
                      <span className="truncate text-sm font-medium">
                        {DISCLOSURE_LABELS[key]}
                      </span>
                      <Badge
                        variant={published ? "default" : "outline"}
                        className="shrink-0"
                      >
                        {published ? "公開中" : "非公開"}
                      </Badge>
                    </div>
                    {published ? (
                      <Button
                        size="sm"
                        variant="outline"
                        className="shrink-0 rounded-full"
                        onClick={() => {
                          setLockKey(key);
                          setLockReason(LOCK_REASONS[0]);
                        }}
                      >
                        <Lock className="size-3.5" />
                        非公開にする
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        className="shrink-0 rounded-full"
                        onClick={() => setApproveKey(key)}
                      >
                        <LockOpen className="size-3.5" />
                        公開する
                      </Button>
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        <TaSection member={currentUser} />

        {/* 目標編集ダイアログ */}
        <Dialog open={goalDialogOpen} onOpenChange={setGoalDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>目標を編集</DialogTitle>
              <DialogDescription>
                更新した目標は「目標の変遷」として履歴に記録されます。
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>目標</Label>
                <Textarea
                  rows={3}
                  value={goalDraft}
                  onChange={(e) => setGoalDraft(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>目指すキャリア</Label>
                <Select value={pathDraft} onValueChange={setPathDraft}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CAREER_PATHS.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                disabled={!goalDraft.trim()}
                onClick={() => {
                  updateGoal(goalDraft.trim(), pathDraft);
                  setGoalDialogOpen(false);
                  toast.success("目標を更新しました");
                }}
              >
                保存する
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* アクションキャンセルダイアログ */}
        <Dialog open={!!cancelTarget} onOpenChange={(o) => !o && setCancelTarget(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>アクションをキャンセル</DialogTitle>
              <DialogDescription>
                「{cancelTarget?.title}」を取り下げます。理由を教えていただくと、AIが次の提案に活かします。
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>理由</Label>
                <Select value={cancelReason} onValueChange={setCancelReason}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CANCEL_REASONS.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>詳細（任意）</Label>
                <Textarea
                  rows={3}
                  value={cancelNote}
                  onChange={(e) => setCancelNote(e.target.value)}
                  placeholder="差し支えなければ、状況を教えてください"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCancelTarget(null)}>
                やめる
              </Button>
              <Button
                onClick={() => {
                  if (cancelTarget) {
                    cancelAction(
                      currentUser.id,
                      cancelTarget.id,
                      cancelReason,
                      cancelNote.trim() || undefined,
                    );
                    toast.success("アクションをキャンセルし、代わりの提案を追加しました");
                  }
                  setCancelTarget(null);
                }}
              >
                キャンセルして代わりをもらう
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 開示の確認モーダル */}
        <Dialog open={!!approveKey} onOpenChange={(o) => !o && setApproveKey(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>情報を公開しますか？</DialogTitle>
              <DialogDescription>
                「{approveKey ? DISCLOSURE_LABELS[approveKey] : ""}
                」を公開すると、上司（{MANAGER_NAME}さん）が閲覧できるようになります。公開した情報は、いつでも非公開に戻せます。
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setApproveKey(null)}>
                キャンセル
              </Button>
              <Button
                onClick={() => {
                  if (approveKey) {
                    respondDisclosure(currentUser.id, approveKey, true);
                    toast.success(`「${DISCLOSURE_LABELS[approveKey]}」を公開しました`);
                  }
                  setApproveKey(null);
                }}
              >
                公開する
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* ロックの確認モーダル（理由つき） */}
        <Dialog open={!!lockKey} onOpenChange={(o) => !o && setLockKey(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>情報を非公開に戻しますか？</DialogTitle>
              <DialogDescription>
                「{lockKey ? DISCLOSURE_LABELS[lockKey] : ""}
                」を非公開に戻します。選んだ理由は上司（{MANAGER_NAME}さん）に通知されます。
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2">
              <Label>理由</Label>
              <Select value={lockReason} onValueChange={setLockReason}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LOCK_REASONS.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setLockKey(null)}>
                キャンセル
              </Button>
              <Button
                onClick={() => {
                  if (lockKey) {
                    relockDisclosure(currentUser.id, lockKey, lockReason);
                    toast.success(`「${DISCLOSURE_LABELS[lockKey]}」を非公開にしました`);
                  }
                  setLockKey(null);
                }}
              >
                <Lock className="size-3.5" />
                非公開にする
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppShell>
  );
}
