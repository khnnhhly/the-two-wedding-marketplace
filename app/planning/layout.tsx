import type { Metadata } from "next";

export const metadata: Metadata = { title: "Lên kế hoạch cưới trong 3 bước", description: "Trả lời 3 bước ngắn để biết nên tìm vendor nào trước, theo địa điểm, thời gian, số khách và ngân sách.", alternates: { canonical: "/planning" } };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
