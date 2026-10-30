export type VendorPackage = { name: string; price: string; includes: string[] };

export type VendorProfile = {
  slug: string;
  listingId: string;
  name: string;
  category: string;
  location: string;
  price: number | null;
  tag: string;
  color: "royal" | "cobalt" | "apricot" | "ivory";
  description: string;
  longDescription: string;
  services: string[];
  packages: VendorPackage[];
  process: string[];
  facts: string[];
  faqs: { question: string; answer: string }[];
};

export const vendors: VendorProfile[] = [
  {
    slug: "the-planners",
    listingId: "lst_theplanners",
    name: "The Planners",
    category: "Wedding Planner",
    location: "Hà Nội · TP.HCM",
    price: null,
    tag: "Tư vấn trước",
    color: "royal",
    description: "Lập kế hoạch và điều phối đám cưới trọn gói.",
    longDescription: "Đội ngũ planning đồng hành từ định hình concept, kiểm soát ngân sách đến điều phối ngày cưới. Mỗi dự án bắt đầu bằng một buổi tư vấn để hai bên thống nhất phạm vi và cách làm việc.",
    services: ["Full wedding planning", "Wedding day coordination", "Concept & vendor sourcing", "Budget control"],
    packages: [
      { name: "Tư vấn chiến lược", price: "Liên hệ", includes: ["Buổi tư vấn 90 phút", "Roadmap ưu tiên", "Khuyến nghị ngân sách"] },
      { name: "Full planning", price: "Báo giá theo brief", includes: ["Quản lý toàn bộ kế hoạch", "Điều phối vendor", "Vận hành ngày cưới"] },
    ],
    process: ["Gửi brief", "Tư vấn & làm rõ phạm vi", "Nhận đề xuất", "Xác nhận hợp tác"],
    facts: ["Hồ sơ đã xác minh", "Phục vụ Hà Nội và TP.HCM", "Chỉ nhận dự án sau buổi tư vấn"],
    faqs: [{ question: "Bao lâu sẽ nhận phản hồi?", answer: "Vendor phản hồi inquiry trong Vendor Center; thời gian cụ thể phụ thuộc lịch làm việc và brief." }, { question: "Gửi inquiry có tạo booking không?", answer: "Không. Booking chỉ được tạo sau khi hai bạn chấp nhận báo giá còn hiệu lực." }],
  },
  {
    slug: "lumiere-studio",
    listingId: "lst_lumiere",
    name: "Lumière Studio",
    category: "Photo & Film",
    location: "Hà Nội",
    price: 18000000,
    tag: "Yêu cầu báo giá",
    color: "cobalt",
    description: "Phóng sự cưới tự nhiên, giàu cảm xúc.",
    longDescription: "Lumière tập trung vào khoảnh khắc thật, nhịp kể chuyện tự nhiên và màu sắc bền với thời gian. Gói dịch vụ được điều chỉnh theo địa điểm, thời lượng và số lượng sự kiện.",
    services: ["Wedding photography", "Wedding film", "Pre-wedding", "Same-day edit"],
    packages: [{ name: "Wedding story", price: "Từ 18.000.000₫", includes: ["01 photographer", "Chụp trong ngày", "Album ảnh chọn lọc"] }, { name: "Photo + Film", price: "Theo brief", includes: ["Photo team", "Highlight film", "Lưu trữ file bàn giao"] }],
    process: ["Gửi ngày cưới", "Kiểm tra lịch", "Chốt phạm vi", "Nhận báo giá"],
    facts: ["Hồ sơ đã xác minh", "Giá khởi điểm đã công bố", "Availability chỉ xác nhận sau inquiry"],
    faqs: [{ question: "Giá khởi điểm gồm những gì?", answer: "Trang chi tiết nêu phạm vi tham khảo; báo giá chính thức được lập theo brief và ngày cưới." }],
  },
  {
    slug: "moc-concept",
    listingId: "lst_moc",
    name: "Mộc Concept",
    category: "Trang trí",
    location: "TP. Hồ Chí Minh",
    price: 35000000,
    tag: "Yêu cầu báo giá",
    color: "apricot",
    description: "Concept tinh giản, chất liệu và giàu dấu ấn cá nhân.",
    longDescription: "Mộc xây concept dựa trên không gian thật, câu chuyện của cặp đôi và ngân sách đã thống nhất. Mọi hạng mục phát sinh được làm rõ trước khi triển khai.",
    services: ["Concept design", "Ceremony styling", "Reception decoration", "Floral design"],
    packages: [{ name: "Essential styling", price: "Từ 35.000.000₫", includes: ["Moodboard", "Khu vực đón khách", "Bàn gallery"] }, { name: "Signature concept", price: "Theo không gian", includes: ["Thiết kế tổng thể", "Sản xuất & thi công", "Giám sát hiện trường"] }],
    process: ["Chia sẻ venue & ngân sách", "Nhận mood direction", "Duyệt phạm vi", "Thi công"],
    facts: ["Hồ sơ đã xác minh", "Giá khởi điểm theo gói", "Phát sinh cần được duyệt"],
    faqs: [{ question: "Có thể làm theo ngân sách cố định không?", answer: "Có. Hãy ghi rõ khoảng ngân sách trong brief để vendor đề xuất phạm vi phù hợp." }],
  },
  {
    slug: "maison-de-blanc",
    listingId: "lst_maison",
    name: "Maison de Blanc",
    category: "Trang phục",
    location: "Toàn quốc",
    price: 12000000,
    tag: "Đặt lịch thử",
    color: "ivory",
    description: "Bridal studio với phom dáng hiện đại và thanh lịch.",
    longDescription: "Maison de Blanc phát triển trải nghiệm thử váy có tư vấn, ghi chú số đo và lịch fitting rõ ràng. Mỗi booking được xác nhận sau khi studio kiểm tra lịch hẹn.",
    services: ["Bridal fitting", "Dress rental", "Made-to-measure", "Accessories"],
    packages: [{ name: "Bridal fitting", price: "Miễn phí tư vấn", includes: ["Lịch hẹn riêng", "Tư vấn phom dáng", "Ghi chú mẫu yêu thích"] }, { name: "Signature dress", price: "Từ 12.000.000₫", includes: ["01 thiết kế", "Fitting theo lịch", "Điều chỉnh cơ bản"] }],
    process: ["Chọn nhu cầu", "Đặt lịch thử", "Xác nhận mẫu", "Fitting & bàn giao"],
    facts: ["Hồ sơ đã xác minh", "Lịch thử cần được xác nhận", "Phạm vi phục vụ toàn quốc"],
    faqs: [{ question: "Gửi yêu cầu có giữ lịch không?", answer: "Chưa. Lịch chỉ được giữ khi studio xác nhận booking theo quy trình." }],
  },
];

