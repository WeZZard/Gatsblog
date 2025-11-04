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
    
    // Defensive check to avoid circular reference issues with CSS modules during SSR
    const safeStyles = styles || {};

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

          // Defensive sorting to handle undefined index properties
          overwrittenCategoryNavigationItems.sort((a, b) => {
            const aIndex = a.index ?? 0;
            const bIndex = b.index ?? 0;
            return aIndex < bIndex;
          });

          overwrittenCategoryNavigationItems.forEach(item => {
            if (item.hasOwnProperty('index')) {
              delete item.index;
            }
          });

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
              ? [safeStyles.navigationItemContents || 'navigation-item-contents', safeStyles.selected || 'selected'].join(' ')
              : safeStyles.navigationItemContents || 'navigation-item-contents';

            const kind = isSelected ? 'navigationSelected' : 'navigationNormal';

            return (
              <Item
                className={safeStyles.item || 'item'}
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

          const navigationBarClassNames = [safeStyles.navigationBar || 'navigation-bar'];

          if (isOpen) {
            navigationBarClassNames.push(safeStyles.open || 'open');
          }

          const navigationBarClassName = navigationBarClassNames.join(' ');

          return (
            <nav className={navigationBarClassName}>
              <ol className={safeStyles.list || 'list'}>{components}</ol>
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
