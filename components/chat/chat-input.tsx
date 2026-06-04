"use client";

export function ChatInput({
  value,
  onChange,
  onSend,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  disabled?: boolean;
}) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!disabled && value.trim()) onSend();
    }
  };

  return (
    <div className="shrink-0 border-t border-border/70 p-4">
      <div className="flex items-end gap-2 rounded-xl border border-border bg-background p-2">
        <textarea
          rows={2}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="自由に話してください..."
          disabled={disabled}
          className="w-full resize-none bg-transparent px-2 py-1 text-sm outline-none disabled:opacity-50"
        />
        <button
          onClick={onSend}
          disabled={disabled || !value.trim()}
          className="shrink-0 rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-40"
        >
          送信
        </button>
      </div>
      <p className="mt-1.5 text-right text-[10px] text-muted-foreground">
        Enter で送信 / Shift+Enter で改行
      </p>
    </div>
  );
}
