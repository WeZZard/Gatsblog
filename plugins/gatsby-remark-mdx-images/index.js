const visitWithParents = require(`unist-util-visit-parents`);
const getDefinitions = require(`mdast-util-definitions`);
const path = require(`path`);
const { fluid, resize, getImageSize } = require(`gatsby-plugin-sharp`);
const Promise = require(`bluebird`);
const slash = require(`slash`);

module.exports = function(args, pluginOptions) {
  const {
    files,
    markdownNode,
    markdownAST,
    pathPrefix,
    getNode,
    reporter,
    cache,
  } = args;

  const defaults = {
    maxWidth: 650,
    linksImagesToOriginal: true,
    pathPrefix,
    withWebp: false,
    tracedSVG: false,
    quality: 100,
    media: {
      portrait: '(orientation: portrait)',
      landscape: '(orientation: landscape)',
    },
    showsCaptions: true,
  };

  const options = {
    ...defaults,
    ...pluginOptions,
  };

  // Filter out markdown image nodes

  const findParentLinks = ({ children }) =>
    children.some(
      node =>
        (node.type === `html` && !!node.value.match(/<a /)) ||
        node.type === `link`,
    );

  // Get all the available definitions in the markdown tree
  const definitions = getDefinitions(markdownAST);

  let markdownImageNodes = [];

  visitWithParents(
    markdownAST,
    [`image`, `imageReference`],
    (node, ancestors) => {
      const inLink = ancestors.some(findParentLinks);

      markdownImageNodes.push({ node, inLink });
    },
  );

  // Grab URL and create image bundles

  // Create sources for media

  // Create image tags

  // Replace Markdown AST node contents

  return Promise.all(
    // Simple because there is no nesting in markdown
    markdownImageNodes.map(
      ({ node, inLink }) =>
        new Promise(async resolve => {
          const imgInfo = {
            title: node.title,
            alt: node.alt,
          };
          let refNode;
          if (
            !node.hasOwnProperty(`url`) &&
            node.hasOwnProperty(`identifier`)
          ) {
            //consider as imageReference node
            refNode = node;
            node = definitions(refNode.identifier);
            // pass original alt from referencing node
            imgInfo.alt = refNode.alt;
            if (!node) {
              // no definition found for image reference,
              // so there's nothing for us to do.
              return resolve();
            }
          }

          const rawHTML = await createHtmlImageContents({
            node,
            getNode,
            markdownNode,
            files,
            resolve,
            inLink,
            options,
            defaults,
            pluginOptions,
            imgInfo,
            reporter,
            cache,
          });

          if (rawHTML) {
            // Replace the image or ref node with an inline HTML node.
            if (refNode) {
              node = refNode;
            }
            node.type = `html`;
            node.value = rawHTML.trim();
          }

          return resolve(node);
        }),
    ),
  );
};

const createHtmlImageContents = async ({
  node,
  getNode,
  markdownNode,
  files,
  resolve,
  inLink,
  options,
  pluginOptions,
  defaults,
  imgInfo,
  reporter,
  cache,
}) => {
  const imagePathSets = createPathSetsForImageAtUri(node.url);

  const context = {
    getNode,
    markdownNode,
    files,
    resolve,
    inLink,
    options,
    pluginOptions,
    defaults,
    reporter,
    cache,
  };

  const { showsCaptions, linksImagesToOriginal } = options;

  const sourceSets = await createSourceSets(imagePathSets, context);

  if (sourceSets) {
    const { originalImg, tag } = createTag(sourceSets, imgInfo);
    const { title } = imgInfo;

    let processedTag = tag;

    if (linksImagesToOriginal) {
      processedTag = `<a href="${originalImg}">${processedTag}</a>`.trim();
    }

    if (showsCaptions) {
      processedTag = `
<figure>
    ${processedTag}
    <figcaption>
        <span>
            ${title}
        </span>
    </figcaption>
</figure>
`.trim();
    }

    return processedTag;
  } else {
    return undefined;
  }
};

const createTag = (sourceSets, imgInfo) => {
  const tagPrototypes = createSources(sourceSets)
    .map(s => s.makeTagPrototypes())
    .reduce((prototypes, current) => [...prototypes, ...current], []);

  if (tagPrototypes.length > 1) {
    return createPictureTag(tagPrototypes, imgInfo);
  } else if (tagPrototypes.length === 1) {
    return createImgTag(tagPrototypes[0], imgInfo);
  } else {
    throw `Invalid tag prototypes: "${tagPrototypes}"`;
  }
};

