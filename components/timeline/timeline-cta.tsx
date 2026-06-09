import Link from "next/link";

export function TimelineCta() {
  return (
    <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm">
      <p className="text-sm text-muted-foreground">
        対話を積み重ねることで、新しいコミットが追加されます。
      </p>
      <Link
        href="/chat"
        className="mt-3 inline-flex rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
      >
        今日の対話を始める
      </Link>
    </div>
  );
}
