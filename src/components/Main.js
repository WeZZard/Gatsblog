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
            ? <React.Fragment>
                <ContentSeparator/>
                <footer className={styles.footer}>{footer}</footer>
            </React.Fragment>
            : null;

        return <div className={styles.app}>
            <SEO
                lang={lang}
                title={title}
                description={description}
                keywords={keywords}
            />
            <div className={styles.navigation}>
                <SiteTitle/>
                <div className={styles.navigationBar}>
                    <NavigationBar slug={slug}/>
                </div>
                {tableOfContentsComponent}
                <SiteInfo/>
                <div className={styles.navigationOverlay}/>
            </div>
            <div className={styles.content}>
                {headerComponent}
                {mainComponent}
                {footerComponent}
                <ContentSeparator/>
                <footer className={styles.footer}><PageInfo/></footer>
            </div>
        </div>
    }
}

const SiteTitle = () => <StaticQuery
    query={componentQuery}
    render={({configYaml: { site: { title }}}) =>
        <div className={styles.siteTitle}>
            <label className={styles.siteTitleLabel}>{title}</label>
        </div>
    }
/>;

const SiteInfo = () => <StaticQuery
    query={componentQuery}
    render={ ({configYaml: { site: { owner, slogans }}}) =>
        <div className={styles.siteInfo}>
            {slogans.map((slogan, index) =>
                <div key={index} className={styles.siteInfoItem}>
                    <span className={styles.slogan} dangerouslySetInnerHTML= {{ __html: slogan}}/>
                </div>
            )}
            <div className={styles.siteInfoItem}>
                <span className={styles.copyright}>
                    © {new Date().getFullYear()} {owner} All Copyright Reserved.
                </span>
            </div>
        </div>
    }
/>;

const PageInfo = () => <div className={styles.pageInfo}>
    <StaticQuery
        query={componentQuery}
        render={({configYaml: { site: { footerMessages }}}) =>
            footerMessages.map((message, index) => (
                <div key={`${index}`} className={styles.pageInfoItem}>
                    <span className={styles.pageInfoContent} dangerouslySetInnerHTML= {{ __html: message}}/>
                </div>
            ))
        }
    />
    <div className={styles.pageInfoItem}>
        <span className={styles.pageInfoContent}>
            Built with <a href="https://www.gatsbyjs.org">Gatsby.js</a>.
        </span>
    </div>
</div>;

const componentQuery = graphql`
    query MainQuery {
        configYaml {
            site {
                title
                owner
                slogans
                footerMessages
            }
        }
    }
`;

export default Main