import React from 'react'
import { MDXProvider } from '@mdx-js/tag'
import SourceCode from './src/components/SourceCode'
import HorizontalScroller from './src/components/HorizontalScroller'
import BlockquoteContainer from './src/components/BlockquoteContainer'
import AutoLinkHeader from "mdx-component-autolink-header";
import { preToCodeBlock } from 'mdx-utils'
import _ from "lodash"

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
            return <SourceCode {...codeBlock} />
        } else {
            // it's possible to have a pre without a code in it
            return  <pre {...props} />
        }
    },
    table: props => <HorizontalScroller>
        <table {...props}/>
    </HorizontalScroller>,
    h1: props => {
        const { children } = props;
        const name = `${_.kebabCase(children)}`;
        return <h1 id={name} {...props}/>
    },
    h2: props => {
        const { children } = props;
        const name = `${_.kebabCase(children)}`;
        return <h2 id={name} {...props}/>
    },
    h3: props => {
        const { children } = props;
        const name = `${_.kebabCase(children)}`;
        return <h3 id={name} {...props}/>
    },
    h4: props => {
        const { children } = props;
        const name = `${_.kebabCase(children)}`;
        return <h4 id={name} {...props}/>
    },
    h5: props => {
        const { children } = props;
        const name = `${_.kebabCase(children)}`;
        return <h5 id={name} {...props}/>
    },
    h6: props => {
        const { children } = props;
        const name = `${_.kebabCase(children)}`;
        return <h6 id={name} {...props}/>
    },
};

export default ({ element }) => (
    <MDXProvider components={components}>{element}</MDXProvider>
);
