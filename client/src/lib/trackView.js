// View tracking for public content.
//
// Two counting modes keep the admin-dashboard counters honest:
//
// - Once-per-session (default): passive views — reading a journal, expanding
//   a photo lightbox. The in-memory set blocks React StrictMode
//   double-effects and re-renders; the sessionStorage flag blocks reloads
//   and back-and-forth navigation. Nothing is marked until the server
//   confirms the increment, so failed requests retry on the next visit
//   instead of burning the view.
// - Repeatable watches ({ repeatable: true }): genuine video playback.
//   Every 3s+ watch and every 75%-completion sends a hit; an in-flight
//   guard collapses StrictMode duplicates, and the server enforces a
//   per-IP cooldown per item so loops and bots can't inflate the counter.
const counted = new Set();
const inflight = new Set();

function flagKey(collection, id) {
  return `sv:view:${collection}:${id}`;
}

function postView(collection, id) {
  return fetch(`/api/${collection}/${id}/view`, { method: "POST" });
}

export function trackView(collection, id, { repeatable = false } = {}) {
  if (!collection || !id) return;
  const key = `${collection}:${id}`;
  if (inflight.has(key)) return;

  // Passive view: at most one counted hit per browser session.
  if (!repeatable) {
    if (counted.has(key)) return;
    counted.add(key);
    try {
      if (sessionStorage.getItem(flagKey(collection, id))) return;
    } catch (_) {
      /* sessionStorage unavailable — the in-memory set still dedupes */
    }
    inflight.add(key);
    postView(collection, id)
      .then((res) => {
        if (!res.ok) throw new Error(`view rejected (${res.status})`);
        try {
          sessionStorage.setItem(flagKey(collection, id), "1");
        } catch (_) {
          /* sessionStorage unavailable — the in-memory set still dedupes */
        }
      })
      .catch(() => {
        // Let the next visit retry instead of burning the view.
        counted.delete(key);
      })
      .finally(() => inflight.delete(key));
    return;
  }

  // Genuine watch: every call sends a hit (the server-side per-IP cooldown
  // keeps rapid replays and bots in check).
  inflight.add(key);
  postView(collection, id)
    .catch(() => {})
    .finally(() => inflight.delete(key));
}
