"use client";

import { FormEvent, useMemo, useState } from "react";

const features = [
  { icon: "✦", title: "AI Wedding Planner", text: "Biến một ý tưởng thành ngân sách, checklist và timeline dành riêng cho hai bạn." },
  { icon: "□", title: "Bộ công cụ cưới", text: "Template tinh gọn giúp bạn quản lý mọi chi tiết mà không bị quá tải." },
  { icon: "⌖", title: "Vendor phù hợp", text: "Khám phá đối tác đã được tuyển chọn theo khu vực, phong cách và ngân sách." },
  { icon: "◇", title: "Chuyên gia đồng hành", text: "Tư vấn linh hoạt từ một buổi định hướng đến lập kế hoạch trọn gói." },
];

const templates = [
  { title: "Wedding Master Planner", type: "Notion · 12 trang", price: "490.000₫", tone: "sage", mark: "01" },
  { title: "Budget Planner", type: "Google Sheets · 8 bảng", price: "290.000₫", tone: "sand", mark: "02" },
  { title: "Wedding Day Rundown", type: "Notion + PDF", price: "190.000₫", tone: "rose", mark: "03" },
];

const vendors = [
  { name: "The Planners", category: "Wedding Planner", place: "Hà Nội · TP.HCM", price: "Liên hệ báo giá", image: "planner" },
  { name: "Lumière Studio", category: "Photo & Film", place: "Hà Nội", price: "Từ 18.000.000₫", image: "photo" },
  { name: "Mộc Concept", category: "Trang trí tiệc cưới", place: "TP. Hồ Chí Minh", price: "Từ 35.000.000₫", image: "decor" },
];

const steps = ["Chia sẻ ý tưởng cưới", "Nhận kế hoạch từ AI", "Chọn công cụ & vendor", "Quản lý đến ngày cưới"];

