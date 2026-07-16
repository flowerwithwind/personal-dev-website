import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getAllNotes } from '../data/notes';
import { siteConfig } from '../data/site';

export function GET(context: APIContext) {
  const notes = getAllNotes().filter((n) => n.status === 'published');
  // context.site already reflects astro.config site; base is applied by Astro for links when using relative
  const siteUrl = context.site?.toString().replace(/\/$/, '') ?? 'https://flowerwithwind.github.io';
  const base = import.meta.env.BASE_URL || '/';
  const prefix = base === '/' ? '' : base.replace(/\/$/, '');

  return rss({
    title: `${siteConfig.name} · 笔记`,
    description: siteConfig.description,
    site: `${siteUrl}${prefix}`,
    items: notes.map((note) => ({
      title: note.title,
      description: note.summary,
      pubDate: new Date(note.publishedAt),
      link: `${prefix}/notes/${note.slug}`,
    })),
  });
}
