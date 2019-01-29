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

        const pageNumber = pageIndex + 1;

        const currentPage = `${pageNumber}`;

        const content = `${currentPage} / ${pagesCount}`;

        const previousPage = (pageIndex - 1) >= 0
            ? <div className={styles.previousPageTitle}>
                <Link to={pageIndex - 1 === 0 ? `${basePath}` : `${basePath}/page-${pageNumber - 1}`}>
                    <span>{previousPageTitle}</span>
                </Link>
            </div>
            : null;

        const nextPage = (pageIndex + 1) < pagesCount
            ? <div className={styles.nextPageTitle}>
                <Link to={`${basePath}/page-${pageNumber + 1}`}>
                    <span>{nextPageTitle}</span>
                </Link>
            </div>
            : null;

        return <div className={styles.paginator}>
            {previousPage}
            <div className={styles.pageIndicator}>
                <span>{content}</span>
            </div>
            {nextPage}
        </div>
    }
}

export default Paginator
