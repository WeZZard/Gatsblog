import sharpService from 'astro/assets/services/sharp';

function isImportedGif(src) {
  return Boolean(src && typeof src === 'object' && src.format === 'gif');
}

/**
 * Wraps Astro's Sharp image service so animated `.gif` sources pass through
 * untouched as `.gif` (matching legacy Gatsby `gatsby-remark-images` behavior)
 * instead of expanding multi-hundred-frame GIFs past Cloudflare Workers' 25 MiB
 * per-asset limit during WebP transcoding.
 */
export default {
  ...sharpService,
  validateOptions(options, imageConfig) {
    if (isImportedGif(options.src)) {
      options.format = 'gif';
    }
    return sharpService.validateOptions(options, imageConfig);
  },
  async transform(inputBuffer, transformOptions, config) {
    if (transformOptions.format === 'gif') {
      return {
        data: inputBuffer,
        format: 'gif',
      };
    }
    return sharpService.transform(inputBuffer, transformOptions, config);
  },
};
