/* eslint-disable @next/next/no-html-link-for-pages */
import { HeroModeSwitch } from "./components/HeroModeSwitch";
import { PublicPage } from "./components/MarketplaceChrome";
import { VendorCard } from "./components/VendorCard";
import { serviceCategories } from "./data/discovery";
import { templates, vendors } from "./data/marketplace";

const featured = ["the-planners", "lumiere-studio", "moc-concept", "lotus-garden-venue"].map(slug => vendors.find(vendor => vendor.slug === slug)!).filter(Boolean);
const cities = new Set(vendors.flatMap(vendor => vendor.location.split("·").map(part => part.trim())).filter(place => place !== "Toàn quốc"));

export default function Home() {
  return <PublicPage className="market-home" showQuickSearch>
    <section className="market-hero">
      <div className="market-shell hero-market-grid">
        <div className="hero-copy-new">
          <span className="script-tagline">Wedding marketplace, made clear</span>
          <h1>Mọi thứ cho đám cưới.<br/><em>Ở đúng một nơi.</em></h1>
          <p>Tìm vendor, so sánh báo giá, dùng công cụ planning và quản lý toàn bộ hành trình cưới — rõ ràng cho cặp đôi, hiệu quả cho vendor.</p>
          <HeroModeSwitch/>
        </div>
        <div className="hero-market-card">
          <div className="hero-card-head"><span>MARKETPLACE HÔM NAY</span><b>Giai đoạn đầu</b></div>
          <div className="hero-stat-grid"><div><b>{vendors.length}</b><span>Vendor đã xét duyệt</span></div><div><b>{serviceCategories.length}</b><span>Nhóm dịch vụ</span></div><div><b>{cities.size}</b><span>Thành phố + vendor toàn quốc</span></div><div><b>{templates.length}</b><span>Công cụ planning</span></div></div>
          <div className="hero-flow"><span>Khám phá</span><i>→</i><span>Shortlist</span><i>→</i><span>Gửi brief</span><i>→</i><span>Báo giá</span></div>
          <div className="hero-promise"><strong>Chất lượng hơn số lượng.</strong><p>Mỗi vendor được xét duyệt trước khi lên sàn. Danh sách sẽ tăng dần theo từng khu vực.</p></div>
        </div>
      </div>
    </section>

    <section className="category-section market-shell">
      <div className="market-section-head"><div><span>KHÁM PHÁ THEO NHU CẦU</span><h2>Đã biết mình cần gì?</h2></div><a href="/vendors">Xem tất cả category →</a></div>
      <div className="category-grid">{serviceCategories.map(categoryItem => <a key={categoryItem.name} href={`/vendors?category=${encodeURIComponent(categoryItem.name)}`}><i>{categoryItem.icon}</i><strong>{categoryItem.name}</strong><small>{categoryItem.short}</small><span>→</span></a>)}</div>
    </section>

    <section className="marketplace-section" id="marketplace"><div className="market-shell">
      <div className="market-section-head"><div><span>VENDOR ĐÃ XÁC MINH</span><h2>Gợi ý nổi bật cho hai bạn</h2><p>Thông tin từ hồ sơ đã duyệt. Bấm ♡ để lưu vào shortlist và so sánh sau.</p></div><a href="/shortlist">Xem shortlist →</a></div>
      <div className="market-vendor-grid">{featured.map(vendor => <VendorCard key={vendor.slug} vendor={vendor} cta="Xem chi tiết →"/>)}</div>
      <div className="market-center"><a className="outline-market-btn" href="/vendors">Xem tất cả {vendors.length} vendor →</a></div>
    </div></section>

    <section className="tools-market" id="tools"><div className="market-shell">
      <div className="market-section-head"><div><span>DIGITAL WEDDING TOOLS</span><h2>Công cụ giúp bạn tự tin ra quyết định</h2></div><a href="/templates">Xem tất cả {templates.length} công cụ →</a></div>
      <div className="market-product-grid">{templates.slice(0, 4).map((p,i) => <article key={p.name}><a href={`/templates/${p.slug}`} className={`product-cover-new ${p.tone}`}><span>THE TWO · TOOL {String(i+1).padStart(2,"0")}</span><h3>{p.name}</h3><div className="product-sheet"><i/><i/><i/><i/></div></a><div className="product-new-body"><div><h3>{p.name}</h3><p>{p.meta}</p></div><strong>{p.price}</strong></div><a className="product-detail-link" href={`/templates/${p.slug}`}>Xem chi tiết →</a></article>)}</div>
    </div></section>

    <section className="planner-strip" id="planner"><div className="market-shell planner-grid"><div><span>THE TWO PLANNER</span><h2>Trả lời 3 bước ngắn.<br/>Nhận lại thứ tự việc cần làm.</h2><p>Chia sẻ địa điểm, thời gian, số khách và ngân sách — the two sắp xếp category cần tra cứu theo đúng thứ tự phụ thuộc, bắt đầu từ địa điểm.</p><a className="primary-market-btn orange" href="/planning">Tạo Wedding Brief →</a></div><div className="planner-input-demo"><small>HÃY CHIA SẺ Ý TƯỞNG CƯỚI</small><p>“Đám cưới ở Hà Nội, tháng 12/2027, khoảng 250 khách, ngân sách 400 triệu…”</p><div><span>the two sẽ dùng: <b>địa điểm · thời gian · số khách · ngân sách</b></span><i>✦</i></div></div></div></section>

    <section className="two-sided" id="vendor-onboard"><div className="market-shell"><div className="two-side-head"><span>ONE MARKETPLACE · TWO SIDES</span><h2>Hai hành trình riêng, kết nối ở đúng thời điểm.</h2></div><div className="side-grid"><article className="buyer-side"><small>DÀNH CHO CẶP ĐÔI</small><h3>3 bước → Workspace →<br/>vendor → booking.</h3><ul><li><b>01</b> Chia sẻ thông tin cưới ban đầu</li><li><b>02</b> Nhận Workspace: checklist, ngân sách, vendor</li><li><b>03</b> Gửi brief và theo dõi từng báo giá</li></ul><a href="/planning">Bắt đầu luồng Couple →</a></article><article className="vendor-side"><small>DÀNH CHO VENDOR</small><h3>Hồ sơ → xét duyệt →<br/>listing → brief.</h3><ul><li><b>01</b> Gửi hồ sơ doanh nghiệp để xét duyệt</li><li><b>02</b> the two xét duyệt & hoàn thiện listing</li><li><b>03</b> Nhận brief có cấu trúc, kèm mã tham chiếu</li></ul><a href="/vendor-apply">Gửi hồ sơ vendor →</a></article></div></div></section>

    <section className="trust-market" id="help"><div className="market-shell"><div><b>✓</b><span><strong>Vendor được xét duyệt</strong><small>Hồ sơ chờ xác minh trước khi nhận inquiry.</small></span></div><div><b>◎</b><span><strong>Thanh toán có kiểm chứng</strong><small>Chỉ ghi nhận khi cổng thanh toán xác nhận.</small></span></div><div><b>↔</b><span><strong>Trạng thái minh bạch</strong><small>Inquiry không bị nhầm với booking.</small></span></div><div><b>□</b><span><strong>Dữ liệu thuộc về bạn</strong><small>Workspace riêng và phân quyền rõ ràng.</small></span></div></div></section>
  </PublicPage>;
}
