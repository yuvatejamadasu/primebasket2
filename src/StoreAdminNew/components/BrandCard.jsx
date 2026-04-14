import React from 'react';

const BrandCard = ({ brand }) => {
  return (
    <div className="brand-card">
      <div className="brand-card-image">
        <img src={brand.logo} alt={brand.name} />
      </div>
      <div className="brand-card-body">
        <h3 className="brand-card-title">{brand.name}</h3>
        <p className="brand-card-subtitle">{brand.products} items</p>
      </div>
    </div>
  );
};

export default BrandCard;
