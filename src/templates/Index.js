import React from 'react'
import styles from './Index.module.scss'

import Main from '../components/Main'
import PageTitle from "../components/PageTitle";
import PostExcerpt from '../components/PostExcerpt';
import Paginator from "../components/Paginator";

import { graphql } from 'gatsby';

class Index extends React.Component {
    render() {
        const { data, pageContext } = this.props;
        const {
            slug,
            paginationInfo,
            title,
            subtitle,
            showsPageTitle,
            description,
            keywords
        } = pageContext;

        const { allPost } = data;

        const { edges: postNodes } = allPost || { edges: [] };

        const post = postNodes.map(postNode => postNode.node)
            .sort((p1, p2) => p1.createdTime < p2.createdTime);

        const header = showsPageTitle
            ? <header><PageTitle title={title} subtitle={subtitle}/></header>
            : null;

        const contents = <React.Fragment>
            {header}
            <main>
                {post.map((post, index) =>
                    <div key={index} className={styles.postExcerpt}>
                        {React.createElement(PostExcerpt, {item: post})}
                    </div>
                )}
            </main>
            <div className={styles.paginator}>
                <Paginator paginationInfo={paginationInfo}/>
            </div>
        </React.Fragment>;

        return <Main
            slug={slug}
            title={title}
            description={description}
            keywords={keywords}
            sections={contents}
        />
    }
}

export default Index

export const pageQuery = graphql`
    query IndexQuery($items: [String!]!) {
        allPost(filter: {id: {in: $items}}) {
            edges {
                node {
                    slug
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
                            excerpt(pruneLength: 300)
                        }
                    }
                }
            }
        }
    }
`;
