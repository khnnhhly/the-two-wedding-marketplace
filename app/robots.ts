import type { MetadataRoute } from "next";
import { SITE_URL } from "./lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/go/", "/api/", "/login", "/workspace", "/vendor-center", "/admin", "/shortlist"] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
