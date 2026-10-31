"use client";

/* eslint-disable @next/next/no-html-link-for-pages */

import { useState } from "react";

export function HeroModeSwitch() {
  const [mode, setMode] = useState<"buyer" | "vendor">("buyer");
  return <>
    <div className="mode-switch" role="group" aria-label="Bạn là ai?"><button aria-pressed={mode === "buyer"} className={mode === "buyer" ? "active" : ""} onClick={() => setMode("buyer")}>Tôi đang chuẩn bị cưới</button><button aria-pressed={mode === "vendor"} className={mode === "vendor" ? "active" : ""} onClick={() => setMode("vendor")}>Tôi là vendor</button></div>
    {mode === "buyer"
      ? <div className="hero-action-row"><a className="primary-market-btn" href="/planning">Bắt đầu với 3 bước ngắn →</a><a className="secondary-market-btn" href="/vendors">Đã biết mình cần gì? Tra cứu theo category</a></div>
      : <div className="hero-action-row"><a className="primary-market-btn orange" href="/vendor-apply">Gửi hồ sơ mở gian hàng</a><a className="secondary-market-btn" href="/for-vendors">Xem cách hoạt động →</a></div>}
  </>;
}
