import React from 'react';
import styles from './License.module.scss';

import CC40Image from './CC40Image';
import { graphql, StaticQuery } from 'gatsby';

export default ({ license }) => (
  <StaticQuery
    query={componentQuery}
    render={({
      config: {
        site: { license: defaultLicense },
      },
    }) => {
      const finalLicense = license || defaultLicense;

      const cc40Regex = /^cc4\.0-((by)|(by-nc)|(by-nc-nd)|(by-nc-sa)|(by-nd)|(by-sa))$/i;

      const cc40Match = cc40Regex.exec(finalLicense);

      if (cc40Match) {
        const optionString = cc40Match[1].toLowerCase();

        const options = optionString.split('-');

        const text = cc40TextForOptions(options);

        return (
          <div className={styles.license}>
            <span className={styles.image}>
              <CC40Image options={optionString} />
            </span>
            <span className={styles.text}>{text}</span>
          </div>
        );
      } else {
        return (
          <div>
            <span className={styles.text}>{finalLicense}</span>
          </div>
        );
      }
    }}
  />
);

const cc40TextForOptions = options => {
  const items = [];

  if (options.includes('by')) {
    items.push('Attribution');
  }

  if (options.includes('nc')) {
    items.push('Non-Commercial');
  }

  if (options.includes('nd')) {
    items.push('Non-Derivatives');
  }

  if (options.includes('sa')) {
    items.push('Share-Alike');
  }

  return `This work is licensed under a Creative Commons ${items.join(
    '-',
  )} 4.0 International License.`;
};

const componentQuery = graphql`
  query LicenseQuery {
    config: configYaml {
      site {
        license
      }
    }
  }
`;
