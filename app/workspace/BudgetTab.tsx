"use client";

import { FormEvent, useState } from "react";
import { vendors } from "../data/marketplace";
import { type BudgetLine, budgetLineFor, progress, uid, updateWorkspace, vnd, type Workspace } from "./store";

const toMillion = (value: number) => value ? String(Math.round(value / 100_000) / 10) : "";
const fromMillion = (value: string) => Math.max(0, Math.round(Number(value || 0) * 1_000_000));

function MoneyInput({ value, label, onCommit }: { value: number; label: string; onCommit: (value: number) => void }) {
  const [text, setText] = useState(toMillion(value));
  const [focused, setFocused] = useState(false);
  const shown = focused ? text : toMillion(value);
  return <label className="ws-money"><span className="sr-only">{label}</span><input type="number" inputMode="decimal" min={0} step={0.5} value={shown}
    onFocus={() => { setText(toMillion(value)); setFocused(true); }}
    onChange={event => setText(event.target.value)}
    onBlur={() => { setFocused(false); const next = fromMillion(text); if (next !== value) onCommit(next); }}
    onKeyDown={event => { if (event.key === "Enter") (event.target as HTMLInputElement).blur(); }}/><em>tr</em></label>;
}

export function BudgetTab({ workspace }: { workspace: Workspace }) {
  const stats = progress(workspace);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const remaining = stats.budget - stats.planned;

  // Booked vendor quotes count against the matching budget line.
  const committedBy = (line: BudgetLine) => workspace.vendors
    .filter(item => item.stage === "booked" && item.quote)
    .filter(item => budgetLineFor(vendors.find(vendor => vendor.slug === item.slug)?.category ?? "") === line.name)
    .reduce((sum, item) => sum + (item.quote ?? 0), 0);

  function setLine(line: BudgetLine, patch: Partial<BudgetLine>, label: string) {
    updateWorkspace(current => ({ ...current, budget: current.budget.map(item => item.id === line.id ? { ...item, ...patch } : item) }), label);
  }

  function add(event: FormEvent) {
    event.preventDefault();
    const value = name.trim();
    if (value.length < 2) { setError("Nhập tên hạng mục."); return; }
    if (workspace.budget.some(line => line.name.toLowerCase() === value.toLowerCase())) { setError("Hạng mục đã tồn tại."); return; }
    updateWorkspace(current => ({ ...current, budget: [...current.budget, { id: uid(), name: value, planned: 0, spent: 0 }] }), `Thêm hạng mục ngân sách: ${value}`);
    setName("");
    setError("");
  }

  function remove(line: BudgetLine) {
    if ((line.planned || line.spent) && !window.confirm(`Xoá hạng mục “${line.name}” (${vnd(line.planned)} dự kiến)?`)) return;
    updateWorkspace(current => ({ ...current, budget: current.budget.filter(item => item.id !== line.id) }), `Xoá hạng mục ngân sách: ${line.name}`);
  }

  return <>
    <header className="ws-head"><div><p className="eyebrow">NGÂN SÁCH</p><h1>{vnd(stats.budget)}</h1><p>Nhập số tiền theo <b>triệu đồng</b> (ví dụ 12.5). Thay đổi được lưu khi bạn rời ô nhập.</p></div></header>

    <div className="ws-metrics">
      <div className="ws-metric"><small>Đã phân bổ</small><b>{vnd(stats.planned)}</b><span className={remaining < 0 ? "late" : ""}>{remaining >= 0 ? `Còn ${vnd(remaining)} chưa phân bổ` : `Vượt ngân sách ${vnd(-remaining)}`}</span></div>
      <div className="ws-metric"><small>Đã chốt với vendor</small><b>{vnd(stats.committed)}</b><span>Từ báo giá vendor “Đã chốt”</span></div>
      <div className="ws-metric"><small>Đã chi</small><b>{vnd(stats.spent)}</b><span className={stats.spent > stats.budget ? "late" : ""}>{stats.budget ? Math.round(stats.spent / stats.budget * 100) : 0}% tổng ngân sách</span><div className="ws-meter"><i className={stats.spent > stats.budget ? "over" : ""} style={{ width: `${Math.min(100, stats.budget ? stats.spent / stats.budget * 100 : 0)}%` }}/></div></div>
    </div>

    <section className="ws-panel">
      <div className="ws-budget-table" role="table" aria-label="Ngân sách theo hạng mục">
        <div className="ws-budget-row head" role="row"><span role="columnheader">Hạng mục</span><span role="columnheader">Dự kiến</span><span role="columnheader">Đã chốt</span><span role="columnheader">Đã chi</span><span role="columnheader">Tiến độ</span><span/></div>
        {workspace.budget.map(line => {
          const committed = committedBy(line);
          const base = Math.max(line.planned, 1);
          const over = line.spent > line.planned || committed > line.planned;
          return <div className={`ws-budget-row${over ? " over" : ""}`} role="row" key={line.id}>
            <span role="cell"><b>{line.name}</b>{over && <small className="late">Vượt dự kiến</small>}</span>
            <span role="cell"><MoneyInput value={line.planned} label={`Dự kiến ${line.name}`} onCommit={value => setLine(line, { planned: value }, `Cập nhật dự kiến ${line.name}: ${vnd(value)}`)}/></span>
            <span role="cell" className="ws-num">{committed ? vnd(committed) : "—"}</span>
            <span role="cell"><MoneyInput value={line.spent} label={`Đã chi ${line.name}`} onCommit={value => setLine(line, { spent: value }, `Ghi chi ${line.name}: ${vnd(value)}`)}/></span>
            <span role="cell"><div className="ws-meter"><i className={over ? "over" : ""} style={{ width: `${Math.min(100, line.spent / base * 100)}%` }}/></div></span>
            <span role="cell"><button className="ws-icon-btn" aria-label={`Xoá hạng mục ${line.name}`} onClick={() => remove(line)}>×</button></span>
          </div>;
        })}
      </div>
      <form className="ws-add compact" onSubmit={add}><label className="grow"><span className="sr-only">Hạng mục mới</span><input value={name} onChange={event => { setName(event.target.value); setError(""); }} placeholder="Thêm hạng mục, ví dụ: Lễ ăn hỏi"/></label><button className="outline-market-btn">+ Thêm hạng mục</button>{error && <p className="field-error" role="alert">{error}</p>}</form>
    </section>
  </>;
}
