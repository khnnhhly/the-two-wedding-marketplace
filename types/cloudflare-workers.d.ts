/* eslint-disable @typescript-eslint/no-explicit-any */

declare module "cloudflare:workers" {
  export const env: {
    DB: any;
    PAYMENT_WEBHOOK_SECRET?: string;
    RESEND_API_KEY?: string;
    VENDOR_NOTIFICATION_FROM?: string;
    VENDOR_NOTIFICATION_TO?: string;
    VENDOR_ADMIN_EMAILS?: string;
  };
}
