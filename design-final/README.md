# 方向 E · 详细设计交付包

## 文档

- 详细设计：`../docs/详细设计文档_方向E.md`
- 早期需求调研：`../docs/需求分析文档.md`

## 原型图（PNG，直接查看）

路径：`images/`

| 文件 | 页面 |
|---|---|
| `00-style-board.png` | 视觉规范板（色板/字体/背景层） |
| `01-home.png` | 首页 |
| `02-notes.png` | 笔记列表 |
| `03-note-detail.png` | 笔记详情 |
| `04-projects.png` | 项目列表（含预览按钮 + 端口表） |
| `05-project-detail.png` | 项目详情 · Code Review Agent（预览 :18001） |
| `05b-project-detail-smartqa.png` | 项目详情 · SmartQA（预览 :18080） |
| `05c-project-detail-xhagentos.png` | 项目详情 · XHAgentOS（预览 :18082） |
| `06-about.png` | 关于 |

## 可交互 HTML 源稿

路径：`pages/`（浏览器打开即可，样式含多层氛围背景）

重新导出图片：

```bash
python design-final/export_images.py
```

## 相对 v1 的关键修正

1. 锁定 **Personal Soft** 个人站定位（笔记一等公民）
2. **背景多层**：暖纸基色 + 紫/青/玫瑰光斑 + 点阵 + vignette（禁止单色平涂）
3. 宋体大标题 + 现代正文，胶囊按钮
4. 直接交付全套 PNG 原型图
