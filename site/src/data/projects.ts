import {
  getPrimaryPreviewUrl,
  getProjectDeploy,
  buildDeployUrl,
  useInSitePreview,
} from './deploy';
import { path } from '../lib/paths';

export type Project = {
  slug: string;
  projectKey: 'code-review-agent' | 'smartqa' | 'xhagentos';
  title: string;
  shortTitle: string;
  summary: string;
  coverTone: 'violet' | 'teal' | 'amber';
  featured: boolean;
  year: string;
  tags: string[];
  filters: Array<'agent' | 'data' | 'fullstack' | 'live'>;
  problem: string;
  solution: string;
  contributions: string[];
  techStack: string[];
  highlights: Array<{ title: string; text: string }>;
  relatedNoteSlugs: string[];
  github?: string;
};

export const projects: Project[] = [
  {
    slug: 'code-review-agent',
    projectKey: 'code-review-agent',
    title: 'Code Review Agent',
    shortTitle: '评审',
    summary:
      '基于 LLM + Agent + RAG 的智能代码评审系统。自动解析 GitHub PR Diff，输出多维度审查报告，并回写 PR Comment。',
    coverTone: 'violet',
    featured: true,
    year: '2026',
    tags: ['Python', 'FastAPI', 'Agent', 'RAG', 'Docker'],
    filters: ['agent', 'live'],
    problem:
      '人工 Code Review 成本高、反馈慢。只把 Diff 贴给大模型的方式存在上下文不足、规范不一致、token 失控与无法接入协作流程等问题。',
    solution:
      'Webhook / API / CLI 多入口 + 审查引擎 + RAG 知识增强：Diff 解析、分块增量审查、规范检索、结构化报告与 PR 评论回写。',
    contributions: [
      '设计审查流水线：Diff 解析、语言过滤、分块增量策略。',
      '实现 RAG 增强：规范文档、历史评审与最佳实践检索。',
      '打通 Webhook / API / CLI，支持本地调试与服务器部署。',
      '提供可访问的 Health 预览入口，便于演示与验收。',
    ],
    techStack: [
      'Python',
      'FastAPI',
      'LLM Agent',
      'RAG',
      'ChromaDB',
      'DeepSeek',
      'GitHub API',
      'Docker',
    ],
    highlights: [
      { title: '多维度审查', text: '正确性 / 安全 / 性能 / 可维护性 / 风格' },
      { title: '工程闭环', text: '触发、审查到评论回写形成完整链路' },
      { title: '成本可控', text: '增量与分块策略适配真实 PR 体量' },
      { title: '可演示', text: '本地 conda 与 Docker 多路径启动' },
    ],
    relatedNoteSlugs: ['code-review-as-agent'],
  },
  {
    slug: 'smartqa',
    projectKey: 'smartqa',
    title: '智能问数 SmartQA',
    shortTitle: '问数',
    summary:
      '自然语言查询电商数据：意图识别、NL2SQL、RAG 兜底与图表可视化。前端 + API 均已部署。',
    coverTone: 'teal',
    featured: false,
    year: '2026',
    tags: ['Vue 3', 'NL2SQL', 'LangChain', 'FastAPI'],
    filters: ['data', 'agent', 'fullstack', 'live'],
    problem:
      '业务同学需要用自然语言查询结构化数据，但直接 NL2SQL 容易因 schema 理解不足、脏数据与失败重试策略不当而不稳定。',
    solution:
      'Pipeline（意图 → 上下文 → RAG → NL2SQL → 执行/自纠错）与 Agent（ReAct + tools）双路径，失败时可回退检索增强，并可视化结果。',
    contributions: [
      '实现 NL2SQL 主路径与 RAG 兜底。',
      'Vue 3 前端 + Chart 可视化联调。',
      '部署前后端并提供公开预览入口。',
    ],
    techStack: ['Vue 3', 'FastAPI', 'LangChain', 'NL2SQL', 'ChromaDB', 'Chart.js'],
    highlights: [
      { title: '双路径', text: 'Pipeline + ReAct Agent 可切换' },
      { title: '可预览', text: '前端 18080 / API 18000 已上线' },
    ],
    relatedNoteSlugs: ['nl2sql-rag-layers'],
  },
  {
    slug: 'xhagentos',
    projectKey: 'xhagentos',
    title: 'XHAgentOS',
    shortTitle: '平台',
    summary:
      '智能瞭望与问数 Agent 平台：会话、知识库、技能中心、工作流与监控等多模块一体。',
    coverTone: 'amber',
    featured: false,
    year: '2026',
    tags: ['React', 'Workflow', 'Full-stack'],
    filters: ['fullstack', 'agent', 'live'],
    problem:
      '多智能体能力分散在对话、知识库、技能与工作流中，缺少统一的平台化承载与可演示入口。',
    solution:
      '构建一体化 Agent 操作系统原型：会话、知识、技能、工作流编排与监控，支持团队协作开发与部署。',
    contributions: [
      '参与前后端模块与联调。',
      '沉淀平台化信息架构与部署路径。',
    ],
    techStack: ['React', 'TypeScript', 'Workflow', 'Knowledge Base', 'Auth'],
    highlights: [
      { title: '平台化', text: '多业务模块统一入口' },
      { title: '可预览', text: '前端 18082 / 后端 18002' },
    ],
    relatedNoteSlugs: [],
  },
];

export function getAllProjects(): Project[] {
  return projects;
}

export function getFeaturedProject(): Project | undefined {
  return projects.find((p) => p.featured) ?? projects[0];
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function filterProjects(
  filter: 'all' | 'agent' | 'data' | 'fullstack' | 'live',
): Project[] {
  if (filter === 'all') return projects;
  return projects.filter((p) => p.filters.includes(filter));
}

/** 演示站真实 URL（始终指向服务器部署实例） */
export function getProjectPreviewUrl(project: Project): string {
  return (
    getPrimaryPreviewUrl(project.projectKey) ??
    buildDeployUrl(18080, '/')
  );
}

/** 站内 iframe 预览页路径 */
export function getInSitePreviewPath(project: Project): string {
  return path(`/projects/${project.slug}/preview`);
}

/**
 * 「预览项目」按钮最终 href
 * - server 构建：站内 /projects/:slug/preview
 * - github / 默认：直接外链演示站
 */
export function getPreviewHref(project: Project): string {
  if (useInSitePreview()) return getInSitePreviewPath(project);
  return getProjectPreviewUrl(project);
}

/** 是否应在新标签打开（外链时 true；站内预览 false） */
export function isPreviewExternal(): boolean {
  return !useInSitePreview();
}

export function getProjectServices(project: Project) {
  return getProjectDeploy(project.projectKey)?.services ?? [];
}

export { buildDeployUrl, useInSitePreview };
