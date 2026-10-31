"use client";

import { daysUntil, dueDate, shortDate, type Task, updateWorkspace, type Workspace } from "./store";

export function toggleTask(task: Task) {
  updateWorkspace(current => ({
    ...current,
    tasks: current.tasks.map(item => item.id === task.id ? { ...item, done: !item.done, doneAt: item.done ? undefined : new Date().toISOString() } : item),
  }), task.done ? `Mở lại: ${task.title}` : `Hoàn thành: ${task.title}`);
}

function dueLabel(task: Task, workspace: Workspace) {
  const due = dueDate(task, workspace.project);
  if (!due) return { text: workspace.project.dateUndecided ? "Chờ chốt ngày cưới" : "Không có hạn", tone: "muted" };
  const left = daysUntil(due);
  if (task.done) return { text: `Hạn ${shortDate(due)}`, tone: "muted" };
  if (left < 0) return { text: `Quá hạn ${-left} ngày`, tone: "late" };
  if (left === 0) return { text: "Hạn hôm nay", tone: "soon" };
  if (left <= 14) return { text: `Còn ${left} ngày`, tone: "soon" };
  return { text: `Hạn ${shortDate(due)}`, tone: "muted" };
}

export function TaskRow({ task, workspace, onDelete }: { task: Task; workspace: Workspace; onDelete?: () => void }) {
  const due = dueLabel(task, workspace);
  return <li className={`ws-task${task.done ? " done" : ""}`}>
    <label>
      <input type="checkbox" checked={task.done} onChange={() => toggleTask(task)}/>
      <span><b>{task.title}</b><small>{task.category}{task.priority === "high" && <em className="ws-chip high">Ưu tiên</em>}</small></span>
    </label>
    <span className={`ws-due ${due.tone}`}>{due.text}</span>
    {onDelete && <button className="ws-icon-btn" aria-label={`Xoá việc ${task.title}`} onClick={onDelete}>×</button>}
  </li>;
}
