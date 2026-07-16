import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  getAllProjects,
  getProjectDetailPath,
  getInSitePreviewPath,
  getPreviewHref,
} from '../src/data/projects';
import { getAllNotes } from '../src/data/notes';
import {
  isCanonicalPath,
  toDistIndexFile,
  projectDetailPath,
  noteDetailPath,
  projectPreviewPath,
} from '../src/lib/paths';

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distRoot = path.join(siteRoot, 'dist');
const nginxConf = fs.readFileSync(path.join(siteRoot, 'nginx.conf'), 'utf8');
const projectCardSrc = fs.readFileSync(
  path.join(siteRoot, 'src/components/ProjectCard.astro'),
  'utf8',
);
const noteCardSrc = fs.readFileSync(path.join(siteRoot, 'src/components/NoteCard.astro'), 'utf8');
const indexSrc = fs.readFileSync(path.join(siteRoot, 'src/pages/index.astro'), 'utf8');
const projectsIndexSrc = fs.readFileSync(
  path.join(siteRoot, 'src/pages/projects/index.astro'),
  'utf8',
);

describe('path helper with base', () => {
  beforeEach(() => {
    vi.resetModules();
  });
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('prefixes routes with BASE_URL and strips trailing slashes', async () => {
    vi.stubEnv('BASE_URL', '/personal-dev-website/');
    const { path: joinPath } = await import('../src/lib/paths');
    expect(joinPath('/')).toBe('/personal-dev-website/');
    expect(joinPath('/notes')).toBe('/personal-dev-website/notes');
    expect(joinPath('/notes/')).toBe('/personal-dev-website/notes');
    expect(joinPath('/projects/smartqa')).toBe('/personal-dev-website/projects/smartqa');
    expect(joinPath('/projects/smartqa/')).toBe('/personal-dev-website/projects/smartqa');
  });

  it('uses root base without double slashes', async () => {
    vi.stubEnv('BASE_URL', '/');
    const { path: joinPath } = await import('../src/lib/paths');
    expect(joinPath('/')).toBe('/');
    expect(joinPath('/about')).toBe('/about');
    expect(joinPath('/notes/local/')).toBe('/notes/local');
  });
});

describe('canonical path contract (trailingSlash never)', () => {
  it('treats only root as slash-terminated', () => {
    expect(isCanonicalPath('/')).toBe(true);
    expect(isCanonicalPath('/notes')).toBe(true);
    expect(isCanonicalPath('/notes/')).toBe(false);
    expect(isCanonicalPath('/projects/smartqa/')).toBe(false);
    expect(isCanonicalPath('/projects/smartqa')).toBe(true);
  });

  it('maps canonical paths to directory index.html files', () => {
    expect(toDistIndexFile('/')).toBe('index.html');
    expect(toDistIndexFile('/notes')).toBe('notes/index.html');
    expect(toDistIndexFile('/projects/smartqa')).toBe('projects/smartqa/index.html');
    expect(toDistIndexFile('/projects/smartqa/preview')).toBe(
      'projects/smartqa/preview/index.html',
    );
    expect(toDistIndexFile('/personal-dev-website/notes', '/personal-dev-website')).toBe(
      'notes/index.html',
    );
  });

  it('detail helpers match real project and note slugs', () => {
    for (const p of getAllProjects()) {
      expect(projectDetailPath(p.slug)).toBe(`/projects/${p.slug}`);
      expect(getProjectDetailPath(p)).toBe(`/projects/${p.slug}`);
      expect(projectPreviewPath(p.slug)).toContain(`/projects/${p.slug}/preview`);
      expect(getInSitePreviewPath(p)).toBe(projectPreviewPath(p.slug));
      expect(isCanonicalPath(getProjectDetailPath(p))).toBe(true);
    }
    for (const n of getAllNotes()) {
      expect(noteDetailPath(n.slug)).toBe(`/notes/${n.slug}`);
      expect(isCanonicalPath(noteDetailPath(n.slug))).toBe(true);
    }
  });
});

