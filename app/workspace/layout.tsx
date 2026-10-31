import type { Metadata } from "next";

export const metadata: Metadata = { title: "Workspace", description: "Checklist, ngân sách và vendor cho đám cưới của hai bạn.", robots: { index: false } };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