const createPictureTag = (tagPrototypes, imgInfo) => {
  const tags = tagPrototypes.map(p => {
    const { media, prototype } = p;
    return _createSourceTag(media, prototype, imgInfo);
  });

  const originalImages = tagPrototypes.map(({ originalImg }) => originalImg);

  const originalImg = originalImages.sort((a, b) => a.weight > b.weight)[0].src;

  const { alt, title } = imgInfo;

  return {
    originalImg,
    tag: `
<picture>
  ${tags.join('\n')}
  <img 
    src="${originalImg}"
    alt="${alt}"
    title="${title}"
  />
</picture>
`.trim(),
  };
};

const createImgTag = (tagPrototype, imgInfo) => {
  const { prototype } = tagPrototype;
  const { alt, title } = imgInfo;
  return {
    originalImg: prototype.src,
    tag: `
<img
  title="${title}"
  alt="${alt}"
  ${prototype.src ? `src="${prototype.src}"` : ''}
  ${prototype.srcSet ? `srcset="${prototype.srcSet}"` : ''}
  ${prototype.sizes ? `sizes="${prototype.sizes}"` : ''}
/>
`.trim(),
  };
};

const _createSourceTag = (mediaType, prototype, imgInfo) => {
  const { media } = imgInfo;
  switch (mediaType) {
    case 'default':
      return `
<source
  ${prototype.type ? `type="${prototype.type}"` : ''}
  ${prototype.src ? `src="${prototype.src}"` : ''}
  ${prototype.srcSet ? `srcset="${prototype.srcSet}"` : ''}
  ${prototype.sizes ? `sizes="${prototype.sizes}"` : ''}
/>`.trim();
    case 'landscape':
    case 'portrait':
      return `
<source
  media="${media[mediaType]}"
  ${prototype.type ? `type="${prototype.type}"` : ''}
  ${prototype.src ? `src="${prototype.src}"` : ''}
  ${prototype.srcSet ? `srcset="${prototype.srcSet}"` : ''}
  ${prototype.sizes ? `sizes="${prototype.sizes}"` : ''}
/>`.trim();
    default:
      throw `Invalid media: ${media}`;
  }
};

const createSources = ({ default: _default, portrait, landscape }) => {
  const sources = [];
  if (_default) {
    sources.push(new Source('default', _default));
  }
  if (portrait) {
    sources.push(new Source('portrait', portrait));
  }
  if (landscape) {
    sources.push(new Source('landscape', landscape));
  }
  return sources;
};

class Source {
  constructor(media, source) {
    this.media = media;
    this.source = source;
  }

  static getOriginalImgWeight(media) {
    switch (media) {
      case 'default':
        return 0;
      case 'portrait':
        return 10;
      case 'landscape':
        return 20;
      default:
        throw `Invalid media: ${media}`;
    }
  }

  makeTagPrototypes() {
    const media = this.media;
    const source = this.source;
    const originalImgWeight = Source.getOriginalImgWeight(media);
    switch (source.type) {
      case 'fluid':
        return [
          source.fluidResult
            ? {
                media,
                prototype: source.fluidResult,
                originalImg: {
                  src: source.fluidResult.originalImg,
                  weight: originalImgWeight,
                },
              }
            : null,
          source.webpFluidResult
            ? {
                media,
                prototype: source.webpFluidResult,
                originalImg: {
                  src: source.webpFluidResult.originalImg,
                  weight: originalImgWeight - 1,
                },
              }
            : null,
        ].filter(_ => _);
      case 'fixed':
        return [
          {
            media,
            prototype: {
              src: source.at1x.src,
              srcSet: `
              ${source.at1x.src} 1x,
              ${source.at2x.src} 2x,
              ${source.at3x.src} 3x
              `,
            },
            originalImg: {
              src: source.at3x.src,
              weight: originalImgWeight,
            },
          },
        ];
      default:
        throw `Unexpected type: ${source.type}`;
    }
  }
}

const createPathSetsForImageAtUri = uri => {
  const extension = path.extname(uri);
  const baseUrl = uri.slice(0, uri.length - extension.length);
  return {
    default: {
      at1x: baseUrl + extension,
      at2x: baseUrl + '@2x' + extension,
      at3x: baseUrl + '@3x' + extension,
    },
    portrait: {
      at1x: baseUrl + '~portrait' + extension,
      at2x: baseUrl + '~portrait' + '@2x' + extension,
      at3x: baseUrl + '~portrait' + '@3x' + extension,
    },
    landscape: {
      at1x: baseUrl + '~landscape' + extension,
      at2x: baseUrl + '~landscape' + '@2x' + extension,
      at3x: baseUrl + '~landscape' + '@3x' + extension,
    },
  };
};

