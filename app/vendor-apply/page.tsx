"use client";

 

import { FormEvent, useState } from "react";
import { ConsentField, LeadSuccess } from "../components/LeadSuccess";
import { PublicPage } from "../components/MarketplaceChrome";
import { serviceCategories } from "../data/discovery";

type Form = { businessName: string; category: string; location: string; website: string; description: string; name: string; email: string; phone: string; company_website: string };
const empty: Form = { businessName: "", category: "", location: "", website: "", description: "", name: "", email: "", phone: "", company_website: "" };

export default function VendorApplyPage() {
  const [form, setForm] = useState<Form>(empty);
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ id: string; delivered: boolean } | null>(null);
  const set = (key: keyof Form, value: string) => setForm(current => ({ ...current, [key]: value }));

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    if (!consent) { setError("Vui lòng xác nhận thông tin và đồng ý với điều khoản vendor."); return; }
    setBusy(true);
    try {
      const response = await fetch("/api/public/leads", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ type: "vendor_application", consent, ...form }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Không gửi được hồ sơ.");
      setResult(data);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Không gửi được hồ sơ.");
    } finally {
      setBusy(false);
    }
  }

  const summary = [`Doanh nghiệp: ${form.businessName}`, `Nhóm dịch vụ: ${form.category}`, `Khu vực: ${form.location}`, form.website && `Website: ${form.website}`, `Người liên hệ: ${form.name}`, `Email: ${form.email}`, form.phone && `Điện thoại: ${form.phone}`, `Giới thiệu: ${form.description}`].filter(Boolean).join("\n");

  return <PublicPage className="vendor-onboarding-page">
    <section className="planning-hero vendor-onboard-hero"><div className="market-shell"><p className="eyebrow">VENDOR FLOW · BƯỚC 1/3</p><h1>Tạo hồ sơ doanh nghiệp<br/><em>rõ ràng ngay từ đầu.</em></h1><p>Không cần tạo tài khoản để nộp hồ sơ. the two xét duyệt và liên hệ để hoàn thiện listing.</p><div className="journey-line"><span className="active"><b>01</b>Hồ sơ doanh nghiệp</span><span><b>02</b>Xét duyệt</span><span><b>03</b>Đăng listing & nhận inquiry</span></div></div></section>
    <section className="market-shell planning-form-layout">
      {result ? <LeadSuccess id={result.id} delivered={result.delivered} title="Hồ sơ đã ở trạng thái chờ xét duyệt." subject="[the two] Hồ sơ vendor" body={summary} next={{ href: "/policies/fees", label: "Trong lúc chờ, xem bảng phí & cách tính →" }}/> :
      <form className="planning-form" onSubmit={submit}>
        <div className="form-heading"><p className="eyebrow">HỒ SƠ XÉT DUYỆT</p><h2>Thông tin vendor</h2></div>
        <div className="form-grid">
          <label><span>Tên doanh nghiệp</span><input required minLength={3} value={form.businessName} onChange={event => set("businessName", event.target.value)} placeholder="Tên thương hiệu"/></label>
          <label><span>Nhóm dịch vụ chính</span><select required value={form.category} onChange={event => set("category", event.target.value)}><option value="">Chọn danh mục</option>{serviceCategories.map(category => <option key={category.name}>{category.name}</option>)}<option>Khác</option></select></label>
          <label><span>Khu vực hoạt động</span><input required value={form.location} onChange={event => set("location", event.target.value)} placeholder="Hà Nội · TP.HCM"/></label>
          <label><span>Website / portfolio <small>không bắt buộc</small></span><input type="url" value={form.website} onChange={event => set("website", event.target.value)} placeholder="https://"/></label>
          <label><span>Người liên hệ</span><input required minLength={2} autoComplete="name" value={form.name} onChange={event => set("name", event.target.value)}/></label>
          <label><span>Email</span><input required type="email" autoComplete="email" value={form.email} onChange={event => set("email", event.target.value)}/></label>
          <label><span>Số điện thoại / Zalo <small>không bắt buộc</small></span><input type="tel" autoComplete="tel" value={form.phone} onChange={event => set("phone", event.target.value)}/></label>
          <label className="wide"><span>Giới thiệu năng lực & phong cách</span><textarea required minLength={30} rows={6} value={form.description} onChange={event => set("description", event.target.value)} placeholder="Mô tả dịch vụ, kinh nghiệm, phong cách và đối tượng khách hàng phù hợp…"/></label>
          <label className="hp" aria-hidden="true"><span>Website công ty</span><input tabIndex={-1} autoComplete="off" value={form.company_website} onChange={event => set("company_website", event.target.value)}/></label>
        </div>
        <div className="consent-note"><b>Trạng thái sau khi gửi: Chờ xét duyệt.</b><p>Hồ sơ chưa tự động xuất hiện trên marketplace và chưa nhận inquiry cho tới khi được duyệt. Gói Free không mất phí; xem <a href="/policies/fees">bảng phí</a>.</p></div>
        <ConsentField checked={consent} onChange={setConsent}>Tôi xác nhận thông tin là chính xác và đồng ý với <a href="/legal/terms" target="_blank">điều khoản dành cho vendor</a>.</ConsentField>
        {error && <p className="form-error" role="alert">{error}</p>}
        <button className="primary-market-btn orange" disabled={busy}>{busy ? "Đang gửi…" : "Gửi hồ sơ xét duyệt →"}</button>
      </form>}
      <aside className="planning-aside"><p className="eyebrow">CHECKLIST HỒ SƠ</p><h3>Chuẩn bị để được duyệt nhanh hơn.</h3><ol><li><b>01</b><span>Tên và khu vực hoạt động chính xác.</span></li><li><b>02</b><span>Portfolio hoặc website đang hoạt động.</span></li><li><b>03</b><span>Mô tả rõ dịch vụ và phạm vi nhận việc.</span></li></ol><a href="/for-vendors">Xem đầy đủ cách hoạt động →</a></aside>
    </section>
  </PublicPage>;
}
