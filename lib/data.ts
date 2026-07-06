export type Role = "member" | "manager" | "admin";

export type DisclosureKey = "goal" | "pastActions" | "currentActions";
export type DisclosureState = "locked" | "requested" | "approved";

export type WeeklyAction = {
  id: string;
  title: string;
  done: boolean;
  /** アクションが継続している週数（4以上で深掘り通知の対象） */
  carriedWeeks: number;
};

export type PastAction = {
  title: string;
  completedAt: string;
};

export type Reflection = {
  /** 対象期間（例: 6/22〜6/28） */
  period: string;
  achieved: number;
  total: number;
  note: string;
  /** その週にAIと行った振り返りチャットの要約 */
  chatSummary: {
    talked: string[];
    insights: string[];
    nextSteps: string[];
  };
};

export type GoalEntry = {
  goal: string;
  careerPath: string;
  setAt: string; // YYYY-MM-DD
};

export type CancelledAction = {
  title: string;
  reason: string;
  note?: string;
  cancelledAt: string; // YYYY-MM-DD
};

/** アクションをキャンセルする際の理由の選択肢 */
export const CANCEL_REASONS = [
  "物理的に実施が難しい",
  "今の業務と優先度が合わない",
  "気が進まない・やりたくない",
  "その他",
];

/** キャンセル時に代わりに提案されるアクションのプール */
export const REPLACEMENT_ACTIONS = [
  "1on1で上司に今週の学びを1つ共有する",
  "先輩の商談メモを読んで気づきを3つ書き出す",
  "チームの朝会で改善提案を1つ出す",
  "社内ナレッジに営業Tipsを1本投稿する",
];

/** デモ上の上司（「みたい」を送ってくる人） */
export const MANAGER_NAME = "佐藤 拓也";

export type TaScale = {
  label: string;
  value: number; // 偏差値・得点（おおむね20-90）
};

export type TaProfile = {
  /** 認知特性から導かれるタイプ名（例：フロントランナー） */
  type: string;
  typeDescription: string;
  /** 性格特性（偏差値）：主体性・変革性・外向性・持続性・協調性 */
  personality: TaScale[];
  /** 創造的思考性：発想性（拡散思考）・論理性（収束思考） */
  creativity: TaScale[];
  /** コミュニケーション力：意思伝達力・論理的表現力・好感表現力・対人調和力 */
  communication: TaScale[];
  /** キャリアタイプ指向性（得点） */
  careerTypes: TaScale[];
  /** 認知特性：0=事実/論理寄り 100=直観/感覚寄り */
  cognition: { perception: number; judgement: number };
  /** 総合特徴のやさしい要約 */
  summary: string;
  strengths: string[];
  cautions: string[];
  communicationHint: string;
};

export type Member = {
  id: string;
  name: string;
  kana: string;
  department: string;
  title: string;
  joinYear: number;
  goal: string;
  careerPath: string;
  ta: TaProfile;
  usage: {
    loginDays: number;
    chatCount: number;
    chatPerWeek: number;
    achievedActions: number;
  };
  pastActions: PastAction[];
  currentActions: WeeklyAction[];
  reflections: Reflection[];
  /** 目標の変遷（古い順、末尾が現在の目標） */
  goalHistory: GoalEntry[];
  /** キャンセルしたアクション（理由付き） */
  cancelledActions: CancelledAction[];
  disclosure: Record<DisclosureKey, DisclosureState>;
};

export const DISCLOSURE_LABELS: Record<DisclosureKey, string> = {
  goal: "目標",
  pastActions: "達成したアクション（過去の実績）",
  currentActions: "現在チャレンジ中のアクション",
};

export const CAREER_PATHS = [
  "マネジメント（チームリーダー→マネージャー）",
  "スペシャリスト（専門性を極める）",
  "プロジェクトマネージャー",
  "新規事業・企画職",
  "コンサルタント・顧客折衝のプロ",
];

/** ログインユーザー（メンバーロール時の本人） = m1 田中 */
export const CURRENT_USER_ID = "m1";

