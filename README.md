# 个人开发者网站

Direction **E · Personal Soft** 个人数字主页（笔记 + 项目 + 在线预览）。

## 在线访问

**https://flowerwithwind.github.io/personal-dev-website/**

## 目录

| 路径 | 说明 |
|---|---|
| `site/` | **生产站点**（Astro） |
| `docs/` | 需求与详细设计 |
| `design-final/` | 高保真原型图与 HTML 稿 |
| `design-directions/` | 方向选型稿 |
| `prototypes/` | 早期多页原型 |

## 快速开始

```bash
cd site
npm install
npm run dev      # 本地开发
npm test         # 单元测试
npm run build    # 产出 dist/
```

部署到 GitHub Pages：

```bash
cd site
npm run build
powershell -ExecutionPolicy Bypass -File .\deploy-gh-pages.ps1
```

详见 `site/README.md`。
