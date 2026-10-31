export const SITE_URL = "https://the-two-wedding-marketplace.vercel.app";
export const SITE_NAME = "the two";

/** Team inbox that receives briefs and vendor applications. */
export const CONTACT_EMAIL = "thetwoplanner@gmail.com";

/** Account features (Workspace, Vendor Center) still run on the Sites deployment. */
export const ACCOUNT_PATHS = { workspace: "/workspace", vendorCenter: "/vendor-center" } as const;

export const loginPath = (next: string) => `/login?next=${encodeURIComponent(next)}`;
