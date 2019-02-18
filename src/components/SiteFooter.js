import React from 'react'
import styles from './SiteFooter.module.scss';

import { graphql, StaticQuery } from 'gatsby';

class SiteFooter extends React.Component {
    render() {
        return <StaticQuery
            query={componentQuery}
            render={(
                {
                    config: {
                        site: {
                            owner: siteOwner,
                            slogans,
                        }
                    }
                }) =>
            {
                const { errorCode } = this.props;

                const siteFooterClassNames = [styles.siteFooter];

                if (errorCode === 404) {
                    siteFooterClassNames.push(styles.errorCode404);
                }

                const siteFooterClassName = siteFooterClassNames.join(' ');

                return <div className={siteFooterClassName}>
                    <div className={styles.siteInfo}>
                        {slogans.map((slogan, index) =>
                                <div key={index} className={styles.siteInfoItem}>
                                    <span
                                        className={styles.slogan}
                                        dangerouslySetInnerHTML= {{ __html: slogan}}
                                    />
                                </div>
                        )}
                        <div className={styles.siteInfoItem}>
                            <span className={styles.copyright}>
                                © {new Date().getFullYear()} {siteOwner} All Copyright Reserved.
                            </span>
                        </div>
                    </div>
                    <div className={styles.overlay}/>
                </div>
            }}/>
    }
}

export default SiteFooter

const componentQuery = graphql`
    query SiteFooterQuery {
        config: configYaml {
            site {
                owner
                slogans
            }
        }
    }
`;
