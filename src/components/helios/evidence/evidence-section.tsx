import type { RunEvidence } from "@/lib/helios/shared/types";
import { EvidenceItem } from "@/components/helios/evidence/evidence-item";

type EvidenceSectionProps = {
  title: string;
  items: RunEvidence[];
  totalCount: number;
  copiedEvidence: string | null;
  onCopyEvidence: (value: string) => void;
  onSelectEvidence: (evidence: RunEvidence) => void;
};

export function EvidenceSection({
  title,
  items,
  totalCount,
  copiedEvidence,
  onCopyEvidence,
  onSelectEvidence,
}: EvidenceSectionProps) {
  if (items.length === 0) return null;

  return (
    <div className="mt-4">
      <p className="text-xs font-medium text-muted">
        {title} - showing {items.length} of {totalCount}
      </p>
      <ul className="mt-2 space-y-2">
        {items.map((evidence) => (
          <li
            key={evidence.id}
            className="rounded-md border border-border bg-card p-3 text-xs text-muted"
          >
            <EvidenceItem
              evidence={evidence}
              isCopied={copiedEvidence === evidence.content}
              onCopy={onCopyEvidence}
              onSelect={onSelectEvidence}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
