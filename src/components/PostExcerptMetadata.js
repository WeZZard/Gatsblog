import React from 'react'
import assert from 'assert'
import styles from './PostExcerptMetadata.module.scss'
const _ = require("lodash");

import Taxonomy from './Taxonomy'

class PostExcerptMetadata extends React.Component {
    render() {
        const { post } = this.props;

        const birthTime = new Date(post.node.fields.birthTime);
        const isoBirthTime = birthTime.toISOString();
        const localizedBirthTime = birthTime.toLocaleDateString("enUS", { year: 'numeric', month: 'short', day: 'numeric' });
        const birthTimeComponent = <time datetime={isoBirthTime}>{localizedBirthTime}</time>;

        const rawCategory = post.node.fields.category;
        const categorySlug = _.kebabCase(rawCategory);
        const rawTags = post.node.fields.tags;

        const categoryObjects = rawCategory !== "" ? {name: `${rawCategory}`, slug: `${categorySlug}`} : null;
        const tagsObjects = rawTags.map(tag => { return {name: tag, slug: `tags/${_.kebabCase(tag)}`} });

        const category = rawCategory !== "" ? (<Taxonomy name="Category" taxonomies={[categoryObjects]}/>) : null;

        const tags = rawTags.length > 0 ? (<Taxonomy name="Tags" taxonomies={tagsObjects}/>) : null;

        const lines = [[birthTimeComponent, category], [tags]];

        lines.filter((line) => {
            assert(Array.isArray(line));
            const filteredLine = line.filter(component => component !== null );
            return filteredLine.length === 0
        });

        return <div className={styles.postExcerptMetadata}>
            {lines.map((components) => <div className={styles.postExcerptMetadataLine}>
                {components.map((component) => <div className={styles.postExcerptMetadataItem}>
                    {component}
                </div>)}
            </div>)}
        </div>
    }
}

export default PostExcerptMetadata
