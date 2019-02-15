import React from 'react'
import styles from './PostFooter.module.scss'

import MetadataItem from './MetadataItem';
import TagsLabel from './TagsLabel'
import License from './License';

class PostFooter extends React.Component {
    render() {
        const {
            tags,
            license,
        } = this.props;

        const tagsComponent = tags.length > 0
            ? <div className={styles.tags}>
                <MetadataItem><TagsLabel tags={tags}/></MetadataItem>
            </div>
            : null;

        return <React.Fragment>
            {tagsComponent}
            <div className={styles.license}>
                <License license={license}/>
            </div>
        </React.Fragment>
    }
}

export default PostFooter
