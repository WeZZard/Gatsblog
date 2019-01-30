import React from 'react'
import assert from 'assert'
import styles from './PostExcerptMetadata.module.scss'
const _ = require("lodash");

import PostMetadataItem from './PostMetadataItem'
import CategoryLabel from './CategoryLabel'
import TagsLabel from './TagsLabel'
import TimeLabel from './TimeLabel'

class PostExcerptMetadata extends React.Component {
    render() {
        const { post } = this.props;

        const createdTimeComponent = <TimeLabel dateTime={post.createdTime}/>;

        const categoryComponent = <CategoryLabel category={post.category}/>;

        const tags = post.tags;
        const tagsComponent = tags.length > 0 ? <TagsLabel tags={tags}/> : null;

        const lines = [[createdTimeComponent, categoryComponent], [tagsComponent]];

        const filteredLines = lines.filter((line) => {
            assert(Array.isArray(line));
            const filteredLine = line.filter(component => component);
            return filteredLine.length
        });

        return <div className={styles.postExcerptMetadata}>
            {filteredLines.map((line, lineNumber) => <div key={`${lineNumber}`} className={styles.postExcerptMetadataLine}>
                {line.map((component, componentNumber) => <PostMetadataItem key={`${componentNumber}`}>
                    {component}
                </PostMetadataItem>)}
            </div>)}
        </div>
    }
}

export default PostExcerptMetadata
