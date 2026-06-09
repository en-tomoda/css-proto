// ── データ定義 ──────────────────────────────────────────────────

const TOTAL_SCORE = 82;

const mindsets = [
  { label: "自己変革性", score: 82, detail: "コーチング・AI活用など継続的な自己研鑽が顕著。" },
  { label: "目標必達性", score: 78, detail: "独立・ICF取得など挑戦的目標を掲げ執着している。" },
  { label: "多様受容性", score: 85, detail: "技術・コーチング・AI と複数領域を柔軟に統合。" },
  { label: "周辺変革性", score: 70, detail: "チームリーダーとして組織改善に関与。発信はこれから。" },
  { label: "主観正義性", score: 65, detail: "問題意識は強いが、外部発信の頻度を高めたい。" },
  { label: "自発利他性", score: 80, detail: "1on1・メンタリングを通じて他者貢献を体現。" },
  { label: "Enjoy",      score: 88, detail: "仕事を楽しむ工夫と前向きな姿勢が対話から一貫して見られる。" },
];

const abilityGroups = [
  {
    name: "対人力",
    abilities: [
      { label: "好感演出力",  score: 80 },
      { label: "キモチ伝達力", score: 72 },
      { label: "対人傾聴力",  score: 88 },
      { label: "他者活用力",  score: 75 },
      { label: "対人大善力",  score: 70 },
    ],
  },
  {
    name: "発想力",
    abilities: [
      { label: "発想研磨力",        score: 78 },
      { label: "問題発見力",        score: 82 },
      { label: "改善アイデア発案力", score: 76 },
      { label: "新規アイデア創案力", score: 70 },
    ],
  },
  {
    name: "論理力",
    abilities: [
      { label: "問題分析力",   score: 80 },
      { label: "仮説検証力",   score: 75 },
      { label: "一般化力",     score: 72 },
      { label: "論理的表現力", score: 78 },
    ],
  },
  {
    name: "組織貢献力",
    abilities: [
      { label: "意志決定支援力",   score: 75 },
      { label: "理念共創力",       score: 70 },
      { label: "理念伝導力",       score: 68 },
      { label: "人財マネジメント力", score: 78 },
      { label: "組織標準化力",     score: 65 },
      { label: "組織目標推進力",   score: 72 },
      { label: "新規事業創出力",   score: 60 },
    ],
  },
];

const scoreHistory = [
  { period: "2024年4月",  score: 61 },
  { period: "2024年10月", score: 70 },
  { period: "2025年4月",  score: 75 },
  { period: "2025年10月", score: 79 },
  { period: "2026年6月",  score: 82 },
];

// ── レーダーチャート ────────────────────────────────────────────

function RadarChart({ data }: { data: { label: string; score: number }[] }) {
  const n   = data.length;
  const cx  = 160;
  const cy  = 165;
  const r   = 100;
  const rad = (i: number) => (i * 2 * Math.PI) / n - Math.PI / 2;
  const px  = (i: number, radius: number) => cx + radius * Math.cos(rad(i));
  const py  = (i: number, radius: number) => cy + radius * Math.sin(rad(i));

  const gridPolygon = (f: number) =>
    Array.from({ length: n }, (_, i) => `${px(i, r * f)},${py(i, r * f)}`).join(" ");

  const dataPolygon = data
    .map((d, i) => `${px(i, (r * d.score) / 100)},${py(i, (r * d.score) / 100)}`)
    .join(" ");

  return (
    <svg viewBox="0 0 320 330" className="w-full max-w-xs mx-auto">
      {[0.25, 0.5, 0.75, 1.0].map((f) => (
        <polygon key={f} points={gridPolygon(f)} className="fill-none stroke-border" strokeWidth={0.8} />
      ))}
      {Array.from({ length: n }, (_, i) => (
        <line key={i} x1={cx} y1={cy} x2={px(i, r)} y2={py(i, r)} className="stroke-border" strokeWidth={0.8} />
      ))}
      <polygon points={dataPolygon} className="fill-primary/15 stroke-primary" strokeWidth={1.5} />
      {data.map((d, i) => (
        <circle
          key={i}
          cx={px(i, (r * d.score) / 100)}
          cy={py(i, (r * d.score) / 100)}
          r={3.5}
          className="fill-primary"
        />
      ))}
      {data.map((d, i) => {
        const lx     = px(i, r + 20);
        const ly     = py(i, r + 20);
        const anchor = Math.abs(lx - cx) < 10 ? "middle" : lx > cx ? "start" : "end";
        const isEnjoy = d.label === "Enjoy";
        return (
          <text key={i} x={lx} y={ly} textAnchor={anchor} dominantBaseline="middle"
            className="fill-foreground" fontSize={isEnjoy ? 8 : 9}>
            {isEnjoy ? (
              <>
                <tspan x={lx} dy="-0.55em">Enjoy-</tspan>
                <tspan x={lx} dy="1.2em">Thinking</tspan>
              </>
            ) : d.label}
          </text>
        );
      })}
      {/* Score labels */}
      {data.map((d, i) => {
        const lx = px(i, (r * d.score) / 100 - 14);
        const ly = py(i, (r * d.score) / 100 - 14);
        return (
          <text key={`s${i}`} x={lx} y={ly} textAnchor="middle" dominantBaseline="middle"
            className="fill-primary" fontSize={8} fontWeight="600">
            {d.score}
          </text>
        );
      })}
    </svg>
  );
}

