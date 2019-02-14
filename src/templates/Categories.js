import React from 'react'
import Main from '../components/Main'
import ContentTitle from "../components/ContentTitle";
import Paginator from "../components/Paginator";

import ListLayout from '../components/ListLayout';
import CategorySummary from '../components/CategorySummary';
import { graphql } from 'gatsby';

class Categories extends React.Component {
    render() {
        const { data, pageContext } = this.props;
        const {
            slug,
            taxonomies,
            paginationInfo,
            title,
            subtitle,
            showsPageTitle,
            description,
            keywords
        } = pageContext;

        const {
            allPost: {
                edges: postNodes
            }
        } = data;

        const posts = postNodes.map(postNode => postNode.node);

        const components = taxonomies.map((category, index) =>
            React.createElement(
                CategorySummary,
                {
                    category,
                    baseSlug: slug,
                    posts,
                    key: index
                }
            )
        );

        const header = showsPageTitle
            ? <ContentTitle title={title} subtitle={subtitle}/>
            : null;

        const main = <React.Fragment>
            <ListLayout>
                {components}
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

export default Categories

export const pageQuery = graphql`
    query CategoriesQuery($taxonomies: [String!]!) {
        allPost(filter: {category: {in: $taxonomies}}) {
            edges {
                node {
                    slug
                    title
                    subtitle
                    isPublished
                    createdTime
                    category
                }
            }
        }
    }
`;
