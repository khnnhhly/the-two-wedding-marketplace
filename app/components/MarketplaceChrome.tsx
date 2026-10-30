/* eslint-disable @next/next/no-img-element, @next/next/no-html-link-for-pages */

import { AiConcierge } from "./AiConcierge";

export function Brand({ light = false }: { light?: boolean }) {
  return <a className={`market-brand${light ? " light" : ""}`} href="/" aria-label="the two — trang chủ"><span className="mark"><img src="/the-two-monogram.png" alt="" width="37" height="40" /></span><span className="wordmark">the two<small>wedding marketplace</small></span></a>;
}

export function MarketplaceHeader() {
  return <>
    <div className="utility-bar"><div className="market-shell"><div><a href="/planning">Dành cho cặp đôi</a><span/> <a href="/for-vendors">Dành cho vendor</a><span/> <a href="/help">Hỗ trợ</a></div><div><a href="/vendor-center">Vendor Center</a><a href="/workspace">Workspace</a></div></div></div>
    <header className="market-nav market-shell compact-market-nav">
      <Brand />
      <form className="market-search" action="/vendors"><label htmlFor="global-market-search">Tìm dịch vụ cưới</label><input id="global-market-search" name="q" placeholder="Tìm venue, photographer, váy cưới…"/><button aria-label="Tìm kiếm">⌕</button></form>
      <a className="workspace-link" href="/workspace"><i>□</i><span>Workspace<small>Kế hoạch của bạn</small></span></a>
    </header>
    <nav className="category-nav"><div className="market-shell"><a href="/vendors">Vendor marketplace</a><a href="/templates">Template & công cụ</a><a href="/planning">AI Wedding Planner</a><a href="/services/planning">Dịch vụ planning</a><a href="/guidebook">Cẩm nang</a><a href="/vendor-onboarding" className="vendor-nav-link">Mở gian hàng →</a></div></nav>
  </>;
}

export function MarketplaceFooter() {
  return <footer className="market-footer"><div className="market-shell footer-main"><div><Brand light/><p>Wedding marketplace và planning workspace dành cho thị trường Việt Nam.</p><span>hello@thetwo.vn · Vietnam</span></div><div><strong>Marketplace</strong><a href="/vendors">Khám phá vendor</a><a href="/templates">Template & công cụ</a><a href="/planning">AI Wedding Planner</a><a href="/services/planning">Dịch vụ planning</a></div><div><strong>Dành cho vendor</strong><a href="/vendor-onboarding">Mở gian hàng</a><a href="/vendor-center">Vendor Center</a><a href="/policies/payments">Phí & chính sách</a><a href="/help">Trung tâm hỗ trợ</a></div><div><strong>Về the two</strong><a href="/about">Giới thiệu</a><a href="/legal/terms">Điều khoản</a><a href="/legal/privacy">Bảo mật</a><a href="/policies/payments">Thanh toán & hoàn tiền</a></div></div><div className="market-shell footer-bottom-new"><span>© 2026 the two. Wedding marketplace, made clear.</span><div><span>Instagram</span><span>Facebook</span><span>Pinterest</span></div></div></footer>;
}

export function PublicPage({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`public-page ${className}`}><MarketplaceHeader/><main>{children}</main><MarketplaceFooter/><AiConcierge/></div>;
}