export default function Home() {
  const [idea, setIdea] = useState("");
  const [showPlan, setShowPlan] = useState(false);
  const [saved, setSaved] = useState<string[]>([]);
  const [toast, setToast] = useState("");

  const parsed = useMemo(() => {
    const text = idea.toLowerCase();
    return {
      place: text.includes("hà nội") ? "Hà Nội" : text.includes("sài gòn") || text.includes("hồ chí minh") ? "TP. Hồ Chí Minh" : "Chưa xác định",
      guests: idea.match(/(\d{2,4})\s*(khách|người)/i)?.[1] ?? "Chưa xác định",
      budget: idea.match(/(\d{2,4})\s*(triệu|tr)/i)?.[1] ? `${idea.match(/(\d{2,4})\s*(triệu|tr)/i)?.[1]} triệu` : "Chưa xác định",
      date: idea.match(/tháng\s*(\d{1,2})[\s/]*(?:năm\s*)?(20\d{2})/i)?.slice(1).join("/") ?? "Chưa xác định",
    };
  }, [idea]);

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!idea.trim()) return;
    setShowPlan(true);
    setTimeout(() => document.getElementById("snapshot")?.scrollIntoView({ behavior: "smooth" }), 50);
  }

  function save(name: string) {
    setSaved((s) => s.includes(name) ? s.filter((x) => x !== name) : [...s, name]);
    setToast(saved.includes(name) ? "Đã bỏ khỏi danh sách" : "Đã lưu vào shortlist");
    setTimeout(() => setToast(""), 1800);
  }

  return (
    <main>
      {toast && <div className="toast" role="status">✓ {toast}</div>}
      <nav className="nav shell" aria-label="Điều hướng chính">
        <a className="brand" href="#top" aria-label="Nắng - trang chủ"><span>N</span>NẮNG</a>
        <div className="navlinks"><a href="#tools">Công cụ</a><a href="#templates">Template</a><a href="#vendors">Vendor</a><a href="#services">Dịch vụ</a><a href="#journal">Cẩm nang</a></div>
        <div className="nav-actions"><a className="text-btn" href="/workspace">Workspace</a><a className="button small" href="/workspace">Lên kế hoạch</a></div>
      </nav>

      <section className="hero" id="top">
        <div className="hero-orb orb-one"/><div className="hero-orb orb-two"/>
        <div className="shell hero-inner">
          <div className="eyebrow"><span>✦</span> Trợ lý cưới AI dành cho bạn</div>
          <h1>Đám cưới trong mơ,<br/><em>kế hoạch trong tầm tay.</em></h1>
          <p className="hero-copy">Từ ý tưởng đầu tiên đến ngày trọng đại — lên kế hoạch cưới cùng AI, quản lý ngân sách, khám phá vendor và tìm mọi thứ bạn cần tại một nơi.</p>
          <form className="ai-box" onSubmit={submit} id="planner">
            <label htmlFor="wedding-idea">Hãy kể Nắng nghe về đám cưới bạn mong muốn</label>
            <textarea id="wedding-idea" value={idea} onChange={(e) => setIdea(e.target.value)} placeholder="Ví dụ: Mình muốn tổ chức đám cưới ở Hà Nội vào tháng 12/2027, khoảng 250 khách, ngân sách 400 triệu..." rows={3}/>
            <div className="ai-box-footer"><span><i/> Thông tin của bạn được bảo mật</span><button className="button" type="submit">Xem bản phác thảo <b>→</b></button></div>
          </form>
          <div className="trust-row"><div className="avatars"><i/><i/><i/></div><span><strong>2.000+ cặp đôi</strong> đang lên kế hoạch cùng Nắng</span><span className="divider"/><span>Không cần thẻ tín dụng</span></div>
        </div>
      </section>

      {showPlan && <section className="snapshot-section" id="snapshot">
        <div className="shell snapshot">
          <div className="snapshot-head"><div><span className="kicker">BẢN PHÁC THẢO TỪ AI</span><h2>Kế hoạch đầu tiên của hai bạn</h2></div><button className="close" onClick={() => setShowPlan(false)} aria-label="Đóng">×</button></div>
          <div className="snapshot-grid">
            <div className="profile-card"><span>Địa điểm</span><strong>{parsed.place}</strong><span>Thời gian</span><strong>{parsed.date}</strong><span>Số khách</span><strong>{parsed.guests}</strong><span>Ngân sách</span><strong>{parsed.budget}</strong></div>
            <div className="ai-response"><span className="ai-spark">✦</span><div><strong>Mình đã ghi nhận ý tưởng của bạn.</strong><p>Để kế hoạch chính xác hơn, hai bạn thích một buổi tiệc <b>trong nhà hay ngoài trời</b>, và đâu là 3 ưu tiên quan trọng nhất?</p><div className="chips"><button>Ngoài trời</button><button>Trong nhà</button><button>Chưa quyết định</button></div></div></div>
          </div>
          <div className="allocation"><div><span>Venue & ẩm thực</span><b>45%</b></div><div><span>Trang trí</span><b>15%</b></div><div><span>Hình ảnh</span><b>12%</b></div><div><span>Trang phục</span><b>8%</b></div><div><span>Dự phòng & khác</span><b>20%</b></div></div>
          <div style={{textAlign:"center",marginTop:22}}><a className="button" href="/workspace">Lưu & tiếp tục trong Workspace →</a></div>
        </div>
      </section>}

      <section className="steps-section"><div className="shell"><p className="section-label">HÀNH TRÌNH CỦA BẠN</p><h2 className="section-title">Bắt đầu nhẹ nhàng. Đi từng bước vững vàng.</h2><div className="steps">{steps.map((step, i) => <div className="step" key={step}><span>{String(i+1).padStart(2,"0")}</span><div className="step-icon">{["✎","✦","⌖","✓"][i]}</div><h3>{step}</h3><p>{["Nói với Nắng điều bạn hình dung — dù mới chỉ là vài ý tưởng.","Nhận ngân sách, checklist và timeline được cá nhân hóa.","Khám phá những lựa chọn phù hợp với tiêu chí của hai bạn.","Mọi đầu việc, khoản chi và lịch hẹn luôn trong tầm mắt."][i]}</p></div>)}</div></div></section>

      <section className="features-section" id="tools"><div className="shell"><div className="section-heading"><div><p className="section-label">TẤT CẢ TRONG MỘT NƠI</p><h2 className="section-title left">Một hành trình cưới, một không gian chung.</h2></div><p>Tập trung vào niềm vui. Nắng giúp bạn giữ mọi thứ gọn gàng và rõ ràng.</p></div><div className="feature-grid">{features.map((f,i)=><article className={`feature feature-${i}`} key={f.title}><div className="feature-icon">{f.icon}</div><h3>{f.title}</h3><p>{f.text}</p><button onClick={()=>{setToast("Tính năng sẽ mở trong bản kế hoạch của bạn");setTimeout(()=>setToast(""),1800)}}>Khám phá <span>→</span></button></article>)}</div></div></section>

      <section className="market-section" id="templates"><div className="shell"><div className="section-heading"><div><p className="section-label">BỘ CÔNG CỤ ĐƯỢC YÊU THÍCH</p><h2 className="section-title left">Lên kế hoạch đẹp hơn, thông minh hơn.</h2></div><a href="#templates">Xem tất cả template →</a></div><div className="product-grid">{templates.map(t=><article className="product" key={t.title}><div className={`product-art ${t.tone}`}><span>NẮNG — WEDDING TOOLS</span><b>{t.mark}</b><h3>{t.title}</h3><div className="paper-lines"><i/><i/><i/><i/></div></div><div className="product-info"><div><h3>{t.title}</h3><p>{t.type}</p></div><strong>{t.price}</strong></div><div className="product-actions"><button>Xem trước</button><button onClick={()=>{setToast("Đã thêm template vào giỏ");setTimeout(()=>setToast(""),1800)}}>Thêm vào giỏ</button></div></article>)}</div></div></section>

      <section className="vendor-section" id="vendors"><div className="shell"><div className="section-heading"><div><p className="section-label">VENDOR TUYỂN CHỌN</p><h2 className="section-title left">Đúng người, đúng phong cách.</h2></div><a href="#vendors">Khám phá marketplace →</a></div><div className="vendor-grid">{vendors.map((v)=><article className="vendor-card" key={v.name}><div className={`vendor-image ${v.image}`}><span className="verified">✓ Đã xác minh</span><button className={saved.includes(v.name)?"heart active":"heart"} onClick={()=>save(v.name)} aria-label={`Lưu ${v.name}`}>♡</button><div className="scene scene-a"/><div className="scene scene-b"/></div><div className="vendor-info"><span>{v.category}</span><h3>{v.name}</h3><p>⌖ {v.place}</p><div><strong>{v.price}</strong><button onClick={()=>{setToast("Đã mở hồ sơ vendor");setTimeout(()=>setToast(""),1800)}}>Xem chi tiết →</button></div></div></article>)}</div></div></section>

      <section className="service-section" id="services"><div className="shell service-wrap"><div className="service-copy"><p className="section-label">KHI BẠN CẦN MỘT NGƯỜI ĐỒNG HÀNH</p><h2>Không cần tự mình<br/>làm tất cả.</h2><p>Từ một buổi gỡ rối đến lập kế hoạch trọn gói, chuyên gia của Nắng sẵn sàng đồng hành đúng lúc bạn cần.</p><button className="button light">Khám phá dịch vụ <b>→</b></button></div><div className="service-list">{["Tư vấn định hướng cưới","Lập kế hoạch từng phần","Điều phối ngày cưới","Concept & Styling"].map((s,i)=><button key={s}><span>{String(i+1).padStart(2,"0")}</span><strong>{s}</strong><i>↗</i></button>)}</div></div></section>

      <section className="journal" id="journal"><div className="shell"><div className="section-heading"><div><p className="section-label">CẨM NANG CƯỚI</p><h2 className="section-title left">Một chút hiểu biết, thật nhiều an tâm.</h2></div><a href="#journal">Xem tất cả bài viết →</a></div><div className="article-grid"><article className="article main-article"><div className="article-visual rings"><span>GUIDE 01</span></div><div><span>NGÂN SÁCH</span><h3>Cách chia ngân sách cưới 400 triệu mà vẫn đúng ưu tiên</h3><p>7 phút đọc · 24.10.2026</p></div></article><article className="article"><div className="article-visual fabric"><span>GUIDE 02</span></div><div><span>CHUẨN BỊ</span><h3>Checklist 12 tháng trước ngày cưới</h3><p>5 phút đọc · 18.10.2026</p></div></article><article className="article"><div className="article-visual table"><span>GUIDE 03</span></div><div><span>VENDOR</span><h3>7 câu hỏi cần hỏi venue trước khi đặt cọc</h3><p>6 phút đọc · 09.10.2026</p></div></article></div></div></section>

      <section className="final-cta"><div className="shell"><span className="sun">✦</span><p>NẮNG CÙNG BẠN, TỪ HÔM NAY</p><h2>Ngày cưới của bạn,<br/><em>theo cách của bạn.</em></h2><p>Bắt đầu miễn phí. Không áp lực, không cần biết mọi câu trả lời.</p><a className="button" href="/workspace">Tạo kế hoạch cưới ngay <b>→</b></a></div></section>

      <footer><div className="shell footer-grid"><div><a className="brand footer-brand" href="#top"><span>N</span>NẮNG</a><p>Nền tảng lên kế hoạch cưới thông minh dành cho các cặp đôi Việt Nam.</p><small>hello@nangwedding.vn<br/>Hotline: 090 123 4567</small></div><div><strong>Khám phá</strong><a href="#tools">AI Wedding Planner</a><a href="#templates">Template cưới</a><a href="#vendors">Vendor marketplace</a><a href="#services">Dịch vụ cưới</a></div><div><strong>Hỗ trợ</strong><a href="#journal">Cẩm nang cưới</a><a href="#top">Câu hỏi thường gặp</a><a href="#top">Liên hệ</a><a href="#top">Dành cho vendor</a></div><div><strong>Pháp lý</strong><a href="#top">Điều khoản sử dụng</a><a href="#top">Chính sách bảo mật</a><a href="#top">Chính sách thanh toán</a><a href="#top">Chính sách hoàn tiền</a></div></div><div className="shell footer-bottom"><span>© 2026 Nắng Wedding. Made with care in Vietnam.</span><div><a href="#top">Instagram</a><a href="#top">Facebook</a><a href="#top">Pinterest</a></div></div></footer>
    </main>
  );
}
