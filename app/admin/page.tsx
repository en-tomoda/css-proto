"use client";

import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { useApp } from "@/lib/store";
import {
  CAREER_PATHS,
  CSA_ITEMS,
  CSA_MINDSET_COUNT,
  DEFAULT_COMPANY_ITEMS,
  GROWTH_SUPPORT_LEVELS,
  RATINGS,
  getAccountProfile,
  growthSupportLevel,
  type Account,
  type AccountStatus,
  type CsaItem,
  type Rating,
  type Role,
} from "@/lib/data";
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
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
  ChevronDown,
  Search,
  SlidersHorizontal,
  Target,
  Activity,
  Sprout,
  Star,
  CircleCheckBig,
  CalendarDays,
  MessageSquare,
  Info,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
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

// 5段階評価の配色
const RATING_STYLE: Record<Rating, string> = {
  S: "border-transparent bg-amber-100 text-amber-800",
  A: "border-transparent bg-teal-100 text-teal-800",
  B: "border-transparent bg-sky-100 text-sky-800",
  C: "border-transparent bg-orange-100 text-orange-800",
  D: "border-transparent bg-rose-100 text-rose-700",
};

const NONE_RATING = "none";

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

// 一覧のソート対象
type SortKey = "usage" | "growth" | "rating";

// 組み合わせソートの1条件（クリック順が優先度になる）
type SortCriterion = { key: SortKey; dir: "asc" | "desc" };

const SORT_LABELS: Record<SortKey, string> = {
  usage: "利用状況",
  growth: "成長支援度",
  rating: "直近の評価",
};

const NONE_FILTER = "all";
const NO_MANAGER = "none";
const NONE_VALUE = "none";

// 評価の並び順（S が最上位）
const RATING_ORDER: Record<Rating, number> = { S: 5, A: 4, B: 3, C: 2, D: 1 };

// 成長支援度の色分け（75以上=良好/緑、25以下=これから/やや薄め、それ以外=通常）
const growthSupportColor = (value: number) =>
  value >= 75
    ? "text-emerald-600"
    : value <= 25
      ? "text-muted-foreground"
      : "text-foreground";

