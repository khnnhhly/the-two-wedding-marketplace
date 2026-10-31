"use client";

/* eslint-disable react-hooks/set-state-in-effect, @next/next/no-img-element, @next/next/no-html-link-for-pages */

import { useEffect, useState } from "react";
import { formatWeddingMonth } from "../data/discovery";
import { BudgetTab } from "./BudgetTab";
import { ChecklistTab } from "./ChecklistTab";
import { GuidebookTab } from "./GuidebookTab";
import { OverviewTab } from "./OverviewTab";
import { SettingsTab } from "./SettingsTab";
import { readShortlist } from "../components/Shortlist";
import { progress, rememberPendingPack, trackVendor, useWorkspace, type Workspace } from "./store";
import { VendorsTab } from "./VendorsTab";
import "./workspace.css";

export type TabId = "overview" | "checklist" | "budget" | "vendors" | "guidebook" | "settings";

const tabs: { id: TabId; label: string; icon: string }[] = [
  { id: "overview", label: "Tổng quan", icon: "⌂" },
  { id: "checklist", label: "Checklist", icon: "✓" },
  { id: "budget", label: "Ngân sách", icon: "₫" },
  { id: "vendors", label: "Vendor", icon: "⌖" },
  { id: "guidebook", label: "Guidebook", icon: "▦" },
  { id: "settings", label: "Thông tin cưới", icon: "⚙" },
];

const isTab = (value: string | null): value is TabId => tabs.some(tab => tab.id === value);

export default function WorkspacePage() {
  const workspace = useWorkspace();
  const [tab, setTab] = useState<TabId>("overview");
  const [pack, setPack] = useState<string | null>(null);
  const [welcome, setWelcome] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requested = params.get("tab");
    if (isTab(requested)) setTab(requested);
    setPack(params.get("pack"));
    setWelcome(params.get("welcome") === "1");
  }, []);

  function open(next: TabId) {
    setTab(next);
    const params = new URLSearchParams(window.location.search);
    params.delete("welcome");
    params.delete("pack");
    if (next === "overview") params.delete("tab"); else params.set("tab", next);
    window.history.replaceState({}, "", `/workspace${params.size ? `?${params}` : ""}`);
    window.scrollTo({ top: 0 });
  }

  // Vendors saved with ♡ before the workspace existed join the vendor list.
  const ready = Boolean(workspace);
  useEffect(() => {
    if (!ready) return;
    const tracked = new Set((workspace?.vendors ?? []).map(vendor => vendor.slug));
    readShortlist().filter(slug => !tracked.has(slug)).forEach(slug => trackVendor(slug, {}));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  if (workspace === undefined) return <div className="ws-state"><span>✦</span><p>Đang mở Workspace…</p></div>;
  if (workspace === null) return <EmptyWorkspace pack={pack}/>;

  return <div className="ws">
    <aside className="ws-side">
      <a className="ws-brand" href="/"><img src="/the-two-monogram.png" alt="" width="30" height="32"/><span>the two</span></a>
      <ProjectCard workspace={workspace}/>
      <nav aria-label="Workspace">{tabs.map(item => <button key={item.id} className={tab === item.id ? "active" : ""} aria-current={tab === item.id ? "page" : undefined} onClick={() => open(item.id)}><i aria-hidden="true">{item.icon}</i>{item.label}{item.id === "checklist" && <Badge workspace={workspace}/>}</button>)}</nav>
      <div className="ws-side-links"><a href="/vendors">← Marketplace</a><a href="/planning">Làm lại 3 bước</a></div>
    </aside>
    <main className="ws-main" id="main">
      {welcome && <div className="ws-banner" role="status"><b>Workspace đã sẵn sàng.</b> Checklist đã được xếp lịch theo ngày cưới và ngân sách đã chia theo hạng mục. Bắt đầu với việc đầu tiên bên dưới.<button aria-label="Đóng thông báo" onClick={() => setWelcome(false)}>×</button></div>}
      {tab === "overview" && <OverviewTab workspace={workspace} open={open}/>}
      {tab === "checklist" && <ChecklistTab workspace={workspace}/>}
      {tab === "budget" && <BudgetTab workspace={workspace}/>}
      {tab === "vendors" && <VendorsTab workspace={workspace}/>}
      {tab === "guidebook" && <GuidebookTab workspace={workspace} highlight={pack}/>}
      {tab === "settings" && <SettingsTab workspace={workspace}/>}
    </main>
  </div>;
}

function ProjectCard({ workspace }: { workspace: Workspace }) {
  const { project } = workspace;
  const stats = progress(workspace);
  return <div className="ws-project">
    <small>ĐÁM CƯỚI CỦA HAI BẠN</small>
    <strong>{project.location}</strong>
    <span>{project.dateUndecided ? "Chưa chốt ngày" : formatWeddingMonth(project.date)} · {project.guests} khách</span>
    <div className="ws-meter" role="progressbar" aria-valuenow={stats.percent} aria-valuemin={0} aria-valuemax={100} aria-label="Tiến độ checklist"><i style={{ width: `${stats.percent}%` }}/></div>
    <span>{stats.percent}% checklist hoàn tất</span>
  </div>;
}

function Badge({ workspace }: { workspace: Workspace }) {
  const { overdue } = progress(workspace);
  return overdue > 0 ? <b className="ws-badge" title={`${overdue} việc quá hạn`}>{overdue}</b> : null;
}

function EmptyWorkspace({ pack }: { pack: string | null }) {
  useEffect(() => { if (pack) rememberPendingPack(pack); }, [pack]);
  return <div className="ws-state ws-empty">
    <a className="ws-brand" href="/"><img src="/the-two-monogram.png" alt="" width="30" height="32"/><span>the two</span></a>
    <h1>Workspace của hai bạn chưa được tạo.</h1>
    <p>Trả lời 3 bước ngắn (giai đoạn, địa điểm, tháng cưới, số khách, ngân sách). the two sẽ tạo checklist có hạn chót, chia ngân sách và gợi ý vendor theo đúng thứ tự.</p>
    <a className="primary-market-btn orange" href="/planning">Tạo Workspace trong 3 bước →</a>
    {pack && <small>Template bạn chọn sẽ có sẵn trong tab Guidebook sau khi tạo Workspace.</small>}
    <a className="text-action" href="/vendors">Hoặc tiếp tục xem vendor</a>
  </div>;
}
