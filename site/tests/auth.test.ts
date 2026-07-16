import { describe, expect, it } from 'vitest';
import {
  DEFAULT_ADMIN_PASSWORD_SHA256,
  isSessionValid,
  sha256Hex,
  slugifyTitle,
  verifyPassword,
  type AuthSession,
} from '../src/lib/auth';

describe('auth helpers', () => {
  it('hashes passwords with SHA-256 hex', async () => {
    const h = await sha256Hex('haiyi2026');
    expect(h).toBe(DEFAULT_ADMIN_PASSWORD_SHA256);
  });

  it('verifies correct and incorrect passwords', async () => {
    await expect(verifyPassword('haiyi2026', DEFAULT_ADMIN_PASSWORD_SHA256)).resolves.toBe(true);
    await expect(verifyPassword('wrong', DEFAULT_ADMIN_PASSWORD_SHA256)).resolves.toBe(false);
  });

  it('validates session freshness', () => {
    const fresh: AuthSession = { ok: true, at: Date.now() };
    const stale: AuthSession = { ok: true, at: Date.now() - 20 * 3600 * 1000 };
    expect(isSessionValid(fresh, 12)).toBe(true);
    expect(isSessionValid(stale, 12)).toBe(false);
    expect(isSessionValid(null)).toBe(false);
  });

  it('slugifies titles for user notes', () => {
    const s = slugifyTitle('Hello 世界 Note');
    expect(s.length).toBeGreaterThan(4);
    expect(s).toMatch(/hello|世界|note/i);
  });
});
