"use client";

/* eslint-disable @next/next/no-img-element, @next/next/no-html-link-for-pages */

import { FormEvent, useMemo, useState } from "react";
import { AiConcierge } from "./components/AiConcierge";
import { serviceCategories } from "./data/discovery";

const vendors = [
  { slug: "the-planners", name: "The Planners", category: "Wedding Planner", location: "Hà Nội · TP.HCM", price: null, tag: "Tư vấn trước", color: "royal", description: "Lập kế hoạch và điều phối đám cưới trọn gói." },
  { slug: "lumiere-studio", name: "Lumière Studio", category: "Photo & Film", location: "Hà Nội", price: 18000000, tag: "Yêu cầu báo giá", color: "cobalt", description: "Phóng sự cưới tự nhiên, giàu cảm xúc." },
  { slug: "moc-concept", name: "Mộc Concept", category: "Trang trí", location: "TP. Hồ Chí Minh", price: 35000000, tag: "Yêu cầu báo giá", color: "apricot", description: "Concept tinh giản, chất liệu và giàu dấu ấn cá nhân." },
  { slug: "maison-de-blanc", name: "Maison de Blanc", category: "Trang phục", location: "Toàn quốc", price: 12000000, tag: "Đặt lịch thử", color: "ivory", description: "Bridal studio với phom dáng hiện đại và thanh lịch." },
];

const products = [
  { slug: "wedding-master-planner", name: "Wedding Master Planner", meta: "Timeline · checklist", price: "Trong Workspace", tone: "p-blue" },
  { slug: "budget-planner", name: "Budget Planner", meta: "Ngân sách · phân bổ", price: "Trong Workspace", tone: "p-orange" },
  { slug: "wedding-day-rundown", name: "Wedding Day Rundown", meta: "D-7 · vận hành", price: "Trong Workspace", tone: "p-obsidian" },
  { slug: "vendor-comparison-kit", name: "Vendor Comparison Kit", meta: "So sánh · quyết định", price: "Trong Workspace", tone: "p-ivory" },
];

const formatMoney = (value: number | null) => value == null ? "Liên hệ báo giá" : `Từ ${new Intl.NumberFormat("vi-VN").format(value)}₫`;

