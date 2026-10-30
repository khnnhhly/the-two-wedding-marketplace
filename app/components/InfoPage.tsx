import { PublicPage } from "./MarketplaceChrome";

export function InfoPage({ eyebrow, title, intro, sections }: { eyebrow: string; title: string; intro: string; sections: { title: string; body: string }[] }) {
  return <PublicPage className="info-page"><section className="subpage-hero blue"><div className="market-shell"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{intro}</p></div></section><section className="market-shell info-sections">{sections.map((section, index) => <article key={section.title}><b>{String(index + 1).padStart(2, "0")}</b><div><h2>{section.title}</h2><p>{section.body}</p></div></article>)}</section></PublicPage>;
}
