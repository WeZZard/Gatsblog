import React from 'react'
import styles from './BlockquoteContainer.module.scss'

class BlockquoteContainer extends React.Component {
    render() {
        const props = this.props;

        return <div className={styles.blockquoteContainer} {...props}/>
    }
}

export default BlockquoteContainer