function Brand({ light = false }: { light?: boolean }) {
  return <a className={`market-brand${light ? " light" : ""}`} href="#top" aria-label="the two — trang chủ"><span className="mark"><img src="/the-two-monogram.png" alt="" width="37" height="40" /></span><span className="wordmark">the two<small>wedding marketplace</small></span></a>;
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Tất cả");
  const [saved, setSaved] = useState<string[]>([]);
  const [toast, setToast] = useState("");
  const [mode, setMode] = useState<"buyer" | "vendor">("buyer");

  const filtered = useMemo(() => vendors.filter(v => {
    const matchesCategory = category === "Tất cả" || v.category.toLowerCase().includes(category.toLowerCase());
    const matchesSearch = !query.trim() || `${v.name} ${v.category} ${v.location}`.toLowerCase().includes(query.toLowerCase());
    return matchesCategory && matchesSearch;
  }), [query, category]);

  const notify = (text: string) => { setToast(text); setTimeout(() => setToast(""), 1900); };
  function search(e: FormEvent) { e.preventDefault(); window.location.href = `/vendors${query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ""}`; }
  function quickSearch(value: string) { window.location.href = `/vendors?q=${encodeURIComponent(value)}`; }
  function save(name: string) { setSaved(s => s.includes(name) ? s.filter(x => x !== name) : [...s, name]); notify(saved.includes(name) ? "Đã bỏ lưu vendor" : "Đã lưu vào shortlist"); }

  return <main className="market-home" id="top">
    {toast && <div className="market-toast" role="status">✓ {toast}</div>}
    <div className="utility-bar"><div className="market-shell"><div><a href="/vendor-center">Kênh vendor</a><span/> <a href="/for-vendors">Trở thành vendor</a><span/> <a href="/help">Hỗ trợ</a></div><div><a href="/vendor-center">Vendor Center</a><a href="/workspace">Workspace</a></div></div></div>
    <header className="market-nav market-shell">
      <Brand />
      <form className="market-search" onSubmit={search}><label htmlFor="market-search">Tìm dịch vụ cưới</label><input id="market-search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Tìm venue, photographer, váy cưới…"/><button aria-label="Tìm kiếm">⌕</button><div><button type="button" onClick={() => quickSearch("Địa điểm Hà Nội")}>Địa điểm Hà Nội</button><button type="button" onClick={() => quickSearch("Photo & Film")}>Photo & Film</button><button type="button" onClick={() => quickSearch("Trang trí")}>Trang trí</button></div></form>
      <a className="workspace-link" href="/workspace"><i>□</i><span>Workspace<small>Kế hoạch của bạn</small></span></a>
    </header>
    <nav className="category-nav"><div className="market-shell"><a href="/vendors">Khám phá vendor</a><a href="/templates">Template & công cụ</a><a href="/planning">AI Wedding Planner</a><a href="/services/planning">Dịch vụ planning</a><a href="/guidebook">Cẩm nang</a><a href="/for-vendors" className="vendor-nav-link">Bán hàng trên the two →</a></div></nav>

    <section className="market-hero">
      <div className="market-shell hero-market-grid">
        <div className="hero-copy-new">
          <span className="market-kicker">WEDDING MARKETPLACE FOR VIETNAM</span>
          <h1>Mọi thứ cho đám cưới.<br/><em>Ở đúng một nơi.</em></h1>
          <p>Tìm vendor, so sánh báo giá, mua công cụ và quản lý toàn bộ hành trình cưới — rõ ràng cho cặp đôi, hiệu quả cho vendor.</p>
          <div className="mode-switch"><button className={mode === "buyer" ? "active" : ""} onClick={() => setMode("buyer")}>Tôi đang chuẩn bị cưới</button><button className={mode === "vendor" ? "active" : ""} onClick={() => setMode("vendor")}>Tôi là vendor</button></div>
          {mode === "buyer" ? <div className="hero-action-row"><a className="primary-market-btn" href="/planning">Bắt đầu với 5 câu hỏi →</a><a className="secondary-market-btn" href="/vendors">Đã biết mình cần gì? Tra cứu theo category</a></div> : <div className="hero-action-row"><a className="primary-market-btn orange" href="/vendor-onboarding">Mở gian hàng</a><a className="secondary-market-btn" href="/for-vendors">Xem cách hoạt động →</a></div>}
        </div>
        <div className="hero-market-card">
          <div className="hero-card-head"><span>MARKETPLACE SNAPSHOT</span><b>Live</b></div>
          <div className="hero-stat-grid"><div><b>120+</b><span>Vendor tuyển chọn</span></div><div><b>18</b><span>Nhóm dịch vụ</span></div><div><b>1</b><span>Workspace chung</span></div><div><b>0</b><span>Review giả</span></div></div>
          <div className="hero-flow"><span>Khám phá</span><i>→</i><span>Yêu cầu báo giá</span><i>→</i><span>So sánh</span><i>→</i><span>Booking</span></div>
          <div className="hero-promise"><strong>Không ép booking. Không giá ảo.</strong><p>Availability, báo giá và thanh toán luôn có trạng thái rõ ràng.</p></div>
        </div>
      </div>
    </section>

    <section className="category-section market-shell">
      <div className="market-section-head"><div><span>KHÁM PHÁ THEO NHU CẦU</span><h2>Đã biết mình cần gì?</h2></div><a href="/vendors">Xem tất cả category →</a></div>
      <div className="category-grid">{serviceCategories.map(categoryItem => <a key={categoryItem.name} href={`/vendors?category=${encodeURIComponent(categoryItem.name)}`}><i>{categoryItem.icon}</i><strong>{categoryItem.name}</strong><small>{categoryItem.short}</small><span>→</span></a>)}</div>
    </section>

    <section className="marketplace-section" id="marketplace"><div className="market-shell">
      <div className="market-section-head"><div><span>VENDOR ĐÃ XÁC MINH</span><h2>Gợi ý nổi bật cho hai bạn</h2><p>Thông tin từ hồ sơ thật. Không hiển thị rating hay availability chưa được xác minh.</p></div><div className="filter-pills"><button className={category === "Tất cả" ? "active" : ""} onClick={() => setCategory("Tất cả")}>Tất cả</button><button className={category === "Photo & Film" ? "active" : ""} onClick={() => setCategory("Photo & Film")}>Photo & Film</button><button className={category === "Trang trí" ? "active" : ""} onClick={() => setCategory("Trang trí")}>Trang trí</button></div></div>
      {filtered.length ? <div className="market-vendor-grid">{filtered.map(v => <article className="market-vendor-card" key={v.name}><div className={`market-vendor-image ${v.color}`}><span>✓ ĐÃ XÁC MINH</span><button onClick={() => save(v.name)} aria-label={`Lưu ${v.name}`}>{saved.includes(v.name) ? "♥" : "♡"}</button><b>{v.name.slice(0,1)}</b><div className="vendor-pattern"/></div><div className="market-vendor-body"><small>{v.category.toUpperCase()}</small><h3>{v.name}</h3><p>{v.description}</p><div className="vendor-meta"><span>⌖ {v.location}</span><em>{v.tag}</em></div><div className="vendor-card-bottom"><strong>{formatMoney(v.price)}</strong><a href={`/vendors/${v.slug}`}>Xem chi tiết →</a></div></div></article>)}</div> : <div className="market-empty"><b>⌕</b><h3>Chưa tìm thấy vendor phù hợp</h3><p>Thử một từ khóa hoặc danh mục khác.</p><button onClick={() => { setQuery(""); setCategory("Tất cả"); }}>Xóa bộ lọc</button></div>}
      <div className="market-center"><a className="outline-market-btn" href="/vendors">Xem tất cả vendor →</a></div>
    </div></section>

    <section className="tools-market" id="tools"><div className="market-shell">
      <div className="market-section-head"><div><span>DIGITAL WEDDING TOOLS</span><h2>Công cụ giúp bạn tự tin ra quyết định</h2></div><a href="/templates">Xem tất cả công cụ →</a></div>
      <div className="market-product-grid">{products.map((p,i) => <article key={p.name}><a href={`/templates/${p.slug}`} className={`product-cover-new ${p.tone}`}><span>THE TWO · TOOL {String(i+1).padStart(2,"0")}</span><h3>{p.name}</h3><div className="product-sheet"><i/><i/><i/><i/></div></a><div className="product-new-body"><div><h3>{p.name}</h3><p>{p.meta}</p></div><strong>{p.price}</strong></div><a className="product-detail-link" href={`/templates/${p.slug}`}>Xem chi tiết →</a></article>)}</div>
    </div></section>

    <section className="planner-strip" id="planner"><div className="market-shell planner-grid"><div><span>THE TWO AI PLANNER</span><h2>Bắt đầu bằng một câu.<br/>Nhận lại một kế hoạch rõ ràng.</h2><p>AI giúp cấu trúc ngân sách, checklist và timeline. Mọi thay đổi đều chờ bạn xác nhận trước khi lưu.</p><a className="primary-market-btn orange" href="/planning">Tạo Wedding Brief →</a></div><div className="planner-input-demo"><small>HÃY CHIA SẺ Ý TƯỞNG CƯỚI</small><p>“Đám cưới ở Hà Nội, tháng 12/2027, khoảng 250 khách, ngân sách 400 triệu…”</p><div><span>AI đang đọc: <b>địa điểm · thời gian · số khách · ngân sách</b></span><i>✦</i></div></div></div></section>

    <section className="two-sided" id="vendor-onboard"><div className="market-shell"><div className="two-side-head"><span>ONE MARKETPLACE · TWO SIDES</span><h2>Hai hành trình riêng, kết nối ở đúng thời điểm.</h2></div><div className="side-grid"><article className="buyer-side"><small>DÀNH CHO CẶP ĐÔI</small><h3>Brief → planning →<br/>vendor → booking.</h3><ul><li><b>01</b> Chia sẻ thông tin cưới ban đầu</li><li><b>02</b> Duyệt kế hoạch và tìm vendor</li><li><b>03</b> Theo dõi inquiry, booking và thanh toán</li></ul><a href="/planning">Bắt đầu luồng Couple →</a></article><article className="vendor-side"><small>DÀNH CHO VENDOR</small><h3>Onboarding → listing →<br/>inquiry → booking.</h3><ul><li><b>01</b> Gửi hồ sơ doanh nghiệp để xét duyệt</li><li><b>02</b> Hoàn thiện dịch vụ trong Vendor Center</li><li><b>03</b> Nhận brief và quản lý pipeline</li></ul><a href="/for-vendors">Xem luồng Vendor →</a></article></div></div></section>

    <section className="trust-market" id="help"><div className="market-shell"><div><b>✓</b><span><strong>Vendor được xét duyệt</strong><small>Hồ sơ chờ xác minh trước khi nhận inquiry.</small></span></div><div><b>◎</b><span><strong>Thanh toán có kiểm chứng</strong><small>Không xác nhận chỉ từ redirect hay ảnh biên lai.</small></span></div><div><b>↔</b><span><strong>Trạng thái minh bạch</strong><small>Inquiry không bị nhầm với booking.</small></span></div><div><b>□</b><span><strong>Dữ liệu thuộc về bạn</strong><small>Workspace riêng và phân quyền rõ ràng.</small></span></div></div></section>

    <footer className="market-footer"><div className="market-shell footer-main"><div><Brand light/><p>Wedding marketplace và planning workspace dành cho thị trường Việt Nam.</p><span>hello@thetwo.vn · Vietnam</span></div><div><strong>Marketplace</strong><a href="/vendors">Khám phá vendor</a><a href="/templates">Template & công cụ</a><a href="/planning">AI Wedding Planner</a><a href="/services/planning">Dịch vụ planning</a></div><div><strong>Dành cho vendor</strong><a href="/vendor-onboarding">Mở gian hàng</a><a href="/vendor-center">Vendor Center</a><a href="/policies/payments">Phí & chính sách</a><a href="/help">Trung tâm hỗ trợ</a></div><div><strong>Về the two</strong><a href="/about">Giới thiệu</a><a href="/legal/terms">Điều khoản</a><a href="/legal/privacy">Bảo mật</a><a href="/policies/payments">Thanh toán & hoàn tiền</a></div></div><div className="market-shell footer-bottom-new"><span>© 2026 the two. Wedding marketplace, made clear.</span><div><span>Instagram</span><span>Facebook</span><span>Pinterest</span></div></div></footer>
    <AiConcierge />
  </main>;
}
