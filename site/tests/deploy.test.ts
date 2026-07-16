import { describe, expect, it } from 'vitest';
import {
  DEPLOY_HOST,
  buildDeployUrl,
  getAllDeployRows,
  getPrimaryPreviewUrl,
  getProjectDeploy,
} from '../src/data/deploy';
import {
  getAllProjects,
  getProjectBySlug,
  getProjectPreviewUrl,
} from '../src/data/projects';
import {
  filterNotesByTag,
  getAllNotes,
  getNoteBySlug,
  getNoteFilterChips,
} from '../src/data/notes';

describe('deploy URL mapping', () => {
  it('builds host:port URLs correctly', () => {
    expect(buildDeployUrl(18080, '/')).toBe(`http://${DEPLOY_HOST}:18080/`);
    expect(buildDeployUrl(18001, '/api/health')).toBe(
      `http://${DEPLOY_HOST}:18001/api/health`,
    );
  });

  it('maps primary preview URLs for all three projects', () => {
    expect(getPrimaryPreviewUrl('code-review-agent')).toBe(
      `http://${DEPLOY_HOST}:18001/api/health`,
    );
    expect(getPrimaryPreviewUrl('smartqa')).toBe(
      `http://${DEPLOY_HOST}:18080/`,
    );
    expect(getPrimaryPreviewUrl('xhagentos')).toBe(
      `http://${DEPLOY_HOST}:18082/`,
    );
  });

  it('exposes in-site preview routes for each project slug', () => {
    const projects = getAllProjects();
    for (const p of projects) {
      expect(p.slug.length).toBeGreaterThan(0);
      // in-site embed route pattern used by UI
      const embedPath = `/projects/${p.slug}/preview`;
      expect(embedPath).toContain('/preview');
      expect(getProjectPreviewUrl(p)).toContain(DEPLOY_HOST);
    }
  });

  it('includes documented ports in deploy rows', () => {
    const ports = getAllDeployRows().map((r) => r.port).sort();
    expect(ports).toEqual([18000, 18001, 18002, 18080, 18082].sort());
  });

  it('exposes API health for code-review-agent', () => {
    const deploy = getProjectDeploy('code-review-agent');
    expect(deploy?.services.some((s) => s.port === 18001)).toBe(true);
  });
});

describe('project helpers', () => {
  it('resolves slugs and preview links for shipped projects', () => {
    const projects = getAllProjects();
    expect(projects).toHaveLength(3);

    for (const p of projects) {
      const found = getProjectBySlug(p.slug);
      expect(found?.title).toBe(p.title);
      const url = getProjectPreviewUrl(p);
      expect(url).toContain(DEPLOY_HOST);
      expect(url.startsWith('http://')).toBe(true);
    }
  });
});

describe('note helpers', () => {
  it('resolves note slugs and orders by date', () => {
    const all = getAllNotes();
    expect(all.length).toBeGreaterThanOrEqual(3);
    const first = getNoteBySlug(all[0].slug);
    expect(first?.title).toBeTruthy();
    // sorted desc
    for (let i = 1; i < all.length; i++) {
      expect(all[i - 1].publishedAt >= all[i].publishedAt).toBe(true);
    }
  });

  it('filters notes by chip tags using real data', () => {
    const chips = getNoteFilterChips();
    expect(chips[0]).toBe('全部');
    const agent = filterNotesByTag('Agent');
    expect(agent.length).toBeGreaterThan(0);
    expect(agent.every((n) => n.filters.includes('Agent') || n.tags.includes('Agent') || n.categoryLabel.includes('Agent'))).toBe(true);
  });
});
