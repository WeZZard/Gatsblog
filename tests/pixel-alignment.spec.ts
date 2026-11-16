import fs from 'node:fs';
import path from 'node:path';
import { test, expect, type Page } from '@playwright/test';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

const LIVE_ORIGIN = process.env.LIVE_ORIGIN || 'https://wezzard.com';
const LOCAL_ORIGIN = process.env.LOCAL_ORIGIN || 'http://localhost:4322';

// Thresholds for pixel alignment (percentage of total pixels, pixelmatch threshold = 0.1)
const MAX_VIEWPORT_MISMATCH_PCT = 1.0;
const MAX_BOTTOM_VIEWPORT_MISMATCH_PCT = 1.0;
const MAX_FULLPAGE_MISMATCH_PCT = 1.5;
const MAX_SCROLL_HEIGHT_DIFF_CSS_PX = 1;
const MAX_TOC_PANEL_MISMATCH_PCT = 0.1;
const MAX_ANCHOR_SCROLL_DIFF_CSS_PX = 1;

const ROUTES = [
  { name: 'home', path: '/' },
  { name: 'page-2', path: '/page-2' },
  { name: 'profile', path: '/profile' },
  { name: 'tag-ai', path: '/tag/ai' },
  { name: 'not-found-404', path: '/non-existent-404-check' },
  {
    name: 'post-hello-world',
    path: '/post/2019/02/hello-world-9cf1',
  },
  {
    name: 'post-design-notes',
    path: '/post/2019/03/notes-on-design-of-gatsblog-1431',
  },
  {
    name: 'post-j-space',
    path: '/post/2026/07/j-space-reveals-how-examples-shape-model-behavior-fa92',
  },
  {
    name: 'post-opus-subagent',
    path: '/post/2026/11/using-an-opus-5-5-subagent-with-opus-4-6-as-the-main-agent-a445',
  },
];

async function preparePage(page: Page, url: string) {
  await page.goto(url, { waitUntil: 'networkidle', timeout: 45_000 });
  await page.evaluate(() => document.fonts.ready);

  // Trigger lazy-loaded / gatsby-image intersection observers across full document height
  await page.evaluate(async () => {
    const step = Math.max(window.innerHeight, 400);
    const total = document.documentElement.scrollHeight;
    for (let y = 0; y <= total; y += step) {
      window.scrollTo(0, y);
      await new Promise(r => setTimeout(r, 80));
    }
    window.scrollTo(0, 0);
  });

  // Wait for images & blur-up transitions to settle
  await page.waitForTimeout(700);
  await page.evaluate(async () => {
    const imgs = Array.from(document.querySelectorAll('img'));
    for (const img of imgs) {
      if (img.loading === 'lazy') {
        img.loading = 'eager';
      }
    }
    await Promise.all(
      imgs.map(async img => {
        if (!img.complete || img.naturalWidth === 0) {
          await new Promise<void>(resolve => {
            img.addEventListener('load', () => resolve(), { once: true });
            img.addEventListener('error', () => resolve(), { once: true });
            setTimeout(resolve, 15000);
          });
        }
        if (typeof img.decode === 'function') {
          await img.decode().catch(() => {});
        }
      }),
    );
  });
}

