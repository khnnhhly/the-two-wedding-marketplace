import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("builds the public wedding experience", async () => {
  const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  assert.match(page, /Mọi thứ cho đám cưới/);
  assert.match(page, /the two/);
  assert.match(page, /PublicPage/);
  assert.match(page, /vendors\.length/);
  assert.doesNotMatch(page, /120\+|5 câu hỏi/);
  assert.doesNotMatch(page, /codex-preview/);
});

test("builds the identity-aware workspace without exposing secrets", async () => {
  const page = await readFile(new URL("../app/workspace/page.tsx", import.meta.url), "utf8");
  assert.match(page, /Đang mở Wedding Workspace/);
  assert.match(page, /\/api\/platform/);
  assert.doesNotMatch(page, /PAYMENT_WEBHOOK_SECRET|provider_transaction_id/);
});

test("database migration enforces idempotency and financial invariants", async () => {
  const sql = await readFile(new URL("../drizzle/0000_steep_white_queen.sql", import.meta.url), "utf8");
  assert.match(sql, /UNIQUE INDEX `payment_webhook_provider_event_uq`/);
  assert.match(sql, /UNIQUE INDEX `vendor_bookings_inquiry_id_unique`/);
  assert.match(sql, /UNIQUE INDEX `vendor_shortlist_project_listing_uq`/);
  assert.match(sql, /quotation_deposit_check/);
  assert.match(sql, /payment_obligation_amount_check/);
  assert.match(sql, /subscription_owner_check/);
});

test("payment fulfillment requires a verified signed webhook", async () => {
  const webhook = await readFile(new URL("../app/api/payment-webhook/route.ts", import.meta.url), "utf8");
  assert.match(webhook, /PAYMENT_WEBHOOK_SECRET/);
  assert.match(webhook, /INVALID_SIGNATURE/);
  assert.match(webhook, /PAYMENT_MISMATCH/);
  assert.match(webhook, /duplicate: true/);
  assert.doesNotMatch(webhook, /success_url.*PAID|redirect.*PAID/i);
});

test("AI writes require an explicit proposal confirmation", async () => {
  const route = await readFile(new URL("../app/api/platform/route.ts", import.meta.url), "utf8");
  const start = route.indexOf('body.action === "start_onboarding"');
  const confirm = route.indexOf('body.action === "confirm_ai_plan"');
  assert.ok(start > 0 && confirm > start);
  assert.match(route.slice(start, confirm), /ai_action_proposals/);
  assert.doesNotMatch(route.slice(start, confirm), /INSERT INTO budget_categories/);
  assert.match(route.slice(confirm), /INSERT INTO budget_categories/);
});

test("guidebook templates are available and imported idempotently", async () => {
  const [workspace, templates, route] = await Promise.all([
    readFile(new URL("../app/workspace/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/workspace/guidebook-data.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/api/platform/route.ts", import.meta.url), "utf8"),
  ]);
  assert.match(workspace, /GuidebookLibrary/);
  assert.match(templates, /Timeline tổng quát/);
  assert.match(templates, /Checklist D-7/);
  assert.match(templates, /Venue review/);
  assert.match(route, /apply_guidebook_pack/);
  assert.match(route, /WHERE NOT EXISTS \(SELECT 1 FROM wedding_tasks/);
  assert.match(route, /ON CONFLICT\(wedding_project_id,name\) DO NOTHING/);
});

test("core marketplace actions have dedicated routes instead of workspace fallbacks", async () => {
  const [home, vendorPage, templatePage, planningPage, onboardingPage] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/vendors/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/templates/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/planning/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/vendor-onboarding/page.tsx", import.meta.url), "utf8"),
  ]);
  assert.match(home, /href="\/vendors"/);
  assert.match(home, /href="\/templates"/);
  assert.match(home, /href="\/vendor-apply"/);
  assert.match(vendorPage, /VendorCard/);
  assert.match(templatePage, /\/templates\/\$\{item\.slug\}/);
  assert.match(planningPage, /saveDiscoveryProfile/);
  assert.match(onboardingPage, /register_vendor/);
});

test("vendor center is ownership scoped and AI guide is available", async () => {
  const [route, center, guide] = await Promise.all([
    readFile(new URL("../app/api/vendor-center/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/vendor-center/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/AiConcierge.tsx", import.meta.url), "utf8"),
  ]);
  assert.match(route, /WHERE owner_id=\?/);
  assert.match(route, /WHERE i\.vendor_id=\?/);
  assert.match(center, /Inquiry ≠ Booking/);
  assert.match(guide, /Trợ lý the two/);
  assert.match(guide, /normalize/);
});

