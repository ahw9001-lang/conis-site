import site from './data/site.json';
import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;
export type Category = (typeof site.categories)[number];

const fallback: Category = { name: '기타', slug: 'etc', color: '#8A93A6', icon: 'note' };

export function categoryOf(name: string): Category {
  return site.categories.find((c) => c.name === name) ?? { ...fallback, name };
}

export async function getPosts(): Promise<Post[]> {
  const all = await getCollection('posts', (p) => !p.data.draft);
  return all.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export function fmtDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}.${m}.${day}`;
}

export { site };
