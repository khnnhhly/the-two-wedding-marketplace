 
import type { Metadata } from "next";
import { PublicPage } from "../components/MarketplaceChrome";

export const metadata: Metadata = { title: "Đăng nhập", robots: { index: false } };

const destinations: Record<string, { title: string; body: string; alt: { href: string; label: string } }> = {
  "/workspace": { title: "Wedding Workspace", body: "Lưu brief, checklist, ngân sách, shortlist và theo dõi báo giá trong một nơi.", alt: { href: "/inquiry", label: "Chỉ cần gửi brief? Không cần tài khoản →" } },
  "/vendor-center": { title: "Vendor Center", body: "Quản lý hồ sơ, listing, inquiry và booking của doanh nghiệp.", alt: { href: "/vendor-apply", label: "Chưa có hồ sơ? Gửi đăng ký vendor →" } },
};

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const requested = (await searchParams).next ?? "/workspace";
  const next = requested.startsWith("/") && !requested.startsWith("//") ? requested : "/workspace";
  const info = destinations[next.split("?")[0]] ?? destinations["/workspace"];
  return <PublicPage className="login-page">
    <section className="market-shell login-shell"><div className="login-card">
      <p className="eyebrow">TÀI KHOẢN THE TWO</p>
      <h1>Đăng nhập vào {info.title}</h1>
      <p>{info.body}</p>
      <div className="consent-note"><b>Bản thử nghiệm dùng “Sign in with ChatGPT”.</b><p>Bạn sẽ được chuyển tới cổng đăng nhập bảo mật của OpenAI, sau đó vào ứng dụng the two. the two chỉ nhận email và tên hiển thị, không nhận mật khẩu.</p></div>
      <a className="primary-market-btn orange" href={next}>Tiếp tục đăng nhập →</a>
      <a className="text-action" href={info.alt.href}>{info.alt.label}</a>
    </div></section>
  </PublicPage>;
}
