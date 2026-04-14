import React from 'react';
import './ProductCard.css';

export default function ProductCard({ product }) {
  return (
    <article className="product-card">
      <div className="product-card__image-wrap">
        <img
          src={product.image}
          alt={product.name}
          className="product-card__image"
          onError={(event) => {
            event.target.src = 'https://placehold.co/320x220?text=Product';
          }}
        />
      </div>
      <div className="product-card__content">
        <p className="product-card__name">{product.name}</p>
        <p className="product-card__price">${product.price.toFixed(2)}</p>
      </div>
    </article>
  );
}