export default function AdminPage() {
  const { accounts, setAccounts } = useApp();
  const [section, setSection] = useState<SectionId>("accounts");
  const [paths, setPaths] = useState<string[]>([...CAREER_PATHS]);
  const [newPath, setNewPath] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [confirm, setConfirm] = useState<Confirm | null>(null);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [detailTab, setDetailTab] = useState<"profile" | "edit">("profile");
  const [editForm, setEditForm] = useState(EMPTY_FORM);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<Role | "all">("all");
  // 組み合わせソート（AND）。配列の順番＝優先度
  const [sorts, setSorts] = useState<SortCriterion[]>([]);
  // 詳細検索モーダルと、その絞り込み条件
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [deptFilter, setDeptFilter] = useState<string>(NONE_FILTER);
  const [statusFilter, setStatusFilter] = useState<AccountStatus | "all">(NONE_FILTER);
  const [managerFilter, setManagerFilter] = useState<string>(NONE_FILTER);
  const [careerFilter, setCareerFilter] = useState<string>(NONE_FILTER);
  const [ratingFilter, setRatingFilter] = useState<string>(NONE_FILTER);
  const [growthFilter, setGrowthFilter] = useState<string>(NONE_FILTER);
  // アカウント一覧の編集モード（オフ時はラベル表示、オン時にプルダウン等が編集可能）
  const [accountsEditMode, setAccountsEditMode] = useState(false);
  // AIカスタマイズ: 参照する項目が1つでもあれば、そのベースを利用中とみなす
  const [companyItems, setCompanyItems] = useState<CsaItem[]>([
    ...DEFAULT_COMPANY_ITEMS,
  ]);
  // アコーディオンの開閉
  const [csaOpen, setCsaOpen] = useState(false);
  const [companyOpen, setCompanyOpen] = useState(false);
  // AIが参照する項目（チェックが入っているもの＝活性）。初期は全項目オン
  const [csaEnabled, setCsaEnabled] = useState<string[]>(
    CSA_ITEMS.map((i) => i.name),
  );
  const [companyEnabled, setCompanyEnabled] = useState<string[]>(
    DEFAULT_COMPANY_ITEMS.map((i) => i.name),
  );
  const [newItemName, setNewItemName] = useState("");
  const [newItemDef, setNewItemDef] = useState("");

  const PER_PAGE = 20;
  const q = query.trim().toLowerCase();

  // 詳細検索の選択肢（アカウントから動的に生成）
  const departments = Array.from(new Set(accounts.map((a) => a.department))).sort();
  const managerAccounts = accounts.filter((a) => a.roles.includes("manager"));

  // 詳細検索で有効になっている条件の数（ボタンのバッジ表示用）
  const advancedFilterCount = [
    deptFilter,
    statusFilter,
    managerFilter,
    careerFilter,
    ratingFilter,
    growthFilter,
  ].filter((v) => v !== NONE_FILTER).length;

  const filteredAccounts = accounts.filter((a) => {
    const p = getAccountProfile(a);
    const matchesQuery =
      !q ||
      a.name.toLowerCase().includes(q) ||
      a.email.toLowerCase().includes(q) ||
      a.department.toLowerCase().includes(q);
    const matchesRole = roleFilter === NONE_FILTER || a.roles.includes(roleFilter);
    const matchesDept = deptFilter === NONE_FILTER || a.department === deptFilter;
    const matchesStatus = statusFilter === NONE_FILTER || a.status === statusFilter;
    const matchesManager =
      managerFilter === NONE_FILTER ||
      (managerFilter === NO_MANAGER ? !a.managerId : a.managerId === managerFilter);
    const matchesCareer = careerFilter === NONE_FILTER || p.careerPath === careerFilter;
    const matchesRating =
      ratingFilter === NONE_FILTER ||
      (ratingFilter === NONE_VALUE ? !a.rating : a.rating === ratingFilter);
    const matchesGrowth =
      growthFilter === NONE_FILTER ||
      (growthFilter === NONE_VALUE
        ? p.growthSupport === undefined
        : p.growthSupport !== undefined &&
          growthSupportLevel(p.growthSupport).label === growthFilter);
    return (
      matchesQuery &&
      matchesRole &&
      matchesDept &&
      matchesStatus &&
      matchesManager &&
      matchesCareer &&
      matchesRating &&
      matchesGrowth
    );
  });

  const getSortValue = (a: Account, key: SortKey): number | null => {
    const p = getAccountProfile(a);
    switch (key) {
      case "usage":
        return p.achievedActions ?? null;
      case "growth":
        return p.growthSupport ?? null;
      case "rating":
        return a.rating ? RATING_ORDER[a.rating] : null;
    }
  };

  // 組み合わせソート: 優先度順に比較し、最初に差がついた条件で並べる。
  // データ無し（—）は方向に関わらず常に末尾へ。
  const sortedAccounts = sorts.length
    ? [...filteredAccounts].sort((a, b) => {
        for (const { key, dir } of sorts) {
          const va = getSortValue(a, key);
          const vb = getSortValue(b, key);
          if (va === null && vb === null) continue;
          if (va === null) return 1;
          if (vb === null) return -1;
          if (va !== vb) return dir === "asc" ? va - vb : vb - va;
        }
        return 0;
      })
    : filteredAccounts;

  // 列ヘッダーのクリックで 降順→昇順→解除 の3状態を切り替える。
  // 未選択の列を押すと、優先度の末尾に追加される。
  const toggleSort = (key: SortKey) => {
    setSorts((prev) => {
      const cur = prev.find((s) => s.key === key);
      if (!cur) return [...prev, { key, dir: "desc" }];
      if (cur.dir === "desc")
        return prev.map((s) => (s.key === key ? { ...s, dir: "asc" } : s));
      return prev.filter((s) => s.key !== key);
    });
    setPage(1);
  };

  const clearAdvancedFilters = () => {
    setDeptFilter(NONE_FILTER);
    setStatusFilter(NONE_FILTER);
    setManagerFilter(NONE_FILTER);
    setCareerFilter(NONE_FILTER);
    setRatingFilter(NONE_FILTER);
    setGrowthFilter(NONE_FILTER);
    setPage(1);
  };

  const totalPages = Math.max(1, Math.ceil(sortedAccounts.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const pagedAccounts = sortedAccounts.slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE,
  );

  const openAdd = () => {
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  };

  const addAccount = () => {
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
    setForm(EMPTY_FORM);
    setDialogOpen(false);
  };

  // 詳細モーダルの「アカウント更新」タブからの保存（重要操作のため確認を挟む）
  const saveDetailEdit = () => {
    if (!detailAccount) return;
    const target = detailAccount;
    setConfirm({
      title: "アカウントを更新しますか？",
      description: `${target.name}さんの情報を上書きします。`,
      confirmLabel: "更新する",
      onConfirm: () => {
        setAccounts(
          accounts.map((a) =>
            a.id === target.id
              ? {
                  ...a,
                  name: editForm.name,
                  email: editForm.email,
                  roles: editForm.roles,
                  department: editForm.department || "未設定",
                }
              : a,
          ),
        );
        toast.success(`${editForm.name}さんのアカウントを更新しました`);
        setDetailTab("profile");
      },
    });
  };

  // 登録・更新フォームの入力欄（登録ダイアログと詳細モーダルで共用）
  const renderAccountFields = (
    value: typeof EMPTY_FORM,
    onChange: (updater: (prev: typeof EMPTY_FORM) => typeof EMPTY_FORM) => void,
  ) => {
    // メンバー/上司は排他（ラジオ）、管理者は独立（チェックボックス）
    const baseRole = value.roles.includes("member")
      ? "member"
      : value.roles.includes("manager")
        ? "manager"
        : "none";
    const isAdmin = value.roles.includes("admin");
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>氏名</Label>
          <Input
            value={value.name}
            onChange={(e) => onChange((f) => ({ ...f, name: e.target.value }))}
            placeholder="山田 太郎"
          />
        </div>
        <div className="space-y-2">
          <Label>メールアドレス</Label>
          <Input
            value={value.email}
            onChange={(e) => onChange((f) => ({ ...f, email: e.target.value }))}
            placeholder="yamada@example.co.jp"
          />
        </div>
        <div className="space-y-2">
          <Label>役割</Label>
          <div className="space-y-3 rounded-lg border p-3">
            <RadioGroup
              value={baseRole}
              onValueChange={(v) =>
                onChange((f) => ({
                  ...f,
                  roles: [
                    ...(f.roles.includes("admin") ? (["admin"] as Role[]) : []),
                    ...(v === "member" || v === "manager" ? ([v] as Role[]) : []),
                  ],
                }))
              }
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
                <Checkbox
                  checked={isAdmin}
                  onCheckedChange={() =>
                    onChange((f) => ({
                      ...f,
                      roles: f.roles.includes("admin")
                        ? f.roles.filter((r) => r !== "admin")
                        : [...f.roles, "admin"],
                    }))
                  }
                />
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
            value={value.department}
            onChange={(e) => onChange((f) => ({ ...f, department: e.target.value }))}
            placeholder="営業第一部"
          />
        </div>
      </div>
    );
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

  const setRating = (a: Account, value: string) => {
    const rating = value === NONE_RATING ? undefined : (value as Rating);
    setAccounts(
      accounts.map((x) => (x.id === a.id ? { ...x, rating } : x)),
    );
    toast.success(
      rating
        ? `${a.name}さんの評価を「${rating}」に設定しました`
        : `${a.name}さんの評価を未評価に戻しました`,
    );
  };

  const detailAccount = detailId
    ? accounts.find((x) => x.id === detailId) ?? null
    : null;
  const detailProfile = detailAccount ? getAccountProfile(detailAccount) : null;
  const detailIndex = detailAccount
    ? sortedAccounts.findIndex((x) => x.id === detailAccount.id)
    : -1;

  const openDetail = (id: string, tab: "profile" | "edit" = "profile") => {
    const acc = accounts.find((x) => x.id === id);
    if (!acc) return;
    setDetailId(id);
    setDetailTab(tab);
    setEditForm({
      name: acc.name,
      email: acc.email,
      roles: [...acc.roles],
      department: acc.department,
    });
  };

  const gotoDetail = (dir: -1 | 1) => {
    const next = sortedAccounts[detailIndex + dir];
    if (next) openDetail(next.id, detailTab);
  };

  const sortIndicator = (key: SortKey) => {
    const idx = sorts.findIndex((s) => s.key === key);
    if (idx === -1)
      return <ArrowUpDown className="size-3.5 text-muted-foreground/60" />;
    const { dir } = sorts[idx];
    return (
      <span className="inline-flex items-center gap-0.5 text-primary">
        {dir === "asc" ? (
          <ArrowUp className="size-3.5" />
        ) : (
          <ArrowDown className="size-3.5" />
        )}
        {/* 複数条件のときは優先度番号を表示 */}
        {sorts.length > 1 && (
          <span className="flex size-3.5 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
            {idx + 1}
          </span>
        )}
      </span>
    );
  };

  const sortButton = (label: string, key: SortKey, className?: string) => (
    <button
      type="button"
      onClick={() => toggleSort(key)}
      className={cn(
        "inline-flex items-center gap-1 whitespace-nowrap transition-colors select-none hover:text-foreground",
        sorts.some((s) => s.key === key) && "text-foreground",
        className,
      )}
    >
      {label}
      {sortIndicator(key)}
    </button>
  );

  const renderRatingSelect = (a: Account, editable = true, width = "w-24") => {
    if (!editable) {
      return a.rating ? (
        <Badge variant="outline" className={RATING_STYLE[a.rating]}>
          {a.rating}
        </Badge>
      ) : (
        <span className="text-sm text-muted-foreground">未評価</span>
      );
    }
    return (
      <Select value={a.rating ?? NONE_RATING} onValueChange={(v) => setRating(a, v)}>
        <SelectTrigger size="sm" className={width}>
          <SelectValue placeholder="未評価" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={NONE_RATING}>未評価</SelectItem>
          {RATINGS.map((r) => (
            <SelectItem key={r} value={r}>
              {r}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
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
    const csaOn = csaEnabled.length > 0;
    const companyOn = companyEnabled.length > 0;
    if (!csaOn && !companyOn) {
      toast.error("CSA標準・自社設定のどちらかで、参照する項目を選択してください");
      return;
    }
    const base =
      csaOn && companyOn
        ? "自社設定を優先しつつCSA標準を補完に使う設定"
        : companyOn
          ? "自社設定"
          : "CSA標準";
    setConfirm({
      title: "AIカスタマイズを更新しますか？",
      description: `AIの評価・指針のベースを「${base}」に更新します。全ユーザーの目標設定・キャリア相談に影響します。`,
      confirmLabel: "更新する",
      onConfirm: () => toast.success("AIカスタマイズ設定を更新しました"),
    });
  };

  const addCompanyItem = () => {
    if (!newItemName.trim() || !newItemDef.trim()) return;
    const name = newItemName.trim();
    setCompanyItems((prev) => [...prev, { name, definition: newItemDef.trim() }]);
    setCompanyEnabled((prev) => [...prev, name]);
    setNewItemName("");
    setNewItemDef("");
    toast.success(`自社設定に「${name}」を追加しました`);
  };

  const removeCompanyItem = (index: number, name: string) => {
    setCompanyItems((prev) => prev.filter((_, idx) => idx !== index));
    setCompanyEnabled((prev) => prev.filter((n) => n !== name));
    toast.success(`「${name}」を削除しました`);
  };

  // 項目ごとの活性/非活性トグル
  const toggleCsaItem = (name: string) =>
    setCsaEnabled((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name],
    );
  const toggleCompanyItem = (name: string) =>
    setCompanyEnabled((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name],
    );

  const csaAllOn = csaEnabled.length === CSA_ITEMS.length;
  const companyAllOn =
    companyItems.length > 0 && companyEnabled.length === companyItems.length;

  return (
    <AppShell wide>
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
                      <CardTitle>アカウント一覧</CardTitle>
                      <CardDescription>
                        「編集」をONにすると、上司・評価・状態を変更できます。
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant={accountsEditMode ? "default" : "outline"}
                        className="rounded-full"
                        onClick={() => setAccountsEditMode((v) => !v)}
                      >
                        <Pencil className="size-4" />
                        {accountsEditMode ? "編集を終了" : "編集"}
                      </Button>
                      <Button size="sm" className="rounded-full" onClick={openAdd}>
                        <Plus className="size-4" />
                        アカウント登録
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center">
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
                    <Button
                      variant="outline"
                      className="w-full shrink-0 sm:w-auto"
                      onClick={() => setSearchModalOpen(true)}
                    >
                      <SlidersHorizontal className="size-4" />
                      詳細検索
                      {advancedFilterCount > 0 && (
                        <Badge className="ml-1 rounded-full px-1.5">
                          {advancedFilterCount}
                        </Badge>
                      )}
                    </Button>
                  </div>

                  {/* 絞り込み・並び替えの状況バー。常時描画して高さを確保し、
                      ソート切替時にテーブルが上下しない（レイアウトシフト防止）。 */}
                  <div className="mb-4 flex min-h-7 flex-wrap items-center gap-x-3 gap-y-1.5 text-xs">
                      {advancedFilterCount > 0 && (
                        <span className="flex items-center gap-1.5">
                          <span className="text-muted-foreground">
                            絞り込み {advancedFilterCount} 件
                          </span>
                          <button
                            type="button"
                            onClick={clearAdvancedFilters}
                            className="rounded-full px-2 py-0.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                          >
                            クリア
                          </button>
                        </span>
                      )}
                      {sorts.length > 0 && (
                        <span className="flex items-center gap-1.5">
                          <span className="text-muted-foreground">
                            並び替え：
                            {sorts
                              .map(
                                (s, i) =>
                                  `${i + 1}. ${SORT_LABELS[s.key]}（${s.dir === "asc" ? "昇順" : "降順"}）`,
                              )
                              .join(" → ")}
                          </span>
                          <button
                            type="button"
                            onClick={() => setSorts([])}
                            className="rounded-full px-2 py-0.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                          >
                            並び替えクリア
                          </button>
                        </span>
                      )}
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
                        <TableHead>キャリア希望</TableHead>
                        <TableHead className="text-center">
                          <div className="inline-flex items-center gap-1">
                            {sortButton("利用状況", "usage")}
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="cursor-help">
                                  <Info className="size-3.5 text-muted-foreground" />
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>アクション達成数です</TooltipContent>
                            </Tooltip>
                          </div>
                        </TableHead>
                        <TableHead className="text-center">
                          <div className="inline-flex items-center gap-1">
                            {sortButton("成長支援度", "growth")}
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="cursor-help">
                                  <Info className="size-3.5 text-muted-foreground" />
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                上司が成長をどれだけ支援できているかの度合い（5段階）
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        </TableHead>
                        <TableHead className="text-center">
                          {sortButton("直近の評価", "rating")}
                        </TableHead>
                        <TableHead>状態</TableHead>
                        {accountsEditMode && <TableHead className="w-24">操作</TableHead>}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pagedAccounts.map((a) => {
                        const profile = getAccountProfile(a);
                        return (
                        <TableRow key={a.id}>
                          <TableCell className="p-0">
                            <button
                              type="button"
                              onClick={() => openDetail(a.id)}
                              className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left transition-colors hover:bg-muted/60"
                            >
                              <Avatar>
                                <AvatarImage src={a.avatarUrl} alt={a.name} />
                                <AvatarFallback>{a.name.slice(0, 1)}</AvatarFallback>
                              </Avatar>
                              <span className="min-w-0">
                                <span className="block truncate font-medium">{a.name}</span>
                                <span className="block truncate text-xs text-muted-foreground">
                                  {a.email}
                                </span>
                              </span>
                            </button>
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
                            {!(a.roles.includes("member") || a.roles.includes("manager")) ? (
                              <span className="text-muted-foreground">—</span>
                            ) : accountsEditMode ? (
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
                              <span className="text-sm">
                                {accounts.find((x) => x.id === a.managerId)?.name ?? (
                                  <span className="text-muted-foreground">未設定</span>
                                )}
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            {profile.careerPath ? (
                              <span
                                className="block max-w-[13rem] truncate text-sm"
                                title={profile.careerPath}
                              >
                                {profile.careerPath}
                              </span>
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </TableCell>
                          <TableCell className="text-center tabular-nums">
                            {profile.achievedActions !== undefined ? (
                              profile.achievedActions
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            {profile.growthSupport !== undefined ? (
                              <span
                                className={cn(
                                  "text-sm font-medium",
                                  growthSupportColor(profile.growthSupport),
                                )}
                              >
                                {growthSupportLevel(profile.growthSupport).label}
                              </span>
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex justify-center">
                              {renderRatingSelect(a, accountsEditMode)}
                            </div>
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
                          {accountsEditMode && (
                          <TableCell>
                            <div className="flex gap-0.5">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="size-8 text-muted-foreground"
                                title="更新"
                                onClick={() => openDetail(a.id, "edit")}
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
                          )}
                        </TableRow>
                        );
                      })}
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
                    ここで設定したキャリアパスが、メンバーの目標設定（初回設定・AIトーク）の選択肢になります。
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
                  <p className="text-sm text-muted-foreground">
                    AIが目標設定・キャリア相談で参照する評価・指針のベースを選びます。
                  </p>

                  {/* CSA標準（アコーディオン） */}
                  <div className="rounded-xl border p-4">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={csaEnabled.length > 0}
                        onCheckedChange={(v) =>
                          setCsaEnabled(v ? CSA_ITEMS.map((i) => i.name) : [])
                        }
                        className="mt-0.5"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold">CSA標準（エン標準）</p>
                        <p className="mt-0.5 text-sm text-muted-foreground">
                          CSAの{CSA_ITEMS.length}項目のうち、AIが参照する項目を選べます（現在 {csaEnabled.length}/{CSA_ITEMS.length} 項目）。
                        </p>
                        <button
                          type="button"
                          className="mt-1 inline-flex items-center gap-1 text-sm text-primary transition-colors hover:text-primary/80"
                          onClick={() => setCsaOpen((o) => !o)}
                        >
                          詳細を見る
                          <ChevronDown
                            className={cn(
                              "size-3.5 transition-transform",
                              csaOpen && "rotate-180",
                            )}
                          />
                        </button>
                      </div>
                    </div>

                    <div
                      className={cn(
                        "grid transition-[grid-template-rows] duration-300 ease-out",
                        csaOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                      )}
                    >
                      <div className="overflow-hidden" inert={!csaOpen}>
                        <div className="mt-3 border-t pt-3">
                        <div className="mb-2 flex items-center justify-between gap-2">
                          <span className="text-xs text-muted-foreground">
                            {csaEnabled.length} / {CSA_ITEMS.length} 項目を利用中
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="rounded-full text-muted-foreground"
                            onClick={() =>
                              setCsaEnabled(
                                csaAllOn ? [] : CSA_ITEMS.map((i) => i.name),
                              )
                            }
                          >
                            {csaAllOn ? "すべて取り外す" : "すべて選択"}
                          </Button>
                        </div>
                        <div className="max-h-[24rem] space-y-4 overflow-y-auto pr-1">
                          {[
                            {
                              label: "考え方",
                              hint: `1〜${CSA_MINDSET_COUNT}`,
                              items: CSA_ITEMS.slice(0, CSA_MINDSET_COUNT),
                              offset: 0,
                            },
                            {
                              label: "能力",
                              hint: `${CSA_MINDSET_COUNT + 1}〜${CSA_ITEMS.length}`,
                              items: CSA_ITEMS.slice(CSA_MINDSET_COUNT),
                              offset: CSA_MINDSET_COUNT,
                            },
                          ].map((group) => (
                            <div key={group.label} className="space-y-2">
                              {/* 分類の見出し（考え方 / 能力） */}
                              <div className="flex items-center gap-2">
                                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                                  {group.label}
                                </span>
                                <span className="text-[11px] text-muted-foreground">
                                  {group.hint}
                                </span>
                                <span className="h-px flex-1 bg-border" />
                              </div>
                              {group.items.map((item, idx) => {
                                const i = group.offset + idx;
                                const on = csaEnabled.includes(item.name);
                                return (
                                  <label
                                    key={item.name}
                                    className={cn(
                                      "flex cursor-pointer items-start gap-2.5 rounded-lg border p-3 transition-colors",
                                      on ? "bg-background" : "bg-muted/40 opacity-70",
                                    )}
                                  >
                                    <Checkbox
                                      checked={on}
                                      onCheckedChange={() => toggleCsaItem(item.name)}
                                      className="mt-0.5"
                                    />
                                    <div className="min-w-0 flex-1">
                                      <p className="flex items-center gap-2 text-sm font-semibold">
                                        <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-secondary text-[11px] text-secondary-foreground">
                                          {i + 1}
                                        </span>
                                        {item.name}
                                      </p>
                                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                                        {item.definition}
                                      </p>
                                    </div>
                                  </label>
                                );
                              })}
                            </div>
                          ))}
                        </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 自社設定（アコーディオン） */}
                  <div className="rounded-xl border p-4">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={companyEnabled.length > 0}
                        onCheckedChange={(v) =>
                          setCompanyEnabled(
                            v ? companyItems.map((i) => i.name) : [],
                          )
                        }
                        className="mt-0.5"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold">自社設定</p>
                        <p className="mt-0.5 text-sm text-muted-foreground">
                          自社独自の評価項目を追加し、AIが参照する項目を選べます（現在 {companyEnabled.length}/{companyItems.length} 項目）。
                        </p>
                        <button
                          type="button"
                          className="mt-1 inline-flex items-center gap-1 text-sm text-primary transition-colors hover:text-primary/80"
                          onClick={() => setCompanyOpen((o) => !o)}
                        >
                          項目を設定する
                          <ChevronDown
                            className={cn(
                              "size-3.5 transition-transform",
                              companyOpen && "rotate-180",
                            )}
                          />
                        </button>
                      </div>
                    </div>

                    <div
                      className={cn(
                        "grid transition-[grid-template-rows] duration-300 ease-out",
                        companyOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                      )}
                    >
                      <div className="overflow-hidden" inert={!companyOpen}>
                        <div className="mt-3 space-y-3 border-t pt-3">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs text-muted-foreground">
                            {companyEnabled.length} / {companyItems.length} 項目を利用中
                          </span>
                          {companyItems.length > 0 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="rounded-full text-muted-foreground"
                              onClick={() =>
                                setCompanyEnabled(
                                  companyAllOn
                                    ? []
                                    : companyItems.map((i) => i.name),
                                )
                              }
                            >
                              {companyAllOn ? "すべて取り外す" : "すべて選択"}
                            </Button>
                          )}
                        </div>
                        <div className="max-h-[18rem] space-y-2 overflow-y-auto pr-1">
                          {companyItems.length === 0 && (
                            <p className="py-6 text-center text-sm text-muted-foreground">
                              まだ項目がありません。下から追加してください。
                            </p>
                          )}
                          {companyItems.map((item, i) => {
                            const on = companyEnabled.includes(item.name);
                            return (
                              <div
                                key={item.name}
                                className={cn(
                                  "flex items-start gap-2.5 rounded-lg border p-3 transition-colors",
                                  on ? "bg-background" : "bg-muted/40 opacity-70",
                                )}
                              >
                                <Checkbox
                                  checked={on}
                                  onCheckedChange={() =>
                                    toggleCompanyItem(item.name)
                                  }
                                  className="mt-0.5"
                                />
                                <div className="min-w-0 flex-1">
                                  <p className="text-sm font-semibold">{item.name}</p>
                                  <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
                                    {item.definition}
                                  </p>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="size-8 shrink-0 text-muted-foreground hover:text-destructive"
                                  title="削除"
                                  onClick={() => removeCompanyItem(i, item.name)}
                                >
                                  <Trash2 className="size-4" />
                                </Button>
                              </div>
                            );
                          })}
                        </div>
                        <div className="space-y-2 rounded-lg border bg-muted/30 p-3">
                          <p className="text-sm font-semibold">項目を追加</p>
                          <Input
                            value={newItemName}
                            onChange={(e) => setNewItemName(e.target.value)}
                            placeholder="項目名（例：顧客起点力）"
                          />
                          <Textarea
                            rows={2}
                            value={newItemDef}
                            onChange={(e) => setNewItemDef(e.target.value)}
                            placeholder="定義（どんな行動を評価するか）"
                          />
                          <Button
                            size="sm"
                            className="rounded-full"
                            disabled={!newItemName.trim() || !newItemDef.trim()}
                            onClick={addCompanyItem}
                          >
                            <Plus className="size-4" />
                            追加する
                          </Button>
                        </div>
                      </div>
                      </div>
                    </div>
                  </div>

                  {csaEnabled.length > 0 && companyEnabled.length > 0 && (
                    <p className="rounded-lg border border-primary/30 bg-primary/5 p-3 text-xs text-muted-foreground">
                      両方を選択しているため、<span className="font-semibold text-foreground">自社設定を優先</span>し、CSA標準は補完として利用します。
                    </p>
                  )}

                  <Button className="rounded-full" onClick={saveAiSettings}>
                    保存する
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* アカウント登録ダイアログ */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>アカウント登録</DialogTitle>
              <DialogDescription>
                新しいユーザーを招待します（モックのため実際には送信されません）
              </DialogDescription>
            </DialogHeader>
            {renderAccountFields(form, setForm)}
            <DialogFooter>
              <Button
                onClick={addAccount}
                disabled={!form.name || !form.email || form.roles.length === 0}
              >
                登録する
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* アカウント詳細パネル */}
        <Dialog open={!!detailAccount} onOpenChange={(o) => !o && setDetailId(null)}>
          <DialogContent>
            {detailAccount && detailProfile && (
              <>
                <DialogHeader>
                  <div className="flex items-center gap-3">
                    <Avatar size="lg">
                      <AvatarImage src={detailAccount.avatarUrl} alt={detailAccount.name} />
                      <AvatarFallback>{detailAccount.name.slice(0, 1)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <DialogTitle className="truncate">{detailAccount.name}</DialogTitle>
                      <DialogDescription className="truncate">
                        {detailAccount.email}
                      </DialogDescription>
                    </div>
                  </div>
                </DialogHeader>
                <div className="flex flex-wrap items-center gap-1.5">
                  {detailAccount.roles.map((r) => (
                    <Badge key={r} variant="outline" className={ROLE_BADGE[r]}>
                      {ROLE_LABELS[r]}
                    </Badge>
                  ))}
                  <Badge
                    variant="outline"
                    className={cn(detailAccount.status === "suspended" && "text-destructive")}
                  >
                    {STATUS_LABELS[detailAccount.status]}
                  </Badge>
                  <span className="text-sm text-muted-foreground">{detailAccount.department}</span>
                </div>

                <Tabs
                  value={detailTab}
                  onValueChange={(v) => setDetailTab(v as "profile" | "edit")}
                >
                  <TabsList className="w-full">
                    <TabsTrigger value="profile">プロフィール</TabsTrigger>
                    <TabsTrigger value="edit">アカウント更新</TabsTrigger>
                  </TabsList>

                  <TabsContent value="profile" className="mt-4 space-y-5">
                  <div className="flex items-start gap-3">
                    <Target className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-muted-foreground">キャリア希望</p>
                      <p className="text-sm font-medium">
                        {detailProfile.careerPath ?? "未設定"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Activity className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-muted-foreground">アプリの利用状況</p>
                      {detailProfile.achievedActions !== undefined ? (
                        <div className="mt-2 grid grid-cols-3 gap-2">
                          <div className="rounded-lg border bg-muted/40 p-2.5">
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <CircleCheckBig className="size-3.5 shrink-0" />
                              達成数
                            </div>
                            <p className="mt-1 text-lg font-semibold tabular-nums">
                              {detailProfile.achievedActions}
                              <span className="ml-0.5 text-xs font-normal text-muted-foreground">
                                件
                              </span>
                            </p>
                          </div>
                          <div className="rounded-lg border bg-muted/40 p-2.5">
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <CalendarDays className="size-3.5 shrink-0" />
                              ログイン
                            </div>
                            <p className="mt-1 text-lg font-semibold tabular-nums">
                              {detailProfile.loginDays}
                              <span className="ml-0.5 text-xs font-normal text-muted-foreground">
                                日
                              </span>
                            </p>
                          </div>
                          <div className="rounded-lg border bg-muted/40 p-2.5">
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <MessageSquare className="size-3.5 shrink-0" />
                              チャット
                            </div>
                            <p className="mt-1 text-lg font-semibold tabular-nums">
                              {detailProfile.chatCount}
                              <span className="ml-0.5 text-xs font-normal text-muted-foreground">
                                回
                              </span>
                            </p>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">—</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Sprout className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-muted-foreground">成長支援度</p>
                      {detailProfile.growthSupport !== undefined ? (
                        <div className="mt-1.5 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">
                              {growthSupportLevel(detailProfile.growthSupport).label}
                            </span>
                            <span className="text-sm tabular-nums text-muted-foreground">
                              {detailProfile.growthSupport} / 100
                            </span>
                          </div>
                          <Progress value={detailProfile.growthSupport} />
                          <p className="text-xs text-muted-foreground">
                            {growthSupportLevel(detailProfile.growthSupport).note}
                          </p>
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">—（上司が未設定です）</p>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    ※ 成長支援度は今後追加予定のAIアバターとのサーベイ結果をもとに算出します（現在はモック値）。
                  </p>

                  <Separator />

                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <Star className="size-4 shrink-0 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">直近の評価</p>
                        {detailAccount.rating ? (
                          <Badge
                            variant="outline"
                            className={cn("mt-0.5", RATING_STYLE[detailAccount.rating])}
                          >
                            {detailAccount.rating}
                          </Badge>
                        ) : (
                          <p className="text-sm font-medium">未評価</p>
                        )}
                      </div>
                    </div>
                    {renderRatingSelect(detailAccount)}
                  </div>
                  </TabsContent>

                  <TabsContent value="edit" className="mt-4">
                    {renderAccountFields(editForm, setEditForm)}
                    <div className="mt-5 flex justify-end">
                      <Button
                        onClick={saveDetailEdit}
                        disabled={
                          !editForm.name ||
                          !editForm.email ||
                          editForm.roles.length === 0
                        }
                      >
                        更新する
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>

                <DialogFooter className="sm:justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={detailIndex <= 0}
                    onClick={() => gotoDetail(-1)}
                  >
                    <ChevronLeft className="size-4" />
                    前のメンバー
                  </Button>
                  <span className="self-center text-xs tabular-nums text-muted-foreground">
                    {detailIndex + 1} / {filteredAccounts.length}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={detailIndex < 0 || detailIndex >= filteredAccounts.length - 1}
                    onClick={() => gotoDetail(1)}
                  >
                    次のメンバー
                    <ChevronRight className="size-4" />
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* 詳細検索（絞り込み） */}
        <Dialog open={searchModalOpen} onOpenChange={setSearchModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>詳細検索</DialogTitle>
              <DialogDescription>
                複数の条件を組み合わせて（AND）アカウントを絞り込みます。
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>部署</Label>
                <Select
                  value={deptFilter}
                  onValueChange={(v) => {
                    setDeptFilter(v);
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={NONE_FILTER}>すべて</SelectItem>
                    {departments.map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label>状態</Label>
                <Select
                  value={statusFilter}
                  onValueChange={(v) => {
                    setStatusFilter(v as AccountStatus | "all");
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={NONE_FILTER}>すべて</SelectItem>
                    {(Object.keys(STATUS_LABELS) as AccountStatus[]).map((s) => (
                      <SelectItem key={s} value={s}>
                        {STATUS_LABELS[s]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label>上司</Label>
                <Select
                  value={managerFilter}
                  onValueChange={(v) => {
                    setManagerFilter(v);
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={NONE_FILTER}>すべて</SelectItem>
                    <SelectItem value={NO_MANAGER}>未設定</SelectItem>
                    {managerAccounts.map((mgr) => (
                      <SelectItem key={mgr.id} value={mgr.id}>
                        {mgr.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label>キャリア希望</Label>
                <Select
                  value={careerFilter}
                  onValueChange={(v) => {
                    setCareerFilter(v);
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={NONE_FILTER}>すべて</SelectItem>
                    {CAREER_PATHS.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label>直近の評価</Label>
                <Select
                  value={ratingFilter}
                  onValueChange={(v) => {
                    setRatingFilter(v);
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={NONE_FILTER}>すべて</SelectItem>
                    {RATINGS.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                    <SelectItem value={NONE_VALUE}>未評価</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label>成長支援度</Label>
                <Select
                  value={growthFilter}
                  onValueChange={(v) => {
                    setGrowthFilter(v);
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={NONE_FILTER}>すべて</SelectItem>
                    {[...GROWTH_SUPPORT_LEVELS]
                      .reverse()
                      .map((lv) => (
                        <SelectItem key={lv.value} value={lv.label}>
                          {lv.label}
                        </SelectItem>
                      ))}
                    <SelectItem value={NONE_VALUE}>該当なし</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter className="sm:justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">
                  一致：<span className="font-semibold text-foreground">{filteredAccounts.length}</span> 件
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground"
                  disabled={advancedFilterCount === 0}
                  onClick={clearAdvancedFilters}
                >
                  条件をクリア
                </Button>
              </div>
              <Button onClick={() => setSearchModalOpen(false)}>結果を見る</Button>
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
