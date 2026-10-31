 
import { CONTACT_EMAIL } from "../lib/site";

/** Confirmation shown after a public submission; offers an email copy when the server could not deliver it. */
export function LeadSuccess({ id, delivered, subject, body, title, next }: { id: string; delivered: boolean; subject: string; body: string; title: string; next: { href: string; label: string } }) {
  const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`${subject} ${id}`)}&body=${encodeURIComponent(`${body}\n\nMã tham chiếu: ${id}`)}`;
  return <div className="lead-success" role="status">
    <b>✓</b>
    <p className="eyebrow">MÃ THAM CHIẾU · {id}</p>
    <h2>{title}</h2>
    {delivered
      ? <p>the two đã nhận thông tin và sẽ phản hồi qua email trong 1–2 ngày làm việc. Hãy lưu mã tham chiếu ở trên để tra cứu khi cần.</p>
      : <><p><strong>Bước cuối:</strong> hệ thống đã ghi nhận mã của bạn, nhưng email thông báo tự động đang tạm dừng. Bấm nút dưới để gửi bản sao qua email — nội dung đã được điền sẵn.</p><a className="primary-market-btn orange" href={mailto}>Gửi bản sao qua email →</a></>}
    <a className="text-action" href={next.href}>{next.label}</a>
  </div>;
}

export function ConsentField({ checked, onChange, children }: { checked: boolean; onChange: (value: boolean) => void; children: React.ReactNode }) {
  return <label className="consent-check"><input type="checkbox" checked={checked} onChange={event => onChange(event.target.checked)}/><span>{children} Xem <a href="/legal/privacy" target="_blank">chính sách bảo mật</a>.</span></label>;
}
