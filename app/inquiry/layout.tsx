import type { Metadata } from "next";

export const metadata: Metadata = { title: "Gửi brief cho vendor", description: "Gửi brief cưới miễn phí, không cần tài khoản. Vendor kiểm tra lịch và báo giá.", alternates: { canonical: "/inquiry" } };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
