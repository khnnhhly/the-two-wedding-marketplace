import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("builds the public wedding experience", async () => {
  const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  assert.match(page, /Mọi thứ cho đám cưới/);
  assert.match(page, /the two/);
  assert.match(page, /AI Wedding Planner/);
  assert.match(page, /href="\/workspace"/);
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
