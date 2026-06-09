const categories = [
  {
    label: "好きなこと",
    tags: ["フロントエンド開発", "AI", "教育", "1on1", "本を読むこと"],
    highlight: false,
  },
  {
    label: "興味・関心",
    tags: ["プロダクト開発", "キャリア形成", "コーチング理論", "組織設計"],
    highlight: false,
  },
  {
    label: "大切にしている価値観",
    tags: ["成長", "挑戦", "自律", "誠実さ", "長期視点"],
    highlight: true,
  },
  {
    label: "強み",
    tags: ["継続力", "学習意欲", "課題発見力", "問いを立てる力", "傾聴"],
    highlight: true,
  },
  {
    label: "現在のテーマ",
    tags: ["AI活用", "キャリア自律", "独立準備", "コーチングサービス設計"],
    highlight: false,
  },
];

export function ProfileCategories() {
  return (
    <>
      {categories.map((cat) => (
        <div key={cat.label} className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm">
          <h2 className="text-sm font-semibold">{cat.label}</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {cat.tags.map((tag) => (
              <span
                key={tag}
                className={`rounded-full px-3 py-1 text-sm ${
                  cat.highlight
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                }`}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
