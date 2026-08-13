export type Analysis = {
  candidateName: string;
  role: string;
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
  experience: { label: string; score: number; detail: string };
  education: { label: string; score: number; detail: string };
  recommendation: string;
  verdict: "Strong fit" | "Possible fit" | "Not a fit";
};

export const scoreTone = (score: number) =>
  score >= 75 ? "success" : score >= 55 ? "warning" : "destructive";

export const sampleCandidates: Analysis[] = [
  {
    candidateName: "Aarav Mehta",
    role: "Senior Backend Engineer",
    score: 88,
    matchedSkills: ["Python", "FastAPI", "PostgreSQL", "Docker", "AWS", "CI/CD"],
    missingSkills: ["Kubernetes", "Terraform"],
    experience: { label: "7 yrs / 5 required", score: 92, detail: "Exceeds required experience" },
    education: { label: "B.Tech, Computer Science", score: 85, detail: "Meets requirement" },
    recommendation:
      "Strong technical alignment with the core stack. Recommend moving to a system design interview; probe infrastructure automation depth.",
    verdict: "Strong fit",
  },
  {
    candidateName: "Sofia Ramirez",
    role: "Senior Backend Engineer",
    score: 66,
    matchedSkills: ["Python", "PostgreSQL", "REST APIs", "Docker"],
    missingSkills: ["AWS", "FastAPI", "Kafka"],
    experience: { label: "4 yrs / 5 required", score: 62, detail: "Slightly below requirement" },
    education: { label: "B.Sc, Information Systems", score: 80, detail: "Meets requirement" },
    recommendation:
      "Solid fundamentals but limited cloud exposure. Consider a screening call focused on AWS readiness.",
    verdict: "Possible fit",
  },
  {
    candidateName: "Daniel Okafor",
    role: "Senior Backend Engineer",
    score: 41,
    matchedSkills: ["JavaScript", "REST APIs"],
    missingSkills: ["Python", "PostgreSQL", "AWS", "Docker", "CI/CD"],
    experience: { label: "2 yrs / 5 required", score: 35, detail: "Below requirement" },
    education: { label: "Diploma, Web Development", score: 55, detail: "Partially meets" },
    recommendation:
      "Background is frontend-weighted and misses most backend requirements. Better suited to a junior full-stack opening.",
    verdict: "Not a fit",
  },
];

export function buildAnalysis(fileName: string, jobDescription: string): Analysis {
  const base = sampleCandidates[0];
  const name = fileName
    .replace(/\.pdf$/i, "")
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
  const role =
    jobDescription.split("\n")[0]?.slice(0, 60).trim() || "Senior Backend Engineer";
  return { ...base, candidateName: name || "Uploaded Candidate", role };
}