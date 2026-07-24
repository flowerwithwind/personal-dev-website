/**
 * 站点发布目标配置
 *
 * - github：GitHub Pages（base=/personal-dev-website）
 * - server：自有服务器 Docker（base=/ ，HTTP 端口见 deploy）
 * - customDomain：非空时优先生效（base=/ ，HTTPS 域名）
 *
 * Docker 构建：
 *   ARG/ENV DEPLOY_TARGET=server
 *   ARG/ENV SERVER_PUBLIC_URL=http://127.0.0.1:18083
 */
export const customDomain = '';

/** github | server — 可被环境变量 DEPLOY_TARGET 覆盖 */
export const defaultDeployTarget = 'github';

/** 中性本地 URL；生产服务器构建应显式注入 SERVER_PUBLIC_URL。 */
export const defaultServerPublicUrl = 'http://127.0.0.1:18083';

/** GitHub Pages 默认 */
export const githubPages = {
  site: 'https://flowerwithwind.github.io',
  base: '/personal-dev-website',
};

function env(name, fallback = '') {
  try {
    return (typeof process !== 'undefined' && process.env && process.env[name]) || fallback;
  } catch {
    return fallback;
  }
}

export function getDeployTarget() {
  const t = (env('DEPLOY_TARGET', defaultDeployTarget) || defaultDeployTarget).toLowerCase();
  if (t === 'server' || t === 'github') return t;
  throw new Error(`Unsupported DEPLOY_TARGET: ${t}. Expected github or server.`);
}

export function getServerPublicUrl() {
  const value = (env('SERVER_PUBLIC_URL', defaultServerPublicUrl) || defaultServerPublicUrl).replace(
    /\/$/,
    '',
  );
  let parsed;
  try {
    parsed = new URL(value);
  } catch {
    throw new Error(`Invalid SERVER_PUBLIC_URL: ${value}`);
  }
  if (!['http:', 'https:'].includes(parsed.protocol) || parsed.username || parsed.password) {
    throw new Error('SERVER_PUBLIC_URL must be an http(s) URL without credentials.');
  }
  return value;
}

export function getSiteUrl() {
  if (customDomain) {
    return `https://${customDomain.replace(/^https?:\/\//, '').replace(/\/$/, '')}`;
  }
  if (getDeployTarget() === 'server') {
    return getServerPublicUrl();
  }
  return `${githubPages.site}${githubPages.base}`;
}

export function getAstroSite() {
  if (customDomain) {
    return `https://${customDomain.replace(/^https?:\/\//, '').replace(/\/$/, '')}`;
  }
  if (getDeployTarget() === 'server') {
    // Astro site 应为 origin（无 path）
    try {
      return new URL(getServerPublicUrl()).origin;
    } catch {
      return getServerPublicUrl();
    }
  }
  return githubPages.site;
}

export function getAstroBase() {
  if (customDomain) return '/';
  if (getDeployTarget() === 'server') return '/';
  return githubPages.base;
}
