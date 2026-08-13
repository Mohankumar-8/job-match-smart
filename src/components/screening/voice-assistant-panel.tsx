import { AlertTriangle, Loader2, Mic, MicOff, ShieldCheck, Square, Volume2, VolumeX, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VOICE_EXAMPLES } from "@/lib/voice-commands";
import type { VoiceAssistant } from "@/hooks/use-voice-assistant";

type Props = { va: VoiceAssistant; open: boolean; onClose: () => void };

export function VoiceAssistantPanel({ va, open, onClose }: Props) {
  if (!open) return null;

  const status = !va.supported
    ? "Not supported"
    : va.listening
      ? "Listening…"
      : va.speaking
        ? "Speaking…"
        : "Idle";

  return (
    <div
      role="dialog"
      aria-label="Voice assistant"
      className="card-surface animate-in fade-in slide-in-from-bottom-4 duration-300 fixed inset-x-3 bottom-3 z-50 max-h-[80vh] overflow-y-auto p-4 sm:inset-x-auto sm:right-6 sm:bottom-24 sm:w-96 sm:p-5"
    >
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span
            className={`relative grid h-10 w-10 shrink-0 place-items-center rounded-full ${
              va.listening ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"
            }`}
          >
            {va.listening && (
              <span className="absolute inset-0 animate-ping rounded-full bg-destructive/25" />
            )}
            {va.supported ? <Mic className="relative h-5 w-5" /> : <MicOff className="h-5 w-5" />}
          </span>
          <div className="min-w-0">
            <h2 className="truncate text-sm font-semibold">Voice assistant</h2>
            <p
              aria-live="polite"
              className={`text-xs font-medium ${va.listening ? "text-destructive" : "text-muted-foreground"}`}
            >
              {status}
            </p>
          </div>
        </div>
        <Button variant="ghost" size="icon" aria-label="Close voice assistant" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {!va.supported ? (
        <div className="mt-4 rounded-xl border border-warning/40 bg-warning/10 p-3">
          <p className="flex items-start gap-2 text-sm text-foreground">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" aria-hidden="true" />
            <span>
              Voice recognition isn't available in this browser. Try Chrome or Edge — every action
              here is also available with the on-screen controls.
            </span>
          </p>
        </div>
      ) : (
        <>
          {va.listening && (
            <div className="mt-4 flex h-10 items-end justify-center gap-1" aria-hidden="true">
              {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                <span
                  key={i}
                  className="w-1.5 animate-pulse rounded-full bg-primary"
                  style={{
                    height: `${20 + ((i * 37) % 60)}%`,
                    animationDelay: `${i * 90}ms`,
                    animationDuration: "900ms",
                  }}
                />
              ))}
            </div>
          )}

          <div className="mt-4 space-y-3">
            <div className="rounded-xl border border-border bg-surface p-3">
              <p className="text-xs font-semibold text-muted-foreground">You said</p>
              <p className="mt-1 text-sm" aria-live="polite">
                {va.transcript || va.interim || (
                  <span className="text-muted-foreground">Nothing yet — tap the mic and speak.</span>
                )}
              </p>
            </div>
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-3">
              <p className="flex items-center gap-2 text-xs font-semibold text-primary">
                Assistant
                {va.speaking && <Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" />}
              </p>
              <p className="mt-1 text-sm" aria-live="polite">
                {va.response || (
                  <span className="text-muted-foreground">
                    Try: "What is the match score?"
                  </span>
                )}
              </p>
            </div>
          </div>

          {va.error && (
            <p role="alert" className="mt-3 text-sm font-medium text-destructive">
              {va.error}
            </p>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            {va.listening ? (
              <Button variant="destructive" onClick={va.stopListening} className="focus-ring flex-1">
                <Square className="h-4 w-4" aria-hidden="true" />
                Stop listening
              </Button>
            ) : (
              <Button onClick={va.startListening} className="focus-ring flex-1">
                <Mic className="h-4 w-4" aria-hidden="true" />
                Start listening
              </Button>
            )}
            <Button
              variant="outline"
              onClick={va.toggleMute}
              aria-pressed={va.muted}
              className="focus-ring"
            >
              {va.muted ? (
                <>
                  <VolumeX className="h-4 w-4" aria-hidden="true" />
                  Unmute
                </>
              ) : (
                <>
                  <Volume2 className="h-4 w-4" aria-hidden="true" />
                  Mute
                </>
              )}
            </Button>
          </div>

          <div className="mt-4">
            <p className="text-xs font-semibold text-muted-foreground">Try saying</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {VOICE_EXAMPLES.map((e) => (
                <span
                  key={e}
                  className="rounded-full bg-secondary px-2.5 py-1 text-xs text-secondary-foreground"
                >
                  {e}
                </span>
              ))}
            </div>
          </div>

          <p className="mt-4 flex items-start gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            The mic only records while you press start — audio is processed by your browser and
            never stored.
          </p>
        </>
      )}
    </div>
  );
}