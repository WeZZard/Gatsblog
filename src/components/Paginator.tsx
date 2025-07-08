import React from 'react';
import { Link } from 'gatsby';
import { PaginationInfo } from '../types';
import * as styles from './Paginator.module.scss';

interface PaginatorProps {
  paginationInfo: PaginationInfo;
}

const Paginator: React.FC<PaginatorProps> = ({ paginationInfo }) => {
  const { 
    currentPage, 
    pageCount, 
    hasNextPage, 
    hasPreviousPage, 
    nextPagePath, 
    previousPagePath
  } = paginationInfo;

  const content = `${currentPage} / ${pageCount}`;

  const previousPage = hasPreviousPage && previousPagePath ? (
    <div className={styles.previousPageTitle}>
      <span>
        <Link to={previousPagePath}>
          Previous
        </Link>
      </span>
    </div>
  ) : null;

  const nextPage = hasNextPage && nextPagePath ? (
    <div className={styles.nextPageTitle}>
      <span>
        <Link to={nextPagePath}>
          Next
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
};

export default Paginator;