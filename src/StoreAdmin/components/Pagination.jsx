import React from 'react';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const pages = [];

  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i += 1) {
      pages.push(i);
    }
  } else {
    pages.push(1, 2, 3, '...', totalPages);
  }

  return (
    <div className="pagination-bar">
      {pages.map((page, index) => (
        <button
          key={`${page}-${index}`}
          type="button"
          className={`page-btn ${page === currentPage ? 'active' : ''} ${page === '...' ? 'dots' : ''}`}
          onClick={() => typeof page === 'number' && onPageChange(page)}
          disabled={page === '...'}
        >
          {typeof page === 'number' ? String(page).padStart(2, '0') : page}
        </button>
      ))}
      <button
        type="button"
        className="page-btn page-btn-next"
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
      >
        ›
      </button>
    </div>
  );
}
