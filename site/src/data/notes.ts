export type NoteCategory = 'essay' | 'note' | 'journal' | 'reading' | 'seed';

export type Note = {
  slug: string;
  title: string;
  summary: string;
  category: NoteCategory;
  categoryLabel: string;
  tags: string[];
  /** filter chips on list page */
  filters: string[];
  publishedAt: string;
  updatedAt?: string;
  readingMinutes: number;
  status: 'published' | 'growing';
  body: string;
  relatedNoteSlugs: string[];
  relatedProjectSlugs: string[];
  featured?: boolean;
};

export const categoryLabels: Record<NoteCategory, string> = {
  essay: 'Essay',
  note: 'Note',
  journal: 'Journal',
  reading: 'Reading',
  seed: 'Garden · Seed',
};

export const notes: Note[] = [
  {
    slug: 'code-review-as-agent',
    title: '把 Code Review 做成 Agent，而不是把 Diff 丢给大模型',
    summary:
      '上下文裁剪、规范检索、失败回退与协作流回写——从脚本到系统的路径。',
    category: 'essay',
    categoryLabel: 'Essay · Agent',
    tags: ['Agent', 'RAG', '工程'],
    filters: ['Agent', '工程'],
    publishedAt: '2026-07-12',
    readingMinutes: 12,
    status: 'published',
    featured: true,
    relatedNoteSlugs: ['nl2sql-rag-layers', 'agent-observability-notes'],
    relatedProjectSlugs: ['code-review-agent'],
    body: `很多「AI 代码评审」停在同一层：把 PR Diff 塞进提示词，等模型吐出一段意见。它能跑，但很难稳定、很难接入协作、也很难解释为什么这次有效、下次失效。

我更关心的是：如何把它做成一个**可触发、可增量、可回写 GitHub、可被规范知识增强**的系统。

## 问题拆解

- 上下文过长导致 token 失控，或裁剪过狠丢掉关键变更。
- 缺少仓库规范与历史评审经验，建议泛化、不可执行。
- 结果无法回到 PR 评论流，停留在本地报告。

> Agent 的价值不在「更会说话」，而在「更能可靠地完成工作闭环」。

## 一条可用的流水线

\`\`\`
PR Event → Webhook
  → Diff 解析 / 语言过滤
  → 分块增量审查
  → RAG：规范 / 历史 / 最佳实践
  → 多维度结构化输出
  → PR Comment + 报告
\`\`\`

## 仍在思考

如何量化评审质量？如何把「高风险问题」与 CI 门禁结合？这些会在后续笔记里继续生长。
`,
  },
  {
    slug: 'nl2sql-rag-layers',
    title: 'NL2SQL 失败时，检索应发生在哪一层？',
    summary: '意图、Schema、样例与自纠错：分层兜底比反复重试提示词更稳。',
    category: 'note',
    categoryLabel: 'Note · RAG',
    tags: ['RAG', 'NL2SQL'],
    filters: ['RAG', 'Agent'],
    publishedAt: '2026-07-03',
    readingMinutes: 8,
    status: 'published',
    relatedNoteSlugs: ['code-review-as-agent'],
    relatedProjectSlugs: ['smartqa'],
    body: `NL2SQL 最常见的失败不是「模型不会写 SQL」，而是**它不知道该看哪张表、哪一列语义、以及业务口径**。

## 分层比硬重试更稳

1. **意图层**：问的是汇总、对比还是明细？
2. **Schema 检索**：只注入相关表结构，而不是全库 dump。
3. **样例检索**：相似问句对应的成功 SQL 作为 few-shot。
4. **执行自纠错**：语法/空结果时带着错误信息再生成一次。

当 Pipeline 失败时，再回退到更宽的 RAG 或 ReAct 工具调用，而不是无限重提示。

这套思路已经用在智能问数 SmartQA 的双路径设计里。
`,
  },
  {
    slug: 'agent-observability-notes',
    title: '本周札记：可观测性与 Agent 调试',
    summary: '日志字段如何同时服务排错与对外讲述。',
    category: 'journal',
    categoryLabel: 'Journal',
    tags: ['工程', '可观测性'],
    filters: ['工程', '随笔'],
    publishedAt: '2026-06-28',
    readingMinutes: 5,
    status: 'published',
    relatedNoteSlugs: ['code-review-as-agent'],
    relatedProjectSlugs: ['code-review-agent'],
    body: `调试 Agent 时，我越来越依赖固定字段：

- \`trace_id\` / \`run_id\`
- 工具名、入参摘要、耗时
- 检索命中的文档 id
- token 用量与错误码

没有这些，面试讲解和线上排错都会变成「感觉模型今天不太行」。

下周想把 Code Review Agent 的任务状态查询再补一层结构化事件流。
`,
  },
  {
    slug: 'building-llm-apps-notes',
    title: '读《Building LLM Apps》时划下的三处',
    summary: '评估、缓存与人机回路：摘录 + 我的批注。',
    category: 'reading',
    categoryLabel: 'Reading',
    tags: ['阅读札记', 'LLM'],
    filters: ['阅读札记'],
    publishedAt: '2026-06-15',
    readingMinutes: 6,
    status: 'published',
    relatedNoteSlugs: [],
    relatedProjectSlugs: [],
    body: `三处批注：

1. **评估先于炫技**：没有 golden set，就没有迭代方向。
2. **缓存是产品能力**：重复问句不该每次都烧 token。
3. **人机回路**：高风险动作必须可确认，而不是全自动。

这些原则可以直接映射到评审 Agent 的门禁策略上。
`,
  },
  {
    slug: 'public-knowledge-boundary',
    title: '（生长中）个人知识库公开化的边界',
    summary: '哪些笔记适合公开，哪些应永远留在私有库——还在想。',
    category: 'seed',
    categoryLabel: 'Garden · Seed',
    tags: ['随笔', '数字花园'],
    filters: ['随笔'],
    publishedAt: '2026-06-01',
    updatedAt: '2026-07-10',
    readingMinutes: 3,
    status: 'growing',
    relatedNoteSlugs: [],
    relatedProjectSlugs: [],
    body: `公开的标准暂定为：

- 对他人有复用价值
- 不泄露隐私与未授权项目细节
- 我愿意长期维护修正

仍在犹豫：半成品是否应该标成 Seed 直接公开？目前倾向「标状态，允许不完整」。
`,
  },
];

export function getAllNotes(): Note[] {
  return [...notes].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
}

export function getNoteBySlug(slug: string): Note | undefined {
  return notes.find((n) => n.slug === slug);
}

export function getFeaturedNotes(limit = 3): Note[] {
  const sorted = getAllNotes().filter((n) => n.status !== undefined);
  const featured = sorted.filter((n) => n.featured);
  const rest = sorted.filter((n) => !n.featured);
  return [...featured, ...rest].slice(0, limit);
}

export function filterNotesByTag(tag: string | null | undefined): Note[] {
  const all = getAllNotes();
  if (!tag || tag === '全部') return all;
  return all.filter(
    (n) =>
      n.filters.includes(tag) ||
      n.tags.includes(tag) ||
      n.categoryLabel.includes(tag),
  );
}

export function getNoteFilterChips(): string[] {
  return ['全部', 'Agent', 'RAG', '工程', '阅读札记', '随笔'];
}
