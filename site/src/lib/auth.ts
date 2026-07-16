/** Client-side admin auth + note storage helpers */

export const AUTH_STORAGE_KEY = 'personal-site-auth-v1';
export const NOTES_STORAGE_KEY = 'personal-site-user-notes-v1';
export const NOTES_DB_NAME = 'personal-site-notes-db';
export const NOTES_DB_STORE = 'notes';
export const AUTH_SESSION_HOURS = 12;

/** SHA-256 of default password `haiyi2026` */
export const DEFAULT_ADMIN_PASSWORD_SHA256 =
  '11629f2659d6624fb4f10471d0383a5caace241d5cb9c6e0da37b3dfef362363';

export type AuthSession = {
  ok: true;
  at: number;
};

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
  updatedAt?: string;
};

export async function sha256Hex(text: string): Promise<string> {
  if (typeof crypto === 'undefined' || !crypto.subtle) {
    throw new Error('当前环境不支持安全哈希（需要 HTTPS 或 localhost）');
  }
  const data = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export function isSessionValid(
  session: AuthSession | null | undefined,
  maxHours = AUTH_SESSION_HOURS,
): boolean {
  if (!session?.ok || typeof session.at !== 'number') return false;
  const ageMs = Date.now() - session.at;
  return ageMs >= 0 && ageMs < maxHours * 3600 * 1000;
}

export async function verifyPassword(
  password: string,
  expectedSha256: string,
): Promise<boolean> {
  if (!password || !expectedSha256) return false;
  const got = await sha256Hex(password.trim());
  return got === expectedSha256.trim().toLowerCase();
}

function storageAvailable(kind: 'localStorage' | 'sessionStorage'): boolean {
  try {
    const s = kind === 'localStorage' ? localStorage : sessionStorage;
    const k = '__ps_test__';
    s.setItem(k, '1');
    s.removeItem(k);
    return true;
  } catch {
    return false;
  }
}

export function readSession(): AuthSession | null {
  if (typeof window === 'undefined' || !storageAvailable('sessionStorage')) return null;
  try {
    const raw = sessionStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AuthSession;
    if (!isSessionValid(parsed)) {
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function writeSession(): void {
  if (!storageAvailable('sessionStorage')) {
    throw new Error('无法写入登录会话，请检查浏览器是否禁用了 Cookie/存储');
  }
  const session: AuthSession = { ok: true, at: Date.now() };
  sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
}

export function clearSession(): void {
  try {
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

function openNotesDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB unavailable'));
      return;
    }
    const req = indexedDB.open(NOTES_DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(NOTES_DB_STORE)) {
        db.createObjectStore(NOTES_DB_STORE, { keyPath: 'slug' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error ?? new Error('IndexedDB open failed'));
  });
}

async function idbGetAllNotes(): Promise<UserNote[]> {
  const db = await openNotesDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(NOTES_DB_STORE, 'readonly');
    const store = tx.objectStore(NOTES_DB_STORE);
    const req = store.getAll();
    req.onsuccess = () => {
      const list = (req.result as UserNote[]) || [];
      resolve(
        list.sort((a, b) =>
          (b.updatedAt || b.publishedAt).localeCompare(a.updatedAt || a.publishedAt),
        ),
      );
    };
    req.onerror = () => reject(req.error);
  });
}

async function idbPutNote(note: UserNote): Promise<void> {
  const db = await openNotesDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(NOTES_DB_STORE, 'readwrite');
    tx.objectStore(NOTES_DB_STORE).put(note);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

function lsReadNotes(): UserNote[] {
  if (!storageAvailable('localStorage')) return [];
  try {
    const raw = localStorage.getItem(NOTES_STORAGE_KEY);
    if (!raw) return [];
    const list = JSON.parse(raw) as UserNote[];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

function lsWriteNotes(notes: UserNote[]): void {
  if (!storageAvailable('localStorage')) return;
  localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
}

/** Prefer IndexedDB; fall back to localStorage (and migrate LS → IDB once). */
export async function readUserNotes(): Promise<UserNote[]> {
  try {
    const idbNotes = await idbGetAllNotes();
    if (idbNotes.length > 0) return idbNotes;
    const lsNotes = lsReadNotes();
    if (lsNotes.length) {
      for (const n of lsNotes) await idbPutNote(n);
    }
    return lsNotes;
  } catch {
    return lsReadNotes();
  }
}

export async function upsertUserNote(note: UserNote): Promise<UserNote[]> {
  const withMeta: UserNote = {
    ...note,
    updatedAt: new Date().toISOString(),
  };
  try {
    await idbPutNote(withMeta);
    const all = await idbGetAllNotes();
    // keep LS mirror for simple export/debug
    lsWriteNotes(all);
    return all;
  } catch {
    const all = lsReadNotes().filter((n) => n.slug !== withMeta.slug);
    all.unshift(withMeta);
    lsWriteNotes(all);
    return all;
  }
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
  return `${base || 'note'}-${stamp}`;
}

/** Sync helpers kept for unit tests / simple environments */
export function readUserNotesSync(): UserNote[] {
  return lsReadNotes();
}

export function writeUserNotes(notes: UserNote[]): void {
  lsWriteNotes(notes);
}
