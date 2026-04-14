import React from 'react';
export default function ProductCard({ product }) {
  return (
    <article className="bg-[var(--card-bg)] rounded-[var(--radius-sm)] border border-[var(--border)] overflow-hidden transition-all duration-200 cursor-pointer flex flex-col hover:shadow-md hover:-translate-y-0.5">
      <div className="bg-[#f8f8fa] dark:bg-[var(--badge-bg)] flex items-center justify-center h-[160px] p-3 shrink-0">
        <img
          src={product.image}
          alt={product.name}
          className="max-w-full max-h-full w-auto h-auto object-contain block"
          onError={(event) => {
            event.target.src = 'https://placehold.co/320x220?text=Product';
          }}
        />
      </div>
      <div className="p-3 flex-1 flex flex-col gap-1">
        <p className="text-[13px] text-[var(--text-secondary)] font-medium leading-[1.4] line-clamp-2 min-h-[36px]">{product.name}</p>
        <p className="text-[14px] font-bold text-[var(--text-primary)] mt-auto">${product.price.toFixed(2)}</p>
      </div>
    </article>
  );
}
