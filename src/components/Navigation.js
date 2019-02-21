import React from 'react';
import PropTypes from 'prop-types';
import styles from './Navigation.module.scss';
import MediaQuery from 'react-responsive';

import TableOfContents from './TableOfContents';
import NavigationBar from './NavigationBar';
import SocialBar from './SocialBar';
import TocButton from './TocButton';
import NavButton from './NavButton';
import SiteTitle from './SiteTitle';

import { graphql, StaticQuery } from 'gatsby';

class Navigation extends React.Component {
  constructor(props) {
    super(props);
    this.toggleToc = this.toggleToc.bind(this);
    this.toggleNav = this.toggleNav.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.menuItemOnClick = this.menuItemOnClick.bind(this);
    this.state = {
      isTocSelected: false,
      isNavSelected: false,
      pageYOffset: 0,
    };
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll, { passive: true });
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  toggleNav() {
    const isNavSelected = this.state.isNavSelected;
    this.setState({
      ...this.state,
      isNavSelected: !isNavSelected,
    });
  }

  toggleToc() {
    const isTocSelected = this.state.isTocSelected;
    this.setState({
      ...this.state,
      isTocSelected: !isTocSelected,
    });
  }

  handleScroll() {
    const isTocSelected = this.state.isTocSelected;
    const newState = { isTocSelected, pageYOffset: window.pageYOffset };
    this.setState(newState);
  }

  menuItemOnClick() {
    this.setState({
      ...this.state,
      isTocSelected: false,
      isNavSelected: false,
    });
  }

  render() {
    const { slug, headings, errorCode } = this.props;

    const { isTocSelected, isNavSelected, pageYOffset } = this.state;

    let navigationClassNames = [styles.flexWrapper];

    if (isTocSelected || isNavSelected) {
      navigationClassNames.push(styles.isButtonSelected);
    }

    if (isTocSelected) {
      navigationClassNames.push(styles.isTocButtonSelected);
    }

    if (isNavSelected) {
      navigationClassNames.push(styles.isNavButtonSelected);
    }

    if (pageYOffset > 0) {
      navigationClassNames.push(styles.bordered);
    }

    if (errorCode === 404) {
      navigationClassNames.push(styles.errorCode404);
    }

    const navigationClassName = navigationClassNames.join(' ');

    const hasTableOfContents = (headings && headings.length > 0) || false;

    const tableOfContentsComponent = hasTableOfContents ? (
      <div className={styles.tableOfContents}>
        <TableOfContents
          headings={headings}
          tocItemOnClick={this.menuItemOnClick}
          isOpen={isTocSelected}
        />
      </div>
    ) : null;

    const tocButton = (
      <MediaQuery query="(max-width: 960px)">
        <div className={styles.navButton}>
          <NavButton onClick={this.toggleNav} isSelected={isNavSelected} />
        </div>
      </MediaQuery>
    );

    const navButton = (
      <MediaQuery query="(max-width: 960px)">
        <div className={styles.tocButton}>
          {hasTableOfContents ? (
            <TocButton onClick={this.toggleToc} isSelected={isTocSelected} />
          ) : null}
        </div>
      </MediaQuery>
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
              <div className={styles.navigation}>
                <NavigationBar
                  isOpen={isNavSelected}
                  navItemOnClick={this.menuItemOnClick}
                  slug={slug}
                />
                <SocialBar
                  isOpen={isNavSelected}
                  socialItemOnClick={this.menuItemOnClick}
                />
              </div>
              {tableOfContentsComponent}
            </div>
          );
        }}
      />
    );
  }
}

Navigation.propTypes = {
  slug: PropTypes.string,
  errorCode: PropTypes.number,
  headings: PropTypes.arrayOf(PropTypes.object),
};

export default Navigation;

const componentQuery = graphql`
  query NavigationQuery {
    config: configYaml {
      site {
        title
      }
    }
  }
`;
