"use client";

import { FormEvent, useMemo, useState } from "react";
import { PublicPage } from "../components/MarketplaceChrome";
import {
  buildPlanningIdea,
  categoryMeta,
  currentMonth,
  type DiscoveryProfile,
  formatNumber,
  formatWeddingMonth,
  LIMITS,
  planningStages,
  recommendedCategories,
  saveDiscoveryProfile,
  serviceCategories,
  validateProfile,
} from "../data/discovery";
import { loginPath } from "../lib/site";

const initialProfile: DiscoveryProfile = {
  stage: "starting",
  location: "",
  date: "",
  guests: "",
  budget: "",
  style: "",
  priorities: [],
};

export default function PlanningPage() {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<DiscoveryProfile>(initialProfile);
  const [hint, setHint] = useState("");
  const [errors, setErrors] = useState<ReturnType<typeof validateProfile>>({});
  const recommendations = useMemo(() => recommendedCategories(profile), [profile]);

  const set = <K extends keyof DiscoveryProfile>(key: K, value: DiscoveryProfile[K]) => {
    setProfile(current => ({ ...current, [key]: value }));
  };

  function togglePriority(name: string) {
    // Functional update so quick successive taps never read a stale selection.
    setProfile(current => {
      if (current.priorities.includes(name)) {
        setHint("");
        return { ...current, priorities: current.priorities.filter(item => item !== name) };
      }
      if (current.priorities.length >= 3) {
        setHint("Đã chọn đủ 3 ưu tiên. Bỏ một mục trước khi chọn mục khác.");
        return current;
      }
      setHint("");
      return { ...current, priorities: [...current.priorities, name] };
    });
  }

  function saveDiscovery() {
    saveDiscoveryProfile(profile);
  }

  function continueToRecommendations(event: FormEvent) {
    event.preventDefault();
    const found = validateProfile(profile);
    setErrors(found);
    if (Object.keys(found).length) {
      document.querySelector<HTMLInputElement>(`[name="${Object.keys(found)[0]}"]`)?.focus();
      return;
    }
    saveDiscovery();
    setStep(3);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function openCategory(category: string) {
    saveDiscovery();
    window.location.assign(`/vendors?category=${encodeURIComponent(category)}&recommended=1`);
  }

  function openWorkspace() {
    saveDiscovery();
    // The Workspace runs on the account domain, so the draft travels in the URL.
    window.location.assign(loginPath(`/workspace?from=planning&idea=${encodeURIComponent(buildPlanningIdea(profile))}`));
  }

  return <PublicPage className="planning-page discovery-page">
    <section className="planning-hero discovery-hero"><div className="market-shell">
      <p className="eyebrow">COUPLE DISCOVERY · BƯỚC {step}/3</p>
      <h1>{step === 1 ? <>Bắt đầu từ đúng<br/><em>giai đoạn của hai bạn.</em></> : step === 2 ? <>Một vài câu hỏi để<br/><em>gợi ý đúng category.</em></> : <>Flow tra cứu dành riêng<br/><em>cho hai bạn.</em></>}</h1>
      <p>{step === 1 ? "Chỉ cần chọn tình trạng hiện tại. the two sẽ không bắt bạn đi qua những bước chưa cần thiết." : step === 2 ? "Chia sẻ những gì đã biết và chọn tối đa 3 ưu tiên. Thông tin chưa chắc chắn có thể để trống." : "Tra cứu lần lượt theo category; mỗi kết quả vẫn giữ bối cảnh về địa điểm và ưu tiên của hai bạn."}</p>
      <div className="journey-line discovery-progress">
        <span className={step >= 1 ? "active" : ""}><b>01</b>Giai đoạn hiện tại</span>
        <span className={step >= 2 ? "active" : ""}><b>02</b>Insight & ưu tiên</span>
        <span className={step >= 3 ? "active" : ""}><b>03</b>Flow tra cứu</span>
      </div>
    </div></section>

    <section className="market-shell discovery-shell">
      {step === 1 && <div className="discovery-step">
        <div className="step-heading"><p className="eyebrow">01 · BẠN ĐANG Ở ĐÂU?</p><h2>Chọn một trạng thái gần nhất.</h2><p>Không có câu trả lời đúng tuyệt đối; bạn có thể quay lại thay đổi.</p></div>
        <div className="stage-options">{planningStages.map(item => <button key={item.id} aria-pressed={profile.stage === item.id} className={profile.stage === item.id ? "selected" : ""} onClick={() => set("stage", item.id)}><i>{profile.stage === item.id ? "✓" : ""}</i><span><b>{item.label}</b><small>{item.description}</small></span></button>)}</div>
        <div className="discovery-actions"><span/><button className="primary-market-btn" onClick={() => { setStep(2); window.scrollTo({ top: 0, behavior: "smooth" }); }}>Tiếp tục →</button></div>
      </div>}

      {step === 2 && <form className="discovery-step" onSubmit={continueToRecommendations} noValidate>
        <div className="step-heading"><p className="eyebrow">02 · KHAI THÁC INSIGHT</p><h2>Thông tin nào đã tương đối rõ?</h2><p>Chỉ địa điểm là bắt buộc để recommendation có đủ bối cảnh.</p></div>
        <div className="discovery-form-grid">
          <label className={errors.location ? "invalid" : ""}><span>Địa điểm dự kiến</span><input name="location" required aria-invalid={Boolean(errors.location)} value={profile.location} onChange={event => set("location", event.target.value)} placeholder="Hà Nội, TP.HCM hoặc chưa chốt"/>{errors.location && <em className="field-error">{errors.location}</em>}</label>
          <label className={errors.date ? "invalid" : ""}><span>Tháng cưới <small>để trống nếu chưa chốt</small></span><input name="date" type="month" min={currentMonth()} aria-invalid={Boolean(errors.date)} value={profile.date} onChange={event => set("date", event.target.value)}/>{errors.date && <em className="field-error">{errors.date}</em>}</label>
          <label className={errors.guests ? "invalid" : ""}><span>Số khách dự kiến</span><input name="guests" type="number" inputMode="numeric" min={LIMITS.guests.min} max={LIMITS.guests.max} aria-invalid={Boolean(errors.guests)} value={profile.guests} onChange={event => set("guests", event.target.value)} placeholder="250"/>{errors.guests && <em className="field-error">{errors.guests}</em>}</label>
          <label className={errors.budget ? "invalid" : ""}><span>Ngân sách <small>triệu đồng</small></span><input name="budget" type="number" inputMode="numeric" min={LIMITS.budget.min} max={LIMITS.budget.max} aria-invalid={Boolean(errors.budget)} value={profile.budget} onChange={event => set("budget", event.target.value)} placeholder="400"/>{errors.budget && <em className="field-error">{errors.budget}</em>}</label>
          <label className="wide"><span>Phong cách hoặc cảm giác mong muốn</span><input value={profile.style} onChange={event => set("style", event.target.value)} placeholder="Tối giản, ấm áp, hiện đại…"/></label>
        </div>
        <div className="priority-section"><div><p className="eyebrow">ƯU TIÊN TRA CỨU</p><h3>Hai bạn muốn xử lý category nào trước?</h3><small>Chọn tối đa 3. Nếu chưa biết, the two sẽ gợi ý theo giai đoạn.</small></div><div className="priority-grid">{serviceCategories.map(category => <button type="button" key={category.name} aria-pressed={profile.priorities.includes(category.name)} className={profile.priorities.includes(category.name) ? "selected" : ""} onClick={() => togglePriority(category.name)}><i>{category.icon}</i><span><b>{category.name}</b><small>{category.short}</small></span><em>{profile.priorities.includes(category.name) ? "✓" : "+"}</em></button>)}</div><p className="selection-hint" role="status">{hint || `Đã chọn ${profile.priorities.length}/3`}</p></div>
        <div className="discovery-actions"><button type="button" className="text-action" onClick={() => setStep(1)}>← Quay lại</button><button className="primary-market-btn">Xem recommendation →</button></div>
      </form>}

      {step === 3 && <div className="discovery-step recommendation-step">
        <div className="recommendation-summary"><div><p className="eyebrow">PROFILE TẠM THỜI</p><h2>{profile.location || "Chưa chốt địa điểm"}{profile.date ? ` · ${formatWeddingMonth(profile.date)}` : ""}</h2><p>{profile.guests ? `${formatNumber(profile.guests)} khách` : "Chưa chốt số khách"}{profile.budget ? ` · ${formatNumber(profile.budget)} triệu đồng` : " · Chưa chốt ngân sách"}</p></div><button onClick={() => setStep(2)}>Chỉnh câu trả lời</button></div>
        <div className="recommendation-layout"><div><p className="eyebrow">FLOW TRA CỨU ĐỀ XUẤT</p><h2>Đi theo từng category,<br/>không mở tất cả cùng lúc.</h2><p>Thứ tự đi theo mức độ phụ thuộc: địa điểm và ngày cưới quyết định lịch trống, sức chứa và báo giá của các vendor còn lại.</p></div><ol className="recommendation-list">{recommendations.map((name, index) => { const category = categoryMeta(name); return <li key={name}><b>{String(index + 1).padStart(2, "0")}</b><i>{category.icon}</i><span><strong>{category.name}</strong><small>{category.reason}</small></span><button onClick={() => openCategory(category.name)}>Tra cứu →</button></li>; })}</ol></div>
        <div className="next-step-card"><div><p className="eyebrow">BƯỚC TIẾP THEO</p><h3>Bắt đầu từ {recommendations[0]}.</h3><p>Kết quả sẽ ưu tiên category này và vẫn giữ insight bạn vừa chia sẻ.</p></div><div><button className="primary-market-btn orange" onClick={() => openCategory(recommendations[0])}>Tra cứu {recommendations[0]} →</button><a className="outline-market-btn" href="/inquiry">Gửi brief để the two tìm giúp</a><button className="text-action" onClick={openWorkspace}>Lưu vào Workspace (cần đăng nhập) →</button></div></div>
      </div>}
    </section>
  </PublicPage>;
}
