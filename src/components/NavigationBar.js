import React from 'react'
import { StaticQuery, graphql, Link } from 'gatsby'
import styles from './NavigationBar.module.scss'

class NavigationItem extends React.Component {
    render() {
        const { navigationItem, isSelected } = this.props;

        const { name, slug } = navigationItem;

        const className = isSelected
            ? [styles.navigationItem, styles.selected].join(' ')
            : styles.navigationItem;

        return <span className={className}><Link to={slug}>{name}</Link></span>
    }
}

class NavigationBar extends React.Component {
    render() {
        const { selectedNavigationItem } = this.props;

        return <StaticQuery
            query={_navigationQuery}

            render={ data => {
                const systemNavigationItems = [
                    {name: `Home`, slug: `/`}
                ];

                const {
                    configYaml: {
                        site: {
                            title: siteTitle
                        },
                        navigation: {
                            createsNavigationItemsForCategories,
                            overwritingCategoryNavigationItems,
                            customNavigationItems,
                        }
                    },
                    allCategory: {
                        edges: categories
                    }
                } = data;

                let overwrittenCategoryNavigationItems = [];

                if (createsNavigationItemsForCategories) {
                    let systemCategoryNavigationItems = categories.map(category => ({name: category.node.name, slug: category.node.slug, weight: 0}));

                    overwritingCategoryNavigationItems.forEach(overwritingCategoryNavigationItem => {
                        const { name, weight, isVisible } = overwritingCategoryNavigationItem;

                        if (isVisible) {
                            const candidateOverwrittenCategoryNavigationItems = systemCategoryNavigationItems.filter(item => item.name === name);

                            if (candidateOverwrittenCategoryNavigationItems.length === 1) {
                                const overwrittenCategoryNavigationItem = candidateOverwrittenCategoryNavigationItems[0];
                                overwrittenCategoryNavigationItem.weight = weight;
                                overwrittenCategoryNavigationItems.push(overwrittenCategoryNavigationItem);
                            } else if (candidateOverwrittenCategoryNavigationItems.length === 0) {
                                // do nothing
                            } else {
                                throw `Multiple category navigation item with the same name found.`
                            }
                        }
                    });
                }

                const userNavigationItems = [
                    ...overwrittenCategoryNavigationItems,
                    ...customNavigationItems,
                ].sort((a, b) => a.weight >= b.weight);

                const navigationItems = [
                    ...systemNavigationItems,
                    ...userNavigationItems,
                ];

                const components = navigationItems.map((navigationItem) => {
                    return <li key={navigationItem.slug}>
                        <NavigationItem
                            navigationItem={navigationItem}
                            isSelected={selectedNavigationItem && navigationItem.slug === selectedNavigationItem.slug}
                        />
                    </li>
                });

                return (
                    <nav className={styles.navigationBar}>
                        <div className={styles.siteTitle}>
                            <label>{siteTitle}</label>
                        </div>
                        <div className={styles.navigationContent}>
                            <ol>
                                {components}
                            </ol>
                        </div>
                    </nav>
                )
            }}
        />;
    }
}

export default NavigationBar

const _navigationQuery = graphql`
    query NavigationQuery {
        configYaml {
            site {
                title
            }
            navigation {
                createsNavigationItemsForCategories
                overwritingCategoryNavigationItems {
                    name
                    weight
                    isVisible
                }
                customNavigationItems {
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