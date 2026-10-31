"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import { FormEvent, useEffect, useState } from "react";
import { ConsentField, LeadSuccess } from "../components/LeadSuccess";
import { PublicPage } from "../components/MarketplaceChrome";
import { currentMonth, formatWeddingMonth, loadDiscoveryProfile, LIMITS } from "../data/discovery";
import { findVendor, type VendorProfile, vendorPrice } from "../data/marketplace";
import { loginPath } from "../lib/site";

type Form = { name: string; email: string; phone: string; location: string; date: string; guests: string; budget: string; message: string; company_website: string };
const empty: Form = { name: "", email: "", phone: "", location: "", date: "", guests: "", budget: "", message: "", company_website: "" };

export default function InquiryPage() {
  const [vendor, setVendor] = useState<VendorProfile | null>(null);
  const [pkg, setPkg] = useState("");
  const [clickId, setClickId] = useState("");
  const [form, setForm] = useState<Form>(empty);
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ id: string; delivered: boolean } | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setVendor(findVendor(params.get("vendor") ?? "") ?? null);
    setPkg(params.get("package") ?? "");
    setClickId(params.get("click_id") ?? "");
    const profile = loadDiscoveryProfile();
    if (profile) setForm(current => ({ ...current, location: profile.location, date: /^\d{4}-\d{2}$/.test(profile.date) ? profile.date : "", guests: profile.guests, message: [profile.budget && `Tổng ngân sách đám cưới khoảng ${profile.budget} triệu.`, profile.style && `Phong cách mong muốn: ${profile.style}.`].filter(Boolean).join(" ") + (profile.budget || profile.style ? " " : "") }));
  }, []);

  const set = (key: keyof Form, value: string) => setForm(current => ({ ...current, [key]: value }));

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    if (!consent) { setError("Vui lòng đồng ý chia sẻ thông tin với vendor để tiếp tục."); return; }
    setBusy(true);
    try {
      const response = await fetch("/api/public/leads", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ type: "inquiry", vendor: vendor?.slug, package: pkg, click_id: clickId, consent, ...form }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Không gửi được brief. Vui lòng thử lại.");
      setResult(data);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Không gửi được brief. Vui lòng thử lại.");
    } finally {
      setBusy(false);
    }
  }

  const target = vendor ? vendor.name : "the two";
  const summary = [`Vendor: ${vendor?.name ?? "the two tìm giúp"}`, pkg && `Gói: ${pkg}`, `Tên: ${form.name}`, `Email: ${form.email}`, form.phone && `Điện thoại: ${form.phone}`, `Địa điểm: ${form.location}`, form.date && `Thời gian: ${formatWeddingMonth(form.date)}`, form.guests && `Số khách: ${form.guests}`, form.budget && `Ngân sách: ${form.budget} triệu`, `Nhu cầu: ${form.message}`].filter(Boolean).join("\n");

  return <PublicPage className="vendor-onboarding-page inquiry-page">
    <section className="planning-hero vendor-onboard-hero"><div className="market-shell"><p className="eyebrow">GỬI BRIEF · MIỄN PHÍ</p><h1>{vendor ? <>Gửi brief cho<br/><em>{vendor.name}.</em></> : <>Chưa tìm thấy vendor phù hợp?<br/><em>Gửi brief, the two tìm giúp.</em></>}</h1><p>Không cần tạo tài khoản. Brief đầy đủ giúp vendor kiểm tra lịch và báo giá chính xác ngay lần đầu.</p></div></section>
    <section className="market-shell planning-form-layout">
      {result ? <LeadSuccess id={result.id} delivered={result.delivered} title={`Brief đã được gửi tới ${target}.`} subject="[the two] Brief" body={summary} next={{ href: "/vendors?recommended=1", label: "← Tiếp tục tra cứu category khác" }}/> :
      <form className="planning-form" onSubmit={submit} noValidate={false}>
        <div className="form-heading"><p className="eyebrow">THÔNG TIN CƯỚI</p><h2>Brief cho {target}</h2>{pkg && <p className="package-pill">Gói quan tâm: <b>{pkg}</b></p>}</div>
        <div className="form-grid">
          <label><span>Tên của bạn</span><input required minLength={2} autoComplete="name" value={form.name} onChange={event => set("name", event.target.value)}/></label>
          <label><span>Email</span><input required type="email" autoComplete="email" value={form.email} onChange={event => set("email", event.target.value)}/></label>
          <label><span>Số điện thoại / Zalo <small>không bắt buộc</small></span><input type="tel" autoComplete="tel" value={form.phone} onChange={event => set("phone", event.target.value)} placeholder="09xx xxx xxx"/></label>
          <label><span>Địa điểm dự kiến</span><input required value={form.location} onChange={event => set("location", event.target.value)} placeholder="Hà Nội, TP.HCM…"/></label>
          <label><span>Tháng cưới <small>không bắt buộc</small></span><input type="month" min={currentMonth()} value={form.date} onChange={event => set("date", event.target.value)}/></label>
          <label><span>Số khách <small>không bắt buộc</small></span><input type="number" inputMode="numeric" min={LIMITS.guests.min} max={LIMITS.guests.max} value={form.guests} onChange={event => set("guests", event.target.value)} placeholder="250"/></label>
          <label><span>Ngân sách cho hạng mục này <small>triệu đồng</small></span><input type="number" inputMode="numeric" min={1} max={LIMITS.budget.max} value={form.budget} onChange={event => set("budget", event.target.value)} placeholder="20"/></label>
          <label className="wide"><span>Nhu cầu cụ thể</span><textarea required minLength={20} rows={5} value={form.message} onChange={event => set("message", event.target.value)} placeholder="Phong cách, khung giờ, hạng mục cần báo giá, câu hỏi cho vendor…"/></label>
          <label className="hp" aria-hidden="true"><span>Website công ty</span><input tabIndex={-1} autoComplete="off" value={form.company_website} onChange={event => set("company_website", event.target.value)}/></label>
        </div>
        {vendor && <div className="consent-note"><b>{vendor.name} · {vendorPrice(vendor)}</b><p>Brief chưa tạo booking và chưa giữ lịch. Vendor xác nhận lịch trống và báo giá sau khi đọc brief.</p></div>}
        <ConsentField checked={consent} onChange={setConsent}>Tôi đồng ý để the two chia sẻ thông tin trong brief với {vendor ? vendor.name : "vendor phù hợp"} nhằm tư vấn và báo giá.</ConsentField>
        {error && <p className="form-error" role="alert">{error}</p>}
        <button className="primary-market-btn orange" disabled={busy}>{busy ? "Đang gửi…" : "Gửi brief →"}</button>
      </form>}
      <aside className="planning-aside"><p className="eyebrow">SAU KHI GỬI</p><h3>Điều gì xảy ra tiếp theo?</h3><ol><li><b>01</b><span>Bạn nhận mã tham chiếu cho brief.</span></li><li><b>02</b><span>Vendor kiểm tra lịch và phản hồi qua email/điện thoại.</span></li><li><b>03</b><span>So sánh báo giá cùng phạm vi trước khi đặt cọc.</span></li></ol><a href={loginPath("/workspace")}>Muốn lưu mọi brief vào một nơi? Mở Workspace →</a></aside>
    </section>
  </PublicPage>;
}
