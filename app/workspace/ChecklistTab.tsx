"use client";

import { FormEvent, useState } from "react";
import { serviceCategories } from "../data/discovery";
import { isOverdue, progress, sortTasks, type Task, uid, updateWorkspace, type Workspace } from "./store";
import { TaskRow } from "./TaskRow";

type Filter = "todo" | "overdue" | "done" | "all";

const filters: { id: Filter; label: string }[] = [
  { id: "todo", label: "Cần làm" },
  { id: "overdue", label: "Quá hạn" },
  { id: "done", label: "Đã xong" },
  { id: "all", label: "Tất cả" },
];

const extraCategories = ["Thông tin cơ bản", "Khách mời", "Ngân sách", "Chương trình cưới", "Giấy tờ & nghi lễ", "Khác"];

export function ChecklistTab({ workspace }: { workspace: Workspace }) {
  const [filter, setFilter] = useState<Filter>("todo");
  const [category, setCategory] = useState("Tất cả");
  const [draft, setDraft] = useState({ title: "", category: "Khác", due: "", priority: false });
  const [error, setError] = useState("");
  const [removed, setRemoved] = useState<{ task: Task; index: number } | null>(null);
  const stats = progress(workspace);
  const categories = ["Tất cả", ...new Set(workspace.tasks.map(task => task.category))];

  const visible = sortTasks(workspace.tasks, workspace.project).filter(task => {
    if (category !== "Tất cả" && task.category !== category) return false;
    if (filter === "todo") return !task.done;
    if (filter === "done") return task.done;
    if (filter === "overdue") return isOverdue(task, workspace.project);
    return true;
  });

  function add(event: FormEvent) {
    event.preventDefault();
    const title = draft.title.trim();
    if (title.length < 3) { setError("Tên việc cần ít nhất 3 ký tự."); return; }
    if (workspace.tasks.some(task => task.title.toLowerCase() === title.toLowerCase())) { setError("Việc này đã có trong checklist."); return; }
    const task: Task = { id: uid(), title, category: draft.category, priority: draft.priority ? "high" : "normal", due: draft.due || undefined, done: false, source: "custom" };
    updateWorkspace(current => ({ ...current, tasks: [...current.tasks, task] }), `Thêm việc: ${title}`);
    setDraft({ title: "", category: draft.category, due: "", priority: false });
    setError("");
    if (filter === "done") setFilter("todo");
  }

  function remove(task: Task) {
    const index = workspace.tasks.findIndex(item => item.id === task.id);
    updateWorkspace(current => ({ ...current, tasks: current.tasks.filter(item => item.id !== task.id) }), `Xoá việc: ${task.title}`);
    setRemoved({ task, index });
  }

  function undo() {
    if (!removed) return;
    updateWorkspace(current => {
      const tasks = [...current.tasks];
      tasks.splice(Math.min(removed.index, tasks.length), 0, removed.task);
      return { ...current, tasks };
    }, `Khôi phục việc: ${removed.task.title}`);
    setRemoved(null);
  }

  const counts: Record<Filter, number> = {
    todo: workspace.tasks.filter(task => !task.done).length,
    overdue: stats.overdue,
    done: stats.done,
    all: stats.total,
  };

  return <>
    <header className="ws-head"><div><p className="eyebrow">CHECKLIST</p><h1>{stats.done}/{stats.total} việc đã xong</h1><p>Hạn chót được tính lùi từ tháng cưới. Việc tự thêm có thể đặt ngày riêng.</p></div><div className="ws-head-meter"><b>{stats.percent}%</b><div className="ws-meter"><i style={{ width: `${stats.percent}%` }}/></div></div></header>

    <form className="ws-panel ws-add" onSubmit={add}>
      <label className="grow"><span>Việc cần làm</span><input value={draft.title} onChange={event => { setDraft({ ...draft, title: event.target.value }); setError(""); }} placeholder="Ví dụ: Đặt lịch thử váy lần 2"/></label>
      <label><span>Nhóm</span><select value={draft.category} onChange={event => setDraft({ ...draft, category: event.target.value })}>{[...serviceCategories.map(item => item.name as string), ...extraCategories].map(name => <option key={name}>{name}</option>)}</select></label>
      <label><span>Hạn <small>tuỳ chọn</small></span><input type="date" value={draft.due} onChange={event => setDraft({ ...draft, due: event.target.value })}/></label>
      <label className="inline-check"><input type="checkbox" checked={draft.priority} onChange={event => setDraft({ ...draft, priority: event.target.checked })}/> Ưu tiên</label>
      <button className="primary-market-btn">Thêm việc</button>
      {error && <p className="field-error" role="alert">{error}</p>}
    </form>

    {removed && <div className="ws-undo" role="status">Đã xoá “{removed.task.title}”. <button onClick={undo}>Hoàn tác</button><button aria-label="Đóng" onClick={() => setRemoved(null)}>×</button></div>}

    <section className="ws-panel">
      <div className="ws-toolbar">
        <div className="ws-segment" role="group" aria-label="Lọc theo trạng thái">{filters.map(item => <button key={item.id} aria-pressed={filter === item.id} className={filter === item.id ? "active" : ""} onClick={() => setFilter(item.id)}>{item.label} <b>{counts[item.id]}</b></button>)}</div>
        <label className="ws-select"><span className="sr-only">Lọc theo nhóm</span><select value={category} onChange={event => setCategory(event.target.value)}>{categories.map(name => <option key={name}>{name}</option>)}</select></label>
      </div>
      {visible.length ? <ul className="ws-tasks">{visible.map(task => <TaskRow key={task.id} task={task} workspace={workspace} onDelete={() => remove(task)}/>)}</ul>
        : <p className="ws-muted">{filter === "overdue" ? "Không có việc quá hạn. Tốt lắm!" : filter === "done" ? "Chưa có việc nào hoàn thành." : "Không có việc nào trong bộ lọc này."}</p>}
    </section>
  </>;
}
