import Link from "next/link";

export function ChatHeader() {
  return (
    <div className="flex shrink-0 items-center justify-between border-b border-border/70 px-5 py-3">
      <div>
        <p className="text-xs text-muted-foreground">2026年6月3日</p>
        <h1 className="text-base font-semibold">今日の対話</h1>
      </div>
      <div className="flex items-center gap-2">
        <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700">
          進行中
        </span>
        <Link
          href="/"
          className="rounded-lg border border-border px-3 py-1.5 text-xs transition hover:bg-muted"
        >
          ホームへ
        </Link>
      </div>
    </div>
  );
}
