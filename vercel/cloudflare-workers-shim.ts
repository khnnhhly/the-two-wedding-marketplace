const unavailableBinding = new Proxy(
  {},
  {
    get() {
      throw new Error(
        "Cloudflare D1 is not available in the Vercel public marketplace runtime.",
      );
    },
  },
);

export const env = {
  DB: unavailableBinding,
  PAYMENT_WEBHOOK_SECRET: undefined,
  RESEND_API_KEY: undefined,
  VENDOR_NOTIFICATION_FROM: undefined,
  VENDOR_NOTIFICATION_TO: undefined,
  VENDOR_ADMIN_EMAILS: undefined,
};
