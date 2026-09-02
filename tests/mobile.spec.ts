import { test, expect } from "@playwright/test";

// Runs on a phone viewport. The desktop layout hid two real bugs: pill labels
// wrapping onto two lines at 390px, and the nav colliding with page content.
test("the entry gate is usable and leads into the site", async ({ page }) => {
  await page.goto("/");

  const enter = page.getByRole("button", { name: "Enter" });
  await expect(enter).toBeVisible();
  await enter.tap();

  // the loader runs ~4.3s before the site is revealed
  await expect(page.getByRole("heading", { name: /Shrenik/ }).first()).toBeVisible({
    timeout: 15_000,
  });
});

test("nav pill labels never wrap", async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem("beta-loader-seen", "1"));
  await page.goto("/");

  for (const name of ["Work", "Contact"]) {
    const button = page.getByRole("button", { name, exact: true }).first();
    const box = await button.boundingBox();
    const lineHeight = await button.evaluate(
      (el) => parseFloat(getComputedStyle(el).lineHeight) || parseFloat(getComputedStyle(el).fontSize) * 1.5
    );
    expect(box!.height, `${name} should stay on one line`).toBeLessThan(lineHeight * 1.8);
  }
});
