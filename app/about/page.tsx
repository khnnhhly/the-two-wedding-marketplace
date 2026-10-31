import type { Metadata } from "next";
import { InfoPage } from "../components/InfoPage";

export const metadata: Metadata = { title: "Giới thiệu", description: "the two kết nối planning workspace với vendor marketplace cho đám cưới tại Việt Nam." };

export default function Page() {
  return <InfoPage eyebrow="VỀ THE TWO" title="Wedding marketplace, made clear." intro="the two kết nối planning workspace với vendor marketplace để cả cặp đôi lẫn nhà cung cấp cùng nhìn thấy một quy trình rõ ràng — từ cầu hôn, đám cưới tới những ngày kỷ niệm." sections={[
    { title: "Một sản phẩm, hai hành trình", body: "Cặp đôi đi từ brief đến planning, inquiry và booking; vendor đi từ onboarding đến listing, inquiry và vận hành kinh doanh." },
    { title: "Chất lượng trước số lượng", body: "Mỗi vendor được xét duyệt trước khi lên sàn. Chúng tôi công bố đúng số vendor đang có và mở rộng dần theo khu vực." },
    { title: "Minh bạch về tiền", body: "Review và thứ hạng độc lập với việc vendor trả phí; nội dung tài trợ luôn được gắn nhãn; vendor xem được log tính phí của mình." },
  ]}/>;
}
