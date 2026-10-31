export type PlanningStage = "starting" | "shortlisting" | "booking" | "finalizing";

/** Answers collected by the 3-step discovery flow. Numbers stay strings while the user types. */
export type DiscoveryProfile = {
  stage: PlanningStage;
  location: string;
  /** "YYYY-MM", empty when `dateUndecided` is true. */
  date: string;
  dateUndecided: boolean;
  guests: string;
  /** Total budget in million VND. */
  budget: string;
  style: string;
  priorities: string[];
};

export const emptyProfile: DiscoveryProfile = {
  stage: "starting",
  location: "",
  date: "",
  dateUndecided: false,
  guests: "",
  budget: "",
  style: "",
  priorities: [],
};

export const planningStages: { id: PlanningStage; label: string; description: string }[] = [
  { id: "starting", label: "Mới bắt đầu", description: "Chưa có kế hoạch rõ, cần biết nên làm gì trước." },
  { id: "shortlisting", label: "Đang tìm vendor", description: "Đã có brief sơ bộ và muốn tìm theo từng dịch vụ." },
  { id: "booking", label: "Đang so sánh & booking", description: "Đã có shortlist, cần so sánh phạm vi và báo giá." },
  { id: "finalizing", label: "Đang hoàn thiện", description: "Đã có vendor chính, cần chốt các hạng mục còn lại." },
];

/** Ordered by booking dependency: the venue fixes date and capacity, which every other vendor needs. */
export const serviceCategories = [
  { name: "Địa điểm", short: "Venue", icon: "⌂", reason: "Chốt sức chứa, ngày cưới và khung ngân sách.", leadDays: 330 },
  { name: "Wedding Planner", short: "Planner", icon: "◎", reason: "Tạo roadmap và điều phối các quyết định lớn.", leadDays: 330 },
  { name: "Photo & Film", short: "Studio", icon: "◉", reason: "Kiểm tra phong cách, lịch trống và phạm vi bàn giao.", leadDays: 270 },
  { name: "Trang trí", short: "Decor", icon: "✦", reason: "Chuyển moodboard thành phạm vi thi công rõ ràng.", leadDays: 180 },
  { name: "Trang phục", short: "Attire", icon: "◇", reason: "Lên lịch thử, fitting và ngày bàn giao.", leadDays: 180 },
  { name: "Makeup", short: "Beauty", icon: "✧", reason: "Chọn phong cách và kiểm tra lịch theo timeline ngày cưới.", leadDays: 120 },
  { name: "Thiệp & Quà", short: "Stationery", icon: "□", reason: "Đồng bộ thiết kế, số lượng và thời gian sản xuất.", leadDays: 100 },
  { name: "Giải trí", short: "Entertainment", icon: "♫", reason: "Chốt format chương trình và yêu cầu kỹ thuật.", leadDays: 150 },
] as const;

export type CategoryName = typeof serviceCategories[number]["name"];

const stageDefaults: Record<PlanningStage, string[]> = {
  starting: ["Wedding Planner", "Địa điểm"],
  shortlisting: ["Địa điểm", "Photo & Film", "Trang trí"],
  booking: ["Photo & Film", "Trang trí", "Trang phục"],
  finalizing: ["Makeup", "Thiệp & Quà", "Giải trí"],
};

const dependencyOrder = serviceCategories.map(category => category.name as string);

export function recommendedCategories(profile: Pick<DiscoveryProfile, "priorities" | "stage">) {
  const picked = [...new Set([...profile.priorities, ...stageDefaults[profile.stage]])].slice(0, 4);
  return picked.sort((a, b) => dependencyOrder.indexOf(a) - dependencyOrder.indexOf(b));
}

export function categoryMeta(name: string) {
  return serviceCategories.find(category => category.name === name) ?? serviceCategories[0];
}

export const DISCOVERY_KEY = "the-two-discovery-profile";

export function loadDiscoveryProfile(): DiscoveryProfile | null {
  try {
    const raw = localStorage.getItem(DISCOVERY_KEY);
    return raw ? { ...emptyProfile, ...JSON.parse(raw) as Partial<DiscoveryProfile> } : null;
  } catch {
    return null;
  }
}

export function saveDiscoveryProfile(profile: DiscoveryProfile) {
  try { localStorage.setItem(DISCOVERY_KEY, JSON.stringify(profile)); } catch { /* storage blocked: flow still works for this page view */ }
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

export type ProfileErrors = Partial<Record<"location" | "date" | "guests" | "budget", string>>;

/** Every field the Workspace needs must be present before it can be created. */
export function validateProfile(profile: DiscoveryProfile): ProfileErrors {
  const errors: ProfileErrors = {};
  if (profile.location.trim().length < 2) errors.location = "Nhập thành phố dự kiến tổ chức.";
  if (!profile.dateUndecided) {
    if (!/^\d{4}-\d{2}$/.test(profile.date)) errors.date = "Chọn tháng cưới, hoặc tích “Chưa chốt ngày”.";
    else if (profile.date < currentMonth()) errors.date = "Tháng cưới không thể ở quá khứ.";
  }
  const guests = Number(profile.guests);
  if (!profile.guests) errors.guests = "Nhập số khách dự kiến (ước lượng cũng được).";
  else if (!Number.isInteger(guests) || guests < LIMITS.guests.min || guests > LIMITS.guests.max) errors.guests = `Số khách từ ${LIMITS.guests.min} đến ${formatNumber(LIMITS.guests.max)}.`;
  const budget = Number(profile.budget);
  if (!profile.budget) errors.budget = "Nhập tổng ngân sách dự kiến.";
  else if (!Number.isFinite(budget) || budget < LIMITS.budget.min || budget > LIMITS.budget.max) errors.budget = `Ngân sách từ ${LIMITS.budget.min} đến ${formatNumber(LIMITS.budget.max)} triệu đồng.`;
  return errors;
}

export const isProfileComplete = (profile: DiscoveryProfile) => Object.keys(validateProfile(profile)).length === 0;
