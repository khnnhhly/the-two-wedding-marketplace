import type { Metadata, Viewport } from "next";
import { Mrs_Saint_Delafield, Mulish, Old_Standard_TT } from "next/font/google";
import { SITE_URL } from "./lib/site";
import "./globals.css";
import "./brand-fixes.css";
import "./flows.css";
import "./fixes.css";

// Self-hosted at build time: no request to Google at runtime, preloaded, no layout shift.
const body = Mulish({ subsets: ["latin", "vietnamese"], variable: "--font-body", display: "swap" });
const heading = Old_Standard_TT({ subsets: ["latin", "vietnamese"], weight: "400", variable: "--font-heading", display: "swap" });
// Italic is only used for headline accents: load it after the critical fonts.
const headingItalic = Old_Standard_TT({ subsets: ["latin", "vietnamese"], weight: "400", style: "italic", variable: "--font-heading-italic", display: "swap", preload: false });
// Script face has no Vietnamese glyphs: use it only for Latin text (wordmark, English taglines).
const title = Mrs_Saint_Delafield({ subsets: ["latin"], weight: "400", variable: "--font-title", display: "swap" });

const description = "Marketplace giúp cặp đôi tìm vendor cưới đã xét duyệt, so sánh và gửi brief miễn phí; giúp vendor nhận lead có cấu trúc tại Việt Nam.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "the two — Wedding marketplace, made clear", template: "%s · the two" },
  description,
  icons: { icon: "/the-two-monogram.png", apple: "/the-two-monogram.png" },
  openGraph: { siteName: "the two", locale: "vi_VN", type: "website", title: "the two — Wedding marketplace, made clear", description },
  twitter: { card: "summary_large_image", title: "the two — Wedding marketplace, made clear", description },
};

export const viewport: Viewport = { themeColor: "#8e0413" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="vi" className={`${body.variable} ${heading.variable} ${headingItalic.variable} ${title.variable}`}><body>{children}</body></html>;
}
