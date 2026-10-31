"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useMemo, useState } from "react";
import { PublicPage } from "../components/MarketplaceChrome";
import { VendorCard } from "../components/VendorCard";
import { categoryMeta, type DiscoveryProfile, formatWeddingMonth, loadDiscoveryProfile, recommendedCategories, serviceCategories } from "../data/discovery";
import { vendors } from "../data/marketplace";
import { basedIn, locationOptions, matchesQuery, servesLocation } from "../lib/search";

const ALL = "Tất cả";
const filters = [ALL, ...serviceCategories.map(category => category.name as string)];
const priceOptions = [
  { id: "all", label: "Mọi mức giá" },
  { id: "under-10", label: "Dưới 10 triệu", max: 10_000_000 },
  { id: "10-30", label: "10–30 triệu", min: 10_000_000, max: 30_000_000 },
  { id: "over-30", label: "Trên 30 triệu", min: 30_000_000 },
] as const;

type PriceId = typeof priceOptions[number]["id"];

export default function VendorsPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState(ALL);
  const [location, setLocation] = useState<string>(locationOptions[0]);
  const [price, setPrice] = useState<PriceId>("all");
  const [profile, setProfile] = useState<DiscoveryProfile | null>(null);
  const [personalized, setPersonalized] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setQuery(params.get("q") ?? "");
    const requestedCategory = params.get("category") ?? "";
    if (filters.includes(requestedCategory)) setFilter(requestedCategory);
    else if (requestedCategory === "Venue") setFilter("Địa điểm");
    const requestedLocation = params.get("location");
    if (requestedLocation) setLocation(requestedLocation);
    const requestedPrice = params.get("price");
    if (priceOptions.some(option => option.id === requestedPrice)) setPrice(requestedPrice as PriceId);
    const isPersonalized = params.get("recommended") === "1";
    setPersonalized(isPersonalized);
    const saved = loadDiscoveryProfile();
    setProfile(saved);
    if (isPersonalized && saved?.location && !requestedLocation) setLocation(saved.location);
    setReady(true);
  }, []);

  // Keep every filter in the URL so results survive reloads and can be shared.
  useEffect(() => {
    if (!ready) return;
    const params = new URLSearchParams();
    if (filter !== ALL) params.set("category", filter);
    if (query.trim()) params.set("q", query.trim());
    if (location !== locationOptions[0]) params.set("location", location);
    if (price !== "all") params.set("price", price);
    if (personalized) params.set("recommended", "1");
    window.history.replaceState({}, "", `/vendors${params.size ? `?${params}` : ""}`);
  }, [filter, query, location, price, personalized, ready]);

  const recommended = useMemo(() => profile ? recommendedCategories(profile) : [], [profile]);
  const priceRange = priceOptions.find(option => option.id === price)!;
  const locationFilter = location === locationOptions[0] ? "" : location;

  const results = useMemo(() => vendors.filter(vendor => {
    if (filter !== ALL && vendor.category !== filter) return false;
    if (!matchesQuery(vendor, query)) return false;
    if (locationFilter && !servesLocation(vendor, locationFilter)) return false;
    // Per-guest or per-item prices are not comparable with package totals.
    if (price !== "all" && vendor.priceUnit) return false;
    if ("min" in priceRange && (vendor.price == null || vendor.price < priceRange.min)) return false;
    if ("max" in priceRange && (vendor.price == null || vendor.price >= priceRange.max)) return false;
    return true;
  }).sort((a, b) => {
    if (!profile) return 0;
    const score = (vendor: typeof a) => (recommended.includes(vendor.category) ? 2 : 0) + (profile.location && servesLocation(vendor, profile.location) ? 1 : 0);
    return score(b) - score(a);
  }), [filter, query, locationFilter, price, priceRange, profile, recommended]);

  const hasExtraFilters = Boolean(query.trim() || locationFilter || price !== "all");
  const localSupply = profile?.location ? vendors.filter(vendor => basedIn(vendor, profile.location)).length : null;

  function resetFilters() {
    setQuery("");
    setLocation(locationOptions[0]);
    setPrice("all");
    setFilter(ALL);
  }

  const emptyTitle = filter === ALL ? "Chưa có vendor khớp với bộ lọc" : `Chưa có vendor ${filter} khớp với bộ lọc`;

  return <PublicPage className="market-list-page">
    <section className="subpage-hero blue"><div className="market-shell split-hero"><div><p className="eyebrow">VENDOR MARKETPLACE</p><h1>Tra cứu theo category,<br/><em>không lạc giữa quá nhiều lựa chọn.</em></h1><p>Chọn một nhóm dịch vụ, lọc theo khu vực và ngân sách, lưu vendor vào shortlist rồi so sánh trước khi gửi brief.</p></div><div className="flow-card"><b>FLOW TRA CỨU</b><ol><li>Chọn một category</li><li>Lưu vendor vào shortlist</li><li>So sánh & gửi brief</li><li>Quay lại category tiếp theo</li></ol></div></div></section>
    <section className="market-shell listing-section">
      {personalized && profile && <div className="preference-bar"><div><p className="eyebrow">ĐANG GỢI Ý THEO HỒ SƠ CỦA BẠN</p><h2>{profile.location || "Chưa chốt địa điểm"}{profile.date ? ` · ${formatWeddingMonth(profile.date)}` : ""}</h2><p>Thứ tự nên tra cứu: {recommended.join(" → ")}</p></div><a href="/planning">Chỉnh câu trả lời →</a></div>}
      {personalized && profile?.location && localSupply === 0 && <div className="notice-bar" role="status"><b>Chưa có vendor đặt tại {profile.location}.</b> Kết quả dưới đây là vendor nhận làm toàn quốc. the two đang mở rộng khu vực này — bạn cũng có thể <a href="/inquiry">gửi brief để the two tìm giúp</a>.</div>}

      {recommended.length > 0 && <div className="recommended-categories"><span>Flow gợi ý cho bạn</span>{recommended.map((name, index) => <button key={name} className={filter === name ? "active" : ""} onClick={() => setFilter(name)}><b>{String(index + 1).padStart(2, "0")}</b>{categoryMeta(name).icon} {name}</button>)}</div>}

      <div className="listing-controls">
        <label><span>Tìm trong marketplace</span><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Ví dụ: chụp ảnh hà nội, váy cưới, band"/></label>
        <div role="group" aria-label="Lọc theo category">{filters.map(item => <button key={item} aria-pressed={filter === item} onClick={() => setFilter(item)} className={filter === item ? "active" : ""}>{item}</button>)}</div>
      </div>
      <div className="listing-filters">
        <label><span>Khu vực</span><select value={locationOptions.includes(location as typeof locationOptions[number]) ? location : "__custom"} onChange={event => setLocation(event.target.value)}>{locationOptions.map(option => <option key={option}>{option}</option>)}{!locationOptions.includes(location as typeof locationOptions[number]) && <option value="__custom">{location}</option>}</select></label>
        <label><span>Giá khởi điểm</span><select value={price} onChange={event => setPrice(event.target.value as PriceId)}>{priceOptions.map(option => <option key={option.id} value={option.id}>{option.label}</option>)}</select></label>
        {hasExtraFilters && <button className="text-action" onClick={resetFilters}>Xóa bộ lọc</button>}
      </div>
      <div className="listing-intro"><div><p className="eyebrow">{results.length} HỒ SƠ PHÙ HỢP</p><h2>{filter === ALL ? "Tất cả vendor đã xét duyệt" : filter}</h2></div><p>Gửi brief miễn phí. Vendor xác nhận lịch trống và báo giá sau khi đọc brief.</p></div>
      <div className="market-vendor-grid detailed-grid">{results.map(vendor => <VendorCard key={vendor.slug} vendor={vendor}/>)}</div>
      {!results.length && <div className="market-empty"><b>⌕</b><h3>{emptyTitle}</h3><p>{query.trim() ? `Không tìm thấy “${query.trim()}”. ` : ""}Thử bỏ bớt bộ lọc, chọn category khác, hoặc gửi brief để the two tìm vendor giúp bạn.</p><div className="empty-actions"><button onClick={resetFilters}>Xóa bộ lọc</button><a href="/inquiry">Gửi brief cho the two →</a></div></div>}
    </section>
  </PublicPage>;
}
