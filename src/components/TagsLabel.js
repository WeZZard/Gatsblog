import React from 'react'
const _ = require("lodash");

import Taxonomy from './Taxonomy'
import styles from "./TagsLabel.module.scss";

class TagsLabel extends React.Component {
    render() {
        const { tags } = this.props;

        return <Taxonomy name="Tags" className={styles.tags} taxonomies={tags}/>;
    }
}

export default TagsLabel
