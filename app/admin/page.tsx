"use client";

import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { useApp } from "@/lib/store";
import { CAREER_PATHS, type Account, type Role } from "@/lib/data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Bot,
  Plus,
  Pencil,
  Trash2,
  UserCog,
  Route,
  CirclePause,
  CirclePlay,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ROLE_LABELS: Record<Role, string> = {
  member: "メンバー",
  manager: "上司",
  admin: "管理者",
};

// 役割ごとに識別しやすい色分け
const ROLE_BADGE: Record<Role, string> = {
  member: "border-transparent bg-slate-100 text-slate-700",
  manager: "border-transparent bg-teal-100 text-teal-800",
  admin: "border-transparent bg-indigo-100 text-indigo-800",
};

const STATUS_LABELS: Record<Account["status"], string> = {
  active: "利用中",
  invited: "招待中",
  suspended: "利用停止",
};

const SECTIONS = [
  { id: "accounts", label: "アカウント管理", icon: UserCog },
  { id: "paths", label: "キャリアパス設定", icon: Route },
  { id: "ai", label: "AIカスタマイズ", icon: Bot },
] as const;

type SectionId = (typeof SECTIONS)[number]["id"];

type Confirm = {
  title: string;
  description: string;
  confirmLabel: string;
  destructive?: boolean;
  onConfirm: () => void;
};

const EMPTY_FORM = {
  name: "",
  email: "",
  roles: ["member"] as Role[],
  department: "",
};

