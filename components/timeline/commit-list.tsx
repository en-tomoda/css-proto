const jobPeriods = [
  {
    company:   "1社目",
    name:      "スタートアップA",
    period:    "2019年4月 〜 2022年3月",
    role:      "フロントエンドエンジニア",
    commits: [
      {
        year:    "2019年",
        message: "とにかく技術を磨きたい",
        tags:    ["技術", "スタート"],
        status:  "past" as const,
        detail:  "初めての就職。UIとJavaScriptに熱中し、コードを書くことが純粋に楽しかった時期。",
      },
      {
        year:    "2021年",
        message: "チームに貢献できる人になりたい",
        tags:    ["チーム", "貢献"],
        status:  "past" as const,
        detail:  "後輩が増え、技術を教えることに喜びを感じ始める。個人の技術力以上の関心が芽生えた。",
      },
    ],
  },
  {
    company:   "2社目",
    name:      "テクノロジー企業B",
    period:    "2022年4月 〜 現在",
    role:      "シニアエンジニア → チームリーダー",
    commits: [
      {
        year:    "2023年",
        message: "もっと広く価値を届けたい",
        tags:    ["影響範囲", "成長"],
        status:  "past" as const,
        detail:  "より大きな組織で可能性を試したくなり転職。スケールの違いに刺激を受けた。",
      },
      {
        year:    "2024年",
        message: "コーチング × テクノロジーで人を動かしたい",
        tags:    ["コーチング", "技術", "転換"],
        status:  "past" as const,
        detail:  "1on1でメンバーが変わっていく様子に手応えを感じ、コーチングを本格的に学び始める。",
      },
      {
        year:    "2025年",
        message: "技術リードとして組織を引っ張りたい",
        tags:    ["リーダーシップ", "組織"],
        status:  "past" as const,
        detail:  "チームリーダーに就任。技術戦略と人材育成の両輪を担う役割を経験。",
      },
      {
        year:    "2026年2月",
        message: "独立してコーチになりたい",
        tags:    ["独立", "コーチング", "転換"],
        status:  "current" as const,
        detail:  "プロダクト開発とキャリア支援の交差点に自分の軸を見出す。独立を具体的に準備し始めた。",
      },
    ],
  },
  {
    company:   "独立・起業",
    name:      "",
    period:    "2027年〜（予測）",
    role:      "コーチ / 起業家",
    commits: [
      {
        year:    "2028年（予測）",
        message: "起業してみたい",
        tags:    ["起業", "独立"],
        status:  "future" as const,
        detail:  "コーチングサービスの拡大と、自分のブランドで動く未来への関心。",
      },
      {
        year:    "2030年（予測）",
        message: "やはりエンジニアリングが好きだと思う",
        tags:    ["技術", "回帰", "統合"],
        status:  "future" as const,
        detail:  "技術とコーチングを統合した形で価値を届ける──今もそれは変わらない核心かもしれない。",
      },
    ],
  },
];

// グローバルなコミット番号を付与
let _counter = 0;
const periods = jobPeriods.map((job) => ({
  ...job,
  commits: job.commits.map((c) => ({
    ...c,
    index: c.status !== "future" ? ++_counter : null,
  })),
}));

export function CommitList() {
  return (
    <div className="relative">
      {/* 縦線 */}
      <div className="absolute left-[19px] top-3 h-[calc(100%-24px)] w-px bg-border" />

      <div className="space-y-1">
        {periods.map((job) => (
          <div key={job.company}>
            {/* 職歴バナー */}
            <div className="flex items-center gap-2 py-3 pl-14">
              <div className="h-px flex-1 bg-border/60" />
              <div className="flex shrink-0 items-center gap-2 rounded-full border border-border/70 bg-muted/70 px-3 py-1">
                <span className="text-[11px] font-semibold">{job.company}</span>
                {job.name && (
                  <span className="text-[11px] text-muted-foreground">{job.name}</span>
                )}
                <span className="text-[10px] text-muted-foreground">·</span>
                <span className="text-[10px] text-muted-foreground">{job.period}</span>
                <span className="text-[10px] text-muted-foreground">·</span>
                <span className="text-[10px] text-muted-foreground">{job.role}</span>
              </div>
              <div className="h-px flex-1 bg-border/60" />
            </div>

            {/* コミット一覧 */}
            <div className="space-y-3">
              {job.commits.map((commit) => (
                <div key={commit.year} className="flex gap-4">
                  <div className={`relative z-10 mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ring-4 ring-muted/40 ${
                    commit.status === "current"
                      ? "bg-primary ring-primary/20"
                      : commit.status === "future"
                        ? "border-2 border-dashed border-border bg-card"
                        : "bg-muted"
                  }`}>
                    {commit.status === "current" ? (
                      <span className="text-[10px] font-bold text-primary-foreground">NOW</span>
                    ) : commit.status === "future" ? (
                      <span className="text-[10px] text-muted-foreground">予測</span>
                    ) : (
                      <span className="text-[10px] text-muted-foreground">{commit.index}</span>
                    )}
                  </div>

                  <div className={`flex-1 rounded-2xl border p-4 shadow-sm ${
                    commit.status === "current"
                      ? "border-primary/30 bg-card"
                      : commit.status === "future"
                        ? "border-dashed border-border/60 bg-card/60"
                        : "border-border/70 bg-card"
                  }`}>
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="text-[11px] text-muted-foreground">{commit.year}</p>
                        <p className={`mt-0.5 text-base font-semibold ${commit.status === "future" ? "text-muted-foreground" : ""}`}>
                          {commit.message}
                        </p>
                      </div>
                      {commit.status === "current" && (
                        <span className="rounded-full bg-primary px-2.5 py-0.5 text-[11px] font-medium text-primary-foreground">
                          現在
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{commit.detail}</p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {commit.tags.map((tag) => (
                        <span key={tag} className={`rounded-full px-2 py-0.5 text-[11px] ${
                          commit.status === "current"
                            ? "bg-primary/10 text-primary"
                            : "bg-muted text-muted-foreground"
                        }`}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
