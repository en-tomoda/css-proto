"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/store";
import { CAREER_PATHS } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { EnLogo } from "@/components/en-logo";
import {
  ArrowLeft,
  Send,
  Flag,
  ListChecks,
  CircleCheck,
  Compass,
  Target,
  MessageSquare,
  Sparkles,
  Eye,
  LockOpen,
  UserRound,
} from "lucide-react";
import { cn } from "@/lib/utils";

const INTRO_SLIDES = [
  {
    icon: Compass,
    title: "CSASへようこそ",
    body: "CSAS（キャリアセレクタビリティシステム）は、AIと一緒にキャリアの目標をつくり、週ごとの小さなアクションで一歩ずつ前に進むためのアプリです。",
    features: [],
    note: "あなたの強みに気づく。あなたとキャリアを築く。",
  },
  {
    icon: Sparkles,
    title: "CSASでできること",
    body: "日々の仕事とキャリアの目標をつなげる、3つの機能があります。",
    features: [
      {
        icon: Target,
        title: "目標と今週のアクション",
        text: "目標に近づくための週次アクションを3件ずつ提案。完了すると翌週に新しいアクションが届きます。",
      },
      {
        icon: MessageSquare,
        title: "AIチャット",
        text: "目標の相談や週次の振り返りを、いつでもAIと行えます。",
      },
      {
        icon: Sparkles,
        title: "自己理解レポート（TA）",
        text: "適性検査の結果から、あなたの特性・強みを可視化します。",
      },
    ],
    note: "",
  },
  {
    icon: LockOpen,
    title: "情報はあなたがコントロール",
    body: "ここで入力する内容や目標・アクションは、あなただけが見られる情報です。",
    features: [
      {
        icon: Eye,
        title: "上司からの「みたい」リクエスト",
        text: "上司があなたの目標を見たいときは、リクエストが届きます。公開するかどうかは、あなたが決められます。",
      },
      {
        icon: LockOpen,
        title: "いつでも非公開に戻せる",
        text: "一度公開した情報も、マイページからいつでも非公開に戻せます。",
      },
    ],
    note: "",
  },
] as const;

const QUESTIONS = [
  {
    key: "about",
    hint: "自己紹介",
    question: "あなたはどんな人ですか？",
    description: "性格やこれまでの経験など、自由にどうぞ。",
    suggestions: [
      "一度決めたら粘り強くやりきるタイプ",
      "人と話しながら進めるのが好き",
      "コツコツ分析して考えるのが得意",
    ],
  },
  {
    key: "values",
    hint: "価値観",
    question: "働くうえで大切にしていることは？",
    description: "あなたの判断の軸になっているものを教えてください。",
    suggestions: [
      "成長しつづけられること",
      "チームで成果を出すこと",
      "顧客に喜んでもらえること",
    ],
  },
  {
    key: "want",
    hint: "挑戦したいこと",
    question: "これから挑戦してみたいことは？",
    description: "興味のある仕事や、やってみたい役割など。",
    suggestions: [
      "チームを引っ張ってみたい",
      "専門性をとことん極めたい",
      "新しい企画をゼロから生みたい",
    ],
  },
  {
    key: "avoid",
    hint: "避けたいこと",
    question: "避けたい働き方は？",
    description: "「これはやりたくない」も大切な情報です。率直にどうぞ。",
    suggestions: [
      "単純作業の繰り返し",
      "ひとりで抱え込む働き方",
      "変化のない毎日",
    ],
  },
  {
    key: "path",
    hint: "キャリアパス",
    question: "次に進みたいキャリアパスは？",
    description: "いちばん近いものを選んでください。あとから変更できます。",
    suggestions: CAREER_PATHS,
    chipsOnly: true,
  },
] as const;

const PROPOSED_GOAL = "1年後にチームリーダーとして3名のメンバーを牽引できる状態になる";
const PROPOSED_ACTIONS = [
  "後輩の商談に同席してフィードバックを渡す",
  "チームの週次数値レポートを自分がまとめて共有する",
  "上司にリーダー登用の要件をヒアリングする",
];

