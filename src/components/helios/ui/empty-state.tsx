import type { ReactNode } from "react";

type EmptyStateProps = {
  title: string;
  description: ReactNode;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="mt-6 flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-12 text-center px-4">
      <span className="text-sm font-medium text-foreground">{title}</span>
      <span className="mt-1 text-sm text-muted">{description}</span>
    </div>
  );
}
