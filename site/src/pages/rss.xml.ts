import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getAllNotes } from '../data/notes';
import { siteConfig } from '../data/site';

export function GET(context: APIContext) {
  const notes = getAllNotes().filter((n) => n.status === 'published');
  return rss({
    title: `${siteConfig.name} · 笔记`,
    description: siteConfig.description,
    site: context.site ? `${context.site}/personal-dev-website` : 'https://flowerwithwind.github.io/personal-dev-website',
    items: notes.map((note) => ({
      title: note.title,
      description: note.summary,
      pubDate: new Date(note.publishedAt),
      link: `/personal-dev-website/notes/${note.slug}`,
    })),
  });
}
