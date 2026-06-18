import type { LatestRun } from "@/lib/helios/shared/types";
import Image from "next/image";

type ArtifactViewerProps = {
  artifacts: LatestRun["artifacts"];
};

export function ScreenshotGallery({ artifacts }: ArtifactViewerProps) {
  if (!artifacts) return null;

  return (
    <div className="mt-8 border-t border-border pt-6">
      <h3 className="mb-4 text-sm font-medium text-foreground">Screenshots</h3>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-2">
          <span className="text-xs text-muted">Desktop View</span>
          <div className="overflow-hidden rounded-md border border-border bg-black/5 flex items-center justify-center min-h-[200px]">
            <Image
              src={artifacts.desktopScreenshot}
              alt="Desktop screenshot"
              width={1920}
              height={1080}
              unoptimized
              className="w-full h-auto object-contain"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs text-muted">Mobile View</span>
          <div className="overflow-hidden rounded-md border border-border bg-black/5 flex items-center justify-center min-h-[200px] lg:w-3/4 mx-auto">
            <Image
              src={artifacts.mobileScreenshot}
              alt="Mobile screenshot"
              width={390}
              height={844}
              unoptimized
              className="w-full h-auto object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
