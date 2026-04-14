import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';
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
    <div className="py-4 px-0">
      <h3 className="text-[18px] font-[800] text-[var(--text-primary)] mb-5">Products by seller</h3>
      <div className="grid grid-cols-2 min-[601px]:grid-cols-3 min-[861px]:grid-cols-4 min-[1101px]:grid-cols-5 min-[1401px]:grid-cols-6 gap-4 mb-8">
        {pageItems.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div className="flex items-center gap-[6px]">
        {getPageNumbers().map((p, i) => (
          <button
            key={i}
            className={`min-w-[38px] h-[38px] rounded-lg border flex items-center justify-center transition-all px-[6px] text-[13px] font-bold
              ${p === currentPage 
                ? 'bg-[var(--primary)] text-white border-[var(--primary)]' 
                : (p === '...' 
                    ? 'border-none bg-none cursor-default text-[var(--text-muted)]' 
                    : 'border-[var(--border)] bg-[var(--card-bg)] text-[var(--text-secondary)] hover:border-[var(--primary)] hover:text-[var(--primary)] hover:bg-[var(--primary-light)]'
                  )
              }`}
            onClick={() => typeof p === 'number' && setCurrentPage(p)}
            disabled={p === '...'}
          >
            {typeof p === 'number' ? String(p).padStart(2, '0') : p}
          </button>
        ))}
        <button
          type="button"
          className="min-w-[38px] h-[38px] rounded-lg border border-[var(--border)] bg-[var(--card-bg)] text-[var(--text-secondary)] flex items-center justify-center transition-all p-0 w-[38px] hover:enabled:border-[var(--primary)] hover:enabled:text-[var(--primary)] hover:enabled:bg-[var(--primary-light)] disabled:opacity-40 disabled:cursor-not-allowed"
          onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
