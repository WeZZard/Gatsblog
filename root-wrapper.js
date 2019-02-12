import React from 'react'
import { MDXProvider } from '@mdx-js/tag'
import Heading from './src/components/Heading'
import Table from './src/components/Table'
import Image from './src/components/Image'
import Picture from './src/components/Picture'
import Paragraph from './src/components/Paragraph'
import OrderedList from './src/components/OrderedList'
import UnorderedList from './src/components/UnorderedList'
import Blockquote from './src/components/Blockquote'
import Separator from './src/components/Separator'
import Checkbox from './src/components/Checkbox'
import Strong from './src/components/Strong'
import Footnotes from './src/components/Footnotes'
import Superscript from './src/components/Superscript'
import CodeBlock from './src/components/CodeBlock'
import InlineCode from './src/components/InlineCode'
import { preToCodeBlock } from 'mdx-utils'

// components is its own object outside of render so that the references to
// components are stable
const components = {
    pre: props => {
        const codeBlock = preToCodeBlock(props);
        const mathBlock = preToMathBlock(props);
        // if there's a codeString and some props, we passed the test
        if (codeBlock) {
            return <CodeBlock {...codeBlock} />
        } else if (preToMathBlock) {
            return <MathBlock {...mathBlock}/>
        } else {
            // it's possible to have a pre without a code in it
            return  <pre className={'rectTop rectBottom'} {...props} />
        }
    },
    p: props => {
        const image = pToImage(props);
        if (image) {
            return <Image {...image}/>
        }
        const picture = pToPicture(props);
        if (picture) {
            return <Picture {...picture}/>
        }
        return <Paragraph {...props}/>
    },
    table: props => <Table {...props}/>,
    blockquote: props => <Blockquote {...props}/>,
    hr: props => <Separator {...props}/>,
    ol: props => <OrderedList {...props}/>,
    ul: props => <UnorderedList {...props}/>,
    h1: props => <Heading level={1} {...props}/>,
    h2: props => <Heading level={2} {...props}/>,
    h3: props => <Heading level={3} {...props}/>,
    h4: props => <Heading level={4} {...props}/>,
    h5: props => <Heading level={5} {...props}/>,
    h6: props => <Heading level={6} {...props}/>,
    input: props => {
        if (props.type && props.type === 'checkbox') {
            return <Checkbox {...props}/>;
        }
        return <input {...props}/>;
    },
    strong: props => <Strong {...props}/>,
    inlineCode: props => <InlineCode {...props}/>,
    div: props => {
        if (props.className === 'footnotes') {
            return <Footnotes {...props}/>
        }
        return <div {...props}/>
    },
    sup: props => <Superscript {...props}/>,
};

export default ({ element }) => (
    <MDXProvider components={components}>{element}</MDXProvider>
);

const pToImage = (pProps) => {
    if (
        pProps.children &&
        pProps.children.type &&
        pProps.children.type === 'img'
        )
    {
        return { ...pProps.children.props }
    }
};

const pToPicture = (pProps) => {
    if (
        pProps.children &&
        pProps.children.type &&
        pProps.children.type === 'picture'
        )
    {
        return {
            children: pProps.children.children,
            ...pProps.children.props
        }
    }
};

const preToMathBlock = (preProps) => {
    if (
        // children is MDXTag
        preProps.children &&
        // MDXTag props
        preProps.children.props &&
        // if MDXTag is going to render a <code>
        preProps.children.props.name === "Math"
    ) {
        // we have a <pre><Math> situation
        return preProps.children.props;
    }
};
