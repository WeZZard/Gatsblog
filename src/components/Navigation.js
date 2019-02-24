import React from 'react';
import PropTypes from 'prop-types';
import styles from './Navigation.module.scss';
import Media from 'react-media';

import TableOfContents from './TableOfContents';
import NavigationBar from './NavigationBar';
import SocialBar from './SocialBar';
import TocButton from './TocButton';
import NavButton from './NavButton';
import SiteTitle from './SiteTitle';
import SiteFooter from './SiteFooter';

import { graphql, StaticQuery } from 'gatsby';

class Navigation extends React.Component {
  constructor(props) {
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

    const tableOfContentsComponent = hasTableOfContents ? (
      <div className={styles.tableOfContents}>
        <TableOfContents
          headings={headings}
          menuItemDidTap={this.menuItemDidTap}
          isOpen={isTocMenuOpen}
        />
      </div>
    ) : null;

    const tocButton = (
      <Media query={{ maxWidth: 960 }}>
        <div className={styles.navButton}>
          <NavButton
            onClick={this.navButtonDidTap}
            isSelected={isNavMenuOpen}
          />
        </div>
      </Media>
    );

    const navButton = (
      <Media query={{ maxWidth: 960 }}>
        <div className={styles.tocButton}>
          {hasTableOfContents ? (
            <TocButton
              onClick={this.tocButtonDidTap}
              isSelected={isTocMenuOpen}
            />
          ) : null}
        </div>
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
        {matches =>
          matches ? null : (
            <div className={siteFooterClassName}>
              <SiteFooter showsSlogans={showsSlogans} />
            </div>
          )
        }
      </Media>
    );

    return (
      <StaticQuery
        query={componentQuery}
        render={({
          config: {
            site: { title },
          },
        }) => {
          return (
            <div className={navigationClassName}>
              <div className={styles.header}>
                {tocButton}
                <div className={styles.siteTitle}>
                  <SiteTitle title={title} />
                </div>
                {navButton}
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

Navigation.propTypes = {
  slug: PropTypes.string,
  headings: PropTypes.arrayOf(PropTypes.object),
  delegate: PropTypes.object.isRequired,
};

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
