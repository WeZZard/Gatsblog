import React from 'react'
import { MDXProvider } from '@mdx-js/tag'
import SourceCode from './src/components/SourceCode'
import HorizontalScroller from './src/components/HorizontalScroller'
import BlockquoteContainer from './src/components/BlockquoteContainer'
import AutoLinkHeader from "mdx-component-autolink-header";
import { preToCodeBlock } from 'mdx-utils'

// components is its own object outside of render so that the references to
// components are stable
const components = {
    /*
    h1: props => <AutoLinkHeader is="h1" {...props} />,
    h2: props => <AutoLinkHeader is="h2" {...props} />,
    h3: props => <AutoLinkHeader is="h3" {...props} />,
    h4: props => <AutoLinkHeader is="h4" {...props} />,
    h5: props => <AutoLinkHeader is="h5" {...props} />,
    h6: props => <AutoLinkHeader is="h6" {...props} />,
    */
    pre: props => {
        const codeBlock = preToCodeBlock(props);
        // if there's a codeString and some props, we passed the test
        if (codeBlock) {
            return <HorizontalScroller>
                <SourceCode {...codeBlock} />
            </HorizontalScroller>
        } else {
            // it's possible to have a pre without a code in it
            return  <HorizontalScroller>
                <pre {...props} />
            </HorizontalScroller>
        }
    },
    table: props => <HorizontalScroller>
        <table {...props}/>
    </HorizontalScroller>,
};

export default ({ element }) => (
    <MDXProvider components={components}>{element}</MDXProvider>
);
