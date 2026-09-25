// Per-IP cooldown for public view-count endpoints.
//
// trackView() on the client sends a hit for every genuine watch (3s+ of
// playback, 75% completions, replays), so the server is the backstop that
// keeps rapid replays, autoplay loops and bots from inflating counters:
// at most one counted view per IP, per item, per cooldown window.
const WINDOW_MS = 60 * 1000;
const MAX_ENTRIES = 20000;
const seen = new Map();

function clientIp(req) {
  // NOTE: X-Forwarded-For is intentionally ignored — without `trust proxy`
  // it is client-controlled and could be spoofed to bypass the cooldown.
  return req.ip || req.socket?.remoteAddress || "unknown";
}

export function viewThrottle(collection) {
  return (req, res, next) => {
    const now = Date.now();
    if (seen.size > MAX_ENTRIES || Math.random() < 0.02) {
      for (const [k, t] of seen) {
        if (now - t > WINDOW_MS) seen.delete(k);
      }
    }
    const key = `${clientIp(req)}:${collection}:${req.params.id}`;
    const last = seen.get(key) || 0;
    if (now - last < WINDOW_MS) {
      return res
        .status(429)
        .json({ error: "Too many views — counted at most once per minute" });
    }
    seen.set(key, now);
    next();
  };
}
