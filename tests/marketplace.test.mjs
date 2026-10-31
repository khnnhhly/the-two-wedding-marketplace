import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = path => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("legacy Sites/D1 stack and old brand are gone", async () => {
  for (const path of ["app/api/platform", "app/vendor-center", "app/chatgpt-auth.ts", "db", "drizzle", "worker", "vite.config.ts", "app/login"]) {
    assert.ok(!existsSync(new URL(`../${path}`, import.meta.url)), `${path} should be removed`);
  }
  const vercel = JSON.parse(await read("vercel.json"));
  assert.ok(!JSON.stringify(vercel).includes("chatgpt.site"), "no redirects to the old Sites host");
  const pkg = JSON.parse(await read("package.json"));
  for (const dep of ["vinext", "wrangler", "drizzle-orm"]) assert.ok(!(dep in { ...pkg.dependencies, ...pkg.devDependencies }));
});

test("discovery requires complete answers before creating the workspace", async () => {
  const [discovery, planning] = await Promise.all([read("app/data/discovery.ts"), read("app/planning/page.tsx")]);
  for (const message of ["Nhập thành phố", "Chọn tháng cưới", "Nhập số khách", "Nhập tổng ngân sách"]) assert.match(discovery, new RegExp(message));
  assert.match(discovery, /dateUndecided/);
  assert.match(planning, /validateProfile\(profile\)/);
  assert.match(planning, /createWorkspace\(profile\)/);
  assert.match(planning, /\/workspace\?welcome=1/);
});

test("workspace is local-first and fully interactive", async () => {
  const [store, page, checklist, budget, vendors, guidebook, settings] = await Promise.all([
    read("app/workspace/store.ts"), read("app/workspace/page.tsx"), read("app/workspace/ChecklistTab.tsx"),
    read("app/workspace/BudgetTab.tsx"), read("app/workspace/VendorsTab.tsx"), read("app/workspace/GuidebookTab.tsx"), read("app/workspace/SettingsTab.tsx"),
  ]);
  assert.match(store, /useSyncExternalStore/);
  assert.match(store, /localStorage/);
  assert.doesNotMatch(store + page, /\/api\/platform/);
  assert.match(store, /export function dueDate/);
  assert.match(store, /export function progress/);
  assert.match(checklist, /Hoàn tác/);
  assert.match(budget, /onCommit/);
  assert.match(vendors, /vendorStages\.map/);
  assert.match(guidebook, /applyPack/);
  assert.match(settings, /Xuất file sao lưu/);
});

test("brief form, shortlist and click tracking feed the workspace", async () => {
  const [inquiry, shortlist, go, leads] = await Promise.all([read("app/inquiry/page.tsx"), read("app/components/Shortlist.tsx"), read("app/go/[slug]/route.ts"), read("app/api/public/leads/route.ts")]);
  assert.match(inquiry, /trackVendor\(vendor\.slug, \{ stage: "contacted"/);
  assert.match(shortlist, /trackVendor/);
  assert.match(go, /the_two_click_id/);
  assert.match(go, /qualified: !bot && !repeat/);
  assert.match(leads, /consent !== true/);
});

test("search, metadata and 404 handling", async () => {
  const [search, layout, vendorDetail, sitemap] = await Promise.all([read("app/lib/search.ts"), read("app/layout.tsx"), read("app/vendors/[slug]/page.tsx"), read("app/sitemap.ts")]);
  assert.match(search, /normalize\("NFD"\)/);
  assert.match(layout, /template: "%s · the two"/);
  assert.match(vendorDetail, /notFound\(\)/);
  assert.match(sitemap, /vendors\.map/);
});
