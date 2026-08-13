import { ScoreRing } from "./score-ring";
import type { Analysis } from "@/lib/screening";

export function CandidateCard({ data }: { data: Analysis }) {
  return (
    <article className="card-surface card-interactive p-5">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold">{data.candidateName}</h3>
          <p className="truncate text-sm text-muted-foreground">{data.role}</p>
        </div>
        <ScoreRing score={data.score} size={72} label="match" />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {data.matchedSkills.slice(0, 4).map((s) => (
          <span
            key={s}
            className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground"
          >
            {s}
          </span>
        ))}
        {data.matchedSkills.length > 4 && (
          <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-muted-foreground">
            +{data.matchedSkills.length - 4}
          </span>
        )}
      </div>
      <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
        {data.recommendation}
      </p>
    </article>
  );
}