# 赵海蓺 · 个人网站（Direction E · Personal Soft）

Astro 静态站点：笔记优先的个人数字主页，含项目在线预览入口。

## 在线地址

**https://flowerwithwind.github.io/personal-dev-website/**

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

## 部署（GitHub Pages）

1. `npm run build`
2. `powershell -ExecutionPolicy Bypass -File .\deploy-gh-pages.ps1`  
   将 `dist/` 强制推送到 `gh-pages` 分支  
3. 仓库 Settings → Pages → Source = **Deploy from a branch** → `gh-pages` / `/ (root)`

仓库：https://github.com/flowerwithwind/personal-dev-website

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
