import React from 'react'
import styles from './PostMetadataItem.module.scss'
const _ = require("lodash");

class PostMetadataItem extends React.Component {
    render() {
        const {children} = this.props;

        return <div className={styles.postMetadataItem}>{children}</div>
    }
}

export default PostMetadataItem
