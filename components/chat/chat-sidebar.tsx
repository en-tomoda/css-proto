const todayInsights = [
  "新しい環境への不安と期待が共存している",
  "周囲との比較よりも自分の成長に目を向けたい",
];

const sessionStats = [
  { label: "ターン数",       value: "7"    },
  { label: "経過時間",       value: "4分"  },
  { label: "抽出キーワード", value: "2"    },
  { label: "連続記録",       value: "127日" },
];

const pastTopics = [
  { date: "5日前",   label: "キャリア転換の準備",          turns: 8  },
  { date: "12日前",  label: "強みの言語化",                turns: 11 },
  { date: "1ヶ月前", label: "ICFトレーニングへの向き合い", turns: 6  },
];

export const promptTemplates = [
  "次の3か月で目指すべき役割を整理したい",
  "今の強みを活かせるキャリア選択肢を知りたい",
  "疲弊せずに挑戦を続ける行動プランを作りたい",
  "自分のコーチングスタイルを言語化したい",
  "独立後の収益不安をどう乗り越えるか考えたい",
];

export function ChatSidebar({
  onSelectTemplate,
}: {
  onSelectTemplate: (text: string) => void;
}) {
  return (
    <div className="hidden w-72 shrink-0 flex-col overflow-y-auto border-l border-border/70 bg-card/50 xl:flex">

      <section className="border-b border-border/70 p-4">
        <h2 className="text-xs font-semibold text-muted-foreground">今日の気づき（抽出中）</h2>
        <ul className="mt-3 space-y-2">
          {todayInsights.map((insight) => (
            <li key={insight} className="flex items-start gap-2 rounded-lg bg-muted/60 px-3 py-2 text-xs leading-relaxed">
              <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-primary" />
              {insight}
            </li>
          ))}
        </ul>
      </section>

      <section className="border-b border-border/70 p-4">
        <h2 className="text-xs font-semibold text-muted-foreground">このセッション</h2>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {sessionStats.map((item) => (
            <div key={item.label} className="rounded-lg bg-muted/60 px-3 py-2">
              <p className="text-[10px] text-muted-foreground">{item.label}</p>
              <p className="mt-0.5 text-sm font-semibold">{item.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-b border-border/70 p-4">
        <h2 className="text-xs font-semibold text-muted-foreground">テンプレートから始める</h2>
        <ul className="mt-3 space-y-1.5">
          {promptTemplates.map((tpl) => (
            <li
              key={tpl}
              onClick={() => onSelectTemplate(tpl)}
              className="cursor-pointer rounded-lg bg-muted/60 px-3 py-2 text-xs leading-relaxed transition hover:bg-primary hover:text-primary-foreground"
            >
              {tpl}
            </li>
          ))}
        </ul>
      </section>

      <section className="p-4">
        <h2 className="text-xs font-semibold text-muted-foreground">過去のセッション</h2>
        <ul className="mt-3 space-y-2">
          {pastTopics.map((topic) => (
            <li key={topic.label} className="cursor-pointer rounded-xl border border-border/70 px-3 py-2.5 transition hover:bg-muted/50">
              <p className="text-xs font-medium leading-snug">{topic.label}</p>
              <p className="mt-0.5 text-[10px] text-muted-foreground">
                {topic.date} · {topic.turns}ターン
              </p>
            </li>
          ))}
        </ul>
      </section>

    </div>
  );
}
