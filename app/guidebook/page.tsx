/* eslint-disable @next/next/no-html-link-for-pages */
import type { Metadata } from "next";
import { PublicPage } from "../components/MarketplaceChrome";
import { templates } from "../data/marketplace";

export const metadata: Metadata = { title: "Cẩm nang chuẩn bị đám cưới", description: "Checklist, câu hỏi và mốc thời gian để chuẩn bị đám cưới đúng việc, đúng thời điểm." };

export default function GuidebookPage() {
  return <PublicPage className="guidebook-page"><section className="subpage-hero blue"><div className="market-shell split-hero"><div><p className="eyebrow">CẨM NANG THE TWO</p><h1>Làm đúng việc,<br/><em>đúng thời điểm.</em></h1><p>Guidebook gom các quyết định khó thành checklist, câu hỏi và mốc thời gian có thể áp dụng vào Workspace.</p></div><div className="flow-card"><b>Ba nguyên tắc</b><ol><li>Chốt ngân sách trước concept</li><li>So sánh cùng một phạm vi</li><li>Chỉ tính thanh toán đã xác minh</li></ol></div></div></section><section className="market-shell info-sections"><article><b>01</b><div><h2>Bắt đầu với brief</h2><p>Ghi lại địa điểm, số khách, ngân sách, thời gian và ưu tiên. Thông tin chưa chắc chắn được để trống thay vì tự đoán.</p><a href="/planning">Tạo Wedding Brief →</a></div></article><article><b>02</b><div><h2>Xây timeline & ngân sách</h2><p>Dùng template phù hợp để đưa đầu việc thật vào Workspace và điều chỉnh theo ngày cưới.</p><a href="/templates">Xem thư viện template →</a></div></article><article><b>03</b><div><h2>Làm việc với vendor</h2><p>Đọc hồ sơ, gửi một brief có cấu trúc, so sánh báo giá cùng phạm vi trước khi booking.</p><a href="/vendors">Khám phá marketplace →</a></div></article></section><section className="market-shell guidebook-picks"><p className="eyebrow">GỢI Ý CHO BẠN</p><h2>Template được dùng nhiều trong flow</h2><div>{templates.slice(0, 3).map(item => <a key={item.slug} href={`/templates/${item.slug}`}><small>{item.meta}</small><b>{item.name}</b><span>Xem chi tiết →</span></a>)}</div></section></PublicPage>;
}
