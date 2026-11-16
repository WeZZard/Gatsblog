import Prism from 'prismjs';
import loadLanguages from 'prismjs/components/index.js';

// Preload common languages used across Gatsblog posts
loadLanguages([
  'swift',
  'objectivec',
  'c',
  'cpp',
  'python',
  'rust',
  'go',
  'lua',
  'javascript',
  'jsx',
  'typescript',
  'tsx',
  'bash',
  'shell-session',
  'json',
  'yaml',
  'toml',
  'markdown',
  'graphql',
  'sql',
  'protobuf',
  'css',
  'scss',
  'diff',
  'latex',
  'ini',
  'makefile',
  'cmake',
  'llvm',
  'nasm',
]);

function toKebabCase(str) {
  return String(str || '')
    .replace(/['\u2019]/g, '')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/([a-zA-Z])([0-9])/g, '$1-$2')
    .replace(/([0-9])([a-zA-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .replace(/[^\p{L}\p{N}-]/gu, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
}

function getTextContent(node) {
  if (!node) return '';
  if (node.type === 'text') return node.value || '';
  if (Array.isArray(node.children)) {
    return node.children.map(getTextContent).join('');
  }
  return '';
}

function getLanguageName(language) {
  if (!language) return '';
  if (/^objectivec$/i.test(language)) return 'Objective-C';
  if (/^objectivecpp$/i.test(language)) return 'Objective-C++';
  if (/^cpp$/i.test(language)) return 'C++';
  return language;
}

function getLanguageBadgeKey(language) {
  if (!language) return 'default';
  if (/^objectivec$/i.test(language)) return 'objectiveC';
  if (/^objectivecpp$/i.test(language)) return 'objectiveCPP';
  if (/^cpp$/i.test(language)) return 'cPP';
  if (/^\/etc\/hosts$/.test(language)) return 'etcHosts';
  if (/^pseudo-code$/i.test(language)) return 'pseudoCode';
  if (/^js$/i.test(language) || /^javascript$/i.test(language)) return 'javaScript';
  if (/^ts$/i.test(language) || /^typescript$/i.test(language)) return 'typeScript';
  if (/^graphql$/i.test(language)) return 'graphQL';
  if (/^latex$/i.test(language)) return 'laTex';
  if (/^sass$/i.test(language)) return 'scss';
  return language.toLowerCase();
}

function parseMetaProps(metaStr) {
  const props = {};
  if (!metaStr) return props;
  const regex = /(\S+?)(?:=(?:"([^"]*)"|'([^']*)'|(\S+)))?(?=\s|$)/g;
  let m;
  while ((m = regex.exec(metaStr)) !== null) {
    if (!m[0]) break;
    const key = m[1];
    const val = m[2] ?? m[3] ?? m[4] ?? true;
    props[key] = val;
  }
  return props;
}

function resolvePrismGrammar(lang) {
  if (!lang) return null;
  const lower = lang.toLowerCase();
  const aliasMap = {
    sh: 'bash',
    shell: 'bash',
    zsh: 'bash',
    objectivecpp: 'objectivec',
    js: 'javascript',
    ts: 'typescript',
    mdx: 'jsx',
    asm: 'nasm',
    sil: 'swift',
  };
  const key = aliasMap[lower] || lower;
  return Prism.languages[key] || null;
}

function prismTokensToLines(tokens) {
  const lines = [[]];

  function pushPiece(text, types) {
    const parts = text.split('\n');
    for (let i = 0; i < parts.length; i++) {
      if (i > 0) lines.push([]);
      if (parts[i].length > 0 || parts.length === 1) {
        lines[lines.length - 1].push({ content: parts[i], types });
      }
    }
  }

  function walkToken(tok, inheritedTypes = []) {
    if (typeof tok === 'string') {
      pushPiece(tok, inheritedTypes);
      return;
    }
    const nextTypes = [...inheritedTypes, tok.type];
    if (tok.alias) {
      if (Array.isArray(tok.alias)) nextTypes.push(...tok.alias);
      else nextTypes.push(tok.alias);
    }
    if (typeof tok.content === 'string') {
      pushPiece(tok.content, nextTypes);
    } else if (Array.isArray(tok.content)) {
      for (const sub of tok.content) walkToken(sub, nextTypes);
    } else {
      walkToken(String(tok.content ?? ''), nextTypes);
    }
  }

  for (const t of tokens) walkToken(t, []);
  return lines;
}

function buildCodeBlockElement(preNode) {
  const codeNode = (preNode.children || []).find(
    c => c.type === 'element' && c.tagName === 'code',
  );
  if (!codeNode) return preNode;

  const rawCode = getTextContent(codeNode).replace(/\n$/, '');
  const classNames = codeNode.properties?.className || [];
  const classList = Array.isArray(classNames) ? classNames : String(classNames).split(/\s+/);
  const langFromClass = classList
    .find(c => String(c).startsWith('language-'))
    ?.slice('language-'.length);
  const language = codeNode.properties?.['data-lang'] || langFromClass || '';
  const metaStr = codeNode.properties?.['data-meta'] || '';
  const metaProps = parseMetaProps(metaStr);

  // Also check attributes directly on codeNode.properties (for MDX props like path="..." version="...")
  const pathProp = metaProps.path || codeNode.properties?.path;
  const versionProp = metaProps.version || codeNode.properties?.version;

  const grammar = resolvePrismGrammar(language);
  const rawTokens = grammar ? Prism.tokenize(rawCode, grammar) : [rawCode];
  const lines = prismTokensToLines(rawTokens);
  if (lines.length === 0) lines.push([{ content: '', types: [] }]);

  const children = [];

  if (pathProp && typeof pathProp === 'string') {
    children.push({
      type: 'element',
      tagName: 'div',
      properties: { className: ['mdx-code-path-label'] },
      children: [
        {
          type: 'element',
          tagName: 'span',
          properties: { className: ['mdx-code-path'] },
          children: [{ type: 'text', value: pathProp }],
        },
      ],
    });
  }

  if (language) {
    const labelStr = [getLanguageName(language), typeof versionProp === 'string' ? versionProp : null]
      .filter(Boolean)
      .join(' ');
    const badgeKey = getLanguageBadgeKey(language);
    children.push({
      type: 'element',
      tagName: 'div',
      properties: {
        className: ['mdx-code-lang-label'],
        'data-lang-badge': badgeKey,
      },
      children: [
        {
          type: 'element',
          tagName: 'span',
          properties: { className: ['mdx-code-lang'] },
          children: [{ type: 'text', value: labelStr }],
        },
      ],
    });
  }

  const lineNumbersChildren = lines.map(() => ({
    type: 'element',
    tagName: 'div',
    properties: { 'aria-hidden': 'true', className: ['mdx-line-number'] },
    children: [],
  }));

  const codeLinesChildren = lines.map(lineTokens => ({
    type: 'element',
    tagName: 'div',
    properties: { className: ['mdx-code-line'] },
    children:
      lineTokens.length > 0 && lineTokens.some(t => t.content !== '')
        ? lineTokens.map(tok => ({
            type: 'element',
            tagName: 'span',
            properties: {
              className: ['mdx-token', ...tok.types.map(tp => `tok-${tp}`)],
            },
            children: [{ type: 'text', value: tok.content }],
          }))
        : [{ type: 'text', value: '\n' }],
  }));

  children.push({
    type: 'element',
    tagName: 'code',
    properties: {
      className: [
        language ? 'mdx-code-specified' : 'mdx-code-unspecified',
      ],
    },
    children: [
      {
        type: 'element',
        tagName: 'div',
        properties: { 'aria-hidden': 'true', className: ['mdx-line-numbers'] },
        children: lineNumbersChildren,
      },
      {
        type: 'element',
        tagName: 'div',
        properties: { className: ['mdx-code-content'] },
        children: codeLinesChildren,
      },
    ],
  });

  return {
    type: 'element',
    tagName: 'pre',
    properties: { className: ['mdx-code-block'] },
    children,
  };
}

function isWhitespaceText(node) {
  return node.type === 'text' && !/\S/.test(node.value || '');
}

function extractStandaloneImage(pNode) {
  const nonEmpty = (pNode.children || []).filter(c => !isWhitespaceText(c));
  if (nonEmpty.length !== 1) return null;
  const only = nonEmpty[0];
  if (only.type === 'element' && only.tagName === 'img') {
    return { imgNode: only, linkHref: null };
  }
  if (only.type === 'element' && only.tagName === 'a') {
    const inner = (only.children || []).filter(c => !isWhitespaceText(c));
    if (inner.length === 1 && inner[0].type === 'element' && inner[0].tagName === 'img') {
      return { imgNode: inner[0], linkHref: only.properties?.href || null };
    }
  }
  return null;
}

function buildGeometryElement(imgNode, existingHref) {
  const props = imgNode.properties || {};
  const caption = props['data-caption'] || props.title || '';
  const presWidth = props['data-pres-width'];
  const isMultiScale = props['data-multi-scale'] === '1';

  const imgStyleParts = ['display: block', 'height: auto', 'max-width: 100%'];
  if (presWidth) {
    if (isMultiScale) {
      imgStyleParts.push(`width: ${presWidth}px`);
    } else {
      imgStyleParts.push(`width: ${presWidth}px`);
    }
  }

  const cleanedImg = {
    ...imgNode,
    properties: {
      ...props,
      loading: 'eager',
      decoding: 'sync',
      style: imgStyleParts.join('; '),
    },
  };

  const href = existingHref || props.src || null;
  const mediaChild = href
    ? {
        type: 'element',
        tagName: 'a',
        properties: { href, className: ['mdx-image-link'] },
        children: [cleanedImg],
      }
    : cleanedImg;

  const figureChildren = [mediaChild];
  if (caption) {
    figureChildren.push({
      type: 'element',
      tagName: 'figcaption',
      properties: { className: ['mdx-figcaption'] },
      children: [
        {
          type: 'element',
          tagName: 'span',
          properties: {},
          children: [{ type: 'text', value: String(caption) }],
        },
      ],
    });
  }

  return {
    type: 'element',
    tagName: 'div',
    properties: { className: ['mdx-geometry'] },
    children: [
      {
        type: 'element',
        tagName: 'figure',
        properties: { className: ['mdx-figure'] },
        children: figureChildren,
      },
    ],
  };
}

function hasClass(node, target) {
  const cls = node?.properties?.className;
  if (!cls) return false;
  const arr = Array.isArray(cls) ? cls : String(cls).split(/\s+/);
  return arr.includes(target);
}

function transformChildren(parent, inBlockquote = false) {
  if (!Array.isArray(parent.children)) return;

  const newChildren = [];

  for (const child of parent.children) {
    if (child.type !== 'element') {
      newChildren.push(child);
      continue;
    }

    const tag = child.tagName;

    // 1. Display Math block (<span class="katex-display"> or <p><span class="katex-display">)
    if (tag === 'span' && hasClass(child, 'katex-display')) {
      newChildren.push({
        type: 'element',
        tagName: 'div',
        properties: { className: ['mdx-math-block'] },
        children: [child],
      });
      continue;
    }

    if (tag === 'p') {
      const nonEmpty = (child.children || []).filter(c => !isWhitespaceText(c));
      if (
        nonEmpty.length === 1 &&
        nonEmpty[0].type === 'element' &&
        nonEmpty[0].tagName === 'span' &&
        hasClass(nonEmpty[0], 'katex-display')
      ) {
        newChildren.push({
          type: 'element',
          tagName: 'div',
          properties: { className: ['mdx-math-block'] },
          children: [nonEmpty[0]],
        });
        continue;
      }

      const standaloneImg = extractStandaloneImage(child);
      if (standaloneImg) {
        newChildren.push(buildGeometryElement(standaloneImg.imgNode, standaloneImg.linkHref));
        continue;
      }

      transformChildren(child, inBlockquote);
      newChildren.push({
        type: 'element',
        tagName: 'div',
        properties: { className: ['mdx-p-wrap'] },
        children: [
          {
            type: 'element',
            tagName: 'p',
            properties: { ...(child.properties || {}), className: ['mdx-p'] },
            children: child.children,
          },
        ],
      });
      continue;
    }

    // 2. Headings h1..h6
    if (/^h[1-6]$/.test(tag)) {
      // Skip sr-only footnote heading injected by remark-gfm if present
      if (hasClass(child, 'sr-only') || child.properties?.id === 'footnote-label') {
        continue;
      }
      const level = tag.slice(1);
      const text = getTextContent(child);
      const slug = toKebabCase(text);
      transformChildren(child, inBlockquote);
      const nextProps = { ...(child.properties || {}) };
      nextProps.id = `__heading_${slug}`;
      nextProps.className = ['mdx-h'];
      newChildren.push({
        type: 'element',
        tagName: tag,
        properties: nextProps,
        children: [
          {
            type: 'element',
            tagName: 'span',
            properties: { id: slug, className: [`mdx-h${level}`] },
            children: child.children,
          },
        ],
      });
      continue;
    }

    // 3. Fenced Code Blocks <pre>
    if (tag === 'pre') {
      newChildren.push(buildCodeBlockElement(child));
      continue;
    }

    // 4. Inline code
    if (tag === 'code') {
      newChildren.push({
        ...child,
        properties: {
          ...(child.properties || {}),
          className: ['mdx-inline-code'],
        },
      });
      continue;
    }

    // 5. Inline math (<span class="katex">)
    if (tag === 'span' && hasClass(child, 'katex')) {
      newChildren.push({
        type: 'element',
        tagName: 'span',
        properties: { className: ['mdx-inline-math'] },
        children: [child],
      });
      continue;
    }

    // 6. Lists ul / ol
    if (tag === 'ul' || tag === 'ol') {
      // Footnotes section uses <section data-footnotes> or <div class="footnotes">
      const isOrdered = tag === 'ol';
      const items = [];
      for (const li of child.children || []) {
        if (li.type !== 'element' || li.tagName !== 'li') continue;
        const isTask = hasClass(li, 'task-list-item');
        // Check if li contains bare inline content vs block elements
        const hasBlockChild = (li.children || []).some(
          c => c.type === 'element' && ['p', 'div', 'ul', 'ol', 'pre', 'blockquote', 'table'].includes(c.tagName),
        );
        let innerChildren = li.children || [];
        if (!hasBlockChild) {
          innerChildren = [
            {
              type: 'element',
              tagName: 'p',
              properties: {},
              children: innerChildren,
            },
          ];
        }
        const wrappedLi = {
          ...li,
          properties: {
            ...(li.properties || {}),
            className: [
              'mdx-list-item',
              isTask
                ? 'mdx-task-list-item'
                : isOrdered
                  ? 'mdx-ordered-list-item'
                  : 'mdx-unordered-list-item',
            ],
          },
          children: [
            {
              type: 'element',
              tagName: 'div',
              properties: { className: ['mdx-list-item-body'] },
              children: innerChildren,
            },
          ],
        };
        transformChildren(wrappedLi.children[0], inBlockquote);
        items.push(wrappedLi);
      }

      newChildren.push({
        type: 'element',
        tagName: tag,
        properties: {
          ...(child.properties || {}),
          className: ['mdx-list', isOrdered ? 'mdx-ordered-list' : 'mdx-unordered-list'],
        },
        children: items,
      });
      continue;
    }

    // 7. Blockquote
    if (tag === 'blockquote') {
      transformChildren(child, true);
      newChildren.push({
        ...child,
        properties: {
          ...(child.properties || {}),
          className: ['mdx-blockquote'],
        },
      });
      continue;
    }

    // 8. Table
    if (tag === 'table') {
      transformChildren(child, inBlockquote);
      newChildren.push({
        type: 'element',
        tagName: 'div',
        properties: {
          className: [inBlockquote ? 'mdx-table-blockquote-wrap' : 'mdx-table-wrap'],
        },
        children: [
          {
            ...child,
            properties: { ...(child.properties || {}), className: ['mdx-table'] },
          },
        ],
      });
      continue;
    }

    if (tag === 'th' || tag === 'td') {
      transformChildren(child, inBlockquote);
      const cellClass = tag === 'th' ? 'mdx-th' : 'mdx-td';
      newChildren.push({
        ...child,
        properties: { ...(child.properties || {}), className: [cellClass] },
        children: [
          {
            type: 'element',
            tagName: 'div',
            properties: { className: ['mdx-cell-segment'] },
            children: [
              {
                type: 'element',
                tagName: 'span',
                properties: { className: ['mdx-cell-p-wrap'] },
                children: [
                  {
                    type: 'element',
                    tagName: 'span',
                    properties: { className: ['mdx-cell-sans'] },
                    children: child.children || [],
                  },
                ],
              },
            ],
          },
        ],
      });
      continue;
    }

    // 9. Segment separator <hr>
    if (tag === 'hr') {
      newChildren.push({
        ...child,
        properties: {
          ...(child.properties || {}),
          className: ['mdx-separator', 'body-separator'],
        },
      });
      continue;
    }

    // 10. Footnotes (<section data-footnotes> or <div class="footnotes">)
    if (
      (tag === 'section' && child.properties?.dataFootnotes !== undefined) ||
      (tag === 'section' && child.properties?.['data-footnotes'] !== undefined) ||
      (tag === 'div' && hasClass(child, 'footnotes'))
    ) {
      // Transform footnotes into legacy Footnotes structure: <hr class="mdx-separator"> + <div class="mdx-footnotes"><ol>...</ol></div>
      const ol = (child.children || []).find(c => c.type === 'element' && c.tagName === 'ol');
      if (ol) {
        const fnItems = [];
        let idx = 1;
        for (const li of ol.children || []) {
          if (li.type !== 'element' || li.tagName !== 'li') continue;
          // Prepend <span class="mdx-fn-label">{idx}</span> inside first paragraph
          const firstP = (li.children || []).find(c => c.type === 'element' && c.tagName === 'p');
          if (firstP) {
            firstP.children = [
              {
                type: 'element',
                tagName: 'span',
                properties: { className: ['mdx-fn-label'] },
                children: [{ type: 'text', value: String(idx) }],
              },
              ...(firstP.children || []),
            ];
          }
          transformChildren(li, inBlockquote);
          fnItems.push({
            ...li,
            properties: {
              ...(li.properties || {}),
              className: ['mdx-footnote-item'],
            },
          });
          idx++;
        }
        newChildren.push({
          type: 'element',
          tagName: 'hr',
          properties: { className: ['mdx-separator', 'body-separator'] },
          children: [],
        });
        newChildren.push({
          type: 'element',
          tagName: 'div',
          properties: { className: ['mdx-footnotes'] },
          children: [
            {
              type: 'element',
              tagName: 'ol',
              properties: { className: ['mdx-footnote-list'] },
              children: fnItems,
            },
          ],
        });
        continue;
      }
    }

    // 11. Superscript <sup>
    if (tag === 'sup') {
      transformChildren(child, inBlockquote);
      newChildren.push({
        ...child,
        properties: { ...(child.properties || {}), className: ['mdx-sup'] },
      });
      continue;
    }

    // 12. Anchor <a>
    if (tag === 'a') {
      transformChildren(child, inBlockquote);
      const isBackRef =
        child.properties?.dataFootnoteBackref !== undefined ||
        child.properties?.['data-footnote-backref'] !== undefined ||
        hasClass(child, 'footnote-backref');
      newChildren.push({
        ...child,
        properties: {
          ...(child.properties || {}),
          className: isBackRef ? ['mdx-link', 'mdx-fn-backref'] : ['mdx-link'],
        },
        children: isBackRef ? [{ type: 'text', value: '^' }] : child.children,
      });
      continue;
    }

    transformChildren(child, inBlockquote);
    newChildren.push(child);
  }

  parent.children = newChildren;
}

export default function rehypeGatsblogMdx() {
  return tree => {
    transformChildren(tree, false);
  };
}
