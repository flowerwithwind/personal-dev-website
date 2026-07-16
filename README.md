# 个人开发者网站

Direction **E · Personal Soft** 个人数字主页（笔记 + 项目 + 在线预览）。

## 在线访问

| 环境 | 地址 |
|---|---|
| GitHub Pages | https://flowerwithwind.github.io/personal-dev-website/ |
| 服务器 Docker（推荐） | **http://公网IP:18083/** |

## 目录

| 路径 | 说明 |
|---|---|
| `site/` | **生产站点**（Astro） |
| `deploy/` | **服务器 Docker 编排 / remote-up** |
| `.github/workflows/` | CI + 自动部署 |
| `docs/` | 需求与详细设计 |
| `design-final/` | 高保真原型图与 HTML 稿 |

## 快速开始

```bash
cd site
npm install
npm run dev
npm test
npm run build
```

### 服务器自动部署（端口 18083）

与 SmartQA / XHAgentOS 相同流水线，见 **`deploy/README.md`**。

你需要：

1. 在服务器安全组 / ufw **放行 TCP 18083**
2. 仓库配置 Secrets：`DOCKER_USERNAME` `DOCKER_PASSWORD` `SERVER_HOST` `SERVER_USER` `SERVER_PASSWORD`
3. `git push origin main` 触发 **Deploy Personal Site**

```bash
# 服务器一次性
sudo mkdir -p /opt/personal-dev-website
sudo chown -R ubuntu:ubuntu /opt/personal-dev-website
sudo ufw allow 18083/tcp
```

### GitHub Pages（可选）

```bash
cd site
# 默认 DEPLOY_TARGET=github
npm run build
powershell -ExecutionPolicy Bypass -File .\deploy-gh-pages.ps1
```

详见 `site/README.md`、`deploy/README.md`。
