export type PlanningStage = "starting" | "shortlisting" | "booking" | "finalizing";

export type DiscoveryProfile = {
  stage: PlanningStage;
  location: string;
  date: string;
  guests: string;
  budget: string;
  style: string;
  priorities: string[];
};

export const planningStages: { id: PlanningStage; label: string; description: string }[] = [
  { id: "starting", label: "Mới bắt đầu", description: "Chưa có kế hoạch rõ, cần biết nên làm gì trước." },
  { id: "shortlisting", label: "Đang tìm vendor", description: "Đã có brief sơ bộ và muốn tìm theo từng dịch vụ." },
  { id: "booking", label: "Đang so sánh & booking", description: "Đã có shortlist, cần so sánh phạm vi và báo giá." },
  { id: "finalizing", label: "Đang hoàn thiện", description: "Đã có vendor chính, cần chốt các hạng mục còn lại." },
];

export const serviceCategories = [
  { name: "Địa điểm", short: "Venue", icon: "⌂", reason: "Chốt sức chứa, ngày cưới và khung ngân sách." },
  { name: "Wedding Planner", short: "Planner", icon: "◎", reason: "Tạo roadmap và điều phối các quyết định lớn." },
  { name: "Photo & Film", short: "Studio", icon: "◉", reason: "Kiểm tra phong cách, lịch trống và phạm vi bàn giao." },
  { name: "Trang trí", short: "Decor", icon: "✦", reason: "Chuyển moodboard thành phạm vi thi công rõ ràng." },
  { name: "Trang phục", short: "Attire", icon: "◇", reason: "Lên lịch thử, fitting và ngày bàn giao." },
  { name: "Makeup", short: "Beauty", icon: "✧", reason: "Chọn phong cách và kiểm tra lịch theo timeline ngày cưới." },
  { name: "Thiệp & Quà", short: "Stationery", icon: "□", reason: "Đồng bộ thiết kế, số lượng và thời gian sản xuất." },
  { name: "Giải trí", short: "Entertainment", icon: "♫", reason: "Chốt format chương trình và yêu cầu kỹ thuật." },
] as const;

const stageDefaults: Record<PlanningStage, string[]> = {
  starting: ["Wedding Planner", "Địa điểm"],
  shortlisting: ["Địa điểm", "Photo & Film", "Trang trí"],
  booking: ["Photo & Film", "Trang trí", "Trang phục"],
  finalizing: ["Makeup", "Thiệp & Quà", "Giải trí"],
};

// Booking order that respects dependencies: the venue fixes date and capacity,
// which every other vendor needs before quoting.
const dependencyOrder = serviceCategories.map(category => category.name as string);

export function recommendedCategories(profile: DiscoveryProfile) {
  const picked = [...new Set([...profile.priorities, ...stageDefaults[profile.stage]])].slice(0, 4);
  return picked.sort((a, b) => dependencyOrder.indexOf(a) - dependencyOrder.indexOf(b));
}

export const DISCOVERY_KEY = "the-two-discovery-profile";
export const DRAFT_KEY = "the-two-planning-draft";

/** Profile survives tab closes; falls back silently when storage is blocked. */
export function loadDiscoveryProfile(): DiscoveryProfile | null {
  try {
    const raw = localStorage.getItem(DISCOVERY_KEY) ?? sessionStorage.getItem(DISCOVERY_KEY);
    return raw ? JSON.parse(raw) as DiscoveryProfile : null;
  } catch {
    return null;
  }
}

export function saveDiscoveryProfile(profile: DiscoveryProfile) {
  try {
    localStorage.setItem(DISCOVERY_KEY, JSON.stringify(profile));
    localStorage.setItem(DRAFT_KEY, buildPlanningIdea(profile));
    sessionStorage.setItem(DRAFT_KEY, buildPlanningIdea(profile));
  } catch { /* storage unavailable: the flow still works for this page view */ }
}

export const formatNumber = (value: string | number) => new Intl.NumberFormat("vi-VN").format(Number(value));

/** "2027-12" → "Tháng 12/2027". */
export function formatWeddingMonth(value: string) {
  const match = /^(\d{4})-(\d{2})$/.exec(value);
  return match ? `Tháng ${Number(match[2])}/${match[1]}` : value;
}

export function currentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export const LIMITS = { guests: { min: 10, max: 3000 }, budget: { min: 10, max: 50000 } } as const;

export function validateProfile(profile: DiscoveryProfile) {
  const errors: Partial<Record<keyof DiscoveryProfile, string>> = {};
  if (!profile.location.trim()) errors.location = "Nhập thành phố dự kiến, hoặc ghi “chưa chốt”.";
  if (profile.date && profile.date < currentMonth()) errors.date = "Thời gian cưới không thể ở quá khứ.";
  if (profile.guests) {
    const guests = Number(profile.guests);
    if (!Number.isInteger(guests) || guests < LIMITS.guests.min || guests > LIMITS.guests.max) errors.guests = `Số khách từ ${LIMITS.guests.min} đến ${formatNumber(LIMITS.guests.max)}.`;
  }
  if (profile.budget) {
    const budget = Number(profile.budget);
    if (!Number.isFinite(budget) || budget < LIMITS.budget.min || budget > LIMITS.budget.max) errors.budget = `Ngân sách từ ${LIMITS.budget.min} đến ${formatNumber(LIMITS.budget.max)} triệu đồng.`;
  }
  return errors;
}

export function categoryMeta(name: string) {
  return serviceCategories.find(category => category.name === name) ?? serviceCategories[0];
}

export function buildPlanningIdea(profile: DiscoveryProfile) {
  const stage = planningStages.find(item => item.id === profile.stage)?.label ?? "Mới bắt đầu";
  return [
    `Giai đoạn hiện tại: ${stage}.`,
    profile.location && `Dự kiến tổ chức tại ${profile.location}.`,
    profile.date && `Thời gian cưới: ${formatWeddingMonth(profile.date)}.`,
    profile.guests && `Khoảng ${formatNumber(profile.guests)} khách.`,
    profile.budget && `Ngân sách dự kiến ${formatNumber(profile.budget)} triệu đồng.`,
    profile.style && `Phong cách mong muốn: ${profile.style}.`,
    `Ưu tiên tra cứu: ${recommendedCategories(profile).join(", ")}.`,
  ].filter(Boolean).join(" ");
}
