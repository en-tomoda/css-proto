export function TimelineHeader() {
  return (
    <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs text-muted-foreground">キャリアコミット履歴</p>
          <h1 className="mt-0.5 text-xl font-semibold">あなたの価値観と目標の変化</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            対話から自動抽出された、思考の積み重ね。
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold">8</p>
          <p className="text-xs text-muted-foreground">コミット</p>
        </div>
      </div>
    </div>
  );
}
