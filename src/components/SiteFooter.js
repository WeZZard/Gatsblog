import React from 'react'
import { StaticQuery, graphql } from 'gatsby'
import styles from './SiteFooter.module.scss'

class Slogan extends React.Component {
    render() {
        const { message } = this.props;

        return (
            <div className={styles.sloganItem}>
                <span
                    className={styles.slogan}
                    dangerouslySetInnerHTML= {{ __html: message}}
                />
            </div>
        )
    }
}

class SiteFooter extends React.Component {
    render() {
        const customFooterMessages=(
            <StaticQuery
                query={_SiteFooterMessagesQuery}
                render={data => {
                    const slogans = data.site.siteMetadata.slogans;
                    const siteOwner = data.site.siteMetadata.siteOwner;
                    const sloganComponents = slogans.map((footerMessage) => (
                        <Slogan message={footerMessage} />
                    ));

                    return <React.Fragment>
                        {sloganComponents}
                        <div className={styles.copyrightItem}>
                            <span>
                                {`© ${new Date().getFullYear()} ${siteOwner} All Copyright Reserved.`}
                            </span>
                        </div>
                    </React.Fragment>
                }}
            />
        );

        return (
            <div className={styles.siteFooter}>
                {customFooterMessages}
            </div>
        )
    }
}

export default SiteFooter

const _SiteFooterMessagesQuery=graphql`
    query SiteFooterMessagesQuery {
        site {
            siteMetadata {
                siteOwner
                slogans
            }
        }
    }
`;