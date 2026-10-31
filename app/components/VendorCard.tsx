 
import { type VendorProfile, vendorPrice } from "../data/marketplace";
import { ShortlistButton } from "./Shortlist";

export function VendorCard({ vendor, cta = "Xem hồ sơ →" }: { vendor: VendorProfile; cta?: string }) {
  return <article className="market-vendor-card">
    <a href={`/vendors/${vendor.slug}`} className={`market-vendor-image ${vendor.color}`}><span>✓ ĐÃ XÁC MINH</span><b>{vendor.name.slice(0, 1)}</b><div className="vendor-pattern"/></a>
    <ShortlistButton slug={vendor.slug} name={vendor.name}/>
    <div className="market-vendor-body"><small>{vendor.category.toUpperCase()}</small><h3><a href={`/vendors/${vendor.slug}`}>{vendor.name}</a></h3><p>{vendor.description}</p><div className="vendor-meta"><span>⌖ {vendor.location}</span><em>{vendor.tag}</em></div><div className="vendor-card-bottom"><strong>{vendorPrice(vendor)}</strong><a href={`/vendors/${vendor.slug}`}>{cta}</a></div></div>
  </article>;
}
