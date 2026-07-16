# 个人网站详细设计文档 · 方向 E（Personal Soft）

| 项 | 内容 |
|---|---|
| 版本 | v2.0 |
| 日期 | 2026-07-16 |
| 选定方向 | **E · Personal Soft**（个人站 + 笔记花园） |
| 视觉参考 | [Coze 官网](https://www.coze.cn/overview) 排版/圆角/暖底气质 + 层次化氛围背景 |
| 原型图目录 | `design-final/images/` |
| 可交互稿 | `design-final/pages/` |

---

## 1. 设计目标与原则

### 1.1 产品定位

本站是**个人数字主页（Personal Site / Digital Garden）**，不是纯求职作品集。

| 优先级 | 目标 |
|---|---|
| P0 | 记录与展示个人思考（笔记）、实践（项目）与近况（Now） |
| P0 | 中文阅读体验优先：标题耐看、正文舒适、长文友好 |
| P1 | 顺带支撑求职与技术交流（证据链完整，但口吻非投递站） |
| P1 | 背景与层次有氛围，避免「一片死灰/死白」的单调感 |
| P2 | 可订阅（RSS）、可长期用 Markdown 维护 |

### 1.2 设计原则

1. **个人优先**：导航与首页权重 = 笔记 ≥ 项目 ≥ 关于  
2. **宋体标题 + 无衬线正文**：对齐 Coze 的 SourceHanSerif 气质  
3. **暖色纸感底 + 多层氛围**：背景必须「有空气感」，禁止纯平铺单色  
4. **胶囊控件、大圆角卡片**：亲和、现代、产品级完成度  
5. **克制动效**：服务层次与焦点，不抢内容  
6. **可生长内容**：笔记允许 Seed / 修订中状态  

### 1.3 明确修正：背景不可单调

| 问题 | 表现 | 规范对策 |
|---|---|---|
| 单色平涂 | 整页只有 `#F4F4EF` | 至少 3 层：基色 + 光斑渐变 + 纹理/点阵 |
| 无景深 | 卡片与背景糊成一片 | 卡片白底抬升 + 轻阴影 + 背景降低对比 |
| 无焦点 | 视线无处停留 | Hero 区加强径向光晕；区块用柔和分隔 |
| 过炫 | 渐变像海报 | 饱和度低、边缘羽化、不出现硬色块 |

**背景最低验收**：在 1440×900 截图中，应能辨出至少两种色温区域（如紫雾 + 青雾）及一种微纹理（点阵/噪点），且正文对比度仍达 WCAG AA。

---

## 2. 信息架构

```
首页 /
├── Header（Logo · 笔记 · 项目 · 关于 · 订阅）
├── Hero（个人表达 + 双 CTA）
├── Now（Build / Write / Learn / Life）
├── 最新笔记（精选 1 大 + 2 小）
├── 项目与实验（3 卡）
└── 关于本站 band + Footer

笔记 /notes
├── 标题与说明
├── 标签筛选
└── 笔记列表 → /notes/:slug

笔记详情 /notes/:slug
├── 元信息（标签、日期、阅读时长、状态）
├── 正文
├── 相关笔记 / 相关项目
└── 修订说明（可选）

项目 /projects
├── 列表 + 筛选
└── /projects/:slug 案例详情

关于 /about
├── 简介
├── 时间线
├── 技能
└── 联系

次要：/rss.xml · /resume.pdf
```

### 2.1 导航

| 位置 | 内容 |
|---|---|
| 主导航 | 首页 · **笔记** · 项目 · 关于 |
| 主操作 | 订阅（或 RSS） |
| 页脚 | 导航复述 · 邮箱 · GitHub · RSS · 版权 |

---

## 3. 视觉设计系统

### 3.1 色彩

| Token | 色值 | 用途 |
|---|---|---|
| `--bg-base` | `#F3F1EA` | 全局基色（暖纸，略深于纯 Coze 以便衬光斑） |
| `--bg-elevated` | `#FFFFFF` | 卡片、页眉实底 |
| `--ink` | `#0C0B10` | 主文字 |
| `--ink-soft` | `rgba(12,11,16,0.72)` | 次级文字 |
| `--muted` | `rgba(12,11,16,0.50)` | 辅助说明 |
| `--line` | `rgba(12,11,16,0.08)` | 描边 |
| `--accent` | `#5B4DFF` | 链接、标签、焦点 |
| `--accent-2` | `#0F9F8A` | 次强调（Now / 成功感） |
| `--glow-violet` | `rgba(124, 108, 255, 0.28)` | 背景光斑 |
| `--glow-teal` | `rgba(20, 184, 166, 0.16)` | 背景光斑 |
| `--glow-rose` | `rgba(244, 114, 182, 0.10)` | 背景光斑（弱） |
| `--band` | `#14131A` | 深色 band / 页脚对比块 |

浅色主题为主；深色模式为 Should（后续），若做则需单独背景层规范。

### 3.2 背景层次规范（重点）

页面背景必须按 **固定层叠顺序** 实现，禁止只用 `background-color`：

```
Layer 0  Base fill          #F3F1EA
Layer 1  Mesh gradients     2–3 个 radial-gradient（紫 / 青 / 玫瑰），低饱和
Layer 2  Soft vignette      边缘略暗或略暖，增加景深（可选）
Layer 3  Micro texture      点阵 OR 1–2% 噪点（opacity 3–6%）
Layer 4  Content            白卡片 / 文字（z-index 高于装饰）
```

#### 推荐 CSS 骨架

```css
body {
  background-color: #f3f1ea;
  background-image:
    /* L3 点阵 */
    radial-gradient(rgba(12,11,16,0.045) 1px, transparent 1px),
    /* L1 光斑 */
    radial-gradient(900px 520px at 12% -8%, rgba(124,108,255,0.22), transparent 58%),
    radial-gradient(820px 480px at 96% 6%, rgba(20,184,166,0.14), transparent 55%),
    radial-gradient(700px 420px at 50% 105%, rgba(244,114,182,0.09), transparent 55%),
    /* L2  vignette-ish */
    linear-gradient(180deg, rgba(255,255,255,0.35) 0%, transparent 28%, transparent 72%, rgba(227,222,210,0.55) 100%);
  background-size:
    22px 22px,
    auto, auto, auto, auto;
  background-attachment: fixed; /* 桌面端；移动端可 scroll 以免性能问题 */
}
```

#### 分区氛围差异

| 区域 | 背景处理 |
|---|---|
| Hero | 顶部光斑最强；标题落在最亮区旁或中心 |
| Now / 列表区 | 依赖全局纹理即可，避免再叠强渐变 |
| 深色 Band | 实色深底 + 内部微光（可选） |
| 笔记详情正文 | 可收窄内容柱 + 更安静侧缘，减少光斑干扰阅读 |

#### 禁止项

- 高饱和彩虹渐变铺满全屏  
- 强网格线抢正文  
- 动态粒子默认开启（仅可作可选增强）  
- 背景对比度导致正文发灰（正文必须落在卡片或足够对比的区域上）  

### 3.3 字体

| 角色 | 字体 | 规格 |
|---|---|---|
| Display / H1–H2 | Noto Serif SC / Source Han Serif SC | 600；H1 桌面 48–58px；字距 -0.02em；行高 1.12–1.25 |
| 正文 / UI | Inter + Noto Sans SC | 400–500；正文 16–17px；行高 1.7–1.8 |
| 标签 / 元信息 | Inter / Noto Sans SC | 600–700；12–13px |
| 代码 | JetBrains Mono | 13–14px；仅代码块 |

### 3.4 间距与圆角

| Token | 值 |
|---|---|
| 内容最大宽 | 1120–1180px（笔记正文柱 720–760px） |
| 页边距 | 桌面 24–32px；移动 16–20px |
| 区块垂直间距 | 48–72px |
| 卡片圆角 | 18–22px |
| 大容器圆角 | 28px |
| 按钮 | 全圆角胶囊，高度 42–46px |
| 阴影 | `0 16px 40px rgba(15,15,20,0.06)` 级轻阴影 |

### 3.5 组件清单

- 顶栏（毛玻璃 + 背景透出氛围）  
- 主/次按钮、文字链接  
- Now 信息条  
- 笔记卡（大卡 / 小卡 / 列表行）  
- 项目卡（色带封面 + 正文）  
- 标签 Chip / 筛选 Chip  
- 深色 Band  
- 页脚  
- 空状态 / 生长中 Seed 标记  

---

## 4. 页面详细设计

### 4.1 首页

**目标**：建立个人气质；引导读笔记或看项目。

| 区块 | 内容 | 交互/视觉 |
|---|---|---|
| Header | Logo、导航、订阅 | sticky；滚动后底部分割线 |
| Hero | 宋体主标题、一句话、阅读笔记 / 查看项目 | 居中；背景光斑最强 |
| Now | 4 条近况 | 白卡片浮于氛围底 |
| 最新笔记 | 1 大 + 2 小 | 大卡轻紫晕 |
| 项目 | 3 列项目卡 | 封面渐变区分项目 |
| Band | 站点目的说明 | 深色对比 |
| Footer | 链接与版权 | 透出点阵底 |

**文案基调示例**

> 写一点笔记，做一些能跑起来的东西。  
> 这里是个人主页：分享实践，也存放仍在生长的想法。

### 4.2 笔记列表

- 页标题「笔记」+ digital garden 说明  
- 筛选：全部 / Agent / RAG / 工程 / 阅读札记 / 随笔  
- 列表行：分类、标题、摘要、日期  
- Seed 状态显示「持续更新」  

### 4.3 笔记详情

- 窄栏阅读（~720px）  
- 顶：分类、标题、日期、时长  
- 正文：段落、小标题、引用、代码块  
- 底：相关笔记、关联项目  
- 背景：全局氛围保留但 **内容区更安静**（正文在白底卡片或纯净柱内）  

### 4.4 项目列表 / 详情（含在线预览）

- 列表：筛选 + **Featured 大卡 + 双列卡片**；展示 Live 状态与主端口  
- 列表底部：**部署端口一览表**（IP / 服务 / 端口 / 访问 URL）  
- 详情：问题 → 方案 → 贡献 → 技术栈 → 部署信息  
- **主 CTA：预览项目**（新标签打开服务器部署地址）  
- 侧栏「在线预览入口」列出前端 / API 端口与完整 URL  
- 与笔记互相链（「相关写作」）  

#### 4.4.1 线上部署映射（IP = `1.14.106.17`）

| 项目 | 服务 | 端口 | 预览主入口（示例） |
|---|---|---|---|
| SmartQA（智能问数） | 前端 | 18080 | `http://1.14.106.17:18080/` |
| SmartQA（智能问数） | 后端 API | 18000 | `http://1.14.106.17:18000/api/health` |
| Code Review Agent | API | 18001 | `http://1.14.106.17:18001/api/health` |
| XHAgentOS | 前端 | 18082 | `http://1.14.106.17:18082/` |
| XHAgentOS | 后端 | 18002 | `http://1.14.106.17:18002/` |

**交互约定**

- 有前端的项目：主「预览项目」= 前端 URL  
- 仅 API 的项目：主「预览项目」= Health / Docs 可公开入口  
- 列表卡与详情页均须出现「预览项目」按钮，`target="_blank"` + `rel="noopener noreferrer"`  


### 4.5 关于

- 头像/标识 + 长简介  
- 时间线  
- 技能分组  
- 联系（邮箱、GitHub）——不强调硬广求职  

---

## 5. 内容模型

```ts
type Note = {
  slug: string
  title: string
  summary: string
  category: 'essay' | 'note' | 'journal' | 'reading' | 'seed'
  tags: string[]
  publishedAt: string
  updatedAt?: string
  readingMinutes?: number
  status: 'published' | 'growing'
  body: string // markdown
  relatedNoteSlugs?: string[]
  relatedProjectSlugs?: string[]
}

type Project = {
  slug: string
  title: string
  summary: string
  coverTone: 'violet' | 'teal' | 'amber'
  tags: string[]
  problem: string
  solution: string
  highlights: string[]
  techStack: string[]
  links: { label: string; url: string }[]
  relatedNoteSlugs?: string[]
}

type NowItem = {
  kind: 'build' | 'write' | 'learn' | 'life'
  text: string
}
```

---

## 6. 动效与响应式

| 项 | 规范 |
|---|---|
| Hover | 卡片 `translateY(-2px)` + 阴影略增强，150–180ms |
| 滚动 | Header 毛玻璃；可选区块 fade-in（尊重 `prefers-reduced-motion`） |
| 背景 | `background-attachment: fixed` 仅桌面；移动端取消以免卡顿 |
| 断点 | 640 / 860 / 1120  
| 移动 | 导航收为抽屉；笔记大卡改为通栏；项目单列 |

---

## 7. 无障碍与性能

- 正文与背景对比 ≥ 4.5:1（正文优先放在白卡片上）  
- 焦点环使用 `--accent`  
- 图片/装饰 `aria-hidden`；语义标题层级正确  
- 点阵与渐变为 CSS，无额外大图；噪点若用 SVG filter 需测性能  
- 字体：Serif + Sans 子集或 `display=swap`  

---

## 8. 技术实现建议（开发阶段）

| 层 | 建议 |
|---|---|
| 框架 | Astro 或 Next.js（静态优先，利于笔记） |
| 内容 | MDX / Markdown + frontmatter |
| 样式 | CSS Variables + 少量 utility；背景层写在全局 layout |
| 部署 | Cloudflare Pages / Vercel / GitHub Pages |
| 订阅 | 构建时生成 RSS |

---

## 9. 原型图交付清单

| 编号 | 页面 | 图片文件 |
|---|---|---|
| 01 | 首页 | `images/01-home.png` |
| 02 | 笔记列表 | `images/02-notes.png` |
| 03 | 笔记详情 | `images/03-note-detail.png` |
| 04 | 项目列表 | `images/04-projects.png` |
| 05 | 项目详情 | `images/05-project-detail.png` |
| 06 | 关于 | `images/06-about.png` |
| 00 | 视觉规范拼贴（可选） | `images/00-style-board.png` |

源文件 HTML：`design-final/pages/*.html`  
导出脚本：`design-final/export_images.py`

---

## 10. 验收标准

- [ ] 采用方向 E 信息架构（笔记一级导航）  
- [ ] 背景含基色 + ≥2 光斑 + 微纹理，截图可见层次  
- [ ] 标题宋体、正文无衬线，字号层级清晰  
- [ ] 首页同时出现 Now、笔记、项目  
- [ ] 主 CTA 非「纯简历下载」  
- [ ] 六张核心页面原型图齐全  
- [ ] 移动断点无横向溢出、正文可读  

---

## 11. 修订记录

| 版本 | 说明 |
|---|---|
| v1.x | 调研与 A–D 方向、初版需求 |
| **v2.0** | 锁定 E；强化个人站+笔记；**背景多层氛围规范**；输出详细设计与原型图 |
