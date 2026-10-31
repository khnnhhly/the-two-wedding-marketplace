/* eslint-disable @next/next/no-img-element, @next/next/no-html-link-for-pages */

import { CONTACT_EMAIL } from "../lib/site";
import { AiConcierge } from "./AiConcierge";
import { ShortlistCount } from "./Shortlist";

export function Brand({ light = false }: { light?: boolean }) {
  return <a className={`market-brand${light ? " light" : ""}`} href="/" aria-label="the two — trang chủ"><span className="mark"><img src="/the-two-monogram.png" alt="" width="37" height="40" /></span><span className="wordmark">the two<small>wedding marketplace</small></span></a>;
}

const quickSearches = [
  { label: "Địa điểm Hà Nội", href: `/vendors?category=${encodeURIComponent("Địa điểm")}&location=${encodeURIComponent("Hà Nội")}` },
  { label: "Photo & Film", href: `/vendors?category=${encodeURIComponent("Photo & Film")}` },
  { label: "Trang trí", href: `/vendors?category=${encodeURIComponent("Trang trí")}` },
];

export function MarketplaceHeader({ showQuickSearch = false }: { showQuickSearch?: boolean }) {
  return <>
    <div className="utility-bar"><div className="market-shell"><div><a href="/planning">Dành cho cặp đôi</a><span/> <a href="/for-vendors">Dành cho vendor</a><span/> <a href="/help">Hỗ trợ</a></div><div><a href="/shortlist">Shortlist</a><a href="/workspace">Workspace</a></div></div></div>
    <header className={`market-nav market-shell${showQuickSearch ? "" : " compact-market-nav"}`}>
      <Brand />
      <form className="market-search" action="/vendors" role="search"><label htmlFor="global-market-search">Tìm dịch vụ cưới</label><input id="global-market-search" name="q" placeholder="Tìm venue, photographer, váy cưới…"/><button aria-label="Tìm kiếm">⌕</button>{showQuickSearch && <div>{quickSearches.map(item => <a key={item.label} href={item.href}>{item.label}</a>)}</div>}</form>
      <div className="header-actions"><ShortlistCount/><a className="workspace-link" href="/workspace"><i>□</i><span>Workspace<small>Kế hoạch của bạn</small></span></a></div>
    </header>
    <nav className="category-nav" aria-label="Điều hướng chính"><div className="market-shell"><a href="/vendors">Khám phá vendor</a><a href="/templates">Template & công cụ</a><a href="/planning">Lên kế hoạch</a><a href="/services/planning">Dịch vụ planning</a><a href="/guidebook">Cẩm nang</a><a href="/for-vendors" className="vendor-nav-link">Bán hàng trên the two →</a></div></nav>
  </>;
}

export function MarketplaceFooter() {
  return <footer className="market-footer"><div className="market-shell footer-main"><div><Brand light/><p>Wedding marketplace và planning workspace dành cho thị trường Việt Nam.</p><a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></div><div><strong>Marketplace</strong><a href="/vendors">Khám phá vendor</a><a href="/shortlist">Shortlist & so sánh</a><a href="/templates">Template & công cụ</a><a href="/planning">Lên kế hoạch</a><a href="/services/planning">Dịch vụ planning</a></div><div><strong>Dành cho vendor</strong><a href="/vendor-apply">Mở gian hàng</a><a href="/policies/fees">Bảng phí & cách tính</a><a href="/help">Trung tâm hỗ trợ</a></div><div><strong>Về the two</strong><a href="/about">Giới thiệu</a><a href="/legal/terms">Điều khoản</a><a href="/legal/privacy">Bảo mật dữ liệu</a><a href="/policies/payments">Thanh toán & hoàn tiền</a><a href="/policies/reviews">Chính sách review</a></div></div><div className="market-shell footer-bottom-new"><span>© 2026 the two. Wedding marketplace, made clear.</span></div></footer>;
}

export function PublicPage({ children, className = "", showQuickSearch = false }: { children: React.ReactNode; className?: string; showQuickSearch?: boolean }) {
  return <div className={`public-page ${className}`}><MarketplaceHeader showQuickSearch={showQuickSearch}/><main id="main">{children}</main><MarketplaceFooter/><AiConcierge/></div>;
}
