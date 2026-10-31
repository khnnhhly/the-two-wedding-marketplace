import type { MetadataRoute } from "next";
import { templates, vendors } from "./data/marketplace";
import { SITE_URL } from "./lib/site";

const staticPaths = ["", "/vendors", "/planning", "/templates", "/services/planning", "/guidebook", "/for-vendors", "/vendor-apply", "/inquiry", "/help", "/about", "/policies/fees", "/policies/payments", "/policies/reviews", "/legal/terms", "/legal/privacy"];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...staticPaths.map(path => ({ url: `${SITE_URL}${path}`, changeFrequency: "weekly" as const, priority: path === "" ? 1 : 0.7 })),
    ...vendors.map(vendor => ({ url: `${SITE_URL}/vendors/${vendor.slug}`, changeFrequency: "weekly" as const, priority: 0.8 })),
    ...templates.map(item => ({ url: `${SITE_URL}/templates/${item.slug}`, changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
