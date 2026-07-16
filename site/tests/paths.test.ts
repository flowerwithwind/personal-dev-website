import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

describe('path helper with base', () => {
  beforeEach(() => {
    vi.resetModules();
  });
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('prefixes routes with BASE_URL', async () => {
    vi.stubEnv('BASE_URL', '/personal-dev-website/');
    const { path } = await import('../src/lib/paths');
    expect(path('/')).toBe('/personal-dev-website/');
    expect(path('/notes')).toBe('/personal-dev-website/notes');
    expect(path('/projects/smartqa')).toBe('/personal-dev-website/projects/smartqa');
  });
});
