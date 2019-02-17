import React from 'react'

import MDXRenderer from "gatsby-mdx/mdx-renderer";
import MDXContext from './MDXContext';
import Heading from './Heading'
import Table from './Table'
import TableHeader from './TableHeader'
import TableData from './TableData'
import Image from './Image'
import Picture from './Picture'
import Paragraph from './Paragraph'
import List from './List'
import Blockquote from './Blockquote'
import SegmentSeparator from './SegmentSeparator'
import Checkbox from './Checkbox'
import Strong from './Strong'
import Footnotes from './Footnotes'
import Superscript from './Superscript'
import CodeBlock from './CodeBlock'
import InlineCode from './InlineCode'
import MathBlock from './MathBlock'
import InlineMath from './InlineMath'
import Anchor from './Anchor'
import PreFormattedBlock from './PreFormattedBlock'

import {
    pToImage,
    pToPicture,
    preToMathBlock,
    preToCodeBlock,
} from '../utils'

export default ({textStyle, code}) => <MDXContext.Provider value={textStyle}>
    <MDXRenderer scope={scope} components={components} children={code.body}/>
</MDXContext.Provider>

const scope = {
    InlineMath,
    Math: MathBlock,
};

const components = {
    wrapper: React.Fragment,
    h1: props => <Heading level={1} {...props}/>,
    h2: props => <Heading level={2} {...props}/>,
    h3: props => <Heading level={3} {...props}/>,
    h4: props => <Heading level={4} {...props}/>,
    h5: props => <Heading level={5} {...props}/>,
    h6: props => <Heading level={6} {...props}/>,
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
    inlineCode: InlineCode,
    pre: props => {
        const codeBlock = preToCodeBlock(props);
        const mathBlock = preToMathBlock(props);
        // if there's a codeString and some props, we passed the test
        if (codeBlock) {
            return <CodeBlock {...codeBlock} />
        } else if (preToMathBlock) {
            return <MathBlock {...mathBlock}/>
        } else {
            return  <PreFormattedBlock {...props} />
        }
    },
    strong: Strong,
    hr: SegmentSeparator,
    ol: props => <List type={'orderedList'} {...props}/>,
    ul: props => <List type={'unorderedList'} {...props}/>,
    table: Table,
    th: TableHeader,
    td: TableData,
    blockquote: Blockquote,
    input: props => {
        if (props.type && props.type === 'checkbox') {
            return <Checkbox {...props}/>;
        }
        return <input {...props}/>;
    },
    div: props => {
        if (props.className === 'footnotes') {
            return <Footnotes {...props}/>
        }
        return <div {...props}/>
    },
    sup: Superscript,
    a: Anchor,
};