import React from 'react';
import PropTypes from 'prop-types';
import styles from './NavigationBar.module.scss';

import { StaticQuery, graphql } from 'gatsby';
import Link from './Link';

const NavigationItem = ({ navigationItem, isSelected }) => {
  const { name, slug } = navigationItem;

  const className = isSelected
    ? [styles.navigationItem, styles.selected].join(' ')
    : styles.navigationItem;

  const kind = isSelected ? 'navigationSelected' : 'navigationNormal';

  return (
    <span className={className}>
      <Link kind={kind} to={slug}>
        {name}
      </Link>
    </span>
  );
};

NavigationItem.propTypes = {
  isSelected: PropTypes.bool,
  navigationItem: PropTypes.object,
};

class NavigationBar extends React.Component {
  render() {
    const { slug } = this.props;

    return (
      <StaticQuery
        query={_navigationQuery}
        render={data => {
          const systemNavigationItems = [{ name: `Home`, slug: `/` }];

          const {
            config: {
              navigation: {
                createsNavigationItemsForCategories,
                overwritingCategoryNavigationItems,
                customNavigationItems,
              },
            },
            allCategory: { edges: categories },
          } = data;

          let overwrittenCategoryNavigationItems = [];

          if (createsNavigationItemsForCategories) {
            let systemCategoryNavigationItems = categories.map(category => ({
              name: category.node.name,
              slug: category.node.slug,
              weight: 0,
            }));

            overwritingCategoryNavigationItems.forEach(
              overwritingCategoryNavigationItem => {
                const {
                  name,
                  weight,
                  isVisible,
                } = overwritingCategoryNavigationItem;

                if (isVisible) {
                  const candidateOverwrittenCategoryNavigationItems = systemCategoryNavigationItems.filter(
                    item => item.name === name,
                  );

                  if (
                    candidateOverwrittenCategoryNavigationItems.length === 1
                  ) {
                    const overwrittenCategoryNavigationItem =
                      candidateOverwrittenCategoryNavigationItems[0];
                    overwrittenCategoryNavigationItem.weight = weight;
                    overwrittenCategoryNavigationItems.push(
                      overwrittenCategoryNavigationItem,
                    );
                  } else if (
                    candidateOverwrittenCategoryNavigationItems.length === 0
                  ) {
                    // do nothing
                  } else {
                    throw `Multiple category navigation item with the same name found.`;
                  }
                }
              },
            );
          }

          const userNavigationItems = [
            ...overwrittenCategoryNavigationItems,
            ...customNavigationItems,
          ];

          userNavigationItems.sort((a, b) => {
            if (a.weight === b.weight) {
              return a > b;
            } else {
              return a.weight < b.weight;
            }
          });

          const navigationItems = [
            ...systemNavigationItems,
            ...userNavigationItems,
          ];

          const components = navigationItems.map(navigationItem => {
            const slugPattern =
              navigationItem.slug === '/'
                ? `^((${navigationItem.slug})|(/page-\\d+))$`
                : `^((${navigationItem.slug})|(${
                    navigationItem.slug
                  }/page-\\d+))$`;
            const slugRegex = new RegExp(slugPattern);
            const isSelected = slug && slugRegex.exec(slug);

            return (
              <li
                className={styles.navigationListItem}
                key={navigationItem.slug}
              >
                <NavigationItem
                  navigationItem={navigationItem}
                  isSelected={isSelected}
                />
              </li>
            );
          });

          return (
            <nav className={styles.navigationBar}>
              <ol className={styles.navigationList}>{components}</ol>
            </nav>
          );
        }}
      />
    );
  }
}

NavigationBar.propTypes = {
  slug: PropTypes.string,
};

export default NavigationBar;

const _navigationQuery = graphql`
  query NavigationBarQuery {
    config: configYaml {
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
