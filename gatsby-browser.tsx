import React from 'react';
import type { GatsbyBrowser } from 'gatsby';
import CustomMDXProvider from './src/components/MDXProvider';

// Wrap the root element with our custom MDX provider
export const wrapRootElement: GatsbyBrowser['wrapRootElement'] = ({ element }) => {
  return <CustomMDXProvider>{element}</CustomMDXProvider>;
};