"use client";

/* eslint-disable @next/next/no-html-link-for-pages */

import { useState } from "react";
import { useShortlist } from "../components/Shortlist";
import { categoryMeta, recommendedCategories } from "../data/discovery";
import { findVendor, vendorPrice, vendors } from "../data/marketplace";
import { trackVendor, type TrackedVendor, updateWorkspace, type VendorStage, vendorStages, vnd, type Workspace } from "./store";

const stageLabel = (stage: VendorStage) => vendorStages.find(item => item.id === stage)?.label ?? stage;

function VendorRow({ item }: { item: TrackedVendor }) {
  const vendor = findVendor(item.slug);
  const { has, toggle } = useShortlist();
  const [note, setNote] = useState(item.note ?? "");
  const [quote, setQuote] = useState(item.quote ? String(item.quote / 1_000_000) : "");
  if (!vendor) return null;

  function setStage(stage: VendorStage) {
    trackVendor(item.slug, { stage }, `${vendor!.name}: ${stageLabel(stage)}`);
  }

  function saveQuote() {
    const value = Math.max(0, Math.round(Number(quote || 0) * 1_000_000));
    if (value !== (item.quote ?? 0)) trackVendor(item.slug, { quote: value || undefined }, `${vendor!.name}: báo giá ${vnd(value)}`);
  }

  function remove() {
    updateWorkspace(current => ({ ...current, vendors: current.vendors.filter(entry => entry.slug !== item.slug) }), `Bỏ theo dõi ${vendor!.name}`);
    if (has(item.slug)) toggle(item.slug);
  }

  const showQuote = item.stage === "quoted" || item.stage === "booked";
  return <article className={`ws-vendor stage-${item.stage}`}>
    <div className="ws-vendor-main">
      <a href={`/vendors/${vendor.slug}`} className={`ws-vendor-mark ${vendor.color}`} aria-hidden="true">{vendor.name.slice(0, 1)}</a>
      <div><small>{vendor.category}</small><h3><a href={`/vendors/${vendor.slug}`}>{vendor.name}</a></h3><span>{vendor.location} · {vendorPrice(vendor)}</span>{item.leadId && <span className="ws-muted">Mã brief: {item.leadId}</span>}</div>
    </div>
    <div className="ws-vendor-controls">
      <label><span>Trạng thái</span><select value={item.stage} onChange={event => setStage(event.target.value as VendorStage)}>{vendorStages.map(stage => <option key={stage.id} value={stage.id}>{stage.label}</option>)}</select></label>
      {showQuote && <label><span>Báo giá (triệu)</span><input type="number" inputMode="decimal" min={0} step={0.5} value={quote} onChange={event => setQuote(event.target.value)} onBlur={saveQuote} onKeyDown={event => { if (event.key === "Enter") (event.target as HTMLInputElement).blur(); }} placeholder="18"/></label>}
      <label className="grow"><span>Ghi chú</span><input value={note} onChange={event => setNote(event.target.value)} onBlur={() => { if (note !== (item.note ?? "")) trackVendor(item.slug, { note: note.trim() || undefined }); }} placeholder="Lịch hẹn, điều kiện, câu hỏi…"/></label>
    </div>
    <div className="ws-vendor-actions">
      {item.stage === "saved" && <a className="primary-market-btn" href={`/go/${vendor.slug}?channel=inquiry&pos=workspace`}>Gửi brief →</a>}
      {item.stage === "contacted" && <button className="outline-market-btn" onClick={() => setStage("quoted")}>Đã nhận báo giá</button>}
      {item.stage === "quoted" && <button className="primary-market-btn orange" onClick={() => setStage("booked")}>Chốt vendor này</button>}
      <button className="text-action" onClick={remove}>Bỏ theo dõi</button>
    </div>
  </article>;
}

export function VendorsTab({ workspace }: { workspace: Workspace }) {
  const [adding, setAdding] = useState("");
  const tracked = workspace.vendors;
  const trackedSlugs = new Set(tracked.map(item => item.slug));
  const categories = recommendedCategories(workspace.project);
  const order = vendorStages.map(stage => stage.id);
  const sorted = [...tracked].sort((a, b) => order.indexOf(a.stage) - order.indexOf(b.stage));

  function add() {
    if (!adding) return;
    const vendor = findVendor(adding);
    trackVendor(adding, { stage: "saved" }, `Theo dõi ${vendor?.name ?? adding}`);
    setAdding("");
  }

  return <>
    <header className="ws-head"><div><p className="eyebrow">VENDOR</p><h1>{tracked.filter(item => item.stage === "booked").length} vendor đã chốt</h1><p>Cập nhật trạng thái mỗi khi có tiến triển. Báo giá của vendor “Đã chốt” được cộng vào ngân sách.</p></div></header>

    <section className="ws-panel">
      <div className="ws-panel-head"><h2>Category cần chốt</h2></div>
      <div className="ws-coverage">{categories.map(name => {
        const inCategory = tracked.filter(item => findVendor(item.slug)?.category === name);
        const booked = inCategory.find(item => item.stage === "booked");
        return <div key={name} className={booked ? "done" : ""}><i>{categoryMeta(name).icon}</i><span><b>{name}</b><small>{booked ? `Đã chốt ${findVendor(booked.slug)?.name}` : inCategory.length ? `${inCategory.length} vendor đang theo dõi` : "Chưa có vendor"}</small></span>{!booked && <a href={`/vendors?category=${encodeURIComponent(name)}&recommended=1`}>Tìm →</a>}</div>;
      })}</div>
    </section>

    <section className="ws-panel">
      <div className="ws-panel-head"><h2>Đang theo dõi ({tracked.length})</h2>
        <div className="ws-inline-add"><label><span className="sr-only">Thêm vendor</span><select value={adding} onChange={event => setAdding(event.target.value)}><option value="">+ Thêm vendor từ marketplace</option>{vendors.filter(vendor => !trackedSlugs.has(vendor.slug)).map(vendor => <option key={vendor.slug} value={vendor.slug}>{vendor.name} · {vendor.category}</option>)}</select></label><button className="outline-market-btn" disabled={!adding} onClick={add}>Thêm</button></div>
      </div>
      {sorted.length ? <div className="ws-vendor-list">{sorted.map(item => <VendorRow key={item.slug} item={item}/>)}</div>
        : <div className="ws-empty-box"><p>Chưa theo dõi vendor nào. Bấm ♡ trên marketplace hoặc gửi brief — vendor sẽ tự xuất hiện ở đây.</p><a className="primary-market-btn" href="/vendors?recommended=1">Khám phá vendor →</a></div>}
    </section>
  </>;
}
