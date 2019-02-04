import React from "react"
import { graphql } from 'gatsby'
import Main from '../components/Main'
import PostFullText from '../components/PostFullText'
import MorePosts from '../components/MorePosts'

class Post extends React.Component {
    render() {
        const { data } = this.props;

        const {
            config: {
                site: {
                    lang,
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

        /*
        const morePostsComponent = (earlierPostExcerpt || laterPostExcerpt)
            ? <MorePosts
                earlierPostExcerpt={earlierPostExcerpt}
                laterPostExcerpt={laterPostExcerpt}
            />
            : null;
        */

        const morePostsComponent = null;

        return <Main tableOfContents={tableOfContents}>
            <PostFullText post={post} defaultLicense={defaultLicense}/>
            {morePostsComponent}
        </Main>
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
            accessories {
                images {
                    src {
                        publicURL
                        childImageSharp {
                            fluid {
                                ...GatsbyImageSharpFluid
                                ...GatsbyImageSharpFluid_withWebp
                            }
                        }
                    }
                    alt
                    title
                }
            }
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
