import React from 'react'
import styles from './Categories.module.scss';

import Main from '../components/Main'
import ContentTitle from "../components/ContentTitle";
import Paginator from "../components/Paginator";
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

        const header = showsPageTitle
            ? <header><ContentTitle title={title} subtitle={subtitle}/></header>
            : null;

        const components = taxonomies
            .sort((t1, t2) => t1 > t2)
            .map((category, index) =>
                <div key={index} className={styles.categorySummary}>
                    {
                        React.createElement(
                            CategorySummary,
                            { category, baseSlug: slug, posts }
                        )
                    }
                </div>
            );

        const contents = <React.Fragment>
            {header}
            <main>{components}</main>
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
