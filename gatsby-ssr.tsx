import React from 'react';
import type { GatsbySSR } from 'gatsby';
import CustomMDXProvider from './src/components/MDXProvider';

// Wrap the root element with our custom MDX provider for SSR
export const wrapRootElement: GatsbySSR['wrapRootElement'] = ({ element }) => {
  return <CustomMDXProvider>{element}</CustomMDXProvider>;
};