export const MEMBERS: Member[] = [
  {
    id: "m1",
    name: "田中 悠人",
    kana: "たなか ゆうと",
    department: "営業第一部",
    title: "メンバー（入社3年目）",
    joinYear: 2023,
    goal: "1年後にチームリーダーとして3名のメンバーを牽引できる状態になる",
    careerPath: "マネジメント（チームリーダー→マネージャー）",
    ta: {
      type: "フロントランナー",
      typeDescription:
        "全体を把握して素早く積極的に動く行動派タイプ。「良い」と感じたものには直観的にすぐ対応でき、自分の気持ちに素直に周囲と関われます。いっぽうで、詳細を確認せず感覚で進めてしまうことも。",
      personality: [
        { label: "主体性", value: 68 },
        { label: "変革性", value: 55 },
        { label: "外向性", value: 72 },
        { label: "持続性", value: 60 },
        { label: "協調性", value: 52 },
      ],
      creativity: [
        { label: "発想性（拡散思考）", value: 62 },
        { label: "論理性（収束思考）", value: 48 },
      ],
      communication: [
        { label: "意思伝達力", value: 65 },
        { label: "論理的表現力", value: 48 },
        { label: "好感表現力", value: 58 },
        { label: "対人調和力", value: 55 },
      ],
      careerTypes: [
        { label: "経営幹部", value: 78 },
        { label: "チャレンジャー", value: 75 },
        { label: "アントレプレナー", value: 62 },
        { label: "自立", value: 58 },
        { label: "社会奉仕", value: 50 },
        { label: "スペシャリスト", value: 45 },
        { label: "私生活重視", value: 42 },
        { label: "安定志向", value: 40 },
      ],
      cognition: { perception: 62, judgement: 60 },
      summary:
        "自分の意思で判断し、実現に向かって積極的に動ける主体者タイプ。人を巻き込みながら成果を出すことにやりがいを感じます。スピードが持ち味な分、走り出す前にひと呼吸おくと、さらに安定感が増しそうです。",
      strengths: ["目標に向かって粘り強く行動できる", "周囲を巻き込む推進力がある"],
      cautions: ["慎重さに欠け、見切り発車になることがある", "負荷が高い時に抱え込みやすい"],
      communicationHint:
        "結論から伝えると響きやすいタイプ。細かい指示より「任せて見守る」スタンスが効果的です。",
    },
    usage: { loginDays: 42, chatCount: 58, chatPerWeek: 4.2, achievedActions: 21 },
    pastActions: [
      { title: "後輩1名のOJT担当として週次1on1を実施", completedAt: "2026-06-19" },
      { title: "チーム定例のファシリテーターを3回担当", completedAt: "2026-06-05" },
      { title: "リーダーシップ研修（社内）を受講", completedAt: "2026-05-22" },
    ],
    currentActions: [
      { id: "a1", title: "後輩の商談に同席してフィードバックを渡す", done: true, carriedWeeks: 1 },
      { id: "a2", title: "チームの週次数値レポートを自分がまとめて共有する", done: false, carriedWeeks: 1 },
      { id: "a3", title: "上司にリーダー登用の要件をヒアリングする", done: false, carriedWeeks: 4 },
    ],
    reflections: [
      {
        period: "6/22〜6/28",
        achieved: 2,
        total: 3,
        note: "後輩の商談同席でフィードバックの伝え方に手応え。要件ヒアリングは切り出せず持ち越し。",
        chatSummary: {
          talked: [
            "後輩の商談に同席した際のフィードバックの伝え方について",
            "リーダー登用の要件を上司に聞けずにいる理由の深掘り",
          ],
          insights: [
            "指摘より先に良かった点を伝えると、後輩の受け止め方が大きく変わる",
            "要件ヒアリングを切り出せないのは「評価を下げられる不安」が原因だと気づいた",
          ],
          nextSteps: [
            "次回1on1の冒頭5分で「キャリアの相談」と枠を決めて切り出す",
          ],
        },
      },
      {
        period: "6/15〜6/21",
        achieved: 3,
        total: 3,
        note: "全部完了！チーム定例のファシリを任せてもらえて、まとめ役の楽しさに気づいた週。",
        chatSummary: {
          talked: [
            "チーム定例のファシリテーションをやってみた感想",
            "3件すべて完了できた要因の整理",
          ],
          insights: [
            "議論を整理して次の一歩を決める「まとめ役」に強いやりがいを感じる",
            "朝イチにアクションの時間を確保すると完了率が上がる",
          ],
          nextSteps: [
            "ファシリテーションを定例で継続的に担当させてもらう",
          ],
        },
      },
      {
        period: "6/8〜6/14",
        achieved: 2,
        total: 3,
        note: "リーダーシップ研修の学びを1on1で実践。数値レポートは時間切れ、朝イチにやると決めた。",
        chatSummary: {
          talked: [
            "リーダーシップ研修で学んだ「傾聴」の1on1での実践",
            "数値レポートが後回しになってしまう時間の使い方",
          ],
          insights: [
            "アドバイスを急がず聞き切るだけで、後輩が自分で答えにたどり着く",
            "重要だが緊急でないタスクは午前中に固定するのが自分に合う",
          ],
          nextSteps: [
            "毎週月曜の朝30分を数値レポートの時間としてカレンダーに固定する",
          ],
        },
      },
    ],
    goalHistory: [
      {
        goal: "担当顧客の年間目標を達成し、部内で頼られる存在になる",
        careerPath: "マネジメント（チームリーダー→マネージャー）",
        setAt: "2026-04-06",
      },
      {
        goal: "1年後にチームリーダーとして3名のメンバーを牽引できる状態になる",
        careerPath: "マネジメント（チームリーダー→マネージャー）",
        setAt: "2026-06-01",
      },
    ],
    cancelledActions: [
      {
        title: "部門横断の勉強会を主催する",
        reason: "物理的に実施が難しい",
        note: "今期は繁忙期と重なり時間の確保ができないため",
        cancelledAt: "2026-06-10",
      },
    ],
    disclosure: { goal: "locked", pastActions: "locked", currentActions: "locked" },
  },
  {
    id: "m2",
    name: "佐藤 美咲",
    kana: "さとう みさき",
    department: "営業第一部",
    title: "メンバー（入社5年目）",
    joinYear: 2021,
    goal: "採用領域の専門性を高め、社内で一番の提案品質を持つスペシャリストになる",
    careerPath: "スペシャリスト（専門性を極める）",
    ta: {
      type: "インベスティゲーター",
      typeDescription:
        "情報を細かく確認し、論理的かつ主体的に考える追究派タイプ。事実やデータを丁寧に読み解きながら、納得できるまで考え抜くことができます。じっくり向き合う分、スピードより質を大切にします。",
      personality: [
        { label: "主体性", value: 55 },
        { label: "変革性", value: 42 },
        { label: "外向性", value: 48 },
        { label: "持続性", value: 70 },
        { label: "協調性", value: 66 },
      ],
      creativity: [
        { label: "発想性（拡散思考）", value: 52 },
        { label: "論理性（収束思考）", value: 68 },
      ],
      communication: [
        { label: "意思伝達力", value: 46 },
        { label: "論理的表現力", value: 64 },
        { label: "好感表現力", value: 50 },
        { label: "対人調和力", value: 62 },
      ],
      careerTypes: [
        { label: "スペシャリスト", value: 82 },
        { label: "安定志向", value: 60 },
        { label: "社会奉仕", value: 58 },
        { label: "私生活重視", value: 55 },
        { label: "自立", value: 52 },
        { label: "チャレンジャー", value: 48 },
        { label: "経営幹部", value: 45 },
        { label: "アントレプレナー", value: 40 },
      ],
      cognition: { perception: 38, judgement: 30 },
      summary:
        "コツコツと粘り強く積み上げていく努力家タイプ。相手の気持ちを汲み取りながら、丁寧に信頼を築いていけます。完璧を目指しすぎて時間がかかることがあるので、「70点で出してみる」練習をすると世界が広がりそうです。",
      strengths: ["丁寧な準備と分析力", "相手の意図を汲み取るヒアリング力"],
      cautions: ["完璧を求めすぎてスピードが落ちることがある"],
      communicationHint:
        "考える時間を与えてから意見を求めると本領を発揮します。急な指名は苦手な傾向。",
    },
    usage: { loginDays: 61, chatCount: 34, chatPerWeek: 2.5, achievedActions: 33 },
    pastActions: [
      { title: "業界研究レポートを月1本作成し部内共有", completedAt: "2026-06-26" },
      { title: "提案書レビュー会を立ち上げ", completedAt: "2026-06-12" },
    ],
    currentActions: [
      { id: "a1", title: "大型案件の提案書を先輩とペアで作成する", done: true, carriedWeeks: 1 },
      { id: "a2", title: "競合3社のサービス比較をまとめる", done: true, carriedWeeks: 1 },
      { id: "a3", title: "社外セミナーに1回参加する", done: false, carriedWeeks: 2 },
    ],
    reflections: [
      {
        period: "6/22〜6/28",
        achieved: 3,
        total: 3,
        note: "提案書のペア作成で先輩の型を吸収できた。競合比較も好評。",
        chatSummary: {
          talked: [
            "先輩とのペア作成で学んだ提案書の構成の型",
            "競合比較資料への反応と改善点",
          ],
          insights: [
            "冒頭に顧客の課題仮説を置くと提案全体の説得力が上がる",
          ],
          nextSteps: [
            "学んだ型を自分のテンプレートとして整理し、次の案件で単独適用する",
          ],
        },
      },
      {
        period: "6/15〜6/21",
        achieved: 2,
        total: 3,
        note: "レビュー会の運営が定着してきた。セミナー参加は日程が合わず翌週へ。",
        chatSummary: {
          talked: [
            "提案書レビュー会の運営で工夫していること",
            "セミナー参加の日程調整の難しさ",
          ],
          insights: [
            "レビュー観点を事前共有すると議論の質が安定する",
          ],
          nextSteps: [
            "セミナーは月初に3候補まとめて申し込み、予定を先に確保する",
          ],
        },
      },
    ],
    goalHistory: [
      { goal: "採用領域の専門性を高め、社内で一番の提案品質を持つスペシャリストになる", careerPath: "スペシャリスト（専門性を極める）", setAt: "2026-04-06" },
    ],
    cancelledActions: [],
    disclosure: { goal: "approved", pastActions: "approved", currentActions: "approved" },
  },
  {
    id: "m3",
    name: "鈴木 大輝",
    kana: "すずき だいき",
    department: "営業第二部",
    title: "メンバー（入社2年目）",
    joinYear: 2024,
    goal: "まず担当顧客20社で信頼される担当者になり、その後PM職に挑戦する",
    careerPath: "プロジェクトマネージャー",
    ta: {
      type: "サポーター",
      typeDescription:
        "状況を細かく確認し、配慮の上でフォローアップする支援者タイプ。まわりの気持ちの変化に気づきやすく、そっと支える動きが自然にできます。にぎやかな場より、落ち着いた環境で力を発揮します。",
      personality: [
        { label: "主体性", value: 45 },
        { label: "変革性", value: 58 },
        { label: "外向性", value: 38 },
        { label: "持続性", value: 62 },
        { label: "協調性", value: 55 },
      ],
      creativity: [
        { label: "発想性（拡散思考）", value: 72 },
        { label: "論理性（収束思考）", value: 50 },
      ],
      communication: [
        { label: "意思伝達力", value: 38 },
        { label: "論理的表現力", value: 45 },
        { label: "好感表現力", value: 42 },
        { label: "対人調和力", value: 58 },
      ],
      careerTypes: [
        { label: "スペシャリスト", value: 68 },
        { label: "自立", value: 62 },
        { label: "私生活重視", value: 58 },
        { label: "社会奉仕", value: 55 },
        { label: "安定志向", value: 55 },
        { label: "アントレプレナー", value: 50 },
        { label: "チャレンジャー", value: 45 },
        { label: "経営幹部", value: 35 },
      ],
      cognition: { perception: 42, judgement: 62 },
      summary:
        "アイデアの引き出しが多く、コツコツ続けられる継続力も持ち合わせています。感受性が豊かな分、失敗を引きずってしまうことも。うまくいったことを言葉にして残していくと、自信が積み上がっていくタイプです。",
      strengths: ["新しい切り口を考えるアイデア力", "コツコツ積み上げる継続力"],
      cautions: ["自信を失いやすく、失敗を引きずる傾向", "対人ストレスに注意"],
      communicationHint:
        "人前での指摘はNG。1on1でプロセスを承認しながら伝えると前向きになれます。",
    },
    usage: { loginDays: 18, chatCount: 9, chatPerWeek: 0.8, achievedActions: 6 },
    pastActions: [{ title: "既存顧客10社への定期訪問を完了", completedAt: "2026-05-29" }],
    currentActions: [
      { id: "a1", title: "週1回、先輩に商談ロープレを依頼する", done: false, carriedWeeks: 5 },
      { id: "a2", title: "顧客への提案数を週3件にする", done: false, carriedWeeks: 5 },
      { id: "a3", title: "業務の振り返りを毎週金曜に書く", done: true, carriedWeeks: 1 },
    ],
    reflections: [
      {
        period: "6/22〜6/28",
        achieved: 1,
        total: 3,
        note: "ロープレをお願いするタイミングが掴めなかった。金曜の振り返りは続いている。",
        chatSummary: {
          talked: [
            "先輩にロープレをお願いできなかった1週間の振り返り",
            "毎週金曜の振り返り習慣が続いている理由",
          ],
          insights: [
            "「忙しそうだから」と遠慮するのは自分の思い込みかもしれない",
            "小さくても続いている習慣があることは自信にしていい",
          ],
          nextSteps: [
            "ロープレの依頼を口頭ではなくチャットで送ってみる（心理的ハードルを下げる）",
          ],
        },
      },
    ],
    goalHistory: [
      { goal: "まず担当顧客20社で信頼される担当者になり、その後PM職に挑戦する", careerPath: "プロジェクトマネージャー", setAt: "2026-04-13" },
    ],
    cancelledActions: [],
    disclosure: { goal: "approved", pastActions: "locked", currentActions: "requested" },
  },
  {
    id: "m4",
    name: "高橋 結衣",
    kana: "たかはし ゆい",
    department: "営業第二部",
    title: "メンバー（入社4年目）",
    joinYear: 2022,
    goal: "新規事業コンテストで企画を通し、事業開発チームへ異動する",
    careerPath: "新規事業・企画職",
    ta: {
      type: "ディレクター",
      typeDescription:
        "要点を掴んで合理的かつ主体的に対応する指示役タイプ。全体像から本質を素早く見抜き、まわりを巻き込みながらぐいぐい前に進めていけます。熱量が高い分、興味が移ろいやすい一面も。",
      personality: [
        { label: "主体性", value: 75 },
        { label: "変革性", value: 78 },
        { label: "外向性", value: 74 },
        { label: "持続性", value: 45 },
        { label: "協調性", value: 42 },
      ],
      creativity: [
        { label: "発想性（拡散思考）", value: 76 },
        { label: "論理性（収束思考）", value: 55 },
      ],
      communication: [
        { label: "意思伝達力", value: 68 },
        { label: "論理的表現力", value: 52 },
        { label: "好感表現力", value: 60 },
        { label: "対人調和力", value: 45 },
      ],
      careerTypes: [
        { label: "アントレプレナー", value: 85 },
        { label: "チャレンジャー", value: 76 },
        { label: "自立", value: 70 },
        { label: "経営幹部", value: 65 },
        { label: "社会奉仕", value: 52 },
        { label: "スペシャリスト", value: 40 },
        { label: "私生活重視", value: 38 },
        { label: "安定志向", value: 30 },
      ],
      cognition: { perception: 75, judgement: 42 },
      summary:
        "圧倒的な行動量とゼロイチの発想力が持ち味。新しい挑戦の場があるほど輝きます。アイデアを形にして続ける「仕組みづくり」は苦手意識があるので、得意な人と組むとお互いに最強になれるタイプです。",
      strengths: ["行動量とスピード", "ゼロから企画を立ち上げる発想力"],
      cautions: ["飽きっぽく、仕組み化・継続が苦手", "周囲との温度差が生まれやすい"],
      communicationHint:
        "裁量を与えるほど伸びるタイプ。ルールで縛るより「目的」で合意すると動きやすい。",
    },
    usage: { loginDays: 55, chatCount: 71, chatPerWeek: 5.1, achievedActions: 28 },
    pastActions: [
      { title: "新規事業コンテストの一次審査を通過", completedAt: "2026-06-20" },
      { title: "社内の若手企画コミュニティを発足", completedAt: "2026-04-17" },
    ],
    currentActions: [
      { id: "a1", title: "事業計画の収支シミュレーションを作る", done: false, carriedWeeks: 1 },
      { id: "a2", title: "想定ユーザー5名にヒアリングする", done: true, carriedWeeks: 1 },
      { id: "a3", title: "メンターに壁打ちを依頼する", done: true, carriedWeeks: 1 },
    ],
    reflections: [
      {
        period: "6/22〜6/28",
        achieved: 3,
        total: 3,
        note: "ユーザーヒアリングで想定外のニーズを発見。企画の方向を少し修正。",
        chatSummary: {
          talked: [
            "ユーザーヒアリング5件から見えた想定外のニーズ",
            "企画の方向修正の判断について",
          ],
          insights: [
            "自分の仮説に固執せず、事実に合わせて方向を変える柔軟さが企画の強さになる",
          ],
          nextSteps: [
            "修正した企画方針でメンターに壁打ちを依頼する",
          ],
        },
      },
      {
        period: "6/15〜6/21",
        achieved: 3,
        total: 3,
        note: "一次審査通過！勢いのまま二次に向けた準備に着手。",
        chatSummary: {
          talked: [
            "新規事業コンテスト一次審査の通過要因の分析",
            "二次審査に向けた準備の優先順位",
          ],
          insights: [
            "審査員に響いたのは市場規模より「原体験に基づく課題の切実さ」だった",
          ],
          nextSteps: [
            "二次審査までに収支シミュレーションを完成させる",
          ],
        },
      },
    ],
    goalHistory: [
      { goal: "新規事業コンテストで企画を通し、事業開発チームへ異動する", careerPath: "新規事業・企画職", setAt: "2026-04-06" },
    ],
    cancelledActions: [],
    disclosure: { goal: "requested", pastActions: "locked", currentActions: "locked" },
  },
  {
    id: "m5",
    name: "伊藤 健",
    kana: "いとう けん",
    department: "営業第一部",
    title: "メンバー（入社6年目）",
    joinYear: 2020,
    goal: "顧客の経営課題に踏み込める提案型コンサルタントに転身する",
    careerPath: "コンサルタント・顧客折衝のプロ",
    ta: {
      type: "ディフェンダー",
      typeDescription:
        "情報を細かく確認し、論理的にフォローアップする守備派タイプ。感情に流されず、筋道を立てた安定感のある判断でチームを支えられます。変化の激しい場面でも、周囲に安心感を与えられる存在です。",
      personality: [
        { label: "主体性", value: 52 },
        { label: "変革性", value: 35 },
        { label: "外向性", value: 50 },
        { label: "持続性", value: 68 },
        { label: "協調性", value: 62 },
      ],
      creativity: [
        { label: "発想性（拡散思考）", value: 44 },
        { label: "論理性（収束思考）", value: 66 },
      ],
      communication: [
        { label: "意思伝達力", value: 50 },
        { label: "論理的表現力", value: 62 },
        { label: "好感表現力", value: 45 },
        { label: "対人調和力", value: 60 },
      ],
      careerTypes: [
        { label: "安定志向", value: 72 },
        { label: "スペシャリスト", value: 66 },
        { label: "社会奉仕", value: 60 },
        { label: "私生活重視", value: 55 },
        { label: "自立", value: 50 },
        { label: "経営幹部", value: 48 },
        { label: "チャレンジャー", value: 42 },
        { label: "アントレプレナー", value: 35 },
      ],
      cognition: { perception: 35, judgement: 32 },
      summary:
        "論理的で安定感のある対応と、長く続く信頼関係づくりが持ち味。石橋を叩いて渡る堅実さがある分、新しい挑戦は先送りしがちです。「小さく試す」ことから始めると、変化も味方につけられるタイプです。",
      strengths: ["論理的で安定感のある対応", "長期的な信頼関係の構築力"],
      cautions: ["変化への腰が重く、新しい挑戦を先送りしがち"],
      communicationHint:
        "納得感を重視するタイプ。背景・理由をセットで伝えると合意形成がスムーズです。",
    },
    usage: { loginDays: 30, chatCount: 15, chatPerWeek: 1.2, achievedActions: 12 },
    pastActions: [{ title: "財務3表の基礎講座を修了", completedAt: "2026-06-01" }],
    currentActions: [
      { id: "a1", title: "担当顧客の中期経営計画を読み込み論点を出す", done: false, carriedWeeks: 2 },
      { id: "a2", title: "経営層との商談に月2回同席する", done: false, carriedWeeks: 2 },
      { id: "a3", title: "提案の型を1つ資料化する", done: true, carriedWeeks: 1 },
    ],
    reflections: [
      {
        period: "6/22〜6/28",
        achieved: 1,
        total: 3,
        note: "提案の型を資料化できた。経営計画の読み込みは半分まで。",
        chatSummary: {
          talked: [
            "提案の型を資料化してみた手応え",
            "中期経営計画の読み込みが進まない要因",
          ],
          insights: [
            "自分の暗黙知を資料にすると、チームへの貢献実感が得られる",
            "大きなインプットは分割して予定に組み込まないと進まない",
          ],
          nextSteps: [
            "経営計画の読み込みを1日10ページに分割して昼休み後に実施する",
          ],
        },
      },
    ],
    goalHistory: [
      { goal: "顧客の経営課題に踏み込める提案型コンサルタントに転身する", careerPath: "コンサルタント・顧客折衝のプロ", setAt: "2026-05-11" },
    ],
    cancelledActions: [],
    disclosure: { goal: "locked", pastActions: "locked", currentActions: "locked" },
  },
];

