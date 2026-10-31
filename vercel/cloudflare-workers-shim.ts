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
};
