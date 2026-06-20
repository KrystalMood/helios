import { AppHeader } from "@/components/helios/layout/app-header";
import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <AppHeader />
      <div className="py-10 px-6 mx-auto max-w-5xl">
        <div className="mt-12 flex flex-col items-center justify-center min-h-[40vh] text-muted">
          <Loader2 className="w-8 h-8 animate-spin mb-4" />
          <p className="text-sm font-medium">Loading run details...</p>
        </div>
      </div>
    </main>
  );
}
