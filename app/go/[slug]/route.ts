import { NextRequest, NextResponse } from "next/server";
import { findVendor } from "../../data/marketplace";
import { isBot, logEvent, newId } from "../../lib/tracking";

const CHANNELS = new Set(["inquiry", "website", "instagram", "phone"]);
const DEDUPE_SECONDS = 60 * 60 * 24;

/**
 * Click redirect: records a click_id with vendor, listing, category, channel and
 * CTA position, then forwards to the inquiry form or the vendor's own channel
 * with UTM parameters and the_two_click_id.
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const vendor = findVendor(slug);
  if (!vendor) return NextResponse.redirect(new URL("/vendors", request.url));

  const search = request.nextUrl.searchParams;
  const channel = CHANNELS.has(search.get("channel") ?? "") ? search.get("channel")! : "inquiry";
  const position = (search.get("pos") ?? "unknown").slice(0, 40);
  const pkg = (search.get("package") ?? "").slice(0, 120);
  const dedupeCookie = `t2c_${vendor.listingId}_${channel}`;
  const repeat = request.cookies.get(dedupeCookie)?.value;
  const bot = isBot(request.headers.get("user-agent"));
  const clickId = repeat ?? newId("clk");

  // Only first-time, human clicks within 24h are billable "qualified unique clicks".
  logEvent("vendor_click", {
    click_id: clickId,
    vendor: vendor.slug,
    listing: vendor.listingId,
    category: vendor.category,
    channel,
    position,
    package: pkg || null,
    referrer: request.headers.get("referer"),
    qualified: !bot && !repeat,
    reason: bot ? "bot" : repeat ? "duplicate_24h" : null,
  });

  let destination: URL;
  if (channel === "inquiry") {
    destination = new URL("/inquiry", request.url);
    destination.searchParams.set("vendor", vendor.slug);
    if (pkg) destination.searchParams.set("package", pkg);
    destination.searchParams.set("click_id", clickId);
  } else {
    const target = channel === "phone" ? vendor.contacts?.phone && `tel:${vendor.contacts.phone}` : vendor.contacts?.[channel as "website" | "instagram"];
    if (!target) return NextResponse.redirect(new URL(`/vendors/${vendor.slug}`, request.url));
    destination = new URL(target);
    if (destination.protocol.startsWith("http")) {
      destination.searchParams.set("utm_source", "thetwo");
      destination.searchParams.set("utm_medium", "marketplace");
      destination.searchParams.set("utm_campaign", vendor.category);
      destination.searchParams.set("utm_content", position);
      destination.searchParams.set("the_two_click_id", clickId);
    }
  }

  const response = NextResponse.redirect(destination, 302);
  response.headers.set("x-robots-tag", "noindex");
  if (!repeat && !bot) response.cookies.set(dedupeCookie, clickId, { maxAge: DEDUPE_SECONDS, httpOnly: true, sameSite: "lax", secure: true, path: "/" });
  return response;
}
