import type { Metadata } from "next";

export const metadata: Metadata = { title: "Shortlist & so sánh vendor", description: "So sánh vendor đã lưu theo giá, gói, khu vực và thông tin xác minh.", alternates: { canonical: "/shortlist" } };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
