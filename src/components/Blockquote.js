import React from 'react'
import SourceCode from './SourceCode'
import { preToCodeBlock } from 'mdx-utils'
import styles from './Blockquote.module.scss'

export default (props) => {
    const codeBlock = preToCodeBlock(props);
    // if there's a codeString and some props, we passed the test
    if (codeBlock) {
        return <SourceCode {...codeBlock} />
    } else {
        // it's possible to have a pre without a code in it
        return  <pre {...props} />
    }
}
