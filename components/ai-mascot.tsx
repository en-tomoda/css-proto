/**
 * CSASのAIマスコット（ピクトグラム調の全身ロボットキャラクター）。
 * テーマカラーに追従し、まばたき・胸のランプ点滅・軽い上下フロートのアニメーション付き。
 */
export function AiMascot({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 200"
      className={className}
      role="img"
      aria-label="AIアシスタント"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g>
        {/* 全身をやわらかく上下させる */}
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0 0; 0 -3; 0 0"
          dur="3.6s"
          repeatCount="indefinite"
          calcMode="spline"
          keyTimes="0;0.5;1"
          keySplines="0.45 0 0.55 1;0.45 0 0.55 1"
        />

        {/* アンテナ */}
        <line
          x1="60"
          y1="24"
          x2="60"
          y2="13"
          className="stroke-primary"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle cx="60" cy="9" r="4.5" className="fill-chart-2">
          <animate
            attributeName="opacity"
            values="1;0.4;1"
            dur="2.4s"
            repeatCount="indefinite"
          />
        </circle>

        {/* 耳 */}
        <rect x="16" y="44" width="8" height="18" rx="4" className="fill-primary opacity-70" />
        <rect x="96" y="44" width="8" height="18" rx="4" className="fill-primary opacity-70" />

        {/* 頭 */}
        <rect x="25" y="24" width="70" height="56" rx="18" className="fill-primary" />

        {/* 顔プレート */}
        <rect x="34" y="35" width="52" height="34" rx="11" className="fill-background" />

        {/* 目（まばたき） */}
        <ellipse cx="48" cy="50" rx="4.5" ry="6.5" className="fill-primary">
          <animate
            attributeName="ry"
            values="6.5;6.5;0.8;6.5"
            keyTimes="0;0.92;0.96;1"
            dur="4s"
            repeatCount="indefinite"
          />
        </ellipse>
        <ellipse cx="72" cy="50" rx="4.5" ry="6.5" className="fill-primary">
          <animate
            attributeName="ry"
            values="6.5;6.5;0.8;6.5"
            keyTimes="0;0.92;0.96;1"
            dur="4s"
            repeatCount="indefinite"
          />
        </ellipse>

        {/* ほほ */}
        <circle cx="41" cy="59" r="3" className="fill-chart-2 opacity-50" />
        <circle cx="79" cy="59" r="3" className="fill-chart-2 opacity-50" />

        {/* 口（にっこり） */}
        <path
          d="M 53 59 Q 60 65 67 59"
          className="stroke-primary"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* 首 */}
        <rect x="54" y="80" width="12" height="7" className="fill-primary opacity-80" />

        {/* 胴体 */}
        <rect x="30" y="87" width="60" height="56" rx="16" className="fill-primary" />

        {/* 胸のランプ */}
        <circle cx="60" cy="104" r="6" className="fill-chart-2">
          <animate
            attributeName="opacity"
            values="1;0.5;1"
            dur="3s"
            repeatCount="indefinite"
          />
        </circle>
        {/* おなかのパネル */}
        <rect x="46" y="118" width="28" height="16" rx="5" className="fill-background opacity-80" />

        {/* 腕 */}
        <rect x="17" y="92" width="10" height="34" rx="5" className="fill-primary opacity-80" />
        <rect x="93" y="92" width="10" height="34" rx="5" className="fill-primary opacity-80" />
        {/* 手 */}
        <circle cx="22" cy="130" r="6" className="fill-primary" />
        <circle cx="98" cy="130" r="6" className="fill-primary" />

        {/* 脚 */}
        <rect x="42" y="143" width="12" height="30" rx="5" className="fill-primary opacity-90" />
        <rect x="66" y="143" width="12" height="30" rx="5" className="fill-primary opacity-90" />
        {/* 足 */}
        <rect x="36" y="170" width="22" height="12" rx="6" className="fill-primary" />
        <rect x="62" y="170" width="22" height="12" rx="6" className="fill-primary" />

        {/* 影 */}
        <ellipse cx="60" cy="190" rx="30" ry="5" className="fill-foreground/10">
          <animate
            attributeName="rx"
            values="30;26;30"
            dur="3.6s"
            repeatCount="indefinite"
          />
        </ellipse>
      </g>
    </svg>
  );
}
