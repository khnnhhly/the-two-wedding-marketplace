import type { Metadata } from "next";
import { InfoPage } from "../../components/InfoPage";

export const metadata: Metadata = { title: "Chính sách review", description: "Cách the two xác minh, kiểm duyệt và hiển thị review vendor." };

export default function Page() {
  return <InfoPage eyebrow="CHÍNH SÁCH REVIEW" title="Review chỉ có giá trị khi là thật" intro="the two mở review theo từng giai đoạn. Hiện chưa vendor nào có review — the two không nhập review từ nguồn khác và không tạo review mẫu." updated="31/10/2026" sections={[
    { title: "Ba loại review", body: ["Verified booking — booking và thanh toán diễn ra trên the two.", "Verified off-platform — cặp đôi đi từ the two nhưng book trực tiếp, có mã click, mã brief hoặc bằng chứng dịch vụ.", "Unverified — chỉ hiển thị sau kiểm duyệt và luôn gắn nhãn rõ ràng."] },
    { title: "Nội dung được đánh giá", body: ["Chất lượng dịch vụ, giao tiếp & phản hồi, đúng giờ.", "Giá trị so với chi phí, mức độ đúng với portfolio, khả năng xử lý sự cố.", "Hình ảnh thực tế và nhận xét; vendor được phản hồi công khai."] },
    { title: "Nguyên tắc", body: ["Chỉ người đã sử dụng dịch vụ mới được review; vendor không được tự tạo review.", "Sponsored placement không ảnh hưởng điểm review.", "Lưu lịch sử chỉnh sửa; có quy trình báo cáo, phản hồi và tranh chấp.", "Không xóa review tiêu cực chỉ vì vendor yêu cầu."] },
  ]}/>;
}
