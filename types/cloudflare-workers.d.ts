declare module "cloudflare:workers" {
  export const env: {
    DB: any;
    PAYMENT_WEBHOOK_SECRET?: string;
  };
}
