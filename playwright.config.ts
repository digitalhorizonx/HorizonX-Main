import { defineConfig } from "@playwright/test";
import fs from "node:fs";

/**
 * E2E configuration.
 *
 * Runs against the production build served by `vite preview` (which provides
 * the same SPA fallback the GitHub Pages 404.html gives in production).
 * Build first: `npm run build && npm run test:e2e`.
 *
 * Locally (this sandbox) a pre-installed Chromium is used via executablePath;
 * in CI, `npx playwright install --with-deps chromium` provides the matching
 * browser and the override is skipped. SwiftShader flags allow WebGL in
 * headless environments without a GPU.
 */

const LOCAL_CHROMIUM = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
const executablePath =
  !process.env.CI && fs.existsSync(LOCAL_CHROMIUM) ? LOCAL_CHROMIUM : undefined;

export default defineConfig({
  testDir: "tests",
  timeout: 90_000,
  expect: { timeout: 15_000 },
  retries: process.env.CI ? 1 : 0,
  workers: 2,
  reporter: process.env.CI
    ? [["list"], ["html", { open: "never" }]]
    : [["list"]],
  use: {
    baseURL: "http://localhost:4173",
    viewport: { width: 1440, height: 900 },
    // the flagship journey is the dark experience; theme.spec.ts covers light
    colorScheme: "dark",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    launchOptions: {
      executablePath,
      args: [
        "--no-sandbox",
        "--use-gl=angle",
        "--use-angle=swiftshader",
        "--enable-unsafe-swiftshader",
      ],
    },
  },
  webServer: {
    command: "npm run preview -- --port 4173 --strictPort",
    url: "http://localhost:4173",
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
});
