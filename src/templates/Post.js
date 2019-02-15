import React from "react"
import { graphql } from 'gatsby'
import Main from '../components/Main'
import PostBody from '../components/PostBody'
import PostHeader from '../components/PostHeader'
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
            file: {
                childMdx: {
                    tableOfContents,
                },
            },
        } = post;

        const article = <article>
            <PostHeader
                title={post.title}
                subtitle={post.subtitle}
                createdTime={post.createdTime}
                category={post.category}
            />
            <PostBody post={post}/>
            <PostFooter tags={post.tags} license={post.license}/>
        </article>;

        const moreItems = (earlierPostExcerpt || laterPostExcerpt)
            ? <MorePosts
                earlierPostExcerpt={earlierPostExcerpt}
                laterPostExcerpt={laterPostExcerpt}
            />
            : null;

        const contents = [
            article,
            moreItems,
        ];

        return <Main
            title={post.title}
            tableOfContents={tableOfContents}
            contents={contents}
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
