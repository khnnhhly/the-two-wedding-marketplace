import { env } from "cloudflare:workers";
import { getChatGPTUser } from "../../chatgpt-auth";

export const dynamic = "force-dynamic";

async function userId(email: string) {
  const bytes = new TextEncoder().encode(email.toLowerCase());
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  return `usr_${Array.from(new Uint8Array(hash)).slice(0, 16).map(byte => byte.toString(16).padStart(2, "0")).join("")}`;
}

export async function GET() {
  const user = await getChatGPTUser();
  if (!user) return Response.json({ error: "AUTH_REQUIRED" }, { status: 401 });
  const uid = await userId(user.email);
  const vendor = await env.DB.prepare(`SELECT id,business_name,slug,description,location,verification_status,account_status,accepting_inquiries,created_at FROM vendors WHERE owner_id=? ORDER BY created_at DESC LIMIT 1`).bind(uid).first();
  if (!vendor) return Response.json({ user: { name: user.displayName, email: user.email }, vendor: null, listings: [], inquiries: [], bookings: [] });
  const [listings, inquiries, bookings] = await Promise.all([
    env.DB.prepare(`SELECT id,title,slug,booking_type,price_type,starting_price_amount,listing_status,created_at FROM vendor_listings WHERE vendor_id=? ORDER BY created_at DESC`).bind(vendor.id).all(),
    env.DB.prepare(`SELECT i.id,i.inquiry_number,i.status,i.requested_date,i.event_location,i.guest_count,i.budget_min,i.budget_max,i.requirements,i.created_at,l.title listing_title,p.project_name FROM vendor_inquiries i JOIN vendor_listings l ON l.id=i.listing_id JOIN wedding_projects p ON p.id=i.wedding_project_id WHERE i.vendor_id=? ORDER BY i.created_at DESC`).bind(vendor.id).all(),
    env.DB.prepare(`SELECT b.id,b.booking_number,b.status,b.contract_value,b.created_at,l.title listing_title FROM vendor_bookings b JOIN vendor_listings l ON l.id=b.listing_id WHERE b.vendor_id=? ORDER BY b.created_at DESC`).bind(vendor.id).all(),
  ]);
  return Response.json({ user: { name: user.displayName, email: user.email }, vendor, listings: listings.results, inquiries: inquiries.results, bookings: bookings.results });
}