const createSourceSets = async (pathSets, context) => {
  const _default = await getSourceSetForPathSet(pathSets.default, context);
  const portrait = await getSourceSetForPathSet(pathSets.portrait, context);
  const landscape = await getSourceSetForPathSet(pathSets.landscape, context);
  const sourceSets = {};

  if (_default) {
    sourceSets.default = _default;
  }

  if (portrait) {
    sourceSets.portrait = portrait;
  }

  if (landscape) {
    sourceSets.landscape = landscape;
  }

  if (Object.keys(sourceSets).length > 0) {
    return sourceSets;
  } else {
    return undefined;
  }
};

const getSourceSetForPathSet = async (bundlePathSet, context) => {
  const fileSet = {};

  for (const [scale, path] of Object.entries(bundlePathSet)) {
    const file = getFileForUri(path, context);
    if (file) {
      fileSet[scale] = file;
    }
  }

  if (Object.keys(fileSet).length > 0) {
    return await createResponsivenessEnsuredSourceSet(fileSet, context);
  } else {
    return undefined;
  }
};

const getFallbackInFileSet = (fileSet, scale) => {
  let offset = 1;

  while (scale + offset <= 3) {
    const file = fileSet[`at${scale + offset}x`];
    if (file) {
      return {
        scale: scale + offset,
        file,
      };
    }

    offset += 1;
  }

  offset = -1;

  while (fileSet[`at${scale + offset}x`] && scale + offset >= 1) {
    const file = fileSet[`at${scale + offset}x`];
    if (file) {
      return {
        scale: scale + offset,
        file,
      };
    }

    offset -= 1;
  }

  return undefined;
};

const createResponsivenessEnsuredSourceSet = async (fileSet, context) => {
  const { reporter, cache, options } = context;
  const { quality } = options;
  const scales = Object.keys(fileSet);
  if (scales.length > 1 || (scales.length === 1 && !!scales.at1x)) {
    const responsiveFileSet = {};

    for (let scale = 1; scale <= 3; scale++) {
      let scaleKey = `at${scale}x`;

      if (fileSet[scaleKey]) {
        const file = fileSet[scaleKey];

        const size = getImageSize(file);
        const { width, height } = size;

        responsiveFileSet[scaleKey] = await resize({
          file,
          args: { width, height, quality },
          reporter,
          cache,
        });
      } else {
        const fallback = getFallbackInFileSet(fileSet, scale);
        if (!fallback) {
          throw `No fallback found for file set: ${fileSet}`;
        }

        const { fallbackFile, fallbackScale } = fallback;
        const fallbackSize = getImageSize(fallbackFile);
        const { width, height } = fallbackSize;
        const scaledWidth = Math.ceil((width / scale) * fallbackScale);
        const scaledHeight = Math.ceil((height / scale) * fallbackScale);

        responsiveFileSet[scaleKey] = await resize({
          fallbackFile,
          args: { scaledWidth, scaledHeight, quality },
          reporter,
          cache,
        });
      }
    }

    responsiveFileSet.type = 'fixed';

    return responsiveFileSet;
  } else if (scales.length === 1) {
    const scaleKey = scales[0];
    const imageFileNode = fileSet[scaleKey];

    const fluidResults = await getFluidResultsForImage({
      imageFileNode,
      context,
    });

    return { type: 'fluid', ...fluidResults };
  } else {
    throw `Unexpected file set: ${fileSet}.`;
  }
};

const getFileForUri = (uri, context) => {
  const { getNode, markdownNode, files } = context;
  const parentNode = getNode(markdownNode.parent);
  let imagePath;
  if (parentNode && parentNode.dir) {
    imagePath = slash(path.join(parentNode.dir, uri));
  } else {
    throw `Only local images are allowed in markdown documents.`;
  }

  const imageFileNode = files
    .filter(file => {
      if (file && file.absolutePath) {
        return file.absolutePath === imagePath;
      }
      return null;
    })
    .pop();

  if (imageFileNode) {
    return imageFileNode;
  }

  return undefined;
};

const getFluidResultsForImage = async ({ imageFileNode, context }) => {
  const { options, reporter, cache, defaults, pluginOptions } = context;
  let fluidResult = await fluid({
    file: imageFileNode,
    args: {
      ...defaults,
      ...pluginOptions,
    },
    reporter,
    cache,
  });

  if (!fluidResult) {
    return undefined;
  }

  if (options.withWebp) {
    const webpFluidResult = await fluid({
      file: imageFileNode,
      args: {
        ...defaults,
        ...pluginOptions,
        ...(options.withWebp === true ? {} : options.withWebp),
        toFormat: `WEBP`,
      },
      reporter,
    });

    if (webpFluidResult) {
      return {
        fluidResult,
        webpFluidResult,
      };
    } else {
      return {
        fluidResult,
        webpFluidResult: undefined,
      };
    }
  } else {
    return { fluidResult };
  }
};
