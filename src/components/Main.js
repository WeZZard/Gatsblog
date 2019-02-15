import React from 'react'
import styles from './Main.module.scss'

import SEO from './SEO'
import NavigationBar from './NavigationBar'
import TableOfContents from './TableOfContents'
import ContentSeparator from './ContentSeparator'
import { graphql, StaticQuery } from 'gatsby';

class Main extends React.Component {
    render() {
        const {
            slug,
            lang,
            title,
            description,
            keywords,
            tableOfContents,
            header,
            main,
            footer
        } = this.props;

        const hasTableOfContents = tableOfContents
            && tableOfContents.items
            && tableOfContents.items.length > 0;

        const tableOfContentsComponent = hasTableOfContents
            ? <div className={styles.tableOfContents}>
                <TableOfContents tableOfContents={tableOfContents}/>
            </div>
            : null;

        const headerComponent = header
            ? <header className={styles.header}>{header}</header>
            : null;

        const mainComponent = main
            ? <main className={styles.main}>{main}</main>
            : null;

        const footerComponent = footer
            ? <footer className={styles.footer}>{footer}</footer>
            : null;

        return (
            <div className={styles.app}>
                <SEO
                    lang={lang}
                    title={title}
                    description={description}
                    keywords={keywords}
                />
                <div className={styles.navigation}>
                    <div className={styles.navigationBar}>
                        <NavigationBar slug={slug}/>
                    </div>
                    {tableOfContentsComponent}
                    <div className={styles.navigationOverlay}>
                        <div className={styles.siteInfo}>
                            <SiteInfo/>
                        </div>
                    </div>
                </div>
                <div className={styles.primary}>
                    <div className={styles.content}>
                        {headerComponent}
                        {mainComponent}
                        {footerComponent}
                    </div>
                    <ContentSeparator/>
                    <div className={styles.pageInfo}>
                        <PageInfo/>
                    </div>
                </div>
            </div>
        )
    }
}

const SiteInfo = () => <StaticQuery
    query={componentQuery}
    render={ data => {
        const {
            configYaml: {
                site: {
                    owner: siteOwner,
                    slogans,
                },
            },
        } = data;

        return <React.Fragment>
            {slogans.map((slogan, index) => <span key={index} className={styles.slogan} dangerouslySetInnerHTML= {{ __html: slogan}}/>)}
            <span key="copyright" className={styles.copyright}>
                © {new Date().getFullYear()} {siteOwner} All Copyright Reserved.
            </span>
        </React.Fragment>
    }}
/>;

const PageInfo = () => <React.Fragment>
    <StaticQuery
        query={componentQuery}
        render={data => {
            const {
                configYaml: {
                    site: {
                        footerMessages,
                    },
                },
            } = data;

            return footerMessages.map((message, index) => (
                <span
                    key={`${index}`}
                    className={styles.pageInfoItem}
                    dangerouslySetInnerHTML= {{ __html: message}}
                />
            ))
        }}
    />
    <span className={styles.pageInfoItem}>
        Built with <a href="https://www.gatsbyjs.org">Gatsby.js</a>.
    </span>
</React.Fragment>;

const componentQuery = graphql`
    query MainQuery {
        configYaml {
            site {
                owner
                slogans
                footerMessages
            }
        }
    }
`;

export default Main