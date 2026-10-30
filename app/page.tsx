"use client";

/* eslint-disable @next/next/no-img-element */

import { FormEvent, useMemo, useState } from "react";

const categories = [
  ["Địa điểm", "Venue", "⌂"], ["Trang trí", "Decor", "✦"], ["Photo & Film", "Studio", "◉"],
  ["Wedding Planner", "Planner", "◎"], ["Trang phục", "Attire", "◇"], ["Makeup", "Beauty", "✧"],
  ["Thiệp & Quà", "Stationery", "□"], ["Giải trí", "Entertainment", "♫"],
];

const vendors = [
  { name: "The Planners", category: "Wedding Planner", location: "Hà Nội · TP.HCM", price: null, tag: "Tư vấn trước", color: "royal", description: "Lập kế hoạch và điều phối đám cưới trọn gói." },
  { name: "Lumière Studio", category: "Photo & Film", location: "Hà Nội", price: 18000000, tag: "Yêu cầu báo giá", color: "cobalt", description: "Phóng sự cưới tự nhiên, giàu cảm xúc." },
  { name: "Mộc Concept", category: "Trang trí", location: "TP. Hồ Chí Minh", price: 35000000, tag: "Yêu cầu báo giá", color: "apricot", description: "Concept tinh giản, chất liệu và giàu dấu ấn cá nhân." },
  { name: "Maison de Blanc", category: "Trang phục", location: "Toàn quốc", price: 12000000, tag: "Đặt lịch thử", color: "ivory", description: "Bridal studio với phom dáng hiện đại và thanh lịch." },
];

