/**
 * Deep-link parsing for Snaproom.
 *
 * The web app encodes a QR with a link shaped like:
 *
 *   snaproom://room?slug=<world-slug>&host=<lan-ip:port>
 *
 * Scanning it opens this app; we pull out the world slug and the dev-server
 * host, then point a WebView at the existing web viewer for that room.
 *
 * The path form `snaproom://room/<slug>?host=...` is also accepted so links
 * stay readable if they are ever hand-written.
 */
import * as Linking from 'expo-linking';

export interface RoomTarget {
  /** World slug, e.g. "sunlit-bedroom". */
  slug: string;
  /** Host the web dev server is reachable at, e.g. "192.168.1.20:5173". */
  host: string;
}

function firstString(value: unknown): string | undefined {
  if (typeof value === 'string' && value.trim().length > 0) return value.trim();
  if (Array.isArray(value)) return firstString(value[0]);
  return undefined;
}

/**
 * Parse an incoming deep link into a {@link RoomTarget}, or return `null` when
 * the URL is not a room link (or is missing the slug/host it needs).
 */
export function parseRoomLink(url: string | null | undefined): RoomTarget | null {
  if (!url) return null;

  let parsed: ReturnType<typeof Linking.parse>;
  try {
    parsed = Linking.parse(url);
  } catch {
    return null;
  }

  const { hostname, path, queryParams } = parsed;

  // Accept either `room` as the hostname (scheme://room?...) or as the first
  // path segment (scheme:///room/...), depending on how the OS hands it over.
  const segments = (path ?? '').split('/').filter(Boolean);
  const isRoomLink = hostname === 'room' || segments[0] === 'room';
  if (!isRoomLink) return null;

  const slugFromPath = hostname === 'room' ? segments[0] : segments[1];
  const slug = firstString(queryParams?.slug) ?? slugFromPath;
  const host = firstString(queryParams?.host);

  if (!slug || !host) return null;
  return { slug, host };
}

/**
 * Build the web viewer URL a WebView should load for a given room.
 * `embed=1` tells the web app to drop its desktop chrome for a clean,
 * touch-first view.
 */
export function viewerUrl({ slug, host }: RoomTarget): string {
  const base = /^https?:\/\//i.test(host) ? host : `http://${host}`;
  const trimmed = base.replace(/\/+$/, '');
  return `${trimmed}/${encodeURIComponent(slug)}?embed=1`;
}
