import type { RunEvidence } from "@/lib/helios/shared/types";

type EvidenceItemProps = {
  evidence: RunEvidence;
  isCopied: boolean;
  onCopy: (value: string) => void;
  onSelect: (evidence: RunEvidence) => void;
};

export function EvidenceItem({
  evidence,
  isCopied,
  onCopy,
  onSelect,
}: EvidenceItemProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
      <button
        type="button"
        onClick={() => onSelect(evidence)}
        className="min-w-0 text-left break-all hover:text-foreground transition"
      >
        {evidence.content}
      </button>

      <button
        type="button"
        onClick={() => onCopy(evidence.content)}
        className="shrink-0 whitespace-nowrap self-start rounded-full border border-border px-2 py-1 text-xs text-muted transition hover:text-foreground"
      >
        {isCopied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}
