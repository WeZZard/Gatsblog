import React from 'react';
import * as styles from './Navigation.module.scss';
import Media from 'react-media';

import TableOfContents from './TableOfContents';
import NavigationBar from './NavigationBar';
import SocialBar from './SocialBar';
import TocButton from './TocButton';
import NavButton from './NavButton';
import SiteTitle from './SiteTitle';
import SiteFooter from './SiteFooter';

import { graphql, StaticQuery } from 'gatsby';
import { MdxHeading } from '../types';

interface HeadingData {
  id: string;
  value: string;
  depth: number;
}

interface NavigationDelegate {
  menuDidToggle: () => void;
  menuDidClose: () => void;
}

interface NavigationProps {
  slug?: string;
  headings?: MdxHeading[];
  delegate: NavigationDelegate;
}

// Convert MdxHeading to HeadingData by generating id from value
const convertHeadings = (headings: MdxHeading[]): HeadingData[] => {
  return headings.map((heading, index) => ({
    ...heading,
    id: `heading-${index}-${heading.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`
  }));
};

interface NavigationState {
  isTocMenuOpen: boolean;
  isNavMenuOpen: boolean;
}

interface NavigationQueryData {
  config: {
    site: {
      title: string;
    };
  };
}

class Navigation extends React.Component<NavigationProps, NavigationState> {
  constructor(props: NavigationProps) {
    super(props);
    this.tocButtonDidTap = this.tocButtonDidTap.bind(this);
    this.navButtonDidTap = this.navButtonDidTap.bind(this);
    this.menuItemDidTap = this.menuItemDidTap.bind(this);
    this.state = {
      isTocMenuOpen: false,
      isNavMenuOpen: false,
    };
  }

  navButtonDidTap() {
    const isNavMenuOpen = this.state.isNavMenuOpen;
    this.setState({
      ...this.state,
      isNavMenuOpen: !isNavMenuOpen,
    });
    this.props.delegate.menuDidToggle();
  }

  tocButtonDidTap() {
    const isTocMenuOpen = this.state.isTocMenuOpen;
    this.setState({
      ...this.state,
      isTocMenuOpen: !isTocMenuOpen,
    });
    this.props.delegate.menuDidToggle();
  }

  menuItemDidTap() {
    this.setState({
      ...this.state,
      isTocMenuOpen: false,
      isNavMenuOpen: false,
    });
    this.props.delegate.menuDidClose();
  }

  render() {
    const { slug, headings } = this.props;
    const { isTocMenuOpen, isNavMenuOpen } = this.state;

    let navigationClassNames = [styles.navigation];

    if (isTocMenuOpen || isNavMenuOpen) {
      navigationClassNames.push(styles.isButtonSelected);
    }

    if (isTocMenuOpen) {
      navigationClassNames.push(styles.isTocButtonSelected);
    }

    if (isNavMenuOpen) {
      navigationClassNames.push(styles.isNavButtonSelected);
    }

    const navigationClassName = navigationClassNames.join(' ');

    const hasTableOfContents = (headings && headings.length > 0) || false;
    const convertedHeadings = headings ? convertHeadings(headings) : [];

    const tableOfContentsComponent = hasTableOfContents ? (
      <div className={styles.tableOfContents}>
        <TableOfContents
          headings={convertedHeadings}
          menuItemDidTap={this.menuItemDidTap}
          isOpen={isTocMenuOpen}
        />
      </div>
    ) : null;

    const navButton = (
      <Media query={{ maxWidth: 960 }}>
        {(matches) => matches ? (
          <NavButton onClick={this.navButtonDidTap} isSelected={isNavMenuOpen} />
        ) : null}
      </Media>
    );

    const tocButton = (
      <Media query={{ maxWidth: 960 }}>
        {(matches) => matches && hasTableOfContents ? (
          <TocButton
            onClick={this.tocButtonDidTap}
            isSelected={isTocMenuOpen}
          />
        ) : null}
      </Media>
    );

    const showsSlogans = !(headings && headings.length > 0);

    const siteFooterClassNames = [styles.siteFooter];

    if (showsSlogans) {
      siteFooterClassNames.push(styles.growEnabled);
    }

    const siteFooterClassName = siteFooterClassNames.join(' ');

    const siteFooter = (
      <Media query={{ maxWidth: 960 }}>
        {(matches) => !matches ? (
          <div className={siteFooterClassName}>
            <SiteFooter showsSlogans={showsSlogans} />
          </div>
        ) : null}
      </Media>
    );

    return (
      <StaticQuery<NavigationQueryData>
        query={componentQuery}
        render={({
          config: {
            site: { title },
          },
        }) => {
          return (
            <div className={navigationClassName}>
              <div className={styles.header}>
                <div className={styles.navButton}>{navButton}</div>
                <div className={styles.siteTitle}>
                  <SiteTitle title={title} />
                </div>
                <div className={styles.tocButton}>{tocButton}</div>
              </div>
              <div className={styles.navigationBar}>
                <NavigationBar
                  isOpen={isNavMenuOpen}
                  menuItemDidTap={this.menuItemDidTap}
                  slug={slug}
                />
                <SocialBar
                  isOpen={isNavMenuOpen}
                  menuItemDidTap={this.menuItemDidTap}
                />
              </div>
              {tableOfContentsComponent}
              {siteFooter}
            </div>
          );
        }}
      />
    );
  }
}

export default Navigation;

const componentQuery = graphql`
  query NavigationQuery {
    config {
      site {
        title
      }
    }
  }
`;