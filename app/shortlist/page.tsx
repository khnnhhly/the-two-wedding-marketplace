"use client";

/* eslint-disable @next/next/no-html-link-for-pages */

import { PublicPage } from "../components/MarketplaceChrome";
import { ShortlistButton, useShortlist } from "../components/Shortlist";
import { vendorPrice, vendors } from "../data/marketplace";

export default function ShortlistPage() {
  const { items, clear } = useShortlist();
  const saved = vendors.filter(vendor => items.includes(vendor.slug));
  const rows: { label: string; value: (vendor: typeof vendors[number]) => React.ReactNode }[] = [
    { label: "Category", value: vendor => vendor.category },
    { label: "Khu vực", value: vendor => vendor.location },
    { label: "Giá khởi điểm", value: vendor => vendorPrice(vendor) },
    { label: "Hình thức", value: vendor => vendor.tag },
    { label: "Gói tham khảo", value: vendor => <ul>{vendor.packages.map(item => <li key={item.name}>{item.name} — {item.price}</li>)}</ul> },
    { label: "Dịch vụ", value: vendor => vendor.services.join(", ") },
    { label: "Đã xác minh", value: vendor => <ul>{vendor.facts.map(fact => <li key={fact}>✓ {fact}</li>)}</ul> },
    { label: "Review", value: () => "Chưa có review đã xác minh" },
  ];
  return <PublicPage className="shortlist-page">
    <section className="subpage-hero blue"><div className="market-shell"><p className="eyebrow">SHORTLIST & SO SÁNH</p><h1>So sánh cùng một tiêu chí,<br/><em>rồi mới gửi brief.</em></h1><p>Shortlist được lưu trên trình duyệt này. Đăng nhập Workspace để đồng bộ với partner và gia đình.</p></div></section>
    <section className="market-shell listing-section">
      {saved.length === 0 ? <div className="market-empty"><b>♡</b><h3>Chưa có vendor nào trong shortlist</h3><p>Bấm ♡ trên thẻ vendor để lưu và so sánh tại đây.</p><div className="empty-actions"><a href="/vendors">Khám phá vendor →</a></div></div> : <>
        <div className="listing-intro"><div><p className="eyebrow">{saved.length} VENDOR ĐÃ LƯU</p><h2>Bảng so sánh</h2></div><button className="text-action" onClick={clear}>Xóa toàn bộ shortlist</button></div>
        <div className="compare-scroll"><table className="compare-table">
          <thead><tr><th scope="col">Tiêu chí</th>{saved.map(vendor => <th scope="col" key={vendor.slug}><a href={`/vendors/${vendor.slug}`}>{vendor.name}</a><ShortlistButton slug={vendor.slug} name={vendor.name}/></th>)}</tr></thead>
          <tbody>{rows.map(row => <tr key={row.label}><th scope="row">{row.label}</th>{saved.map(vendor => <td key={vendor.slug}>{row.value(vendor)}</td>)}</tr>)}
            <tr><th scope="row">Bước tiếp theo</th>{saved.map(vendor => <td key={vendor.slug}><a className="primary-market-btn" href={`/go/${vendor.slug}?channel=inquiry&pos=compare`}>Gửi brief →</a></td>)}</tr>
          </tbody>
        </table></div>
      </>}
    </section>
  </PublicPage>;
}
