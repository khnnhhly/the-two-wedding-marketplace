"use client";

import { FormEvent, useState } from "react";
import { normalize } from "../lib/search";

const quick = [
  { label: "Tìm đúng flow cho mình", href: "/planning" },
  { label: "Tra cứu theo category", href: "/vendors" },
  { label: "Xem template", href: "/templates" },
  { label: "Dành cho vendor", href: "/for-vendors" },
];

type Reply = { text: string; href: string; label: string };

// Keyword routing on accent-free text, so "chup anh" and "chụp ảnh" behave the same.
const categoryRules: [string[], string][] = [
  [["venue", "dia diem", "nha hang", "san tiec"], "Địa điểm"],
  [["photo", "chup", "nhiep anh", "anh cuoi", "quay phim", "film"], "Photo & Film"],
  [["trang tri", "decor", "hoa cuoi", "hoa tuoi"], "Trang trí"],
  [["vay", "trang phuc", "ao dai", "vest"], "Trang phục"],
  [["makeup", "trang diem"], "Makeup"],
  [["thiep", "qua cam on", "qua cuoi"], "Thiệp & Quà"],
  [["band", "nhac", "giai tri", "mc", "dj"], "Giải trí"],
  [["planner", "dieu phoi", "to chuc"], "Wedding Planner"],
];

function answerFor(input: string): Reply {
  const value = normalize(input);
  const has = (...terms: string[]) => terms.some(term => value.includes(term));
  if (has("ngan sach", "chi phi", "bao nhieu tien", "budget", "chia tien", "phan bo")) return { text: "Budget Planner gợi ý cách phân bổ theo nhóm chi phí và tách rõ dự kiến với đã thanh toán. Nếu cần chuyên gia rà soát con số, hãy xem Planning clinic.", href: "/templates/budget-planner", label: "Mở Budget Planner" };
  if (has("ban hang", "gian hang", "dang ky vendor", "mo shop", "tro thanh vendor")) return { text: "Vendor gửi hồ sơ không cần tài khoản; the two xét duyệt rồi liên hệ hoàn thiện listing.", href: "/vendor-apply", label: "Gửi hồ sơ vendor" };
  if (has("phi", "gia goi", "cpc", "hoa hong", "commission")) return { text: "Bảng phí giải thích CPC, phí lead, hoa hồng booking và các gói subscription — kèm nguyên tắc không thu hai lần.", href: "/policies/fees", label: "Xem bảng phí" };
  const category = categoryRules.find(([terms]) => has(...terms))?.[1];
  if (category) return { text: `Category phù hợp là ${category}. Bạn có thể lọc thêm theo khu vực và mức giá, rồi lưu vendor vào shortlist để so sánh.`, href: `/vendors?category=${encodeURIComponent(category)}`, label: `Xem ${category}` };
  if (has("template", "checklist", "timeline", "rundown")) return { text: "Template có trang giải thích riêng và có thể thêm thẳng vào Wedding Workspace.", href: "/templates", label: "Xem template" };
  if (has("so sanh", "shortlist", "da luu")) return { text: "Shortlist so sánh giá, gói, khu vực và thông tin xác minh trên cùng một bảng.", href: "/shortlist", label: "Mở shortlist" };
  return { text: "Mình chưa chắc bạn cần gì. Bộ 3 bước ngắn sẽ khai thác thông tin cưới rồi xếp thứ tự category nên tra cứu. Nếu muốn người thật hỗ trợ, hãy gửi brief.", href: "/planning", label: "Bắt đầu 3 bước" };
}

export function AiConcierge() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [thread, setThread] = useState<{ question: string; reply: Reply }[]>([]);
  function submit(event: FormEvent) {
    event.preventDefault();
    if (!input.trim()) return;
    setThread(current => [...current.slice(-3), { question: input.trim(), reply: answerFor(input) }]);
    setInput("");
  }
  return <aside className={`ai-concierge${open ? " open" : ""}`} aria-label="Trợ lý điều hướng the two">
    {open && <div className="ai-concierge-panel">
      <header><span>✦</span><div><strong>Trợ lý the two</strong><small>Điều hướng nhanh</small></div><button onClick={() => setOpen(false)} aria-label="Đóng trợ lý">×</button></header>
      <div className="ai-thread" aria-live="polite">
        <div className="ai-message"><b>Chào bạn, mình giúp gì được?</b><p>Hỏi về vendor, ngân sách, template hoặc mở gian hàng — mình sẽ đưa bạn tới đúng trang.</p></div>
        {thread.length === 0 && <div className="ai-quick">{quick.map(item => <a key={item.href} href={item.href}>{item.label}</a>)}</div>}
        {thread.map((item, index) => <div key={index}><p className="ai-question">{item.question}</p><div className="ai-reply"><p>{item.reply.text}</p><a href={item.reply.href}>{item.reply.label} →</a></div></div>)}
      </div>
      <form onSubmit={submit}><label htmlFor="ai-guide-input">Nhập câu hỏi</label><input id="ai-guide-input" value={input} onChange={event => setInput(event.target.value)} placeholder="Ví dụ: tìm chỗ chụp ảnh ở Hà Nội"/><button aria-label="Gửi">→</button></form>
      <small>Trợ lý gợi ý điều hướng theo từ khóa, không thay thế tư vấn của planner.</small>
    </div>}
    <button className="ai-concierge-trigger" onClick={() => setOpen(value => !value)} aria-expanded={open}><span>✦</span><b>{open ? "Đóng" : "Cần trợ giúp?"}</b></button>
  </aside>;
}
