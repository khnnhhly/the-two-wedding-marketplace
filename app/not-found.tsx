/* eslint-disable @next/next/no-html-link-for-pages */
import { PublicPage } from "./components/MarketplaceChrome";

export const metadata = { title: "Không tìm thấy trang" };

export default function NotFound() {
  return <PublicPage><section className="not-found market-shell"><p className="eyebrow">404</p><h1>Không tìm thấy trang này.</h1><p>Đường dẫn có thể đã thay đổi hoặc hồ sơ không còn hiển thị.</p><div className="hero-action-row"><a className="primary-market-btn" href="/vendors">Khám phá vendor</a><a className="secondary-market-btn" href="/">Về trang chủ</a></div></section></PublicPage>;
}