// ── スコアリング ────────────────────────────────────────────────

function ScoreRing({ score }: { score: number }) {
  const r = 28, circumference = 2 * Math.PI * r;
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" className="-rotate-90">
      <circle cx="40" cy="40" r={r} className="stroke-muted fill-none" strokeWidth="6" />
      <circle cx="40" cy="40" r={r} className="stroke-primary fill-none" strokeWidth="6"
        strokeDasharray={`${(score / 100) * circumference} ${circumference}`} strokeLinecap="round" />
    </svg>
  );
}

// ── メインコンポーネント ─────────────────────────────────────────

export function SelectabilityScoreCard() {
  const minScore = Math.min(...scoreHistory.map((h) => h.score));
  const maxScore = Math.max(...scoreHistory.map((h) => h.score));
  const range = maxScore - minScore || 1;

  return (
    <div className="rounded-2xl border border-border/70 bg-card shadow-sm">

      {/* ヘッダー */}
      <div className="flex items-center justify-between border-b border-border/70 px-5 py-4">
        <div>
          <p className="text-xs text-muted-foreground">総合評価</p>
          <h2 className="mt-0.5 text-lg font-semibold">キャリアセレクタビリティスコア</h2>
        </div>
        <span className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
          対話データから自動算出
        </span>
      </div>

      {/* 総合スコア + 推移 */}
      <div className="flex flex-wrap items-center gap-6 px-5 py-5">
        <div className="relative shrink-0">
          <ScoreRing score={TOTAL_SCORE} />
          <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold">
            {TOTAL_SCORE}
          </span>
        </div>
        <div className="flex-1">
          <p className="mb-2 text-xs text-muted-foreground">推移</p>
          <div className="flex items-end gap-2">
            {scoreHistory.map((h) => (
              <div key={h.period} className="flex flex-1 flex-col items-center gap-1">
                <span className="text-[10px] font-medium">{h.score}</span>
                <div
                  className={`w-full rounded-sm transition-all ${h.score === TOTAL_SCORE ? "bg-primary" : "bg-muted"}`}
                  style={{ height: `${((h.score - minScore) / range) * 40 + 8}px` }}
                />
                <span className="text-center text-[9px] leading-tight text-muted-foreground whitespace-pre-line">
                  {h.period.replace("年", "\n").replace("月", "")}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2カラム: 7つの考え方 ｜ 20の能力 */}
      <div className="grid grid-cols-1 border-t border-border/70 md:grid-cols-2">

        {/* 左: 7つの考え方 */}
        <div className="border-b border-border/70 px-5 py-5 md:border-b-0 md:border-r">
          <div className="mb-1 flex items-baseline justify-between">
            <p className="text-sm font-semibold">7つの考え方</p>
            <p className="text-xs text-muted-foreground">
              平均 {Math.round(mindsets.reduce((s, m) => s + m.score, 0) / mindsets.length)}
            </p>
          </div>
          <p className="mb-4 text-xs text-muted-foreground">キャリアセレクタビリティの土台となるマインドセット</p>

          <RadarChart data={mindsets} />

          <div className="mt-4 space-y-2">
            {mindsets.map((m) => (
              <div key={m.label}>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium">{m.label === "Enjoy" ? "Enjoy-Thinking" : m.label}</span>
                  <span className="font-semibold">{m.score}</span>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div className="h-1.5 rounded-full bg-primary" style={{ width: `${m.score}%` }} />
                </div>
                <p className="mt-0.5 text-[10px] leading-relaxed text-muted-foreground">{m.detail}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 右: 20の能力 */}
        <div className="px-5 py-5">
          <div className="mb-1 flex items-baseline justify-between">
            <p className="text-sm font-semibold">20の能力</p>
            <p className="text-xs text-muted-foreground">
              平均 {Math.round(
                abilityGroups.flatMap((g) => g.abilities).reduce((s, a) => s + a.score, 0) /
                abilityGroups.flatMap((g) => g.abilities).length
              )}
            </p>
          </div>
          <p className="mb-4 text-xs text-muted-foreground">対人力・発想力・論理力・組織貢献力の4領域</p>
          <div className="space-y-5">
            {abilityGroups.map((group) => {
              const avg = Math.round(group.abilities.reduce((s, a) => s + a.score, 0) / group.abilities.length);
              return (
                <div key={group.name}>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-semibold">{group.name}</span>
                    <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
                      平均 {avg}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {group.abilities.map((a) => (
                      <div key={a.label} className="grid grid-cols-[1fr_2fr_24px] items-center gap-2">
                        <span className="truncate text-[11px] text-muted-foreground">{a.label}</span>
                        <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                          <div className="h-1.5 rounded-full bg-primary transition-all" style={{ width: `${a.score}%` }} />
                        </div>
                        <span className="text-right text-[11px] font-medium">{a.score}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* 次のアクション */}
      <div className="border-t border-border/70 px-5 py-4">
        <p className="text-xs font-semibold text-muted-foreground">スコアを上げるために</p>
        <ul className="mt-2 space-y-1.5">
          {[
            "SNS・ブログで専門知識を週1回発信し、主観正義性・周辺変革性を高める",
            "コーチングセッションの事例を言語化・蓄積して新規事業創出力につなげる",
            "社外コミュニティへの参加で他者活用力・影響力の領域を広げる",
          ].map((action) => (
            <li key={action} className="flex items-start gap-2 text-xs">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              <span className="text-muted-foreground leading-relaxed">{action}</span>
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
}
