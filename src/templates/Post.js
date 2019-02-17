import React from "react"
import styles from './Post.module.scss'

import { graphql } from 'gatsby'

import Main from '../components/Main'
import MDXHeader from '../components/MDXHeader'
import MDXBody from "../components/MDXBody";
import PostFooter from '../components/PostFooter'
import MorePosts from '../components/MorePosts'

class Post extends React.Component {
    render() {
        const { data } = this.props;

        const {
            post,
            earlierPostExcerpt,
            laterPostExcerpt,
        } = data;

        const {
            title,
            subtitle,
            createdTime,
            category,
            tags,
            license,
            file: {
                childMdx: {
                    code,
                    tableOfContents,
                },
            },
        } = post;

        const article = <article>
            <header className={styles.header}>
                <MDXHeader
                    textStyle={'serif'}
                    title={title}
                    subtitle={subtitle}
                    createdTime={createdTime}
                    category={category}
                />
            </header>
            <main className={styles.main}>
                <MDXBody textStyle={'serif'} code={code}/>
            </main>
            <footer className={styles.footer}>
                <PostFooter tags={tags} license={license}/>
            </footer>
        </article>;

        const moreItems = (earlierPostExcerpt || laterPostExcerpt)
            ? <MorePosts
                earlierPostExcerpt={earlierPostExcerpt}
                laterPostExcerpt={laterPostExcerpt}
            />
            : null;

        return <Main
            title={post.title}
            tableOfContents={tableOfContents}
            sections={[article, moreItems]}
        />
    }
}

export default Post

export const pageQuery = graphql`
    query PostQuery($postId: String!, $earlierPostId: String, $laterPostId: String) {
        config: configYaml {
            site {
                lang
            }
        }
        post(id: {eq: $postId}) {
            title
            subtitle
            isPublished
            createdTime
            lastModifiedTime
            license
            tags
            category
            file {
                childMdx {
                    code {
                        body
                        scope
                    }
                    tableOfContents
                }
            }
        }
        earlierPostExcerpt: post(id: {eq: $earlierPostId}) {
            slug
            title
            subtitle
            createdTime
            tags
            category
            file {
                childMdx {
                    excerpt(pruneLength: 300)
                }
            }
        }
        laterPostExcerpt: post(id: {eq: $laterPostId}) {
            slug
            title
            subtitle
            createdTime
            tags
            category
            file {
                childMdx {
                    excerpt(pruneLength: 300)
                }
            }
        }
    }
`;
