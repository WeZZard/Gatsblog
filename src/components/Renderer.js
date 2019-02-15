const React = require("react");

import MDXRenderer from "gatsby-mdx/mdx-renderer";

import Heading from './Heading'
import Table from './Table'
import Image from './Image'
import Picture from './Picture'
import Paragraph from './Paragraph'
import OrderedList from './OrderedList'
import UnorderedList from './UnorderedList'
import Blockquote from './Blockquote'
import SegmentSeparator from './SegmentSeparator'
import Checkbox from './Checkbox'
import Strong from './Strong'
import Footnotes from './Footnotes'
import Superscript from './Superscript'
import CodeBlock from './CodeBlock'
import InlineCode from './InlineCode'
import InlineMath from './InlineMath'
import Math from './Math'
import {
    edgesWithGridSystem,
    pToImage,
    pToPicture,
    preToMathBlock,
    preToCodeBlock,
} from '../utils'

export default props => {
    const { children, scope, components, textStyle } = props;

    const defaultScope = {
        InlineMath,
        Math,
    };

    const defaultComponents = {
        wrapper: props => <React.Fragment {...props}/>,
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
            return <Paragraph {...props} textStyle={textStyle}/>
        },
        inlineCode: props => <InlineCode {...props}/>,
        pre: props => {
            const codeBlock = preToCodeBlock(props);
            const mathBlock = preToMathBlock(props);
            // if there's a codeString and some props, we passed the test
            if (codeBlock) {
                return <CodeBlock {...codeBlock} />
            } else if (preToMathBlock) {
                return <MathBlock {...mathBlock}/>
            } else {
                const className = edgesWithGridSystem({
                    top: 'rect',
                    bottom: 'rect',
                });
                // it's possible to have a pre without a code in it
                return  <pre className={className} {...props} />
            }
        },
        strong: props => <Strong {...props}/>,
        hr: props => <SegmentSeparator {...props}/>,
        ol: props => <OrderedList {...props}/>,
        ul: props => <UnorderedList {...props}/>,
        table: props => <Table {...props}/>,
        blockquote: props => <Blockquote {...props}/>,
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
        sup: props => <Superscript {...props}/>,
    };

    return <MDXRenderer
        scope={{...defaultScope, ...scope}}
        components={{...defaultComponents, ...components}}
    >
        {children}
    </MDXRenderer>
};