export default function OnboardingPage() {
  const { completeOnboarding } = useApp();
  const router = useRouter();
  const [introStep, setIntroStep] = useState(0);
  // チュートリアルの進行方向（進む=右から、戻る=左からスライド）
  const [slideDir, setSlideDir] = useState<"forward" | "back">("forward");

  const goIntro = (to: number) => {
    setSlideDir(to >= introStep ? "forward" : "back");
    setIntroStep(to);
  };
  const [answers, setAnswers] = useState<string[]>([]);
  const [input, setInput] = useState("");

  const inIntro = introStep < INTRO_SLIDES.length;
  // チュートリアルの後、質問に入る前のブリッジページ
  const inBridge = introStep === INTRO_SLIDES.length;
  const inPreQuestions = inIntro || inBridge;
  const slide = INTRO_SLIDES[Math.min(introStep, INTRO_SLIDES.length - 1)];
  const step = answers.length;
  const done = step >= QUESTIONS.length;
  const current = QUESTIONS[Math.min(step, QUESTIONS.length - 1)];
  const percent = Math.round((step / QUESTIONS.length) * 100);

  const answer = (text: string) => {
    if (!text.trim() || done) return;
    setAnswers((prev) => [...prev, text.trim()]);
    setInput("");
  };

  const back = () => {
    if (step === 0) return;
    setInput("");
    setAnswers((prev) => prev.slice(0, -1));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary/50 via-background to-background">
      <div className="mx-auto flex min-h-screen max-w-xl flex-col px-4 py-6 sm:py-10">
        {/* ヘッダー */}
        <div className="mb-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <EnLogo className="h-7 w-auto" />
              <div>
                <p className="text-sm font-bold leading-tight">初回設定</p>
                <p className="text-xs text-muted-foreground">
                  5つの質問から、最初の目標とアクションをつくります
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="shrink-0 px-3 py-1 text-sm">
              {inPreQuestions ? "はじめに" : done ? "完了" : `${step + 1} / ${QUESTIONS.length}`}
            </Badge>
          </div>
          {inPreQuestions ? (
            <div className="flex justify-center gap-1.5">
              {Array.from({ length: INTRO_SLIDES.length + 1 }, (_, i) => (
                <span
                  key={i}
                  className={cn(
                    "h-1.5 rounded-full transition-all",
                    i === introStep ? "w-6 bg-primary" : "w-1.5 bg-border",
                  )}
                />
              ))}
            </div>
          ) : (
            <Progress value={done ? 100 : percent} className="h-1.5" />
          )}
        </div>

        {/* チュートリアル → 質問 → 提案 */}
        {inIntro ? (
          <div className="pt-6">
            <div
              key={`intro-${introStep}`}
              className={cn(
                "min-h-[34rem] space-y-6 duration-300 ease-out",
                slideDir === "forward"
                  ? "animate-in slide-in-from-right-8"
                  : "animate-in slide-in-from-left-8",
              )}
            >
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
                  <slide.icon className="size-7" />
                </div>
                <h1 className="text-xl font-bold sm:text-2xl">{slide.title}</h1>
                <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
                  {slide.body}
                </p>
                {slide.note && (
                  <p className="text-sm font-semibold text-primary">{slide.note}</p>
                )}
              </div>

              {slide.features.length > 0 && (
                <div className="space-y-2">
                  {slide.features.map((f) => (
                    <div key={f.title} className="flex items-start gap-3 rounded-lg border bg-background/70 p-3">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                        <f.icon className="size-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{f.title}</p>
                        <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
                          {f.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>

            <div className="space-y-3 pt-6">
              <Button className="w-full" size="lg" onClick={() => goIntro(introStep + 1)}>
                次へ
              </Button>
              <div className="flex items-center justify-between">
                {introStep > 0 ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground"
                    onClick={() => goIntro(introStep - 1)}
                  >
                    <ArrowLeft className="size-4" />
                    戻る
                  </Button>
                ) : (
                  <span />
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground"
                  onClick={() => goIntro(INTRO_SLIDES.length)}
                >
                  スキップ
                </Button>
              </div>
            </div>
          </div>
        ) : inBridge ? (
          <div className="pt-6">
            <div key="bridge" className={cn(
                "flex min-h-[34rem] flex-col items-center justify-center duration-300 ease-out",
                slideDir === "forward"
                  ? "animate-in slide-in-from-right-8"
                  : "animate-in slide-in-from-left-8",
              )}>
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
                  <UserRound className="size-7" />
                </div>
                <h1 className="text-xl font-bold sm:text-2xl">
                  まずは、あなたのことを教えてください
                </h1>
                <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
                  ここから5つの質問にお答えください。回答をもとに、AIがあなたに合った最初の目標と今週のアクションをご提案します。
                </p>
                <p className="text-xs text-muted-foreground">
                  所要時間はおよそ3分。回答はあとから何度でも見直せます。
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-6">
              <Button className="w-full" size="lg" onClick={() => goIntro(introStep + 1)}>
                質問をはじめる
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground"
                onClick={() => goIntro(INTRO_SLIDES.length - 1)}
              >
                <ArrowLeft className="size-4" />
                戻る
              </Button>
            </div>
          </div>
        ) : !done ? (
          <div key={step} className="space-y-6 pt-4">
              <div>
                <p className="mb-1.5 text-xs font-semibold tracking-wide text-primary">
                  Q{step + 1}. {current.hint}
                </p>
                <h1 className="text-xl font-bold leading-snug sm:text-2xl">
                  {current.question}
                </h1>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  {current.description}
                </p>
              </div>

              <div className="flex flex-col gap-2">
                {current.suggestions.map((s) => (
                  <Button
                    key={s}
                    variant="outline"
                    className="h-auto justify-start whitespace-normal py-2.5 text-left font-normal"
                    onClick={() => answer(s)}
                  >
                    {s}
                  </Button>
                ))}
              </div>

              {!("chipsOnly" in current && current.chipsOnly) && (
                <form
                  className="flex gap-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    answer(input);
                  }}
                >
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="自分の言葉で入力してもかまいません"
                  />
                  <Button type="submit" size="icon" className="shrink-0" disabled={!input.trim()}>
                    <Send className="size-4" />
                  </Button>
                </form>
              )}

              {step > 0 && (
                <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={back}>
                  <ArrowLeft className="size-4" />
                  前の質問に戻る
                </Button>
              )}
          </div>
        ) : (
          <div className="space-y-5 pt-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                <CircleCheck className="size-4" />
                回答ありがとうございました。内容をもとに、最初の目標とアクションをご提案します
              </div>

              <div className="rounded-lg border bg-secondary/40 p-4">
                <p className="mb-1.5 flex items-center gap-1.5 text-xs font-bold tracking-wide text-primary">
                  <Flag className="size-3.5" />
                  仮目標
                </p>
                <p className="font-bold leading-relaxed">{PROPOSED_GOAL}</p>
              </div>

              <div>
                <p className="mb-2 flex items-center gap-1.5 text-xs font-bold tracking-wide text-muted-foreground">
                  <ListChecks className="size-3.5" />
                  今週のアクション（3件）
                </p>
                <div className="space-y-2">
                  {PROPOSED_ACTIONS.map((a, i) => (
                    <div
                      key={a}
                      className="flex items-center gap-3 rounded-lg border bg-background p-3"
                    >
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold text-secondary-foreground">
                        {i + 1}
                      </span>
                      <p className="text-sm">{a}</p>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                className="w-full"
                size="lg"
                onClick={() => {
                  completeOnboarding(PROPOSED_GOAL, PROPOSED_ACTIONS);
                  toast.success("初回設定が完了しました");
                  router.push("/mypage");
                }}
              >
                この内容で始める
              </Button>
              <div className="flex items-center justify-between">
                <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={back}>
                  <ArrowLeft className="size-4" />
                  回答を修正する
                </Button>
                <p className="text-xs text-muted-foreground">
                  あとからAIチャットで見直せます
                </p>
              </div>
          </div>
        )}
      </div>
    </div>
  );
}
