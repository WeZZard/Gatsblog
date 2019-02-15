import React from 'react'
import styles from './Index.module.scss'

import Main from '../components/Main'
import ContentTitle from "../components/ContentTitle";
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

        const { allPost: { edges: postNodes } } = data;

        const post = postNodes.map(postNode => postNode.node)
            .sort((p1, p2) => p1.createdTime < p2.createdTime);

        const itemComponents = post
            .map((post, index) =>
                <div key={index} className={styles.postExcerpt}>
                    {React.createElement(PostExcerpt, {item: post})}
                </div>
            );

        const header = showsPageTitle
            ? <ContentTitle title={title} subtitle={subtitle}/>
            : null;

        const main = <React.Fragment>
            {itemComponents}
            <div className={styles.paginator}>
                <Paginator paginationInfo={paginationInfo}/>
            </div>
        </React.Fragment>;

        return <Main
            slug={slug}
            title={title}
            description={description}
            keywords={keywords}
            header={header}
            main={main}
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
