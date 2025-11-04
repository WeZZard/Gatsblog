import React from 'react';
import PropTypes from 'prop-types';
import Link from './Link';
import styles from './Paginator.module.scss';

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

    const previousPage =
      pageIndex - 1 >= 0 ? (
        <div className={styles.previousPageTitle}>
          <span>
            <Link
              kind={'primary'}
              to={
                pageIndex - 1 === 0
                  ? `${basePath}`
                  : `${basePath}/page-${pageNumber - 1}`
              }
            >
              {previousPageTitle}
            </Link>
          </span>
        </div>
      ) : null;

    const nextPage =
      pageIndex + 1 < pagesCount ? (
        <div className={styles.nextPageTitle}>
          <span>
            <Link kind={'primary'} to={`${basePath}/page-${pageNumber + 1}`}>
              {nextPageTitle}
            </Link>
          </span>
        </div>
      ) : null;

    return (
      <div className={styles.paginator}>
        {previousPage}
        <div className={styles.pageIndicator}>
          <span>{content}</span>
        </div>
        {nextPage}
      </div>
    );
  }
}

Paginator.propTypes = {
  paginationInfo: PropTypes.object,
};

export default Paginator;
