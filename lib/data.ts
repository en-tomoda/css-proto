export type Role = "member" | "manager" | "admin";

export type DisclosureKey =
  | "goal"
  | "pastActions"
  | "currentActions"
  | "reflections";
export type DisclosureState = "locked" | "requested" | "approved";

export type WeeklyAction = {
  id: string;
  title: string;
  done: boolean;
  /** アクションが継続している週数（4以上で深掘り通知の対象） */
  carriedWeeks: number;
  /** このアクションが高めるCSA項目（CSA_ITEMSのname） */
  csaKeys: string[];
};

export type PastAction = {
  title: string;
  completedAt: string;
};

export type Reflection = {
  /** 対象期間（例: 6/22〜6/28） */
  period: string;
  /** 週の開始日 YYYY-MM-DD（カレンダー表示用） */
  weekStart: string;
  /** 実際に振り返りを行った日 YYYY-MM-DD（カレンダーのドット表示用） */
  recordedAt: string;
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

/** AIから見た人物像（デジタルツイン）。会話や活動が増えるほど解像度が上がる想定 */
export type TwinInsight = {
  headline: string;            // 一言キャッチ
  portrait: string;            // AIから見た人物像（プロフィール文）
  tags: string[];              // キーワード
  hiddenQuestions: string[];   // まだ言語化できていない問い（チャット誘導）
  /** ナビが提示する、いま強化中のCSA項目（CSA_ITEMSのname） */
  focusCsa: string[];
  /** ナビが提示する、課題に感じているCSA項目 */
  challengeCsa: string[];
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

/** 情報をロックに戻す際の理由の選択肢 */
export const LOCK_REASONS = [
  "目標を見直し中のため",
  "内容を更新してから見せたいため",
  "いったん自分だけで整理したいため",
  "その他",
];

/** メンバーの操作を上司に知らせる通知 */
export type ManagerNotice = {
  id: string;
  memberId: string;
  memberName: string;
  key: DisclosureKey;
  reason?: string;
  at: string; // YYYY-MM-DD
};

export const MANAGER_NOTICES: ManagerNotice[] = [
  {
    id: "n1",
    memberId: "m3",
    memberName: "鈴木 大輝",
    key: "pastActions",
    reason: "いったん自分だけで整理したいため",
    at: "2026-07-01",
  },
];

/** 日本の祝日（YYYY-MM-DD → 名称）。デモ用に2026年の主要な祝日を収録 */
export const JP_HOLIDAYS_2026: Record<string, string> = {
  "2026-01-01": "元日",
  "2026-01-12": "成人の日",
  "2026-02-11": "建国記念の日",
  "2026-02-23": "天皇誕生日",
  "2026-03-20": "春分の日",
  "2026-04-29": "昭和の日",
  "2026-05-03": "憲法記念日",
  "2026-05-04": "みどりの日",
  "2026-05-05": "こどもの日",
  "2026-05-06": "振替休日",
  "2026-07-20": "海の日",
  "2026-08-11": "山の日",
  "2026-09-21": "敬老の日",
  "2026-09-22": "国民の休日",
  "2026-09-23": "秋分の日",
  "2026-10-12": "スポーツの日",
  "2026-11-03": "文化の日",
  "2026-11-23": "勤労感謝の日",
};

/** AIマスコットの名前（暫定・汎用。あとで正式名称に差し替え可） */
export const MASCOT_NAME = "ナビ";

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
  /** AIから見た人物像（デジタルツイン） */
  twin: TwinInsight;
  disclosure: Record<DisclosureKey, DisclosureState>;
};

/** デジタルツインの解像度（0-100）。会話・振り返り・アクションが増えるほど上がる */
export function buildTwinResolution(m: Member): number {
  let r = 8; // 初回設定済み
  r += 15; // TA受検済み
  r += Math.min(25, m.usage.chatCount * 0.35);
  r += Math.min(15, m.reflections.length * 4);
  r += Math.min(15, m.usage.achievedActions * 0.5);
  return Math.round(Math.min(100, r));
}

/** 解像度の段階レベル（%表記の代わりに、輪郭がくっきりしていく比喩で表す） */
export const TWIN_RESOLUTION_LEVELS = [
  { label: "ぼんやり", note: "まだ輪郭はうっすら。話すほど見えてきます" },
  { label: "うっすら", note: "少しずつ人物像が浮かびはじめています" },
  { label: "くっきり", note: "あなたらしさがしっかり見えてきました" },
  { label: "鮮明", note: "解像度はかなり高い状態。細部まで見えています" },
] as const;

/** 解像度(0-100) → 段階インデックス(0-3) と 総ドット数のうち点灯数 */
export function twinResolutionLevel(resolution: number) {
  const totalDots = 5;
  const litDots = Math.max(1, Math.round((resolution / 100) * totalDots));
  const levelIndex = Math.min(
    TWIN_RESOLUTION_LEVELS.length - 1,
    Math.floor((resolution / 100) * TWIN_RESOLUTION_LEVELS.length),
  );
  return { levelIndex, level: TWIN_RESOLUTION_LEVELS[levelIndex], litDots, totalDots };
}

export const DISCLOSURE_LABELS: Record<DisclosureKey, string> = {
  goal: "目標",
  pastActions: "達成したアクション（過去の実績）",
  currentActions: "現在チャレンジ中のアクション",
  reflections: "振り返りの要約",
};

/** CSA（エン標準）の評価項目。AIカスタマイズのベース。変更不可 */
export type CsaItem = { name: string; definition: string };

export const CSA_ITEMS: CsaItem[] = [
  { name: "自己変革性", definition: "自己の現状に満足せず、学習や研鑽に努め、自分自身の改善、革新に挑戦している" },
  { name: "目標必達性", definition: "常にチャレンジングな目標を掲げ、達成に強く執着している" },
  { name: "多様受容性", definition: "固定観念にとらわれず、他者の言動・価値観、様々な文化・思想・理論などに関心を持ち、柔軟に取り入れている" },
  { name: "周辺変革性", definition: "所属部門・会社全体、クライアントの改善、革新に主体的に挑戦している" },
  { name: "主観正義性", definition: "未だ社会的に疑問視されていない事象を主観的に問題と捉え、自分なりの主義主張を発信している" },
  { name: "自発利他性", definition: "利己と利他との葛藤の中で、他者の幸せや社会の利益を意識的に優先している" },
  { name: "Enjoy-Thinking", definition: "仕事を、前向きにとらえ、面白くしたり、楽しむ工夫をしている" },
  { name: "好感演出力", definition: "相手の受け取る「感じのよさ」を意識し、挨拶・笑顔・身だしなみ、コミュニケーションのとり方などを工夫している" },
  { name: "キモチ伝達力", definition: "相手に自分のことを理解してもらうために、相手の言動に対して感じた自分の喜びや悲しみを、能動的に、率直にそのまま伝えている（良し悪しではなく、できるだけ早く）" },
  { name: "対人傾聴力", definition: "相手を理解するために、受容的・共感的な態度で、相手の話に積極的に耳を傾けている" },
  { name: "他者活用力", definition: "社内外の組織や個人に、気持ち良く協力してもらえるよう働きかけ、結果と感謝を伝えている" },
  { name: "対人大善力", definition: "相手の成長や発展のために、その時は嫌われても、軋轢をおそれず、率直に、指摘や進言をしている（部下・同僚・上司・クライアントを問わず）" },
  { name: "発想研磨力", definition: "多様な分野・事象・最新テクノロジーに対して意識的に興味・関心を持ち、インプットを行い、自社・クライアントの仕事に置き換えてアイデアを意図的に多発している（なるほど、これ面白い！ヒントを得た！）" },
  { name: "問題発見力", definition: "社内外の商品・サービス・システムや現状のあたりまえに疑問を持ち、問題点を見つけ出している（これおかしい！）" },
  { name: "改善アイデア発案力", definition: "社内外の商品・サービス・システムや現状に対して、改善案を考え出している（こう直したらいいな！）" },
  { name: "新規アイデア創案力", definition: "社内外の商品・サービス・システムや現状に対して、他分野からの置き換えや、組み合わせなどによって、今までにない新しいアイデアを考え出している（こんなのあったらいいな！）" },
  { name: "問題分析力", definition: "問題を定性的・定量的に分析・整理し、解決すべき課題を抽出している。さらに優先順位をつけている" },
  { name: "仮説検証力", definition: "立案された仮説（仮の答え）を実行に移し、有効性を検証している" },
  { name: "一般化力", definition: "自分の持つ知識・経験・ノウハウを、特殊性を除き、他人も使えるように周りに共有している" },
  { name: "論理的表現力", definition: "相手が納得できるように、口頭や文章などで、結論・理由・根拠の順に筋道を立てて説明している" },
  { name: "意志決定支援力", definition: "役員や事業部長に、現場情報や課題に関する報告・相談・提案をすばやく能動的に行い、決定権者の思考力・判断力を高め、間違った決断をさせない支援をしている（TL・メンバーは日報などで）" },
  { name: "理念共創力", definition: "理念（バリュー・パーパス・ビジョン、事業・行動ガイドライン等）を共に創り上げるために、疑問があれば投げかけ、時には改善案を出している" },
  { name: "理念伝導力", definition: "理念（バリュー・パーパス・ビジョン、事業・行動ガイドライン等）を、信念を持って、周りに伝え広めている" },
  { name: "人財マネジメント力", definition: "部下の性格・考え方・能力や個別事情を把握し、P（目標達成機能）とM（動機づけ機能）の双方を発揮して、効果的な部下育成と組織運営を行なっている" },
  { name: "組織標準化力", definition: "個々のノウハウを一般化させ、誰でもイチ早く成果があがる仕組化・マニュアル化を図り、実行と改善を繰り返している（論理力）" },
  { name: "組織目標推進力", definition: "組織目標を明確にし、その達成の為に、社内外の経営資源（人・物・金・時間・情報・知的財産）を戦略的に活用しマネジメントをしている" },
  { name: "新規事業創出力", definition: "事業バリューに沿った新しい商品・サービス・システムを考え出し、事業化・組織化を行なっている（発想力＋論理力）" },
];

/**
 * CSA項目の分類の区切り。CSA_ITEMS の先頭7項目は「考え方」、8項目め以降は「能力」。
 * slice(0, CSA_MINDSET_COUNT)=考え方 / slice(CSA_MINDSET_COUNT)=能力
 */
export const CSA_MINDSET_COUNT = 7;

/** CSA項目名 → 定義 を引く（タグのポップオーバー用） */
export function csaDefinition(name: string): string | undefined {
  return CSA_ITEMS.find((i) => i.name === name)?.definition;
}

/** 自社設定の初期サンプル項目（キャリアパスのように追加していける） */
export const DEFAULT_COMPANY_ITEMS: CsaItem[] = [
  { name: "顧客起点力", definition: "自社の都合ではなく、顧客の成功を起点に判断・行動している" },
  { name: "スピード実行力", definition: "完璧を待たず、まず小さく試して素早く改善を回している" },
];

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
      { id: "a1", title: "後輩の商談に同席してフィードバックを渡す", done: true, carriedWeeks: 1, csaKeys: ["対人大善力", "人財マネジメント力"] },
      { id: "a2", title: "チームの週次数値レポートを自分がまとめて共有する", done: false, carriedWeeks: 1, csaKeys: ["組織標準化力", "論理的表現力"] },
      { id: "a3", title: "上司にリーダー登用の要件をヒアリングする", done: false, carriedWeeks: 4, csaKeys: ["意志決定支援力", "キモチ伝達力"] },
    ],
    reflections: [
      {
        period: "6/22〜6/28",
        weekStart: "2026-06-22",
        recordedAt: "2026-06-25",
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
        weekStart: "2026-06-15",
        recordedAt: "2026-06-20",
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
        weekStart: "2026-06-08",
        recordedAt: "2026-06-09",
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
    twin: {
      headline: "動きながら考える、推進役",
      focusCsa: ["人財マネジメント力", "対人大善力"],
      challengeCsa: ["論理的表現力", "意志決定支援力"],
      portrait:
        "目標が定まると迷わず動き出せる行動派。会話の端々に「まず自分がやってみせる」という当事者意識がにじみます。周囲を巻き込む力を持つ一方で、負荷が高い場面では抱え込みがちな一面も。最近の振り返りからは、「引っ張る」だけでなく「任せて育てる」ことへの関心が芽生えはじめているのが見てとれます。",
      tags: ["推進力", "当事者意識", "巻き込み上手", "抱え込みやすい", "まとめ役への関心"],
      hiddenQuestions: [
        "プレッシャーがかかる場面で、本当はどう感じている？",
        "「任せる」ことに、どんな不安がある？",
        "3年後、どんなチームをつくっていたい？",
      ],
    },
    disclosure: { goal: "locked", pastActions: "locked", currentActions: "locked", reflections: "locked" },
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
      { id: "a1", title: "大型案件の提案書を先輩とペアで作成する", done: true, carriedWeeks: 1, csaKeys: ["論理的表現力", "問題分析力"] },
      { id: "a2", title: "競合3社のサービス比較をまとめる", done: true, carriedWeeks: 1, csaKeys: ["問題分析力", "発想研磨力"] },
      { id: "a3", title: "社外セミナーに1回参加する", done: false, carriedWeeks: 2, csaKeys: ["自己変革性", "発想研磨力"] },
    ],
    reflections: [
      {
        period: "6/22〜6/28",
        weekStart: "2026-06-22",
        recordedAt: "2026-06-23",
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
        weekStart: "2026-06-15",
        recordedAt: "2026-06-17",
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
    twin: {
      headline: "深く掘り下げる、探究者",
      focusCsa: ["問題分析力", "発想研磨力"],
      challengeCsa: ["キモチ伝達力", "自己変革性"],
      portrait:
        "事実とデータを丁寧に確かめながら、納得できるまで考え抜くタイプ。提案の質へのこだわりが会話からも伝わってきます。専門性を軸にキャリアを描きつつ、周囲への気配りも自然にできる方です。",
      tags: ["探究心", "分析力", "品質へのこだわり", "気配り"],
      hiddenQuestions: [
        "スピードと質、本当はどちらに心が動く？",
        "専門性を、この先どこまで尖らせたい？",
      ],
    },
    disclosure: { goal: "locked", pastActions: "locked", currentActions: "locked", reflections: "locked" },
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
      { id: "a1", title: "週1回、先輩に商談ロープレを依頼する", done: false, carriedWeeks: 5, csaKeys: ["自己変革性", "他者活用力"] },
      { id: "a2", title: "顧客への提案数を週3件にする", done: false, carriedWeeks: 5, csaKeys: ["目標必達性", "改善アイデア発案力"] },
      { id: "a3", title: "業務の振り返りを毎週金曜に書く", done: true, carriedWeeks: 1, csaKeys: ["自己変革性", "問題発見力"] },
    ],
    reflections: [
      {
        period: "6/22〜6/28",
        weekStart: "2026-06-22",
        recordedAt: "2026-06-26",
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
    twin: {
      headline: "そっと支える、伴走者",
      focusCsa: ["自己変革性", "対人傾聴力"],
      challengeCsa: ["目標必達性", "意志決定支援力"],
      portrait:
        "まわりの状況をよく見て、配慮しながら支えるタイプ。まだ会話が少なく輪郭はこれからですが、コツコツ続ける誠実さが見えはじめています。もっと話すほど、あなたらしさが浮かび上がります。",
      tags: ["配慮", "誠実さ", "継続力"],
      hiddenQuestions: [
        "自分から動くとき、何が背中を押す？",
        "これまでで一番、力を発揮できたのはどんな場面？",
        "苦手だと感じるのはどんなとき？",
      ],
    },
    disclosure: { goal: "locked", pastActions: "locked", currentActions: "locked", reflections: "locked" },
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
      { id: "a1", title: "事業計画の収支シミュレーションを作る", done: false, carriedWeeks: 1, csaKeys: ["問題分析力", "仮説検証力"] },
      { id: "a2", title: "想定ユーザー5名にヒアリングする", done: true, carriedWeeks: 1, csaKeys: ["問題発見力", "対人傾聴力"] },
      { id: "a3", title: "メンターに壁打ちを依頼する", done: true, carriedWeeks: 1, csaKeys: ["他者活用力", "仮説検証力"] },
    ],
    reflections: [
      {
        period: "6/22〜6/28",
        weekStart: "2026-06-22",
        recordedAt: "2026-06-24",
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
        weekStart: "2026-06-15",
        recordedAt: "2026-06-19",
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
    twin: {
      headline: "旗を立てて導く、開拓リーダー",
      focusCsa: ["新規アイデア創案力", "問題発見力"],
      challengeCsa: ["組織標準化力", "一般化力"],
      portrait:
        "要点を素早くつかんで方向を示せるタイプ。新しいものを生み出す熱量が高く、行動も早い。一方で、生み出した後の「続ける仕組み」づくりには関心が向きにくい傾向も見えます。",
      tags: ["決断力", "発想力", "行動力", "熱量", "仕組み化は苦手"],
      hiddenQuestions: [
        "立ち上げたあと、誰と組むとうまく回る？",
        "熱が冷めてしまうのは、どんなとき？",
      ],
    },
    disclosure: { goal: "locked", pastActions: "locked", currentActions: "locked", reflections: "locked" },
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
      { id: "a1", title: "担当顧客の中期経営計画を読み込み論点を出す", done: false, carriedWeeks: 2, csaKeys: ["問題発見力", "問題分析力"] },
      { id: "a2", title: "経営層との商談に月2回同席する", done: false, carriedWeeks: 2, csaKeys: ["意志決定支援力", "好感演出力"] },
      { id: "a3", title: "提案の型を1つ資料化する", done: true, carriedWeeks: 1, csaKeys: ["組織標準化力", "一般化力"] },
    ],
    reflections: [
      {
        period: "6/22〜6/28",
        weekStart: "2026-06-22",
        recordedAt: "2026-06-27",
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
    twin: {
      headline: "堅実に守り抜く、安定の要",
      focusCsa: ["論理的表現力", "意志決定支援力"],
      challengeCsa: ["自己変革性", "周辺変革性"],
      portrait:
        "事実を確かめながら着実に進める安定型。長期的な信頼関係を築く力があります。新しい挑戦には慎重で、一歩を踏み出すきっかけを探している様子も見えます。",
      tags: ["安定感", "信頼構築", "慎重さ", "論理的"],
      hiddenQuestions: [
        "挑戦をためらうとき、何が引っかかっている？",
        "本当に守りたいものは何？",
      ],
    },
    disclosure: { goal: "locked", pastActions: "locked", currentActions: "locked", reflections: "locked" },
  },
];

export type AccountStatus = "active" | "invited" | "suspended";

/** 管理者がつける5段階の直近評価 */
export type Rating = "S" | "A" | "B" | "C" | "D";

export const RATINGS: Rating[] = ["S", "A", "B", "C", "D"];

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
  /** 直近の評価（管理者が設定）。未設定なら未評価 */
  rating?: Rating;
  /** プロフィール画像URL。未設定ならイニシャルのフォールバック表示 */
  avatarUrl?: string;
};

export const ACCOUNTS: Account[] = [
  { id: "u1", name: "田中 悠人", email: "tanaka@example.co.jp", roles: ["member"], department: "営業第一部", status: "active", managerId: "u6", rating: "A" },
  { id: "u2", name: "佐藤 美咲", email: "sato@example.co.jp", roles: ["member"], department: "営業第一部", status: "active", managerId: "u6", rating: "S" },
  { id: "u3", name: "鈴木 大輝", email: "suzuki@example.co.jp", roles: ["member"], department: "営業第二部", status: "active", managerId: "u6", rating: "C" },
  { id: "u4", name: "高橋 結衣", email: "takahashi@example.co.jp", roles: ["member"], department: "営業第二部", status: "active", managerId: "u6", rating: "A" },
  { id: "u5", name: "伊藤 健", email: "ito@example.co.jp", roles: ["member"], department: "営業第一部", status: "active", managerId: "u6", rating: "B" },
  { id: "u6", name: "佐藤 拓也", email: "sato.takuya@example.co.jp", roles: ["manager", "admin"], department: "営業第一部", status: "active" },
  { id: "u7", name: "管理 太郎", email: "admin@example.co.jp", roles: ["admin"], department: "人事部", status: "invited" },
  { id: "u8", name: "渡辺 直樹", email: "watanabe@example.co.jp", roles: ["manager"], department: "営業第二部", status: "active" },
  { id: "u9", name: "小林 遥", email: "kobayashi@example.co.jp", roles: ["member"], department: "営業第二部", status: "active", managerId: "u8", rating: "B" },
  { id: "u10", name: "加藤 翔太", email: "kato@example.co.jp", roles: ["member"], department: "営業第二部", status: "active", managerId: "u8", rating: "D" },
  { id: "u11", name: "中村 由依", email: "nakamura@example.co.jp", roles: ["member"], department: "マーケティング部", status: "active", managerId: "u8", rating: "A" },
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

/** 成長支援度（5段階）。上司がメンバーの成長をどれだけ支援できているかの度合い */
export const GROWTH_SUPPORT_LEVELS = [
  { value: 0, label: "D", note: "支援はこれから。まずは接点づくりから始めましょう" },
  { value: 25, label: "C", note: "少しずつ関わりが生まれています" },
  { value: 50, label: "B", note: "定期的に成長を支援できています" },
  { value: 75, label: "A", note: "深く伴走し、成長を後押しできています" },
  { value: 100, label: "S", note: "信頼し合い、互いに高め合える関係です" },
] as const;

/**
 * 管理者一覧で表示するアカウントの付加プロフィール。
 * 実メンバー(m1〜m5)は実データを、それ以外は id から決定論的に生成したモック値を返す。
 * 成長支援度は「今後追加予定のAIアバターとのサーベイ」の結果を想定したプレースホルダー。
 */
export type AccountProfile = {
  /** キャリア希望（設定されているキャリアパス）。メンバー権限がない場合は undefined */
  careerPath?: string;
  /** アプリ利用状況（アクション達成数）。メンバー権限がない場合は undefined */
  achievedActions?: number;
  /** ログイン日数。メンバー権限がない場合は undefined */
  loginDays?: number;
  /** AIトーク利用回数。メンバー権限がない場合は undefined */
  chatCount?: number;
  /** 成長支援度（0/25/50/75/100 の5段階）。上司が紐づく場合のみ */
  growthSupport?: number;
};

/** 文字列から決定論的な擬似乱数（0以上の整数）を得る */
function seededInt(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return h;
}

/** seed から min〜max の範囲に収めたスコアを得る */
function seededScore(seed: string, min: number, max: number): number {
  return min + (seededInt(seed) % (max - min + 1));
}

export function getAccountProfile(account: Account): AccountProfile {
  const member = MEMBERS.find((m) => m.name === account.name);
  const isMember = account.roles.includes("member");
  return {
    careerPath:
      member?.careerPath ??
      (isMember
        ? CAREER_PATHS[seededInt(account.id) % CAREER_PATHS.length]
        : undefined),
    achievedActions:
      member?.usage.achievedActions ??
      (isMember ? seededScore(`${account.id}-act`, 2, 32) : undefined),
    loginDays:
      member?.usage.loginDays ??
      (isMember ? seededScore(`${account.id}-login`, 5, 70) : undefined),
    chatCount:
      member?.usage.chatCount ??
      (isMember ? seededScore(`${account.id}-chat`, 3, 80) : undefined),
    growthSupport: account.managerId
      ? GROWTH_SUPPORT_LEVELS[
          seededInt(`${account.id}-gs`) % GROWTH_SUPPORT_LEVELS.length
        ].value
      : undefined,
  };
}

/** 成長支援度の値(0-100) → 最も近い5段階を返す */
export function growthSupportLevel(value: number) {
  return GROWTH_SUPPORT_LEVELS.reduce((closest, lv) =>
    Math.abs(lv.value - value) < Math.abs(closest.value - value) ? lv : closest,
  );
}
