"use client";

import { useEffect, useState } from "react";
import { PublicPage } from "../../components/MarketplaceChrome";
import "./admin.css";

type Application = {
  applicationId: string;
  businessName: string;
  category: string;
  location: string;
  website: string | null;
  description: string;
  applicantName: string;
  applicantEmail: string;
  reviewStatus: string;
  notificationEmail: string;
  emailStatus: "queued" | "sending" | "sent" | "failed";
  emailError: string | null;
  emailedAt: string | null;
  submittedAt: string;
};

const emailLabel = {
  queued: "Chờ cấu hình",
  sending: "Đang gửi",
  sent: "Đã gửi",
  failed: "Gửi lỗi",
};

type PageState = "loading" | "ready" | "signed-out" | "forbidden" | "error";

async function requestApplications(): Promise<{ state: PageState; applications?: Application[] }> {
  const response = await fetch("/api/admin/vendor-applications", { cache: "no-store" });
  if (response.status === 401) return { state: "signed-out" };
  if (response.status === 403) return { state: "forbidden" };
  if (!response.ok) return { state: "error" };
  const result = await response.json() as { applications: Application[] };
  return { state: "ready", applications: result.applications };
}

export default function VendorApplicationsAdminPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [state, setState] = useState<PageState>("loading");
  const [retrying, setRetrying] = useState<string | null>(null);

  async function load() {
    const result = await requestApplications();
    if (result.applications) setApplications(result.applications);
    setState(result.state);
  }

  useEffect(() => {
    let active = true;
    requestApplications().then((result) => {
      if (!active) return;
      if (result.applications) setApplications(result.applications);
      setState(result.state);
    }).catch(() => {
      if (active) setState("error");
    });
    return () => { active = false; };
  }, []);

  async function retryEmail(applicationId: string) {
    setRetrying(applicationId);
    const response = await fetch("/api/admin/vendor-applications", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action: "retry_email", applicationId }),
    });
    setRetrying(null);
    if (response.ok) await load();
  }

  return <PublicPage className="vendor-admin-page">
    <section className="vendor-admin-hero"><div className="market-shell">
      <p className="eyebrow">VENDOR OPERATIONS</p>
      <div className="vendor-admin-heading"><div><h1>Hồ sơ vendor</h1><p>Nguồn dữ liệu chính để xét duyệt, kiểm tra trạng thái email và xuất sang Google Sheets.</p></div>{state === "ready" && <a className="primary-market-btn orange" href="/api/admin/vendor-applications?format=csv">Tải CSV cho Google Sheets</a>}</div>
    </div></section>
    <section className="market-shell vendor-admin-content">
      {state === "loading" && <div className="admin-empty">Đang tải hồ sơ…</div>}
      {state === "signed-out" && <div className="admin-empty"><h2>Cần đăng nhập</h2><p>Đăng nhập bằng tài khoản quản trị để xem dữ liệu vendor.</p><a className="primary-market-btn" href="/signin-with-chatgpt?return_to=%2Fadmin%2Fvendor-applications">Đăng nhập</a></div>}
      {state === "forbidden" && <div className="admin-empty"><h2>Không có quyền truy cập</h2><p>Trang này chỉ dành cho tài khoản quản trị the two.</p></div>}
      {state === "error" && <div className="admin-empty"><h2>Chưa tải được dữ liệu</h2><button className="primary-market-btn" onClick={load}>Thử lại</button></div>}
      {state === "ready" && applications.length === 0 && <div className="admin-empty"><h2>Chưa có hồ sơ nào</h2><p>Hồ sơ mới sẽ xuất hiện ở đây ngay sau khi vendor submit.</p></div>}
      {state === "ready" && applications.length > 0 && <div className="vendor-admin-table-wrap"><table className="vendor-admin-table"><thead><tr><th>Vendor</th><th>Liên hệ</th><th>Thông tin</th><th>Trạng thái email</th><th>Ngày gửi</th><th></th></tr></thead><tbody>{applications.map((application) => <tr key={application.applicationId}><td><strong>{application.businessName}</strong><span>{application.category}</span></td><td><strong>{application.applicantName}</strong><a href={`mailto:${application.applicantEmail}`}>{application.applicantEmail}</a></td><td><span>{application.location}</span>{application.website && <a href={application.website} target="_blank" rel="noreferrer">Portfolio ↗</a>}<details><summary>Xem mô tả</summary><p>{application.description}</p></details></td><td><span className={`email-status ${application.emailStatus}`}>{emailLabel[application.emailStatus]}</span>{application.emailError && <small>{application.emailError === "EMAIL_PROVIDER_NOT_CONFIGURED" ? "Cần kết nối dịch vụ gửi email" : application.emailError}</small>}</td><td>{new Intl.DateTimeFormat("vi-VN", { dateStyle: "short", timeStyle: "short" }).format(new Date(application.submittedAt))}</td><td>{application.emailStatus !== "sent" && <button className="table-action" disabled={retrying === application.applicationId} onClick={() => retryEmail(application.applicationId)}>{retrying === application.applicationId ? "Đang gửi…" : "Gửi lại email"}</button>}</td></tr>)}</tbody></table></div>}
    </section>
  </PublicPage>;
}
