import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';
import './ProductsGrid.css';

const ITEMS_PER_PAGE = 12;
const TOTAL_PAGES = 16;

export default function ProductsGrid({ products }) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil((products.length || 0) / ITEMS_PER_PAGE) || TOTAL_PAGES;
  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const pageItems = (products || []).slice(start, start + ITEMS_PER_PAGE);

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i += 1) pages.push(i);
    } else {
      pages.push(1, 2, 3, '...', totalPages);
    }
    return pages;
  };

  return (
    <div className="products-grid-section">
      <h3 className="products-grid-section__title">Products by seller</h3>
      <div className="products-grid">
        {pageItems.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div className="products-pagination">
        {getPageNumbers().map((p, i) => (
          <button
            key={i}
            className={`products-pagination__btn ${p === currentPage ? 'active' : ''} ${p === '...' ? 'dots' : ''}`}
            onClick={() => typeof p === 'number' && setCurrentPage(p)}
            disabled={p === '...'}
          >
            {typeof p === 'number' ? String(p).padStart(2, '0') : p}
          </button>
        ))}
        <button
          type="button"
          className="products-pagination__btn products-pagination__next"
          onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
