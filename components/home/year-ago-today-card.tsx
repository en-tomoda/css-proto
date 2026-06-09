import Link from "next/link";

export function YearAgoTodayCard() {
  return (
    <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <h2 className="text-sm font-semibold">1年前の今日</h2>
        <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
          2025年6月3日
        </span>
      </div>
      <blockquote className="mt-3 rounded-xl bg-muted/60 px-4 py-3 text-sm italic">
        「技術に自信がない」
      </blockquote>
      <p className="mt-3 text-xs text-muted-foreground">
        AIより: 1年経った今、どう感じていますか？
      </p>
      <Link
        href="/chat?topic=reflection-2025"
        className="mt-3 inline-flex rounded-lg border border-border px-3 py-1.5 text-xs transition hover:bg-muted"
      >
        振り返る
      </Link>
    </div>
  );
}
