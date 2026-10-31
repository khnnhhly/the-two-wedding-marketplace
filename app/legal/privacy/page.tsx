import type { Metadata } from "next";
import { InfoPage } from "../../components/InfoPage";
import { CONTACT_EMAIL } from "../../lib/site";

export const metadata: Metadata = { title: "Chính sách bảo mật dữ liệu", description: "Cách the two thu thập, sử dụng, chia sẻ và bảo vệ dữ liệu cá nhân theo Nghị định 13/2023/NĐ-CP." };

export default function Page() {
  return <InfoPage eyebrow="BẢO MẬT DỮ LIỆU" title="Dữ liệu của bạn, quyền của bạn" intro="Chính sách này giải thích the two xử lý dữ liệu cá nhân như thế nào, căn cứ Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân." updated="31/10/2026" note="Chính sách đang trong giai đoạn thử nghiệm sản phẩm và sẽ được rà soát pháp lý trước khi ra mắt chính thức." sections={[
    { title: "Dữ liệu the two thu thập", body: ["Thông tin liên hệ: tên, email, số điện thoại (nếu bạn cung cấp).", "Thông tin cưới trong brief: địa điểm, thời gian, số khách, ngân sách, phong cách, nhu cầu.", "Thông tin vendor: tên doanh nghiệp, khu vực, website, mô tả dịch vụ, người liên hệ.", "Dữ liệu kỹ thuật: mã click, trang nguồn, loại trình duyệt — dùng để đo lường và chống gian lận, không dùng để định danh quảng cáo.", "Dữ liệu lưu trên trình duyệt của bạn (shortlist, câu trả lời 3 bước) — chỉ nằm trên thiết bị, the two không nhận được cho tới khi bạn gửi brief."] },
    { title: "Mục đích xử lý", body: ["Chuyển brief tới vendor bạn chọn để tư vấn và báo giá.", "Xét duyệt hồ sơ vendor và vận hành marketplace.", "Tính phí minh bạch cho vendor (click, lead, booking) và phát hiện click/review bất thường.", "Gửi thông báo liên quan trực tiếp tới yêu cầu của bạn. the two chỉ gửi email marketing khi bạn đồng ý riêng."] },
    { title: "Sự đồng ý", body: "the two chỉ chia sẻ brief với vendor khi bạn tích chọn đồng ý trên form. Bạn có thể rút lại sự đồng ý bất kỳ lúc nào; việc rút lại không ảnh hưởng tới xử lý đã thực hiện trước đó." },
    { title: "Chia sẻ dữ liệu", body: ["Vendor bạn chọn: nhận nội dung brief và thông tin liên hệ.", "Nhà cung cấp hạ tầng: hosting, email giao dịch, cổng thanh toán — chỉ trong phạm vi cần thiết.", "Cơ quan nhà nước có thẩm quyền khi pháp luật yêu cầu.", "the two không bán dữ liệu cá nhân của cặp đôi hoặc vendor."] },
    { title: "Lưu trữ và bảo mật", body: "Dữ liệu brief được lưu trong thời gian cần thiết để phục vụ yêu cầu và tối đa 24 tháng sau lần tương tác cuối, trừ khi pháp luật yêu cầu lâu hơn (ví dụ chứng từ thanh toán). Dữ liệu được truyền qua HTTPS và chỉ nhân sự có nhiệm vụ mới được truy cập." },
    { title: "Quyền của bạn", body: ["Được biết, truy cập, chỉnh sửa và yêu cầu xóa dữ liệu của mình.", "Phản đối hoặc hạn chế xử lý; rút lại sự đồng ý.", "Khiếu nại tới the two hoặc cơ quan có thẩm quyền.", `Gửi yêu cầu tới ${CONTACT_EMAIL}; the two phản hồi trong vòng 72 giờ làm việc.`] },
  ]}/>;
}
