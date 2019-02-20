import React from 'react';
import PropTypes from 'prop-types';
import styles from './NavigationBar.module.scss';

import { StaticQuery, graphql } from 'gatsby';
import Link from './Link';
import styled from 'styled-components';

const Item = styled.li`
  @media (max-width: 1280px) {
    transition-delay: ${({ isOpen, index, count }) =>
      isOpen ? 0.56 - index * (0.56 / count) : 0.2 + index * (0.56 / count)}s;
    }
  }
`;

const NavigationItem = ({ navigationItem, isSelected }) => {
  const { name, slug } = navigationItem;

  const className = isSelected
    ? [styles.navigationItemContents, styles.selected].join(' ')
    : styles.navigationItemContents;

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
    const { isOpen, slug } = this.props;

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
            const isSelected = slug && slugRegex.exec(slug) !== null;

            return (
              <Item
                className={styles.item}
                key={navigationItem.slug}
                isOpen={isOpen}
              >
                <NavigationItem
                  navigationItem={navigationItem}
                  isSelected={isSelected}
                />
              </Item>
            );
          });

          const wrapperClassNames = [styles.flexWrapper];

          if (isOpen) {
            wrapperClassNames.push(styles.open);
          }

          const wrapperClassName = wrapperClassNames.join(' ');

          return (
            <nav className={wrapperClassName}>
              <ol className={styles.list}>{components}</ol>
            </nav>
          );
        }}
      />
    );
  }
}

NavigationBar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
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
