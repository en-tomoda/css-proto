"use client";

import { useEffect, useRef } from "react";

export type Message = { role: "ai" | "user"; text: string; time: string };

export function ChatMessages({
  messages,
  isTyping,
}: {
  messages: Message[];
  isTyping: boolean;
}) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    <div className="flex-1 space-y-5 overflow-y-auto px-5 py-6">
      {messages.map((msg, i) => (
        <div key={i} className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
          {msg.role === "ai" && (
            <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
              AI
            </div>
          )}
          <div className="max-w-[75%]">
            <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${
              msg.role === "ai"
                ? "rounded-tl-sm bg-muted text-foreground"
                : "rounded-tr-sm bg-primary text-primary-foreground"
            }`}>
              {msg.text}
            </div>
            <p className={`mt-1 text-[10px] text-muted-foreground ${msg.role === "user" ? "text-right" : ""}`}>
              {msg.time}
            </p>
          </div>
        </div>
      ))}

      {isTyping && (
        <div className="flex gap-2.5">
          <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
            AI
          </div>
          <div className="rounded-2xl rounded-tl-sm bg-muted px-4 py-3">
            <span className="flex gap-1">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/40 [animation-delay:0ms]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/40 [animation-delay:150ms]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/40 [animation-delay:300ms]" />
            </span>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
