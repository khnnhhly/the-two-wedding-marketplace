"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import { FormEvent, useEffect, useMemo, useState } from "react";
import { PublicPage } from "../components/MarketplaceChrome";
import {
  categoryMeta,
  currentMonth,
  type DiscoveryProfile,
  emptyProfile,
  formatNumber,
  formatWeddingMonth,
  LIMITS,
  loadDiscoveryProfile,
  planningStages,
  type ProfileErrors,
  recommendedCategories,
  saveDiscoveryProfile,
  serviceCategories,
  validateProfile,
} from "../data/discovery";
import { createWorkspace, hasWorkspace, updateProjectFromProfile } from "../workspace/store";

const MAX_PRIORITIES = 3;
const stepTitles = ["Giai đoạn hiện tại", "Thông tin cưới", "Kết quả & Workspace"];

export default function PlanningPage() {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<DiscoveryProfile>(emptyProfile);
  const [errors, setErrors] = useState<ProfileErrors>({});
  const [hint, setHint] = useState("");
  const [existing, setExisting] = useState(false);
  const recommendations = useMemo(() => recommendedCategories(profile), [profile]);

  // Resume previous answers so going back never loses input.
  useEffect(() => {
    const saved = loadDiscoveryProfile();
    if (saved) setProfile(saved);
    setExisting(hasWorkspace());
  }, []);

  function set<K extends keyof DiscoveryProfile>(key: K, value: DiscoveryProfile[K]) {
    setProfile(current => ({ ...current, [key]: value }));
    if (key in errors) setErrors(current => ({ ...current, [key]: undefined }));
  }

  function togglePriority(name: string) {
    const selected = profile.priorities.includes(name);
    if (!selected && profile.priorities.length >= MAX_PRIORITIES) {
      setHint(`Đã chọn đủ ${MAX_PRIORITIES} ưu tiên. Bỏ một mục trước khi chọn mục khác.`);
      return;
    }
    setHint("");
    setProfile(current => ({
      ...current,
      priorities: selected ? current.priorities.filter(item => item !== name) : current.priorities.includes(name) ? current.priorities : [...current.priorities, name].slice(0, MAX_PRIORITIES),
    }));
  }

  function goTo(next: number) {
    setStep(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function submitDetails(event: FormEvent) {
    event.preventDefault();
    const found = validateProfile(profile);
    setErrors(found);
    const firstInvalid = Object.keys(found)[0];
    if (firstInvalid) {
      document.querySelector<HTMLInputElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }
    saveDiscoveryProfile(profile);
    goTo(3);
  }

  function openCategory(category: string) {
    saveDiscoveryProfile(profile);
    window.location.assign(`/vendors?category=${encodeURIComponent(category)}&recommended=1`);
  }

  function openWorkspace(mode: "create" | "update") {
    saveDiscoveryProfile(profile);
    if (mode === "update") updateProjectFromProfile(profile);
    else createWorkspace(profile);
    window.location.assign("/workspace?welcome=1");
  }

  const errorText = (key: keyof ProfileErrors) => errors[key] && <em className="field-error" id={`${key}-error`}>{errors[key]}</em>;
  const fieldProps = (key: keyof ProfileErrors) => ({ name: key, "aria-invalid": Boolean(errors[key]), "aria-describedby": errors[key] ? `${key}-error` : undefined });

  return <PublicPage className="planning-page discovery-page">
    <section className="planning-hero discovery-hero"><div className="market-shell">
      <p className="eyebrow">LÊN KẾ HOẠCH · BƯỚC {step}/3</p>
      <h1>{step === 1 ? <>Bắt đầu từ đúng<br/><em>giai đoạn của hai bạn.</em></> : step === 2 ? <>Vài thông tin để<br/><em>dựng kế hoạch thật.</em></> : <>Kế hoạch của hai bạn<br/><em>đã sẵn sàng.</em></>}</h1>
      <p>{step === 1 ? "Chọn tình trạng gần nhất. Bạn có thể quay lại thay đổi bất cứ lúc nào." : step === 2 ? "Workspace dùng những thông tin này để xếp lịch checklist, chia ngân sách và gợi ý vendor. Ước lượng cũng được." : "Mở Workspace để theo dõi checklist, ngân sách và vendor — hoặc bắt đầu tra cứu category đầu tiên."}</p>
      <ol className="journey-line discovery-progress">{stepTitles.map((title, index) => <li key={title} className={step >= index + 1 ? "active" : ""} aria-current={step === index + 1 ? "step" : undefined}><b>{String(index + 1).padStart(2, "0")}</b>{title}</li>)}</ol>
    </div></section>

    <section className="market-shell discovery-shell">
      {step === 1 && <div className="discovery-step">
        <div className="step-heading"><p className="eyebrow">01 · BẠN ĐANG Ở ĐÂU?</p><h2>Chọn một trạng thái gần nhất.</h2></div>
        <div className="stage-options" role="radiogroup" aria-label="Giai đoạn chuẩn bị">{planningStages.map(item => <button type="button" role="radio" key={item.id} aria-checked={profile.stage === item.id} className={profile.stage === item.id ? "selected" : ""} onClick={() => set("stage", item.id)}><i>{profile.stage === item.id ? "✓" : ""}</i><span><b>{item.label}</b><small>{item.description}</small></span></button>)}</div>
        <div className="discovery-actions"><span/><button type="button" className="primary-market-btn" onClick={() => goTo(2)}>Tiếp tục →</button></div>
      </div>}

      {step === 2 && <form className="discovery-step" onSubmit={submitDetails} noValidate>
        <div className="step-heading"><p className="eyebrow">02 · THÔNG TIN CƯỚI</p><h2>Tất cả các ô đều cần để mở Workspace.</h2><p>Chưa chắc chắn? Nhập con số ước lượng — bạn sửa được trong Workspace.</p></div>
        <div className="discovery-form-grid">
          <label className={errors.location ? "invalid" : ""}><span>Thành phố tổ chức</span><input {...fieldProps("location")} autoComplete="address-level2" value={profile.location} onChange={event => set("location", event.target.value)} placeholder="Hà Nội, TP.HCM, Đà Nẵng…"/>{errorText("location")}</label>
          <label className={errors.date ? "invalid" : ""}><span>Tháng cưới</span><input {...fieldProps("date")} type="month" min={currentMonth()} disabled={profile.dateUndecided} value={profile.date} onChange={event => set("date", event.target.value)}/><span className="inline-check"><input type="checkbox" checked={profile.dateUndecided} onChange={event => { set("dateUndecided", event.target.checked); if (event.target.checked) set("date", ""); }}/> Chưa chốt ngày</span>{errorText("date")}</label>
          <label className={errors.guests ? "invalid" : ""}><span>Số khách dự kiến</span><input {...fieldProps("guests")} type="number" inputMode="numeric" min={LIMITS.guests.min} max={LIMITS.guests.max} value={profile.guests} onChange={event => set("guests", event.target.value)} placeholder="250"/>{errorText("guests")}</label>
          <label className={errors.budget ? "invalid" : ""}><span>Tổng ngân sách <small>triệu đồng</small></span><input {...fieldProps("budget")} type="number" inputMode="numeric" min={LIMITS.budget.min} max={LIMITS.budget.max} value={profile.budget} onChange={event => set("budget", event.target.value)} placeholder="400"/>{errorText("budget")}</label>
          <label className="wide"><span>Phong cách mong muốn <small>không bắt buộc</small></span><input value={profile.style} onChange={event => set("style", event.target.value)} placeholder="Tối giản, ấm áp, hiện đại…"/></label>
        </div>
        <fieldset className="priority-section"><legend><p className="eyebrow">ƯU TIÊN TRA CỨU · KHÔNG BẮT BUỘC</p><h3>Hai bạn muốn xử lý category nào trước?</h3><small>Chọn tối đa {MAX_PRIORITIES}. Nếu bỏ trống, the two gợi ý theo giai đoạn.</small></legend>
          <div className="priority-grid">{serviceCategories.map(category => { const on = profile.priorities.includes(category.name); return <button type="button" key={category.name} aria-pressed={on} className={on ? "selected" : ""} onClick={() => togglePriority(category.name)}><i>{category.icon}</i><span><b>{category.name}</b><small>{category.short}</small></span><em>{on ? "✓" : "+"}</em></button>; })}</div>
          <p className="selection-hint" role="status">{hint || `Đã chọn ${profile.priorities.length}/${MAX_PRIORITIES}`}</p>
        </fieldset>
        {Object.values(errors).some(Boolean) && <p className="form-error" role="alert">Còn {Object.values(errors).filter(Boolean).length} ô cần hoàn thiện ở phía trên.</p>}
        <div className="discovery-actions"><button type="button" className="text-action" onClick={() => goTo(1)}>← Quay lại</button><button className="primary-market-btn">Xem kế hoạch →</button></div>
      </form>}

      {step === 3 && <div className="discovery-step recommendation-step">
        <div className="recommendation-summary"><div><p className="eyebrow">THÔNG TIN CƯỚI</p><h2>{profile.location} · {profile.dateUndecided ? "Chưa chốt ngày" : formatWeddingMonth(profile.date)}</h2><p>{formatNumber(profile.guests)} khách · {formatNumber(profile.budget)} triệu đồng{profile.style ? ` · ${profile.style}` : ""}</p></div><button type="button" onClick={() => goTo(2)}>Sửa thông tin</button></div>
        <div className="next-step-card workspace-cta"><div><p className="eyebrow">WORKSPACE CỦA HAI BẠN</p><h3>Checklist có hạn chót, ngân sách đã chia sẵn, vendor theo dõi theo từng bước.</h3><p>Không cần tài khoản. Dữ liệu được lưu trên trình duyệt này; bạn có thể xuất file sao lưu bất cứ lúc nào.</p></div><div>
          {existing ? <>
            <button type="button" className="primary-market-btn orange" onClick={() => openWorkspace("update")}>Cập nhật Workspace hiện có →</button>
            <button type="button" className="text-action" onClick={() => { if (window.confirm("Tạo Workspace mới sẽ thay thế checklist, ngân sách và vendor đang theo dõi. Tiếp tục?")) openWorkspace("create"); }}>Tạo mới từ đầu</button>
          </> : <button type="button" className="primary-market-btn orange" onClick={() => openWorkspace("create")}>Mở Workspace →</button>}
        </div></div>
        <div className="recommendation-layout"><div><p className="eyebrow">THỨ TỰ NÊN TRA CỨU</p><h2>Đi theo từng category,<br/>bắt đầu từ cái quyết định nhiều nhất.</h2><p>Địa điểm và ngày cưới quyết định lịch trống, sức chứa và báo giá của các vendor còn lại.</p></div><ol className="recommendation-list">{recommendations.map((name, index) => { const category = categoryMeta(name); return <li key={name}><b>{String(index + 1).padStart(2, "0")}</b><i>{category.icon}</i><span><strong>{category.name}</strong><small>{category.reason}</small></span><button type="button" onClick={() => openCategory(category.name)}>Tra cứu →</button></li>; })}</ol></div>
      </div>}
    </section>
  </PublicPage>;
}
