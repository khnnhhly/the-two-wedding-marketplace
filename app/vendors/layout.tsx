import type { Metadata } from "next";

export const metadata: Metadata = { title: "Vendor cưới đã xét duyệt", description: "Tìm venue, photographer, trang trí, makeup và vendor cưới đã xét duyệt tại Hà Nội, TP.HCM; lọc theo khu vực, giá và gửi brief miễn phí.", alternates: { canonical: "/vendors" } };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
