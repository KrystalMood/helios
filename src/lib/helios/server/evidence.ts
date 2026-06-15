import type { Page } from "playwright";

export async function captureBrokenImages(page: Page) {
  return page.evaluate(() => {
    return Array.from(document.images)
      .filter((image) => !image.complete || image.naturalWidth === 0)
      .map((image) => image.currentSrc || image.src)
      .filter(Boolean);
  });
}
