import React from 'react';

import GatsbyPage from '../gatsby/Page';
import Viewport from '../components/Viewport';
import SEO from '../components/SEO';
import GoogleAnalytics from '../components/GoogleAnalytics';
import Navigation from '../components/Navigation';
import SiteFooter from '../components/SiteFooter';
import styles from './404.module.scss';

class NotFoundPage extends GatsbyPage {
  render() {
    return (
      <React.Fragment>
        <Viewport />
        <GoogleAnalytics />
        <SEO title={'404'} />
        <div className={styles.main}>
          <div className={styles.errorInfoWrapper}>
            <div className={styles.errorInfo}>
              <div className={styles.title}>404 Not Found</div>
              <div className={styles.description}>
                What you are looking for is not in this universe.
              </div>
            </div>
          </div>
          <Navigation errorCode={404} />
          <SiteFooter errorCode={404} />
        </div>
      </React.Fragment>
    );
  }
}

export default NotFoundPage;
