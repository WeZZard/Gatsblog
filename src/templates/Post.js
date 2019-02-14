import React from "react"
import { graphql } from 'gatsby'
import Main from '../components/Main'
import PostDocument from '../components/PostDocument'
import MorePosts from '../components/MorePosts'

class Post extends React.Component {
    render() {
        const { data } = this.props;

        const {
            config: {
                site: {
                    license: defaultLicense,
                },
            },
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

        const morePostsComponent = (earlierPostExcerpt || laterPostExcerpt)
            ? <MorePosts
                earlierPostExcerpt={earlierPostExcerpt}
                laterPostExcerpt={laterPostExcerpt}
            />
            : null;

        const main = <React.Fragment>
            <PostDocument post={post} defaultLicense={defaultLicense}/>
            {morePostsComponent}
        </React.Fragment>;

        return <Main
            title={post.title}
            tableOfContents={tableOfContents}
            main={main}
        />
    }
}

export default Post

export const pageQuery = graphql`
    query PostQuery($postId: String!, $earlierPostId: String, $laterPostId: String) {
        config: configYaml {
            site {
                lang
                license
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
