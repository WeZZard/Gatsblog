import React from 'react';
import * as styles from './NavigationBar.module.scss';
import { StaticQuery, graphql } from 'gatsby';
import Link from './Link';
import styled from 'styled-components';

interface ItemProps {
  isOpen: boolean;
  index: number;
  count: number;
}

const Item = styled.li<ItemProps>`
  @media (max-width: 1280px) {
    transition-delay: ${({ isOpen, index, count }) =>
      isOpen ? 0.2 + 0.07 * index : 0.56 - index * (0.56 / (count - 1))}s;
  }
`;

interface NavigationBarProps {
  isOpen: boolean;
  menuItemDidTap: () => void;
  slug?: string;
}

interface NavigationItem {
  name: string;
  slug: string;
  weight?: number;
}

interface CategoryNavigationItem {
  name: string;
  slug: string;
  index: number;
  weight: number;
}

interface OverwritingCategoryNavigationItem {
  name: string;
  weight: number;
  isVisible: boolean;
}

interface NavigationBarQueryData {
  config: {
    navigation: {
      createsNavigationItemsForCategories: boolean;
      overwritingCategoryNavigationItems: OverwritingCategoryNavigationItem[];
      customNavigationItems: NavigationItem[];
    };
  };
  // TODO: Fix allCategory query compatibility
  // allCategory: {
  //   edges: Array<{
  //     node: {
  //       name: string;
  //       slug: string;
  //     };
  //   }>;
  // };
}

const NavigationBar: React.FC<NavigationBarProps> = ({ isOpen, slug, menuItemDidTap }) => {
  return (
    <StaticQuery<NavigationBarQueryData>
      query={componentQuery}
      render={data => {
        const systemNavigationItems: NavigationItem[] = [{ name: 'Home', slug: '/' }];

        const {
          config: {
            navigation: {
              createsNavigationItemsForCategories,
              overwritingCategoryNavigationItems,
              customNavigationItems,
            },
          },
          // TODO: Fix allCategory query compatibility
          // allCategory: { edges: categories },
        } = data;

        // TODO: Re-enable category navigation when allCategory query is fixed
        const categories: Array<{ node: { name: string; slug: string } }> = [];
        const sortedCategories = categories.map(
          ({ node: { name, slug } }) => ({ name, slug }),
        );

        sortedCategories.sort((a, b) => (a.name <= b.name ? -1 : 1));

        const categoryNavigationItems: Record<string, CategoryNavigationItem> = {};

        if (createsNavigationItemsForCategories) {
          sortedCategories.forEach(({ name, slug }, index) => {
            categoryNavigationItems[name] = { name, slug, index, weight: 0 };
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

        const overwrittenCategoryNavigationItems = Object.entries(categoryNavigationItems)
          .map(([, detail]) => detail)
          .sort((a, b) => (a.index < b.index ? -1 : 1))
          .map(item => {
            const { index, ...rest } = item;
            return rest;
          });

        const userNavigationItems = [
          ...overwrittenCategoryNavigationItems,
          ...customNavigationItems,
        ];

        userNavigationItems.sort((a, b) => (a.weight! <= b.weight! ? -1 : 1));

        const navigationItems = [...systemNavigationItems, ...userNavigationItems];

        const components = navigationItems.map((navigationItem, index) => {
          const slugPattern =
            navigationItem.slug === '/'
              ? `^((${navigationItem.slug})|(/page-\\d+))$`
              : `^((${navigationItem.slug})|(${navigationItem.slug}/page-\\d+))$`;
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
              index={index}
              count={navigationItems.length}
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
    # TODO: Fix allCategory query compatibility
    # allCategory {
    #   edges {
    #     node {
    #       name
    #       slug
    #     }
    #   }
    # }
  }
`;