export default function AdminPage() {
  const { accounts, setAccounts } = useApp();
  const [section, setSection] = useState<SectionId>("accounts");
  const [paths, setPaths] = useState<string[]>([...CAREER_PATHS]);
  const [newPath, setNewPath] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Account | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [confirm, setConfirm] = useState<Confirm | null>(null);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<Role | "all">("all");
  const [promotionReq, setPromotionReq] = useState(
    "リーダー登用：アクション達成数 50件以上／半期の目標達成率 80%以上／後輩支援の実績\nマネージャー登用：チームリーダー経験1年以上／組織サーベイのスコア基準クリア",
  );

  const PER_PAGE = 20;
  const q = query.trim().toLowerCase();
  const filteredAccounts = accounts.filter((a) => {
    const matchesQuery =
      !q ||
      a.name.toLowerCase().includes(q) ||
      a.email.toLowerCase().includes(q) ||
      a.department.toLowerCase().includes(q);
    const matchesRole = roleFilter === "all" || a.roles.includes(roleFilter);
    return matchesQuery && matchesRole;
  });
  const totalPages = Math.max(1, Math.ceil(filteredAccounts.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const pagedAccounts = filteredAccounts.slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE,
  );

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  };

  const openEdit = (account: Account) => {
    setEditing(account);
    setForm({
      name: account.name,
      email: account.email,
      roles: [...account.roles],
      department: account.department,
    });
    setDialogOpen(true);
  };

  // メンバー/上司は排他（ラジオ）、管理者は独立（チェックボックス）
  const baseRole = form.roles.includes("member")
    ? "member"
    : form.roles.includes("manager")
      ? "manager"
      : "none";
  const isAdmin = form.roles.includes("admin");

  const setBaseRole = (v: string) => {
    setForm((f) => ({
      ...f,
      roles: [
        ...(f.roles.includes("admin") ? (["admin"] as Role[]) : []),
        ...(v === "member" || v === "manager" ? ([v] as Role[]) : []),
      ],
    }));
  };

  const toggleAdmin = () => {
    setForm((f) => ({
      ...f,
      roles: f.roles.includes("admin")
        ? f.roles.filter((r) => r !== "admin")
        : [...f.roles, "admin"],
    }));
  };

  const applySave = () => {
    if (editing) {
      setAccounts(
        accounts.map((a) =>
          a.id === editing.id
            ? { ...a, ...form, department: form.department || "未設定" }
            : a,
        ),
      );
      toast.success(`${form.name}さんのアカウントを更新しました`);
    } else {
      setAccounts([
        ...accounts,
        {
          id: `u${accounts.length + 1}-${form.email}`,
          ...form,
          department: form.department || "未設定",
          status: "invited",
        },
      ]);
      toast.success(`${form.name}さんを招待しました`);
    }
    setForm(EMPTY_FORM);
    setEditing(null);
    setDialogOpen(false);
  };

  const handleSave = () => {
    if (editing) {
      // 更新は重要な操作のため確認を挟む
      setConfirm({
        title: "アカウントを更新しますか？",
        description: `${editing.name}さんの情報を上書きします。`,
        confirmLabel: "更新する",
        onConfirm: applySave,
      });
    } else {
      applySave();
    }
  };

  const suspendAccount = (a: Account) => {
    setConfirm({
      title: "アカウントを利用停止にしますか？",
      description: `${a.name}さんはログインできなくなります。停止後に再開・削除ができます。`,
      confirmLabel: "利用停止にする",
      destructive: true,
      onConfirm: () => {
        setAccounts(
          accounts.map((x) => (x.id === a.id ? { ...x, status: "suspended" } : x)),
        );
        toast.success(`${a.name}さんを利用停止にしました`);
      },
    });
  };

  const reactivateAccount = (a: Account) => {
    setAccounts(accounts.map((x) => (x.id === a.id ? { ...x, status: "active" } : x)));
    toast.success(`${a.name}さんの利用を再開しました`);
  };

  const deleteAccount = (a: Account) => {
    setConfirm({
      title: "アカウントを完全に削除しますか？",
      description: `${a.name}さんのアカウントを削除します。この操作は取り消せません。`,
      confirmLabel: "削除する",
      destructive: true,
      onConfirm: () => {
        setAccounts(accounts.filter((x) => x.id !== a.id));
        toast.success(`${a.name}さんのアカウントを削除しました`);
      },
    });
  };

  const saveAiSettings = () => {
    setConfirm({
      title: "AIカスタマイズを更新しますか？",
      description:
        "昇進要件はAIの目標設定・キャリア相談の回答に反映されます。全ユーザーに影響します。",
      confirmLabel: "更新する",
      onConfirm: () => toast.success("AIカスタマイズ設定を更新しました"),
    });
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-bold">管理者設定</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            ユーザーアカウント・キャリアパス・AIのカスタマイズを管理します。
          </p>
        </div>

        <div className="flex flex-col gap-6 md:flex-row">
          <aside className="shrink-0 md:w-56">
            <nav className="flex gap-1 overflow-x-auto md:flex-col">
              {SECTIONS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSection(s.id)}
                  className={cn(
                    "flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors",
                    section === s.id
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <s.icon className="size-4" />
                  {s.label}
                </button>
              ))}
            </nav>
          </aside>

          <div className="min-w-0 flex-1">
            {section === "accounts" && (
              <Card>
                <CardHeader>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <CardTitle>ユーザーアカウント一覧</CardTitle>
                      <CardDescription>
                        登録・更新・利用停止ができます。削除は利用停止中のアカウントのみ可能です。
                      </CardDescription>
                    </div>
                    <Button size="sm" className="rounded-full" onClick={openAdd}>
                      <Plus className="size-4" />
                      アカウント登録
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center">
                    <div className="relative flex-1">
                      <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        value={query}
                        onChange={(e) => {
                          setQuery(e.target.value);
                          setPage(1);
                        }}
                        placeholder="氏名・メール・部署で検索"
                        className="pl-9"
                      />
                    </div>
                    <Select
                      value={roleFilter}
                      onValueChange={(v) => {
                        setRoleFilter(v as Role | "all");
                        setPage(1);
                      }}
                    >
                      <SelectTrigger className="w-full sm:w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">すべての権限</SelectItem>
                        <SelectItem value="member">メンバー</SelectItem>
                        <SelectItem value="manager">上司</SelectItem>
                        <SelectItem value="admin">管理者</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {pagedAccounts.length === 0 ? (
                    <p className="py-10 text-center text-sm text-muted-foreground">
                      条件に一致するアカウントがありません。
                    </p>
                  ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>氏名</TableHead>
                        <TableHead>部署</TableHead>
                        <TableHead>権限</TableHead>
                        <TableHead>上司</TableHead>
                        <TableHead>状態</TableHead>
                        <TableHead className="w-20" />
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pagedAccounts.map((a) => (
                        <TableRow key={a.id}>
                          <TableCell>
                            <p className="font-medium">{a.name}</p>
                            <p className="text-xs text-muted-foreground">{a.email}</p>
                          </TableCell>
                          <TableCell>{a.department}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {a.roles.map((r) => (
                                <Badge key={r} variant="outline" className={ROLE_BADGE[r]}>
                                  {ROLE_LABELS[r]}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            {a.roles.includes("member") ? (
                              <Select
                                value={a.managerId ?? "none"}
                                onValueChange={(v) => {
                                  setAccounts(
                                    accounts.map((x) =>
                                      x.id === a.id
                                        ? { ...x, managerId: v === "none" ? undefined : v }
                                        : x,
                                    ),
                                  );
                                  toast.success(`${a.name}さんの上司を変更しました`);
                                }}
                              >
                                <SelectTrigger size="sm" className="w-36">
                                  <SelectValue placeholder="未設定" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="none">未設定</SelectItem>
                                  {accounts
                                    .filter(
                                      (x) => x.roles.includes("manager") && x.id !== a.id,
                                    )
                                    .map((mgr) => (
                                      <SelectItem key={mgr.id} value={mgr.id}>
                                        {mgr.name}
                                      </SelectItem>
                                    ))}
                                </SelectContent>
                              </Select>
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={cn(
                                a.status === "suspended" && "text-destructive",
                              )}
                            >
                              {STATUS_LABELS[a.status]}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-0.5">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="size-8 text-muted-foreground"
                                title="更新"
                                onClick={() => openEdit(a)}
                              >
                                <Pencil className="size-4" />
                              </Button>
                              {a.status !== "suspended" ? (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="size-8 text-muted-foreground hover:text-destructive"
                                  title="利用停止"
                                  onClick={() => suspendAccount(a)}
                                >
                                  <CirclePause className="size-4" />
                                </Button>
                              ) : (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="size-8 text-muted-foreground"
                                    title="利用再開"
                                    onClick={() => reactivateAccount(a)}
                                  >
                                    <CirclePlay className="size-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="size-8 text-muted-foreground hover:text-destructive"
                                    title="削除"
                                    onClick={() => deleteAccount(a)}
                                  >
                                    <Trash2 className="size-4" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  )}
                  {totalPages > 1 && (
                    <div className="mt-4 flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">
                        全 {filteredAccounts.length} 件中{" "}
                        {(currentPage - 1) * PER_PAGE + 1}–
                        {Math.min(currentPage * PER_PAGE, filteredAccounts.length)} 件
                      </p>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="icon"
                          className="size-8"
                          disabled={currentPage === 1}
                          onClick={() => setPage(currentPage - 1)}
                        >
                          <ChevronLeft className="size-4" />
                        </Button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                          <Button
                            key={n}
                            variant={n === currentPage ? "default" : "outline"}
                            size="icon"
                            className="size-8"
                            onClick={() => setPage(n)}
                          >
                            {n}
                          </Button>
                        ))}
                        <Button
                          variant="outline"
                          size="icon"
                          className="size-8"
                          disabled={currentPage === totalPages}
                          onClick={() => setPage(currentPage + 1)}
                        >
                          <ChevronRight className="size-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {section === "paths" && (
              <Card>
                <CardHeader>
                  <CardTitle>キャリアパス設定</CardTitle>
                  <CardDescription>
                    ここで設定したキャリアパスが、メンバーの目標設定（初回設定・AIチャット）の選択肢になります。
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {paths.map((p) => (
                    <div key={p} className="flex items-center justify-between rounded-xl border p-3">
                      <span className="text-sm font-medium">{p}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 text-muted-foreground hover:text-destructive"
                        onClick={() => {
                          setPaths(paths.filter((x) => x !== p));
                          toast.success(`キャリアパス「${p}」を削除しました`);
                        }}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  ))}
                  <form
                    className="flex gap-2 pt-2"
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!newPath.trim()) return;
                      setPaths([...paths, newPath.trim()]);
                      toast.success(`キャリアパス「${newPath.trim()}」を追加しました`);
                      setNewPath("");
                    }}
                  >
                    <Input
                      value={newPath}
                      onChange={(e) => setNewPath(e.target.value)}
                      placeholder="新しいキャリアパス名を入力"
                    />
                    <Button type="submit" disabled={!newPath.trim()}>
                      <Plus className="size-4" />
                      追加
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {section === "ai" && (
              <Card>
                <CardHeader>
                  <CardTitle>AIカスタマイズ設定</CardTitle>
                  <CardDescription>
                    チャットで相談を受けるAIに、自社の制度・要件を学習させられます。
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border bg-muted/50 p-4">
                    <div>
                      <p className="text-sm font-semibold">ベース設定</p>
                      <p className="text-sm text-muted-foreground">
                        CSAを元にした「エン標準」が適用されています
                      </p>
                    </div>
                    <Badge>エン標準（CSAベース）</Badge>
                  </div>
                  <div className="space-y-2">
                    <Label>自社標準（昇進要件、自社ルールの設定）</Label>
                    <Textarea
                      rows={6}
                      value={promotionReq}
                      onChange={(e) => setPromotionReq(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      ここに記載した要件は、AIが目標設定・キャリア相談の回答時に参照します。
                    </p>
                  </div>
                  <Button className="rounded-full" onClick={saveAiSettings}>
                    保存する
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* アカウント登録・更新ダイアログ */}
        <Dialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) setEditing(null);
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? "アカウント更新" : "アカウント登録"}</DialogTitle>
              <DialogDescription>
                {editing
                  ? `${editing.name}さんの情報を更新します`
                  : "新しいユーザーを招待します（モックのため実際には送信されません）"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>氏名</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="山田 太郎"
                />
              </div>
              <div className="space-y-2">
                <Label>メールアドレス</Label>
                <Input
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="yamada@example.co.jp"
                />
              </div>
              <div className="space-y-2">
                <Label>役割</Label>
                <div className="space-y-3 rounded-lg border p-3">
                  <RadioGroup
                    value={baseRole}
                    onValueChange={setBaseRole}
                    className="flex flex-wrap gap-4"
                  >
                    <label className="flex cursor-pointer items-center gap-2 text-sm">
                      <RadioGroupItem value="member" />
                      メンバー
                    </label>
                    <label className="flex cursor-pointer items-center gap-2 text-sm">
                      <RadioGroupItem value="manager" />
                      上司
                    </label>
                    <label className="flex cursor-pointer items-center gap-2 text-sm">
                      <RadioGroupItem value="none" />
                      なし（管理者のみ）
                    </label>
                  </RadioGroup>
                  <div className="border-t pt-3">
                    <label className="flex cursor-pointer items-center gap-2 text-sm">
                      <Checkbox checked={isAdmin} onCheckedChange={toggleAdmin} />
                      管理者権限を付与する
                    </label>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  メンバーと上司は兼任できません。管理者権限はどの役割にも追加できます
                </p>
              </div>
              <div className="space-y-2">
                <Label>部署</Label>
                <Input
                  value={form.department}
                  onChange={(e) => setForm({ ...form, department: e.target.value })}
                  placeholder="営業第一部"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={handleSave}
                disabled={!form.name || !form.email || form.roles.length === 0}
              >
                {editing ? "更新する" : "登録する"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 重要操作の確認モーダル */}
        <Dialog open={!!confirm} onOpenChange={(o) => !o && setConfirm(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{confirm?.title}</DialogTitle>
              <DialogDescription>{confirm?.description}</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setConfirm(null)}>
                キャンセル
              </Button>
              <Button
                variant={confirm?.destructive ? "destructive" : "default"}
                onClick={() => {
                  confirm?.onConfirm();
                  setConfirm(null);
                }}
              >
                {confirm?.confirmLabel}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppShell>
  );
}
