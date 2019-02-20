import React from 'react';
import styles from './Main.module.scss';

import Viewport from './Viewport';
import SEO from './SEO';
import GoogleAnalytics from './GoogleAnalytics';
import Navigation from './Navigation';
import SiteFooter from './SiteFooter';
import Contents from './Contents';

export default ({
  slug,
  lang,
  title,
  description,
  keywords,
  headings,
  sections,
}) => {
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
        <Navigation slug={slug} headings={headings} />
        <Contents sections={sections} />
        <SiteFooter />
      </div>
    </React.Fragment>
  );
};
