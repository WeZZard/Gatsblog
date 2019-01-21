import React from 'react'
import assert from 'assert'
import styles from './PostExcerptMetadata.module.scss'
const _ = require("lodash");

import CategoryLabel from './CategoryLabel'
import TagsLabel from './TagsLabel'
import TimeLabel from './TimeLabel'

class PostExcerptMetadata extends React.Component {
    render() {
        const { post } = this.props;

        const birthTime = new Date(post.node.fields.birthTime);
        const birthTimeComponent = <TimeLabel dateTimeString={birthTime}/>;

        const category = post.node.fields.category;
        const categoryComponent = category !== "" ? (<CategoryLabel category={category}/>) : null;

        const tags = post.node.fields.tags;
        const tagsComponent = tags.length > 0 ? (<TagsLabel tags={tags}/>) : null;

        const lines = [[birthTimeComponent, categoryComponent], [tagsComponent]];

        lines.filter((line) => {
            assert(Array.isArray(line));
            const filteredLine = line.filter(component => component !== null );
            return filteredLine.length === 0
        });

        return <div className={styles.postExcerptMetadata}>
            {lines.map((line, lineNumber) => <div key={`${lineNumber}`} className={styles.postExcerptMetadataLine}>
                {line.map((component, componentNumber) => <div key={`${componentNumber}`} className={styles.postExcerptMetadataItem}>
                    {component}
                </div>)}
            </div>)}
        </div>
    }
}

export default PostExcerptMetadata
