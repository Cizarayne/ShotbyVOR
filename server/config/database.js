import mongoose from "mongoose";
import dns from "dns"

dns.setServers(['1.1.1.1', '8.8.4.4', '8.8.8.8', '4.4.4.4'])

// Shared in-flight connect attempt so concurrent requests reuse one promise.
// The memo is cleared as soon as the attempt settles, so:
//   • after success → readyState === 1 and later calls take the fast path;
//   • after failure → the next request starts a fresh attempt (self-healing).
let connecting = null;

// NOTE: never process.exit() here. On Vercel a dead/killed process makes the
// platform answer with its own error page, which carries no CORS headers — the
// browser then reports a misleading "No 'Access-Control-Allow-Origin' header"
// error instead of the real database problem.
export function connectDatabase() {
  const state = mongoose.connection.readyState;
  // Already connected — nothing to do.
  if (state === 1) return Promise.resolve();
  // An attempt is already in flight — share it (queries buffer meanwhile).
  if (connecting) return connecting;
  // Mid-connect but not started by us (e.g. an internal reconnect) — just let
  // it finish; mongoose buffers queries while connecting.
  if (state === 2) return Promise.resolve(mongoose.connection);

  try {
    const attempt = Promise.resolve(
      mongoose.connect(process.env.MONGO_URI, {
        // Fail fast: Vercel functions must answer well before mongoose's
        // default 30s server-selection timeout, otherwise the invocation is
        // killed and the response loses its CORS headers too.
        serverSelectionTimeoutMS: 5000,
      }),
    )
      .then(() => {
        console.log('Database connected successfully✅');
        return mongoose.connection;
      })
      .catch((err) => {
        console.error('Database connection Failed ❌', err.message);
        // Re-throw: callers turn this into a JSON response (with CORS headers)
        // instead of crashing the process.
        throw err;
      })
      .finally(() => {
        if (connecting === attempt) connecting = null;
      });

    connecting = attempt;
    return attempt;
  } catch (err) {
    // Synchronous failure (e.g. MONGO_URI missing) — reject without caching
    // the attempt so the next request can retry.
    console.error('Database connection Failed ❌', err.message);
    return Promise.reject(err);
  }
}
