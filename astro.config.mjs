import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkResolveImages from './src/lib/remark-resolve-images.mjs';
import rehypeGatsblogMdx from './src/lib/rehype-gatsblog-mdx.mjs';

export default defineConfig({
  site: 'https://wezzard.com',
  output: 'static',
  server: {
    host: true,
  },
  devToolbar: {
    enabled: false,
  },
  integrations: [
    mdx({
      remarkPlugins: [remarkResolveImages, remarkMath],
      rehypePlugins: [rehypeKatex, rehypeGatsblogMdx],
      syntaxHighlight: false,
      smartypants: false,
    }),
    react(),
    sitemap({
      filter: page => !page.includes('/tag/'),
    }),
  ],
  markdown: {
    remarkPlugins: [remarkResolveImages, remarkMath],
    rehypePlugins: [rehypeKatex, rehypeGatsblogMdx],
    syntaxHighlight: false,
    smartypants: false,
  },
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
      config: {
        limitInputPixels: false,
      },
    },
  },
});
