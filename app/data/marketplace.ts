export type VendorPackage = { name: string; price: string; includes: string[] };

export type VendorProfile = {
  slug: string;
  listingId: string;
  name: string;
  category: string;
  location: string;
  price: number | null;
  /** Unit for the starting price, e.g. "khách" → "Từ 850.000₫/khách". */
  priceUnit?: string;
  tag: string;
  color: "royal" | "cobalt" | "apricot" | "ivory";
  description: string;
  longDescription: string;
  services: string[];
  packages: VendorPackage[];
  process: string[];
  facts: string[];
  faqs: { question: string; answer: string }[];
  /** Outbound channels. Only verified links are listed; every click goes through /go for attribution. */
  contacts?: { website?: string; instagram?: string; phone?: string };
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
  {
    slug: "lotus-garden-venue",
    listingId: "lst_lotus",
    name: "Lotus Garden Venue",
    category: "Địa điểm",
    location: "Hà Nội",
    price: 850000,
    priceUnit: "khách",
    tag: "Yêu cầu báo giá",
    color: "royal",
    description: "Không gian tiệc trong nhà và ngoài trời cho 150–500 khách.",
    longDescription: "Lotus Garden cung cấp không gian tổ chức, thực đơn và đội vận hành tại chỗ. Báo giá chính thức phụ thuộc ngày cưới, số khách và cấu hình không gian.",
    services: ["Indoor reception", "Garden ceremony", "Menu tasting", "Venue operations"],
    packages: [{ name: "Reception menu", price: "Từ 850.000₫/khách", includes: ["Không gian tiệc", "Thực đơn tiêu chuẩn", "Đội vận hành"] }, { name: "Ceremony + reception", price: "Theo brief", includes: ["Khu làm lễ", "Khu tiệc", "Điều phối venue"] }],
    process: ["Gửi ngày & số khách", "Kiểm tra không gian", "Thử món", "Nhận báo giá"],
    facts: ["Hồ sơ đã xác minh", "Sức chứa 150–500 khách", "Lịch chỉ xác nhận sau inquiry"],
    faqs: [{ question: "Giá khởi điểm được tính thế nào?", answer: "Mức hiển thị là giá tham khảo theo khách; báo giá cuối phụ thuộc thực đơn, ngày và phạm vi dịch vụ." }],
  },
  {
    slug: "an-makeup-studio",
    listingId: "lst_anmakeup",
    name: "An Makeup Studio",
    category: "Makeup",
    location: "Hà Nội · Toàn quốc",
    price: 6500000,
    tag: "Kiểm tra lịch",
    color: "apricot",
    description: "Bridal makeup tự nhiên, có lịch thử và timeline rõ ràng.",
    longDescription: "An Makeup Studio tư vấn phong cách theo trang phục, ánh sáng và timeline ngày cưới. Lịch chỉ được giữ sau khi studio xác nhận availability.",
    services: ["Bridal makeup", "Makeup trial", "Family makeup", "Destination service"],
    packages: [{ name: "Bridal essential", price: "Từ 6.500.000₫", includes: ["Makeup cô dâu", "Hair styling", "Touch-up cơ bản"] }, { name: "Wedding day team", price: "Theo timeline", includes: ["Makeup trial", "Ngày cưới", "Di chuyển theo brief"] }],
    process: ["Gửi ngày & địa điểm", "Chọn style", "Thử makeup", "Xác nhận lịch"],
    facts: ["Hồ sơ đã xác minh", "Có makeup trial", "Phục vụ destination theo brief"],
    faqs: [{ question: "Inquiry có giữ lịch không?", answer: "Không. Studio sẽ kiểm tra lịch và gửi điều kiện xác nhận riêng." }],
  },
  {
    slug: "papier-story",
    listingId: "lst_papier",
    name: "Papier Story",
    category: "Thiệp & Quà",
    location: "Toàn quốc",
    price: 35000,
    priceUnit: "bộ",
    tag: "Đặt theo số lượng",
    color: "ivory",
    description: "Thiệp cưới và quà cảm ơn đồng bộ theo concept.",
    longDescription: "Papier Story thiết kế hệ thống stationery từ save-the-date đến menu và quà cảm ơn. Timeline sản xuất được xác nhận theo số lượng và kỹ thuật in.",
    services: ["Invitation suite", "Day-of stationery", "Thank-you gifts", "Custom illustration"],
    packages: [{ name: "Invitation suite", price: "Từ 35.000₫/bộ", includes: ["Thiệp chính", "Phong bì", "Chỉnh sửa nội dung"] }, { name: "Full stationery", price: "Theo số lượng", includes: ["Invitation", "Menu & place card", "Thank-you card"] }],
    process: ["Chọn phạm vi", "Duyệt thiết kế", "Duyệt mẫu in", "Sản xuất & giao"],
    facts: ["Hồ sơ đã xác minh", "Giao hàng toàn quốc", "Có bước duyệt mẫu trước sản xuất"],
    faqs: [{ question: "Thời gian sản xuất bao lâu?", answer: "Timeline phụ thuộc số lượng và kỹ thuật in; vendor sẽ xác nhận trong báo giá." }],
  },
  {
    slug: "the-band-society",
    listingId: "lst_band",
    name: "The Band Society",
    category: "Giải trí",
    location: "TP. Hồ Chí Minh · Toàn quốc",
    price: 22000000,
    tag: "Kiểm tra lịch",
    color: "cobalt",
    description: "Live band và âm nhạc sự kiện theo format tiệc cưới.",
    longDescription: "The Band Society xây setlist và đội hình theo không gian, thời lượng chương trình và yêu cầu kỹ thuật của venue.",
    services: ["Live band", "Acoustic ceremony", "DJ set", "Sound coordination"],
    packages: [{ name: "Acoustic set", price: "Từ 22.000.000₫", includes: ["Đội hình 3 người", "02 set biểu diễn", "Setlist tư vấn"] }, { name: "Full reception", price: "Theo format", includes: ["Live band", "MC/DJ option", "Technical rider"] }],
    process: ["Gửi rundown", "Chọn đội hình", "Duyệt setlist", "Xác nhận kỹ thuật"],
    facts: ["Hồ sơ đã xác minh", "Có technical rider", "Nhận destination theo lịch"],
    faqs: [{ question: "Venue cần chuẩn bị gì?", answer: "Vendor sẽ gửi technical rider sau khi thống nhất đội hình và phạm vi." }],
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

export const money = (value: number | null, unit?: string) => value == null ? "Liên hệ báo giá" : `Từ ${new Intl.NumberFormat("vi-VN").format(value)}₫${unit ? `/${unit}` : ""}`;

export const vendorPrice = (vendor: Pick<VendorProfile, "price" | "priceUnit">) => money(vendor.price, vendor.priceUnit);

export const findVendor = (slug: string) => vendors.find(vendor => vendor.slug === slug);
