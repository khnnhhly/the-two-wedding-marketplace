 
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicPage } from "../../components/MarketplaceChrome";
import { templates } from "../../data/marketplace";
import { loginPath } from "../../lib/site";

export function generateStaticParams() {
  return templates.map(item => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const item = templates.find(template => template.slug === slug);
  return item ? { title: `${item.name} — ${item.meta}`, description: item.description } : { title: "Không tìm thấy template" };
}

export default async function TemplateDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = templates.find(template => template.slug === slug);
  if (!item) notFound();
  return <PublicPage className="template-detail-page"><section className="market-shell template-detail-hero"><div className={`template-detail-cover ${item.tone}`}><span>THE TWO · PLANNING TOOL</span><h2>{item.name}</h2><div className="product-sheet"><i/><i/><i/><i/></div></div><div><p className="eyebrow">{item.meta.toUpperCase()}</p><h1>{item.name}</h1><p>{item.description}</p><strong>{item.price}</strong><a className="primary-market-btn orange" href={loginPath(`/workspace?tab=guidebook&pack=${item.packId}`)}>Mở trong Workspace →</a><small>Workspace sẽ cho bạn xem và xác nhận trước khi thêm đầu việc.</small></div></section><section className="market-shell template-detail-body"><article><p className="eyebrow">BẠN SẼ NHẬN ĐƯỢC</p><h2>Kết quả rõ hơn, không thêm việc thừa</h2>{item.outcomes.map(outcome => <div className="outcome" key={outcome}><b>✓</b><span>{outcome}</span></div>)}</article><article><p className="eyebrow">BÊN TRONG TEMPLATE</p><h2>Cấu trúc chính</h2><ol className="number-flow">{item.sections.map((section, index) => <li key={section}><b>{String(index + 1).padStart(2, "0")}</b><span>{section}</span></li>)}</ol></article></section></PublicPage>;
}
