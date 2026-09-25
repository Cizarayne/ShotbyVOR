// ── API base ──────────────────────────────────────────────────────────────────
// Local dev: empty string → relative "/api/…" hits the Vite proxy.
// Production: set VITE_API_URL to the deployed server, e.g.
// VITE_API_URL=https://shotbyvorserver.vercel.app (no trailing slash, no /api).
const BASE = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

// Joins the base with an "/api/…" path.
export function apiUrl(path) {
  return `${BASE}${path.startsWith("/") ? path : `/${path}`}`;
}
