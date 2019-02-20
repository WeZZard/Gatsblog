import React from 'react';
import PropTypes from 'prop-types';
import styles from './Main.module.scss';

import Viewport from './Viewport';
import SEO from './SEO';
import GoogleAnalytics from './GoogleAnalytics';
import Navigation from './Navigation';
import SiteFooter from './SiteFooter';
import Contents from './Contents';

const Main = ({
  slug,
  lang,
  title,
  description,
  keywords,
  headings,
  sections,
}) => (
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
      <Navigation slug={slug} headings={headings} />
      <Contents sections={sections} />
      <SiteFooter />
    </div>
  </React.Fragment>
);

Main.propTypes = {
  description: PropTypes.string,
  headings: PropTypes.arrayOf(PropTypes.object),
  keywords: PropTypes.arrayOf(PropTypes.string),
  lang: PropTypes.string,
  sections: PropTypes.any,
  slug: PropTypes.string,
  title: PropTypes.string,
};

export default Main;
