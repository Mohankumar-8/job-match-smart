export type VoiceAction =
  | "upload"
  | "analyze"
  | "matched-skills"
  | "missing-skills"
  | "candidates"
  | "score"
  | "new-screening"
  | "dashboard"
  | "help"
  | "unknown";

type Rule = { action: VoiceAction; patterns: RegExp[] };

const RULES: Rule[] = [
  { action: "upload", patterns: [/\bupload\b/, /\battach\b.*\bresume\b/, /\bchoose (a )?file\b/] },
  { action: "analyze", patterns: [/\banaly[sz]e\b/, /\bscreen (this|the) resume\b/, /\brun (the )?screening\b/] },
  { action: "matched-skills", patterns: [/\bmatch(ed)? skills?\b/, /\bskills? (they|he|she) (has|have)\b/] },
  { action: "missing-skills", patterns: [/\bmissing skills?\b/, /\bskill gaps?\b/, /\bwhat.*missing\b/] },
  { action: "candidates", patterns: [/\bcandidates?\b/, /\bresults?\b/, /\bshortlist\b/] },
  { action: "score", patterns: [/\bmatch score\b/, /\bscore\b/, /\bhow (good|strong) (is )?(the )?match\b/] },
  { action: "new-screening", patterns: [/\bnew screening\b/, /\bstart over\b/, /\breset\b/, /\bclear\b/] },
  { action: "dashboard", patterns: [/\b(go to |open )?dashboard\b/, /\bhome\b/, /\bgo to top\b/] },
  { action: "help", patterns: [/\bhelp\b/, /\bwhat can you do\b/, /\bcommands?\b/] },
];

export function matchCommand(transcript: string): VoiceAction {
  const text = transcript.toLowerCase().trim();
  if (!text) return "unknown";
  for (const rule of RULES) {
    if (rule.patterns.some((p) => p.test(text))) return rule.action;
  }
  return "unknown";
}

export const VOICE_EXAMPLES = [
  "Upload my resume",
  "Analyze this resume",
  "What is the match score?",
  "Show matched skills",
  "Show missing skills",
  "Show candidate results",
  "Start a new screening",
  "Go to dashboard",
];