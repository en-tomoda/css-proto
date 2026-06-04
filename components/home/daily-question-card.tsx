import Link from "next/link";

export function DailyQuestionCard() {
  return (
    <div className="rounded-2xl bg-primary p-6 text-primary-foreground shadow-sm">
      <p className="text-xs font-medium opacity-60">今日の問い</p>
      <p className="mt-3 text-xl font-semibold leading-snug">
        最近一番エネルギーを使ったことは？
      </p>
      <Link
        href="/chat"
        className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-primary-foreground/10 px-5 py-2.5 text-sm font-medium transition hover:bg-primary-foreground/20"
      >
        話してみる <span aria-hidden>→</span>
      </Link>
    </div>
  );
}
