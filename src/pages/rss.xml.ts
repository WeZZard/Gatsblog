import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getSiteConfig } from '../lib/config';
import { getAllPosts } from '../lib/content';

export async function GET(context: APIContext) {
  const { site } = getSiteConfig();
  const posts = (await getAllPosts()).filter(p => !p.isLocalized);

  return rss({
    title: site.title,
    description: site.description || site.title,
    site: context.site ?? site.url,
    items: posts.map(post => ({
      title: post.title,
      pubDate: post.createdTime,
      description: post.excerpt,
      link: post.fullPath,
    })),
    customData: `<copyright>${site.owner}</copyright><language>${site.lang}</language>`,
  });
}
