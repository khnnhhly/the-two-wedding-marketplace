import type { Metadata } from "next";
import { PublicPage } from "../components/MarketplaceChrome";
import { templates } from "../data/marketplace";

export const metadata: Metadata = { title: "Template & công cụ lên kế hoạch cưới", description: "Wedding Master Planner, Budget Planner, Wedding Day Rundown và các công cụ planning dùng trực tiếp trong Workspace." };

export default function TemplatesPage() {
  return <PublicPage className="template-list-page"><section className="subpage-hero orange"><div className="market-shell split-hero"><div><p className="eyebrow">TEMPLATE & CÔNG CỤ</p><h1>Không chỉ là file mẫu.<br/><em>Là đầu việc thật trong Workspace.</em></h1><p>Mỗi template có trang giải thích riêng và có thể thêm trực tiếp vào kế hoạch sau khi bạn đăng nhập.</p></div><div className="flow-card"><b>Cách template hoạt động</b><ol><li>Xem nội dung & kết quả</li><li>Mở trong Workspace</li><li>Xác nhận thêm vào kế hoạch</li><li>Tùy chỉnh theo đám cưới</li></ol></div></div></section><section className="market-shell listing-section"><div className="listing-intro"><div><p className="eyebrow">PLANNING LIBRARY</p><h2>Chọn đúng công cụ cho việc trước mắt</h2></div><p>Tất cả template đều tách biệt dự kiến, booking và thanh toán đã xác minh.</p></div><div className="template-full-grid">{templates.map((item, index) => <article key={item.slug}><a href={`/templates/${item.slug}`} className={`product-cover-new ${item.tone}`}><span>THE TWO · TOOL {String(index + 1).padStart(2, "0")}</span><h3>{item.name}</h3><div className="product-sheet"><i/><i/><i/><i/></div></a><div><small>{item.meta}</small><h3>{item.name}</h3><p>{item.description}</p><strong>{item.price}</strong><a href={`/templates/${item.slug}`}>Xem chi tiết →</a></div></article>)}</div></section></PublicPage>;
}
