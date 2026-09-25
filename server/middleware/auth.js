/**
 * Master API key authentication middleware.
 * Expects the key in the `x-api-key` request header.
 */
export function requireApiKey(req, res, next) {
  const key = req.headers['x-api-key'];

  if (!key || key !== process.env.ADMIN_API_KEY) {
    return res.status(401).json({ error: 'Unauthorized – invalid or missing API key' });
  }

  next();
}
