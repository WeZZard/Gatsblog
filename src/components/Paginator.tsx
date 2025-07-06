import React from 'react';
import { PaginationInfo } from '../types';

interface PaginatorProps {
  paginationInfo: PaginationInfo;
}

const Paginator: React.FC<PaginatorProps> = ({ paginationInfo }) => {
  const { currentPage, pageCount, hasNextPage, hasPreviousPage, nextPagePath, previousPagePath } = paginationInfo;

  return (
    <div className="paginator">
      {hasPreviousPage && previousPagePath && (
        <a href={previousPagePath} className="previous-page">
          Previous
        </a>
      )}
      <span className="page-info">
        Page {currentPage} of {pageCount}
      </span>
      {hasNextPage && nextPagePath && (
        <a href={nextPagePath} className="next-page">
          Next
        </a>
      )}
    </div>
  );
};

export default Paginator;