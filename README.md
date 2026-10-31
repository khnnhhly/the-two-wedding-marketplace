# the two — wedding marketplace

Marketplace và planning workspace cho đám cưới tại Việt Nam. Next.js 16 (App Router), deploy trên Vercel.

## Chạy local

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run lint
npm test
```

## Cấu trúc

| Thư mục | Nội dung |
| --- | --- |
| `app/page.tsx` | Trang chủ |
| `app/planning` | Flow 3 bước: giai đoạn → thông tin cưới → tạo Workspace |
| `app/workspace` | Workspace (checklist, ngân sách, vendor, guidebook, thông tin cưới). Lưu trên trình duyệt (`localStorage`), logic ở `store.ts` |
| `app/vendors` | Marketplace, trang chi tiết vendor |
| `app/shortlist` | Shortlist & bảng so sánh |
| `app/inquiry`, `app/vendor-apply` | Form gửi brief / đăng ký vendor (không cần tài khoản) |
| `app/api/public/leads` | Nhận brief và hồ sơ vendor, gửi email qua Resend |
| `app/go/[slug]` | Redirect có tracking click (`click_id`, UTM) |
| `app/data` | Dữ liệu vendor, template, guidebook, discovery |
| `app/lib` | Search không dấu, tracking, hằng số site |

## Biến môi trường (Vercel)

| Key | Dùng cho |
| --- | --- |
| `RESEND_API_KEY` | Gửi email brief / hồ sơ vendor cho team |
| `VENDOR_NOTIFICATION_FROM` | Địa chỉ gửi đã xác minh trên Resend, ví dụ `the two <hello@domain.vn>` |
| `VENDOR_NOTIFICATION_TO` | Hộp thư nhận (mặc định `thetwoplanner@gmail.com`) |

Khi chưa cấu hình email, form vẫn hoạt động: lead được ghi vào log Vercel và người dùng được mời gửi bản sao qua email.
