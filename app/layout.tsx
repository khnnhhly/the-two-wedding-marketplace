import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nắng — Lên kế hoạch cưới cùng AI",
  description: "Từ ý tưởng đầu tiên đến ngày trọng đại — lên kế hoạch cưới, quản lý ngân sách và khám phá vendor cùng Nắng.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  openGraph: { title: "Nắng — Đám cưới trong mơ, kế hoạch trong tầm tay", description: "Nền tảng lên kế hoạch cưới thông minh dành cho các cặp đôi Việt Nam.", images: ["/og.png"] },
  twitter: { card: "summary_large_image", title: "Nắng — Lên kế hoạch cưới cùng AI", description: "Đám cưới trong mơ, kế hoạch trong tầm tay.", images: ["/og.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="vi"><body>{children}</body></html>;
}