const products = [
  { name: "Wedding Master Planner", meta: "Notion · 12 trang", price: "490.000₫", tone: "p-blue" },
  { name: "Budget Planner", meta: "Google Sheets · 8 bảng", price: "290.000₫", tone: "p-orange" },
  { name: "Wedding Day Rundown", meta: "Notion + PDF", price: "190.000₫", tone: "p-obsidian" },
  { name: "Vendor Comparison Kit", meta: "Google Sheets", price: "240.000₫", tone: "p-ivory" },
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
  function search(e: FormEvent) { e.preventDefault(); document.getElementById("marketplace")?.scrollIntoView({ behavior: "smooth" }); }
  function save(name: string) { setSaved(s => s.includes(name) ? s.filter(x => x !== name) : [...s, name]); notify(saved.includes(name) ? "Đã bỏ lưu vendor" : "Đã lưu vào shortlist"); }

  return <main className="market-home" id="top">
    {toast && <div className="market-toast" role="status">✓ {toast}</div>}
    <div className="utility-bar"><div className="market-shell"><div><a href="/workspace">Kênh vendor</a><span/> <a href="#vendor-onboard">Trở thành vendor</a><span/> <a href="#help">Hỗ trợ</a></div><div><a href="/workspace">Thông báo</a><a href="/workspace">Đăng nhập</a></div></div></div>
    <header className="market-nav market-shell">
      <Brand />
      <form className="market-search" onSubmit={search}><label htmlFor="market-search">Tìm dịch vụ cưới</label><input id="market-search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Tìm venue, photographer, váy cưới…"/><button aria-label="Tìm kiếm">⌕</button><div><button type="button" onClick={() => setQuery("Venue Hà Nội")}>Venue Hà Nội</button><button type="button" onClick={() => setQuery("Photo & Film")}>Photo & Film</button><button type="button" onClick={() => setQuery("Trang trí")}>Trang trí</button></div></form>
      <a className="workspace-link" href="/workspace"><i>□</i><span>Workspace<small>Kế hoạch của bạn</small></span></a>
    </header>
    <nav className="category-nav"><div className="market-shell"><a href="#marketplace">Khám phá vendor</a><a href="#tools">Template & công cụ</a><a href="#planner">AI Wedding Planner</a><a href="#services">Dịch vụ planning</a><a href="#learn">Cẩm nang</a><a href="#vendor-onboard" className="vendor-nav-link">Bán hàng trên the two →</a></div></nav>

    <section className="market-hero">
      <div className="market-shell hero-market-grid">
        <div className="hero-copy-new">
          <span className="market-kicker">WEDDING MARKETPLACE FOR VIETNAM</span>
          <h1>Mọi thứ cho đám cưới.<br/><em>Ở đúng một nơi.</em></h1>
          <p>Tìm vendor, so sánh báo giá, mua công cụ và quản lý toàn bộ hành trình cưới — rõ ràng cho cặp đôi, hiệu quả cho vendor.</p>
          <div className="mode-switch"><button className={mode === "buyer" ? "active" : ""} onClick={() => setMode("buyer")}>Tôi đang chuẩn bị cưới</button><button className={mode === "vendor" ? "active" : ""} onClick={() => setMode("vendor")}>Tôi là vendor</button></div>
          {mode === "buyer" ? <div className="hero-action-row"><a className="primary-market-btn" href="#marketplace">Khám phá marketplace</a><a className="secondary-market-btn" href="/workspace">Lên kế hoạch với AI →</a></div> : <div className="hero-action-row"><a className="primary-market-btn orange" href="/workspace">Mở gian hàng miễn phí</a><a className="secondary-market-btn" href="#vendor-onboard">Xem cách hoạt động →</a></div>}
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
      <div className="market-section-head"><div><span>KHÁM PHÁ THEO NHU CẦU</span><h2>Hôm nay bạn đang tìm gì?</h2></div><button onClick={() => { setCategory("Tất cả"); document.getElementById("marketplace")?.scrollIntoView({behavior:"smooth"}); }}>Xem tất cả 18 danh mục →</button></div>
      <div className="category-grid">{categories.map(([name,en,icon]) => <button key={name} onClick={() => { setCategory(name === "Địa điểm" ? "Venue" : name); document.getElementById("marketplace")?.scrollIntoView({behavior:"smooth"}); }}><i>{icon}</i><strong>{name}</strong><small>{en}</small><span>→</span></button>)}</div>
    </section>

    <section className="marketplace-section" id="marketplace"><div className="market-shell">
      <div className="market-section-head"><div><span>VENDOR ĐÃ XÁC MINH</span><h2>Gợi ý nổi bật cho hai bạn</h2><p>Thông tin từ hồ sơ thật. Không hiển thị rating hay availability chưa được xác minh.</p></div><div className="filter-pills"><button className={category === "Tất cả" ? "active" : ""} onClick={() => setCategory("Tất cả")}>Tất cả</button><button className={category === "Photo & Film" ? "active" : ""} onClick={() => setCategory("Photo & Film")}>Photo & Film</button><button className={category === "Trang trí" ? "active" : ""} onClick={() => setCategory("Trang trí")}>Trang trí</button></div></div>
      {filtered.length ? <div className="market-vendor-grid">{filtered.map(v => <article className="market-vendor-card" key={v.name}><div className={`market-vendor-image ${v.color}`}><span>✓ ĐÃ XÁC MINH</span><button onClick={() => save(v.name)} aria-label={`Lưu ${v.name}`}>{saved.includes(v.name) ? "♥" : "♡"}</button><b>{v.name.slice(0,1)}</b><div className="vendor-pattern"/></div><div className="market-vendor-body"><small>{v.category.toUpperCase()}</small><h3>{v.name}</h3><p>{v.description}</p><div className="vendor-meta"><span>⌖ {v.location}</span><em>{v.tag}</em></div><div className="vendor-card-bottom"><strong>{formatMoney(v.price)}</strong><a href="/workspace">Xem chi tiết →</a></div></div></article>)}</div> : <div className="market-empty"><b>⌕</b><h3>Chưa tìm thấy vendor phù hợp</h3><p>Thử một từ khóa hoặc danh mục khác.</p><button onClick={() => { setQuery(""); setCategory("Tất cả"); }}>Xóa bộ lọc</button></div>}
      <div className="market-center"><a className="outline-market-btn" href="/workspace">Xem tất cả vendor →</a></div>
    </div></section>

    <section className="tools-market" id="tools"><div className="market-shell">
      <div className="market-section-head"><div><span>DIGITAL WEDDING TOOLS</span><h2>Công cụ giúp bạn tự tin ra quyết định</h2></div><a href="/workspace">Xem tất cả công cụ →</a></div>
      <div className="market-product-grid">{products.map((p,i) => <article key={p.name}><div className={`product-cover-new ${p.tone}`}><span>THE TWO · TOOL {String(i+1).padStart(2,"0")}</span><h3>{p.name}</h3><div className="product-sheet"><i/><i/><i/><i/></div></div><div className="product-new-body"><div><h3>{p.name}</h3><p>{p.meta}</p></div><strong>{p.price}</strong></div><button onClick={() => notify("Đã thêm vào giỏ công cụ")}>Thêm vào giỏ</button></article>)}</div>
    </div></section>

    <section className="planner-strip" id="planner"><div className="market-shell planner-grid"><div><span>THE TWO AI PLANNER</span><h2>Bắt đầu bằng một câu.<br/>Nhận lại một kế hoạch rõ ràng.</h2><p>AI giúp cấu trúc ngân sách, checklist và timeline. Mọi thay đổi đều chờ bạn xác nhận trước khi lưu.</p><a className="primary-market-btn orange" href="/workspace">Tạo Wedding Workspace →</a></div><div className="planner-input-demo"><small>HÃY CHIA SẺ Ý TƯỞNG CƯỚI</small><p>“Đám cưới ở Hà Nội, tháng 12/2027, khoảng 250 khách, ngân sách 400 triệu…”</p><div><span>AI đang đọc: <b>địa điểm · thời gian · số khách · ngân sách</b></span><i>✦</i></div></div></div></section>

    <section className="two-sided" id="vendor-onboard"><div className="market-shell"><div className="two-side-head"><span>ONE MARKETPLACE · TWO SIDES</span><h2>Được thiết kế cho cả người mua và người bán.</h2></div><div className="side-grid"><article className="buyer-side"><small>DÀNH CHO CẶP ĐÔI</small><h3>Tìm đúng vendor.<br/>Quản lý đúng cách.</h3><ul><li><b>01</b> Khám phá vendor theo ngân sách và địa điểm</li><li><b>02</b> Gửi brief, nhận và so sánh báo giá</li><li><b>03</b> Theo dõi booking, hợp đồng và thanh toán</li></ul><a href="/workspace">Bắt đầu lên kế hoạch →</a></article><article className="vendor-side"><small>DÀNH CHO VENDOR</small><h3>Một gian hàng chuyên nghiệp.<br/>Nhiều cơ hội phù hợp hơn.</h3><ul><li><b>01</b> Tạo hồ sơ và danh mục dịch vụ</li><li><b>02</b> Quản lý inquiry và báo giá tập trung</li><li><b>03</b> Theo dõi booking, doanh thu và commission</li></ul><a href="/workspace">Đăng ký trở thành vendor →</a></article></div></div></section>

    <section className="trust-market" id="help"><div className="market-shell"><div><b>✓</b><span><strong>Vendor được xét duyệt</strong><small>Hồ sơ chờ xác minh trước khi nhận inquiry.</small></span></div><div><b>◎</b><span><strong>Thanh toán có kiểm chứng</strong><small>Không xác nhận chỉ từ redirect hay ảnh biên lai.</small></span></div><div><b>↔</b><span><strong>Trạng thái minh bạch</strong><small>Inquiry không bị nhầm với booking.</small></span></div><div><b>□</b><span><strong>Dữ liệu thuộc về bạn</strong><small>Workspace riêng và phân quyền rõ ràng.</small></span></div></div></section>

    <footer className="market-footer"><div className="market-shell footer-main"><div><Brand light/><p>Wedding marketplace và planning workspace dành cho thị trường Việt Nam.</p><span>hello@thetwo.vn · Vietnam</span></div><div><strong>Marketplace</strong><a href="#marketplace">Khám phá vendor</a><a href="#tools">Template & công cụ</a><a href="#planner">AI Wedding Planner</a><a href="#services">Dịch vụ planning</a></div><div><strong>Dành cho vendor</strong><a href="#vendor-onboard">Mở gian hàng</a><a href="/workspace">Vendor Center</a><a href="#help">Phí & chính sách</a><a href="#help">Trung tâm hỗ trợ</a></div><div><strong>Về the two</strong><a href="#top">Giới thiệu</a><a href="#help">Điều khoản</a><a href="#help">Bảo mật</a><a href="#help">Thanh toán & hoàn tiền</a></div></div><div className="market-shell footer-bottom-new"><span>© 2026 the two. Wedding marketplace, made clear.</span><div><span>Instagram</span><span>Facebook</span><span>Pinterest</span></div></div></footer>
  </main>;
}
