/**
 * Normalize Neon / Postgres connection URLs for node-pg on Windows.
 * Must use the URL parser — passwords can contain `?` / `&`, so string checks
 * like `url.includes('?')` are unsafe and corrupt the database name.
 */
export function normalizePostgresUrl(url) {
  if (!url) return url;

  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return String(url).trim();
  }

  // Node pg on Windows does not support channel binding.
  parsed.searchParams.delete('channel_binding');

  // Neon + current node-pg: libpq-compatible SSL avoids Windows handshake stalls.
  parsed.searchParams.set('uselibpqcompat', 'true');
  parsed.searchParams.set('sslmode', 'require');

  return parsed.toString();
}
