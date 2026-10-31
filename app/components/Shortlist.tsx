"use client";

import { useSyncExternalStore } from "react";

const KEY = "the-two-shortlist";
const EVENT = "the-two-shortlist-change";

function read(): string[] {
  try {
    const value = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    return Array.isArray(value) ? value.filter(item => typeof item === "string") : [];
  } catch {
    return [];
  }
}

let cache: string[] = [];
let cacheRaw = "";

function snapshot() {
  let raw = "[]";
  try { raw = localStorage.getItem(KEY) ?? "[]"; } catch { /* storage blocked */ }
  if (raw !== cacheRaw) { cacheRaw = raw; cache = read(); }
  return cache;
}

function subscribe(callback: () => void) {
  window.addEventListener(EVENT, callback);
  window.addEventListener("storage", callback);
  return () => { window.removeEventListener(EVENT, callback); window.removeEventListener("storage", callback); };
}

const empty: string[] = [];

export function useShortlist() {
  const items = useSyncExternalStore(subscribe, snapshot, () => empty);
  function toggle(slug: string) {
    const next = items.includes(slug) ? items.filter(item => item !== slug) : [...items, slug];
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* storage blocked */ }
    window.dispatchEvent(new Event(EVENT));
    return next.includes(slug);
  }
  function clear() {
    try { localStorage.removeItem(KEY); } catch { /* storage blocked */ }
    window.dispatchEvent(new Event(EVENT));
  }
  return { items, toggle, clear, has: (slug: string) => items.includes(slug) };
}

export function ShortlistButton({ slug, name, variant = "icon" }: { slug: string; name: string; variant?: "icon" | "full" }) {
  const { has, toggle } = useShortlist();
  const saved = has(slug);
  return <button
    type="button"
    className={variant === "icon" ? "shortlist-icon" : "shortlist-full"}
    aria-pressed={saved}
    aria-label={saved ? `Bỏ ${name} khỏi shortlist` : `Lưu ${name} vào shortlist`}
    onClick={event => { event.preventDefault(); event.stopPropagation(); toggle(slug); }}
  >{saved ? "♥" : "♡"}{variant === "full" && <span>{saved ? "Đã lưu vào shortlist" : "Lưu vào shortlist"}</span>}</button>;
}

export function ShortlistCount() {
  const { items } = useShortlist();
  return <a className="shortlist-link" href="/shortlist">♡ Shortlist{items.length > 0 && <b>{items.length}</b>}</a>;
}
