"use client";

import { formatWeddingMonth, recommendedCategories } from "../data/discovery";
import { vendors } from "../data/marketplace";
import type { TabId } from "./page";
import { currentPhase, daysUntil, progress, sortTasks, vendorStages, vnd, weddingDay, type Workspace } from "./store";
import { TaskRow } from "./TaskRow";

export function OverviewTab({ workspace, open }: { workspace: Workspace; open: (tab: TabId) => void }) {
  const { project } = workspace;
  const stats = progress(workspace);
  const wedding = weddingDay(project);
  const left = wedding ? daysUntil(wedding) : null;
  const phase = currentPhase(project);
  const next = sortTasks(workspace.tasks.filter(task => !task.done), project).slice(0, 5);
  const booked = workspace.vendors.filter(vendor => vendor.stage === "booked");
  const active = workspace.vendors.filter(vendor => vendor.stage !== "declined");
  const bookedCategories = new Set(booked.map(item => vendors.find(vendor => vendor.slug === item.slug)?.category));
  const nextCategory = [...new Set(["Địa điểm", ...recommendedCategories(project)])].find(category => !bookedCategories.has(category));

  return <>
    <header className="ws-head"><div><p className="eyebrow">TỔNG QUAN</p><h1>{left === null ? "Chưa chốt ngày cưới" : left > 0 ? `Còn ${left} ngày tới ${formatWeddingMonth(project.date).toLowerCase()}` : "Đã tới tháng cưới!"}</h1><p>{phase ? <><b>{phase.title}</b> — {phase.description}</> : "Chốt tháng cưới trong tab Thông tin cưới để checklist được xếp lịch tự động."}</p></div></header>

    <div className="ws-metrics">
      <button className="ws-metric" onClick={() => open("checklist")}><small>Checklist</small><b>{stats.percent}%</b><span>{stats.done}/{stats.total} việc xong{stats.overdue > 0 && <em className="late"> · {stats.overdue} quá hạn</em>}</span><div className="ws-meter"><i style={{ width: `${stats.percent}%` }}/></div></button>
      <button className="ws-metric" onClick={() => open("budget")}><small>Ngân sách</small><b>{vnd(stats.budget)}</b><span>Đã chi {vnd(stats.spent)} · đã chốt {vnd(stats.committed)}</span><div className="ws-meter"><i className={stats.spent > stats.budget ? "over" : ""} style={{ width: `${Math.min(100, stats.budget ? stats.spent / stats.budget * 100 : 0)}%` }}/></div></button>
      <button className="ws-metric" onClick={() => open("vendors")}><small>Vendor</small><b>{booked.length} đã chốt</b><span>{active.length} đang theo dõi</span><div className="ws-meter"><i style={{ width: `${active.length ? booked.length / active.length * 100 : 0}%` }}/></div></button>
    </div>

    <div className="ws-grid">
      <section className="ws-panel">
        <div className="ws-panel-head"><h2>Việc tiếp theo</h2><button className="text-action" onClick={() => open("checklist")}>Xem tất cả →</button></div>
        {next.length ? <ul className="ws-tasks">{next.map(task => <TaskRow key={task.id} task={task} workspace={workspace}/>)}</ul> : <p className="ws-muted">Tất cả việc đã hoàn thành. Thêm việc mới hoặc áp dụng guidebook.</p>}
      </section>
      <div className="ws-stack">
        {nextCategory && <section className="ws-panel ws-accent"><p className="eyebrow">GỢI Ý BƯỚC TIẾP</p><h2>Chốt vendor {nextCategory}</h2><p>{nextCategory === "Địa điểm" ? "Địa điểm quyết định ngày, sức chứa và gần 40% ngân sách." : "Đây là category ưu tiên chưa có vendor được chốt."}</p><a className="primary-market-btn orange" href={`/vendors?category=${encodeURIComponent(nextCategory)}&recommended=1`}>Tìm {nextCategory} →</a></section>}
        <section className="ws-panel"><div className="ws-panel-head"><h2>Hoạt động gần đây</h2></div><ul className="ws-activity">{workspace.activity.slice(0, 6).map(item => <li key={item.at + item.text}><span>{item.text}</span><time dateTime={item.at}>{new Date(item.at).toLocaleString("vi-VN", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit" })}</time></li>)}</ul></section>
        {active.length > 0 && <section className="ws-panel"><div className="ws-panel-head"><h2>Pipeline vendor</h2></div><div className="ws-pipeline">{vendorStages.filter(stage => stage.id !== "declined").map(stage => <div key={stage.id}><b>{workspace.vendors.filter(vendor => vendor.stage === stage.id).length}</b><span>{stage.label}</span></div>)}</div></section>}
      </div>
    </div>
  </>;
}
