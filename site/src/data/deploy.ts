/** Live deployment map for project demos (source of truth). */

export const DEPLOY_HOST = '1.14.106.17';

/**
 * Demo servers currently speak plain HTTP.
 * GitHub Pages is HTTPS → browsers block HTTP iframes (Mixed Content).
 * When you terminate TLS (nginx/Caddy/Cloudflare), set this to 'https'
 * so in-page iframe embed can work.
 */
export const DEPLOY_PROTOCOL: 'http' | 'https' = 'http';

export type DeployService = {
  name: string;
  port: number;
  path: string;
  /** Primary preview target for this service */
  isPrimaryPreview?: boolean;
};

export type ProjectDeploy = {
  projectKey: 'code-review-agent' | 'smartqa' | 'xhagentos';
  services: DeployService[];
};

/** 个人站服务器端口（与 deploy/docker-compose.prod.yml 一致） */
export const PERSONAL_SITE_PORT = 18083;

/**
 * 是否使用站内 iframe 预览（构建时决定）
 *
 * - server：个人站与演示站同为 HTTP → 可内嵌
 * - github：GitHub Pages 为 HTTPS → 仅新标签打开 HTTP 演示（避免 Mixed Content）
 *
 * 由 Dockerfile / CI 注入 DEPLOY_TARGET=server；本地默认 github。
 */
export function useInSitePreview(): boolean {
  try {
    const t = (typeof process !== 'undefined' && process.env?.DEPLOY_TARGET) || '';
    return String(t).toLowerCase() === 'server';
  } catch {
    return false;
  }
}

export const PROJECT_DEPLOYS: ProjectDeploy[] = [
  {
    projectKey: 'smartqa',
    services: [
      { name: '前端', port: 18080, path: '/', isPrimaryPreview: true },
      { name: '后端 API', port: 18000, path: '/api/health' },
    ],
  },
  {
    projectKey: 'code-review-agent',
    services: [
      { name: 'API', port: 18001, path: '/api/health', isPrimaryPreview: true },
    ],
  },
  {
    projectKey: 'xhagentos',
    services: [
      { name: '前端', port: 18082, path: '/', isPrimaryPreview: true },
      { name: '后端', port: 18002, path: '/' },
    ],
  },
];

export function buildDeployUrl(port: number, path = '/'): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${DEPLOY_PROTOCOL}://${DEPLOY_HOST}:${port}${normalized === '/' ? '/' : normalized}`;
}

/** True when an HTTPS page cannot embed this URL in an iframe. */
export function isMixedContentEmbedBlocked(pageProtocol: string, targetUrl: string): boolean {
  return pageProtocol === 'https:' && /^http:\/\//i.test(targetUrl);
}

export function getProjectDeploy(projectKey: string): ProjectDeploy | undefined {
  return PROJECT_DEPLOYS.find((p) => p.projectKey === projectKey);
}

/** Primary live deploy URL for a project slug/key (for iframe embed). */
export function getPrimaryPreviewUrl(projectKey: string): string | undefined {
  const deploy = getProjectDeploy(projectKey);
  if (!deploy) return undefined;
  const primary =
    deploy.services.find((s) => s.isPrimaryPreview) ?? deploy.services[0];
  if (!primary) return undefined;
  return buildDeployUrl(primary.port, primary.path);
}

export function getPrimaryService(projectKey: string): DeployService | undefined {
  const deploy = getProjectDeploy(projectKey);
  if (!deploy) return undefined;
  return deploy.services.find((s) => s.isPrimaryPreview) ?? deploy.services[0];
}

export function getAllDeployRows(): Array<{
  project: string;
  service: string;
  port: number;
  url: string;
  projectKey: string;
}> {
  const labels: Record<string, string> = {
    smartqa: 'SmartQA（智能问数）',
    'code-review-agent': 'Code Review Agent',
    xhagentos: 'XHAgentOS',
  };
  return PROJECT_DEPLOYS.flatMap((p) =>
    p.services.map((s) => ({
      project: labels[p.projectKey] ?? p.projectKey,
      service: s.name,
      port: s.port,
      url: buildDeployUrl(s.port, s.path),
      projectKey: p.projectKey,
    })),
  );
}
