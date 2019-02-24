import React from 'react';
import PropTypes from 'prop-types';
import styles from './SiteFooter.module.scss';

import { graphql, StaticQuery } from 'gatsby';

class SiteFooter extends React.Component {
  render() {
    return (
      <StaticQuery
        query={componentQuery}
        render={({
          config: {
            site: { owner: siteOwner, slogans },
          },
        }) => {
          const { showsSlogans } = this.props;

          const siteFooterClassNames = [styles.siteFooter];

          const siteFooterClassName = siteFooterClassNames.join(' ');

          return (
            <div className={siteFooterClassName}>
              <div className={styles.siteInfo}>
                {showsSlogans || showsSlogans === undefined
                  ? slogans.map((slogan, index) => (
                      <div key={index} className={styles.siteInfoItem}>
                        <span
                          className={styles.slogan}
                          dangerouslySetInnerHTML={{
                            __html: slogan,
                          }}
                        />
                      </div>
                    ))
                  : null}
                <div className={styles.siteInfoItem}>
                  <span className={styles.copyright}>
                    © {new Date().getFullYear()} {siteOwner} All Copyright
                    Reserved.
                  </span>
                </div>
              </div>
            </div>
          );
        }}
      />
    );
  }
}

SiteFooter.propTypes = {
  showsSlogans: PropTypes.bool,
};

export default SiteFooter;

const componentQuery = graphql`
  query SiteFooterQuery {
    config {
      site {
        owner
        slogans
      }
    }
  }
`;
