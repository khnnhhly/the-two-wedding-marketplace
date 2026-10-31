/* eslint-disable @next/next/no-html-link-for-pages */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicPage } from "../../components/MarketplaceChrome";
import { ShortlistButton } from "../../components/Shortlist";
import { findVendor, vendorPrice, vendors } from "../../data/marketplace";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return vendors.map(vendor => ({ slug: vendor.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const vendor = findVendor((await params).slug);
  if (!vendor) return { title: "Không tìm thấy vendor" };
  return {
    title: `${vendor.name} — ${vendor.category} tại ${vendor.location}`,
    description: `${vendor.description} ${vendorPrice(vendor)}. Xem gói dịch vụ, quy trình và gửi brief miễn phí trên the two.`,
    alternates: { canonical: `/vendors/${vendor.slug}` },
  };
}

/** Every contact action goes through /go so the click is attributed before leaving the page. */
const track = (slug: string, channel: string, position: string, extra = "") => `/go/${slug}?channel=${channel}&pos=${position}${extra}`;

export default async function VendorDetail({ params }: Props) {
  const vendor = findVendor((await params).slug);
  if (!vendor) notFound();
  const external = [
    vendor.contacts?.website && { channel: "website", label: "Xem website" },
    vendor.contacts?.instagram && { channel: "instagram", label: "Mở Instagram" },
    vendor.contacts?.phone && { channel: "phone", label: "Gọi điện" },
  ].filter(Boolean) as { channel: string; label: string }[];

  return <PublicPage className="vendor-detail-page">
    <section className={`vendor-detail-hero ${vendor.color}`}><div className="market-shell vendor-hero-grid"><div className="vendor-monogram"><span>✓ HỒ SƠ ĐÃ XÁC MINH</span><b>{vendor.name.slice(0, 1)}</b></div><div><p className="eyebrow">{vendor.category.toUpperCase()}</p><h1>{vendor.name}</h1><p>{vendor.longDescription}</p><div className="vendor-detail-meta"><span>⌖ {vendor.location}</span><span>{vendor.tag}</span><strong>{vendorPrice(vendor)}</strong></div><div className="hero-action-row"><a className="primary-market-btn orange" href={track(vendor.slug, "inquiry", "hero")}>Gửi brief cho vendor →</a><ShortlistButton slug={vendor.slug} name={vendor.name} variant="full"/>{external.map(item => <a key={item.channel} className="secondary-market-btn" href={track(vendor.slug, item.channel, "hero")} rel="nofollow">{item.label}</a>)}</div><small className="safety-line">Gửi brief miễn phí, chưa tạo booking và không giữ lịch tự động.</small><a className="back-link" href="/vendors?recommended=1">← Quay lại flow tra cứu</a></div></div></section>
    <section className="market-shell detail-layout"><article className="detail-main">
      <section><p className="eyebrow">DỊCH VỤ</p><h2>Phạm vi có thể tư vấn</h2><div className="service-chip-grid">{vendor.services.map(service => <span key={service}>{service}</span>)}</div></section>
      <section><p className="eyebrow">GÓI THAM KHẢO</p><h2>Chọn điểm bắt đầu cho brief</h2><div className="package-grid">{vendor.packages.map(item => <article key={item.name}><h3>{item.name}</h3><strong>{item.price}</strong><ul>{item.includes.map(value => <li key={value}>✓ {value}</li>)}</ul><a href={track(vendor.slug, "inquiry", "package", `&package=${encodeURIComponent(item.name)}`)}>Hỏi gói này →</a></article>)}</div></section>
      <section><p className="eyebrow">PORTFOLIO</p><h2>Hình ảnh thực tế</h2><div className="portfolio-empty"><b>◇</b><p>Vendor đang cập nhật portfolio đã xác minh. the two chỉ hiển thị hình ảnh từ dự án vendor thực hiện, không dùng ảnh minh họa.</p><a href={track(vendor.slug, "inquiry", "portfolio", `&package=${encodeURIComponent("Xin portfolio")}`)}>Xin portfolio qua brief →</a></div></section>
      <section><p className="eyebrow">QUY TRÌNH</p><h2>Từ inquiry đến booking</h2><ol className="number-flow">{vendor.process.map((step, index) => <li key={step}><b>{String(index + 1).padStart(2, "0")}</b><span>{step}</span></li>)}</ol></section>
      <section><p className="eyebrow">REVIEW</p><h2>Đánh giá từ cặp đôi</h2><div className="portfolio-empty"><b>☆</b><p>Chưa có review đã xác minh. Review chỉ được mở cho cặp đôi đã sử dụng dịch vụ (booking qua the two hoặc có mã brief/bằng chứng dịch vụ) và không bị ảnh hưởng bởi việc vendor trả phí.</p><a href="/policies/reviews">Cách the two xác minh review →</a></div></section>
      <section><p className="eyebrow">CÂU HỎI THƯỜNG GẶP</p><div className="faq-list">{vendor.faqs.map(item => <details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}</div></section>
    </article><aside className="detail-aside"><p className="eyebrow">THÔNG TIN ĐƯỢC XÁC MINH</p>{vendor.facts.map(fact => <span key={fact}>✓ {fact}</span>)}<hr/><h3>Brief tốt nên có</h3><ul><li>Ngày hoặc khoảng thời gian</li><li>Địa điểm dự kiến</li><li>Số khách</li><li>Ngân sách & ưu tiên</li></ul><a className="primary-market-btn" href={track(vendor.slug, "inquiry", "sidebar")}>Mở form gửi brief</a><a className="compare-link" href="/shortlist">So sánh với vendor đã lưu →</a></aside></section>
  </PublicPage>;
}