async function captureFullPageBuffer(page: Page): Promise<Buffer> {
  const metrics = await page.evaluate(() => ({
    w: document.documentElement.clientWidth,
    h: document.documentElement.scrollHeight,
    vh: window.innerHeight,
    dpr: window.devicePixelRatio || 1,
  }));

  if (metrics.h * metrics.dpr <= 15000) {
    return page.screenshot({ fullPage: true });
  }

  // Stitch viewport-sized scroll slices when physical height exceeds Chromium's 16,384px Skia texture limit
  const outWidth = Math.round(metrics.w * metrics.dpr);
  const outHeight = Math.round(metrics.h * metrics.dpr);
  const stitched = new PNG({ width: outWidth, height: outHeight });

  let y = 0;
  let isFirst = true;
  while (y < metrics.h) {
    if (!isFirst) {
      await page.evaluate(() => {
        document
          .querySelectorAll<HTMLElement>(
            '[data-nav-pane], .app-background, [class*="Main-module--navigation"], [class*="Main-module--appBackground"]',
          )
          .forEach(el => {
            el.dataset.prevVis = el.style.visibility;
            el.style.visibility = 'hidden';
          });
      });
    }

    const actualY = await page.evaluate(targetY => {
      window.scrollTo(0, targetY);
      return window.scrollY;
    }, y);

    const buf = await page.screenshot({ fullPage: false });
    const part = PNG.sync.read(buf);

    const skipTopCss = y - actualY;
    const srcY = Math.max(0, Math.round(skipTopCss * metrics.dpr));
    const dstY = Math.round(y * metrics.dpr);
    const copyH = Math.min(part.height - srcY, outHeight - dstY);
    if (copyH > 0) {
      PNG.bitblt(part, stitched, 0, srcY, Math.min(part.width, outWidth), copyH, 0, dstY);
    }

    y += metrics.vh - skipTopCss;
    isFirst = false;
    if (metrics.vh - skipTopCss <= 0) break;
  }

  await page.evaluate(() => {
    document
      .querySelectorAll<HTMLElement>(
        '[data-nav-pane], .app-background, [class*="Main-module--navigation"], [class*="Main-module--appBackground"]',
      )
      .forEach(el => {
        el.style.visibility = el.dataset.prevVis || '';
        delete el.dataset.prevVis;
      });
    window.scrollTo(0, 0);
  });

  return PNG.sync.write(stitched);
}

function padPngToSize(src: PNG, width: number, height: number): PNG {
  if (src.width === width && src.height === height) return src;
  const out = new PNG({ width, height });
  // Fill padded area with bright magenta so height/width mismatches count as pixel diffs
  for (let i = 0; i < out.data.length; i += 4) {
    out.data[i] = 255;
    out.data[i + 1] = 0;
    out.data[i + 2] = 255;
    out.data[i + 3] = 255;
  }
  PNG.bitblt(src, out, 0, 0, Math.min(src.width, width), Math.min(src.height, height), 0, 0);
  return out;
}

function compareBuffers(
  liveBuf: Buffer,
  localBuf: Buffer,
  outDir: string,
  prefix: string,
): { mismatchPct: number; mismatchedPixels: number; totalPixels: number; liveHeight: number; localHeight: number } {
  const liveRaw = PNG.sync.read(liveBuf);
  const localRaw = PNG.sync.read(localBuf);

  const width = Math.max(liveRaw.width, localRaw.width);
  const height = Math.max(liveRaw.height, localRaw.height);

  const livePng = padPngToSize(liveRaw, width, height);
  const localPng = padPngToSize(localRaw, width, height);
  const diffPng = new PNG({ width, height });

  const mismatchedPixels = pixelmatch(
    livePng.data,
    localPng.data,
    diffPng.data,
    width,
    height,
    { threshold: 0.1 },
  );

  const totalPixels = width * height;
  const mismatchPct = (mismatchedPixels / totalPixels) * 100;

  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, `${prefix}-live.png`), liveBuf);
  fs.writeFileSync(path.join(outDir, `${prefix}-local.png`), localBuf);
  fs.writeFileSync(path.join(outDir, `${prefix}-diff.png`), PNG.sync.write(diffPng));

  return {
    mismatchPct,
    mismatchedPixels,
    totalPixels,
    liveHeight: liveRaw.height,
    localHeight: localRaw.height,
  };
}

