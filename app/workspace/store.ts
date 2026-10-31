"use client";

import { useSyncExternalStore } from "react";
import { guidebookPacks } from "../data/guidebook";
import { categoryMeta, type DiscoveryProfile, recommendedCategories } from "../data/discovery";

export type Task = {
  id: string;
  title: string;
  category: string;
  priority: "high" | "normal";
  /** Template tasks are scheduled relative to the wedding date. */
  daysBefore?: number;
  /** Custom tasks may carry an explicit date (YYYY-MM-DD). */
  due?: string;
  done: boolean;
  doneAt?: string;
  source: string;
};

export type BudgetLine = { id: string; name: string; planned: number; spent: number };

export type VendorStage = "saved" | "contacted" | "quoted" | "booked" | "declined";

export type TrackedVendor = { slug: string; stage: VendorStage; quote?: number; note?: string; leadId?: string; updatedAt: string };

export type Project = {
  location: string;
  date: string;
  dateUndecided: boolean;
  guests: number;
  /** Million VND. */
  budget: number;
  style: string;
  stage: DiscoveryProfile["stage"];
  priorities: string[];
  createdAt: string;
  /** When the current wedding date was set; template deadlines are compressed to fit from here. */
  scheduleStart?: string;
};

export type Activity = { at: string; text: string };

export type Workspace = {
  version: 1;
  project: Project;
  tasks: Task[];
  budget: BudgetLine[];
  vendors: TrackedVendor[];
  packs: string[];
  activity: Activity[];
};

export const vendorStages: { id: VendorStage; label: string }[] = [
  { id: "saved", label: "Đã lưu" },
  { id: "contacted", label: "Đã gửi brief" },
  { id: "quoted", label: "Đã nhận báo giá" },
  { id: "booked", label: "Đã chốt" },
  { id: "declined", label: "Không chọn" },
];

const KEY = "the-two-workspace";
const EVENT = "the-two-workspace-change";

