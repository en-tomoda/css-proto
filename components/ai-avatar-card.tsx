"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell } from "lucide-react";
import { AiMascot } from "@/components/ai-mascot";

/** 時間帯に応じた挨拶 */
function greetingByHour(hour: number) {
  if (hour < 4) return "こんばんは";
  if (hour < 11) return "おはようございます";
  if (hour < 18) return "こんにちは";
  return "こんばんは";
}

/**
 * マイページ左側のAIアバターカード。
 * ログイン時のお迎えメッセージを表示し、クリックでお知らせモーダルを開く。
 */
export function AiAvatarCard({
  userName,
  noticeCount,
  onClick,
}: {
  userName: string;
  noticeCount: number;
  onClick: () => void;
}) {
  const greeting = greetingByHour(new Date().getHours());

  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick();
      }}
      className="h-full cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-md"
    >
      <CardContent className="flex h-full flex-col items-center justify-center gap-6 p-6 text-center">
        {/* 吹き出し */}
        <div className="relative max-w-sm rounded-2xl bg-secondary px-5 py-4 text-sm leading-relaxed text-secondary-foreground">
          <p className="font-semibold">
            {greeting}、{userName}さん。今日も来てくれてうれしいです。
          </p>
          <p className="mt-1.5 text-secondary-foreground/80">
            {noticeCount > 0
              ? `お知らせが${noticeCount}件届いています。確認しておきましょう。`
              : "新しいお知らせはありません。今週も一歩ずつ進んでいきましょう。"}
          </p>
          {/* 吹き出しのしっぽ */}
          <span className="absolute -bottom-1.5 left-1/2 size-3 -translate-x-1/2 rotate-45 bg-secondary" />
        </div>

        {/* アバター */}
        <div className="relative">
          <AiMascot className="h-32 w-auto drop-shadow-sm" />
          {noticeCount > 0 && (
            <Badge className="absolute top-2 right-0 size-6 justify-center rounded-full p-0 text-xs">
              {noticeCount}
            </Badge>
          )}
        </div>

        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Bell className="size-3" />
          クリックするとお知らせを確認できます
        </p>
      </CardContent>
    </Card>
  );
}
