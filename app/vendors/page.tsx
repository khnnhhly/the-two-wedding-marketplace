"use client";

import { useMemo, useState } from "react";
import { PublicPage } from "../components/MarketplaceChrome";
import { money, vendors } from "../data/marketplace";

const filters = ["Tất cả", "Wedding Planner", "Photo & Film", "Trang trí", "Trang phục"];

export default function VendorsPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("Tất cả");
  const results = useMemo(() => vendors.filter(vendor => {
    const matchesFilter = filter === "Tất cả" || vendor.category === filter;
    const matchesQuery = !query.trim() || `${vendor.name} ${vendor.category} ${vendor.location} ${vendor.description}`.toLowerCase().includes(query.toLowerCase());
    return matchesFilter && matchesQuery;
  }), [filter, query]);
  return <PublicPage className="market-list-page">
    <section className="subpage-hero blue"><div className="market-shell split-hero"><div><p className="eyebrow">VENDOR MARKETPLACE</p><h1>Tìm đúng người đồng hành,<br/><em>trước khi gửi một inquiry.</em></h1><p>Hồ sơ, phạm vi dịch vụ, giá khởi điểm và quy trình được trình bày riêng cho từng vendor.</p></div><div className="flow-card"><b>Luồng dành cho Couple</b><ol><li>Khám phá & lọc</li><li>Xem hồ sơ chi tiết</li><li>Gửi brief trong Workspace</li><li>So sánh báo giá</li></ol></div></div></section>
    <section className="market-shell listing-section">
      <div className="listing-controls"><label><span>Tìm vendor</span><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Tên, dịch vụ hoặc địa điểm"/></label><div>{filters.map(item => <button key={item} onClick={() => setFilter(item)} className={filter === item ? "active" : ""}>{item}</button>)}</div></div>
      <div className="listing-intro"><div><p className="eyebrow">{results.length} HỒ SƠ PHÙ HỢP</p><h2>Vendor đã được xét duyệt</h2></div><p>Inquiry không phải booking. Availability chỉ được xác nhận bởi vendor sau khi xem brief.</p></div>
      <div className="market-vendor-grid detailed-grid">{results.map(vendor => <article className="market-vendor-card" key={vendor.slug}><a href={`/vendors/${vendor.slug}`} className={`market-vendor-image ${vendor.color}`}><span>✓ ĐÃ XÁC MINH</span><b>{vendor.name.slice(0, 1)}</b><div className="vendor-pattern"/></a><div className="market-vendor-body"><small>{vendor.category.toUpperCase()}</small><h3>{vendor.name}</h3><p>{vendor.description}</p><div className="vendor-meta"><span>⌖ {vendor.location}</span><em>{vendor.tag}</em></div><div className="vendor-card-bottom"><strong>{money(vendor.price)}</strong><a href={`/vendors/${vendor.slug}`}>Xem hồ sơ →</a></div></div></article>)}</div>
      {!results.length && <div className="market-empty"><b>⌕</b><h3>Chưa tìm thấy vendor phù hợp</h3><p>Thử đổi từ khóa hoặc danh mục.</p><button onClick={() => { setQuery(""); setFilter("Tất cả"); }}>Xóa bộ lọc</button></div>}
    </section>
  </PublicPage>;
}
