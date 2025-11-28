interface JimfreeLogoProps {
  size?: number;
  className?: string;
}

export function JimfreeLogo({ size = 40, className = '' }: JimfreeLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* 왼쪽 날개 - 3개의 깃털 레이어 */}
      {/* 첫 번째 깃털 (가장 위, 가장 큼) */}
      <path
        d="M28 38 Q18 28, 5 20 Q2 24, 1 33 Q3 38, 10 44 Q18 49, 25 52 L28 38 Z"
        fill="white"
      />
      {/* 두 번째 깃털 (중간) */}
      <path
        d="M27 48 Q18 40, 8 36 Q6 40, 5 47 Q7 52, 14 57 Q21 61, 26 63 L27 48 Z"
        fill="white"
      />
      {/* 세 번째 깃털 (가장 아래, 가장 작음) */}
      <path
        d="M26 58 Q20 52, 12 49 Q11 52, 10 58 Q11 62, 17 66 Q22 69, 25 71 L26 58 Z"
        fill="white"
      />

      {/* 오른쪽 날개 - 3개의 깃털 레이어 */}
      {/* 첫 번째 깃털 (가장 위, 가장 큼) */}
      <path
        d="M72 38 Q82 28, 95 20 Q98 24, 99 33 Q97 38, 90 44 Q82 49, 75 52 L72 38 Z"
        fill="white"
      />
      {/* 두 번째 깃털 (중간) */}
      <path
        d="M73 48 Q82 40, 92 36 Q94 40, 95 47 Q93 52, 86 57 Q79 61, 74 63 L73 48 Z"
        fill="white"
      />
      {/* 세 번째 깃털 (가장 아래, 가장 작음) */}
      <path
        d="M74 58 Q80 52, 88 49 Q89 52, 90 58 Q89 62, 83 66 Q78 69, 75 71 L74 58 Z"
        fill="white"
      />

      {/* 캐리어 본체 */}
      <rect
        x="32"
        y="35"
        width="36"
        height="42"
        rx="3"
        fill="white"
      />

      {/* 캐리어 손잡이 */}
      <rect
        x="43"
        y="25"
        width="14"
        height="12"
        rx="7"
        fill="none"
        stroke="white"
        strokeWidth="4"
      />

      {/* 캐리어 바퀴 (왼쪽) */}
      <circle cx="40" cy="80" r="4" fill="white" />
      
      {/* 캐리어 바퀴 (오른쪽) */}
      <circle cx="60" cy="80" r="4" fill="white" />
    </svg>
  );
}
