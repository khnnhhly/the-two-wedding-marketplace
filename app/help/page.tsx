 
import type { Metadata } from "next";
import { InfoPage } from "../components/InfoPage";
import { CONTACT_EMAIL } from "../lib/site";

export const metadata: Metadata = { title: "Trung tâm hỗ trợ", description: "Câu hỏi thường gặp và cách liên hệ the two." };

const faqs = [
  ["Gửi brief có mất phí không?", "Không. Gửi brief cho vendor hoàn toàn miễn phí và không cần tạo tài khoản."],
  ["Gửi brief có giữ lịch không?", "Chưa. Vendor kiểm tra lịch và gửi báo giá; lịch chỉ được giữ khi bạn xác nhận booking theo điều kiện của vendor."],
  ["Shortlist được lưu ở đâu?", "Trên trình duyệt bạn đang dùng. Đăng nhập Workspace để đồng bộ và chia sẻ với partner, gia đình."],
  ["Bao lâu vendor phản hồi?", "Thường trong 1–2 ngày làm việc. Nếu quá 3 ngày chưa có phản hồi, hãy email cho the two kèm mã brief."],
  ["Làm sao để vendor được duyệt nhanh?", "Cung cấp portfolio/website đang hoạt động, khu vực phục vụ rõ ràng và mô tả cụ thể phạm vi nhận việc."],
];

export default function Page() {
  return <InfoPage eyebrow="TRUNG TÂM HỖ TRỢ" title="Bạn đang ở bước nào?" intro="Chọn đúng khu vực để tiếp tục flow, hoặc liên hệ trực tiếp với đội ngũ the two." sections={[
    { title: "Hỗ trợ cặp đôi", body: "Trả lời 3 bước để biết nên tra cứu gì trước, lưu vendor vào shortlist để so sánh, rồi gửi brief miễn phí.", links: [{ href: "/planning", label: "Bắt đầu 3 bước" }, { href: "/shortlist", label: "Shortlist & so sánh" }, { href: "/inquiry", label: "Gửi brief để the two tìm giúp" }] },
    { title: "Hỗ trợ vendor", body: "Gửi hồ sơ không cần tài khoản; the two xét duyệt rồi liên hệ hoàn thiện listing.", links: [{ href: "/vendor-apply", label: "Gửi hồ sơ vendor" }, { href: "/policies/fees", label: "Bảng phí & cách tính" }] },
    { title: "Booking, thanh toán & review", body: "Quy tắc đặt cọc, hủy, hoàn tiền và cách review được xác minh.", links: [{ href: "/policies/payments", label: "Thanh toán & hoàn tiền" }, { href: "/policies/reviews", label: "Chính sách review" }] },
  ]}>
    <section className="market-shell help-extra"><div className="faq-list">{faqs.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div><aside className="contact-card"><p className="eyebrow">LIÊN HỆ</p><h2>Cần người thật hỗ trợ?</h2><p>Email kèm mã brief hoặc mã hồ sơ (nếu có). the two phản hồi trong giờ hành chính, thứ 2 – thứ 6.</p><a className="primary-market-btn orange" href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("[the two] Cần hỗ trợ")}`}>{CONTACT_EMAIL}</a></aside></section>
  </InfoPage>;
}
