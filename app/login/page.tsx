"use client";

import { useRouter } from "next/navigation";
import { useApp } from "@/lib/store";
import type { Role } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Users, Settings, ChevronRight, Sparkles } from "lucide-react";
import { EnLogo } from "@/components/en-logo";

const LOGIN_OPTIONS: {
  role: Role;
  name: string;
  label: string;
  description: string;
  icon: typeof User;
  /** 初回設定を体験するデモ用ルート */
  firstTime?: boolean;
}[] = [
    {
      role: "member",
      name: "田中 悠人",
      label: "初回体験",
      description: "はじめてログインした想定で、AIとの初回設定から体験する",
      icon: Sparkles,
      firstTime: true,
    },
    {
      role: "member",
      name: "田中 悠人",
      label: "メンバー",
      description: "自分の目標とアクションに取り組む",
      icon: User,
    },
    {
      role: "manager",
      name: "佐藤 拓也",
      label: "上司",
      description: "メンバーの成長を見守り、応援する",
      icon: Users,
    },
    {
      role: "admin",
      name: "管理 太郎",
      label: "管理者",
      description: "アカウントやAIの設定を管理する",
      icon: Settings,
    },
  ];

export default function LoginPage() {
  const { login, onboarded, resetOnboarding } = useApp();
  const router = useRouter();

  const handleLogin = (role: Role, firstTime?: boolean) => {
    login(role);
    if (firstTime) {
      resetOnboarding();
      router.push("/onboarding");
    } else if (role === "admin") {
      router.push("/admin");
    } else if (role === "member" && !onboarded) {
      router.push("/onboarding");
    } else {
      router.push("/mypage");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-secondary/60 via-background to-background px-4 py-10">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <EnLogo className="mx-auto mb-4 h-16 w-auto" />
          <h1 className="text-3xl font-bold tracking-tight">エン キャリセレAI</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            社員を主人公にする、
            <br />
            キャリア自律支援ツール
          </p>
        </div>

        <div className="space-y-3">
          <p className="text-center text-xs text-muted-foreground">
            デモ用：ログインするユーザーを選んでください
          </p>
          {LOGIN_OPTIONS.map((opt) => (
            <Card
              key={`${opt.role}-${opt.label}`}
              className="cursor-pointer py-0 transition-all hover:-translate-y-0.5 hover:shadow-md"
              onClick={() => handleLogin(opt.role, opt.firstTime)}
            >
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
                  <opt.icon className="size-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{opt.name}</p>
                    <Badge variant="secondary" className="shrink-0">
                      {opt.label}
                    </Badge>
                  </div>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {opt.description}
                  </p>
                </div>
                <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
