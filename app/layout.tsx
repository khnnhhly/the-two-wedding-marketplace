import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "the-two-wedding-marketplace.maplecow69.chatgpt.site";
  const origin = `${h.get("x-forwarded-proto") ?? "https"}://${host}`;
  return {
    title: "the two — Wedding marketplace, made clear",
    description: "Marketplace hai chiều giúp cặp đôi tìm vendor, so sánh báo giá và lên kế hoạch cưới; giúp vendor onboard và quản lý kinh doanh tại một nơi.",
    icons: { icon: "/the-two-monogram.png", shortcut: "/the-two-monogram.png" },
    openGraph: { title: "the two — Wedding marketplace, made clear", description: "Tìm vendor, so sánh báo giá và quản lý hành trình cưới tại một marketplace rõ ràng.", images: [`${origin}/og-the-two.png`] },
    twitter: { card: "summary_large_image", title: "the two — Wedding marketplace, made clear", description: "Marketplace cho cặp đôi và wedding vendor tại Việt Nam.", images: [`${origin}/og-the-two.png`] },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="vi"><body>{children}</body></html>;
}
