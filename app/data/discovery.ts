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

export function recommendedCategories(profile: DiscoveryProfile) {
  const ordered = [...profile.priorities, ...stageDefaults[profile.stage]];
  return [...new Set(ordered)].slice(0, 4);
}

export function categoryMeta(name: string) {
  return serviceCategories.find(category => category.name === name) ?? serviceCategories[0];
}

export function buildPlanningIdea(profile: DiscoveryProfile) {
  const stage = planningStages.find(item => item.id === profile.stage)?.label ?? "Mới bắt đầu";
  return [
    `Giai đoạn hiện tại: ${stage}.`,
    profile.location && `Dự kiến tổ chức tại ${profile.location}.`,
    profile.date && `Thời gian cưới: ${profile.date}.`,
    profile.guests && `Khoảng ${profile.guests} khách.`,
    profile.budget && `Ngân sách dự kiến ${profile.budget} triệu đồng.`,
    profile.style && `Phong cách mong muốn: ${profile.style}.`,
    `Ưu tiên tra cứu: ${recommendedCategories(profile).join(", ")}.`,
  ].filter(Boolean).join(" ");
}
