"use client";

/* eslint-disable @next/next/no-html-link-for-pages */

import { FormEvent, useState } from "react";
import { PublicPage } from "../components/MarketplaceChrome";

type Brief = { names: string; date: string; location: string; guests: string; budget: string; style: string; priorities: string };

export default function PlanningPage() {
  const [brief, setBrief] = useState<Brief>({ names: "", date: "", location: "", guests: "", budget: "", style: "", priorities: "" });
  const set = (key: keyof Brief, value: string) => setBrief(current => ({ ...current, [key]: value }));
  function submit(event: FormEvent) {
    event.preventDefault();
    const idea = [
      brief.names && `Hai bạn: ${brief.names}.`, brief.location && `Dự kiến tổ chức tại ${brief.location}.`, brief.date && `Thời gian cưới: ${brief.date}.`,
      brief.guests && `Khoảng ${brief.guests} khách.`, brief.budget && `Ngân sách dự kiến ${brief.budget} triệu đồng.`, brief.style && `Phong cách: ${brief.style}.`, brief.priorities && `Ưu tiên và ghi chú: ${brief.priorities}.`,
    ].filter(Boolean).join(" ");
    sessionStorage.setItem("the-two-planning-draft", idea);
    window.location.href = "/workspace?from=planning";
  }
  return <PublicPage className="planning-page"><section className="planning-hero"><div className="market-shell"><p className="eyebrow">COUPLE FLOW · BƯỚC 1/4</p><h1>Cho the two biết những gì<br/><em>hai bạn đã biết.</em></h1><p>Không cần có đủ câu trả lời. Thông tin chưa chắc chắn có thể để trống và bổ sung sau.</p><div className="journey-line"><span className="active"><b>01</b>Chia sẻ brief</span><span><b>02</b>Duyệt AI proposal</span><span><b>03</b>Lập kế hoạch</span><span><b>04</b>Tìm & booking vendor</span></div></div></section><section className="market-shell planning-form-layout"><form className="planning-form" onSubmit={submit}><div className="form-heading"><p className="eyebrow">THÔNG TIN BAN ĐẦU</p><h2>Tạo Wedding Brief</h2><p>the two chỉ dùng dữ liệu này để chuẩn bị bản đề xuất. Bạn sẽ duyệt trước khi lưu.</p></div><div className="form-grid"><label><span>Tên hai bạn <small>không bắt buộc</small></span><input value={brief.names} onChange={event => set("names", event.target.value)} placeholder="Linh & Minh"/></label><label><span>Thời gian cưới</span><input value={brief.date} onChange={event => set("date", event.target.value)} placeholder="Tháng 12/2027 hoặc chưa chốt"/></label><label><span>Địa điểm dự kiến</span><input required value={brief.location} onChange={event => set("location", event.target.value)} placeholder="Hà Nội"/></label><label><span>Số khách dự kiến</span><input required type="number" min="10" value={brief.guests} onChange={event => set("guests", event.target.value)} placeholder="250"/></label><label><span>Ngân sách dự kiến <small>triệu đồng</small></span><input required type="number" min="10" value={brief.budget} onChange={event => set("budget", event.target.value)} placeholder="400"/></label><label><span>Phong cách</span><input value={brief.style} onChange={event => set("style", event.target.value)} placeholder="Tối giản, ấm áp, nhiều hoa"/></label><label className="wide"><span>Điều hai bạn ưu tiên hoặc đang băn khoăn</span><textarea value={brief.priorities} onChange={event => set("priorities", event.target.value)} rows={5} placeholder="Ví dụ: ưu tiên trải nghiệm khách mời, chưa biết chia ngân sách thế nào…"/></label></div><div className="consent-note"><b>✦ AI luôn chờ bạn xác nhận.</b><p>Bản đề xuất không tự tạo booking, không tự liên hệ vendor và không tự ghi dữ liệu vào Workspace.</p></div><button className="primary-market-btn orange">Tiếp tục với the two AI →</button></form><aside className="planning-aside"><p className="eyebrow">SAU BƯỚC NÀY</p><h3>Bạn vẫn là người quyết định.</h3><ol><li><b>01</b><span>AI đọc brief và tách những dữ kiện đã có.</span></li><li><b>02</b><span>Bạn xem ngân sách, timeline và checklist đề xuất.</span></li><li><b>03</b><span>Chỉ phần được xác nhận mới lưu vào Workspace.</span></li></ol><a href="/templates">Chưa sẵn sàng? Xem template trước →</a></aside></section></PublicPage>;
}