async function captureLandmarks(page: Page) {
  return page.evaluate(() => {
    const selectors = [
      'html',
      'body',
      'nav, [class*="navigationBar"], [data-navigation-bar]',
      'h1',
      'h2',
      'main',
      'article',
      'p',
      'pre',
      'blockquote',
      'ul',
      'footer',
    ];
    const results: Record<string, unknown> = {
      scrollHeight: document.documentElement.scrollHeight,
      scrollWidth: document.documentElement.scrollWidth,
    };
    for (const sel of selectors) {
      const el = document.querySelector(sel);
      if (!el) continue;
      const r = el.getBoundingClientRect();
      const cs = window.getComputedStyle(el);
      results[sel] = {
        tag: el.tagName,
        text: (el.textContent || '').trim().slice(0, 50),
        rect: {
          x: Math.round(r.x * 100) / 100,
          y: Math.round(r.y * 100) / 100,
          w: Math.round(r.width * 100) / 100,
          h: Math.round(r.height * 100) / 100,
        },
        font: `${cs.fontWeight} ${cs.fontSize}/${cs.lineHeight} ${cs.fontFamily}`,
        color: cs.color,
        margin: `${cs.marginTop} ${cs.marginRight} ${cs.marginBottom} ${cs.marginLeft}`,
        padding: `${cs.paddingTop} ${cs.paddingRight} ${cs.paddingBottom} ${cs.paddingLeft}`,
      };
    }
    return results;
  });
}

async function capturePageArtifacts(page: Page) {
  await page.evaluate(() => window.scrollTo(0, 0));
  const vpBuf = await page.screenshot({ fullPage: false });
  const landmarks = await captureLandmarks(page);

  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await page.waitForTimeout(100);
  const bottomScrollY = await page.evaluate(() => window.scrollY);
  const bottomBuf = await page.screenshot({ fullPage: false });

  await page.evaluate(() => window.scrollTo(0, 0));
  const fullBuf = await captureFullPageBuffer(page);

  return { vpBuf, bottomBuf, fullBuf, landmarks, bottomScrollY };
}

for (const route of ROUTES) {
  test(`pixel alignment: ${route.name} (${route.path})`, async ({ browser }, testInfo) => {
    const context = await browser.newContext(testInfo.project.use);
    const [livePage, localPage] = await Promise.all([
      context.newPage(),
      context.newPage(),
    ]);

    await Promise.all([
      preparePage(livePage, `${LIVE_ORIGIN}${route.path}`),
      preparePage(localPage, `${LOCAL_ORIGIN}${route.path}`),
    ]);

    const [liveArt, localArt] = await Promise.all([
      capturePageArtifacts(livePage),
      capturePageArtifacts(localPage),
    ]);

    const outDir = path.resolve(
      process.cwd(),
      'test-results/pixel-diffs',
      testInfo.project.name,
      route.name,
    );

    const vpResult = compareBuffers(liveArt.vpBuf, localArt.vpBuf, outDir, 'viewport');
    const bottomResult = compareBuffers(liveArt.bottomBuf, localArt.bottomBuf, outDir, 'bottom');
    const fullResult = compareBuffers(liveArt.fullBuf, localArt.fullBuf, outDir, 'fullpage');

    const liveScrollHeight = Number(liveArt.landmarks.scrollHeight);
    const localScrollHeight = Number(localArt.landmarks.scrollHeight);
    const scrollHeightDiffCssPx = localScrollHeight - liveScrollHeight;

    fs.writeFileSync(
      path.join(outDir, 'landmarks.json'),
      JSON.stringify(
        {
          project: testInfo.project.name,
          route: route.path,
          viewportMismatchPct: Number(vpResult.mismatchPct.toFixed(3)),
          bottomViewportMismatchPct: Number(bottomResult.mismatchPct.toFixed(3)),
          fullPageMismatchPct: Number(fullResult.mismatchPct.toFixed(3)),
          liveScrollHeightCssPx: liveScrollHeight,
          localScrollHeightCssPx: localScrollHeight,
          scrollHeightDiffCssPx,
          liveBottomScrollYCssPx: liveArt.bottomScrollY,
          localBottomScrollYCssPx: localArt.bottomScrollY,
          liveFullHeightPx: fullResult.liveHeight,
          localFullHeightPx: fullResult.localHeight,
          liveLandmarks: liveArt.landmarks,
          localLandmarks: localArt.landmarks,
        },
        null,
        2,
      ),
    );

    await context.close();

    console.log(
      `[${testInfo.project.name}] ${route.name}: viewport=${vpResult.mismatchPct.toFixed(2)}% | bottom=${bottomResult.mismatchPct.toFixed(2)}% | fullpage=${fullResult.mismatchPct.toFixed(2)}% | scrollH=${liveScrollHeight}->${localScrollHeight}px (${scrollHeightDiffCssPx >= 0 ? '+' : ''}${scrollHeightDiffCssPx}px)`,
    );

    expect(
      vpResult.mismatchPct,
      `Viewport pixel mismatch ratio for ${route.path} on ${testInfo.project.name} was ${vpResult.mismatchPct.toFixed(2)}%`,
    ).toBeLessThanOrEqual(MAX_VIEWPORT_MISMATCH_PCT);

    expect(
      Math.abs(scrollHeightDiffCssPx),
      `Bottom scroll-height Y-offset delta for ${route.path} on ${testInfo.project.name} was ${scrollHeightDiffCssPx}px (live=${liveScrollHeight}px vs local=${localScrollHeight}px)`,
    ).toBeLessThanOrEqual(MAX_SCROLL_HEIGHT_DIFF_CSS_PX);

    expect(
      bottomResult.mismatchPct,
      `Bottom-scrolled viewport pixel mismatch ratio for ${route.path} on ${testInfo.project.name} was ${bottomResult.mismatchPct.toFixed(2)}%`,
    ).toBeLessThanOrEqual(MAX_BOTTOM_VIEWPORT_MISMATCH_PCT);

    expect(
      fullResult.mismatchPct,
      `Full-page pixel mismatch ratio for ${route.path} on ${testInfo.project.name} was ${fullResult.mismatchPct.toFixed(2)}% (liveH=${fullResult.liveHeight}px vs localH=${fullResult.localHeight}px)`,
    ).toBeLessThanOrEqual(MAX_FULLPAGE_MISMATCH_PCT);
  });
}

