import React from 'react'
import styles from './Main.module.scss'

import NavigationBar from './NavigationBar'
import ContentFooter from './ContentFooter'
import SiteFooter from './SiteFooter'
import ContentSeparator from './ContentSeparator'
import TableOfContents from './TableOfContents'
import SEO from './SEO'

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
                        <div className={styles.siteInfo}><SiteFooter/></div>
                    </div>
                </div>
                <div className={styles.primary}>
                    <div className={styles.content}>
                        {headerComponent}
                        {mainComponent}
                        {footerComponent}
                    </div>
                    <ContentSeparator/>
                    <div className={styles.contentFooter}><ContentFooter/></div>
                </div>
            </div>
        )
    }
}

export default Main
