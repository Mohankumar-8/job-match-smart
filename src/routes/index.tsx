import { useCallback, useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, FileSearch, Loader2, Mic, Sparkles, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { SiteHeader } from "@/components/screening/site-header";
import { UploadPanel } from "@/components/screening/upload-panel";
import { AnalysisResult } from "@/components/screening/analysis-result";
import { CandidateCard } from "@/components/screening/candidate-card";
import { VoiceAssistantPanel } from "@/components/screening/voice-assistant-panel";
import { useVoiceAssistant } from "@/hooks/use-voice-assistant";
import { matchCommand } from "@/lib/voice-commands";
import { buildAnalysis, sampleCandidates, type Analysis } from "@/lib/screening";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI Resume Screening System — Screen Resumes Smarter" },
      {
        name: "description",
        content:
          "Upload a resume PDF and a job description to get an AI match score, skill gaps, experience and education fit, plus a hiring recommendation.",
      },
      { property: "og:title", content: "AI Resume Screening System" },
      {
        property: "og:description",
        content:
          "AI match scores, skill-gap analysis and hiring recommendations for recruiters.",
      },
    ],
  }),
  component: Index,
});

const STAGES = [
  "Parsing resume PDF…",
  "Extracting skills and experience…",
  "Comparing against job description…",
  "Generating recommendation…",
];