test('pixel alignment: mobile interactive drawers (nav & toc)', async ({ browser }, testInfo) => {
  test.skip(
    !['tablet-portrait', 'mobile-iphone'].includes(testInfo.project.name),
    'Mobile drawers only apply at <= 960px',
  );

  const postPath = '/post/2019/03/notes-on-design-of-gatsblog-1431';
  const context = await browser.newContext(testInfo.project.use);
  const [livePage, localPage] = await Promise.all([
    context.newPage(),
    context.newPage(),
  ]);

  await Promise.all([
    preparePage(livePage, `${LIVE_ORIGIN}${postPath}`),
    preparePage(localPage, `${LOCAL_ORIGIN}${postPath}`),
  ]);

  // 1. Open Mobile Nav Drawer on both
  await Promise.all([
    livePage.locator('[class*="NavButton"], [class*="navButton"]').first().click(),
    localPage.locator('[data-nav-toggle]').click(),
  ]);
  await Promise.all([livePage.waitForTimeout(800), localPage.waitForTimeout(800)]);

  const [liveNavVp, localNavVp] = await Promise.all([
    livePage.screenshot({ fullPage: false }),
    localPage.screenshot({ fullPage: false }),
  ]);

  const outDir = path.resolve(
    process.cwd(),
    'test-results/pixel-diffs',
    testInfo.project.name,
    'mobile-drawers',
  );
  const navResult = compareBuffers(liveNavVp, localNavVp, outDir, 'nav-open');

  // 2. Fresh pages: Open Mobile TOC Drawer on both
  const [liveTocPage, localTocPage] = await Promise.all([
    context.newPage(),
    context.newPage(),
  ]);
  await Promise.all([
    preparePage(liveTocPage, `${LIVE_ORIGIN}${postPath}`),
    preparePage(localTocPage, `${LOCAL_ORIGIN}${postPath}`),
  ]);

  await Promise.all([
    liveTocPage.locator('[class*="TocButton-module--button"], [class*="TocButton"] > div, [class*="tocButton"] > *').first().click(),
    localTocPage.locator('[data-toc-toggle]').click(),
  ]);
  await Promise.all([liveTocPage.waitForTimeout(800), localTocPage.waitForTimeout(800)]);

  const [liveTocVp, localTocVp] = await Promise.all([
    liveTocPage.screenshot({ fullPage: false }),
    localTocPage.screenshot({ fullPage: false }),
  ]);
  const tocResult = compareBuffers(liveTocVp, localTocVp, outDir, 'toc-open');

  await context.close();

  console.log(
    `[${testInfo.project.name}] mobile-drawers: nav-open=${navResult.mismatchPct.toFixed(2)}% | toc-open=${tocResult.mismatchPct.toFixed(2)}%`,
  );

  expect(navResult.mismatchPct).toBeLessThanOrEqual(MAX_VIEWPORT_MISMATCH_PCT);
  expect(tocResult.mismatchPct).toBeLessThanOrEqual(MAX_VIEWPORT_MISMATCH_PCT);
});

