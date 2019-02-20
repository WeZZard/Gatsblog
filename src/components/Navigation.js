import React from 'react';
import PropTypes from 'prop-types';
import styles from './Navigation.module.scss';

import TableOfContents from './TableOfContents';
import NavigationBar from './NavigationBar';
import TocButton from './TocButton';

import { graphql, StaticQuery } from 'gatsby';

class Navigation extends React.Component {
  constructor(props) {
    super(props);
    this.toggleToc = this.toggleToc.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.tocItemOnClick = this.tocItemOnClick.bind(this);
    this.state = {
      isTocOpen: false,
      pageYOffset: 0,
    };
  }

  toggleToc() {
    const isTocOpen = this.state.isTocOpen;
    const pageYOffset = this.state.pageYOffset;
    this.setState({ isTocOpen: !isTocOpen, pageYOffset });
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll, { passive: true });
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll() {
    const isTocOpen = this.state.isTocOpen;
    const newState = { isTocOpen, pageYOffset: window.pageYOffset };
    this.setState(newState);
  }

  tocItemOnClick() {
    const isTocOpen = this.state.isTocOpen;
    const pageYOffset = this.state.pageYOffset;
    const newState = { isTocOpen: !isTocOpen, pageYOffset };
    this.setState(newState);
  }

  render() {
    const { slug, headings, errorCode } = this.props;

    const { isTocOpen, pageYOffset } = this.state;

    let navigationClassNames = [styles.navigation];

    if (isTocOpen) {
      navigationClassNames.push(styles.tocOpen);
    } else {
      if (pageYOffset > 0) {
        navigationClassNames.push(styles.bordered);
      }
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
          tocItemOnClick={this.tocItemOnClick}
          isOpen={isTocOpen}
        />
      </div>
    ) : null;

    const tocButton = hasTableOfContents ? (
      <TocButton onClick={this.toggleToc} isOpen={isTocOpen} />
    ) : null;

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
              <div className={styles.siteTitle}>
                <label className={styles.siteTitleLabel}>{title}</label>
              </div>
              <div className={styles.navigationBarWrapper}>
                <div className={styles.navigationBar}>
                  <NavigationBar slug={slug} />
                </div>
                {tocButton}
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
