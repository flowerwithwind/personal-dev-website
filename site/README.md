# 赵海蓺 · 个人网站（Direction E · Personal Soft）

Astro 静态站点：笔记优先的个人数字主页，含项目在线预览入口。

## 在线地址

| 环境 | 地址 | 构建 |
|---|---|---|
| GitHub Pages | https://flowerwithwind.github.io/personal-dev-website/ | 默认 `DEPLOY_TARGET=github` |
| **服务器** | **http://IP:18083/** | `DEPLOY_TARGET=server`（Docker CI） |

服务器自动部署见 `../deploy/README.md`。

### 自定义域名

1. 编辑 `domain.config.mjs`，填写 `customDomain`  
2. 按 `../docs/自定义域名.md` 配置 DNS  
3. `npm run build` + 部署

### 作者入口（本机演示）

- `/login` 与 `/admin` 仅用于当前浏览器的本机笔记草稿演示。
- 这是静态站点上的客户端校验，不提供真正的服务端身份认证、云端发布、访问控制或跨设备同步；不要在其中保存敏感内容。
- 笔记保存在 IndexedDB/localStorage，可导出 Markdown 后纳入仓库发布。
- 页面切换使用 View Transitions 平滑过渡。

## 简历下载

右上角 **下载简历** 对应 `public/resume.pdf`。请替换为你的正式 PDF。

## 本地开发

```bash
cd site
npm install
npm run dev
```

## 构建 / 预览

```bash
npm test
npm run build
npm run preview
# 或
npx serve dist -l 4173
```

产物目录：`site/dist/`

## 部署（服务器 Docker · 推荐 · 端口 18083）

与 SmartQA / XHAgentOS 相同：`测试 → Docker Hub → SCP → remote-up`。

```bash
# 镜像本地构建示例；生产请显式传入实际站点 URL
SERVER_PUBLIC_URL=http://127.0.0.1:18083
docker build -t "$DOCKER_USERNAME/personal-dev-website:latest" \
  --build-arg DEPLOY_TARGET=server \
  --build-arg SERVER_PUBLIC_URL="$SERVER_PUBLIC_URL" \
  .
```

完整 Secrets、防火墙与流水线说明见 **`../deploy/README.md`**。

## 部署（GitHub Pages）

GitHub Pages 由 `.github/workflows/pages.yml` 使用官方 Actions 自动发布：

1. 仓库 Settings → Pages → Build and deployment → Source 选择 **GitHub Actions**。
2. 推送到 `main`，或在 Actions 中手动运行 **Deploy GitHub Pages**。
3. 工作流会执行 `npm run check`、GitHub Pages 构建和产物发布；不依赖 Docker Hub 或服务器 Secrets。

站点地址：<https://flowerwithwind.github.io/personal-dev-website/>。

旧的 `deploy-gh-pages.ps1` 仅作为手动/兼容方案，不是推荐发布路径。

## 功能对照

| 路由 | 说明 |
|---|---|
| `/` | Hero · Now · 最新笔记 · 项目 · 关于 band |
| `/notes` | 笔记列表 + 标签筛选（渐进增强） |
| `/notes/:slug` | Markdown 渲染的笔记详情 |
| `/projects` | Featured + 卡片 + 部署端口表 + **预览项目** |
| `/projects/:slug` | 案例详情 + **预览项目** 主 CTA |
| `/about` | 关于 / 时间线 / 技能 |
| `/rss.xml` | 笔记 RSS |

### 线上 Demo（1.14.106.17）

| 项目 | 预览 |
|---|---|
| Code Review Agent | http://1.14.106.17:18001/api/health |
| SmartQA 前端 | http://1.14.106.17:18080/ |
| SmartQA API | http://1.14.106.17:18000/api/health |
| XHAgentOS 前端 | http://1.14.106.17:18082/ |
| XHAgentOS 后端 | http://1.14.106.17:18002/ |

映射源码：`src/data/deploy.ts`

## 技术栈

- Astro 4（静态输出）
- 设计 Token + 组件（Header / Footer / NoteCard / ProjectCard）
- Vitest（deploy URL / note filter / base path）
- 响应式断点 640 / 860；多层氛围背景

## 设计文档

- `../docs/详细设计文档_方向E.md`
- `../docs/需求分析文档.md`
- `../design-final/images/`
