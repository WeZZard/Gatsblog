import React from 'react';
import PropTypes from 'prop-types';
import styles from './NavigationBar.module.scss';

import { StaticQuery, graphql } from 'gatsby';
import Link from './Link';
import styled from 'styled-components';

const Item = styled.li`
  @media (max-width: 1280px) {
    transition-delay: ${({ isOpen, index, count }) =>
      isOpen ? 0.2 + 0.07 * index : 0.56 - index * (0.56 / (count - 1))}s;
    }
  }
`;

class NavigationBar extends React.Component {
  render() {
    const { isOpen, slug, menuItemDidTap } = this.props;

    return (
      <StaticQuery
        query={componentQuery}
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

          const sortedCategories = categories.map(
            ({ node: { name, slug } }) => ({ name, slug }),
          );

          sortedCategories.sort((a, b) => a.name <= b.name);

          const categoryNavigationItems = {};

          if (createsNavigationItemsForCategories) {
            sortedCategories.forEach(({ name, slug }, index) => {
              categoryNavigationItems[name] = { index, slug, weight: 0 };
            });

            overwritingCategoryNavigationItems.forEach(item => {
              const { name, weight, isVisible } = item;

              const overwrittenItem = categoryNavigationItems[name];

              if (overwrittenItem) {
                if (isVisible) {
                  categoryNavigationItems[name].weight = weight;
                } else {
                  delete categoryNavigationItems[name];
                }
              }
            });
          }

          const overwrittenCategoryNavigationItems = Object.entries(
            categoryNavigationItems,
          ).map(([name, detail]) => ({ name, ...detail }));

          overwrittenCategoryNavigationItems.sort((a, b) => a.index < b.index);

          overwrittenCategoryNavigationItems.forEach(item => delete item.index);

          const userNavigationItems = [
            ...overwrittenCategoryNavigationItems,
            ...customNavigationItems,
          ];

          userNavigationItems.sort((a, b) => {
            return a.weight <= b.weight;
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

            const { name: itemName, slug: itemSlug } = navigationItem;

            const className = isSelected
              ? [styles.navigationItemContents, styles.selected].join(' ')
              : styles.navigationItemContents;

            const kind = isSelected ? 'navigationSelected' : 'navigationNormal';

            return (
              <Item
                className={styles.item}
                key={navigationItem.slug}
                isOpen={isOpen}
              >
                <span className={className}>
                  <Link kind={kind} to={itemSlug} onClick={menuItemDidTap}>
                    {itemName}
                  </Link>
                </span>
              </Item>
            );
          });

          const navigationBarClassNames = [styles.navigationBar];

          if (isOpen) {
            navigationBarClassNames.push(styles.open);
          }

          const navigationBarClassName = navigationBarClassNames.join(' ');

          return (
            <nav className={navigationBarClassName}>
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
  menuItemDidTap: PropTypes.func.isRequired,
  slug: PropTypes.string,
};

export default NavigationBar;

const componentQuery = graphql`
  query NavigationBarQuery {
    config {
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
