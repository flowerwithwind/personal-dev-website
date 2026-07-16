/**
 * Path helpers aligned with Astro:
 * - trailingSlash: 'never'
 * - build.format: 'directory'
 * - base from import.meta.env.BASE_URL (github project path or `/`)
 */

/** Join site base with a root-relative route. Canonical form has no trailing slash (except site root). */
export function path(to = '/'): string {
  const base = import.meta.env.BASE_URL || '/';
  const prefix = base.endsWith('/') ? base : `${base}/`;

  if (!to || to === '/') {
    return prefix;
  }

  // Drop query/hash for join; callers should append those after path()
  let route = to.startsWith('/') ? to.slice(1) : to;
  // Enforce trailingSlash:'never' — strip trailing slashes on in-site routes
  route = route.replace(/\/+$/, '');
  return `${prefix}${route}`;
}

/** Project detail path, e.g. /projects/smartqa (with base prefix when needed). */
export function projectDetailPath(slug: string): string {
  return path(`/projects/${slug}`);
}

/** Note detail path, e.g. /notes/code-review-as-agent */
export function noteDetailPath(slug: string): string {
  return path(`/notes/${slug}`);
}

/** In-site project preview path */
export function projectPreviewPath(slug: string): string {
  return path(`/projects/${slug}/preview`);
}

/**
 * True when a path is already canonical under trailingSlash:'never':
 * - site root may end with `/` (base itself)
 * - other routes must not end with `/`
 */
export function isCanonicalPath(pathname: string, baseUrl = '/'): boolean {
  if (!pathname) return false;
  const base = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  if (pathname === base || pathname === base.replace(/\/$/, '') || pathname === '/') {
    return true;
  }
  return !pathname.endsWith('/');
}

/** Map a canonical in-site path (no trailing slash) to the static dist file path. */
export function toDistIndexFile(pathname: string, baseUrl = '/'): string {
  let p = pathname || '/';
  const base = baseUrl === '/' ? '' : baseUrl.replace(/\/$/, '');
  if (base && p.startsWith(base)) {
    p = p.slice(base.length) || '/';
  }
  if (!p.startsWith('/')) p = `/${p}`;
  p = p.replace(/\/+$/, '') || '/';
  if (p === '/') return 'index.html';
  return `${p.slice(1)}/index.html`;
}
