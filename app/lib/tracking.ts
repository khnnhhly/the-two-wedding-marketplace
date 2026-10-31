const BOT_PATTERN = /bot|crawl|spider|slurp|preview|facebookexternalhit|headless|lighthouse|curl|wget|python-requests/i;

export const isBot = (userAgent: string | null) => !userAgent || BOT_PATTERN.test(userAgent);

export function newId(prefix: string) {
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  return `${prefix}_${Date.now().toString(36)}${Array.from(bytes, byte => byte.toString(16).padStart(2, "0")).join("")}`;
}

/**
 * Structured event line. Vercel keeps these in the project logs; ship them to a
 * log drain or database before billing vendors from them.
 */
export function logEvent(event: string, data: Record<string, unknown>) {
  console.log(JSON.stringify({ event, at: new Date().toISOString(), ...data }));
}
