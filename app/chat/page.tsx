"use client";

import { useEffect, useRef, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Bot, Send, Target, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

type Msg = { from: "ai" | "user"; text: string };

const TEMPLATES = [
  {
    id: "goal",
    icon: Target,
    label: "目標についてAIと話す",
    firstMessage:
      "目標について一緒に考えましょう。現在の目標は「1年後にチームリーダーとして3名のメンバーを牽引できる状態になる」ですね。最近、目標に対して手応えを感じた場面はありましたか？",
  },
  {
    id: "review",
    icon: RotateCcw,
    label: "振り返りを行う",
    firstMessage:
      "今週の振り返りを始めましょう。今週のアクションは3件中1件完了しています。まず、完了した「後輩の商談に同席してフィードバックを渡す」はいかがでしたか？うまくいった点を教えてください。",
  },
];

const AI_REPLIES = [
  "なるほど、詳しく教えてくれてありがとうございます。その中で、特に自分の成長を感じたのはどんな瞬間でしたか？",
  "いい気づきですね。それは目標に近づくうえで大切な一歩だと思います。次の一週間で、もう一歩進めるとしたら何ができそうですか？",
  "素晴らしい視点です。一方で、難しさを感じている部分はありますか？小さなことでも大丈夫です。",
  "その課題は多くの人がぶつかるポイントです。まずはハードルを下げて「15分だけやってみる」のように分解してみるのはどうでしょう？",
  "今日の対話の内容は記録しておきますね。次回の振り返りでまた一緒に確認しましょう。他に話しておきたいことはありますか？",
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [replyIndex, setReplyIndex] = useState(0);
  const [thinking, setThinking] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  const startTemplate = (t: (typeof TEMPLATES)[number]) => {
    setMessages([{ from: "ai", text: t.firstMessage }]);
    setReplyIndex(0);
  };

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { from: "user", text: input }]);
    setInput("");
    setThinking(true);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { from: "ai", text: AI_REPLIES[replyIndex % AI_REPLIES.length] },
      ]);
      setReplyIndex((i) => i + 1);
      setThinking(false);
    }, 800);
  };

  return (
    <AppShell>
      <div className="mx-auto flex h-[calc(100vh-8.5rem)] max-w-2xl flex-col">
        <div className="mb-4">
          <h1 className="text-xl font-bold">AIトーク</h1>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            キャリアの相談や週次の振り返りができます。テンプレートからも始められます。
          </p>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          {TEMPLATES.map((t) => (
            <Button
              key={t.id}
              variant="secondary"
              size="sm"
              className="rounded-full"
              onClick={() => startTemplate(t)}
            >
              <t.icon className="size-4" />
              {t.label}
            </Button>
          ))}
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto rounded-lg border bg-background p-4">
          {messages.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-muted-foreground">
              <Bot className="size-10" />
              <p className="text-sm leading-relaxed">
                テンプレートを選ぶか、
                <br />
                メッセージを送って始めましょう
              </p>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={cn("flex gap-2", m.from === "user" && "justify-end")}>
              {m.from === "ai" && (
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Bot className="size-4" />
                </div>
              )}
              <div
                className={cn(
                  "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                  m.from === "ai" ? "bg-muted" : "bg-primary text-primary-foreground",
                )}
              >
                {m.text}
              </div>
            </div>
          ))}
          {thinking && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Bot className="size-4" />
              <Badge variant="secondary" className="animate-pulse">
                考え中...
              </Badge>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <form className="mt-3 flex gap-2" onSubmit={send}>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="メッセージを入力..."
          />
          <Button type="submit" size="icon" disabled={!input.trim() || thinking}>
            <Send className="size-4" />
          </Button>
        </form>
      </div>
    </AppShell>
  );
}