test("vendor applications are stored, emailed, and exportable for Google Sheets", async () => {
  const [platform, notification, adminRoute, adminPage, migration] = await Promise.all([
    readFile(new URL("../app/api/platform/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/vendor-notification.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/api/admin/vendor-applications/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/admin/vendor-applications/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../drizzle/0001_pale_ronan.sql", import.meta.url), "utf8"),
  ]);
  assert.match(platform, /INSERT INTO vendor_applications/);
  assert.match(platform, /VENDOR_APPLICATION_SUBMITTED/);
  assert.match(notification, /thetwoplanner@gmail\.com/);
  assert.match(notification, /https:\/\/api\.resend\.com\/emails/);
  assert.match(adminRoute, /text\/csv/);
  assert.match(adminRoute, /retry_email/);
  assert.match(adminPage, /Tải CSV cho Google Sheets/);
  assert.match(migration, /CREATE TABLE `vendor_applications`/);
  assert.match(migration, /vendor_application_email_status_check/);
});

test("couple discovery turns insight into a category-led lookup flow", async () => {
  const [planning, vendors, discovery] = await Promise.all([
    readFile(new URL("../app/planning/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/vendors/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/data/discovery.ts", import.meta.url), "utf8"),
  ]);
  assert.match(discovery, /the-two-discovery-profile/);
  assert.match(planning, /Chọn tối đa 3/);
  assert.match(planning, /validateProfile/);
  assert.match(discovery, /dependencyOrder/);
  assert.match(planning, /recommendedCategories/);
  assert.match(vendors, /URLSearchParams/);
  assert.match(vendors, /params\.set\("recommended", "1"\)/);
  assert.match(vendors, /params\.set\("q"/);
  assert.match(vendors, /servesLocation/);
  assert.match(vendors, /Flow gợi ý cho bạn/);
  assert.match(discovery, /stageDefaults/);
  assert.match(discovery, /Ưu tiên tra cứu/);
});

test("marketplace categories have searchable vendor coverage and one font system", async () => {
  const [marketplace, api, globals, workspaceTheme] = await Promise.all([
    readFile(new URL("../app/data/marketplace.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/api/platform/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../app/workspace/workspace-theme.css", import.meta.url), "utf8"),
  ]);
  for (const name of ["Địa điểm", "Wedding Planner", "Photo & Film", "Trang trí", "Trang phục", "Makeup", "Thiệp & Quà", "Giải trí"]) assert.match(marketplace, new RegExp(`category: "${name.replace(/[&]/g, "\\&")}"`));
  for (const listing of ["lst_lotus", "lst_anmakeup", "lst_papier", "lst_band"]) assert.match(api, new RegExp(listing));
  assert.match(globals, /--font-ui/);
  assert.match(workspaceTheme, /font-family:var\(--font-ui\)!important/);
});

test("public flows complete on the marketplace domain without an account", async () => {
  const [vercel, leads, go, inquiry, apply, search, chrome] = await Promise.all([
    readFile(new URL("../vercel.json", import.meta.url), "utf8"),
    readFile(new URL("../app/api/public/leads/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/go/[slug]/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/inquiry/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/vendor-apply/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/lib/search.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/components/MarketplaceChrome.tsx", import.meta.url), "utf8"),
  ]);
  const redirects = JSON.parse(vercel).redirects.map(rule => rule.source);
  assert.ok(!redirects.includes("/api/:path*"), "public API routes must stay on Vercel");
  assert.ok(redirects.includes("/api/platform"));
  assert.match(leads, /consent !== true/);
  assert.match(leads, /company_website/);
  assert.match(go, /the_two_click_id/);
  assert.match(go, /qualified: !bot && !repeat/);
  assert.match(inquiry, /\/api\/public\/leads/);
  assert.match(apply, /vendor_application/);
  assert.match(search, /normalize\("NFD"\)/);
  assert.match(chrome, /loginPath/);
  assert.doesNotMatch(chrome, /<span>Instagram<\/span>/);
});

test("pages carry their own metadata and missing records return 404", async () => {
  const [layout, vendorDetail, templateDetail, sitemap, robots] = await Promise.all([
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/vendors/[slug]/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/templates/[slug]/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/sitemap.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/robots.ts", import.meta.url), "utf8"),
  ]);
  assert.match(layout, /template: "%s · the two"/);
  assert.match(vendorDetail, /generateMetadata/);
  assert.match(vendorDetail, /notFound\(\)/);
  assert.match(templateDetail, /notFound\(\)/);
  assert.match(sitemap, /vendors\.map/);
  assert.match(robots, /sitemap\.xml/);
});
