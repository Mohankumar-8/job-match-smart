type Props = { score: number; size?: number; label?: string };

export function ScoreRing({ score, size = 168, label = "Overall match" }: Props) {
  const stroke = size >= 140 ? 12 : 9;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const tone =
    score >= 75 ? "var(--color-success)" : score >= 55 ? "var(--color-warning)" : "var(--color-destructive)";

  return (
    <div
      className="relative inline-grid place-items-center"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${label}: ${score} percent`}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          className="stroke-muted"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          stroke={tone}
          strokeDasharray={c}
          strokeDashoffset={c - (c * score) / 100}
          style={{ transition: "stroke-dashoffset 900ms cubic-bezier(0.22,1,0.36,1)" }}
        />
      </svg>
      <div className="absolute text-center">
        <div
          className="font-display font-semibold tabular-nums"
          style={{ fontSize: size / 4, color: tone }}
        >
          {score}
          <span className="text-[0.5em]">%</span>
        </div>
        <div className="text-xs text-muted-foreground">{label}</div>
      </div>
    </div>
  );
}