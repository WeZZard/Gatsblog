import React from 'react'
import { StaticQuery, graphql, Link } from 'gatsby'
import styles from './NavigationBar.module.scss'

import SiteTitle from './SiteTitle'

class NavigationItem extends React.Component {
    render() {
        const { navigationItem } = this.props;

        const { name, slug } = navigationItem;

        return <span className={styles.navigationItem}><Link to={slug}>{name}</Link></span>
    }
}

class NavigationItems extends React.Component {
    render () {
        return <StaticQuery
            query={_navigationQuery}

            render={ data => {
                const systemNavigationItems = [
                    {name: `Home`, slug: `/`}
                ];

                const createsNavigationItemsForCategories = data.site.siteMetadata.createsNavigationItemsForCategories;
                const categoryNavigationItems = data.site.siteMetadata.categoryNavigationItems;
                const categories = data.allCategory.edges.map(category => category.node);
                let userNavigationItems = data.site.siteMetadata.navigationItems;

                let customizedCategoryNavigationItems = [];

                if (createsNavigationItemsForCategories) {
                    let rawCategoryNavigationItems = categories.map(category => ({name: category.name, slug: category.slug, weight: 0}));

                    categoryNavigationItems.forEach(categoryNavigationItem => {
                        const {name, weight, isVisible} = categoryNavigationItem;

                        if (isVisible) {
                            const candidateNavigationItems = rawCategoryNavigationItems.filter(item => { return item.name === name });

                            if (candidateNavigationItems.length === 1) {
                                const customizedNavigationItem = candidateNavigationItems[0];
                                customizedNavigationItem.weight = weight;
                                customizedCategoryNavigationItems.push(customizedNavigationItem);
                            } else if (candidateNavigationItems.length === 0) {
                                // do nothing
                            } else {
                                throw `Multiple category navigation item with the same name found.`
                            }
                        }
                    });
                }

                const navigationItems = systemNavigationItems.concat(customizedCategoryNavigationItems).concat(userNavigationItems);

                const components = navigationItems.map((navigationItem) => {
                    return <li><NavigationItem navigationItem={navigationItem}/></li>
                });

                return <React.Fragment>
                    {components}
                </React.Fragment>
            }}
        />
    }
}

class NavigationBar extends React.Component {
    render() {
        const { navigationStack } = this.props;

        return (
            <nav className={styles.navigationBar}>
                <div className={styles.siteTitle}>
                    <SiteTitle/>
                </div>
                <div className={styles.navigationContent}>
                    <ol>
                        <NavigationItems/>
                    </ol>
                </div>
            </nav>
        )
    }
}

export default NavigationBar

const _navigationQuery = graphql`
    query NavigationQuery {
        site {
            siteMetadata {
                createsNavigationItemsForCategories
                categoryNavigationItems {
                    name
                    weight
                    isVisible
                }
                navigationItems {
                    name
                    slug
                    weight
                }
            }
        }
        allCategory {
            edges {
                node {
                    name
                    slug
                }
            }
        }
    }
`;