test('pixel alignment: table of contents layout and anchor scroll (/post/2026/07/j-space-reveals-how-examples-shape-model-behavior-fa92)', async ({ browser }, testInfo) => {
  const postPath = '/post/2026/07/j-space-reveals-how-examples-shape-model-behavior-fa92';
  const isMobileProject = ['tablet-portrait', 'mobile-iphone'].includes(testInfo.project.name);

  const context = await browser.newContext(testInfo.project.use);
  const [livePage, localPage] = await Promise.all([
    context.newPage(),
    context.newPage(),
  ]);

  await Promise.all([
    preparePage(livePage, `${LIVE_ORIGIN}${postPath}`),
    preparePage(localPage, `${LOCAL_ORIGIN}${postPath}`),
  ]);

  if (isMobileProject) {
    await Promise.all([
      livePage
        .locator('[class*="TocButton-module--button"], [class*="TocButton"] > div, [class*="tocButton"] > *')
        .first()
        .click(),
      localPage.locator('[data-toc-toggle]').click(),
    ]);
    await Promise.all([livePage.waitForTimeout(800), localPage.waitForTimeout(800)]);
  }

  const liveTocLoc = livePage.locator('[class*="TableOfContents-module--tableOfContents"]').first();
  const localTocLoc = localPage.locator('[data-toc]').first();

  const [liveTocBuf, localTocBuf] = await Promise.all([
    isMobileProject ? livePage.screenshot({ fullPage: false }) : liveTocLoc.screenshot(),
    isMobileProject ? localPage.screenshot({ fullPage: false }) : localTocLoc.screenshot(),
  ]);

  const outDir = path.resolve(
    process.cwd(),
    'test-results/pixel-diffs',
    testInfo.project.name,
    'toc-j-space',
  );
  const tocPanelResult = compareBuffers(liveTocBuf, localTocBuf, outDir, 'toc-panel');

  // Click TOC item #3 ("Looking Back") on both and compare resulting window.scrollY
  await Promise.all([
    liveTocLoc.locator('li a').nth(2).click(),
    localTocLoc.locator('li a').nth(2).click(),
  ]);
  await Promise.all([livePage.waitForTimeout(300), localPage.waitForTimeout(300)]);

  const [liveScrollY, localScrollY] = await Promise.all([
    livePage.evaluate(() => Math.round(window.scrollY)),
    localPage.evaluate(() => Math.round(window.scrollY)),
  ]);
  const anchorScrollDiffCssPx = localScrollY - liveScrollY;

  await context.close();

  console.log(
    `[${testInfo.project.name}] toc-j-space: panelMismatch=${tocPanelResult.mismatchPct.toFixed(3)}% | anchorScrollY=${liveScrollY}->${localScrollY}px (${anchorScrollDiffCssPx >= 0 ? '+' : ''}${anchorScrollDiffCssPx}px)`,
  );

  expect(
    tocPanelResult.mismatchPct,
    `Table of Contents panel pixel mismatch ratio on ${testInfo.project.name} was ${tocPanelResult.mismatchPct.toFixed(3)}%`,
  ).toBeLessThanOrEqual(MAX_TOC_PANEL_MISMATCH_PCT);

  expect(
    Math.abs(anchorScrollDiffCssPx),
    `Anchor scroll Y-offset delta after clicking TOC link on ${testInfo.project.name} was ${anchorScrollDiffCssPx}px (live=${liveScrollY}px vs local=${localScrollY}px)`,
  ).toBeLessThanOrEqual(MAX_ANCHOR_SCROLL_DIFF_CSS_PX);
});
