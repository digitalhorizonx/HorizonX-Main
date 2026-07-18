import type { Page } from "@playwright/test";

/**
 * Collects unexpected console errors and failed FIRST-PARTY requests.
 * Third-party outages must not make the suite fragile, so only same-origin
 * request failures are recorded (there are currently no third-party requests
 * at all — the site is fully self-contained).
 */
export function watchPage(page: Page) {
  const consoleErrors: string[] = [];
  const failedRequests: string[] = [];

  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });
  page.on("pageerror", (err) => consoleErrors.push(`pageerror: ${err.message}`));
  page.on("requestfailed", (req) => {
    if (req.url().startsWith("http://localhost:4173")) {
      failedRequests.push(`${req.url()} — ${req.failure()?.errorText}`);
    }
  });

  return { consoleErrors, failedRequests };
}

/** Navigate home and wait for the opening beat (preloader) to finish. */
export async function gotoHome(page: Page) {
  await page.goto("/");
  // the preloader either exits (first visit) or is skipped entirely
  await page
    .waitForSelector(".preloader--exit", { state: "attached", timeout: 10_000 })
    .catch(() => {});
  await page.waitForSelector(".hero__title", { state: "visible" });
}

/** Scroll to a fraction (0..1) of the page's total scrollable height. */
export async function scrollToFraction(page: Page, fraction: number) {
  await page.evaluate((f) => {
    const max = document.body.scrollHeight - window.innerHeight;
    window.scrollTo(0, Math.round(max * f));
  }, fraction);
}

/** Scroll an element into view by CSS selector using native scrolling. */
export async function scrollToSelector(page: Page, selector: string) {
  await page.evaluate((sel) => {
    document.querySelector(sel)?.scrollIntoView({ block: "start" });
  }, selector);
}

/**
 * Scroll to the MIDDLE of a world's journey slice in ScrollTrigger progress
 * space. The trigger spans from the journey container's top to its bottom
 * minus one viewport, so slice boundaries live in that reduced span — not
 * at raw section offsets.
 */
export async function scrollIntoWorld(page: Page, id: string) {
  await page.evaluate((worldId) => {
    const journey = document.getElementById("journey") as HTMLElement;
    const sections = Array.from(journey.children);
    const i = sections.findIndex((s) => s.id === worldId);
    const span = journey.offsetHeight - window.innerHeight;
    window.scrollTo(0, journey.offsetTop + ((i + 0.5) / sections.length) * span);
  }, id);
}

export async function hasHorizontalOverflow(page: Page): Promise<boolean> {
  return page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth + 1
  );
}
