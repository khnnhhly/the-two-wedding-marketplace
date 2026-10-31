"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import { FormEvent, useEffect, useState } from "react";
import { PublicPage } from "../components/MarketplaceChrome";

type Form = { businessName: string; category: string; location: string; website: string; description: string };

export default function VendorOnboardingPage() {
  const [form, setForm] = useState<Form>({ businessName: "", category: "", location: "", website: "", description: "" });
  const [auth, setAuth] = useState<"loading" | "signed-out" | "signed-in">("loading");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  useEffect(() => {
    const draft = sessionStorage.getItem("the-two-vendor-draft");
    if (draft) try { setForm(JSON.parse(draft)); } catch { /* ignore invalid local draft */ }
    fetch("/api/vendor-center", { cache: "no-store" }).then(response => setAuth(response.status === 401 ? "signed-out" : "signed-in")).catch(() => setAuth("signed-out"));
  }, []);
  const set = (key: keyof Form, value: string) => setForm(current => ({ ...current, [key]: value }));
  async function submit(event: FormEvent) {
    event.preventDefault();
    sessionStorage.setItem("the-two-vendor-draft", JSON.stringify(form));
    if (auth !== "signed-in") { window.location.href = "/signin-with-chatgpt?return_to=%2Fvendor-onboarding"; return; }
    setBusy(true); setMessage("");
    try {
      const response = await fetch("/api/platform", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ action: "register_vendor", ...form }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Không thể gửi hồ sơ");
      sessionStorage.removeItem("the-two-vendor-draft");
      window.location.href = "/vendor-center?submitted=1";
    } catch (error) { setMessage(error instanceof Error ? error.message : "Có lỗi xảy ra"); setBusy(false); }
  }
  return <PublicPage className="vendor-onboarding-page"><section className="planning-hero vendor-onboard-hero"><div className="market-shell"><p className="eyebrow">VENDOR FLOW · BƯỚC 1/3</p><h1>Tạo hồ sơ doanh nghiệp<br/><em>rõ ràng ngay từ đầu.</em></h1><p>Thông tin này dùng cho xét duyệt ban đầu. Bạn có thể hoàn thiện listing sau trong Vendor Center.</p><div className="journey-line"><span className="active"><b>01</b>Hồ sơ doanh nghiệp</span><span><b>02</b>Xét duyệt</span><span><b>03</b>Đăng listing & nhận inquiry</span></div></div></section><section className="market-shell planning-form-layout"><form className="planning-form" onSubmit={submit}><div className="form-heading"><p className="eyebrow">HỒ SƠ XÉT DUYỆT</p><h2>Thông tin vendor</h2></div><div className="form-grid"><label><span>Tên doanh nghiệp</span><input required minLength={3} value={form.businessName} onChange={event => set("businessName", event.target.value)} placeholder="Tên thương hiệu"/></label><label><span>Nhóm dịch vụ chính</span><select required value={form.category} onChange={event => set("category", event.target.value)}><option value="">Chọn danh mục</option><option>Wedding Planner</option><option>Photo & Film</option><option>Venue</option><option>Trang trí</option><option>Trang phục</option><option>Makeup</option><option>Khác</option></select></label><label><span>Khu vực hoạt động</span><input required value={form.location} onChange={event => set("location", event.target.value)} placeholder="Hà Nội · TP.HCM"/></label><label><span>Website / portfolio <small>không bắt buộc</small></span><input value={form.website} onChange={event => set("website", event.target.value)} placeholder="https://"/></label><label className="wide"><span>Giới thiệu năng lực & phong cách</span><textarea required minLength={30} rows={6} value={form.description} onChange={event => set("description", event.target.value)} placeholder="Mô tả dịch vụ, kinh nghiệm, phong cách và đối tượng khách hàng phù hợp…"/></label></div><div className="consent-note"><b>Trạng thái sau khi gửi: Chờ xét duyệt.</b><p>Hồ sơ chưa tự động xuất hiện trên marketplace và chưa thể nhận inquiry.</p></div>{message && <p className="form-error">{message}</p>}<button className="primary-market-btn orange" disabled={busy || auth === "loading"}>{busy ? "Đang gửi…" : auth === "signed-out" ? "Đăng nhập & tiếp tục →" : "Gửi hồ sơ xét duyệt →"}</button></form><aside className="planning-aside"><p className="eyebrow">CHECKLIST HỒ SƠ</p><h3>Chuẩn bị để được duyệt nhanh hơn.</h3><ol><li><b>01</b><span>Tên và khu vực hoạt động chính xác.</span></li><li><b>02</b><span>Portfolio hoặc website đang hoạt động.</span></li><li><b>03</b><span>Mô tả rõ dịch vụ và phạm vi nhận việc.</span></li></ol><a href="/for-vendors">Xem đầy đủ cách hoạt động →</a></aside></section></PublicPage>;
}
