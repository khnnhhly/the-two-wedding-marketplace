export type GuidebookTask = {
  title: string;
  category: string;
  description?: string;
  priority?: "high" | "medium";
  daysBeforeWedding?: number;
};

export type GuidebookPack = {
  id: string;
  title: string;
  eyebrow: string;
  description: string;
  sourceLabel: string;
  sourceCount: string;
  color: "blue" | "orange" | "ink" | "ivory";
  tasks: GuidebookTask[];
  timeline?: { title: string; description: string; daysBeforeWedding: number }[];
  budget?: [string, number][];
};

export const guidebookPacks: GuidebookPack[] = [
  {
    id: "master-timeline",
    title: "Timeline tổng quát",
    eyebrow: "8 GIAI ĐOẠN",
    description: "Khung triển khai từ research, chọn vendor đến D-14 và final check.",
    sourceLabel: "Timeline Tổng quát",
    sourceCount: "63 hạng mục nguồn · 12 việc cốt lõi",
    color: "blue",
    tasks: [
      { title: "Xác định ngày cưới, số khách và địa điểm dự kiến", category: "Thông tin cơ bản", priority: "high", daysBeforeWedding: 365 },
      { title: "Thống nhất phong cách và bảng màu với gia đình", category: "Thông tin cơ bản", daysBeforeWedding: 350 },
      { title: "Lập và review moodboard trang trí", category: "Decoration", daysBeforeWedding: 330 },
      { title: "Lập shortlist venue và vendor chính", category: "Vendor", priority: "high", daysBeforeWedding: 320 },
      { title: "Site-check top 3 địa điểm", category: "Venue", priority: "high", daysBeforeWedding: 300 },
      { title: "Lập dự trù ngân sách từ báo giá vendor", category: "Ngân sách", priority: "high", daysBeforeWedding: 285 },
      { title: "Chốt concept quay chụp và photographer", category: "Photo & Film", daysBeforeWedding: 240 },
      { title: "Lập kịch bản chương trình tiệc cưới", category: "Chương trình cưới", daysBeforeWedding: 150 },
      { title: "Chốt và ký hợp đồng với các vendor", category: "Vendor", priority: "high", daysBeforeWedding: 120 },
      { title: "Gửi thiệp và theo dõi RSVP", category: "Khách mời", daysBeforeWedding: 75 },
      { title: "Chốt sơ đồ bàn tiệc và phương án đón khách", category: "Khách mời", daysBeforeWedding: 35 },
      { title: "Final check toàn bộ vendor và vật dụng ngày cưới", category: "Final Check", priority: "high", daysBeforeWedding: 14 },
    ],
    timeline: [
      { title: "Phase 1 · Research & Review", description: "Thông tin cơ bản, moodboard, venue và vendor shortlist.", daysBeforeWedding: 365 },
      { title: "Phase 2 · Triển khai sơ bộ", description: "Ngân sách, decoration, printing, makeup và photo.", daysBeforeWedding: 285 },
      { title: "Phase 3 · Chương trình tiệc cưới", description: "Kịch bản, MC, guest management và trải nghiệm khách.", daysBeforeWedding: 180 },
      { title: "Phase 4 · Điều chỉnh", description: "Review báo giá, concept và timeline với các bên.", daysBeforeWedding: 150 },
      { title: "Phase 5 · Chốt vendor", description: "Chốt phạm vi, hợp đồng và lịch thanh toán.", daysBeforeWedding: 120 },
      { title: "Phase 6 · Hoàn thiện", description: "Thiệp, RSVP, seating, chương trình và phương án dự phòng.", daysBeforeWedding: 75 },
      { title: "Phase 7 · Final Check", description: "Xác nhận lại vendor, ấn phẩm và di chuyển.", daysBeforeWedding: 30 },
      { title: "Phase 8 · D-14", description: "Chương trình cuối, trang phục và emergency kit.", daysBeforeWedding: 14 },
    ],
  },
  {
    id: "general-checklist",
    title: "Checklist tổng quát",
    eyebrow: "18 NHÓM VIỆC",
    description: "Checklist bao phủ venue, khách mời, trang phục, quay chụp và phương án B.",
    sourceLabel: "Checklist Tổng quát",
    sourceCount: "96 hạng mục nguồn · 18 việc đại diện",
    color: "orange",
    tasks: [
      { title: "Tạo moodboard và chọn phong cách đám cưới", category: "Đám cưới tổng quan", priority: "high" },
      { title: "Scout và tham quan shortlist venue", category: "Venue", priority: "high" },
      { title: "Lập danh sách khách mời sơ bộ", category: "Khách mời", priority: "high" },
      { title: "Lập phương án di chuyển cho cô dâu, chú rể và khách", category: "Di chuyển" },
      { title: "Chọn MC, phù dâu và phù rể", category: "Đội ngũ ngày cưới" },
      { title: "Chốt váy cưới, suit và phụ kiện", category: "Trang phục & trang sức" },
      { title: "Chọn makeup artist và test makeup", category: "Makeup & làm đẹp" },
      { title: "Chốt concept và vendor quay chụp", category: "Quay chụp", priority: "high" },
      { title: "Chọn hạng mục giải trí", category: "Entertainment" },
      { title: "Chốt các khu vực trang trí venue", category: "Trang trí venue" },
      { title: "Chuẩn bị bàn gallery và hoạt động cho khách", category: "Guest Experience" },
      { title: "Thiết kế album và ảnh trưng bày", category: "Bàn gallery" },
      { title: "Chốt hoa cầm tay và hoa cài áo", category: "Hoa cưới" },
      { title: "Lên kịch bản lễ, nhạc cưới và first dance", category: "Chương trình cưới" },
      { title: "Chốt quà khách, quà bố mẹ và đội bê tráp", category: "Quà tặng" },
      { title: "Theo dõi ngân sách theo từng hạng mục", category: "Ngân sách", priority: "high" },
      { title: "Tạo danh bạ vendor và liên hệ khẩn cấp", category: "Thông tin khẩn cấp" },
      { title: "Chuẩn bị kế hoạch B cho thời tiết và kỹ thuật", category: "Phương án dự phòng", priority: "high" },
    ],
  },
  {
    id: "d7-final-check",
    title: "Checklist D-7",
    eyebrow: "7 NGÀY CUỐI",
    description: "Danh sách bàn giao vật dụng và trách nhiệm trước ngày cưới.",
    sourceLabel: "Checklist D-7",
    sourceCount: "93 hạng mục nguồn · 16 việc quan trọng",
    color: "ink",
    tasks: [
      { title: "Nhận và kiểm tra váy cưới, vest, voan và giày", category: "Trang phục", priority: "high", daysBeforeWedding: 7 },
      { title: "Xác nhận hoa cầm tay và hoa cài áo", category: "Đồ cưới", daysBeforeWedding: 7 },
      { title: "Chuẩn bị nhẫn cưới và thiệp vows", category: "Đồ cưới", priority: "high", daysBeforeWedding: 7 },
      { title: "Bàn giao USB nhạc, slide và ảnh trình chiếu", category: "Kỹ thuật", priority: "high", daysBeforeWedding: 7 },
      { title: "Kiểm tra âm thanh, ánh sáng và micro", category: "Kỹ thuật", priority: "high", daysBeforeWedding: 7 },
      { title: "Xác nhận xe cưới và xe đưa đón", category: "Di chuyển", daysBeforeWedding: 7 },
      { title: "Xác nhận chỗ ở cho khách và đội hỗ trợ", category: "Di chuyển", daysBeforeWedding: 7 },
      { title: "Kiểm tra backdrop, cổng hoa và bàn gallery", category: "Trang trí", daysBeforeWedding: 7 },
      { title: "Chuẩn bị ảnh cưới, album và khung ảnh", category: "Dụng cụ", daysBeforeWedding: 7 },
      { title: "Kiểm tra thiệp giấy và landing page mời cưới", category: "Thiệp mời", daysBeforeWedding: 7 },
      { title: "Xác nhận menu, đồ uống và đồ ăn nhẹ", category: "Ăn uống", daysBeforeWedding: 7 },
      { title: "Chuẩn bị lễ vật và lì xì đội bê tráp", category: "Sính lễ", daysBeforeWedding: 7 },
      { title: "Bàn giao sơ đồ bàn và danh sách RSVP cuối", category: "Khách mời", priority: "high", daysBeforeWedding: 7 },
      { title: "Chuẩn bị emergency kit và bộ sơ cứu", category: "Dụng cụ", daysBeforeWedding: 7 },
      { title: "Xác nhận người phụ trách từng nhóm vật dụng", category: "Điều phối", priority: "high", daysBeforeWedding: 7 },
      { title: "Gọi xác nhận lần cuối với toàn bộ vendor", category: "Vendor", priority: "high", daysBeforeWedding: 7 },
    ],
  },
  {
    id: "budget-blueprint",
    title: "Khung ngân sách",
    eyebrow: "14 NHÓM CHI PHÍ",
    description: "Cấu trúc ngân sách theo khách, gói dịch vụ, số lượng và quỹ dự phòng.",
    sourceLabel: "Ngân sách",
    sourceCount: "99 dòng chi phí nguồn · 14 nhóm phân bổ",
    color: "ivory",
    tasks: [
      { title: "Điền số khách cho từng nghi lễ và tiệc chính", category: "Ngân sách", priority: "high" },
      { title: "Thu thập đơn giá và điều kiện thanh toán của từng vendor", category: "Ngân sách", priority: "high" },
      { title: "Kiểm tra VAT, phí phục vụ và phí mang đồ ngoài", category: "Ngân sách", priority: "high" },
      { title: "Thiết lập quỹ dự phòng và mức cảnh báo vượt ngân sách", category: "Ngân sách" },
    ],
    budget: [
      ["Venue & F&B", 38], ["Planner & Coordination", 7], ["Thiệp & Stationery", 3], ["Nhẫn & Phụ kiện", 4],
      ["Sính lễ", 4], ["Makeup & Hair", 5], ["Trang phục", 8], ["Decoration & AV", 10],
      ["Photo & Film", 8], ["Entertainment", 3], ["Nghi thức", 1], ["Quà khách", 2],
      ["Di chuyển", 2], ["Dự phòng", 5],
    ],
  },
  {
    id: "venue-review",
    title: "Venue review",
    eyebrow: "BỘ TIÊU CHÍ",
    description: "Khung site-check tập trung vào chi phí thật, sức chứa và hạn chế vận hành.",
    sourceLabel: "Quản trị Địa điểm",
    sourceCount: "86 dòng dữ liệu nguồn · 14 điểm kiểm tra",
    color: "blue",
    tasks: [
      { title: "Đánh giá vị trí, giao thông và lối vào venue", category: "Venue", priority: "high" },
      { title: "Kiểm tra bãi xe, an ninh và phí gửi xe", category: "Venue" },
      { title: "Xác nhận sức chứa khu vows và sảnh tiệc", category: "Venue", priority: "high" },
      { title: "Kiểm tra phương án trong nhà khi trời mưa", category: "Venue", priority: "high" },
      { title: "Đánh giá khoảng cách bàn, trần và điểm block view", category: "Venue" },
      { title: "Xin menu, giá mỗi khách và số khách tối thiểu", category: "Venue", priority: "high" },
      { title: "Xác nhận VAT, service charge và phí ngoài giờ", category: "Venue", priority: "high" },
      { title: "Kiểm tra chính sách đồ uống và phí corkage", category: "Venue" },
      { title: "Kiểm tra phí mang decor và thời gian setup", category: "Venue" },
      { title: "Kiểm tra hệ thống âm thanh, ánh sáng và phí mang ngoài", category: "Venue" },
      { title: "Kiểm tra phòng thay đồ và khu vực làm lễ truyền thống", category: "Venue" },
      { title: "Yêu cầu thử món và ghi nhận chất lượng phục vụ", category: "Venue" },
      { title: "Lập bảng so sánh tổng chi phí trước và sau thuế", category: "Venue", priority: "high" },
      { title: "Ghi lại các quy định và hạn chế của venue", category: "Venue" },
    ],
  },
  {
    id: "seating-plan",
    title: "Seating plan",
    eyebrow: "12 BÀN MẪU",
    description: "Luồng chốt danh sách khách, nhóm quan hệ và bố trí bàn tiệc.",
    sourceLabel: "Seating Chart",
    sourceCount: "172 vị trí mẫu · 8 việc triển khai",
    color: "orange",
    tasks: [
      { title: "Chốt số khách đã RSVP", category: "Seating", priority: "high", daysBeforeWedding: 30 },
      { title: "Xác nhận sức chứa mỗi bàn với venue", category: "Seating", priority: "high", daysBeforeWedding: 28 },
      { title: "Nhóm khách theo gia đình, bạn bè và đồng nghiệp", category: "Seating", daysBeforeWedding: 25 },
      { title: "Xác định bàn gia đình và khách VIP", category: "Seating", priority: "high", daysBeforeWedding: 21 },
      { title: "Bố trí trẻ em, người lớn tuổi và khách cần hỗ trợ", category: "Seating", daysBeforeWedding: 18 },
      { title: "Review sơ đồ bàn với hai gia đình", category: "Seating", daysBeforeWedding: 14 },
      { title: "Gửi seating plan cuối cho venue và planner", category: "Seating", priority: "high", daysBeforeWedding: 7 },
      { title: "In sơ đồ chỗ ngồi và thẻ tên", category: "Seating", daysBeforeWedding: 5 },
    ],
  },
];

export const guidebookPackById = Object.fromEntries(guidebookPacks.map((pack) => [pack.id, pack])) as Record<string, GuidebookPack>;
