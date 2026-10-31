import type { Metadata } from "next";

export const metadata: Metadata = { title: "Đăng ký vendor", description: "Gửi hồ sơ mở gian hàng trên the two — miễn phí trong giai đoạn đầu.", alternates: { canonical: "/vendor-apply" } };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
