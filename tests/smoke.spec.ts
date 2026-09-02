import { test, expect, type Page } from "@playwright/test";

// Guards for the things that actually broke, not coverage for its own sake.
// Every test here maps to a regression that shipped to production undetected.

/** Skip the entry gate and loader, which are once-per-session by design. */
async function enterDirectly(page: Page) {
  await page.addInitScript(() => sessionStorage.setItem("beta-loader-seen", "1"));
}

/** The eased scroll settles over a few frames, so poll rather than sample once. */
async function scrolledPast(page: Page, min: number) {
  await expect
    .poll(() => page.evaluate(() => Math.round(window.scrollY)), { timeout: 8000 })
    .toBeGreaterThan(min);
}

test.describe("the page loads and stays quiet", () => {
  test("renders the hero with no console or page errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
    page.on("console", (m) => {
      if (m.type() === "error") errors.push(`console: ${m.text()}`);
    });

    await enterDirectly(page);
    await page.goto("/");
    await expect(page.getByRole("heading", { name: /Shrenik/ }).first()).toBeVisible();
    await page.waitForTimeout(1500); // let the WebGL scene and audio engine settle
    expect(errors).toEqual([]);
  });

  test("every section anchor exists", async ({ page }) => {
    await enterDirectly(page);
    await page.goto("/");
    for (const id of ["experience", "work", "architecture", "craft", "about"]) {
      await expect(page.locator(`#${id}`)).toHaveCount(1);
    }
  });
});

test.describe("anchor navigation", () => {
  // THE regression this suite exists for: SmoothScroll pins the content with
  // position: fixed, so scrollIntoView computes a scroll of zero and every
  // anchor on the site silently did nothing. It shipped and survived a
  // deploy because nothing checked it.
  test("the menu scrolls to a section", async ({ page }) => {
    await enterDirectly(page);
    await page.goto("/");
    await page.getByRole("button", { name: "Open menu" }).click();
    await page.getByRole("button", { name: "Craft" }).click();
    await scrolledPast(page, 500);
  });

  test("the WORK pill scrolls to the work list", async ({ page }) => {
    await enterDirectly(page);
    await page.goto("/");
    await page.getByRole("button", { name: "Work", exact: true }).first().click();
    await scrolledPast(page, 500);
  });
});

test.describe("the contact takeover", () => {
  test("opens, ignites and closes", async ({ page }) => {
    await enterDirectly(page);
    await page.goto("/");
    await page.getByRole("button", { name: "Contact", exact: true }).first().click();

    const dialog = page.getByRole("dialog", { name: "Contact" });
    await expect(dialog).toBeVisible();
    await expect(dialog.locator('a[href^="mailto:"]')).toBeVisible();

    await page.getByRole("button", { name: "Close-X" }).click();
    await expect(dialog).toBeHidden();
  });
});

test.describe("the architecture deck", () => {
  test("advances through its layers as the track is scrolled", async ({ page }) => {
    await enterDirectly(page);
    await page.goto("/");

    await page.getByRole("button", { name: "Open menu" }).click();
    await page.getByRole("button", { name: "Architecture" }).click();
    await scrolledPast(page, 500);

    const counter = page.locator("#architecture").getByText(/^\d{2} \/ \d{2}$/);
    await expect(counter).toBeVisible();

    // walk down the pinned track and confirm the counter climbs
    const seen = new Set<string>();
    for (let i = 0; i < 8; i++) {
      await page.mouse.wheel(0, 500);
      await page.waitForTimeout(400);
      const text = (await counter.textContent())?.trim();
      if (text) seen.add(text);
    }
    expect(seen.size).toBeGreaterThan(1);
  });
});

test.describe("the social card", () => {
  // og:image must be absolute — scrapers do not resolve relative paths, and
  // getting this wrong means the card silently never appears anywhere.
  test("declares an absolute og:image that actually resolves", async ({ page, request }) => {
    await page.goto("/");
    const image = await page.locator('meta[property="og:image"]').getAttribute("content");
    expect(image).toBeTruthy();
    expect(image).toMatch(/^https?:\/\//);

    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
      "content",
      "summary_large_image"
    );

    // the deployed origin is not reachable from CI, so check the file ships
    const local = await request.get("/og.png");
    expect(local.status()).toBe(200);
    expect(local.headers()["content-type"]).toContain("image/png");
  });
});

test.describe("the installable app", () => {
  test("serves a manifest whose icons all resolve", async ({ request }) => {
    const res = await request.get("/manifest.webmanifest");
    expect(res.status()).toBe(200);

    const manifest = await res.json();
    expect(manifest.display).toBe("standalone");
    expect(manifest.icons.length).toBeGreaterThan(0);

    for (const icon of manifest.icons) {
      const icoRes = await request.get(icon.src);
      expect(icoRes.status(), `icon ${icon.src} should resolve`).toBe(200);
    }
  });

  test("ships a service worker", async ({ request }) => {
    const res = await request.get("/sw.js");
    expect(res.status()).toBe(200);
    expect(await res.text()).toContain("addEventListener");
  });
});

test.describe("the 404", () => {
  // Next's default 404 is light-themed, which on a dark-only site reads as a
  // broken page rather than a missing one.
  test("is dark and offers a way back", async ({ page }) => {
    const res = await page.goto("/no-such-page");
    expect(res?.status()).toBe(404);

    const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    expect(bg).toBe("rgb(10, 14, 12)"); // the site's ground, not white

    await expect(page.getByRole("link", { name: /take me back/i })).toBeVisible();
  });
});

test.describe("project deep links", () => {
  // The site was one URL, so nothing could be shared and search engines had a
  // single document to index. Each project now has its own page.
  const SLUGS = [
    "claims-intelligence",
    "uspayroll",
    "irispayroll",
    "cre",
    "alfr-annual-landfill-review",
    "power-bi-reporting",
  ];

  for (const slug of SLUGS) {
    test(`/work/${slug} is a real page with its own title`, async ({ page }) => {
      const errors: string[] = [];
      page.on("pageerror", (e) => errors.push(e.message));

      const res = await page.goto(`/work/${slug}/`);
      expect(res?.status()).toBe(200);

      // a deep link must not sit the visitor through the entry sequence
      await expect(page.getByRole("button", { name: "Enter" })).toHaveCount(0);

      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await expect(page).toHaveTitle(/— Shrenik YD$/);
      await expect(page.getByRole("link", { name: /all work/i })).toBeVisible();
      expect(errors).toEqual([]);
    });
  }

  test("titles are distinct, which is the whole point", async ({ page }) => {
    const titles = new Set<string>();
    for (const slug of SLUGS) {
      await page.goto(`/work/${slug}/`);
      titles.add(await page.title());
    }
    expect(titles.size).toBe(SLUGS.length);
  });

  test("a work card links through to its page", async ({ page }) => {
    await page.addInitScript(() => sessionStorage.setItem("beta-loader-seen", "1"));
    await page.goto("/");

    // scrollIntoViewIfNeeded does nothing inside the pinned container, so
    // reach the work list the way a visitor does
    await page.getByRole("button", { name: "Work", exact: true }).first().click();
    await scrolledPast(page, 500);

    // the card opens on hover and toggles on click, so a click after the
    // pointer arrives would close it again — hover is the desktop interaction
    const card = page.locator("#work [role=button]").first();
    await card.hover();

    const link = page.getByRole("link", { name: /read the detail/i }).first();
    await expect(link).toBeVisible();
    await link.click();
    await expect(page).toHaveURL(/\/work\/[a-z0-9-]+\/$/);
  });
});
