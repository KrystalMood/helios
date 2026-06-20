import type { LatestRun } from "@/lib/helios/shared/types";
import Image from "next/image";

type ScreenshotGalleryProps = {
  artifacts: LatestRun["artifacts"];
};

export function ScreenshotGallery({ artifacts }: ScreenshotGalleryProps) {
  if (!artifacts) return null;

  return (
    <div className="border-t border-border pt-6">
      <h3 className="mb-4 text-sm font-medium text-foreground">Screenshots</h3>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-2">
          <span className="text-xs text-muted">Desktop View</span>
          <div className="overflow-y-auto rounded-md border border-border bg-panel max-h-125">
            <Image
              src={artifacts.desktopScreenshot}
              alt="Desktop screenshot"
              width={1920}
              height={1080}
              unoptimized
              className="w-full h-auto"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs text-muted">Mobile View</span>
          <div className="overflow-y-auto rounded-md border border-border bg-panel max-h-125 lg:w-3/4 mx-auto">
            <Image
              src={artifacts.mobileScreenshot}
              alt="Mobile screenshot"
              width={390}
              height={844}
              unoptimized
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
