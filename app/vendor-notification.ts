import { env } from "cloudflare:workers";

export type VendorApplicationNotification = {
  applicationId: string;
  vendorId: string;
  applicantName: string;
  applicantEmail: string;
  businessName: string;
  category: string;
  location: string;
  website: string | null;
  description: string;
  submittedAt: string;
  adminUrl: string;
};

export type VendorEmailResult =
  | { status: "sent"; providerId: string; error: null }
  | { status: "queued" | "failed"; providerId: null; error: string };

const defaultRecipient = "thetwoplanner@gmail.com";

export function vendorNotificationRecipient(): string {
  return env.VENDOR_NOTIFICATION_TO?.trim() || defaultRecipient;
}

export async function sendVendorApplicationEmail(
  application: VendorApplicationNotification,
): Promise<VendorEmailResult> {
  const apiKey = env.RESEND_API_KEY?.trim();
  const from = env.VENDOR_NOTIFICATION_FROM?.trim();
  if (!apiKey || !from) {
    return {
      status: "queued",
      providerId: null,
      error: "EMAIL_PROVIDER_NOT_CONFIGURED",
    };
  }

  const recipient = vendorNotificationRecipient();
  const subject = `[the two] Hồ sơ vendor mới — ${application.businessName}`;
  const text = [
    "Có hồ sơ vendor mới cần xét duyệt.",
    "",
    `Doanh nghiệp: ${application.businessName}`,
    `Danh mục: ${application.category}`,
    `Khu vực: ${application.location}`,
    `Người gửi: ${application.applicantName}`,
    `Email: ${application.applicantEmail}`,
    `Website: ${application.website || "Không cung cấp"}`,
    `Thời gian: ${application.submittedAt}`,
    "",
    application.description,
    "",
    `Xem danh sách hồ sơ: ${application.adminUrl}`,
  ].join("\n");

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        authorization: `Bearer ${apiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [recipient],
        reply_to: application.applicantEmail,
        subject,
        text,
        html: emailHtml(application),
      }),
    });
    const result = (await response.json().catch(() => null)) as
      | { id?: string; message?: string; name?: string }
      | null;
    if (!response.ok || !result?.id) {
      return {
        status: "failed",
        providerId: null,
        error: String(result?.message || result?.name || `EMAIL_HTTP_${response.status}`).slice(0, 500),
      };
    }
    return { status: "sent", providerId: result.id, error: null };
  } catch (error) {
    return {
      status: "failed",
      providerId: null,
      error: String(error instanceof Error ? error.message : error).slice(0, 500),
    };
  }
}

function emailHtml(application: VendorApplicationNotification): string {
  const row = (label: string, value: string) =>
    `<tr><td style="padding:8px 12px;color:#5d5d66;border-bottom:1px solid #ece9e2">${escapeHtml(label)}</td><td style="padding:8px 12px;font-weight:600;border-bottom:1px solid #ece9e2">${escapeHtml(value)}</td></tr>`;
  return `<!doctype html><html lang="vi"><body style="margin:0;background:#f5f1e9;color:#2c2724;font-family:Arial,sans-serif"><div style="max-width:680px;margin:0 auto;padding:32px 20px"><div style="background:#172b7a;color:#fff;padding:24px 28px"><div style="font-size:13px;letter-spacing:.12em;text-transform:uppercase">the two · vendor operations</div><h1 style="margin:12px 0 0;font-size:26px">Hồ sơ vendor mới</h1></div><div style="background:#fff;padding:24px 28px"><p style="margin-top:0">Một vendor vừa gửi hồ sơ và đang chờ xét duyệt.</p><table style="width:100%;border-collapse:collapse;font-size:14px">${row("Doanh nghiệp", application.businessName)}${row("Danh mục", application.category)}${row("Khu vực", application.location)}${row("Người gửi", application.applicantName)}${row("Email", application.applicantEmail)}${row("Website", application.website || "Không cung cấp")}${row("Thời gian", application.submittedAt)}</table><h2 style="font-size:16px;margin:24px 0 8px">Giới thiệu năng lực</h2><p style="line-height:1.6;white-space:pre-line">${escapeHtml(application.description)}</p><a href="${escapeHtml(application.adminUrl)}" style="display:inline-block;margin-top:16px;padding:12px 18px;background:#ff6b2c;color:#fff;text-decoration:none;font-weight:700">Mở danh sách hồ sơ</a></div></div></body></html>`;
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  })[character] || character);
}
