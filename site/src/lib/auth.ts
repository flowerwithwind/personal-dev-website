/** Client-side admin auth helpers (password hash verified in browser). */

export const AUTH_STORAGE_KEY = 'personal-site-auth-v1';
export const NOTES_STORAGE_KEY = 'personal-site-user-notes-v1';
export const AUTH_SESSION_HOURS = 12;

/** SHA-256 of default password `haiyi2026` — change via siteConfig.adminPasswordSha256 */
export const DEFAULT_ADMIN_PASSWORD_SHA256 =
  '11629f2659d6624fb4f10471d0383a5caace241d5cb9c6e0da37b3dfef362363';

export type AuthSession = {
  ok: true;
  at: number;
};

export async function sha256Hex(text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export function isSessionValid(session: AuthSession | null | undefined, maxHours = AUTH_SESSION_HOURS): boolean {
  if (!session?.ok || typeof session.at !== 'number') return false;
  const ageMs = Date.now() - session.at;
  return ageMs >= 0 && ageMs < maxHours * 3600 * 1000;
}

export async function verifyPassword(
  password: string,
  expectedSha256: string,
): Promise<boolean> {
  if (!password || !expectedSha256) return false;
  const got = await sha256Hex(password);
  return got === expectedSha256.toLowerCase();
}

export function readSession(): AuthSession | null {
  if (typeof sessionStorage === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AuthSession;
    return isSessionValid(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function writeSession(): void {
  const session: AuthSession = { ok: true, at: Date.now() };
  sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
}

export function clearSession(): void {
  sessionStorage.removeItem(AUTH_STORAGE_KEY);
}

export type UserNote = {
  slug: string;
  title: string;
  summary: string;
  categoryLabel: string;
  tags: string[];
  filters: string[];
  publishedAt: string;
  readingMinutes: number;
  status: 'published' | 'growing';
  body: string;
  source: 'user';
};

export function readUserNotes(): UserNote[] {
  if (typeof localStorage === 'undefined') return [];
  try {
    const raw = localStorage.getItem(NOTES_STORAGE_KEY);
    if (!raw) return [];
    const list = JSON.parse(raw) as UserNote[];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

export function writeUserNotes(notes: UserNote[]): void {
  localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
}

export function upsertUserNote(note: UserNote): UserNote[] {
  const all = readUserNotes().filter((n) => n.slug !== note.slug);
  all.unshift(note);
  writeUserNotes(all);
  return all;
}

export function slugifyTitle(title: string): string {
  const base = title
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/[^\w\u4e00-\u9fff-]+/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  const stamp = Date.now().toString(36).slice(-4);
  return (base || 'note') + '-' + stamp;
}
