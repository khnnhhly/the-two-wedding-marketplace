"use client";

import { useState } from "react";
import { guidebookPacks } from "../data/guidebook";
import { applyPack, type Workspace } from "./store";

export function GuidebookTab({ workspace, highlight }: { workspace: Workspace; highlight: string | null }) {
  const [openId, setOpenId] = useState<string | null>(highlight);
  const [message, setMessage] = useState("");
  const titles = new Set(workspace.tasks.map(task => task.title.toLowerCase()));

  function apply(packId: string, title: string) {
    const added = applyPack(packId);
    setMessage(added ? `Đã thêm ${added} việc từ “${title}” vào checklist.` : `Mọi việc trong “${title}” đã có sẵn trong checklist.`);
  }

  return <>
    <header className="ws-head"><div><p className="eyebrow">GUIDEBOOK</p><h1>Thêm checklist chuyên sâu</h1><p>Mỗi bộ được xếp lịch theo ngày cưới. Việc trùng tên với checklist hiện tại sẽ được bỏ qua.</p></div></header>
    {message && <div className="ws-undo" role="status">{message}<button aria-label="Đóng" onClick={() => setMessage("")}>×</button></div>}
    <div className="ws-packs">{guidebookPacks.map(pack => {
      const missing = pack.tasks.filter(task => !titles.has(task.title.toLowerCase())).length;
      const applied = workspace.packs.includes(pack.id) && missing === 0;
      const expanded = openId === pack.id;
      return <article key={pack.id} className={`ws-pack ${pack.color}${highlight === pack.id ? " highlight" : ""}`}>
        <small>{pack.eyebrow}</small>
        <h2>{pack.title}</h2>
        <p>{pack.description}</p>
        <span className="ws-muted">{pack.tasks.length} việc · {applied ? "đã có trong checklist" : `${missing} việc mới`}</span>
        <div className="ws-pack-actions">
          <button className={applied ? "outline-market-btn" : "primary-market-btn"} disabled={applied} onClick={() => apply(pack.id, pack.title)}>{applied ? "✓ Đã thêm" : "Thêm vào checklist"}</button>
          <button className="text-action" aria-expanded={expanded} onClick={() => setOpenId(expanded ? null : pack.id)}>{expanded ? "Ẩn danh sách" : "Xem danh sách"}</button>
        </div>
        {expanded && <ul className="ws-pack-list">{pack.tasks.map(task => <li key={task.title} className={titles.has(task.title.toLowerCase()) ? "have" : ""}>{titles.has(task.title.toLowerCase()) ? "✓" : "+"} {task.title}{task.daysBeforeWedding != null && <small> · trước {task.daysBeforeWedding} ngày</small>}</li>)}</ul>}
      </article>;
    })}</div>
  </>;
}