export type TemplateProduct = {
  slug: string;
  packId: string;
  name: string;
  meta: string;
  price: string;
  tone: string;
  description: string;
  outcomes: string[];
  sections: string[];
};

export const templates: TemplateProduct[] = [
  { slug: "wedding-master-planner", packId: "master-timeline", name: "Wedding Master Planner", meta: "Timeline · checklist", price: "Có trong Workspace", tone: "p-blue", description: "Khung kế hoạch tổng thể từ lúc bắt đầu đến ngày cưới.", outcomes: ["Biết việc nào cần làm trước", "Có mốc thời gian theo ngày cưới", "Theo dõi tiến độ trong một nơi"], sections: ["12-month timeline", "Priority checklist", "Decision log"] },
  { slug: "budget-planner", packId: "budget-blueprint", name: "Budget Planner", meta: "Ngân sách · phân bổ", price: "Có trong Workspace", tone: "p-orange", description: "Blueprint phân bổ ngân sách theo nhóm chi phí thực tế.", outcomes: ["Phân bổ tổng ngân sách", "Nhìn rõ hạng mục lớn", "Tránh nhầm dự kiến với đã thanh toán"], sections: ["Budget categories", "Allocation guide", "Payment safety notes"] },
  { slug: "wedding-day-rundown", packId: "d7-final-check", name: "Wedding Day Rundown", meta: "D-7 · vận hành", price: "Có trong Workspace", tone: "p-obsidian", description: "Checklist tuần cuối và luồng vận hành cho ngày cưới.", outcomes: ["Chốt các đầu mối", "Giảm việc quên ở tuần cuối", "Phân công rõ người phụ trách"], sections: ["D-7 checklist", "Vendor handoff", "Emergency kit"] },
  { slug: "vendor-comparison-kit", packId: "venue-review", name: "Vendor Comparison Kit", meta: "So sánh · ra quyết định", price: "Có trong Workspace", tone: "p-ivory", description: "Bộ câu hỏi và tiêu chí giúp so sánh venue, vendor có căn cứ.", outcomes: ["So sánh cùng một tiêu chí", "Nhìn ra chi phí ẩn", "Lưu quyết định vào kế hoạch"], sections: ["Venue review", "Cost comparison", "Decision notes"] },
  { slug: "guest-seating-planner", packId: "seating-plan", name: "Guest & Seating Planner", meta: "Khách mời · bàn tiệc", price: "Có trong Workspace", tone: "p-blue", description: "Luồng từ RSVP đến sơ đồ bàn tiệc cuối cùng.", outcomes: ["Nhóm khách có hệ thống", "Theo dõi sức chứa", "Bàn giao seating plan đúng hạn"], sections: ["Guest groups", "Table capacity", "Final handoff"] },
  { slug: "complete-wedding-checklist", packId: "general-checklist", name: "Complete Wedding Checklist", meta: "Checklist · ưu tiên", price: "Có trong Workspace", tone: "p-orange", description: "Checklist nền tảng để bắt đầu khi hai bạn chưa biết nên làm gì trước.", outcomes: ["Có điểm bắt đầu rõ ràng", "Phân loại theo ưu tiên", "Tùy chỉnh theo đám cưới của bạn"], sections: ["Planning basics", "Vendor checklist", "Personal details"] },
];

export const money = (value: number | null) => value == null ? "Liên hệ báo giá" : `Từ ${new Intl.NumberFormat("vi-VN").format(value)}₫`;
