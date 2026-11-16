import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

function collectNodes(node, out = []) {
  out.push(node);
  if (Array.isArray(node.children)) {
    for (const child of node.children) {
      collectNodes(child, out);
    }
  }
  return out;
}

async function resolveImageInfo(baseDir, relUrl) {
  const cleanUrl = relUrl.replace(/^\.\//, '');
  const ext = path.extname(cleanUrl);
  const stem = ext ? cleanUrl.slice(0, -ext.length) : cleanUrl;

  const searchDirs = [baseDir, path.dirname(baseDir)];

  for (const dir of searchDirs) {
    const p1x = path.resolve(dir, cleanUrl);
    const p2x = ext ? path.resolve(dir, `${stem}@2x${ext}`) : null;
    const p3x = ext ? path.resolve(dir, `${stem}@3x${ext}`) : null;

    const has1x = fs.existsSync(p1x);
    const has2x = p2x ? fs.existsSync(p2x) : false;
    const has3x = p3x ? fs.existsSync(p3x) : false;

    if (!has1x && !has2x && !has3x) continue;

    // Choose highest-DPI source file so Retina displays get crisp assets,
    // while preserving 1x presentation width when a multi-scale set exists.
    const bestPath = has3x ? p3x : has2x ? p2x : p1x;
    const rel = path.relative(baseDir, bestPath).split(path.sep).join('/');
    const resolvedUrl = rel.startsWith('.') ? rel : `./${rel}`;

    let presWidth = 712;
    try {
      if (has1x) {
        const meta1x = await sharp(p1x, { limitInputPixels: false }).metadata();
        if (meta1x.width) {
          presWidth = Math.min(meta1x.width, 712);
        }
      } else {
        // Single @2x/@3x asset without 1x: Gatsby treated single-scale assets as fluid (maxWidth: 712)
        const metaBest = await sharp(bestPath, { limitInputPixels: false }).metadata();
        if (metaBest.width) {
          presWidth = Math.min(metaBest.width, 712);
        }
      }
    } catch {
      // SVG or unsupported metadata falls back to maxWidth 712
    }

    return { resolvedUrl, presWidth, isMultiScale: (has1x && (has2x || has3x)) || (has2x && has3x) };
  }

  return null;
}

export default function remarkResolveImages() {
  return async (tree, file) => {
    const filePath = file.history?.[0];
    const baseDir = filePath ? path.dirname(filePath) : null;
    const nodes = collectNodes(tree);

    for (const node of nodes) {
      // Preserve code fence meta (e.g. path=... version=... react-live) for Rehype
      if (node.type === 'code') {
        node.data = node.data || {};
        node.data.hProperties = {
          ...(node.data.hProperties || {}),
          ...(node.meta ? { 'data-meta': node.meta } : {}),
          ...(node.lang ? { 'data-lang': node.lang } : {}),
        };
      }

      if (baseDir && node.type === 'image' && typeof node.url === 'string') {
        const url = node.url.trim();
        if (
          !url ||
          url.startsWith('http://') ||
          url.startsWith('https://') ||
          url.startsWith('/') ||
          url.startsWith('#') ||
          url.startsWith('data:')
        ) {
          continue;
        }
        const info = await resolveImageInfo(baseDir, url);
        if (info) {
          node.url = info.resolvedUrl;
          node.data = node.data || {};
          node.data.hProperties = {
            ...(node.data.hProperties || {}),
            'data-pres-width': String(info.presWidth),
            'data-multi-scale': info.isMultiScale ? '1' : '0',
            ...(node.title ? { 'data-caption': node.title } : {}),
          };
        }
      }
    }
  };
}
