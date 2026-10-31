 
import { PublicPage } from "./MarketplaceChrome";

export type InfoSection = { title: string; body: string | string[]; links?: { href: string; label: string }[] };

export function InfoPage({ eyebrow, title, intro, sections, updated, note, children }: { eyebrow: string; title: string; intro: string; sections: InfoSection[]; updated?: string; note?: string; children?: React.ReactNode }) {
  return <PublicPage className="info-page"><section className="subpage-hero blue"><div className="market-shell"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{intro}</p>{updated && <p className="updated-line">Cập nhật lần cuối: {updated}</p>}</div></section>
    {children}
    <section className="market-shell info-sections">{sections.map((section, index) => <article key={section.title}><b>{String(index + 1).padStart(2, "0")}</b><div><h2>{section.title}</h2>{Array.isArray(section.body) ? <ul>{section.body.map(item => <li key={item}>{item}</li>)}</ul> : <p>{section.body}</p>}{section.links && <div className="info-links">{section.links.map(link => <a key={link.href} href={link.href}>{link.label} →</a>)}</div>}</div></article>)}</section>
    {note && <section className="market-shell"><p className="legal-note">{note}</p></section>}
  </PublicPage>;
}
