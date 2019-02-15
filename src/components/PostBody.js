import React from 'react'
import Renderer from "./Renderer";
import styles from './PostBody.module.scss'

import TagsLabel from './TagsLabel'
import MetadataItem from './MetadataItem'
import License from './License';

class PostBody extends React.Component {
    render() {
        const { post, defaultLicense } = this.props;
        const {
            tags,
            file: {
                childMdx: {
                    code,
                },
            },
            license
        } = post;

        const tagsComponent = tags.length > 0
            ? <div  className={styles.tags}><MetadataItem><TagsLabel tags={tags}/></MetadataItem></div>
            : null;

        return <React.Fragment>
            <article className={styles.article}>
                <Renderer textStyle={'serif'}>{code.body}</Renderer>
            </article>
            {tagsComponent}
            <div className={styles.license}>
                <License license={license || defaultLicense} />
            </div>
        </React.Fragment>
    }
}

export default PostBody
