import React from 'react'
const _ = require("lodash");

import Taxonomy from './Taxonomy'
import styles from "./TagsLabel.module.scss";

class TagsLabel extends React.Component {
    render() {
        const { tags } = this.props;

        const tagsObjects = tags.map(tag => { return {name: tag, slug: `tags/${_.kebabCase(tag)}`} });

        return <Taxonomy name="Tags" className={styles.tags} taxonomies={tagsObjects}/>;
    }
}

export default TagsLabel
