import React from 'react'
import styles from './MetadataItem.module.scss'
const _ = require("lodash");

class MetadataItem extends React.Component {
    render() {
        const {children} = this.props;

        return <div className={styles.metadataItem}>{children}</div>
    }
}

export default MetadataItem
