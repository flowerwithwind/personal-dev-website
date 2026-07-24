import { DEFAULT_ADMIN_PASSWORD_SHA256 } from '../lib/auth';

export const siteConfig = {
  name: '赵海蓺',
  nameEn: 'Zhao Haiyi',
  title: '赵海蓺 · 个人网站',
  description:
    '个人数字主页：笔记、开源项目与构建记录。关注 AI Agent、RAG 与全栈工程实践。',
  email: 'hello@example.com',
  github: 'https://github.com',
  tagline: '写一点笔记，做一些能跑起来的东西',
  locale: 'zh-CN',
  /** Resume file under public/ */
  resumePath: '/resume.pdf',
  /**
   * SHA-256 hex for the local demo editor password.
   * This value is public in a static build and is not server authentication.
   */
  adminPasswordSha256: DEFAULT_ADMIN_PASSWORD_SHA256,
};

export type NowItem = {
  kind: 'build' | 'write' | 'learn' | 'life';
  text: string;
};

export const nowItems: NowItem[] = [
  { kind: 'build', text: '完善 Code Review Agent 的规范检索' },
  { kind: 'write', text: '笔记：如何评价 Agent 工具调用' },
  { kind: 'learn', text: '多 Agent 协作中的状态管理' },
  { kind: 'life', text: '把私有知识库逐步公开一部分' },
];

export const nowLabels: Record<NowItem['kind'], string> = {
  build: 'Build',
  write: 'Write',
  learn: 'Learn',
  life: 'Life',
};
