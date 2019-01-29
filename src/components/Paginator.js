import React from 'react'
import { Link } from 'gatsby'
import styles from './Paginator.module.scss'

class Paginator extends React.Component {
    render() {
        const { paginationInfo } = this.props;

        const {
            basePath,
            previousPageTitle,
            nextPageTitle,
            pageIndex,
            pagesCount,
        } = paginationInfo;

        const currentPage = `${pageIndex + 1}`;

        const content = `${currentPage}/${pagesCount}`;

        const previousPage = (pageIndex - 1) >= 0
            ? <span className={styles.previousPageTitle}>
                <Link to={pageIndex - 1 === 0 ? `${basePath}` : `${basePath}/page-${pageIndex - 1}`}>
                    {previousPageTitle}
                </Link>
            </span>
            : null;

        const nextPage = (pageIndex + 1) < pagesCount
            ? <span className={styles.nextPageTitle}>
                <Link to={`${basePath}/page-${pageIndex + 1}`}>
                    {nextPageTitle}
                </Link>
            </span>
            : null;

        return <div className={styles.paginator}>
            {previousPage}
            <span className={styles.pageIndicator}>
                {content}
            </span>
            {nextPage}
        </div>
    }
}

export default Paginator
