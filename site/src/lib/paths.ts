/** Join site base path (GitHub Pages project path) with a root-relative route. */
export function path(to = '/'): string {
  const base = import.meta.env.BASE_URL || '/';
  if (!to || to === '/') {
    return base.endsWith('/') ? base : `${base}/`;
  }
  const normalized = to.startsWith('/') ? to.slice(1) : to;
  const prefix = base.endsWith('/') ? base : `${base}/`;
  return `${prefix}${normalized}`;
}
