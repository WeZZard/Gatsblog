import React from 'react'
const _ = require("lodash");

import Taxonomy from './Taxonomy'
import styles from "./TagsLabel.module.scss";

class TagsLabel extends React.Component {
    render() {
        const { tags } = this.props;
        const taxonomies = tags.map(tag => (
            {
                name: tag, slug: `/tag/${_.kebabCase(tag)}`
            }
        ));

        return <Taxonomy
            name="Tags"
            className={styles.tags}
            taxonomies={taxonomies}
        />;
    }
}

export default TagsLabel
