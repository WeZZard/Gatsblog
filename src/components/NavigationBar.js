import React from 'react';
import PropTypes from 'prop-types';
import styles from './NavigationBar.module.scss';

import { StaticQuery, graphql } from 'gatsby';
import Link from './Link';

// Simple component to replace styled-component and avoid react-is circular reference
const Item = ({ children, className, isOpen, ...props }) => {
  return (
    <li className={className} {...props}>
      {children}
    </li>
  );
};

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
            // Safety check for undefined/null navigation items
            if (!navigationItem || !navigationItem.slug || !navigationItem.name) {
              return null;
            }

            const slugPattern =
              navigationItem.slug === '/'
                ? `^((${navigationItem.slug})|(/page-\\d+))$`
                : `^((${navigationItem.slug})|(${
                    navigationItem.slug
                  }/page-\\d+))$`;
            const slugRegex = new RegExp(slugPattern);
            const isSelected = slug && slugRegex.exec(slug) !== null;

            const { name: itemName, slug: itemSlug } = navigationItem;

            // Additional safety check for the extracted values
            if (!itemName || !itemSlug) {
              return null;
            }

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
          }).filter(component => component !== null);

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