function Index() {
  const [file, setFile] = useState<File | null>(null);
  const [jd, setJd] = useState("");
  const [fileError, setFileError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState(0);
  const [result, setResult] = useState<Analysis | null>(null);
  const timers = useRef<ReturnType<typeof setInterval>[]>([]);
  const openUploadRef = useRef<(() => void) | null>(null);
  const uploadSectionRef = useRef<HTMLElement | null>(null);
  const resultSectionRef = useRef<HTMLElement | null>(null);
  const candidatesSectionRef = useRef<HTMLElement | null>(null);
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [highlight, setHighlight] = useState<"matched" | "missing" | null>(null);
  const stateRef = useRef({ file, jd, status, result });
  stateRef.current = { file, jd, status, result };

  useEffect(() => () => timers.current.forEach(clearInterval), []);

  const onFile = (f: File | null) => {
    setFileError(null);
    setFormError(null);
    if (!f) return setFile(null);
    if (f.type !== "application/pdf" && !f.name.toLowerCase().endsWith(".pdf")) {
      setFile(null);
      setFileError("Unsupported file type. Please upload a PDF resume.");
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      setFile(null);
      setFileError("File is larger than 10MB. Please upload a smaller PDF.");
      return;
    }
    setFile(f);
  };

  const runAnalysis = useCallback((current: File | null, jobText: string) => {
    if (!current) {
      setFormError("Upload a resume PDF before running the analysis.");
      return "You need to upload a resume PDF before I can analyze it.";
    }
    if (jobText.trim().length < 20) {
      setFormError("Add a job description (at least 20 characters) to compare against.");
      return "Please add a job description first, then I'll run the analysis.";
    }

    setFormError(null);
    setResult(null);
    setStatus("loading");
    setProgress(0);
    setStage(0);

    const tick = setInterval(() => {
      setProgress((p) => {
        const next = Math.min(100, p + 4);
        setStage(Math.min(STAGES.length - 1, Math.floor(next / 26)));
        if (next >= 100) {
          clearInterval(tick);
          setResult(buildAnalysis(current.name, jobText));
          setStatus("done");
        }
        return next;
      });
    }, 90);
    timers.current.push(tick);
    return "Analyzing the resume now. I'll read out the match score when it's ready.";
  }, []);

  const analyze = () => {
    runAnalysis(file, jd);
  };

  const scrollTo = (ref: React.RefObject<HTMLElement | null>) =>
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const handleCommand = useCallback(
    (text: string) => {
      const { file: f, jd: job, result: res, status: st } = stateRef.current;
      const action = matchCommand(text);
      const needResult = "Run an analysis first and I'll have the details for you.";

      switch (action) {
        case "upload":
          scrollTo(uploadSectionRef);
          openUploadRef.current?.();
          return "Opening the file picker. Choose a PDF resume to upload.";
        case "analyze":
          scrollTo(resultSectionRef);
          return runAnalysis(f, job);
        case "score":
          if (st === "loading") return "The analysis is still running. One moment.";
          if (!res) return needResult;
          scrollTo(resultSectionRef);
          return `${res.candidateName}'s resume has a ${res.score} percent match with this job. ${res.verdict}.`;
        case "matched-skills":
          if (!res) return needResult;
          setHighlight("matched");
          scrollTo(resultSectionRef);
          return `Matched skills: ${res.matchedSkills.join(", ")}.`;
        case "missing-skills":
          if (!res) return needResult;
          setHighlight("missing");
          scrollTo(resultSectionRef);
          return `Missing skills: ${res.missingSkills.join(", ")}.`;
        case "candidates":
          scrollTo(candidatesSectionRef);
          return `Showing ${sampleCandidates.length} recently screened candidates.`;
        case "new-screening":
          setFile(null);
          setJd("");
          setResult(null);
          setStatus("idle");
          setProgress(0);
          setFormError(null);
          setFileError(null);
          setHighlight(null);
          scrollTo(uploadSectionRef);
          return "Started a new screening. Upload a resume and paste the job description.";
        case "dashboard":
          window.scrollTo({ top: 0, behavior: "smooth" });
          return "Here's your dashboard overview.";
        case "help":
          return "You can say: upload my resume, analyze this resume, what is the match score, show matched skills, show missing skills, show candidate results, or start a new screening.";
        default:
          return `I didn't recognise "${text}". Try saying: what is the match score?`;
      }
    },
    [runAnalysis],
  );

  const va = useVoiceAssistant((text) => {
    va.speak(handleCommand(text));
  });

  const openVoice = () => {
    setVoiceOpen(true);
    if (!va.listening) void va.startListening();
  };

  useEffect(() => {
    if (!highlight) return;
    const t = setTimeout(() => setHighlight(null), 2600);
    return () => clearTimeout(t);
  }, [highlight]);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader onVoiceClick={openVoice} listening={va.listening} />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <section className="max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            AI-assisted candidate evaluation
          </span>
          <h1 className="mt-4 text-3xl font-semibold sm:text-4xl lg:text-5xl">
            Screen Resumes Smarter with AI
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Upload a resume and a job description to get an instant match score, skill-gap
            breakdown and a hiring recommendation your team can act on.
          </p>
        </section>

        <section ref={uploadSectionRef} className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="card-surface p-5 sm:p-6">
            <h2 className="text-lg font-semibold">Resume</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Supported format: PDF only.
            </p>
            <div className="mt-4">
              <UploadPanel file={file} onFile={onFile} error={fileError} openRef={openUploadRef} />
            </div>
          </div>

          <div className="card-surface flex flex-col p-5 sm:p-6">
            <h2 className="text-lg font-semibold">Job description</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Paste the role requirements, responsibilities and required skills.
            </p>
            <label htmlFor="jd" className="sr-only">
              Job description
            </label>
            <Textarea
              id="jd"
              value={jd}
              onChange={(e) => {
                setJd(e.target.value);
                setFormError(null);
              }}
              placeholder={"Senior Backend Engineer\n\n• 5+ years building Python services\n• PostgreSQL, Docker, AWS\n• CI/CD ownership"}
              className="mt-4 min-h-44 flex-1 resize-y bg-surface"
            />
            <p className="mt-2 text-xs text-muted-foreground">{jd.trim().length} characters</p>
          </div>
        </section>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button
            size="lg"
            onClick={analyze}
            disabled={status === "loading"}
            className="focus-ring w-full sm:w-auto"
          >
            {status === "loading" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                Analyzing…
              </>
            ) : (
              <>
                <FileSearch className="h-4 w-4" aria-hidden="true" />
                Analyze Resume
              </>
            )}
          </Button>
          <Button
            size="lg"
            variant={va.listening ? "destructive" : "outline"}
            onClick={openVoice}
            className="focus-ring relative w-full sm:w-auto"
          >
            {va.listening && (
              <span className="absolute -inset-0.5 animate-ping rounded-md bg-destructive/25" />
            )}
            <Mic className="relative h-4 w-4" aria-hidden="true" />
            <span className="relative">
              {va.listening ? "Listening…" : "Ask the voice assistant"}
            </span>
          </Button>
          {formError && (
            <p
              role="alert"
              className="flex items-center gap-2 text-sm font-medium text-destructive"
            >
              <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
              {formError}
            </p>
          )}
        </div>

        <section ref={resultSectionRef} aria-live="polite" className="mt-8 scroll-mt-24">
          {status === "loading" && (
            <div className="card-surface p-6">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
                <p className="truncate text-sm font-semibold">{STAGES[stage]}</p>
                <span className="text-sm font-semibold tabular-nums text-muted-foreground">
                  {progress}%
                </span>
              </div>
              <Progress value={progress} className="mt-4 h-2" />
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="h-20 animate-pulse rounded-xl bg-muted" />
                ))}
              </div>
            </div>
          )}

          {status === "idle" && (
            <div className="card-surface flex flex-col items-center gap-3 px-6 py-14 text-center">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-secondary text-muted-foreground">
                <FileSearch className="h-5 w-5" aria-hidden="true" />
              </span>
              <h2 className="text-lg font-semibold">No analysis yet</h2>
              <p className="max-w-md text-sm text-muted-foreground">
                Upload a resume PDF and paste a job description, then run the analysis to see the
                match score, skill gaps and AI recommendation here.
              </p>
            </div>
          )}

          {status === "done" && result && <AnalysisResult data={result} highlight={highlight} />}
        </section>

        <section ref={candidatesSectionRef} className="mt-14 scroll-mt-24">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
            <div className="min-w-0">
              <h2 className="flex items-center gap-2 text-xl font-semibold">
                <Users className="h-5 w-5 text-primary" aria-hidden="true" />
                Recent candidates
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Screened against Senior Backend Engineer
              </p>
            </div>
            <Button variant="outline" className="focus-ring shrink-0">
              View all
            </Button>
          </div>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {sampleCandidates.map((c) => (
              <CandidateCard key={c.candidateName} data={c} />
            ))}
          </div>
        </section>
      </main>

      <footer className="mt-16 border-t border-border py-8">
        <p className="mx-auto max-w-7xl px-4 text-sm text-muted-foreground sm:px-6 lg:px-8">
          AI Resume Screening System — recommendations are assistive and should be reviewed by a
          human recruiter.
        </p>
      </footer>

      <VoiceAssistantPanel va={va} open={voiceOpen} onClose={() => {
        va.stopListening();
        va.stopSpeaking();
        setVoiceOpen(false);
      }} />
    </div>
  );
}