describe('nginx static rewrite contract', () => {
  it('uses internal rewrites and does not SPA-fallback to homepage', () => {
    expect(nginxConf).toMatch(/rewrite\s+\^\/\(\.\+\)\/\$\s+\/\$1\s+last/);
    expect(nginxConf).toMatch(/rewrite\s+\^\/\(\[\^\.\]\*\[\^\.\/\]\)\$\s+\/\$1\/index\.html\s+last/);
    expect(nginxConf).toMatch(/try_files\s+\$uri\s+\$uri\/index\.html\s+=404/);
    expect(nginxConf).not.toMatch(/try_files[^;]*\/index\.html\s*;/);
    expect(nginxConf).toMatch(/absolute_redirect\s+off/);
    expect(nginxConf).toMatch(/location\s+=\s+\/healthz/);
    expect(nginxConf).toMatch(/location\s+\/_astro\//);
  });
});

describe('dist file mapping for card/link targets', () => {
  const hasDist = fs.existsSync(distRoot);

  it.skipIf(!hasDist)('every project/note detail and key route maps to a real dist file', () => {
    const required = [
      toDistIndexFile('/'),
      toDistIndexFile('/notes'),
      toDistIndexFile('/projects'),
      toDistIndexFile('/about'),
      ...getAllProjects().flatMap((p) => [
        toDistIndexFile(getProjectDetailPath(p)),
        toDistIndexFile(getInSitePreviewPath(p)),
      ]),
      ...getAllNotes().map((n) => toDistIndexFile(noteDetailPath(n.slug))),
    ];

    for (const rel of required) {
      const full = path.join(distRoot, rel);
      expect(fs.existsSync(full), `missing dist file for ${rel}`).toBe(true);
    }

    // hashed assets dir exists
    expect(fs.existsSync(path.join(distRoot, '_astro'))).toBe(true);
  });

  it.skipIf(!hasDist)('built HTML card primary targets match detail helpers', () => {
    const home = fs.readFileSync(path.join(distRoot, 'index.html'), 'utf8');
    const projectsPage = fs.readFileSync(path.join(distRoot, 'projects/index.html'), 'utf8');

    for (const p of getAllProjects()) {
      const detail = getProjectDetailPath(p);
      // homepage mini-project cards
      expect(home).toContain(`href="${detail}"`);
      expect(home).toContain(`data-detail-href="${detail}"`);
      // project list / card detail
      expect(projectsPage).toContain(`href="${detail}"`);
    }

    for (const n of getAllNotes().slice(0, 3)) {
      const detail = noteDetailPath(n.slug);
      expect(home).toContain(`href="${detail}"`);
    }
  });
});

describe('card float + whole-card navigation (source)', () => {
  it('project cards use stretched primary link and float hover styles', () => {
    expect(projectCardSrc).toMatch(/data-card="project"/);
    expect(projectCardSrc).toMatch(/data-card-primary/);
    expect(projectCardSrc).toMatch(/class="card-hit"/);
    expect(projectCardSrc).toMatch(/translateY\(-6px\)/);
    expect(projectCardSrc).toMatch(/data-card-action="preview"/);
    expect(projectCardSrc).toContain('projectDetailPath(project.slug)');
  });

  it('note cards link to noteDetailPath with float hover', () => {
    expect(noteCardSrc).toMatch(/data-card="note"/);
    expect(noteCardSrc).toMatch(/noteDetailPath\(note\.slug\)/);
    expect(noteCardSrc).toMatch(/translateY\(-6px\)/);
  });

  it('homepage mini-project cards and featured project are navigable with float', () => {
    expect(indexSrc).toMatch(/data-card="mini-project"/);
    expect(indexSrc).toMatch(/getProjectDetailPath/);
    expect(indexSrc).toMatch(/translateY\(-6px\)/);
    expect(projectsIndexSrc).toMatch(/data-card="featured-project"/);
    expect(projectsIndexSrc).toMatch(/class="card-hit"/);
    expect(projectsIndexSrc).toMatch(/translateY\(-6px\)/);
    expect(projectsIndexSrc).toMatch(/data-card-action="preview"/);
  });

  it('preview href remains distinct from detail path (github default)', () => {
    const prev = process.env.DEPLOY_TARGET;
    delete process.env.DEPLOY_TARGET;
    const p = getAllProjects()[0];
    expect(getPreviewHref(p)).not.toBe(getProjectDetailPath(p));
    expect(getPreviewHref(p)).toContain('http://');
    if (prev === undefined) delete process.env.DEPLOY_TARGET;
    else process.env.DEPLOY_TARGET = prev;
  });
});
