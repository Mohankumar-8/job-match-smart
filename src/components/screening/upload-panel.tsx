import { useRef, useState } from "react";
import { FileText, Trash2, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  file: File | null;
  onFile: (file: File | null) => void;
  error?: string | null;
  /** Lets parents (e.g. the voice assistant) open the file dialog. */
  openRef?: React.MutableRefObject<(() => void) | null>;
};

export function UploadPanel({ file, onFile, error, openRef }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  if (openRef) openRef.current = () => inputRef.current?.click();

  const handleFiles = (list: FileList | null) => {
    const f = list?.[0];
    if (f) onFile(f);
  };

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload resume PDF. Drag and drop or press Enter to browse."
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={`focus-ring flex min-h-44 cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-6 text-center transition-colors ${
          dragging
            ? "border-primary bg-primary/5"
            : error
              ? "border-destructive/60 bg-destructive/5"
              : "border-border bg-surface hover:border-primary/50 hover:bg-primary/5"
        }`}
      >
        <span className="grid h-11 w-11 place-items-center rounded-full bg-primary/10 text-primary">
          <UploadCloud className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-semibold">Drag & drop resume here</p>
          <p className="mt-1 text-xs text-muted-foreground">
            or click to browse — supported format: <span className="font-medium">PDF</span> (max 10MB)
          </p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,.pdf"
          className="sr-only"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {file && (
        <div className="mt-3 flex items-center gap-3 rounded-xl border border-border bg-card p-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-secondary text-foreground">
            <FileText className="h-4 w-4" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{file.name}</p>
            <p className="text-xs text-muted-foreground">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Remove ${file.name}`}
            onClick={() => onFile(null)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}

      {error && (
        <p role="alert" className="mt-3 text-sm font-medium text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}