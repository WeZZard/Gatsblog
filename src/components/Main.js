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
            selectedNavigationItem,
            lang,
            pageTitle,
            description,
            keywords,
            tableOfContents,
            children
        } = this.props;

        const tableOfContentsComponents = (tableOfContents && tableOfContents.items && tableOfContents.items.length > 0)
            ? <section className={styles.tableOfContents}>
                <TableOfContents tableOfContents={tableOfContents}/>
            </section>
            : null;

        return (
            <div className={styles.app}>
                <SEO
                    lang={lang}
                    title={pageTitle}
                    description={description}
                    keywords={keywords}
                />
                <section className={styles.navigation}>
                    <section className={styles.navigationBar}>
                        <NavigationBar selectedNavigationItem={selectedNavigationItem}/>

                    </section>
                    {tableOfContentsComponents}
                    <div className={styles.navigationOverlay}>
                        <div className={styles.siteInfo}>
                            <SiteFooter/>
                        </div>
                    </div>
                </section>
                <section className={styles.content}>
                    <main className={styles.main}>
                        {children}
                    </main>
                    <ContentSeparator/>
                    <footer className={styles.footer}>
                        <ContentFooter />
                    </footer>
                </section>
            </div>
        )
    }
}

export default Main
