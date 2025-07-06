import React from 'react';
import PropTypes from 'prop-types';
import styles from './Main.module.scss';
import Media from 'react-media';

import Viewport from './Viewport';
import SEO from './SEO';
import GoogleAnalytics from './GoogleAnalytics';
import AppBackground from './AppBackground';
import Navigation from './Navigation';
import Contents from './Contents';
import SiteFooter from './SiteFooter';

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.menuDidToggle = this.menuDidToggle.bind(this);
    this.menuDidClose = this.menuDidClose.bind(this);
    this.state = { isMenuOpen: false };
  }

  menuDidToggle() {
    this.setState({ isMenuOpen: !this.state.isMenuOpen });
  }

  menuDidClose() {
    this.setState({ isMenuOpen: false });
  }

  render() {
    const {
      slug,
      lang,
      title,
      description,
      keywords,
      headings,
      sections,
      layout,
    } = this.props;

    const { isMenuOpen } = this.state;

    const navigationClassNames = [styles.navigation];
    const appBackgroundClassNames = [styles.appBackground];
    const contentsClassNames = [styles.contents];
    const footerClassNames = [styles.footer];

    if (isMenuOpen) {
      navigationClassNames.push(styles.menuOpen);
    }

    let contents;
    let backgroundPosition;

    switch (layout) {
      case 'Content':
        contents = <Contents sections={sections} />;
        backgroundPosition = 'Left';
        break;
      case 'Error':
        contents = sections;
        navigationClassNames.push(styles.error);
        appBackgroundClassNames.push(styles.error);
        contentsClassNames.push(styles.error);
        footerClassNames.push(styles.error);
        backgroundPosition = 'Center';
        break;
      default:
        throw `Unexpected layout: ${layout}.`;
    }

    const navigationClassName = navigationClassNames.join(' ');
    const appBackgroundClassName = appBackgroundClassNames.join(' ');
    const contentsClassName = contentsClassNames.join(' ');
    const footerClassName = footerClassNames.join(' ');

    return (
      <React.Fragment>
        <Viewport />
        <GoogleAnalytics />
        <SEO
          lang={lang}
          title={title}
          description={description}
          keywords={keywords}
        />
        <div className={styles.main}>
          <div className={appBackgroundClassName}>
            <AppBackground backgroundPosition={backgroundPosition} />
          </div>
          <div className={navigationClassName}>
            <Navigation
              slug={slug}
              headings={headings}
              delegate={{
                menuDidToggle: this.menuDidToggle,
                menuDidClose: this.menuDidClose,
              }}
            />
          </div>
          <div className={contentsClassName}>{contents}</div>
          <Media query={{ maxWidth: 960 }}>
            <div className={footerClassName}>
              <div className={styles.footerContents}>
                <SiteFooter />
                <div className={styles.footerOverlay} />
              </div>
            </div>
          </Media>
        </div>
      </React.Fragment>
    );
  }
}

Main.defaultProps = {
  layout: 'Content',
};

Main.propTypes = {
  description: PropTypes.string,
  headings: PropTypes.arrayOf(PropTypes.object),
  keywords: PropTypes.arrayOf(PropTypes.string),
  lang: PropTypes.string,
  sections: PropTypes.any,
  slug: PropTypes.string,
  title: PropTypes.string,
  layout: PropTypes.string,
};

export default Main;
