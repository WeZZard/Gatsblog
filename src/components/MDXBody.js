import React from 'react'
import styles from './MDXBody.module.scss'

import Renderer from "./Renderer";

class MDXBody extends React.Component {
    render() {
        const { mdx, textStyle } = this.props;
        const {
            childMdx: {
                code,
            },
        } = mdx;

        return <main className={styles.content}>
            <Renderer textStyle={textStyle}>{code.body}</Renderer>
        </main>
    }
}

export default MDXBody
