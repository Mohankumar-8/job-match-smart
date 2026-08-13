import { Award, Briefcase, CheckCircle2, GraduationCap, Sparkles, XCircle } from "lucide-react";
import { ScoreRing } from "./score-ring";
import { Progress } from "@/components/ui/progress";
import type { Analysis } from "@/lib/screening";

function SkillChip({ label, tone }: { label: string; tone: "match" | "miss" }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${
        tone === "match"
          ? "border-success/30 bg-success/10 text-success"
          : "border-destructive/30 bg-destructive/10 text-destructive"
      }`}
    >
      {tone === "match" ? (
        <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
      ) : (
        <XCircle className="h-3.5 w-3.5" aria-hidden="true" />
      )}
      {label}
    </span>
  );
}

function MatchRow({
  icon,
  title,
  value,
  detail,
  score,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  detail: string;
  score: number;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className="shrink-0 text-primary">{icon}</span>
          <p className="truncate text-sm font-semibold">{title}</p>
        </div>
        <span className="text-sm font-semibold tabular-nums">{score}%</span>
      </div>
      <Progress value={score} className="mt-3 h-2" />
      <p className="mt-2 text-sm text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground">{detail}</p>
    </div>
  );
}

export function AnalysisResult({ data }: { data: Analysis }) {
  return (
    <div className="card-surface animate-in fade-in slide-in-from-bottom-2 duration-500 p-5 sm:p-7">
      <div className="grid gap-6 md:grid-cols-[auto_minmax(0,1fr)] md:items-center">
        <div className="justify-self-center md:justify-self-start">
          <ScoreRing score={data.score} />
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-semibold sm:text-2xl">{data.candidateName}</h2>
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Award className="h-3.5 w-3.5" aria-hidden="true" />
              {data.verdict}
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">Screened against: {data.role}</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <MatchRow
              icon={<Briefcase className="h-4 w-4" />}
              title="Experience match"
              value={data.experience.label}
              detail={data.experience.detail}
              score={data.experience.score}
            />
            <MatchRow
              icon={<GraduationCap className="h-4 w-4" />}
              title="Education match"
              value={data.education.label}
              detail={data.education.detail}
              score={data.education.score}
            />
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <section>
          <h3 className="text-sm font-semibold">Matched skills ({data.matchedSkills.length})</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {data.matchedSkills.map((s) => (
              <SkillChip key={s} label={s} tone="match" />
            ))}
          </div>
        </section>
        <section>
          <h3 className="text-sm font-semibold">Missing skills ({data.missingSkills.length})</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {data.missingSkills.map((s) => (
              <SkillChip key={s} label={s} tone="miss" />
            ))}
          </div>
        </section>
      </div>

      <section className="mt-6 rounded-xl border border-primary/20 bg-primary/5 p-4">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-primary">
          <Sparkles className="h-4 w-4" aria-hidden="true" />
          AI recommendation
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-foreground">{data.recommendation}</p>
      </section>
    </div>
  );
}