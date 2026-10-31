import type { Metadata } from "next";
import { InfoPage } from "../../components/InfoPage";
import { CONTACT_EMAIL } from "../../lib/site";

export const metadata: Metadata = { title: "Điều khoản sử dụng", description: "Điều khoản sử dụng marketplace the two dành cho cặp đôi và vendor." };

export default function Page() {
  return <InfoPage eyebrow="ĐIỀU KHOẢN" title="Điều khoản sử dụng the two" intro="Các điều khoản này áp dụng khi bạn truy cập website, gửi brief, đăng ký vendor hoặc sử dụng Workspace và Vendor Center." updated="31/10/2026" note="Bản điều khoản này đang trong giai đoạn thử nghiệm sản phẩm và sẽ được rà soát bởi luật sư trước khi the two thu phí hoặc xử lý thanh toán." sections={[
    { title: "Phạm vi dịch vụ", body: "the two là nền tảng kết nối cặp đôi với nhà cung cấp dịch vụ cưới (vendor) và cung cấp công cụ lập kế hoạch. the two không phải bên cung cấp dịch vụ cưới, trừ khi được ghi rõ là dịch vụ do the two thực hiện (ví dụ dịch vụ planning)." },
    { title: "Tài khoản và thông tin", body: ["Bạn chịu trách nhiệm về tính chính xác của thông tin cung cấp và bảo mật quyền truy cập tài khoản.", "Không sử dụng the two để gửi thông tin sai lệch, spam, quấy rối hoặc vi phạm pháp luật.", "the two có thể tạm khóa tài khoản vi phạm sau khi thông báo, trừ trường hợp cần ngăn chặn thiệt hại ngay."] },
    { title: "Brief, báo giá và booking", body: ["Brief (inquiry) là yêu cầu tư vấn miễn phí, không tạo nghĩa vụ cho hai bên và không giữ lịch.", "Báo giá chỉ có hiệu lực theo thời hạn và phạm vi vendor ghi trong báo giá.", "Booking chỉ được xác lập khi cặp đôi chấp nhận báo giá hợp lệ và hoàn tất điều kiện xác nhận (ví dụ đặt cọc đã được cổng thanh toán xác minh).", "Hợp đồng dịch vụ là thỏa thuận giữa cặp đôi và vendor; the two hỗ trợ lưu trữ và giải quyết tranh chấp theo chính sách."] },
    { title: "Nghĩa vụ của vendor", body: ["Cung cấp thông tin doanh nghiệp, giá và portfolio đúng sự thật; chỉ đăng hình ảnh do mình thực hiện hoặc có quyền sử dụng.", "Không tự tạo, mua hoặc ép review; không thu thập dữ liệu cặp đôi cho mục đích ngoài phạm vi brief.", "Thanh toán các khoản phí theo bảng phí đã công bố và được xem log tính phí của mình."], links: [{ href: "/policies/fees", label: "Bảng phí & cách tính" }] },
    { title: "Nội dung và review", body: "Review phải phản ánh trải nghiệm thật. the two có quyền kiểm duyệt, gắn nhãn hoặc gỡ nội dung vi phạm, nhưng không gỡ review tiêu cực chỉ vì vendor yêu cầu.", links: [{ href: "/policies/reviews", label: "Chính sách review" }] },
    { title: "Giới hạn trách nhiệm", body: "the two nỗ lực xác minh vendor trước khi xuất bản nhưng không bảo đảm kết quả dịch vụ của vendor. Trong phạm vi pháp luật cho phép, trách nhiệm của the two giới hạn ở khoản phí bạn đã trả cho the two liên quan đến giao dịch phát sinh tranh chấp." },
    { title: "Thay đổi và liên hệ", body: `Khi điều khoản thay đổi đáng kể, the two thông báo trước trên website hoặc qua email. Mọi câu hỏi gửi về ${CONTACT_EMAIL}. Điều khoản được điều chỉnh bởi pháp luật Việt Nam.` },
  ]}/>;
}
