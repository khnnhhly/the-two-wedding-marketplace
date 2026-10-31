import type { Metadata } from "next";
import { SITE_URL } from "./lib/site";
import "./globals.css";
import "./brand-fixes.css";
import "./flows.css";
import "./fixes.css";

const description = "Marketplace giúp cặp đôi tìm vendor cưới đã xét duyệt, so sánh và gửi brief miễn phí; giúp vendor nhận lead có cấu trúc tại Việt Nam.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "the two — Wedding marketplace, made clear", template: "%s · the two" },
  description,
  icons: { icon: "/the-two-monogram.png", shortcut: "/the-two-monogram.png" },
  openGraph: { siteName: "the two", locale: "vi_VN", type: "website", title: "the two — Wedding marketplace, made clear", description, images: ["/og-the-two.png"] },
  twitter: { card: "summary_large_image", title: "the two — Wedding marketplace, made clear", description, images: ["/og-the-two.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="vi"><body>{children}</body></html>;
}