export type AccountStatus = "active" | "invited" | "suspended";

export type Account = {
  id: string;
  name: string;
  email: string;
  /** 権限は複数持てる（例: 管理者かつ上司） */
  roles: Role[];
  department: string;
  status: AccountStatus;
  /** 紐づく上司のアカウントID（メンバー権限を持つ場合のみ） */
  managerId?: string;
};

export const ACCOUNTS: Account[] = [
  { id: "u1", name: "田中 悠人", email: "tanaka@example.co.jp", roles: ["member"], department: "営業第一部", status: "active", managerId: "u6" },
  { id: "u2", name: "佐藤 美咲", email: "sato@example.co.jp", roles: ["member"], department: "営業第一部", status: "active", managerId: "u6" },
  { id: "u3", name: "鈴木 大輝", email: "suzuki@example.co.jp", roles: ["member"], department: "営業第二部", status: "active", managerId: "u6" },
  { id: "u4", name: "高橋 結衣", email: "takahashi@example.co.jp", roles: ["member"], department: "営業第二部", status: "active", managerId: "u6" },
  { id: "u5", name: "伊藤 健", email: "ito@example.co.jp", roles: ["member"], department: "営業第一部", status: "active", managerId: "u6" },
  { id: "u6", name: "佐藤 拓也", email: "sato.takuya@example.co.jp", roles: ["manager", "admin"], department: "営業第一部", status: "active" },
  { id: "u7", name: "管理 太郎", email: "admin@example.co.jp", roles: ["admin"], department: "人事部", status: "invited" },
  { id: "u8", name: "渡辺 直樹", email: "watanabe@example.co.jp", roles: ["manager"], department: "営業第二部", status: "active" },
  { id: "u9", name: "小林 遥", email: "kobayashi@example.co.jp", roles: ["member"], department: "営業第二部", status: "active", managerId: "u8" },
  { id: "u10", name: "加藤 翔太", email: "kato@example.co.jp", roles: ["member"], department: "営業第二部", status: "active", managerId: "u8" },
  { id: "u11", name: "中村 由依", email: "nakamura@example.co.jp", roles: ["member"], department: "マーケティング部", status: "active", managerId: "u8" },
  { id: "u12", name: "山口 健一", email: "yamaguchi@example.co.jp", roles: ["member"], department: "営業第一部", status: "invited", managerId: "u6" },
  { id: "u13", name: "松本 彩", email: "matsumoto@example.co.jp", roles: ["member"], department: "カスタマーサクセス部", status: "suspended" },
  { id: "u14", name: "井上 拓", email: "inoue@example.co.jp", roles: ["manager", "admin"], department: "マーケティング部", status: "active" },
  { id: "u15", name: "斎藤 美穂", email: "saito@example.co.jp", roles: ["member"], department: "マーケティング部", status: "active", managerId: "u14" },
  { id: "u16", name: "情シス 花子", email: "jyoshis@example.co.jp", roles: ["admin"], department: "情報システム部", status: "active" },
  { id: "u17", name: "岡田 涼", email: "okada@example.co.jp", roles: ["member"], department: "営業第一部", status: "active", managerId: "u6" },
  { id: "u18", name: "藤井 千夏", email: "fujii@example.co.jp", roles: ["member"], department: "営業第一部", status: "active", managerId: "u6" },
  { id: "u19", name: "後藤 大和", email: "goto@example.co.jp", roles: ["member"], department: "営業第二部", status: "active", managerId: "u8" },
  { id: "u20", name: "石川 美月", email: "ishikawa@example.co.jp", roles: ["member"], department: "営業第二部", status: "invited", managerId: "u8" },
  { id: "u21", name: "前田 陽介", email: "maeda@example.co.jp", roles: ["member"], department: "マーケティング部", status: "active", managerId: "u14" },
  { id: "u22", name: "岡本 さくら", email: "okamoto@example.co.jp", roles: ["member"], department: "カスタマーサクセス部", status: "active", managerId: "u8" },
  { id: "u23", name: "長谷川 亮", email: "hasegawa@example.co.jp", roles: ["manager"], department: "カスタマーサクセス部", status: "active" },
  { id: "u24", name: "森田 香織", email: "morita@example.co.jp", roles: ["member"], department: "カスタマーサクセス部", status: "active", managerId: "u23" },
  { id: "u25", name: "村上 隼人", email: "murakami@example.co.jp", roles: ["member"], department: "営業第一部", status: "suspended" },
  { id: "u26", name: "近藤 麻衣", email: "kondo@example.co.jp", roles: ["member"], department: "マーケティング部", status: "active", managerId: "u14" },
  { id: "u27", name: "坂本 悠真", email: "sakamoto@example.co.jp", roles: ["member"], department: "営業第二部", status: "active", managerId: "u8" },
  { id: "u28", name: "人事 一郎", email: "jinji@example.co.jp", roles: ["admin"], department: "人事部", status: "active" },
];

/** アンロック数(0-3) → 関係値レベル */
export const RELATIONSHIP_LEVELS = [
  { level: 1, label: "はじめまして", note: "まずは基本情報とTAから理解を深めましょう" },
  { level: 2, label: "顔見知り", note: "目標が見えてきました。1on1で話題にしてみましょう" },
  { level: 3, label: "信頼関係", note: "取り組みが見えています。具体的な支援ができる関係です" },
  { level: 4, label: "パートナー", note: "全情報が開示されています。伴走者として支援しましょう" },
];
