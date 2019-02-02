import React from 'react'
import { MDXProvider } from '@mdx-js/tag'
import SourceCode from './src/components/SourceCode'
import Heading from './src/components/Heading'
import Table from './src/components/Table'
import { preToCodeBlock } from 'mdx-utils'

// components is its own object outside of render so that the references to
// components are stable
const components = {
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
    table: props => <Table {...props}/>,
    h1: props => <Heading level={1} {...props}/>,
    h2: props => <Heading level={2} {...props}/>,
    h3: props => <Heading level={3} {...props}/>,
    h4: props => <Heading level={4} {...props}/>,
    h5: props => <Heading level={5} {...props}/>,
    h6: props => <Heading level={6} {...props}/>,
};

export default ({ element }) => (
    <MDXProvider components={components}>{element}</MDXProvider>
);

const pToMathBlock = (pProps) => {
    if (
        pProps.children &&
        Array.isArray(pProps.children)
    ) {
        const content = pProps.children.map(child => {
            if (child.props && child.props.children) {
                return child.props.children;
            } else {
                return `${child}`;
            }
        }).join('');

        console.log('content: ', content);

        if (content.startsWith('$$\n') && content.endsWith('\n$$')) {
            const mathFormula = content.substring(3, content.length - 3);
            return {
                children: mathFormula,
            }
        }
    }
};
