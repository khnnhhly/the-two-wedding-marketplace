 
import type { Metadata } from "next";
import { InfoPage } from "../../components/InfoPage";

export const metadata: Metadata = { title: "Bảng phí cho vendor & cách tính", description: "Các khoản phí vendor trên the two: CPC, phí lead, hoa hồng booking, subscription, sponsored placement và nguyên tắc tính phí." };

const plans = [
  { name: "Free", price: "0₫", features: ["1 listing cơ bản", "Nhận brief qua email", "Thống kê lượt xem cơ bản"] },
  { name: "Pro", price: "Công bố khi mở bán", features: ["Nhiều listing & gói dịch vụ", "Analytics: impression → click → lead → booking", "Quản lý pipeline lead"] },
  { name: "Premium", price: "Công bố khi mở bán", features: ["Công cụ AI & tự động hóa", "Ưu tiên hiển thị có gắn nhãn “Được tài trợ”", "Hỗ trợ riêng"] },
];

export default function Page() {
  return <InfoPage eyebrow="BẢNG PHÍ CHO VENDOR" title="Trả phí cho kết quả, không trả hai lần" intro="Trong giai đoạn đầu, đăng ký và nhận brief đều miễn phí. Khi bắt đầu tính phí, the two thông báo trước ít nhất 30 ngày và chỉ áp dụng cho vendor đồng ý." updated="31/10/2026" sections={[
    { title: "Cost per qualified click (CPC)", body: ["Tính khi cặp đôi bấm sang website, Instagram, điện thoại hoặc kênh liên hệ của vendor.", "Chỉ tính click duy nhất trong 24 giờ từ người dùng thật — không tính bot, click trùng hoặc click từ chính vendor.", "Đơn giá có thể khác nhau theo category và khu vực, hiển thị trong Vendor Center trước khi áp dụng."] },
    { title: "Cost per qualified lead", body: ["Thay cho CPC khi cặp đôi gửi brief đạt điều kiện: có địa điểm, nhu cầu cụ thể và email hợp lệ.", "Vendor có thể khiếu nại lead không hợp lệ trong 7 ngày để được hoàn phí."] },
    { title: "Booking commission", body: ["Chỉ tính trên booking được xác nhận và thanh toán qua the two, khi có khoản thanh toán đã được cổng thanh toán xác minh.", "Booking trực tiếp ngoài nền tảng chỉ tính CPC hoặc phí lead, trừ khi có thỏa thuận revenue-share riêng.", "Nếu một click/lead sau đó thành booking trên the two, phí click/lead được khấu trừ vào commission."] },
    { title: "Sponsored placement", body: "Vendor có thể trả phí để xuất hiện nổi bật trong category hoặc campaign. Vị trí này luôn gắn nhãn “Được tài trợ” và không ảnh hưởng tới điểm review hay thứ hạng tự nhiên." },
    { title: "Minh bạch", body: ["Vendor xem được log từng click/lead/booking: thời gian, nguồn, vị trí CTA và mã click.", "Mỗi lead mang mã tham chiếu để đối chiếu với CRM của vendor.", "the two không bán dữ liệu cá nhân của cặp đôi."], links: [{ href: "/vendor-apply", label: "Gửi hồ sơ vendor" }] },
  ]}>
    <section className="market-shell plan-grid">{plans.map(plan => <article key={plan.name}><p className="eyebrow">GÓI {plan.name.toUpperCase()}</p><h2>{plan.name}</h2><strong>{plan.price}</strong><ul>{plan.features.map(feature => <li key={feature}>✓ {feature}</li>)}</ul></article>)}</section>
  </InfoPage>;
}
