import { env } from "cloudflare:workers";

export const dynamic = "force-dynamic";
const id = (prefix: string) => `${prefix}_${crypto.randomUUID().replaceAll("-", "")}`;

async function hmac(secret: string, body: string) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(body));
  return Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function POST(request: Request) {
  const secret = env.PAYMENT_WEBHOOK_SECRET as string | undefined;
  if (!secret) return Response.json({ error: "PAYMENT_PROVIDER_NOT_CONFIGURED" }, { status: 503 });
  const raw = await request.text(); const signature = request.headers.get("x-nang-signature") ?? "";
  if (signature !== await hmac(secret, raw)) return Response.json({ error: "INVALID_SIGNATURE" }, { status: 401 });
  const event = JSON.parse(raw) as { id?: string; obligationId?: string; transactionId?: string; amount?: number; currency?: string; status?: string };
  if (!event.id || !event.obligationId || !event.transactionId || !Number.isInteger(event.amount) || event.status !== "paid") return Response.json({ error: "INVALID_EVENT" }, { status: 422 });
  const duplicate = await env.DB.prepare(`SELECT id FROM payment_webhook_events WHERE provider='sandbox' AND provider_event_id=?`).bind(event.id).first();
  if (duplicate) return Response.json({ received: true, duplicate: true });
  const obligation = await env.DB.prepare(`SELECT * FROM payment_obligations WHERE id=?`).bind(event.obligationId).first() as Record<string, unknown> | null;
  if (!obligation || Number(obligation.amount_due) !== event.amount || (event.currency ?? "VND") !== obligation.currency_code) return Response.json({ error: "PAYMENT_MISMATCH" }, { status: 409 });
  const paidAt = new Date().toISOString();
  const statements = [
    env.DB.prepare(`INSERT INTO payment_webhook_events (id,provider,provider_event_id,payload_hash,status,processed_at) VALUES (?,'sandbox',?,?,'processed',?)`).bind(id("wh"), event.id, await hmac("payload-hash", raw), paidAt),
    env.DB.prepare(`INSERT INTO payment_transactions (id,obligation_id,provider,provider_transaction_id,amount,currency_code,transaction_type,verified_at) VALUES (?,?,'sandbox',?,?,?,'payment',?)`).bind(id("txn"), event.obligationId, event.transactionId, event.amount, event.currency ?? "VND", paidAt),
    env.DB.prepare(`UPDATE payment_obligations SET amount_paid=?,status='PAID',updated_at=CURRENT_TIMESTAMP WHERE id=? AND status!='PAID'`).bind(event.amount, event.obligationId),
    env.DB.prepare(`UPDATE subscriptions SET subscription_status='active',current_period_start=?,current_period_end=?,updated_at=CURRENT_TIMESTAMP WHERE id=(SELECT subscription_id FROM payment_obligations WHERE id=?)`).bind(paidAt, new Date(Date.now()+30*86400000).toISOString(), event.obligationId),
    env.DB.prepare(`UPDATE vendor_bookings SET status='AWAITING_VENDOR_CONFIRMATION',updated_at=CURRENT_TIMESTAMP WHERE id=(SELECT booking_id FROM payment_obligations WHERE id=?) AND status='AWAITING_PAYMENT'`).bind(event.obligationId),
    env.DB.prepare(`INSERT INTO outbox_events (id,event_type,aggregate_type,aggregate_id,event_payload,idempotency_key) VALUES (?,'PAYMENT_VERIFIED','payment_obligation',?,?,?)`).bind(id("out"), event.obligationId, raw, `payment:${event.transactionId}`),
  ];
  await env.DB.batch(statements);
  return Response.json({ received: true, verified: true });
}
