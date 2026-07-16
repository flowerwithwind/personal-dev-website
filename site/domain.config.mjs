/**
 * 自定义域名配置（单一数据源）
 *
 * 使用方式：
 * 1. 把你的域名填到 `customDomain`（不要带 https://）
 *    例：'www.zhaohaiyi.com' 或 'zhaohaiyi.com'
 * 2. 按 docs/自定义域名.md 在域名服务商处配置 DNS
 * 3. GitHub 仓库 Settings → Pages → Custom domain 填同一域名并启用 HTTPS
 * 4. npm run build && 重新 deploy-gh-pages
 *
 * 留空 '' 则继续使用 GitHub 默认地址：
 * https://flowerwithwind.github.io/personal-dev-website/
 */
export const customDomain = '';

/** GitHub Pages 默认（无自定义域名时） */
export const githubPages = {
  site: 'https://flowerwithwind.github.io',
  base: '/personal-dev-website',
};

export function getSiteUrl() {
  if (customDomain) {
    return `https://${customDomain.replace(/^https?:\/\//, '').replace(/\/$/, '')}`;
  }
  return `${githubPages.site}${githubPages.base}`;
}

export function getAstroSite() {
  if (customDomain) {
    return `https://${customDomain.replace(/^https?:\/\//, '').replace(/\/$/, '')}`;
  }
  return githubPages.site;
}

export function getAstroBase() {
  // 自定义域名时站点在根路径；GitHub 项目页需要仓库名作 base
  return customDomain ? '/' : githubPages.base;
}
