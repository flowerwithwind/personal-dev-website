# 个人站 — 服务器自动部署（Docker）

模式对齐 SmartQA / XHAgentOS / Code Review Agent：

**测试 → 构建镜像 → 推 Docker Hub → SCP 到服务器 → `docker compose pull && up`**

## 端口规划

| 项目 | 端口 |
|------|------|
| SmartQA 前端 / API | `18080` / `18000` |
| Code Review Agent | `18001` |
| XHAgentOS 前端 / 后端 | `18082` / `18002` |
| **个人站（本项目）** | **`18083`** |

默认访问：`http://公网IP:18083/`

---

## GitHub Secrets

仓库 **Settings → Secrets and variables → Actions**

| Secret | 必填 | 说明 |
|--------|------|------|
| `DOCKER_USERNAME` | ✅ | Docker Hub 用户名 |
| `DOCKER_PASSWORD` | ✅ | Hub 密码 / Token |
| `SERVER_HOST` | 远程部署 | 服务器公网 IP（如 `1.14.106.17`） |
| `SERVER_USER` | 远程部署 | 如 `ubuntu` |
| `SERVER_PASSWORD` | 远程部署 | SSH 密码 |
| `SERVER_PORT` | 可选 | 默认 `22` |
| `HTTP_PORT` | 可选 | 默认 `18083` |
| `SERVER_PUBLIC_URL` | 可选 | 写入站点构建，默认 `http://1.14.106.17:18083` |

未配置 `SERVER_HOST` 时：流水线**只推镜像**，不上机。

---

## 服务器一次性准备

```bash
sudo mkdir -p /opt/personal-dev-website
sudo chown -R ubuntu:ubuntu /opt/personal-dev-website   # 用户名按实际改

# 防火墙 / 安全组放行（你自行开启）
sudo ufw allow 18083/tcp
# 云厂商安全组同样放行 TCP 18083
```

Docker 与镜像加速可参考 wenshu：`deploy/install-docker-ubuntu.sh`。

---

## 触发部署

```bash
git push origin main
# 或 Actions → Deploy Personal Site → Run workflow
```

成功后服务器应有：

```text
/opt/personal-dev-website/
  docker-compose.yml
  .env
  remote-up.sh
```

```bash
cd /opt/personal-dev-website
docker compose ps
curl -fsS http://127.0.0.1:18083/healthz
curl -fsS http://127.0.0.1:18083/ | head
```

公网：`http://SERVER_HOST:18083/`

---

## 镜像

`${DOCKER_USERNAME}/personal-dev-website:latest`

本地手动构建推送：

```bash
cd site
docker build -t "$DOCKER_USERNAME/personal-dev-website:latest" \
  --build-arg DEPLOY_TARGET=server \
  --build-arg SERVER_PUBLIC_URL=http://1.14.106.17:18083 \
  .
docker push "$DOCKER_USERNAME/personal-dev-website:latest"
```

---

## 与 GitHub Pages 的关系

| 环境 | 地址 | base |
|------|------|------|
| GitHub Pages | `https://flowerwithwind.github.io/personal-dev-website/` | `/personal-dev-website` |
| 服务器 Docker | `http://IP:18083/` | `/` |

服务器为 **HTTP**，与同机 HTTP 演示站（18080/18082 等）协议一致时，**可 iframe 内嵌预览**（若演示站未设置禁止嵌入）。

### 预览模式（双构建）

| 构建 | `DEPLOY_TARGET` | 「预览项目」行为 |
|------|-----------------|------------------|
| GitHub Pages | `github`（默认） | 新标签打开演示站 URL（避免 HTTPS 嵌 HTTP） |
| 服务器 Docker | `server` | 站内 `/projects/:slug/preview` **iframe 内嵌** |

两套产物互不影响：Pages 流水线/脚本仍用 github；本仓库 `Deploy Personal Site` 用 server。

---

## 常见问题

| 现象 | 处理 |
|------|------|
| 公网打不开 | 安全组 / ufw 是否放行 18083 |
| pull 超时 | 服务器配 Docker 镜像加速后重跑 `./remote-up.sh` |
| 页面 404 静态资源 | 确认镜像用 `DEPLOY_TARGET=server` 构建（base=/） |
