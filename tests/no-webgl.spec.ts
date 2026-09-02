import { test, expect } from "@playwright/test";

// This project runs with --disable-3d-apis. The site once threw inside
// three.js when no WebGL context could be created, React unmounted the whole
// tree, and every visitor without WebGL — in-app browsers, blocklisted GPUs,
// privacy setups — got a blank browser error page instead of the portfolio.
test("the portfolio still renders with no WebGL context", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));

  await page.addInitScript(() => sessionStorage.setItem("beta-loader-seen", "1"));
  await page.goto("/");

  expect(await page.evaluate(() => !!document.createElement("canvas").getContext("webgl"))).toBe(
    false
  );

  await expect(page.getByRole("heading", { name: /Shrenik/ }).first()).toBeVisible();
  await expect(page.locator("main")).toContainText("Full-stack .NET engineer");
  expect(errors).toEqual([]);
});
