import type { Metadata } from "next";
import { InfoPage } from "../../components/InfoPage";

export const metadata: Metadata = { title: "Thanh toán & hoàn tiền", description: "Cách the two ghi nhận đặt cọc, thanh toán, hủy và hoàn tiền." };

export default function Page() {
  return <InfoPage eyebrow="THANH TOÁN & HOÀN TIỀN" title="Mọi khoản tiền đều có trạng thái kiểm chứng được" intro="Thanh toán qua the two sẽ được mở theo từng giai đoạn. Trang này giải thích quy tắc áp dụng khi tính năng được bật." updated="31/10/2026" sections={[
    { title: "Hiện tại", body: "the two chưa thu tiền đặt cọc hay thanh toán dịch vụ thay vendor. Khi bạn gửi brief, mọi thỏa thuận thanh toán diễn ra trực tiếp giữa bạn và vendor theo hợp đồng của vendor." },
    { title: "Khi thanh toán qua the two được bật", body: ["Phí dịch vụ (nếu có) luôn hiển thị rõ trước bước thanh toán.", "Một trang “thanh toán thành công” hoặc ảnh chụp biên lai không đủ để xác nhận; trạng thái chỉ đổi khi cổng thanh toán gửi xác nhận.", "Bạn nhận biên nhận điện tử cho mỗi khoản đã xác minh."] },
    { title: "Hủy và hoàn tiền", body: ["Điều kiện hoàn cọc theo chính sách hủy ghi trong báo giá/hợp đồng của vendor — bạn xem được trước khi đặt cọc.", "Yêu cầu hủy giữ nguyên lịch sử booking và thanh toán để đối chiếu.", "Khoản hoàn được trả về phương thức thanh toán ban đầu; thời gian phụ thuộc ngân hàng/cổng thanh toán."] },
    { title: "Tranh chấp", body: "Nếu vendor không thực hiện đúng phạm vi đã thỏa thuận, hãy mở yêu cầu hỗ trợ kèm mã booking và bằng chứng. the two làm trung gian đối chiếu hai phía và phản hồi trong 5 ngày làm việc.", links: [{ href: "/help", label: "Trung tâm hỗ trợ" }] },
  ]}/>;
}