export const uid = () => (typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`).slice(0, 12);

let cacheRaw: string | null = null;
let cache: Workspace | null = null;

function snapshot(): Workspace | null {
  let raw: string | null = null;
  try { raw = localStorage.getItem(KEY); } catch { /* storage blocked */ }
  if (raw !== cacheRaw) {
    cacheRaw = raw;
    try { cache = raw ? JSON.parse(raw) as Workspace : null; } catch { cache = null; }
  }
  return cache;
}

function subscribe(callback: () => void) {
  window.addEventListener(EVENT, callback);
  window.addEventListener("storage", callback);
  return () => { window.removeEventListener(EVENT, callback); window.removeEventListener("storage", callback); };
}

function write(next: Workspace | null) {
  try {
    if (next) localStorage.setItem(KEY, JSON.stringify(next));
    else localStorage.removeItem(KEY);
  } catch { /* storage blocked */ }
  window.dispatchEvent(new Event(EVENT));
}

/** `undefined` while hydrating on the client, `null` when no workspace exists yet. */
export function useWorkspace() {
  return useSyncExternalStore(subscribe, snapshot, () => undefined);
}

/** Apply a change and append it to the activity log. */
export function updateWorkspace(change: (current: Workspace) => Workspace, activity?: string) {
  const current = snapshot();
  if (!current) return;
  const next = change(current);
  if (activity) next.activity = [{ at: new Date().toISOString(), text: activity }, ...next.activity].slice(0, 40);
  write(next);
}

export function resetWorkspace() {
  write(null);
}

export const hasWorkspace = () => snapshot() !== null;

/** Default split from the budget blueprint, mapped to marketplace categories where possible. */
const budgetSplit: [string, number][] = [
  ["Địa điểm & tiệc", 38], ["Trang trí", 10], ["Photo & Film", 8], ["Trang phục", 8], ["Wedding Planner", 7],
  ["Makeup", 5], ["Thiệp & Quà", 5], ["Giải trí", 3], ["Nhẫn & sính lễ", 8], ["Di chuyển & khác", 3], ["Dự phòng", 5],
];

/** Budget line that a marketplace category's bookings count against. */
export function budgetLineFor(category: string) {
  return category === "Địa điểm" ? "Địa điểm & tiệc" : category;
}

function packTasks(packId: string): Task[] {
  const pack = guidebookPacks.find(item => item.id === packId);
  return (pack?.tasks ?? []).map(task => ({ id: uid(), title: task.title, category: task.category, priority: task.priority === "high" ? "high" : "normal", daysBefore: task.daysBeforeWedding, done: false, source: packId }));
}

export function projectFromProfile(profile: DiscoveryProfile): Project {
  return {
    location: profile.location.trim(),
    date: profile.dateUndecided ? "" : profile.date,
    dateUndecided: profile.dateUndecided,
    guests: Number(profile.guests),
    budget: Number(profile.budget),
    style: profile.style.trim(),
    stage: profile.stage,
    priorities: profile.priorities,
    createdAt: new Date().toISOString(),
    scheduleStart: new Date().toISOString(),
  };
}

/** Keep the original schedule start unless the wedding date itself changed. */
export function mergeProject(current: Project, profile: DiscoveryProfile): Project {
  const next = projectFromProfile(profile);
  const sameDate = next.date === current.date && next.dateUndecided === current.dateUndecided;
  return { ...next, createdAt: current.createdAt, scheduleStart: sameDate ? current.scheduleStart ?? current.createdAt : next.scheduleStart };
}

/** Build a ready-to-use workspace from completed discovery answers. */
export function createWorkspace(profile: DiscoveryProfile) {
  const project = projectFromProfile(profile);
  const categoryTasks: Task[] = recommendedCategories(profile).map(name => ({
    id: uid(), title: `Gửi brief và chọn vendor ${name}`, category: name, priority: "high", daysBefore: categoryMeta(name).leadDays, done: false, source: "discovery",
  }));
  const total = project.budget * 1_000_000;
  const workspace: Workspace = {
    version: 1,
    project,
    tasks: [...categoryTasks, ...packTasks("master-timeline")],
    budget: budgetSplit.map(([name, percent]) => ({ id: uid(), name, planned: Math.round(total * percent / 100 / 100_000) * 100_000, spent: 0 })),
    vendors: [],
    packs: ["master-timeline"],
    activity: [{ at: new Date().toISOString(), text: "Tạo Workspace từ câu trả lời 3 bước" }],
  };
  write(workspace);
  // A template picked before the workspace existed is applied right away.
  try {
    const pending = localStorage.getItem(PENDING_PACK_KEY);
    if (pending) { localStorage.removeItem(PENDING_PACK_KEY); applyPack(pending); }
  } catch { /* storage blocked */ }
  return workspace;
}

export const PENDING_PACK_KEY = "the-two-pending-pack";

export function rememberPendingPack(packId: string) {
  if (!guidebookPacks.some(pack => pack.id === packId)) return;
  try { localStorage.setItem(PENDING_PACK_KEY, packId); } catch { /* storage blocked */ }
}

/** Re-apply discovery answers to an existing workspace without losing progress. */
export function updateProjectFromProfile(profile: DiscoveryProfile) {
  updateWorkspace(current => ({ ...current, project: mergeProject(current.project, profile) }), "Cập nhật thông tin cưới");
}

/** Adds a guidebook pack's tasks, skipping titles already on the checklist. */
export function applyPack(packId: string) {
  const pack = guidebookPacks.find(item => item.id === packId);
  if (!pack) return 0;
  let added = 0;
  updateWorkspace(current => {
    const titles = new Set(current.tasks.map(task => task.title.toLowerCase()));
    const fresh = packTasks(packId).filter(task => !titles.has(task.title.toLowerCase()));
    added = fresh.length;
    return { ...current, tasks: [...current.tasks, ...fresh], packs: [...new Set([...current.packs, packId])] };
  }, `Thêm guidebook “${pack.title}”`);
  return added;
}

/** Record vendor progress (used by the workspace and by the public brief form). */
export function trackVendor(slug: string, patch: Partial<Omit<TrackedVendor, "slug">>, activity?: string) {
  updateWorkspace(current => {
    const existing = current.vendors.find(vendor => vendor.slug === slug);
    const next: TrackedVendor = { stage: "saved", ...existing, ...patch, slug, updatedAt: new Date().toISOString() };
    return { ...current, vendors: existing ? current.vendors.map(vendor => vendor.slug === slug ? next : vendor) : [...current.vendors, next] };
  }, activity);
}

// ---------- Derived values ----------

/** Wedding day used for scheduling: first day of the chosen month (conservative). */
export function weddingDay(project: Project) {
  if (project.dateUndecided || !/^\d{4}-\d{2}$/.test(project.date)) return null;
  const [year, month] = project.date.split("-").map(Number);
  return new Date(year, month - 1, 1);
}

const DAY = 86_400_000;

export function startOfToday() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

/** Longest lead time in the templates (12 months). */
const TEMPLATE_SPAN = 365;
const BUFFER_DAYS = 7;

export function dueDate(task: Task, project: Project): Date | null {
  if (task.due) {
    const [y, m, d] = task.due.split("-").map(Number);
    return new Date(y, m - 1, d);
  }
  const wedding = weddingDay(project);
  if (!wedding || task.daysBefore == null) return null;
  // Short engagements: squeeze the 12-month template into the time actually available
  // (from when the date was set), so nothing starts out overdue and order is preserved.
  const start = new Date(project.scheduleStart ?? project.createdAt);
  const window = Math.round((wedding.getTime() - new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime()) / DAY);
  const scale = window - BUFFER_DAYS < TEMPLATE_SPAN ? Math.max(0, window - BUFFER_DAYS) / TEMPLATE_SPAN : 1;
  return new Date(wedding.getTime() - Math.round(task.daysBefore * scale) * DAY);
}

export const daysUntil = (date: Date) => Math.round((date.getTime() - startOfToday().getTime()) / DAY);

export const isOverdue = (task: Task, project: Project) => {
  const due = dueDate(task, project);
  return !task.done && due !== null && daysUntil(due) < 0;
};

/** Undone tasks first, ordered by due date; undated tasks after dated ones. */
export function sortTasks(tasks: Task[], project: Project) {
  return [...tasks].sort((a, b) => {
    if (a.done !== b.done) return a.done ? 1 : -1;
    const da = dueDate(a, project)?.getTime() ?? Number.MAX_SAFE_INTEGER;
    const db = dueDate(b, project)?.getTime() ?? Number.MAX_SAFE_INTEGER;
    if (da !== db) return da - db;
    return (a.priority === "high" ? 0 : 1) - (b.priority === "high" ? 0 : 1);
  });
}

export function progress(workspace: Workspace) {
  const done = workspace.tasks.filter(task => task.done).length;
  const total = workspace.tasks.length;
  const overdue = workspace.tasks.filter(task => isOverdue(task, workspace.project)).length;
  const planned = workspace.budget.reduce((sum, line) => sum + line.planned, 0);
  const spent = workspace.budget.reduce((sum, line) => sum + line.spent, 0);
  const committed = workspace.vendors.filter(vendor => vendor.stage === "booked").reduce((sum, vendor) => sum + (vendor.quote ?? 0), 0);
  return { done, total, percent: total ? Math.round(done / total * 100) : 0, overdue, planned, spent, committed, budget: workspace.project.budget * 1_000_000 };
}

/** Current phase from the master timeline, based on days left. */
export function currentPhase(project: Project) {
  const wedding = weddingDay(project);
  const phases = guidebookPacks.find(pack => pack.id === "master-timeline")?.timeline ?? [];
  if (!wedding || !phases.length) return null;
  const left = daysUntil(wedding);
  return [...phases].reverse().find(phase => left <= phase.daysBeforeWedding) ?? phases[0];
}

export const vnd = (value: number) => `${new Intl.NumberFormat("vi-VN").format(Math.round(value))}₫`;

export const shortDate = (date: Date) => date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
