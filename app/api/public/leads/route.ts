import { NextRequest, NextResponse } from "next/server";
import { findVendor } from "../../../data/marketplace";
import { CONTACT_EMAIL } from "../../../lib/site";
import { logEvent, newId } from "../../../lib/tracking";

type Field = { label: string; value: string };

const readEnv = (key: string) => (typeof process !== "undefined" ? process.env[key]?.trim() : undefined) || undefined;
const text = (value: unknown, max = 2000) => typeof value === "string" ? value.trim().slice(0, max) : "";
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^[0-9+().\s-]{8,20}$/;

function bad(error: string) {
  return NextResponse.json({ error }, { status: 400 });
}

async function sendEmail(subject: string, fields: Field[], replyTo: string) {
  const apiKey = readEnv("RESEND_API_KEY");
  const from = readEnv("VENDOR_NOTIFICATION_FROM");
  if (!apiKey || !from) return false;
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { authorization: `Bearer ${apiKey}`, "content-type": "application/json" },
      body: JSON.stringify({
        from,
        to: [readEnv("VENDOR_NOTIFICATION_TO") ?? CONTACT_EMAIL],
        reply_to: replyTo,
        subject,
        text: fields.map(field => `${field.label}: ${field.value || "—"}`).join("\n"),
      }),
    });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Public intake for couple briefs and vendor applications. Works without an
 * account: the lead is logged with an ID and emailed to the team when Resend is
 * configured. The client offers an email fallback whenever delivery is false.
 */
export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return bad("Dữ liệu gửi lên không hợp lệ."); }

  // Honeypot: real users never see this field.
  if (text(body.company_website)) return NextResponse.json({ id: newId("spam"), delivered: true });
  if (body.consent !== true) return bad("Vui lòng đồng ý chia sẻ thông tin để tiếp tục.");

  const name = text(body.name, 120);
  const email = text(body.email, 160);
  const phone = text(body.phone, 30);
  if (name.length < 2) return bad("Vui lòng nhập tên.");
  if (!EMAIL.test(email)) return bad("Email chưa đúng định dạng.");
  if (phone && !PHONE.test(phone)) return bad("Số điện thoại chưa đúng định dạng.");

  if (body.type === "inquiry") {
    const vendor = findVendor(text(body.vendor, 80));
    const location = text(body.location, 120);
    const message = text(body.message);
    if (!location) return bad("Vui lòng nhập địa điểm dự kiến.");
    if (message.length < 20) return bad("Hãy mô tả nhu cầu ít nhất 20 ký tự để vendor báo giá chính xác.");
    const id = newId("lead");
    const fields: Field[] = [
      { label: "Mã brief", value: id },
      { label: "Vendor", value: vendor ? `${vendor.name} (${vendor.listingId})` : "the two tìm giúp" },
      { label: "Gói quan tâm", value: text(body.package, 120) },
      { label: "Click ID", value: text(body.click_id, 60) },
      { label: "Tên", value: name },
      { label: "Email", value: email },
      { label: "Điện thoại", value: phone },
      { label: "Địa điểm", value: location },
      { label: "Thời gian cưới", value: text(body.date, 40) },
      { label: "Số khách", value: text(body.guests, 10) },
      { label: "Ngân sách (triệu)", value: text(body.budget, 10) },
      { label: "Nhu cầu", value: message },
    ];
    const delivered = await sendEmail(`[the two] Brief mới ${id} — ${vendor?.name ?? "cần matching"}`, fields, email);
    logEvent("inquiry_submitted", { lead_id: id, vendor: vendor?.slug ?? null, listing: vendor?.listingId ?? null, click_id: text(body.click_id, 60) || null, delivered });
    return NextResponse.json({ id, delivered });
  }

  if (body.type === "vendor_application") {
    const businessName = text(body.businessName, 120);
    const category = text(body.category, 60);
    const location = text(body.location, 120);
    const description = text(body.description);
    const website = text(body.website, 200);
    if (businessName.length < 3) return bad("Tên doanh nghiệp cần ít nhất 3 ký tự.");
    if (!category) return bad("Vui lòng chọn nhóm dịch vụ.");
    if (!location) return bad("Vui lòng nhập khu vực hoạt động.");
    if (description.length < 30) return bad("Phần giới thiệu cần ít nhất 30 ký tự.");
    if (website && !/^https?:\/\/\S+\.\S+/.test(website)) return bad("Website cần bắt đầu bằng http:// hoặc https://");
    const id = newId("vapp");
    const fields: Field[] = [
      { label: "Mã hồ sơ", value: id },
      { label: "Doanh nghiệp", value: businessName },
      { label: "Nhóm dịch vụ", value: category },
      { label: "Khu vực", value: location },
      { label: "Website / portfolio", value: website },
      { label: "Người liên hệ", value: name },
      { label: "Email", value: email },
      { label: "Điện thoại", value: phone },
      { label: "Giới thiệu", value: description },
    ];
    const delivered = await sendEmail(`[the two] Hồ sơ vendor mới ${id} — ${businessName}`, fields, email);
    logEvent("vendor_application_submitted", { application_id: id, category, delivered });
    return NextResponse.json({ id, delivered });
  }

  return bad("Loại yêu cầu không hợp lệ.");
}
