"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useMemo, useState } from "react";
import { PublicPage } from "../components/MarketplaceChrome";
import { categoryMeta, type DiscoveryProfile, recommendedCategories, serviceCategories } from "../data/discovery";
import { money, vendors } from "../data/marketplace";

const filters = ["Tất cả", ...serviceCategories.map(category => category.name)];

export default function VendorsPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("Tất cả");
  const [profile, setProfile] = useState<DiscoveryProfile | null>(null);
  const [personalized, setPersonalized] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requestedQuery = params.get("q") ?? "";
    const requestedCategory = params.get("category") ?? "";
    setQuery(requestedQuery);
    if (filters.includes(requestedCategory)) setFilter(requestedCategory);
    else if (requestedCategory === "Venue") setFilter("Địa điểm");
    setPersonalized(params.get("recommended") === "1");
    const saved = sessionStorage.getItem("the-two-discovery-profile");
    if (saved) try { setProfile(JSON.parse(saved)); } catch { /* ignore invalid local profile */ }
  }, []);

  const recommended = useMemo(() => profile ? recommendedCategories(profile) : [], [profile]);
  const results = useMemo(() => vendors.filter(vendor => {
    const matchesFilter = filter === "Tất cả" || vendor.category === filter;
    const matchesQuery = !query.trim() || `${vendor.name} ${vendor.category} ${vendor.location} ${vendor.description}`.toLowerCase().includes(query.toLowerCase());
    return matchesFilter && matchesQuery;
  }).sort((a, b) => {
    if (!profile) return 0;
    const score = (vendor: typeof a) => (recommended.includes(vendor.category) ? 2 : 0) + (profile.location && vendor.location.toLowerCase().includes(profile.location.toLowerCase()) ? 1 : 0);
    return score(b) - score(a);
  }), [filter, profile, query, recommended]);

  function chooseCategory(category: string) {
    setFilter(category);
    const params = new URLSearchParams();
    if (category !== "Tất cả") params.set("category", category);
    if (query) params.set("q", query);
    if (personalized) params.set("recommended", "1");
    window.history.replaceState({}, "", `/vendors${params.size ? `?${params}` : ""}`);
  }

  return <PublicPage className="market-list-page">
    <section className="subpage-hero blue"><div className="market-shell split-hero"><div><p className="eyebrow">VENDOR MARKETPLACE</p><h1>Tra cứu theo category,<br/><em>không lạc giữa quá nhiều lựa chọn.</em></h1><p>Chọn một nhóm dịch vụ, xem hồ sơ phù hợp rồi quay lại flow để tiếp tục category kế tiếp.</p></div><div className="flow-card"><b>FLOW TRA CỨU</b><ol><li>Chọn một category</li><li>Xem hồ sơ chi tiết</li><li>Gửi brief khi phù hợp</li><li>Quay lại category tiếp theo</li></ol></div></div></section>
    <section className="market-shell listing-section">
      {personalized && profile && <div className="preference-bar"><div><p className="eyebrow">RECOMMENDATION ĐANG BẬT</p><h2>{profile.location || "Chưa chốt địa điểm"}{profile.date ? ` · ${profile.date}` : ""}</h2><p>Ưu tiên: {recommended.join(" → ")}</p></div><a href="/planning">Chỉnh preference →</a></div>}

      {recommended.length > 0 && <div className="recommended-categories"><span>Flow gợi ý cho bạn</span>{recommended.map((name, index) => <button key={name} className={filter === name ? "active" : ""} onClick={() => chooseCategory(name)}><b>{String(index + 1).padStart(2, "0")}</b>{categoryMeta(name).icon} {name}</button>)}</div>}

      <div className="listing-controls"><label><span>Tìm trong marketplace</span><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Tên vendor, dịch vụ hoặc địa điểm"/></label><div>{filters.map(item => <button key={item} onClick={() => chooseCategory(item)} className={filter === item ? "active" : ""}>{item}</button>)}</div></div>
      <div className="listing-intro"><div><p className="eyebrow">{results.length} HỒ SƠ PHÙ HỢP</p><h2>{filter === "Tất cả" ? "Tất cả vendor đã xét duyệt" : filter}</h2></div><p>Inquiry không phải booking. Availability chỉ được xác nhận bởi vendor sau khi xem brief.</p></div>
      <div className="market-vendor-grid detailed-grid">{results.map(vendor => <article className="market-vendor-card" key={vendor.slug}><a href={`/vendors/${vendor.slug}`} className={`market-vendor-image ${vendor.color}`}><span>✓ ĐÃ XÁC MINH</span><b>{vendor.name.slice(0, 1)}</b><div className="vendor-pattern"/></a><div className="market-vendor-body"><small>{vendor.category.toUpperCase()}</small><h3>{vendor.name}</h3><p>{vendor.description}</p><div className="vendor-meta"><span>⌖ {vendor.location}</span><em>{vendor.tag}</em></div><div className="vendor-card-bottom"><strong>{money(vendor.price)}</strong><a href={`/vendors/${vendor.slug}`}>Xem hồ sơ →</a></div></div></article>)}</div>
      {!results.length && <div className="market-empty"><b>⌕</b><h3>Chưa có vendor phù hợp trong category này</h3><p>Thử category khác hoặc bỏ từ khóa tìm kiếm.</p><button onClick={() => { setQuery(""); chooseCategory("Tất cả"); }}>Xóa bộ lọc</button></div>}
    </section>
  </PublicPage>;
}
