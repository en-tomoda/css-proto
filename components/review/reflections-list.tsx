import Link from "next/link";

const reflections = [
  {
    period:    "3ヶ月前",
    date:      "2026年3月3日",
    quote:     "技術に自信がない。周りと比べて自分は遅れている気がする。",
    tags:      ["自己効力感", "不安"],
    aiPrompt:  "今はどう感じていますか？",
  },
  {
    period:    "6ヶ月前",
    date:      "2025年12月3日",
    quote:     "リーダーとして動くのが正直しんどい。自分は現場が好きなのかもしれない。",
    tags:      ["役割", "葛藤"],
    aiPrompt:  "その感覚は今も続いていますか？",
  },
  {
    period:    "1年前",
    date:      "2025年6月3日",
    quote:     "技術に自信がない",
    tags:      ["自信", "成長"],
    aiPrompt:  "1年経った今、どう変わりましたか？",
  },
];

export function ReflectionsList() {
  return (
    <>
      {reflections.map((r) => (
        <div key={r.date} className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium">{r.period}</span>
            <span className="text-[11px] text-muted-foreground">{r.date}</span>
          </div>
          <blockquote className="mt-3 rounded-xl bg-muted/60 px-4 py-3 text-sm italic leading-relaxed">
            「{r.quote}」
          </blockquote>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {r.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-muted px-2.5 py-0.5 text-[11px] text-muted-foreground">
                {tag}
              </span>
            ))}
          </div>
          <div className="mt-4 rounded-xl border border-border/70 bg-muted/30 px-4 py-3">
            <p className="text-xs text-muted-foreground">AIより</p>
            <p className="mt-1 text-sm">{r.aiPrompt}</p>
          </div>
          <Link
            href="/chat"
            className="mt-3 inline-flex rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground transition hover:opacity-90"
          >
            この問いに答える
          </Link>
        </div>
      ))}
    </>
  );
}
