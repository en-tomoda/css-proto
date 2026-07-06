"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useApp } from "@/lib/store";
import type { Role } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Users, Settings, User, LogOut } from "lucide-react";
import { EnLogo } from "@/components/en-logo";

const NAV = [
  { href: "/mypage", label: "マイページ", icon: User, roles: ["member", "manager"] },
  { href: "/chat", label: "AIチャット", icon: MessageSquare, roles: ["member", "manager"] },
  { href: "/members", label: "メンバー", icon: Users, roles: ["manager"] },
  { href: "/admin", label: "管理者設定", icon: Settings, roles: ["admin"] },
] as const;

const ROLE_LABELS: Record<Role, string> = {
  member: "メンバー",
  manager: "上司",
  admin: "管理者",
};

const ROLE_NAMES: Record<Role, string> = {
  member: "田中 悠人",
  manager: "佐藤 拓也",
  admin: "管理 太郎",
};

export function AppShell({ children }: { children: ReactNode }) {
  const { role, logout } = useApp();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!role) router.replace("/login");
  }, [role, router]);

  if (!role) return null;

  const visibleNav = NAV.filter((n) => (n.roles as readonly string[]).includes(role));

  return (
    <div className="min-h-screen bg-muted/40">
      <header className="sticky top-0 z-20 border-b bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-2 px-3 sm:gap-4 sm:px-4">
          <Link
            href={role === "admin" ? "/admin" : "/mypage"}
            className="flex shrink-0 items-center gap-2 font-bold"
          >
            <EnLogo className="h-7 w-auto" />
            <span className="hidden sm:inline">キャリアセレクタビリティシステム</span>
          </Link>
          <nav className="flex min-w-0 flex-1 items-center gap-0.5 sm:gap-1">
            {visibleNav.map((item) => {
              const active =
                item.href === "/members"
                  ? pathname.startsWith("/members")
                  : pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-sm font-medium transition-colors sm:px-3.5",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <item.icon className="size-4 shrink-0" />
                  <span className="hidden md:inline">{item.label}</span>
                </Link>
              );
            })}
          </nav>
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <Badge variant="secondary" className="max-w-28 truncate sm:max-w-none">
              {ROLE_NAMES[role]}（{ROLE_LABELS[role]}）
            </Badge>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 text-muted-foreground"
              title="ログアウト"
              onClick={() => {
                logout();
                router.push("/login");
              }}
            >
              <LogOut className="size-4" />
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-3 py-5 sm:px-4 sm:py-6">{children}</main>
    </div>
  );
}
