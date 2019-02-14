import React from 'react'
import Main from '../components/Main'
import ContentTitle from "../components/ContentTitle";
import Paginator from "../components/Paginator";

import ListLayout from '../components/ListLayout';
import PostExcerpt from '../components/PostExcerpt';
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

        const { allPost: { edges: posts } } = data;

        const itemComponents = posts.map((post, index) =>
            React.createElement(PostExcerpt, {item: post.node, key: `${index}`})
        );

        const header = showsPageTitle
            ? <ContentTitle title={title} subtitle={subtitle}/>
            : null;

        const main = <React.Fragment>
            <ListLayout>
                {itemComponents}
            </ListLayout>
            <Paginator paginationInfo={paginationInfo}/>
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
