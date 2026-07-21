"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AiMascot } from "@/components/ai-mascot";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MASCOT_NAME,
  buildTwinResolution,
  twinResolutionLevel,
  type Member,
} from "@/lib/data";
import { CsaTag } from "@/components/csa-tag";
import { cn } from "@/lib/utils";
import {
  MessageSquare,
  Sparkles,
  HelpCircle,
  TrendingUp,
  Flag,
  ScanFace,
} from "lucide-react";

/** 時間帯に応じた挨拶 */
function greetingByHour(hour: number) {
  if (hour < 4) return "こんばんは";
  if (hour < 11) return "おはようございます";
  if (hour < 18) return "こんにちは";
  return "こんばんは";
}

/**
 * マイキャリアの主役。AIマスコットから見た「あなた（デジタルツイン）」を表示する。
 * 会話や活動が増えるほど解像度が上がり、まだ言語化されていない問いがチャットへ誘う。
 */
export function DigitalTwinHero({
  member,
  noticeCount,
}: {
  member: Member;
  noticeCount: number;
}) {
  const firstName = member.name.split(" ")[0];
  const resolution = buildTwinResolution(member);
  const resLevel = twinResolutionLevel(resolution);
  const greeting = greetingByHour(new Date().getHours());

  // ナビが数秒ごとにつぶやくセリフ（1つ目はあいさつ、以降は状況に応じた一言）
  const tweets = [
    `${greeting}、${firstName}さん。今日も来てくれてうれしいです。`,
    noticeCount > 0
      ? `お知らせが${noticeCount}件届いていますよ。見ておきましょう。`
      : "今週も一歩ずつ、いきましょう。",
    `いまの解像度は「${resLevel.level.label}」。もっと話すほど、あなたが見えてきます。`,
    member.twin.focusCsa[0]
      ? `いま「${member.twin.focusCsa[0]}」を高めようとしていますね。いい調子です。`
      : "小さな一歩でも、続けると大きな力になりますよ。",
    member.twin.hiddenQuestions[0]
      ? `そういえば——${member.twin.hiddenQuestions[0]}`
      : "気になることがあれば、いつでも話しかけてくださいね。",
  ];
  const [tweetIndex, setTweetIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setTweetIndex((i) => (i + 1) % tweets.length);
    }, 5000);
    return () => clearInterval(id);
    // tweets の長さは固定なので依存は不要
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card className="relative overflow-hidden border-primary/30 bg-gradient-to-br from-primary/8 via-background to-accent/30">
      <CardContent className="flex flex-col gap-6 p-5 sm:p-6 md:flex-row md:items-stretch">
        {/* 左: ナビの吹き出し + マスコット + 主役CTA */}
        <div className="flex shrink-0 flex-col items-center justify-center gap-3 md:w-64">
          {/* ナビの吹き出し（下向きのしっぽでマスコットが話しているように） */}
          <div className="relative flex h-28 w-full items-center justify-center rounded-2xl border border-primary/15 bg-background px-4 py-3 text-center text-sm font-medium leading-relaxed text-foreground shadow-sm">
            <p key={tweetIndex} className="animate-in fade-in duration-500">
              {tweets[tweetIndex]}
            </p>
            {/* マスコット方向（下）を指すしっぽ（枠線に合わせて左と下に線） */}
            <span className="absolute -bottom-1.5 left-1/2 size-3 -translate-x-1/2 rotate-45 border-r border-b border-primary/15 bg-background" />
          </div>

          <AiMascot className="h-40 w-auto drop-shadow-sm sm:h-48" />
        </div>

        {/* 右: ナビから見たあなた（分析） */}
        <div className="min-w-0 flex-1 space-y-4">
          <h2 className="flex items-center gap-2 text-lg font-bold sm:text-xl">
            <Sparkles className="size-5 text-primary" />
            {MASCOT_NAME}から見た、{firstName}さん
          </h2>

          {/* 解像度メーター（段階レベル + ピクセル風ゲージ） */}
          <div className="rounded-xl border bg-background/70 p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                プロフィールの解像度
              </span>
              <span className="flex items-center gap-1.5 text-sm font-bold text-primary">
                <ScanFace className="size-4" />
                {resLevel.level.label}
              </span>
            </div>
            {/* ピクセルが埋まっていくゲージ */}
            <div className="flex gap-1">
              {Array.from({ length: resLevel.totalDots }, (_, i) => (
                <span
                  key={i}
                  className={cn(
                    "h-2.5 flex-1 rounded-[3px]",
                    i < resLevel.litDots ? "bg-primary" : "bg-primary/15",
                  )}
                />
              ))}
            </div>
            <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">
              {resLevel.level.note}。{MASCOT_NAME}と話すほど、輪郭がくっきりしていきます。
            </p>
          </div>

          {/* 人物像 */}
          <div className="rounded-xl border bg-background/70 p-4">
            <p className="text-sm font-semibold text-primary">{member.twin.headline}</p>
            <p className="mt-1.5 text-sm leading-relaxed text-foreground/80">
              {member.twin.portrait}
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {member.twin.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="font-normal">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* いま高めたいCSA（ナビが提示） */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border bg-background/70 p-4">
              <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold">
                <TrendingUp className="size-4 text-primary" />
                いま高めているCSA
              </p>
              <div className="flex flex-wrap gap-1.5">
                {member.twin.focusCsa.map((k) => (
                  <CsaTag key={k} name={k} variant="focus" />
                ))}
              </div>
            </div>
            <div className="rounded-xl border bg-background/70 p-4">
              <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold">
                <Flag className="size-4 text-amber-600" />
                課題に感じているCSA
              </p>
              <div className="flex flex-wrap gap-1.5">
                {member.twin.challengeCsa.map((k) => (
                  <CsaTag key={k} name={k} variant="challenge" />
                ))}
              </div>
            </div>
          </div>

          {/* まだ見えていないあなた → チャットへ誘導（主役CTAはマスコット下） */}
          <div className="rounded-xl border border-dashed border-primary/40 bg-primary/5 p-4">
            <p className="flex items-center gap-1.5 text-sm font-semibold">
              <HelpCircle className="size-4 text-primary" />
              まだ、言語化されていないあなた
            </p>
            <ul className="mt-2 space-y-1">
              {member.twin.hiddenQuestions.map((q) => (
                <li
                  key={q}
                  className="flex gap-2 text-sm leading-relaxed text-muted-foreground"
                >
                  <span className="mt-2 size-1 shrink-0 rounded-full bg-primary/60" />
                  {q}
                </li>
              ))}
            </ul>
            <Button asChild size="sm" className="mt-3 rounded-full">
              <Link href="/chat">
                <MessageSquare className="size-4" />
                {MASCOT_NAME}と話して解像度を上げる
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
