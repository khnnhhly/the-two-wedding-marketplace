"use client";

import { FormEvent, useState } from "react";

const quick = [
  { label: "Tìm đúng flow cho mình", href: "/planning" },
  { label: "Tra cứu theo category", href: "/vendors" },
  { label: "Xem template", href: "/templates" },
  { label: "Dành cho vendor", href: "/for-vendors" },
];

function answerFor(text: string) {
  const value = text.toLowerCase();
  const category = value.includes("venue") || value.includes("địa điểm") ? "Địa điểm"
    : value.includes("photo") || value.includes("ảnh") || value.includes("quay") ? "Photo & Film"
    : value.includes("trang trí") || value.includes("decor") ? "Trang trí"
    : value.includes("váy") || value.includes("trang phục") ? "Trang phục"
    : value.includes("makeup") || value.includes("trang điểm") ? "Makeup"
    : value.includes("thiệp") || value.includes("quà") ? "Thiệp & Quà"
    : value.includes("band") || value.includes("nhạc") || value.includes("giải trí") ? "Giải trí"
    : value.includes("planner") || value.includes("điều phối") ? "Wedding Planner" : null;
  if (category) return { text: `Mình đã xác định category phù hợp là ${category}. Bạn có thể tra cứu thẳng và xem từng hồ sơ.`, href: `/vendors?category=${encodeURIComponent(category)}`, label: `Xem ${category}` };
  if (value.includes("vendor") || value.includes("dịch vụ")) return { text: "Nếu chưa biết category nào cần trước, hãy trả lời bộ câu hỏi ngắn để nhận flow tra cứu phù hợp.", href: "/planning", label: "Tìm đúng flow" };
  if (value.includes("template") || value.includes("checklist")) return { text: "Template có trang riêng và có thể thêm thẳng vào Wedding Workspace.", href: "/templates", label: "Xem template" };
  if (value.includes("bán") || value.includes("gian hàng") || value.includes("đăng ký")) return { text: "Vendor có luồng onboarding riêng: tạo hồ sơ, gửi duyệt rồi quản lý inquiry trong Vendor Center.", href: "/vendor-onboarding", label: "Mở hồ sơ vendor" };
  return { text: "Mình khuyên bắt đầu bằng 5 câu hỏi ngắn. the two sẽ khai thác insight rồi xếp thứ tự category cần tra cứu.", href: "/planning", label: "Bắt đầu discovery" };
}

export function AiConcierge() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [reply, setReply] = useState<{ text: string; href: string; label: string } | null>(null);
  function submit(event: FormEvent) {
    event.preventDefault();
    if (!input.trim()) return;
    setReply(answerFor(input));
    setInput("");
  }
  return <aside className={`ai-concierge${open ? " open" : ""}`} aria-label="the two AI guide">
    {open && <div className="ai-concierge-panel">
      <header><span>✦</span><div><strong>the two AI guide</strong><small>Điều hướng & planning</small></div><button onClick={() => setOpen(false)} aria-label="Đóng AI guide">×</button></header>
      <div className="ai-message"><b>Chào bạn, mình giúp gì được?</b><p>Nếu chưa biết bắt đầu từ đâu, mình sẽ đưa bạn qua bộ câu hỏi ngắn trước khi tra cứu.</p></div>
      <div className="ai-quick">{quick.map(item => <a key={item.href} href={item.href}>{item.label}</a>)}</div>
      {reply && <div className="ai-reply"><p>{reply.text}</p><a href={reply.href}>{reply.label} →</a></div>}
      <form onSubmit={submit}><label htmlFor="ai-guide-input">Nhập câu hỏi</label><input id="ai-guide-input" value={input} onChange={event => setInput(event.target.value)} placeholder="Ví dụ: Mình muốn tìm photographer"/><button aria-label="Gửi">→</button></form>
      <small>AI guide hỗ trợ định hướng; dữ liệu chỉ được lưu khi bạn xác nhận trong Workspace.</small>
    </div>}
    <button className="ai-concierge-trigger" onClick={() => setOpen(value => !value)} aria-expanded={open}><span>✦</span><b>{open ? "Đóng" : "Hỏi the two AI"}</b></button>
  </aside>;
}
