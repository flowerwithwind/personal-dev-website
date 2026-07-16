# 个人开发者网站 · 需求与高保真原型

本目录包含三份核心交付物：

1. **需求分析文档**（竞品调研 + 功能/非功能需求 + 信息架构 + 设计规范）
2. **设计方向选型原型图**（4 套视觉大方向，先挑选再开发）
3. **完整页面高保真原型**（方向确定后的多页参考实现）

## 目录结构

```
personal-dev-website/
├── README.md
├── docs/
│   └── 需求分析文档.md
├── design-directions/          # ★ 先看这里选方向
│   ├── index.html              # 选型画廊
│   ├── A-midnight-engineer.html
│   ├── B-clean-light.html
│   ├── C-terminal-ide.html
│   ├── D-ai-aurora.html
│   └── previews/               # 导出的 PNG 预览图
└── prototypes/                 # 多页完整原型（先前默认深色方向）
    ├── index.html
    ├── projects.html
    ├── project-detail.html
    ├── about.html
    ├── contact.html
    ├── css/styles.css
    └── js/main.js
```

## 第一步：挑选设计方向

打开：

`design-directions/index.html`

或直接查看 PNG：

`design-directions/previews/A-midnight-engineer.png` 等

| 方向 | 名称 | 气质 |
|---|---|---|
| A | Midnight Engineer | 深色工程师极简（求职默认推荐） |
| B | Clean Light Studio | 浅色亲和落地页 |
| C | Terminal / IDE | 编辑器极客风 |
| D | AI Aurora | 炫彩 AI 产品感 |


## 如何预览原型

### 方式 A：直接打开

用浏览器打开：

`prototypes/index.html`

### 方式 B：本地静态服务（推荐，避免部分浏览器限制）

在 `prototypes` 目录下执行：

```bash
# Python
python -m http.server 5173

# 或 Node
npx --yes serve -p 5173
```

然后访问 `http://localhost:5173`。

## 原型已实现交互

| 功能 | 说明 |
|---|---|
| 全站导航 | 五页互通，当前页高亮 |
| 深/浅色主题 | 右上角切换，localStorage 记忆 |
| 移动端菜单 | 小屏汉堡菜单 |
| 项目筛选 | 项目页按 AI Agent / 数据智能 / 全栈过滤 |
| 联系表单 | 提交后展示成功态（不真实发送） |
| 响应式布局 | 桌面 / 平板 / 手机断点 |

## 设计决策摘要

- **风格**：深色极简工程师风 + 青绿强调色（参考 Brittany Chiang 等信息架构）
- **转化**：首页与页脚保留简历 / 联系 CTA（参考 Matt Farley）
- **内容**：绑定工作区真实项目（Code Review Agent、Wenshu、XHAgentOS）
- **详情页结构**：问题 → 方案 → 贡献 → 技术栈 → 成果（服务面试叙事）

完整调研与需求见：`docs/需求分析文档.md`。

## 下一步（实现站）

1. 确认文案、头像、真实邮箱与 GitHub 链接  
2. 用 Astro / Next.js / Vite 落地组件化站点  
3. 替换项目封面为真实截图 / 架构图  
4. 挂载 `resume.pdf` 与 SEO / OG 元信息  
5. 部署到 Vercel / Cloudflare Pages / GitHub Pages  

## 占位信息说明

原型中的姓名展示、邮箱 `hello@example.com`、部分教育经历为**可替换占位**，上线前请改为真实信息并与简历保持一致。
