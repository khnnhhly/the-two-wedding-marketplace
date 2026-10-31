"use client";

import { FormEvent, useState } from "react";
import { currentMonth, type DiscoveryProfile, LIMITS, planningStages, type ProfileErrors, saveDiscoveryProfile, validateProfile } from "../data/discovery";
import { mergeProject, resetWorkspace, updateWorkspace, type Workspace } from "./store";

const toProfile = (workspace: Workspace): DiscoveryProfile => ({
  stage: workspace.project.stage,
  location: workspace.project.location,
  date: workspace.project.date,
  dateUndecided: workspace.project.dateUndecided,
  guests: String(workspace.project.guests),
  budget: String(workspace.project.budget),
  style: workspace.project.style,
  priorities: workspace.project.priorities,
});

export function SettingsTab({ workspace }: { workspace: Workspace }) {
  const [form, setForm] = useState<DiscoveryProfile>(() => toProfile(workspace));
  const [errors, setErrors] = useState<ProfileErrors>({});
  const [saved, setSaved] = useState(false);

  function set<K extends keyof DiscoveryProfile>(key: K, value: DiscoveryProfile[K]) {
    setForm(current => ({ ...current, [key]: value }));
    setSaved(false);
    if (key in errors) setErrors(current => ({ ...current, [key]: undefined }));
  }

  function save(event: FormEvent) {
    event.preventDefault();
    const found = validateProfile(form);
    setErrors(found);
    if (Object.keys(found).length) return;
    saveDiscoveryProfile(form);
    updateWorkspace(current => ({ ...current, project: mergeProject(current.project, form) }), "Cập nhật thông tin cưới");
    setSaved(true);
  }

  function exportData() {
    const blob = new Blob([JSON.stringify(workspace, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `the-two-workspace-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  function reset() {
    if (!window.confirm("Xoá toàn bộ checklist, ngân sách và vendor đang theo dõi trên trình duyệt này? Thao tác không thể hoàn tác.")) return;
    resetWorkspace();
    window.location.assign("/planning");
  }

  const err = (key: keyof ProfileErrors) => errors[key] && <em className="field-error">{errors[key]}</em>;

  return <>
    <header className="ws-head"><div><p className="eyebrow">THÔNG TIN CƯỚI</p><h1>Cập nhật khi kế hoạch thay đổi</h1><p>Đổi tháng cưới sẽ tự xếp lại hạn chót của checklist. Tổng ngân sách không tự chia lại các hạng mục đã nhập.</p></div></header>
    <form className="ws-panel ws-settings" onSubmit={save} noValidate>
      <div className="discovery-form-grid">
        <label className={errors.location ? "invalid" : ""}><span>Thành phố tổ chức</span><input value={form.location} onChange={event => set("location", event.target.value)}/>{err("location")}</label>
        <label className={errors.date ? "invalid" : ""}><span>Tháng cưới</span><input type="month" min={currentMonth()} disabled={form.dateUndecided} value={form.date} onChange={event => set("date", event.target.value)}/><span className="inline-check"><input type="checkbox" checked={form.dateUndecided} onChange={event => { set("dateUndecided", event.target.checked); if (event.target.checked) set("date", ""); }}/> Chưa chốt ngày</span>{err("date")}</label>
        <label className={errors.guests ? "invalid" : ""}><span>Số khách</span><input type="number" min={LIMITS.guests.min} max={LIMITS.guests.max} value={form.guests} onChange={event => set("guests", event.target.value)}/>{err("guests")}</label>
        <label className={errors.budget ? "invalid" : ""}><span>Tổng ngân sách <small>triệu đồng</small></span><input type="number" min={LIMITS.budget.min} max={LIMITS.budget.max} value={form.budget} onChange={event => set("budget", event.target.value)}/>{err("budget")}</label>
        <label><span>Giai đoạn</span><select value={form.stage} onChange={event => set("stage", event.target.value as DiscoveryProfile["stage"])}>{planningStages.map(stage => <option key={stage.id} value={stage.id}>{stage.label}</option>)}</select></label>
        <label><span>Phong cách</span><input value={form.style} onChange={event => set("style", event.target.value)}/></label>
      </div>
      <div className="ws-form-actions"><button className="primary-market-btn">Lưu thay đổi</button>{saved && <span className="ws-saved" role="status">✓ Đã lưu</span>}</div>
    </form>
    <section className="ws-panel ws-danger">
      <div><h2>Dữ liệu của bạn</h2><p>Workspace được lưu trên trình duyệt này, không gửi lên máy chủ. Hãy xuất file sao lưu trước khi đổi máy hoặc xoá dữ liệu trình duyệt.</p></div>
      <div className="ws-form-actions"><button className="outline-market-btn" onClick={exportData}>Xuất file sao lưu (.json)</button><button className="text-action danger" onClick={reset}>Xoá Workspace</button></div>
    </section>
  </>;
}
