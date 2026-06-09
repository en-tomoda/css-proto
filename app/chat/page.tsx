"use client";

import { useState, useCallback } from "react";
import { ChatHeader }   from "@/components/chat/chat-header";
import { ChatMessages, type Message } from "@/components/chat/chat-messages";
import { ChatInput }    from "@/components/chat/chat-input";
import { ChatSidebar }  from "@/components/chat/chat-sidebar";

const INITIAL_MESSAGES: Message[] = [
  { role: "ai",   text: "今日はどうだった？",                                                                      time: "21:03" },
  { role: "user", text: "新しい案件が始まって、少し不安だった。",                                                  time: "21:04" },
  { role: "ai",   text: "不安だった理由は何だと思う？",                                                            time: "21:04" },
  { role: "user", text: "周囲のレベルが高そうだったから。",                                                        time: "21:05" },
  { role: "ai",   text: "その一方で、期待していることはある？",                                                    time: "21:05" },
  { role: "user", text: "成長できそうな気もする。",                                                                time: "21:07" },
  { role: "ai",   text: "成長への期待も感じているんだね。\nその「成長できそう」という感覚、もう少し教えてもらえる？", time: "21:07" },
];

const AI_RESPONSES = [
  "それはどんな気持ちでしたか？",
  "もう少し詳しく教えてもらえますか？",
  "その経験から、何を学んだと思いますか？",
  "その一方で、どんな可能性を感じていますか？",
  "そう感じた背景には、何があると思いますか？",
  "理想の状態はどんな姿ですか？",
  "なるほど。それについて、もう少し深めてみましょう。",
];

let aiIndex = 0;
const nextAiResponse = () => AI_RESPONSES[aiIndex++ % AI_RESPONSES.length];

function now() {
  return new Date().toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" });
}

export default function ChatPage() {
  const [messages, setMessages]   = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput]         = useState("");
  const [isTyping, setIsTyping]   = useState(false);

  const send = useCallback(() => {
    const text = input.trim();
    if (!text || isTyping) return;

    setMessages((prev) => [...prev, { role: "user", text, time: now() }]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: nextAiResponse(), time: now() },
      ]);
      setIsTyping(false);
    }, 1400);
  }, [input, isTyping]);

  return (
    <div className="flex h-[calc(100vh-3.5rem)] overflow-hidden bg-muted/40">
      <div className="mx-auto flex w-full max-w-5xl overflow-hidden">
        <div className="flex flex-1 flex-col overflow-hidden bg-card">
          <ChatHeader />
          <ChatMessages messages={messages} isTyping={isTyping} />
          <ChatInput value={input} onChange={setInput} onSend={send} disabled={isTyping} />
        </div>
        <ChatSidebar onSelectTemplate={setInput} />
      </div>
    </div>
  );
}
