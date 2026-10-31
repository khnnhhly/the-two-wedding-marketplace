import { env } from "cloudflare:workers";
import { getChatGPTUser } from "../../../chatgpt-auth";
import {
  sendVendorApplicationEmail,
  type VendorApplicationNotification,
} from "../../../vendor-notification";

export const dynamic = "force-dynamic";

type ApplicationRow = VendorApplicationNotification & {
  reviewStatus: string;
  notificationEmail: string;
  emailStatus: string;
  emailProviderId: string | null;
  emailError: string | null;
  emailedAt: string | null;
};

async function requireAdmin() {
  const user = await getChatGPTUser();
  if (!user) return { error: Response.json({ error: "AUTH_REQUIRED" }, { status: 401 }) };
  const configured = (env.VENDOR_ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
  const allowed = new Set(["trankhanhly2910@gmail.com", ...configured]);
  if (!allowed.has(user.email.toLowerCase())) {
    return { error: Response.json({ error: "FORBIDDEN" }, { status: 403 }) };
  }
  return { user };
}

async function listApplications(): Promise<ApplicationRow[]> {
  const result = await env.DB.prepare(`
    SELECT
      id AS applicationId,
      vendor_id AS vendorId,
      applicant_name AS applicantName,
      applicant_email AS applicantEmail,
      business_name AS businessName,
      category,
      location,
      website,
      description,
      review_status AS reviewStatus,
      notification_email AS notificationEmail,
      email_status AS emailStatus,
      email_provider_id AS emailProviderId,
      email_error AS emailError,
      emailed_at AS emailedAt,
      submitted_at AS submittedAt
    FROM vendor_applications
    ORDER BY submitted_at DESC
  `).all();
  return (result.results || []) as unknown as ApplicationRow[];
}

export async function GET(request: Request) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;
  const applications = await listApplications();
  if (new URL(request.url).searchParams.get("format") === "csv") {
    return new Response(toCsv(applications), {
      headers: {
        "content-type": "text/csv; charset=utf-8",
        "content-disposition": 'attachment; filename="the-two-vendor-applications.csv"',
        "cache-control": "no-store",
      },
    });
  }
  return Response.json({ applications }, { headers: { "cache-control": "no-store" } });
}

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;
  const body = (await request.json().catch(() => null)) as
    | { action?: string; applicationId?: string }
    | null;
  if (body?.action !== "retry_email" || !body.applicationId) {
    return Response.json({ error: "INVALID_REQUEST" }, { status: 400 });
  }
  const row = await env.DB.prepare(`
    SELECT
      id AS applicationId,
      vendor_id AS vendorId,
      applicant_name AS applicantName,
      applicant_email AS applicantEmail,
      business_name AS businessName,
      category,
      location,
      website,
      description,
      submitted_at AS submittedAt
    FROM vendor_applications
    WHERE id=?
  `).bind(body.applicationId).first() as VendorApplicationNotification | null;
  if (!row) return Response.json({ error: "NOT_FOUND" }, { status: 404 });

  await env.DB.prepare(`UPDATE vendor_applications SET email_status='sending',email_error=NULL,updated_at=CURRENT_TIMESTAMP WHERE id=?`).bind(row.applicationId).run();
  const result = await sendVendorApplicationEmail({
    ...row,
    adminUrl: `${new URL(request.url).origin}/admin/vendor-applications`,
  });
  if (result.status === "sent") {
    await env.DB.batch([
      env.DB.prepare(`UPDATE vendor_applications SET email_status='sent',email_provider_id=?,email_error=NULL,emailed_at=?,updated_at=CURRENT_TIMESTAMP WHERE id=?`).bind(result.providerId, new Date().toISOString(), row.applicationId),
      env.DB.prepare(`UPDATE outbox_events SET processing_status='processed',processed_at=? WHERE event_type='VENDOR_APPLICATION_SUBMITTED' AND aggregate_id=?`).bind(new Date().toISOString(), row.applicationId),
    ]);
  } else {
    const status = result.status === "queued" ? "queued" : "failed";
    await env.DB.batch([
      env.DB.prepare(`UPDATE vendor_applications SET email_status=?,email_error=?,updated_at=CURRENT_TIMESTAMP WHERE id=?`).bind(status, result.error, row.applicationId),
      env.DB.prepare(`UPDATE outbox_events SET processing_status=?,retry_count=retry_count+1,next_retry_at=datetime('now','+15 minutes') WHERE event_type='VENDOR_APPLICATION_SUBMITTED' AND aggregate_id=?`).bind(status === "failed" ? "failed" : "pending", row.applicationId),
    ]);
  }
  return Response.json({ emailStatus: result.status, error: result.error });
}

function toCsv(rows: ApplicationRow[]): string {
  const headers = [
    "Submitted at",
    "Business name",
    "Category",
    "Location",
    "Website",
    "Description",
    "Applicant name",
    "Applicant email",
    "Review status",
    "Notification email",
    "Email status",
    "Emailed at",
    "Vendor ID",
    "Application ID",
  ];
  const values = rows.map((row) => [
    row.submittedAt,
    row.businessName,
    row.category,
    row.location,
    row.website || "",
    row.description,
    row.applicantName,
    row.applicantEmail,
    row.reviewStatus,
    row.notificationEmail,
    row.emailStatus,
    row.emailedAt || "",
    row.vendorId,
    row.applicationId,
  ]);
  return `\uFEFF${[headers, ...values].map((row) => row.map(csvCell).join(",")).join("\r\n")}`;
}

function csvCell(value: string): string {
  return `"${String(value).replaceAll('"', '""')}"`;
}
