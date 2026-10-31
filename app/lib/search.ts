import type { VendorProfile } from "../data/marketplace";

/** Lowercase and strip Vietnamese diacritics so "ha noi" matches "Hà Nội". */
export function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/\s+/g, " ")
    .trim();
}

// Everyday Vietnamese terms mapped to the catalog vocabulary.
const synonyms: Record<string, string> = {
  "chup anh": "photo",
  "chup hinh": "photo",
  "nhiep anh": "photo",
  "quay phim": "film",
  "phong su": "photo",
  "anh cuoi": "photo",
  "vay cuoi": "trang phuc",
  "vay": "trang phuc",
  "ao dai": "trang phuc",
  "vest": "trang phuc",
  "trang diem": "makeup",
  "make up": "makeup",
  "nha hang": "dia diem",
  "san tiec": "dia diem",
  "venue": "dia diem",
  "hoa": "trang tri",
  "decor": "trang tri",
  "ban nhac": "giai tri",
  "nhac": "giai tri",
  "mc": "giai tri",
  "dj": "giai tri",
  "ke hoach": "planner",
  "dieu phoi": "planner",
  "sai gon": "ho chi minh",
  "tp hcm": "ho chi minh",
  "tphcm": "ho chi minh",
  "hcm": "ho chi minh",
  "hn": "ha noi",
};

function expand(query: string) {
  let value = normalize(query).replace(/[.,·]/g, " ").replace(/\s+/g, " ");
  for (const [term, replacement] of Object.entries(synonyms)) {
    value = value.replace(new RegExp(`(^|\\s)${term}(?=\\s|$)`, "g"), `$1${replacement}`);
  }
  return value.split(" ").filter(Boolean);
}

export function vendorHaystack(vendor: VendorProfile) {
  const text = normalize(
    [vendor.name, vendor.category, vendor.location, vendor.description, vendor.services.join(" "), vendor.packages.map(item => item.name).join(" ")].join(" ").replace(/[.,·]/g, " "),
  );
  // Also index the canonical form so "Sài Gòn" finds vendors listed as "TP.HCM".
  return `${text} ${expand(vendor.location).join(" ")}`;
}

/** Every query word must appear somewhere in the vendor profile. */
export function matchesQuery(vendor: VendorProfile, query: string) {
  const words = expand(query);
  if (!words.length) return true;
  const haystack = vendorHaystack(vendor);
  return words.every(word => haystack.includes(word));
}

/** Vendors serving "Toàn quốc" match any location. */
export function servesLocation(vendor: VendorProfile, location: string) {
  const wanted = expand(location).join(" ");
  if (!wanted || wanted === "chua chot") return true;
  const served = expand(vendor.location).join(" ");
  return served.includes("toan quoc") || served.includes(wanted) || wanted.includes(served);
}

/** Vendor has a base in this location (nationwide coverage alone does not count). */
export function basedIn(vendor: VendorProfile, location: string) {
  const wanted = expand(location).join(" ");
  const served = expand(vendor.location).join(" ");
  return Boolean(wanted) && (served.includes(wanted) || wanted.includes(served)) && !served.startsWith("toan quoc");
}

export const locationOptions = ["Tất cả khu vực", "Hà Nội", "TP. Hồ Chí Minh"] as const;
